import { NoCurrentUserError } from './error/no.current.user.error';
import { BadRequestError } from './error/bad.request.error';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import { UserStorageService } from './user.storage.service';
@Injectable()
export class ComplaintService {

  constructor(private restangular: Restangular, private storageService: UserStorageService) { }

  public sendComplaint(message: object, id: number, path: string): Promise<any> {
    return this.restangular.one(path).customPOST(message, `${id}/complaint`, {}, this.storageService.getAuthTokenWithCheck())
      .toPromise()
      .then((response) => {
        return response;
      }, (error) => {
        if (error.data.exception.indexOf('NoCurrentUserException') !== -1) {
          throw new NoCurrentUserError('NoCurrentUserException');
        } else if (error.data.exception.idexOf('BadRequestException')) {
          throw new BadRequestError;
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        };
      });
  }


}
