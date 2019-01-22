import { PopupService } from './../../service/popup.service';
import { RegistrationService } from './../../service/registration.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserFacadeService } from './../../service/user.facade.service';
import { EmailAlreadyExistError } from '../../service/error/email.already.exist.error';
import { InvalidConfirmPasswordError } from '../../service/error/invalid.confirm.password.error';
import { NotAgreedTermOfUseError } from '../../service/error/not.agreed.term.of.use.error';
import { InvalidPasswordPolicyError } from '../../service/error/invalid.password.policy.error';
import { InvalidEmailFormatError } from '../../service/error/invalid.email.format.error';
import { MandatoryRegistrateFieldError } from './../../service/error/mandatory.registrate.field.error';
import Validations from '../../util/validation.utils';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../css/common/common.css', './registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public form: FormGroup;
  public submitAttempt: Boolean = false;
  public typeOfError: String;
  public showTermOfUse: Boolean = false;
  public successRegistration: Boolean = false;
  public showCapslockMessage: Boolean;
  public recaptchaResponse: string;
  public loading: Boolean;
  @ViewChild('captchaRef') public gRecaptcha: RecaptchaComponent;

  constructor(
    private userService: UserFacadeService,
    private router: Router,
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private popupService: PopupService
  ) {

    this.form = this.fb.group({
      firstName: Validations.firstNameValidation(),
      lastName: Validations.lastNameValidation(),
      email: Validations.emailValidation(),
      passwordGroup: this.fb.group({
        password: Validations.passwordValidation(true),
        confirmPassword: Validations.confirmPasswordValidation()
      }, { validator: Validations.passwordConfirming }),
      agreedTermOfUse: Validations.termOfUseValidation()
    });

    window['recaptchaHandler'] = this.recaptchaHandler.bind(this);
  }

  public onSubmit() {
    if (this.form.valid) {
      this.typeOfError = null;
      this.loading = true;
      this.userService.registrate(
        this.form.value.firstName,
        this.form.value.lastName,
        this.form.value.email,
        this.form.get('passwordGroup').value.password,
        this.form.get('passwordGroup').value.confirmPassword,
        this.form.value.agreedTermOfUse,
        this.recaptchaResponse
      ).then((response) => {
        this.loading = false;
        this.successRegistration = true;
      })
        .catch((e) => {
          this.loading = false;
          this.gRecaptcha.reset();
          if (e.message === 'InvalidRecaptchaResponseError') {
            this.popupService.popupError.next("ServerError");
          } else {
            this.typeOfError = e.message || console.log('Unknown error');
          }
        });

    }
  }

  public recaptchaHandler(token) {
    this.recaptchaResponse = token;
    this.onSubmit();
  }

  public executeRecaptcha() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.gRecaptcha.execute();
    }
  }

  public back() {
    this.router.navigateByUrl('/');
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
}
