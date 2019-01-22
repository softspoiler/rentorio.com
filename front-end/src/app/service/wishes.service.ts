import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import { MandatoryWishFieldsError } from 'app/service/error/mandatory.wish.fields.error';
import { WishMaximumLimitError } from 'app/service/error/wish.maximum.limit.error';

@Injectable()
export class WishesService {

    constructor(private restangular: Restangular) { }

    public createNewWish(wish: Wish, contextToken?: string): Promise<any> {
        let url: string = 'wishes';
        if (contextToken) {
            url = contextToken + '/' + url;
        }
        return this.restangular.one(url).customPOST(wish, '', {}, {})
            .toPromise()
            .then((response) => {
                return response.plain();
            }, (error) => {
                if (error.data !== 'undefined') {
                    if (error.data.exception.indexOf('MandatoryWishFieldsException') !== -1) {
                        throw new MandatoryWishFieldsError;
                    } else if (error.data.exception.indexOf('WishMaximumLimitException') !== -1) {
                        throw new WishMaximumLimitError
                    } else if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            });
    }

    public getWishes(token: string): Promise<Wish[]> {
        return this.restangular.one(token + '/wishes').customGET('', {}, {})
            .toPromise()
            .then((response) => {
                return response.plain();
            }, (error) => {
                if (error.data !== 'undefined') {
                    if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            });
    }

    public deleteWish(token: string, id: number): Promise<any> {
        return this.restangular.one(token + '/wishes').customDELETE(id, {}, {})
            .toPromise()
            .then((response) => {
                return response;
            }, (error) => {
                if (error.data !== 'undefined') {
                    if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            });
    }
}

export class Wish {
    id?: number;
    rentFor: string;
    accommodations: string;
    estateTypes: string;
    multiRoomsNumber: string;
    priceMin: number;
    priceMax: number;
    expiration: string;
    messengerType: string;
    latitude: number;
    longitude: number;
    searchRadius: number;
    recaptchaResponse: string;
    agreedTermOfUse: boolean;
}