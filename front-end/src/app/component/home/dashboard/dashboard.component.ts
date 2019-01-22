import { IAppState } from './../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { UserFacadeService } from './../../../service/user.facade.service';
import { Component, OnInit } from '@angular/core';
import { HomeNavigationComponent } from './../navigation/home.navigation.component';
import { User } from './../../../model/user.model';
import { UploadedImage } from './../../../model/uploaded.image.model';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { ISession } from './../../../store/session/session.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', './../../css/common/common.css']
})

export class DashboardComponent implements OnInit {
  @select() public session$: Observable<ISession>;
  public currentUser: User;
  public avatar: UploadedImage;

  constructor(
    private userService: UserFacadeService,
    private ngRedux: NgRedux<IAppState>
  ) {
    this.session$
      .subscribe((value) => {
        if (value['isAuthenticated']) {
          this.currentUser = this.ngRedux.getState().session.currentUser;
          this.avatar = this.ngRedux.getState().session.avatar;
        }
      });
  }

  ngOnInit() {
  }
}
