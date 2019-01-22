import { IAppState } from './../store/state';
import { NgRedux } from '@angular-redux/store';
import { UserStorageService } from './user.storage.service';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';


@Injectable()
export class UserActionService {

    constructor(
        private restangular: Restangular,
        private storageService: UserStorageService,
        private ngRedux: NgRedux<IAppState>
    ) { }

    sendUserAction(action: Object, anonim?: Boolean): void {
        if (this.ngRedux.getState().session.isAuthenticated || anonim) {
            let device;
            if ((<any>window)._isMobileDevice()) {
                device = 'm';
            } else {
                device = 'd';
            }
            let data = JSON.stringify(Object.assign(action, { device }));
            console.log(data);
            this.restangular.one('events')
                .customPOST(data, '', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
                .then((response) => {
                    return;
                }, (error) => {
                    console.log(error);
                });
        }
    }
}