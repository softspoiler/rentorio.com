import { AccountService } from './../../../../service/account.service';
import { AccountNavigationComponent } from './../navigation/account.navigation.component';
import { HomeNavigationComponent } from './../../navigation/home.navigation.component';
import { Component, OnInit } from '@angular/core';
import { cancelReason } from 'app/model/cancelReason.enum';

@Component({
  selector: 'account-settings',
  templateUrl: './account.settings.component.html',
  styleUrls: ['./account.settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public isOpen: Boolean = false;
  public cancelReason: cancelReason;
  public deleteSuccess: boolean;

  constructor(private accountService: AccountService) { }

  public deleteAccount(details): void {
    if (this.isOpen) {
      this.accountService.deleteAccount(this.cancelReason, details)
        .then((response) => {
          this.deleteSuccess = true;
          setTimeout(() => {
            this.deleteSuccess = false;
          }, 4000)
          return response;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.isOpen = true;
    }
  }

  public close(): void {
    this.isOpen = false;
  }

  public setCancelReason(value): void {
    this.cancelReason = value;
  }

  ngOnInit() {
  }

}
