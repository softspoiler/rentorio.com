import { ISearch } from './../../../../store/search/search.interface';
import { Observable } from 'rxjs/Observable';
import { SearchFilter } from './../../../../model/search.filter.model';
import { SearchService } from './../../../../service/search.service';
import { SearchType } from 'app/model/search.type.enum';
import { UPDATE_ADDRESS_LINE, UPDATE_SEARCH_RESULT, UPDATE_SEARCH_TYPE } from './../../../../store/actions';
import { IAppState } from './../../../../store/state';
import { NgRedux, select } from '@angular-redux/store';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { Component, OnInit, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
declare var google: any;

@Component({
  selector: 'search-input',
  templateUrl: './search.input.component.html',
  styleUrls: ['./search.input.component.css'],
})
export class SearchInputComponent implements OnInit {
  @ViewChild('searchInput')
  public searchElementRef: ElementRef;
  public errorName: String = '';
  @Output() public geoLocationChange: EventEmitter<any> = new EventEmitter();
  @Input() firstRequest: Boolean;
  @Input() changedAddress: String;
  @select() public search$: Observable<ISearch>;
  public searchType: string;
  public searchFilter: SearchFilter;
  public addressLine: String;
  public showLoading:Boolean;

  constructor(
    private mapApiLoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router,
    private ngRedux: NgRedux<IAppState>,
    private searchService: SearchService,
  ) {
    this.searchType = SearchType[this.ngRedux.getState().search.searchType];
    this.searchFilter = this.ngRedux.getState().search.searchFilter;
    this.addressLine = this.ngRedux.getState().search.addressLine;
  }

  ngOnInit() {
    this.mapApiLoader.load().then(() => {
      let autocomplete: google.maps.places.Autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['geocode'],
        componentRestrictions: { country: 'ua' },
      });
      /* autocomplete.addListener('place_changed', () => {
         console.log(this.searchElementRef.nativeElement.value);
         this.search(autocomplete.getPlace().formatted_address);
       });*/
    });
  }

  public search(address): void {
    this.ngRedux.dispatch({ type: UPDATE_SEARCH_TYPE, payload: SearchType.GEO_DISTANCE });
    this.errorName = '';
    if (address) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (res) => {
        this.showLoading = this.firstRequest;
        if (res !== null && res[0] !== undefined && res.length !== 0) {
          this.ngRedux.dispatch({
            type: UPDATE_ADDRESS_LINE,
            payload: {
              'latitude': res[0].geometry.location.lat(),
              'longitude': res[0].geometry.location.lng(),
              'addressLine': res[0].formatted_address
            }
          });
          if (this.firstRequest) {
            this.searchService.search(this.searchType, this.searchFilter.getQueryParams())
              .then((response) => {
                this.showLoading = false;
                this.ngRedux.dispatch({ type: UPDATE_SEARCH_RESULT, payload: response });
                this.searchFilter.setParam('pageNumber', response.pageRequest.page);
                this.searchFilter.setParam('totalPages', response.pageRequest.totalPages);
                this.ngZone.run(() => {
                  this.router.navigateByUrl('/search');
                })

              })
              .catch((error) => {
                this.showLoading = false;
                this.errorName = 'geocoder';
              });
          } else {
            this.showLoading = false;
            this.geoLocationChange.emit('geolocation change');
          }
        } else {
          this.ngZone.run(() => {
            this.showLoading = false;
            this.errorName = 'geocoder';
          });
        }
      });
    } else {
      this.errorName = 'required';
    }
  }

  public onChange() {
    let address;
    setTimeout(() => {
      address = this.searchElementRef.nativeElement.value;
      this.search(address);
    }, 0);
  }
}