import { UserProfile } from './../model/user.profile.model';
import { ProfileService } from './profile.service';
import { User } from './../model/user.model';
import { RegistrationService } from './registration.service';
import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { UploadedImage } from './../model/uploaded.image.model';
import { UserStorageService } from './user.storage.service';

@Injectable()
export class UserFacadeService {
    constructor(
        private loginService: LoginService,
        private registrationService: RegistrationService,
        private profileService: ProfileService,
        private userStorageService: UserStorageService
    ) { }

    public login(email: string, password: string, rememberMe: boolean): Promise<any> {
        return this.loginService.login(email, password, rememberMe);
    }

    public passwordUnlock(token: String): Promise<any> {
        return this.loginService.passwordUnlock(token);
    }

    public logout() {
        this.loginService.logout();

    }

    public getCurrentUser(): Promise<User> {
        return this.loginService.getCurrentUser();
    }

    public registrate(firstName: string, lastName: string, email: string, password: string, confirmPassword: string, agreedTermOfUse: boolean, recaptchaResponse: string): Promise<User> {
        return this.registrationService.registrate(firstName, lastName, email, password, confirmPassword, agreedTermOfUse, recaptchaResponse);
    }

    public getAuthToken(): string {
        return this.userStorageService.getAuthToken();
    }

    public setUserAvatar(avatar: UploadedImage): void {
        this.userStorageService.setUserAvatar(avatar);
    }

    public getUserAvatar(): UploadedImage {
        return this.userStorageService.getUserAvatar();
    }

    public updateUserAvatar(): Promise<any> {
        return this.loginService.updateUserAvatar();
    }

    public removeUserAvatar(): void {
        this.userStorageService.removeUserAvatar();
    }

    public setEstateRemember(): void {
        this.userStorageService.setEstateRemember();
    }

    public getEstateRemember(): Promise<any> {
        return this.userStorageService.getEstateRemember();
    }

    public getUserProfile(): Promise<UserProfile> {
        return this.profileService.getUserProfile();
    }

    public updateUserProfile(userProfile: UserProfile): Promise<any> {
        return this.profileService.updateUserProfile(userProfile);
    }

    public updateUserEmail(email: String): Promise<any> {
        return this.profileService.updateUserEmail(email);
    }

    public sendSmsVerifyCode(phoneNumber: string): Promise<any> {
        return this.profileService.sendSmsVerifyCode(phoneNumber);
    }

    public checkSmsVerifyCode(code: string): Promise<any> {
        return this.profileService.checkSmsVerifyCode(code);
    }

    public resendEmailConfirmation() {
        this.profileService.resendEmailConfirmation();
    }
}
