import { Router } from '@angular/router';
import { UserStorageService } from './user.storage.service';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  constructor(
    private restangular: Restangular,
    private storageService: UserStorageService,
    private router: Router
  ) { }

  public getNotificationsNumber(): Promise<number> {
    return this.restangular.all('users/current/notifications/new/count')
      .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return response.count;
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

  public getUserNotifications(): Promise<any> {
    return this.restangular.all('users/current/notifications')
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

  public notificationViewed(id: number): Promise<any> {
    return this.restangular.all('users/current/notifications')
      .customPUT(id, id + '/viewed', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return;
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

  public removeNotification(id: number): Promise<any> {
    return this.restangular.all('users/current/notifications')
      .customDELETE(id, {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return;
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


}
