import { UserActionService } from 'app/service/user.action.service';
import { CREATE_REAL_ESTATE } from './../../store/actions';
import { Observable } from 'rxjs/Observable';
import { ISession } from 'app/store/session/session.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import { IAppState } from 'app/store/state';

@Component({
  selector: 'app-rentik',
  templateUrl: './rentik.component.html',
  styleUrls: ['./rentik.component.css']
})
export class RentikComponent implements OnInit {
  @select() public session$: Observable<ISession>;
  public showModal: Boolean;
  public step: string;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private ngRedux: NgRedux<IAppState>,
    private userActionService: UserActionService
  ) {
    if (!this.cookieService.get('rnt-status')) {
      setTimeout(() => {
        this.open();
      }, 4000)
    };
    console.log('rnt-status', !this.cookieService.get('rnt-status'))
  }

  public open() {
    this.showModal = true;
  }

  public close() {
    this.showModal = false;
    this.cookieService.set('rnt-status', 'close', 1);
    setTimeout(() => { this.step = '' }, 300);
  }

  public redirectToWishlist() {
    this.router.navigateByUrl('/wish');
  }

  public createNewEstate() {
    if (this.ngRedux.getState().session.isAuthenticated &&
      this.ngRedux.getState().session.currentUser.emailConfirmed &&
      this.ngRedux.getState().session.currentUser.phoneConfirmed
    ) {
      this.ngRedux.dispatch({ type: CREATE_REAL_ESTATE });
      this.userActionService.sendUserAction({ 'create': 'estate' });
      this.router.navigateByUrl('/home/estate/general');
    } else {
      this.step = 'landlord-confirm'
    }
  }

  public sendUserAction(action: string) {
    this.userActionService.sendUserAction({ 'rentik': action }, true);
  }

  ngOnInit() {
  }

}
