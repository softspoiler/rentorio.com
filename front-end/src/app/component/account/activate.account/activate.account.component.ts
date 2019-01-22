import { ConfirmationService } from '../../../service/confirmation.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpiredVerificationTokenError } from './../../../service/error/expired.verification.token.error';
import { InvalidVerificationTokenError } from './../../../service/error/invalid.verification.token.error';

@Component({
  selector: 'app-confirm',
  templateUrl: './activate.account.component.html',
  styleUrls: ['./activate.account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  public fail: Boolean = false;
  public success: Boolean = false;
  public showLoad = true;
  private token: String;
  public tokenWasResend: Boolean;
  public resendLoading: Boolean;

  constructor(private confirmationService: ConfirmationService, private activateRoute: ActivatedRoute) {
    this.confirmRegistration();
  }

  public confirmRegistration(): void {
    this.activateRoute.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
        this.confirmationService.confirmRegistration(params['token'])
          .then((response) => {
            this.success = true;
            this.showLoad = false;
          })
          .catch((error) => {
            this.fail = true;
            this.showLoad = false;
            console.log(error);
          });
      } else {
        this.fail = true;
        this.showLoad = false;
      }
    });
  }

  public resendConfirmEmail() {
    this.resendLoading = true;
    // setTimeout(()=>{
    //   this.tokenWasResend = true;
    // },3000)
    this.confirmationService.resendConfirmRegistrationEmail(this.token)
      .then(() => {
        this.resendLoading = false;
        this.tokenWasResend = true;
      })
      .catch((err) => {
        this.resendLoading = false;
        console.log(err);
      });
  }

  ngOnInit() {

  }
}

