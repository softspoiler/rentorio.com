import { LoginService } from './service/login.service';
import { SEARCH_INITIAL_STATE } from './store/search/search.initial.state';
import { RealEstate } from './model/real.estate.model';
import { ESTATE_INITIAL_STATE } from './store/estate/estate.initial.state';
import { Router } from '@angular/router';
import {
  LOGOUT_SUCCESSFUL, LOGIN_SUCCESSFUL, UPDATE_USER_AVATAR,
  CREATE_REAL_ESTATE, UPDATE_REAL_ESTATE, EDIT_REAL_ESTATE, CLEAR_ESTATE,
  CLEAR_SEARCH
} from './store/actions';
import { INITIAL_STATE } from './store/session/session.initial.state';
import rootReducer from './store/reducer';
import { IAppState } from './store/state';
import { NgRedux } from '@angular-redux/store';
import { ISession } from './store/session/session.interface';
import { BadCredentialsError } from 'app/service/error/bad.credentials.error';
// import { BaseAuthentication } from 'app/service/base.authentication';
import { User } from './model/user.model';
import { UserFacadeService } from './service/user.facade.service';
import { Component, OnInit, Output } from '@angular/core';
import DateUtils from 'app/util/date.utils';
import { BrowserSupCheck } from './service/check.browser.service';
import { TranslateService } from '@ngx-translate/core';
import { UserStorageService } from './service/user.storage.service';
import { UploadedImage } from './model/uploaded.image.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserFacadeService]
})
export class AppComponent implements OnInit {
  public needChangeBrowser: boolean | string;
  private isAuthenticated: boolean;
  private user: User;
  private avatar: UploadedImage;

  constructor(
    private userService: UserFacadeService,
    private browserCheck: BrowserSupCheck,
    private translate: TranslateService,
    private ngRedux: NgRedux<IAppState>,
    private loginService: LoginService,
    private router: Router,
    private storageService: UserStorageService
  ) { }

  private initTranslateService() {
    let currentLang = localStorage.getItem('lang');
    this.translate.addLangs(['uk', 'ru']);
    if (currentLang !== null) {
      this.translate.setDefaultLang(currentLang);
      this.translate.use(currentLang);
    } else {
      this.translate.setDefaultLang('uk');
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang.match('/uk|ru/') ? browserLang : 'uk');
    }
  }

  private setupCurrentUserIfAuthenticated() {
    this.userService.getCurrentUser()
      .then((user) => {
        this.ngRedux.dispatch({ type: LOGIN_SUCCESSFUL, payload: user });
        console.log(JSON.stringify(this.ngRedux.getState()));
        this.user = this.ngRedux.getState().session.currentUser;
        this.avatar = this.userService.getUserAvatar();
        if (!this.avatar) {
          this.loginService.updateUserAvatar()
            .then(() => {
              this.avatar = this.userService.getUserAvatar();
              this.ngRedux.dispatch({ type: UPDATE_USER_AVATAR, payload: this.avatar });
            })
            .catch((err) => {
              console.log(err);
            })
        } else {
          this.ngRedux.dispatch({ type: UPDATE_USER_AVATAR, payload: this.avatar });
          console.log(JSON.stringify(this.ngRedux.getState()));
        }
      }).catch((error) => {
        console.log('error');
        this.storageService.removeAuthToken();
        this.storageService.removeUserAvatar();
      });
  }

  ngOnInit() {
    // check user browser
    this.needChangeBrowser = this.browserCheck.checkBrowser();
    this.initTranslateService();
    this.initStore();
    this.isAuthenticated = this.ngRedux.getState().session.isAuthenticated;
    this.setupCurrentUserIfAuthenticated();

  }

  private initStore() {
    this.ngRedux.configureStore(rootReducer,
      { session: INITIAL_STATE, estate: ESTATE_INITIAL_STATE, search: SEARCH_INITIAL_STATE });
    console.log('Redux initial state');
    console.log('=============================');
    console.log(JSON.stringify(this.ngRedux.getState()));
    console.log('=============================');
  }

  public logoutEventHandler() {
    this.userService.logout();
    this.ngRedux.dispatch({ type: LOGOUT_SUCCESSFUL });
    this.ngRedux.dispatch({ type: CLEAR_ESTATE });
    this.ngRedux.dispatch({ type: CLEAR_SEARCH });
    this.router.navigateByUrl('/');
    console.log('Redux state after logout:');
    console.log('=============================');
    console.log(JSON.stringify(this.ngRedux.getState()));
    console.log('=============================');
  }

  public newEstateEventHandler() {
    this.ngRedux.dispatch({ type: CREATE_REAL_ESTATE });
    console.log('Redux state after newEstate creation:');
    console.log('=============================');
    console.log(JSON.stringify(this.ngRedux.getState()));
    console.log('=============================');
  }
}
