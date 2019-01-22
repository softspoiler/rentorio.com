import { ExpiredPasswordResetTokenError } from './error/expired.password.reset.token.error';
import { InvalidPasswordResetTokenError } from './error/invalid.password.reset.token.error';
import { NotFoundEmailError } from './error/not.found.email.error';
import { InvalidConfirmPasswordError } from './error/invalid.confirm.password.error';
import { InvalidPasswordPolicyError } from './error/invalid.password.policy.error';
import { BadCredentialsError } from './error/bad.credentials.error';
import { Router } from '@angular/router';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';

@Injectable()
export class ResetPasswordService {

  constructor(private restangular: Restangular, private router: Router) { }

  public forgotPassword(email: string): Promise<any> {
    return this.restangular.one('registration/recovery').customGET('' + email, {}, {}).toPromise()
      .then((response) => {
        return response;
      },
      (error) => {
        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('NotFoundEmailException') !== -1) {
            throw new NotFoundEmailError;
          } else if (error.status >= 500) {
            throw new Error('Server error');
          } else {
            throw new Error('Unknown error');
          }
        }
      }
      );
  }

  public resetPassword(token: string, password: string, confirmPassword): Promise<any> {
    return this.restangular.one('registration/recovery/reset').customPOST({password, confirmPassword }, '' + token, {}, {}).toPromise()
      .then((response) => {
        return response;
      },
      (error) => {
        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('NotFoundEmailException') !== -1) {
            throw new NotFoundEmailError;
          } else if (error.data.exception.indexOf('InvalidPasswordResetTokenException') !== -1) {
            throw new InvalidPasswordResetTokenError;
          } else if (error.data.exception.indexOf('ExpiredPasswordResetTokenException') !== -1) {
            throw new ExpiredPasswordResetTokenError;
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

  public confirmPasswordReset(token: string): Promise<any> {
    return this.restangular.one('registration/recovery/confirm').customGET('' + token, {}, {})
      .toPromise()
      .then((response) => {
        return response;
      },
      (error) => {
        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('InvalidPasswordResetTokenException') !== -1) {
            throw new InvalidPasswordResetTokenError;
          } else if (error.data.exception.indexOf('ExpiredPasswordResetTokenException') !== -1) {
            throw new ExpiredPasswordResetTokenError;
          } else if (error.status >= 500) {
            throw new Error('Server error');
          } else {
            throw new Error('Unknown error');
          }
        }
      });
  }

}
