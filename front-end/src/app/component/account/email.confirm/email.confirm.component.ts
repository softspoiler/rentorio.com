import { ConfirmationService } from './../../../service/confirmation.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-confirm',
  templateUrl: './email.confirm.component.html',
  styleUrls: ['../common.css', './email.confirm.component.css']
})
export class EmailConfirmComponent implements OnInit {

  public confirmSuccess: Boolean;

  constructor(private activateRoute: ActivatedRoute, private confirmService: ConfirmationService) {
    this.confirmEmail();
  }

  private confirmEmail() {
    this.activateRoute.queryParams.subscribe((params) => {
      if (params['token']) {
        this.confirmService.confirmEmail(params['token'])
          .then(() => {
            this.confirmSuccess = true;
          })
          .catch(() => {
            this.confirmSuccess = false;
          });
      }
    });
  }

  ngOnInit() {
  }

}
