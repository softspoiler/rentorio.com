import { ConfirmationService } from './../../../service/confirmation.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancel-account',
  templateUrl: './cancel.account.component.html',
  styleUrls: ['../common.css','./cancel.account.component.css']
})
export class CancelAccountComponent implements OnInit {
  public confirmSuccess: Boolean;

  constructor(private activateRoute: ActivatedRoute, private confirmService: ConfirmationService) {
    this.confirmAccountCancel();  
  }

  private confirmAccountCancel() {
    this.activateRoute.queryParams.subscribe((params) => {
      if (params['token']) {
        this.confirmService.confirmCancelAccount(params['token'])
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
