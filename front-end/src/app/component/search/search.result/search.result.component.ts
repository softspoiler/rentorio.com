import { AgmMap } from '@agm/core';
import { UPDATE_SEARCH_TYPE, UPDATE_SEARCH_FILTER } from './../../../store/actions';
import { SearchType } from 'app/model/search.type.enum';
import { SearchFilter } from './../../../model/search.filter.model';
import { ISearch } from './../../../store/search/search.interface';
import { Observable } from 'rxjs/Observable';
import { IAppState } from './../../../store/state';
import { NgRedux, select } from '@angular-redux/store';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, NgZone, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { Sorting } from "app/model/sorting.enum";

@Component({
  selector: 'app-search-result',
  templateUrl: './search.result.component.html',
  styleUrls: ['./search.result.component.css'],
})
export class SearchResultComponent implements OnInit, AfterViewInit {
  @select() public search$: Observable<ISearch>;
  @ViewChild('agmMap') map: AgmMap;
  @ViewChild('resultWrapper') resultWrapper: ElementRef;
  @Output() public geoBoxCoordsChange: EventEmitter<any> = new EventEmitter();
  @Output() public addressChanged: EventEmitter<any> = new EventEmitter;
  @Output() public pageChanged: EventEmitter<any> = new EventEmitter;
  @Input() public showOverlay: Boolean;
  public searchResult: any;
  public searchFilter: SearchFilter;
  public searchType: string;
  public estates: Array<any>;
  public id: number = null;
  public showMap: Boolean = false;
  public toggled: Boolean = false;
  public mapFixed: Boolean = false;
  public mapBottom: Boolean = false;
  public mapTopOffset: String;
  public markerCoords: any = {};
  public _window = window;
  public carouselSetting: Object = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 250,
    interval: 4000,
    point: {
      visible: false,
    },
    custom: 'banner',
    easing: 'cubic-bezier(0,.01,1,.99)'
  };

  @HostListener('window:scroll', []) onWindowScroll() {
    // rw - result wrapper
    this.ngZone.run(() => {
      let rwValue = this.resultWrapper.nativeElement.getBoundingClientRect();
      const rwMinHeight = 800;
      const rwBottomWhiteSpace = 72;
      if (rwValue.top >= 70 && this.mapFixed && !this.mapBottom) {
        this.mapFixed = false;
      } else if (rwValue.top <= 70 && !this.mapFixed && !this.mapBottom && rwValue.height > rwMinHeight) {
        this.mapFixed = true;
      } else if ((rwValue.height + rwValue.top - rwBottomWhiteSpace) <= window.innerHeight && rwValue.height > rwMinHeight) {
        this.mapBottom = true;
        this.mapTopOffset = rwValue.height - window.innerHeight + 'px';
      } else {
        this.mapBottom = false;
      }
    });

  }

  constructor(private ngRedux: NgRedux<IAppState>, private ngZone: NgZone) {
    this.estates = [];
    this.searchResult = this.ngRedux.getState().search.searchResult || null;
    this.searchFilter = this.ngRedux.getState().search.searchFilter;
    this.searchType = SearchType[this.ngRedux.getState().search.searchType];

  }
  public changeSearchType() {
    if (this.searchType === 'GEO_DISTANCE') {
      this.ngRedux.dispatch({ type: UPDATE_SEARCH_TYPE, payload: SearchType.GEO_BOX });
      this.searchType = SearchType[this.ngRedux.getState().search.searchType];
      this.id = null;
    } else {
      this.ngRedux.dispatch({ type: UPDATE_SEARCH_TYPE, payload: SearchType.GEO_DISTANCE });
      this.searchType = SearchType[this.ngRedux.getState().search.searchType];
    }
  }

  public listMouseOverHandler(id) {
    if (SearchType[this.ngRedux.getState().search.searchType] === 'GEO_DISTANCE') {
      this.id = id;
      let estates = this.ngRedux.getState().search.searchResult.estates;
      let i = estates.length;
      while (i--) {
        if (estates[i].id === id) {
          this.markerCoords.latitude = estates[i].geoPoint.lat;
          this.markerCoords.longitude = estates[i].geoPoint.lon;
          break;
        }
      }
    }
  }

  public geoBoxChange() {
    if (SearchType[this.ngRedux.getState().search.searchType] === 'GEO_BOX') {
      this.geoBoxCoordsChange.emit();
    }
  }

  public pageChangedHandler() {
    this.pageChanged.emit();
  }

  public boundsChange(event: any) {
    this.searchFilter.setParam('bottomRightLatitude', event.f.b);
    this.searchFilter.setParam('topLeftLongitude', event.b.b);
    this.searchFilter.setParam('topLeftLatitude', event.f.f);
    this.searchFilter.setParam('bottomRightLongitude', event.b.f);
    this.ngRedux.dispatch({ type: UPDATE_SEARCH_FILTER, payload: this.searchFilter });
  }

  public toggleMap() {
    this.toggled = true;
    this.id = null;
    this.showMap = !this.showMap;
    this.ngZone.run(() => {
      this.map.triggerResize();
    });
  }

  public addressChangedHandler(event) {
    this.addressChanged.emit(event);
  }

  public setSorting(value) {
    console.log(Sorting[value]);
    this.searchFilter.setParam('sorting', Sorting[Sorting[value]]);
    this.ngRedux.dispatch({ type: UPDATE_SEARCH_FILTER, payload: this.searchFilter });
    this.addressChanged.emit({ sorting: true });
  }

  public trackByFunc(index, estate) {
    return estate.id;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onWindowScroll();
    }, 0);
  }

  setupMarkerLabel(price, priceType) {
    let _price;
    price = '' + price;
    if (price.length >= 7) {
      price = price.slice(0, 6) + '..';
    }
    switch (priceType) {
      case 'UAH': {
        _price = price + '₴'
        break;
      }
      case 'USD': {
        _price = price + '$'
        break;
      }
      case 'EUR': {
        _price = price + '€';
        break;
      }
      default: {
        _price = price + '';
      }
    }
    return _price;
  }
}
