import { RealEstate } from './../../../../model/real.estate.model';
import { Address } from './../../../../model/address.model';
import { UPDATE_REAL_ESTATE } from './../../../../store/actions';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { IEstate } from './../../../../store/estate/estate.interface';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-location',
  templateUrl: './estate.location.component.html',
  styleUrls: ['./estate.location.component.css', '../common.css'],
})
export class EstateLocationComponent implements OnInit {
  public realEstate: RealEstate;
  public latitude: number;
  public longitude: number;
  public mapLatitude: number;
  public mapLongitude: number;
  public zoom: Number = 17;
  public search: HTMLInputElement;
  public place: String;
  public address: String;
  public defaultCoord: any = {
    lat: 50.450788801336145,
    long: 30.521750883341735
  }
  // public showMap: Boolean = false;
  public geocoderHasError: Boolean;
  public form: FormGroup;
  public cityInputValue: String;
  public districtInputValue: String;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  @select() public estate$: Observable<IEstate>;

  constructor(
    private mapApiLoader: MapsAPILoader,
    private fb: FormBuilder,
    private ngRedux: NgRedux<IAppState>,
    private dataChangesService: EstateDataChangesService
  ) {
    this.realEstate = this.ngRedux.getState().estate.realEstate;
    if (this.realEstate.address == null) {
      this.realEstate.address = new Address();
    }
    this.realEstate.address.countryCode = 'UA';
    this.form = this.fb.group({
      addressLine1: [this.realEstate.address.addressLine1],
      city: [this.realEstate.address.city],
      district: [this.realEstate.address.district]
    });
    this.latitude = this.realEstate.latitude || null;
    this.longitude = this.realEstate.longitude || null;
    this.mapLatitude = this.latitude;
    this.mapLongitude = this.longitude;
    if (navigator) {
      if (this.ngRedux.getState().estate.isNew && !this.realEstate.latitude && !this.realEstate.longitude) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.markerChangeEventHandler(pos, true);
        });
      }
    }
  }
  ngOnInit() {
    this.mapApiLoader.load().then(() => {
      const autocomplete: google.maps.places.Autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address'],
        componentRestrictions: { country: 'ua' },
      });
      // if user clicked on google api places items
      autocomplete.addListener('place_changed', () => {
        const autocompletePlaces = autocomplete.getPlace();
        console.log(autocompletePlaces);
        this.place = autocompletePlaces.formatted_address;
        this.form.value.addressLine1 = this.place;
        const places = autocompletePlaces.address_components;
        // setup city and district value
        for (let i = 0; i < places.length; i++) {
          switch (places[i].types[0]) {
            case 'locality': {
              this.form.value.city = places[i].short_name;
              break;
            }
            case 'administrative_area_level_1': {
              this.form.value.district = places[i].short_name;
              break;
            }
            default: continue;
          }
        }
        // TODO: Maybe better way use @select() by Redux?
        // this.ngZone.run(() => {
        //   this.cityInputValue = this.form.value.city;
        //   this.districtInputValue = this.form.value.district;
        // });
        this.saveAddress();
      });
    });
  }

  public markerChangeEventHandler(event: any, isGeolocation?: boolean): void {
    console.log(event);
    if (!isGeolocation) {
      this.latitude = event['coords'].lat;
      this.longitude = event['coords'].lng;
    } else {
      this.latitude = event['coords'].latitude;
      this.longitude = event['coords'].longitude;
      this.mapLatitude = this.latitude;
      this.mapLongitude = this.longitude;
    }
    this.realEstate.latitude = this.latitude;
    this.realEstate.longitude = this.longitude;

    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'location': { lat: this.latitude, lng: this.longitude } }, (results) => {
      console.log(results);
      if (results && results.length !== 0) {
        this.place = results[0].formatted_address;
        this.form.value.addressLine1 = this.place;
        const places = results[0].address_components;
        // setup city and district value
        let arr: string[] = [];
        for (let i = 0; i < places.length; i++) {
          switch (places[i].types[0]) {
            case 'route': {
              arr.push(places[i].long_name);
              break;
            }
            case 'locality': {
              arr.push(places[i].long_name);
              this.form.value.city = places[i].short_name;
              break;
            }
            case 'administrative_area_level_1': {
              arr.push(places[i].long_name);
              this.form.value.district = places[i].short_name;
              break;
            }
            default: continue;
          }
        }
        this.realEstate.address.addressLine2 = arr.reverse().join(',');
        // this.ngZone.run(() => {
        //   this.cityInputValue = this.form.value.city;
        //   this.districtInputValue = this.form.value.district;
        // });
        this.update();
      }
    })
  }

  public saveAddress(): void {
    this.geocoderHasError = false;
    if (!this.place) {
      this.address = this.searchElementRef.nativeElement.value;
    } else {
      this.address = this.place;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': this.address }, (data) => {
      if (data[0] !== undefined && data[0].length !== 0) {
        this.latitude = data[0].geometry.location.lat();
        this.longitude = data[0].geometry.location.lng();
        this.realEstate.latitude = this.latitude;
        this.realEstate.longitude = this.longitude;
        let arr: string[] = [];
        for (let i = 0; i < data[0].address_components.length; i++) {
          switch (data[0].address_components[i].types[0]) {
            case 'route': {
              arr.push(data[0].address_components[i].long_name);
              break;
            }
            case 'locality': {
              arr.push(data[0].address_components[i].long_name);
              break;
            }
            case 'administrative_area_level_1': {
              arr.push(data[0].address_components[i].long_name);
              break;
            }
            default: continue;
          }
        }
        this.realEstate.address.addressLine2 = arr.reverse().join(',');

      } else {
        this.geocoderHasError = true;
      }
      if (!this.geocoderHasError) {
        this.place = '';

        this.update();
      }
    });
  }

  public update(): void {
    this.realEstate.address.addressLine1 = this.form.value.addressLine1;
    this.realEstate.address.countryCode = 'UA';
    this.realEstate.address.city = this.form.value.city;
    this.realEstate.address.district = this.form.value.district;
    this.ngRedux.dispatch({ type: UPDATE_REAL_ESTATE, payload: this.realEstate });
    console.log('Redux state after update:');
    console.log('=============================');
    console.log(this.ngRedux.getState().estate.realEstate);
    console.log('=============================');
    this.isDataChanged(true);
  }

  public isDataChanged(changed: boolean) {
    this.dataChangesService.emitChange(changed);
  }
}
