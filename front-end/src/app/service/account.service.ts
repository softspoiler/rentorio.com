

import { Router } from '@angular/router';
import { InvalidConfirmPasswordError } from './error/invalid.confirm.password.error';
import { InvalidPasswordPolicyError } from './error/invalid.password.policy.error';
import { ExpiredVerificationTokenError } from './error/expired.verification.token.error';
import { InvalidVerificationTokenError } from './error/invalid.verification.token.error';
import { BadCredentialsError } from './error/bad.credentials.error';
import { UserStorageService } from './user.storage.service';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class AccountService {

  constructor(
    private restangular: Restangular,
    private router: Router,
    private storageService: UserStorageService,
    private loginService: LoginService
  ) { }

  public updatePassword(oldPassword, newPassword, confirmPassword): Promise<any> {
    return this.restangular.one('users/current/password')
      .customPUT(JSON.stringify({ oldPassword, newPassword, confirmPassword }), '', {}, this.storageService.getAuthTokenWithCheck())
      .toPromise()
      .then((success) => {
        return success;
      },
      (error) => {
        if (error.data !== 'undefined') {
          console.log(error.data.exception);
          if (error.data.exception.indexOf('BadCredentialsException') !== -1) {
            throw new BadCredentialsError;
          } else if (error.data.exception.indexOf('InvalidPasswordPolicyException') !== -1) {
            throw new InvalidPasswordPolicyError;
          } else if (error.data.exception.indexOf('InvalidConfirmPasswordException') !== -1) {
            throw new InvalidConfirmPasswordError;
          } else if (error.status >= 500) {
            throw new Error('Server error');
          } else {
            throw new Error('Unknown error');
          }
        }
      });
  }

  public deleteAccount(cancelReason, details): Promise<any> {
    return this.restangular.one('users/current/account/cancel')
      .customPUT({ cancelReason, details }, '', {}, this.storageService.getAuthTokenWithCheck())
      .toPromise()
      .then((response) => {
        return response;
      },
      (error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public confirmCancelAccount(token: string): Promise<any> {
    return this.restangular.one('/account/cancel/confirm').customGET('' + token, { token }, {}).toPromise()
      .then((response) => {
        this.loginService.logout();
        return response;
      },
      (error) => {
        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('InvalidVerificationTokenException') !== -1) {
            throw new InvalidVerificationTokenError;
          } else if (error.data.exception.indexOf('ExpiredVerificationTokenException') !== -1) {
            throw new ExpiredVerificationTokenError;
          }
        } else if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

}
