import { Router } from '@angular/router';
import { ExpiredVerificationTokenError } from './error/expired.verification.token.error';
import { InvalidVerificationTokenError } from './error/invalid.verification.token.error';
import { BadCredentialsError } from './error/bad.credentials.error';
import { UserStorageService } from './user.storage.service';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

@Injectable()
export class ConfirmationService {

    constructor(
        private restangular: Restangular,
        private router: Router,
        private storageService: UserStorageService,
        private loginService: LoginService
    ) { }

    public confirmRegistration(token: String): Promise<any> {
        return this.restangular.one('registration/confirm')
            .customGET('' + token, {})
            .toPromise()
            .then((response => {
                return response;
            }),
            (error) => {
                if (error.data !== 'undefined') {
                    if (error.data.exception.indexOf('InvalidVerificationTokenException') !== -1) {
                        throw new InvalidVerificationTokenError;
                    } else if (error.data.exception.indexOf('ExpiredVerificationTokenException') !== -1) {
                        throw new ExpiredVerificationTokenError;
                    } else if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            });
    }

    public confirmEmail(token: String): Promise<any> {
        return this.restangular.one('account/email/confirm')
            .customGET('' + token, {}, this.storageService.getAuthTokenWithCheck())
            .toPromise()
            .then((response => {
                return response;
            }),
            (error) => {
                if (error.data !== 'undefined') {
                    if (error.data.exception.indexOf('InvalidVerificationTokenException') !== -1) {
                        throw new InvalidVerificationTokenError;
                    } else if (error.data.exception.indexOf('ExpiredVerificationTokenException') !== -1) {
                        throw new ExpiredVerificationTokenError;
                    } else if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            });
    }

    public resendConfirmRegistrationEmail(token: String) {
        return this.restangular.one('registration/activation/message/resend')
            .customGET('' + token, {})
            .toPromise()
            .then((response => {
                return response;
            }),
            (error) => {
                if (error.data !== 'undefined') {
                    if (error.data.exception.indexOf('InvalidVerificationTokenException') !== -1) {
                        throw new InvalidVerificationTokenError;
                    } else if (error.data.exception.indexOf('ExpiredVerificationTokenException') !== -1) {
                        throw new ExpiredVerificationTokenError;
                    } else if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            });
    }

    public confirmCancelAccount(token: String): Promise<any> {
        return this.restangular.one('/account/cancel/confirm').customGET('' + token, {}).toPromise()
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
                    } else if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            }
            );
    }

    public confirmPasswordUnlock(token: String): Promise<any> {
        return this.restangular.one('account/password/unlock')
            .customGET('' + token, {})
            .toPromise()
            .then((response => {
                return response;
            }),
            (error) => {
                if (error.data !== 'undefined') {
                    if (error.data.exception.indexOf('InvalidVerificationTokenException') !== -1) {
                        throw new InvalidVerificationTokenError;
                    } else if (error.data.exception.indexOf('ExpiredVerificationTokenException') !== -1) {
                        throw new ExpiredVerificationTokenError;
                    } else if (error.status >= 500) {
                        throw new Error('Server error');
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            });
    }

}
