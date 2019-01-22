import { UserActionService } from './../../../service/user.action.service';
import { Router } from '@angular/router';
import { EDIT_REAL_ESTATE } from './../../../store/actions';
import { IAppState } from './../../../store/state';
import { DetailsService } from './../../../service/details.service';
import { FavoriteService } from './../../../service/favorite.service';
import { ISearch } from './../../../store/search/search.interface';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Component, OnInit, Output, EventEmitter, NgZone, Input } from '@angular/core';
import { UserStorageService } from './../../../service/user.storage.service';
import { SearchFilter } from './../../../model/search.filter.model';
import { UPDATE_SEARCH_RESULT } from './../../../store/actions';

@Component({
  selector: 'app-result-list',
  templateUrl: './result.list.component.html',
  styleUrls: ['./result.list.component.css']
})
export class ResultListComponent implements OnInit {
  @select() public search$: Observable<ISearch>;
  @Output() public listMouseover: EventEmitter<any> = new EventEmitter;
  @Output() public addressChanged: EventEmitter<any> = new EventEmitter;
  @Output() public pageChanged: EventEmitter<any> = new EventEmitter;
  @Input() isFavoriteList: Boolean;
  public favoriteList: any = [];
  public currentPage: Number;
  public estates: Array<Object>;
  public searchFilter: SearchFilter;
  public showFavoriteLoading: Boolean;
  public carouselSetting: Object = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 250,
    interval: 4000,
    point: {
      visible: false,
    },
    touch: true,
    custom: 'banner',
    easing: 'cubic-bezier(0,.01,1,.99)'
  };
  public hoverTimeout;

  constructor(
    private ngZone: NgZone,
    private favoriteService: FavoriteService,
    private detailsService: DetailsService,
    private ngRedux: NgRedux<IAppState>,
    private router: Router,
    private storageService: UserStorageService,
    private userActionService: UserActionService
  ) {
    this.getUserFavorites();
    this.searchFilter = this.ngRedux.getState().search.searchFilter;
  }

  public mouseOverEventHandler(id) {
    this.hoverTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.listMouseover.emit(id);
      });
    }, 150)
  }

  public mouseOutEventHandler() {
    clearTimeout(this.hoverTimeout);
  }

  public changeAddress(address) {
    this.addressChanged.emit({ address });
  }

  public pageChangeHandler(event) {
    this.searchFilter.setParam('pageNumber', event - 1)
    this.pageChanged.emit();
  }

  public addToFavorite(id: number): void {
    let added = false;
    let currentId = null;
    this.favoriteList.forEach((obj) => {
      if (obj.realEstate.id === id) {
        currentId = obj.id;
        added = true;
      }
    });
    if (added) {
      this.favoriteList = this.favoriteList.filter((elem) => {
        return elem.id !== currentId;
      });
      this.favoriteService.removeFromFavorite(currentId)
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.favoriteService.addToFavorite(id)
        .then((res) => {
          this.favoriteList.push({ id: res, realEstate: { id } });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public getUserFavorites() {
    this.showFavoriteLoading = true;
    this.favoriteService.getUserFavorites()
      .then((res) => {
        this.favoriteList = res;
        this.showFavoriteLoading = false;
        console.log(res);
      })
      .catch((err) => {
        this.showFavoriteLoading = false;
        console.log(err);
      });
  }

  public removeFromFavorite(id: number) {
    this.favoriteService.removeFromFavorite(id)
      .then((res) => {
        this.favoriteList = this.favoriteList.filter((elem) => {
          return elem.id !== id;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public isAddedToFavorite(id) {
    let isAdded = false;
    this.favoriteList.forEach((obj) => {
      if (obj.realEstate.id === id) {
        isAdded = true;
      }
    });
    return isAdded;
  }

  public scrollTopAfterFavoritePageChange() {
    window.scrollTo(0, 0);
  }

  public markAsWatched(estateId: number): void {
    let watchedList = this.storageService.checkWatchedList() ? new Set(this.storageService.getWatchedList()) : new Set();
    let date = new Date();
    const user = this.ngRedux.getState().session.currentUser;
    if (user) {
      if (watchedList.size) {
        watchedList.forEach((item: { id: number, date: Date, user: number }) => {
          if (item.id === estateId && item.user === user.id) {
            item.date = date;
          }
        });
      }
      watchedList.add({ id: estateId, date: date, user: user.id });
      let arr = [];
      watchedList.forEach((item) => {
        arr.push(item);
      });
      this.storageService.setWatchedList(arr);
      console.log(this.ngRedux.getState().search.searchResult);
      let res = this.ngRedux.getState().search.searchResult;

      res.estates.forEach((estate) => {
        console.log(estateId);
        if (estate.id === estateId) {
          estate.isWatched = true;
        }
      });
      this.ngRedux.dispatch({ type: UPDATE_SEARCH_RESULT, payload: res });
    }

  }

  public sendAction(id) {
    this.userActionService.sendUserAction({ 'details': id });
  }

  ngOnInit() {
  }

}
