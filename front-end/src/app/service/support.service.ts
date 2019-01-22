import { BadRequestError } from './error/bad.request.error';
import { NoCurrentUserError } from './error/no.current.user.error';
import { UserStorageService } from './user.storage.service';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';

@Injectable()
export class SupportService {

  constructor(private restangular: Restangular, private storageService: UserStorageService) { }

  public sendSupportInquiry(params: Object, isCurentUser?: Boolean): Promise<any> {
    let authToken = {};
    if (isCurentUser) {
      authToken = this.storageService.getAuthTokenWithCheck();
    }
    return this.restangular.one('support/inquiry').customPOST(params, '', {}, authToken)
      .toPromise()
      .then((response) => {
        console.log(response);
      }, (error) => {
        if (error.data.exception.indexOf('NoCurrentUserException') !== -1) {
          throw new NoCurrentUserError('NoCurrentUserException');
        } else if (error.data.exception.idexOf('BadRequestException')) {
          throw new BadRequestError;
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      });

  }

}
