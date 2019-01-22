import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { SearchFilter } from './../model/search.filter.model';
import { SearchType } from './../model/search.type.enum';
import { MandatoryGeoLocationError } from './../service/error/mandatory.geo.location.error';
import { UserStorageService } from './user.storage.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../store/state';

@Injectable()
export class SearchService {

  constructor(
    private restangular: Restangular,
    private storageService: UserStorageService,
    private ngRedux: NgRedux<IAppState>
) { }

public search(searchType: string, params: Object): any {
      let path: string;
      if ( searchType === 'GEO_DISTANCE') {
        path = 'estates/search/geo/distance';
      } else {
        path = 'estates/search/geo/box';
      }

      return this.restangular.all(path)
                .customGET('', params, {}).toPromise()
                .then((response) => {
                    console.log(response.plain());
                    let res = response.plain();
                    console.log(this.ngRedux.getState().session.currentUser);
                    const user = this.ngRedux.getState().session.currentUser;
        console.log(`store ${this.storageService.checkWatchedList()}`);
                    if (res && res.estates && this.storageService.checkWatchedList() && user) {
                        let watchedList = new Set(this.storageService.getWatchedList());
                        let arr = [];
                        
                        res.estates.forEach((estate) => {
                            watchedList.forEach((item: {id: number, date: Date, user: number}) => {
                                if (item.id === estate.id && item.user === user.id) {
                                    if (+new Date() - (+new Date(item.date)) < 2592000000 ) {
                                        estate.isWatched = true;
                                    } else {
                                        watchedList.delete(item);
                                        watchedList.forEach((item) => {
                                        arr.push(item);
                                    });
                                       this.storageService.setWatchedList(arr);
                                    }
                                }
                            });
                        });
                    }
                    return res;
                }, (error) => {
                    console.log(JSON.stringify(error));
                     if (error.data !== 'undefined' && error.data.exception.indexOf('MandatoryGeoLocationException') !== -1) {
                    throw new MandatoryGeoLocationError;
                    } else if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                });
           }

}
