import { Component, OnInit } from '@angular/core';
import { UserFacadeService } from './../../../service/user.facade.service';
import { UserProfile } from './../../../model/user.profile.model';
import { ConfirmInformationComponent } from './../shared/confirm.information/confirm.information.component';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './../../../store/state';
import { UploadedImage } from './../../../model/uploaded.image.model';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { ISession } from './../../../store/session/session.interface';

@Component({
  selector: 'view-profile',
  templateUrl: './view.profile.component.html',
  styleUrls: ['./view.profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  @select() public session$: Observable<ISession>;
  public userProfile: UserProfile;
  public avatar: UploadedImage;

  constructor(
    private userService: UserFacadeService,
    private ngRedux: NgRedux<IAppState>
  ) {
    this.userService.getUserProfile()
      .then((res) => {
        this.userProfile = res;
      })
      .catch((err) => {
        console.log(err)
      });
    this.session$
      .subscribe((value) => {
        if (value['isAuthenticated']) {
          this.avatar = this.ngRedux.getState().session.avatar;
        }
      });
  }

  ngOnInit() {
  }

}
