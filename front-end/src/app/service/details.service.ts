import { EstateOfflineError } from './error/estate.offline.error';
import { NotFoundEstateError } from './error/not.found.estate.error';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import { LeaseTerm } from "app/model/lease.term.enum";

@Injectable()
export class DetailsService {

  constructor(private restangular: Restangular) { }

  public getEstate(id): Promise<any> {
    return this.restangular.one('estates').customGET(id, {}, {}).toPromise()
      .then((response) => {
        return this.responseToRealEstate(response);
      },
      (error) => {
        if (error.data && error.data.exception.indexOf('NotFoundEstateException') !== -1) {
          throw new NotFoundEstateError;
        } else if (error.data && error.data.exception.indexOf('EstateOfflineException') !== -1) {
          throw new EstateOfflineError;
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      });
  }

  private responseToRealEstate(estate): any {
    const realEstate = Object.create(null);
    let prop = [];
    estate.properties.forEach((p) => {
      prop.push(p);
    });
    realEstate.id = estate.id;
    realEstate.type = estate.type;
    realEstate.accommodation = estate.accommodation;
    realEstate.allowedHabitants = estate.allowedHabitants;
    realEstate.roomsNumber = estate.roomsNumber;
    realEstate.bedroomsNumber = estate.bedroomsNumber;
    realEstate.bathroomsNumber = estate.bathroomsNumber;
    realEstate.totalArea = estate.totalArea;
    realEstate.livingArea = estate.livingArea;
    realEstate.kitchenArea = estate.kitchenArea;
    realEstate.floor = estate.floor;
    realEstate.floors = estate.floors;
    realEstate.description = estate.description;
    realEstate.shortDescription = estate.shortDescription;
    realEstate.address = estate.address;
    realEstate.latitude = estate.latitude;
    realEstate.longitude = estate.longitude;
    realEstate.estateProperties = prop;
    realEstate.photos = estate.images;
    realEstate.price = estate.price;
    realEstate.depositType = estate.depositType;
    realEstate.utilitiesPaymentType = estate.utilitiesPaymentType;
    realEstate.currency = estate.currencyCode;
    realEstate.status = estate.status;
    realEstate.leaseTerm = LeaseTerm[estate.leaseTerm];
    realEstate.landlord = estate.landlord;
    realEstate.landlord.registrationDate = new Date(estate.landlord.registrationDate);
    realEstate.moderated = estate.moderated;
    realEstate.viewsCounter = estate.viewsCounter;
    return realEstate;
  }


}
