import { ISession } from './../../../../store/session/session.interface';
import { UserFacadeService } from './../../../../service/user.facade.service';
import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from './../../../../model/user.profile.model';
import { Router } from "@angular/router";
import { NgRedux } from '@angular-redux/store';
import { UPDATE_CURRENT_USER } from 'app/store/actions';

@Component({
  selector: 'confirm-information',
  templateUrl: './confirm.information.component.html',
  styleUrls: ['./confirm.information.component.css']
})
export class ConfirmInformationComponent implements OnInit {
  public curentUserProfile;
  @Input() isEmailConfirmed: Boolean;
  @Input() isPhoneConfirmed: Boolean;
  @Input() withDescription: Boolean;
  @Input() withLink: Boolean;
  @Input() forAnotherUser: Boolean;

  constructor(private userService: UserFacadeService,
    private router: Router,
    private ngRedux: NgRedux<ISession>
  ) { }

  setupConfirmInformation() {
    this.userService.getCurrentUser()
      .then((res) => {
        this.curentUserProfile = res;
        this.ngRedux.dispatch({ type: UPDATE_CURRENT_USER, payload: res })
        console.log(this.curentUserProfile);
        this.isEmailConfirmed = this.curentUserProfile.emailConfirmed;
        this.isPhoneConfirmed = this.curentUserProfile.phoneConfirmed;
      })

  }
  confirm() {
    this.router.navigateByUrl('/home/profile/trust');
  }

  ngOnInit() {
    if(!this.forAnotherUser){
      this.setupConfirmInformation();
    }
  }

}
