import { FormGroup, FormBuilder } from '@angular/forms';
import { RegistrationService } from './../../../../service/registration.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserFacadeService } from './../../../../service/user.facade.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../../../../store/state';
import { User } from 'app/model/user.model';
import Validations from 'app/util/validation.utils';


@Component({
  selector: 'profile-unconfirm',
  templateUrl: './profile.unconfirm.component.html',
  styleUrls: ['./profile.unconfirm.component.css']
})
export class ProfileUnconfirmComponent implements OnInit {
  @Input() isEmailConfirmed: Boolean;
  @Input() isPhoneConfirmed: Boolean;
  @Output() newPhoneEvent: EventEmitter<string> = new EventEmitter()
  public currentUser: User;
  public showAlert: Boolean = false;
  public emailExist: Boolean;
  public form: FormGroup;
  public submitAttempt: Boolean;
  public emailUpdateLoading: Boolean;
  public updateEmailTypeOfError: String;
  public loading:Boolean = true;

  constructor(
    private userService: UserFacadeService,
    private ngRedux: NgRedux<IAppState>,
    private registrationService: RegistrationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: Validations.emailValidation()
    })
  }

  setupConfirmInformation() {
    this.userService.getCurrentUser()
      .then((user) => {
        this.loading = false;
        this.currentUser = user;
        this.isEmailConfirmed = this.currentUser.emailConfirmed;
        this.isPhoneConfirmed = this.currentUser.phoneConfirmed;
        this.emailExist = !!this.currentUser.email;
      })
      .catch((err) => {
        this.loading = false;
        console.log(err);
      })
  }

  public updatePhoneEventHandler() {
    this.newPhoneEvent.emit('phone was change');
  }

  public resendEmailConfirmation() {
    this.registrationService.resendEmailConfirmation()
      .then((response) => {
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 4000);
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public emailFormOnSubmit() {
    this.submitAttempt = true;
    this.updateEmailTypeOfError = '';
    if (this.form.valid) {
      this.emailUpdateLoading = true;
      this.userService.updateUserEmail(this.form.value.email)
        .then(() => {
          this.emailUpdateLoading = false;
          this.emailExist = false;
          this.currentUser.email = this.form.value.email;
          console.log('emailUpdateSuccess');
        })
        .catch((err) => {
          console.log('UpdateEmailError', err);
          this.emailUpdateLoading = false;
          this.updateEmailTypeOfError = err.message || console.log('Unknown error');
        })
    }
  }

  ngOnInit() {
    this.setupConfirmInformation();
  }

}
