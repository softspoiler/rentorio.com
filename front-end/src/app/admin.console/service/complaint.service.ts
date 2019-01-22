import { UserStorageService } from './../../service/user.storage.service';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';

@Injectable()
export class ComplaintService {

  constructor(private restangular: Restangular, private userStorageService: UserStorageService) { }

  public getComplaints(params): Promise<any> {
    return this.restangular.one('console/complaints')
      .customGET('', this.applyFillter(params), { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((response) => {
        return response.plain();
      })
      .catch((error) => {
        if (error.data !== undefined && error.data.exception.indexOf('NoSuchUserException')) {
          throw new Error('NoSuchUserException');
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknow error' + error);
        }
      });
  }

  public blockUser(userId) {
    return this.restangular.all('console/users')
      .customPUT(userId, userId + '/block', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknow error' + error);
        }
      });
  }

  public unBlockUser(userId) {
    return this.restangular.one('console/users')
      .customPUT(userId, userId + '/unblock', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknow error' + error);
        }
      });
  }

  public complaintViewed(complaintId) {
    return this.restangular.one('console/complaints')
      .customPUT(complaintId, complaintId + '/viewed', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknow error' + error);
        }
      });
  }

  public applyFillter(filter: Object) {
    let obj = {};
    for (let item in filter) {
      if (filter[item] !== '' && filter[item] !== null) {
        obj[item] = filter[item];
      }
    }
    return obj;
  }

}
