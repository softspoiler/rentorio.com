import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import { User } from 'app/model/user.model';
import { NoCurrentUserError } from 'app/service/error/no.current.user.error';
import { AccountDisabledError } from 'app/service/error/account.disabled.error';
import { BadCredentialsError } from 'app/service/error/bad.credentials.error';
import { PasswordSecurityLockError } from 'app/service/error/password.security.lock.error';
import { ExpiredPasswordRetriesLockTokenError } from 'app/service/error/expired.password.retries.lock.token';
import { InvalidPasswordRetriesLockTokenError } from 'app/service/error/invalid.password.retries.lock.token';
import { UploadedImage } from './../model/uploaded.image.model';
import { UserStorageService } from './user.storage.service';
import { Constants } from './constants';
import { Router } from '@angular/router';
import { LOGOUT_SUCCESSFUL, CLEAR_ESTATE, CLEAR_SEARCH } from './../store/actions';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../store/state';
import { AccountBlockedError } from 'app/service/error/account.blocked.error';
import { AccountAutoBlockedError } from 'app/service/error/account.auto.blocked.error';

@Injectable()
export class LoginService {
    constructor(
        private restangular: Restangular,
        private router: Router,
        private storageService: UserStorageService,
        private ngRedux: NgRedux<IAppState>,
    ) {
    }

    public login(email: string, password: string, rememberMe: boolean): Promise<any> {
        return this.restangular.one('login').customPOST({ email, password, rememberMe }, '', {}, {}).toPromise()
            .then((response) => {
                console.log(`AUTH-TOKEN: ${response.token}`);
                this.storageService.setAuthToken(response.token);
                return response;
            }, (error) => {
                console.log(JSON.stringify(error));
                if (error.data !== 'undefined') {
                    if (error.data.exception.indexOf('BadCredentialsException') !== -1) {
                        throw new BadCredentialsError;
                    } else if (error.data.exception.indexOf('PasswordSecurityLockException') !== -1) {
                        throw new PasswordSecurityLockError;
                    } else if (error.data.exception.indexOf('AccountDisabledException') !== -1) {
                        throw new AccountDisabledError;
                    } else if (error.data.exception.indexOf('AccountBlockedException') !== -1) {
                        throw new AccountBlockedError;
                    } else if (error.data.exception.indexOf('AccountAutoBlockedException') !== -1) {
                        throw new AccountAutoBlockedError;
                    } else {
                        // TODO: we can catch global error with the single error handler.
                        // also with Redux we can generate an event like UNKNOWN_ERROR
                        throw new Error('Unknown error!');
                    }
                }
            });
    }

    public passwordUnlock(token: String): Promise<any> {
        return this.restangular.one('account/password/unlock', token)
            .customGET('', {}).toPromise()
            .then((response => {
                return response;
            }),
            (error) => {
                if (error.data !== 'undefined') {
                    if (error.data.exception.indexOf('ExpiredPasswordRetriesLockTokenException') !== -1) {
                        throw new ExpiredPasswordRetriesLockTokenError;
                    } else if (error.data.exception.indexOf('InvalidPasswordRetriesLockTokenException') !== -1) {
                        throw new InvalidPasswordRetriesLockTokenError;
                    }
                } else if (error.status >= 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Unknown error');
                }
            });
    }

    public logout() {
        this.storageService.removeAuthToken();
        this.storageService.removeUserAvatar();
        this.ngRedux.dispatch({ type: LOGOUT_SUCCESSFUL });
        this.ngRedux.dispatch({ type: CLEAR_ESTATE });
        this.ngRedux.dispatch({ type: CLEAR_SEARCH });
    }

    public getCurrentUser(param?: Boolean): Promise<User> {
        let url = param ? 'users/current?auth' : 'users/current';
        return this.restangular.one(url)
            .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
            .then((response) => {
                console.log(JSON.stringify(response));
                return response.plain();
            }, (error) => {
                console.log(JSON.stringify(error));
                if (error.data.exception.indexOf('NoCurrentUserException') !== -1) {
                    throw new NoCurrentUserError('There is no current user!');
                } else {
                    // TODO: we can catch global error with the single error handler.
                    throw new Error('Global unknown error!');
                }
            });
    }

    public updateUserAvatar(): Promise<UploadedImage> {
        return this.restangular.one('users/current/avatar')
            .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
            .then((response) => {
                if (response.imageId !== 0) {
                    const avatar = this.responseToUserAvatar(response);
                    this.storageService.setUserAvatar(avatar);
                    console.log('Avatar is updated.');
                    return avatar;
                } else {
                    this.storageService.removeUserAvatar();
                }
            }, (error) => {
                console.log(JSON.stringify(error));
                if (error.status >= 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Unknown error');
                }
            });
    }

    private responseToUserAvatar(response: any): UploadedImage {
        const avatar = new UploadedImage;
        avatar.imageId = response.imageId;
        avatar.imageUrl = response.imageUrl;
        avatar.thumbnailUrl = response.thumbnailUrl;
        return avatar;
    }
}
