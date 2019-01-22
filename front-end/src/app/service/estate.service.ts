import { EstateStatus } from './../model/estate.status.enum';
import { NotFoundEstateError } from './error/not.found.estate.error';
import { Router } from '@angular/router';
import { RealEstate } from './../model/real.estate.model';
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { UserStorageService } from './user.storage.service';
import { LeaseTerm } from './../model/lease.term.enum';

@Injectable()
export class EstateService {
  constructor(
    private restangular: Restangular,
    private router: Router,
    private storageService: UserStorageService
  ) { }

  public getUserEstates(): Promise<RealEstate[]> {
    return this.restangular.one('users/current/estates')
      .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return response.plain();
      }, (error) => {
        console.log(error);
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public getEstate(id: number): Promise<RealEstate> {
    return this.restangular.one('estate').customGET(id, {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return this.setupRealEstateResponse(response);
      }, (error) => {
        if (error.data !== 'undefined' && error.data.exception.indexOf('NotFoundEstateException')) {
          throw new NotFoundEstateError;
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public deleteEstate(id: number): Promise<any> {
    return this.restangular.one('estate').customDELETE(id, {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return response;
      }, (error) => {
        if (error.data !== 'undefined' && error.data.exception.indexOf('NotFoundEstateException')) {
          throw new NotFoundEstateError;
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public updateStatus(status: string, id: number): Promise<any> {
    return this.restangular.one('users/current/estates/')
      .customPUT(JSON.stringify({ status }), id + '/status', id, this.storageService.getAuthTokenWithCheck())
      .toPromise()
      .then((response) => {
        return response;
      }, (error) => {
        if (error.data !== 'undefined' && error.data.exception.indexOf('NotFoundEstateException')) {
          throw new NotFoundEstateError;
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  private setupRealEstateResponse(response: any): RealEstate {
    let realEstate = new RealEstate;
    let prop = new Set;
    response.properties.forEach((p) => {
      prop.add(p.id);
    });
    realEstate.id = response.id;
    realEstate.publicPhoneNumber = response.publicPhoneNumber;
    realEstate.type = response.type;
    realEstate.accommodation = response.accommodation;
    realEstate.allowedHabitants = response.allowedHabitants;
    realEstate.roomsNumber = response.roomsNumber;
    realEstate.bedroomsNumber = response.bedroomsNumber;
    realEstate.bathroomsNumber = response.bathroomsNumber;
    realEstate.totalArea = response.totalArea;
    realEstate.livingArea = response.livingArea;
    realEstate.kitchenArea = response.kitchenArea;
    realEstate.floor = response.floor;
    realEstate.floors = response.floors;
    realEstate.description = response.description;
    realEstate.shortDescription = response.shortDescription;
    realEstate.address = response.address;
    realEstate.latitude = response.latitude;
    realEstate.longitude = response.longitude;
    realEstate.estateProperties = prop;
    realEstate.photos = response.images;
    realEstate.price = response.price;
    realEstate.depositType = response.depositType;
    realEstate.utilitiesPaymentType = response.utilitiesPaymentType;
    realEstate.currency = response.currencyCode;
    realEstate.status = response.status;
    realEstate.leaseTerm = LeaseTerm.LONG;
    realEstate.moderated = response.moderated;
    console.log('Current estate after download and transform:', realEstate);
    return realEstate;
  }

  private realEstateToRequest(estate: RealEstate): any {
    const requestEstate = Object.create(null);
    let prop = [];
    if (estate.estateProperties) {
      estate.estateProperties.forEach((p) => {
        prop.push({ id: p, key: null });
      });
    }

    requestEstate.id = estate.id;
    requestEstate.publicPhoneNumber = estate.publicPhoneNumber;
    requestEstate.type = estate.type;
    requestEstate.accommodation = estate.accommodation;
    requestEstate.allowedHabitants = estate.allowedHabitants;
    requestEstate.roomsNumber = estate.roomsNumber;
    requestEstate.bedroomsNumber = estate.bedroomsNumber;
    requestEstate.bathroomsNumber = estate.bathroomsNumber;
    requestEstate.totalArea = estate.totalArea;
    requestEstate.livingArea = estate.livingArea;
    requestEstate.kitchenArea = estate.kitchenArea;
    requestEstate.floor = estate.floor;
    requestEstate.floors = estate.floors;
    requestEstate.description = estate.description;
    requestEstate.shortDescription = estate.shortDescription;
    requestEstate.address = estate.address;
    requestEstate.latitude = estate.latitude;
    requestEstate.longitude = estate.longitude;
    requestEstate.properties = prop;
    requestEstate.images = estate.photos;
    requestEstate.price = estate.price;
    requestEstate.depositType = estate.depositType;
    requestEstate.utilitiesPaymentType = estate.utilitiesPaymentType;
    requestEstate.currencyCode = estate.currency;
    requestEstate.status = estate.status;
    requestEstate.leaseTerm = LeaseTerm[estate.leaseTerm];
    console.log('Current estate during updating:', requestEstate);
    return requestEstate;
  }

  public createEstate(estate: RealEstate): Promise<any> {
    return this.restangular.all('estate').customPOST(this.realEstateToRequest(estate), '', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return this.setupRealEstateResponse(response);
      }, (error) => {
        console.log(error);
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public updateEstate(id: number, estate: RealEstate): Promise<any> {
    return this.restangular.one('estate', id).customPUT(this.realEstateToRequest(estate), '', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then(() => {
        console.log('estate is updated');
      }, (error) => {
        console.log(error);
        if (error.data !== 'undefined' && error.data.exception.indexOf('NotFoundEstateException')) {
          throw new NotFoundEstateError;
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public getLastAddedEstates(): Promise<any> {
    return this.restangular.one('estates/search/last').customGET('', {}, {}).toPromise()
      .then((response) => {
        return response.plain();
      }, (error) => {
        if (error.data !== 'undefined' && error.data.exception.indexOf('NotFoundEstateException')) {
          throw new NotFoundEstateError;
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public getPublicPhoneNumber(estateId: number): Promise<any> {
    return this.restangular.one('estates').customGET(estateId + '/phonenumber', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return response.plain();
      }, (error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

}