import { CurrentUserService } from 'app/service/current.user.service';
import { UserStorageService } from './user.storage.service';
import { LoginService } from './login.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../store/state';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private storageService: UserStorageService, private currentUserService: CurrentUserService, private router: Router, private loginService: LoginService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ): Promise<boolean> | boolean {
        if (state.url.split('/')[1] === 'login' || state.url.split('/')[1] === 'registration') {
            return this.currentUserService.getCurrentUser()
                .then(() => {
                    this.router.navigateByUrl('/');
                    return false;
                })
                .catch(() => {
                    return true;
                });
        } else {
            return this.loginService.getCurrentUser(true)
                .then(() => {
                    return true;
                    // if (state.url.split('/')[1] === 'home') {
                    //     if (this.storageService.getAuthToken()) {
                    //         return true;
                    //     } else {
                    //         this.router.navigateByUrl('/login');
                    //     }
                    // } else if (state.url.split('/')[1] === 'favorite') {
                    //     if (this.storageService.getAuthToken()) {
                    //         return true;
                    //     } else {
                    //         this.router.navigateByUrl('/');
                    //     }
                    // } else {
                    //     if (!this.storageService.getAuthToken()) {
                    //         return true;
                    //     } else {
                    //         this.router.navigateByUrl('/');
                    //     }
                    //     return true;
                    // }
                })
                .catch(() => {
                    this.router.navigateByUrl('/');
                    return false;
                })
        }
    }
}