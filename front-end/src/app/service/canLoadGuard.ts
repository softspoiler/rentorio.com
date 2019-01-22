import { NoCurrentUserError } from './error/no.current.user.error';
import { Restangular } from 'ngx-restangular';
import { UserStorageService } from './user.storage.service';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';

@Injectable()
export class CanLoadGuard implements CanLoad {
    constructor(private storageService: UserStorageService, private router: Router, private restangular: Restangular) { }

    canLoad(route: Route): Promise<boolean> | boolean {
        if (!this.storageService.getAuthToken()) {
            this.router.navigateByUrl('/');
        } else {
            return this.restangular.one('users/current')
                .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
                .then((response) => {
                    console.log(JSON.stringify(response));
                    if (response.hasOwnProperty('isAdmin')) {
                        return true;
                    } else {
                        this.router.navigateByUrl('/');
                    }
                }, (error) => {
                    console.log(JSON.stringify(error));
                    if (error.data.exception.indexOf('NoCurrentUserException') !== -1) {
                        throw new NoCurrentUserError('There is no current user!');
                    } else {
                        throw new Error('Unknown error!');
                    }
                });
        }
    }
}