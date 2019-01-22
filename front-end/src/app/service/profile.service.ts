import { EmailAlreadyExistError } from './error/email.already.exist.error';
import { User } from '../model/user.model';
import { InvalidSmsVerifyCodeError } from './error/invalid.sms.verify.code.error';
import { InvalidEmailFormatError } from 'app/service/error/invalid.email.format.error';
import { SmsVerifyCodeAttemptLimitError } from './error/sms.verify.code.attempt.limit.error';
import { PhoneNumberAlreadyExistError } from './error/phone.number.already.exist.error';
import { LoginService } from './login.service';
import { UserProfile } from './../model/user.profile.model';
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Constants } from './constants';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../store/state';
import { UserStorageService } from './user.storage.service';
import { MandatoryProfileFieldsError } from 'app/service/error/mandatory.profile.fields.error';

@Injectable()
export class ProfileService {

    private user: User;
    private tmpProfile: UserProfile;
    private attempts: number;
    private tmpPhoneNumber: string;

    constructor(
        private loginService: LoginService,
        private ngRedux: NgRedux<IAppState>,
        private restangular: Restangular,
        private router: Router,
        private storageService: UserStorageService
    ) {
        this.attempts = 0;
    }

    public getUserProfile(): Promise<UserProfile> {
        // if (this.tmpProfile === null || this.tmpProfile === undefined) {
        let userProfile: any;
        let user: User;
        if (this.ngRedux.getState().session.isAuthenticated) {
            user = this.ngRedux.getState().session.currentUser;
        }
        return this.restangular.all('users')
            .customGET('current/profile', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
            .then((res) => {
                userProfile = res;
                return this.responseToUserProfile(user, userProfile);
            }, (error) => {
                console.log(JSON.stringify(error));
                if (error.status >= 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Unknown error');
                }
            });
        // } else {
        //     return new Promise((resolve, reject) => {
        //           resolve(this.tmpProfile);
        //     });
        // }
    }

    public responseToUserProfile(user: any, userProfile: any): UserProfile {
        const profile = new UserProfile();
        profile.id = user.id;
        profile.email = userProfile.email;
        profile.firstName = userProfile.firstName;
        profile.middleName = userProfile.middleName;
        profile.lastName = userProfile.lastName;
        profile.phoneNumber = userProfile.phoneNumber;
        profile.gender = userProfile.gender;
        profile.birthday = new Date(userProfile.birthday);
        profile.selfDescription = userProfile.selfDescription;
        profile.placeOfWork = userProfile.placeOfWork;
        profile.locale = userProfile.locale;
        profile.placeOfEducation = userProfile.placeOfEducation;
        profile.isEmailConfirmed = userProfile.emailConfirmed;
        profile.registrationDate = new Date(userProfile.registrationDate);
        console.log('Current user profile from server:' + JSON.stringify(profile));
        this.tmpProfile = profile;
        return profile;
    }

    public updateUserProfile(userProfile: UserProfile): Promise<any> {
        const requestProfile = this.userProfileToRequestProfile(userProfile);
        return this.restangular.all('users')
            .customPUT(requestProfile, 'current/profile', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
            .then(() => {
                console.log('User profile is updated');
                this.tmpProfile = userProfile;
            }, (error) => {
                console.log(JSON.stringify(error));
                if (error.data !== 'undefined'
                    && error.data.exception.indexOf('InvalidEmailFormatException') !== -1) {
                    throw new InvalidEmailFormatError('Wrong email format!');
                } else if (error.data.exception.indexOf('EmailAlreadyExistException') !== -1) {
                    throw new EmailAlreadyExistError;
                } else if (error.data.exception.indexOf('MandatoryProfileFieldsException') !== -1) {
                    throw new MandatoryProfileFieldsError;
                } else if (error.status >= 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Unknown error');
                }
            });
    }

    public userProfileToRequestProfile(profile: UserProfile): any {
        const requestProfile = Object.create(null);
        requestProfile.email = profile.email;
        requestProfile.middleName = profile.middleName;
        requestProfile.lastName = profile.lastName;
        requestProfile.firstName = profile.firstName;
        requestProfile.phoneNumber = profile.phoneNumber;
        requestProfile.gender = profile.gender;
        requestProfile.birthday = +profile.birthday;
        requestProfile.selfDescription = profile.selfDescription;
        requestProfile.placeOfWork = profile.placeOfWork;
        requestProfile.locale = profile.locale;
        requestProfile.placeOfEducation = profile.placeOfEducation;
        requestProfile.emailConfirmed = profile.isEmailConfirmed;
        requestProfile.registrationDate = profile.registrationDate;
        console.log('Current user profile during updating:' + JSON.stringify(requestProfile));
        return requestProfile;
    }

    public sendSmsVerifyCode(phoneNumber: string): Promise<any> {
        return this.restangular.all('users')
            .customPOST({ 'phoneNumber': phoneNumber }, 'current/sms/verify', {}, this.storageService.getAuthTokenWithCheck())
            .toPromise()
            .then(() => {
                this.attempts++;
                this.tmpPhoneNumber = phoneNumber;
                console.log('send SMS attempts done: ' + this.attempts);
            }, (error) => {
                console.log(JSON.stringify(error));
                if (error.data !== 'undefined'
                    && error.data.exception.indexOf('PhoneNumberAlreadyExistException') !== -1) {
                    throw new PhoneNumberAlreadyExistError();
                } else if (error.data !== 'undefined'
                    && error.data.exception.indexOf('SmsVerifyCodeAttemptLimitException') !== -1) {
                    throw new SmsVerifyCodeAttemptLimitError();
                } else if (error.status >= 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Unknown error');
                }
            });
    }

    public checkSmsVerifyCode(code: string): Promise<any> {
        return this.restangular.one('users/current/sms/verify', code)
            .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
            .then(() => {
                this.tmpProfile.phoneNumber = this.tmpPhoneNumber;
            }, (error) => {
                console.log(JSON.stringify(error));
                if (error.data !== 'undefined'
                    && error.data.exception.indexOf('InvalidSmsVerifyCodeException') !== -1) {
                    throw new InvalidSmsVerifyCodeError('@@Invalid SMS verification code!');
                } else if (error.status >= 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Unknown error');
                }
            });
    }

    public resendEmailConfirmation() {
        console.log('New email confirmation has been sent to the user');
    }

    public updateUserEmail(email: String): Promise<any> {
        return this.restangular.one('users/current/profile/email')
            .customPUT({ 'email': email }, '', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
            .then((response) => {
                return response;
            }, (error) => {
                console.log(error);
                if (error.data !== undefined) {
                    if (error.data.exception.indexOf('EmailAlreadyExistException') !== -1) {
                        throw new EmailAlreadyExistError;
                    } else if (error.data.exception.indexOf('InvalidEmailFormatException') !== -1) {
                        throw new InvalidEmailFormatError;
                    } else {
                        throw new Error('Unknown error');
                    }
                }
            })
    }

    public getTenantProfile(userId: number): Promise<any> {
        return this.restangular.one('users', userId)
            .customGET('tenant/profile', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
            .then((result) => {
                let res = result.plain();
                res.registrationDate = new Date(result.registrationDate);
                return res;
            }, (error) => {
                console.log(JSON.stringify(error));
                if (error.status >= 500) {
                    throw new Error('Server error');
                } else {
                    throw new Error('Unknown error');
                }
            });
    }

}
