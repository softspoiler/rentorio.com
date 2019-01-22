import { ProfileNavigationComponent } from './../navigation/profile.navigation.component';
import { HomeNavigationComponent } from './../../navigation/home.navigation.component';
import { AddNumberComponent } from './../../shared/add.number/add.number.component';
import { ProfileUnconfirmComponent } from './../unconfirm/profile.unconfirm.component';
import { ConfirmInformationComponent } from '../../shared/confirm.information/confirm.information.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'profile-verification',
  templateUrl: './profile.verification.component.html',
  styleUrls: ['./profile.verification.component.css']
})
export class ProfileVerificationComponent implements OnInit {
  public isPhoneConfirmed: boolean;

  constructor() { }

  public updatePhoneEventHandler() {
    this.isPhoneConfirmed = true;
  }

  ngOnInit() {
    window.scrollTo(0,0);
  }

}
