import { UserStorageService } from './../../service/user.storage.service';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  constructor(private restangular: Restangular, private userStorageService: UserStorageService) { }

  public getMessages(params: Object): Promise<any> {
    return this.restangular.one('console/messages')
      .customGET('', this.applyFillter(params), { 'X-Auth-Token': this.userStorageService.getAuthToken() })
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

  private applyFillter(filter: Object) {
    let obj = {};
    for (let item in filter) {
      if (filter[item]) {
        obj[item] = filter[item];
      }
    }
    return obj;
  }

  public archiveMessage(messageId): Promise<any> {
    return this.restangular.one('console/messages')
      .customPUT(messageId, messageId + '/archive', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
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

  public removeMessage(messageId): Promise<any> {
    return this.restangular.one('/console/messages')
      .customDELETE(messageId, {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
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


