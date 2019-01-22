import { Injectable } from '@angular/core';
import { UserStorageService } from './../../service/user.storage.service';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class NotificationService {

  constructor(private restangular: Restangular, private userStorageService: UserStorageService) { }

  public getGlobalNotifications(): Promise<GlobalNotification[]> {
    return this.restangular.one('console/global/notifications')
      .customGET('', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((response) => {
        let plainResponse = response.plain();
        let notificationsArray: Array<GlobalNotification> = [];
        plainResponse.forEach((ntf) => {
          notificationsArray.push(new GlobalNotification(ntf));
        });
        return notificationsArray;
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknow error' + error);
        }
      });
  }

  public createGlobalNotification(notification: GlobalNotification): Promise<any> {
    return this.restangular.one('console/global/notifications')
      .customPOST(notification, '', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then(res => res)
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknow error' + error);
        }
      });
  }

  public editGlobalNotification(notification: GlobalNotification): Promise<any> {
    return this.restangular.one('console/global/notifications')
      .customPUT(notification, notification.id, {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then(res => res)
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknow error' + error);
        }
      });
  }

  public getGlobalNotification(notificationId: number): Promise<GlobalNotification> {
    return this.restangular.one('console/global/notifications')
      .customGET(notificationId, {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
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

  // public archiveGlobalNotification(notificationId: number): Promise<any> {
  //   return this.restangular.one('console/global/notifications')
  //     .customPUT(notificationId, `${notificationId}/archive`, {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
  //     .toPromise()
  //     .then(res => res)
  //     .catch((error) => {
  //       if (error.status >= 500) {
  //         throw new Error('Server error');
  //       } else {
  //         throw new Error('Unknow error' + error);
  //       }
  //     });
  // }

  public deleteGlobalNotification(notificationId: number): Promise<any> {
    return this.restangular.one('console/global/notifications')
      .customDELETE(notificationId, {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then(res => res)
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknow error' + error);
        }
      });
  }
}

export interface GlobalNotification {
  id: Number;
  type: GlobalNotificationType;
  message: String;
  archived: Boolean;
  deleted: Boolean;
  timestamp: number;
  returnReadableData(): String;
}

export enum GlobalNotificationType {
  PUBLISHED, DRAFT, TEMPLATE
}

export class GlobalNotification implements GlobalNotification {

  constructor(notification?: GlobalNotification) {
    if (notification) {
      this.id = notification.id;
      this.type = notification.type;
      this.message = notification.message;
      this.archived = notification.archived;
      this.deleted = notification.deleted;
      this.timestamp = notification.timestamp;
    }
  }

  public returnReadableData(): String {
    let date = new Date(this.timestamp),
      day, month, year, hours, minutes, seconds;
    date.getHours() < 10 ? hours = '0' + date.getHours() : hours = date.getHours();
    date.getMinutes() < 10 ? minutes = '0' + date.getMinutes() : minutes = date.getMinutes();
    date.getSeconds() < 10 ? seconds = '0' + date.getSeconds() : seconds = date.getSeconds();
    date.getDate() < 10 ? day = '0' + date.getDate() : day = date.getDate();
    date.getMonth() + 1 < 10 ? month = '0' + (date.getMonth() + 1) : month = date.getMonth() + 1;
    date.getFullYear() < 10 ? year = '0' + date.getFullYear() : year = date.getFullYear();
    return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
  }
}

