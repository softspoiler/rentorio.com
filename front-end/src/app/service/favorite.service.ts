import { Router } from '@angular/router';
import { IAppState } from './../store/state';
import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { UserStorageService } from './user.storage.service';
@Injectable()
export class FavoriteService {

  constructor(
    private restangular: Restangular,
    private storageService: UserStorageService,
    private ngRedux: NgRedux<IAppState>,
    private router: Router
  ) { }

  public addToFavorite(id: number): Promise<any> {
      return this.restangular.one('/users/current/estates')
        .customPOST({ estateId: id }, `${id}/favorite`, {}, this.storageService.getAuthTokenWithCheck())
        .toPromise()
        .then((response) => {
          return response.favoriteId;
        })
        .catch((error) => {
          if (error.status >= 500) {
            throw new Error('Server error');
          } else {
            return new Promise(null);
          }
        })
  }

  public getUserFavorites(): Promise<any> {
    if (this.ngRedux.getState().session.isAuthenticated) {
      return this.restangular.one('/users/current/estates/favorite')
        .customGET('', {}, this.storageService.getAuthTokenWithCheck())
        .toPromise()
        .then((response) => {
          return response;
        }, (error) => {
          if (error.status >= 500) {
            throw new Error('Server error');
          } else {
            throw new Error('Unknown error');
          }
        });
    } else {
      return new Promise(null);
    }
  }

  public removeFromFavorite(id: number): Promise<any> {
    return this.restangular.one('users/current/estates/favorite', id)
      .customDELETE('', {}, this.storageService.getAuthTokenWithCheck())
      .toPromise()
      .then((response) => {
        return response
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
