import { InvalidRecaptchaResponseError } from './error/invalid.recaptcha.response.error';
import { MandatoryRegistrateFieldError } from './error/mandatory.registrate.field.error';
import { ExpiredVerificationTokenError } from './error/expired.verification.token.error';
import { InvalidVerificationTokenError } from './error/invalid.verification.token.error';
import { InvalidConfirmPasswordError } from './error/invalid.confirm.password.error';
import { NotAgreedTermOfUseError } from './error/not.agreed.term.of.use.error';
import { InvalidPasswordPolicyError } from './error/invalid.password.policy.error';
import { InvalidEmailFormatError } from './error/invalid.email.format.error';
import { EmailAlreadyExistError } from './error/email.already.exist.error';
import { User } from './../model/user.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Restangular } from 'ngx-restangular';
import { UserStorageService } from './user.storage.service';

@Injectable()
export class RegistrationService {
  constructor(
    private restangular: Restangular,
    private router: Router,
    private storageService: UserStorageService
  ) {
  }

  public registrate(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    agreedTermOfUse: boolean,
    recaptchaResponse: string
  ): Promise<User> {
    return this.restangular.all('registration')
      .customPOST({ firstName, lastName, email, password, confirmPassword, agreedTermOfUse, recaptchaResponse }, '', {}, {}).toPromise()
      .then((response => {
        return this.responseToUser(response);
      }),
      (error) => {
        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('EmailAlreadyExistException') !== -1) {
            throw new EmailAlreadyExistError;
          } else if (error.data.exception.indexOf('InvalidEmailFormatException') !== -1) {
            throw new InvalidEmailFormatError;
          } else if (error.data.exception.indexOf('InvalidPasswordPolicyException') !== -1) {
            throw new InvalidPasswordPolicyError;
          } else if (error.data.exception.indexOf('InvalidConfirmPasswordException') !== -1) {
            throw new InvalidConfirmPasswordError;
          } else if (error.data.exception.indexOf('NotAgreedTermOfUseException') !== -1) {
            throw new NotAgreedTermOfUseError;
          } else if (error.data.exception.indexOf('MandatoryRegistrateFieldException') !== -1) {
            throw new MandatoryRegistrateFieldError;
          } else if (error.data.exception.indexOf('InvalidRecaptchaResponseException') !== -1) {
            throw new InvalidRecaptchaResponseError;
          } else if (error.status >= 500) {
            throw new Error('Server error');
          } else {
            throw new Error('Unknown error');
          }
        }
      });
  }

  public responseToUser(response: any): User {
    let user = new User();
    user.id = response.id;
    user.firstName = response.firstName;
    user.middleName = response.middleName;
    user.lastName = response.lastName;
    user.email = response.email;
    user.isAgreedTermOfUse = response.agreedTermOfUse;
    user.enabled = response.enabled;
    return user;
  }

  public resendEmailConfirmation(): Promise<any> {
    return this.restangular.one('users/current/email/confirmation/resend')
      .customGET('', {}, this.storageService.getAuthTokenWithCheck())
      .toPromise()
      .then((response) => {
        return response;
      }, (error) => {
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      });
  }

}
