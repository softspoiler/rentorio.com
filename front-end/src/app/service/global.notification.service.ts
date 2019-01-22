import { UserStorageService } from './user.storage.service';
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { GlobalNotification } from 'app/model/global.notifications';

@Injectable()
export class GlobalNotificationService {

    constructor(private restangular: Restangular, private userStorageService: UserStorageService) { }

    public getGlobalNotifications(): Promise<GlobalNotification[]> {
        return this.restangular.one('users/current/global/notifications')
            .customGET('', {}, this.userStorageService.getAuthTokenWithCheck() )
            .toPromise()
            .then((response) => {
                return response.plain();
            })
            .catch((error) => {
                if (error.status >= 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Unknow error' + error);
                }
            });
    }
}