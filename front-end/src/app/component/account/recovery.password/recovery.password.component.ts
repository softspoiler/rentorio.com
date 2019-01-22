import { ResetPasswordService } from './../../../service/reset.password.service';
import { InvalidConfirmPasswordError } from './../../../service/error/invalid.confirm.password.error';
import { InvalidPasswordPolicyError } from './../../../service/error/invalid.password.policy.error';
import { InvalidPasswordResetTokenError } from './../../../service/error/invalid.password.reset.token.error';
import { ExpiredPasswordResetTokenError } from './../../../service/error/expired.password.reset.token.error';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import Validations from '../../../util/validation.utils';

@Component({
  selector: 'app-reset',
  templateUrl: './recovery.password.component.html',
  styleUrls: ['./recovery.password.component.css']
})
export class RecoveryPasswordComponent implements OnInit {

  public params: string;
  public wrongResetToken: Boolean = false;
  public sendEmailForm: FormGroup;
  public sendEmailAttempt: Boolean = false;
  public sendEmailError: Boolean = false;
  public sendEmailSuccess: Boolean = false;
  public sendEmailLoading: Boolean;
  public resetPasswordForm: FormGroup;
  public resetPasswordAttempt: Boolean = false;
  public resetPasswordError: String = '';
  public resetPasswordLoading: Boolean;
  public resetPasswordSuccess: Boolean = false;
  public showLoading: Boolean = true;

  constructor(
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private resetService: ResetPasswordService
  ) {

    this.sendEmailForm = this.fb.group({
      email: Validations.emailValidation()
    });

    this.resetPasswordForm = this.fb.group({
      password: Validations.passwordValidation(true),
      confirmPassword: Validations.confirmPasswordValidation()
    }, { validator: Validations.passwordConfirming });

    this.activateRoute.queryParams.subscribe(params => {
      if (params['token']) {
        this.resetService.confirmPasswordReset(params['token'])
          .then((response) => {
            this.showLoading = false;
            this.params = params['token'];
          })
          .catch((error) => {
            this.showLoading = false;
            this.wrongResetToken = true;
            console.log(error);
          });
      } else {
        this.showLoading = false;
      }
    });
  }

  public sendEmail(): void {
    this.sendEmailAttempt = true;
    if (this.sendEmailForm.valid) {
      this.sendEmailLoading = true;
      this.sendEmailError = false;
      this.resetService.forgotPassword(this.sendEmailForm.value.email)
        .then(() => {
          this.sendEmailSuccess = true;
          this.sendEmailLoading = false;
        })
        .catch(() => {
          this.sendEmailError = true;
          this.sendEmailLoading = false;
        });
    }
  }

  public resetPassword(): void {
    this.resetPasswordAttempt = true;
    if (this.resetPasswordForm.valid) {
      this.resetPasswordLoading = true;
      this.resetPasswordError = '';
      this.resetService.resetPassword(
        this.params,
        this.resetPasswordForm.value.password,
        this.resetPasswordForm.value.confirmPassword
      )
        .then(() => {
          this.resetPasswordSuccess = true;
          this.resetPasswordLoading = false;
        })
        .catch((error) => {
          this.resetPasswordLoading = false;
          console.log(error);
        });
    }
  }

  ngOnInit() {
    window.scrollTo(0,0);
  }
}
