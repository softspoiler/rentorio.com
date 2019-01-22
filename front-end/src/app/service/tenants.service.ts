import { UserStorageService } from './user.storage.service';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';

@Injectable()
export class TenantsService {

    constructor(
        private restangular: Restangular,
        private storageService: UserStorageService
    ) { }

    public getTenantsWishes(params): Promise<WishSearchResponse> {
        return this.restangular.one('wishes/search/geo/box').customGET('', params, {})
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

    public offerEstataeForWish(wishId: number, estateId: number, offeredPrice: string): Promise<WishSearchResponse> {
        let params;
        if (offeredPrice) {
            params = { offeredPrice }
        }
        return this.restangular.one(`wishes/${wishId}/offer/${estateId}`).customGET('', params, this.storageService.getAuthTokenWithCheck())
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

export class TenantWish {
    id?: number;
    rentFor?: string;
    accommodations?: string;
    estateTypes?: string;
    price?: number;
    latitude: number;
    longitude: number;
    searchRadius?: number;
}

export class WishSearchResponse {
    wishes: TenantWish[];
    pageRequestDto: any;
    totalWishes: number;
}
