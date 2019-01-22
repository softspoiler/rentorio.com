
import { Injectable } from '@angular/core';
import { UserStorageService } from './user.storage.service';
import { Constants } from './constants';
import { Router } from '@angular/router';
import { LOGOUT_SUCCESSFUL, CLEAR_ESTATE, CLEAR_SEARCH  } from './../store/actions';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../store/state';

@Injectable()
export class LogoutService {
    constructor(private router: Router,
        private storageService: UserStorageService,
        private ngRedux: NgRedux<IAppState>) {
    }

    public logout() {
        this.storageService.removeAuthToken();
        this.storageService.removeUserAvatar();
        this.ngRedux.dispatch({ type: LOGOUT_SUCCESSFUL });
        this.ngRedux.dispatch({ type: CLEAR_ESTATE });
        this.ngRedux.dispatch({ type: CLEAR_SEARCH });
        
        console.log('Redux state after logout:');
        console.log('=============================');
        console.log(JSON.stringify(this.ngRedux.getState()));
        console.log('=============================');
        // logout works without rest
        // https://52.26.95.134/logout
    }

    
}
