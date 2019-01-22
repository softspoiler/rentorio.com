import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { UserStorageService } from './user.storage.service';
import { PopupService } from './popup.service';
import { Router } from '@angular/router';
import { NoCurrentUserError } from 'app/service/error/no.current.user.error';
import { EstateOfflineError } from 'app/service/error/estate.offline.error';
import { IgnoredByUserError } from 'app/service/error/ignored.by.user.error';
import { NotAvailableTimeError } from 'app/service/error/not.available.time.error';
import { AvailableTimeLimitError } from 'app/service/error/available.time.limit.error';
import { AvailableTimeOverlapError } from 'app/service/error/available.time.overlap.error';
import { CallerIsAlreadyInCallError } from 'app/service/error/caller.is.already.in.call.error';
import { CalleeIsAlreadyInCallError } from 'app/service/error/callee.is.already.in.call.error';
import { NoFreeCallChannelsError } from 'app/service/error/no.free.call.channels.error';
import { PhoneCallFailureError } from 'app/service/error/phone.call.failure.error';
import { PhoneNumberNotConfirmedError } from 'app/service/error/phone.number.not.comfirmed.error';
import { TenantNotAvailableNowError } from 'app/service/error/tenant.not.available.now.error';
import { LandlordNotAvailableNowError } from 'app/service/error/landlord.not.available.now.error';
import { EmailNotConfirmedError } from 'app/service/error/email.not.confirmed.error';

@Injectable()
export class CallService {

  constructor(
    private restangular: Restangular,
    private router: Router,
    private storageService: UserStorageService,
    private popupService: PopupService) { }

  public callToLandlord(estateId: number): Promise<any> {
    return this.restangular.one('estates', estateId)
      .customGET('phone/call', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then(() => {
        // console.log(response.plain());
        // return response.plain();
      },
      (error) => {
        console.log(error);
        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('NoCurrentUserException') !== -1) {
            this.router.navigateByUrl('login');
            throw new NoCurrentUserError('NoCurrentUserError');
          } else if (error.data.exception.indexOf('EstateOfflineException') !== -1) {
            this.popupService.popupError.next('EstateOfflineError');
            throw new EstateOfflineError();
          } else if (error.data.exception.indexOf('IgnoredByUserException') !== -1) {
            this.popupService.popupError.next('IgnoredByUserError');
            throw new IgnoredByUserError();
          } else if (error.data.exception.indexOf('NotAvailableTimeException') !== -1) {
            this.popupService.popupError.next('NotAvailableTimeError');
            throw new NotAvailableTimeError();
          } else if (error.data.exception.indexOf('CallerIsAlreadyInCallException') !== -1) {
            this.popupService.popupError.next('CallerIsAlreadyInCallError');
            throw new CallerIsAlreadyInCallError();
          } else if (error.data.exception.indexOf('CalleeIsAlreadyInCallException') !== -1) {
            this.popupService.popupError.next('CalleeIsAlreadyInCallError');
            throw new CalleeIsAlreadyInCallError();
          } else if (error.data.exception.indexOf('NoFreeCallChannelsException') !== -1) {
            this.popupService.popupError.next('NoFreeCallChannelsError');
            throw new NoFreeCallChannelsError();
          } else if (error.data.exception.indexOf('PhoneCallFailureException') !== -1) {
            this.popupService.popupError.next('PhoneCallFailureError');
            throw new PhoneCallFailureError();
          } else if (error.data.exception.indexOf('LandlordNotAvailableNowException') !== -1) {
            this.popupService.popupError.next('LandlordNotAvailableNowError');
            throw new LandlordNotAvailableNowError();
          } else {
            throw new Error('Unknown error');
          }
        } else if (error.status === 401 || 403) {
          this.router.navigateByUrl('login');
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }

      }
      );
  }

  public getIsLandlordAvailableNow(userId: number): Promise<any> {
    return this.restangular.one('users', userId)
      .customGET('phone/available/now', {}, {}).toPromise()
      .then((response) => {
        console.log(response.plain());
        return response.plain();
      }, (error) => {
        console.log(error);
        if (error.status === 401 || 403) {
          this.router.navigateByUrl('login');
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public callsForbidden(isForbidden: boolean): Promise<any> {
    return this.restangular.one('users/current/phone/calls/forbidden', isForbidden)
      .customPUT({}, '', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        return response;
      }, (error) => {
        console.log(error);
        if (error.status === 401 || 403) {
          this.router.navigateByUrl('login');
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public getLandlordAvailableTime(userId: number): Promise<any> {
    return this.restangular.one('users', userId)
      .customGET('phone/available/time', {}, {}).toPromise()
      .then((response) => {
        console.log(response.plain());
        return response.plain();
      }, (error) => {
        console.log(error);
        if (error.status === 401 || 403) {
          this.router.navigateByUrl('login');
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public removeAvailableTime(availableTimeId: number): Promise<any> {
    return this.restangular.one('users/current/phone/available/time', availableTimeId)
      .customDELETE('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response.plain());
        return response.plain();
      }, (error) => {
        console.log(error);
        if (error.status === 401 || 403) {
          this.router.navigateByUrl('login');
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public addAvailableTime(availableTimeDto: any): Promise<any> {
    return this.restangular.all('users/current/phone/available/time')
      .customPOST(availableTimeDto, '', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response.plain());
        return response.plain();
      }, (error) => {
        console.log(JSON.stringify(error));
        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('AvailableTimeOverlapException') !== -1) {
            throw new AvailableTimeOverlapError;
          } else if (error.data.exception.indexOf('AvailableTimeLimitException') !== -1) {
            throw new AvailableTimeLimitError;
          }
        } else if (error.status === 401 || 403) {
          this.router.navigateByUrl('login');
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public getAvailableTime(): Promise<any> {
    return this.restangular.all('users/current/phone/available/time')
      .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response.plain());
        return response.plain();
      }, (error) => {
        console.log(error);
        if (error.status === 401 || 403) {
          this.router.navigateByUrl('login');
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

}
