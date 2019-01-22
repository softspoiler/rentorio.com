import { PopupService } from './../../service/popup.service';
import { UserProfile } from './../../model/user.profile.model';
import { User } from '../../model/user.model';
import { LOGIN_SUCCESSFUL, UPDATE_USER_AVATAR } from './../../store/actions';
import { IAppState } from './../../store/state';
import { UserFacadeService } from './../../service/user.facade.service';
import { NgRedux } from '@angular-redux/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import Validations from '../../util/validation.utils';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../css/common/common.css', './login.component.css']
})

export class LoginComponent implements OnInit,OnDestroy {
  public form: FormGroup;
  public submitAttempt: Boolean = false;
  public typeOfError: String;
  public success: Boolean;
  public showCapslockMessage: Boolean;
  public userProfile: any;
  public subscription: Subscription;
  public loading: Boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserFacadeService,
    private ngRedux: NgRedux<IAppState>,
    private activateRoute: ActivatedRoute,
    private popupService:PopupService
  ) {

    this.form = this.fb.group({
      email: Validations.emailValidation(),
      password: Validations.passwordValidation(false),
      rememberMe: Validations.rememberMeValidation()
    });

    this.subscription = this.activateRoute.queryParams.subscribe(params => {
      if (params['error']) {
        this.popupService.popupError.next('UnknownError');
      }
    })
  }
  

  public onSubmit() {
    this.typeOfError = '';
    this.success = false;
    this.submitAttempt = true;
    if (this.form.valid) {
      this.loading = true;
      this.userService.login(this.form.value.email, this.form.value.password, this.form.value.rememberMe)
        .then(() => {
          this.typeOfError = null;
          this.onSuccessLogin();
        }).catch((error) => {
          this.loading = false;
          this.typeOfError = error.message || console.log('Unknown erorr');
        });
    }
  }

  public onSuccessLogin(): void {
    this.userService.getCurrentUser()
      .then((user) => {
        this.loading = false;
        console.log(user);
        console.log(JSON.stringify(this.ngRedux.getState()));
        this.ngRedux.dispatch({ type: LOGIN_SUCCESSFUL, payload: user });
        this.router.navigateByUrl('/');
        return this.userService.updateUserAvatar();
      })
      .then((avatar) => {
        console.log(avatar);
        console.log(JSON.stringify(this.ngRedux.getState()));
        this.ngRedux.dispatch({ type: UPDATE_USER_AVATAR, payload: avatar });
        console.log(JSON.stringify(this.ngRedux.getState()));
      })
      .catch((error) => {
        console.log('UNKNOWN ERROR!' + error);
      });
  }

  public onCapslockHandler(e) {
    if (e) {
      this.showCapslockMessage = true;
    } else {
      this.showCapslockMessage = false;
    }
  }


  ngOnInit() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
