import { UserStorageService } from './../../service/user.storage.service';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';

@Injectable()
export class EstateService {

  constructor(private restangular: Restangular, private userStorageService: UserStorageService) { }

  public getListsForApproval(pageNumber: Number): Promise<any> {
    return this.restangular.all('console/lists')
      .customGET('', { pageNumber, pageSize: 1 }, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
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

  public approve(estateId) {
    return this.restangular.all('console/lists')
      .customPUT(estateId, estateId + '/approve', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
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

  public decline(estateId) {
    return this.restangular.all('console/lists')
      .customPUT(estateId, estateId + '/decline', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
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
}
