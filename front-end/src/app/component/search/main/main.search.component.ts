import { SearchInputComponent } from './../../home/shared/search.input/search.input.component';
import { Observable } from 'rxjs/Observable';
import { Component, OnDestroy, ViewChild, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { EstateType } from './../../../model/estate.type.enum';
import { ISearch } from './../../../store/search/search.interface';
import { IAppState } from './../../../store/state';
import { NgRedux, select } from '@angular-redux/store';
import { SearchFilter } from './../../../model/search.filter.model';
import { SearchType } from 'app/model/search.type.enum';
import { UPDATE_SEARCH_FILTER, UPDATE_SEARCH_RESULT } from './../../../store/actions';
import { SearchService } from './../../../service/search.service';
import { MandatoryGeoLocationError } from './../../../service/error/mandatory.geo.location.error';

@Component({
  selector: 'app-main',
  templateUrl: './main.search.component.html',
  styleUrls: ['./main.search.component.css']
})
export class MainSearchComponent implements OnDestroy {
  public searchType: string;
  public searchFilter: SearchFilter;
  public searchResult: any;
  public latitude: number;
  public longitude: number;
  public distance: number;
  public distanceUnit: string;
  public roomsNumber: number;
  public multiRoomsNumber: number[] = [];
  public totalAreaFrom: number;
  public totalAreaTo: number;
  public accommodations: Set<string>;
  public priceMin: number;
  public priceMax: number;
  public properties: Set<any>;
  public estateTypes: Set<any>;
  public topLeftLatitude: number;
  public topLeftLongitude: number;
  public bottomRightLatitude: number;
  public bottomRightLongitude: number;
  public error = false;
  public reload: Boolean = false;
  public selectId: Number;
  public firstRequest: Boolean;
  @select() public search$: Observable<ISearch>;
  @ViewChild(SearchInputComponent) SearchInputComponent: SearchInputComponent;
  @ViewChild('modal') public modal: ElementRef;
  @ViewChild('filterWrapper') public filterWrapper: ElementRef;


  constructor(
    private ngRedux: NgRedux<IAppState>,
    private searchService: SearchService,
    private changeRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    this.searchType = SearchType[this.ngRedux.getState().search.searchType];
    this.searchFilter = this.ngRedux.getState().search.searchFilter;
    this.searchResult = this.ngRedux.getState().search.searchResult;
    this.latitude = this.searchFilter.getParamValue('latitude') || null;
    this.longitude = this.searchFilter.getParamValue('longitude') || null;
    this.distance = this.searchFilter.getParamValue('distance') || null;
    this.distanceUnit = this.searchFilter.getParamValue('distanceUnit') || null;
    this.roomsNumber = this.searchFilter.getParamValue('roomsNumber') || null;
    this.totalAreaFrom = this.searchFilter.getParamValue('totalAreaFrom') || null;
    this.totalAreaTo = this.searchFilter.getParamValue('totalAreaTo') || null;
    this.accommodations = this.searchFilter.getParamValue('accommodations') || new Set();
    this.priceMin = this.searchFilter.getParamValue('priceMin') || null;
    this.priceMax = this.searchFilter.getParamValue('priceMax') || null;
    this.properties = this.searchFilter.getParamValue('properties') || new Set();
    this.estateTypes = this.searchFilter.getParamValue('estateTypes') || new Set();
    this.topLeftLatitude = this.searchFilter.getParamValue('topLeftLatitude') || null;
    this.topLeftLongitude = this.searchFilter.getParamValue('topLeftLongitude') || null;
    this.bottomRightLatitude = this.searchFilter.getParamValue('bottomRightLatitude') || null;
    this.bottomRightLongitude = this.searchFilter.getParamValue('bottomRightLongitude') || null;
  }

  ngOnDestroy() {
    //this.searchFilter.setParam('pageNumber',0);
  }

  public updateSearchInfo() {
    this.ngRedux.dispatch({ type: UPDATE_SEARCH_FILTER, payload: this.searchFilter });
    if ((this.searchType === 'GEO_DISTANCE') && (!this.searchFilter.getParamValue('latitude') || !this.searchFilter.getParamValue('longitude') || !this.distance || !this.distanceUnit)) {
      this.error = true;
    }
    if ((this.searchType === 'GEO_BOX') && (!this.searchFilter.getParamValue('latitude') || !this.searchFilter.getParamValue('longitude') || !this.bottomRightLatitude || !this.bottomRightLongitude)) {
      this.error = true;
    }
  }

  public geoLocationChangeHandler(): void {
    let propertyFacet = [];
    let estateTypeFacet = [];
    if (!this.firstRequest) {
      this.searchService.search(
        this.searchType,
        {
          'countryCode': this.searchFilter.getParamValue('countryCode'),
          'leaseTerm': this.searchFilter.getParamValue('leaseTerm'),
          'distance': this.searchFilter.getParamValue('distance'),
          'distanceUnit': this.searchFilter.getParamValue('distanceUnit'),
          'latitude': this.searchFilter.getParamValue('latitude'),
          'longitude': this.searchFilter.getParamValue('longitude'),
        })
        .then((res) => {
          propertyFacet = res.propertyFacet;
          estateTypeFacet = res.estateTypeFacet;
          this.properties.forEach((value) => {
            let a = false;
            for (let i = 0; i < propertyFacet.length; i++) {
              if (propertyFacet[i].term === value) {
                a = true;
              }
            }
            if (!a) {
              this.properties.delete(value);
            }
          });
          this.firstRequest = true;
          this.searchFilter.setParam('properties', this.properties);
          this.error = false;
          this.updateSearchInfo();
          this.doRequest('normal');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.resetCurrentPage();
      this.updateSearchInfo();
      this.doRequest('normal');
    }
  }

  public geoBoxChangeHandler() {
    this.doRequest('normal');
  }

  public doRequest(type: string): void {
    if (this.error === false) {
      if (type === 'normal') {
        this.reload = true;
        this.searchService.search(SearchType[this.ngRedux.getState().search.searchType], this.searchFilter.getQueryParams())
          .then((res) => {
            this.ngRedux.dispatch({ type: UPDATE_SEARCH_RESULT, payload: res });
            console.log('-------SearchResult-------');
            console.log(res);
            console.log('-----------------------');
            this.searchFilter.setParam('pageNumber', res.pageRequest.page);
            this.searchFilter.setParam('totalPages', res.pageRequest.totalPages);
            this.reload = false;
          })
          .catch((err) => {
            this.reload = false;
            console.log(err);
          });
      } else if (type === 'tmp') {
        this.searchService.search(this.searchType, this.searchFilter.getQueryParams())
          .then((res) => {
            let searchResult = this.ngRedux.getState().search.searchResult;
            searchResult.estateTypeFacet = res.estateTypeFacet;
            searchResult.propertyFacet = res.propertyFacet;
            this.ngRedux.dispatch({ type: UPDATE_SEARCH_RESULT, payload: searchResult });
          })
          .catch((err) => {
            if (err instanceof MandatoryGeoLocationError) {
              this.error = true;
            } else {
              console.log(err);
            }
          });
      }
    }
  }

  public changeRoomsNumber(value: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('ChangeRoomNumber triggered');
    console.log(event);
    if (value === null) {
      this.searchFilter.setParam('roomsNumber', value);
      this.searchFilter.removeParam('multiRoomsNumber');
      this.multiRoomsNumber = [];
    } else if (value == 5) {
      this.searchFilter.setParam('roomsNumber', value);
      this.searchFilter.removeParam('multiRoomsNumber');
      this.multiRoomsNumber = [];
    } else if (this.multiRoomsNumber.length === 0) {
      this.searchFilter.removeParam('multiRoomsNumber');
      this.multiRoomsNumber.push(value);
      this.searchFilter.setParam('roomsNumber', value);
    } else {
      if (this.multiRoomsNumber.every((elem: any) => { return (elem !== value); })) {
        this.multiRoomsNumber.push(value);
        this.searchFilter.removeParam('multiRoomsNumber');
        this.searchFilter.setParam('multiRoomsNumber', this.multiRoomsNumber.join());
        this.searchFilter.removeParam('roomsNumber');
      } else {
        this.multiRoomsNumber = this.multiRoomsNumber.filter((elem) => { return elem !== value; });
        if (this.multiRoomsNumber.length < 1) {
          this.searchFilter.setParam('roomsNumber', value);
          this.roomsNumber = this.searchFilter.getParamValue('roomsNumber');
          this.searchFilter.removeParam('multiRoomsNumber');
          this.multiRoomsNumber = [];
        } else {
          this.searchFilter.setParam('multiRoomsNumber', this.multiRoomsNumber.join());
        }
      }
    }
    if (this.roomsNumber === value && this.multiRoomsNumber.length === 0) {
      this.searchFilter.setParam('roomsNumber', null);
    }
    this.resetCurrentPage();
    this.updateSearchInfo();
    this.doRequest('normal');

  }

  public changeTotalAreaFrom(value: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.searchFilter.setParam('totalAreaFrom', value);
    if (value >= this.totalAreaTo) {
      this.searchFilter.removeParam('totalAreaTo');
    }
    this.resetCurrentPage();
    this.updateSearchInfo();
    this.doRequest('normal');

  }

  public changeTotalAreaTo(value: number): void {
    this.searchFilter.setParam('totalAreaTo', value);
    if (this.totalAreaFrom >= value) {
      this.searchFilter.removeParam('totalAreaTo');
    }
    this.resetCurrentPage();
    this.updateSearchInfo();
    this.doRequest('normal');
  }

  public changePriceMin(value: number): void {
    this.searchFilter.setParam('priceMin', value);
    if (value >= this.searchFilter.getParamValue('priceMax')) {
      this.searchFilter.removeParam('priceMax');
    }
    this.resetCurrentPage();
    this.updateSearchInfo();
    this.doRequest('normal');
  }

  public changePriceMax(value: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.searchFilter.setParam('priceMax', value);
    if (this.searchFilter.getParamValue('priceMin') >= value) {
      this.searchFilter.removeParam('priceMin');
    }
    this.resetCurrentPage();
    this.updateSearchInfo();
    this.doRequest('normal');
  }

  public checked(value: any, set: Set<any>): boolean {
    if (set === null) { return; }
    return set.has(value);
  }

  public check(value: any, set: Set<any>): void {
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
      if (set === this.properties) {
        this.searchFilter.setParam('properties', this.properties);
      }
      if (set === this.estateTypes) {
        this.searchFilter.setParam('estateTypes', this.estateTypes);
      }
      if (set === this.accommodations) {
        this.searchFilter.setParam('accommodations', this.accommodations);
      }

    }
    this.updateSearchInfo();
    this.doRequest('tmp');
  }

  public clearFilters() {
    this.searchFilter.removeParam('roomsNumber');
    this.searchFilter.removeParam('multiRoomsNumber');
    this.multiRoomsNumber = [];
    this.searchFilter.removeParam('totalAreaFrom');
    this.searchFilter.removeParam('totalAreaTo');
    this.searchFilter.removeParam('priceMin');
    this.searchFilter.removeParam('priceMax');
    this.searchFilter.removeParam('accommodations');
    this.searchFilter.removeParam('properties');
    this.searchFilter.removeParam('estateTypes');
    this.properties = new Set();
    this.estateTypes = new Set();
    this.accommodations = new Set();
    this.resetCurrentPage();
    this.updateSearchInfo();
    this.doRequest('normal');
  }

  public applyFilters() {
    this.ngRedux.dispatch({ type: UPDATE_SEARCH_RESULT, payload: this.properties });
    this.resetCurrentPage();
    this.doRequest('normal');
  }

  public showFiltersModal() {
    this.renderer.addClass(this.modal.nativeElement, 'show-modal');
    this.renderer.addClass(this.modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  public hideFiltersModal() {
    this.renderer.removeClass(this.modal.nativeElement, 'show-modal');
    this.renderer.removeClass(this.modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  public removeFileterElement(value: string, set: Set<any>) {
    set.delete(value);
    this.doRequest('normal');
  }

  public addressChangeHandler(event) {
    this.resetCurrentPage();
    if (event.sorting) {
      this.doRequest('normal');
    } else {
      this.SearchInputComponent.search(event.address);
    }
  }

  public openCustomSelect(event, selectId) {
    if (selectId === this.selectId) {
      this.selectId = 0;
    } else {
      this.selectId = selectId;
    }
    this.changeRef.detectChanges();
  }

  public onClickedOutside(e: Event) {
    if (this.selectId !== 0) {
      this.selectId = 0;
      this.changeRef.detectChanges();
    } else {
      return;
    }
  }

  public resetCurrentPage() {
    this.searchFilter.setParam('pageNumber', 0);
  }

  public scrollAfterPageChange() {
    window.scrollTo(0, this.filterWrapper.nativeElement.clientHeight);
  }
}
