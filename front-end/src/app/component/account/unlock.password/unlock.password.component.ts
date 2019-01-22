import { ConfirmationService } from './../../../service/confirmation.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unlock-password',
  templateUrl: './unlock.password.component.html',
  styleUrls: ['../common.css', './unlock.password.component.css']
})
export class UnlockPasswordComponent implements OnInit {
  public confirmSuccess: Boolean;

  constructor(private activateRoute: ActivatedRoute, private confirmService: ConfirmationService) {
    this.confirmPasswordUnlock();
  }

  private confirmPasswordUnlock() {
    this.activateRoute.queryParams.subscribe((params) => {
      if (params['token']) {
        this.confirmService.confirmPasswordUnlock(params['token'])
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
