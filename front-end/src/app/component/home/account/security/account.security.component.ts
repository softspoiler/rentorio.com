import { AccountService } from './../../../../service/account.service';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Validations from '../../../../util/validation.utils';

@Component({
  selector: 'account-security',
  templateUrl: './account.security.component.html',
  styleUrls: ['./account.security.component.css']
})
export class AccountSecurityComponent implements OnInit {
  public form: FormGroup;
  public submitAttempt: Boolean = false;
  public typeOfError: string;
  public showAlert: Boolean = false;
  public showCapslockMessage: Boolean;
  public loading:Boolean;

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.form = this.fb.group({
      oldPassword: Validations.oldPasswordValidation(),
      passwordGroup: this.fb.group({
        password: Validations.passwordValidation(true),
        confirmPassword: Validations.confirmPasswordValidation()
      }, { validator: Validations.passwordConfirming })
    });
  }

  ngOnInit() {
  }

  public onSubmit() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.loading = true;
      this.typeOfError = null;
      this.accountService.updatePassword(
        this.form.value.oldPassword,
        this.form.get('passwordGroup').value.password,
        this.form.get('passwordGroup').value.confirmPassword
      ).then((response) => {
        this.showAlert = true;
        this.loading = false;
        setTimeout(() => {
          this.showAlert = false;
        }, 4000)
        return;
      })
        .catch((error) => {
          this.loading = false;
          this.typeOfError = error.message || console.log(error);
        });
    }
  }

  public onCapslockHandler(e) {
    if (e) {
      this.showCapslockMessage = true;
    } else {
      this.showCapslockMessage = false;
    }
  }

}
