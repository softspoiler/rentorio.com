import { UserActionService } from 'app/service/user.action.service';
import { Component, OnInit, Output } from '@angular/core';
import { UserFacadeService } from './../../../../service/user.facade.service';
import { UserProfile } from './../../../../model/user.profile.model';
import { User } from 'app/model/user.model';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { InvalidEmailFormatError } from './../../../../service/error/invalid.email.format.error';
import Validations from './../../../../util/validation.utils';
import { AddNumberComponent } from './../../shared/add.number/add.number.component';
import { InputMaskModule } from 'primeng/primeng';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../../../../store/state';
import { UPDATE_CURRENT_USER } from './../../../../store/actions';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile.edit.component.html',
  styleUrls: ['./profile.edit.component.css']
})

export class ProfileEditComponent implements OnInit {
  public userProfile: UserProfile;
  public form: FormGroup;
  public typeOfError: String;
  public submitAttempt: Boolean = false;
  public years: string[] = [];
  public days: string[] = [];
  public birthday: Date = new Date();
  public localeToString: string[] = ['uk', 'ru', 'en'];
  public loading: Boolean;
  public success: Boolean;

  constructor(
    private userService: UserFacadeService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private ngRedux: NgRedux<IAppState>,
    private userActionService:UserActionService
  ) {
    if (this.ngRedux.getState().session.isAuthenticated) {
      try {
        this.userService.getUserProfile()
          .then((res) => {
            this.userProfile = res;
            this.form = this.fb.group({
              firstName: [this.userProfile.firstName, Validators.required],
              lastName: [this.userProfile.lastName, Validators.required],
              middleName: [this.userProfile.middleName],
              gender: [this.userProfile.gender],
              birthday: [this.userProfile.birthday],
              email: Validations.emailValidation(this.userProfile.email),
              phoneNumber: [this.userProfile.phoneNumber],
              locale: [this.userProfile.locale],
              placeOfEducation: [this.userProfile.placeOfEducation],
              placeOfWork: [this.userProfile.placeOfWork],
              selfDescription: [this.userProfile.selfDescription]
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    }

  }

  public getYears(): string[] {
    const now = new Date().getFullYear();
    for (let i = 1900; i <= (now - 16); i++) {
      this.years.push(i.toString());
    }
    return this.years;
  }

  public getDays(): string[] {
    for (let i = 1; i <= 31; i++) {
      this.days.push(i.toString());
    }
    return this.years;
  }

  public changeBirthday() {
    this.form.value.birthday = this.birthday;
  }

  public onSubmit() {
    if (!this.form.value.lastName) {
      this.form.value.lastName = this.userProfile.lastName;
    }
    if (!this.form.value.firstName) {
      this.form.value.firstName = this.userProfile.firstName;
    }
    if (!this.form.value.email) {
      this.form.value.email = this.userProfile.email;
    }
    this.submitAttempt = true;
    if (this.form.valid) {
      this.success = false;
      this.loading = true;
      this.typeOfError = null;
      console.log(this.form.value);
      const userProfile: UserProfile = this.userProfile;
      Object.assign(userProfile, this.form.value);
      this.userService.updateUserProfile(userProfile)
        .then(() => {
          return this.userService.getCurrentUser();
        })
        .then((user) => {
          this.ngRedux.dispatch({ type: UPDATE_CURRENT_USER, payload: user });
          this.loading = false;
          console.log(JSON.stringify(this.ngRedux.getState()));
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 4000);
        })
        .catch((e) => {
          this.loading = false;
          this.typeOfError = e.message || console.log(e);
        });
    }
  }

  // data from child component add.number.component
  public updatePhoneEventHandler(newPhone) {
    this.userProfile.phoneNumber = newPhone;
    this.form.value.phoneNumber = newPhone;
  }

  ngOnInit() {
    this.getYears();
    this.getDays();
    this.userActionService.sendUserAction({'profile':''});
  }

}
