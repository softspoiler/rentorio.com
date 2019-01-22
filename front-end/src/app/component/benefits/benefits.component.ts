import { PopupService } from './../../service/popup.service';
import { Router } from '@angular/router';
import { UserActionService } from './../../service/user.action.service';
import { CREATE_REAL_ESTATE } from './../../store/actions';
import { IAppState } from './../../store/state';
import { NgRedux } from '@angular-redux/store';
import { NgxCarousel } from 'ngx-carousel';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.css']
})
export class BenefitsComponent implements OnInit {
  public tenant = true;
  public carouselSetting: Object = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 250,
    interval: 4000,
    point: {
      visible: false,
    },
    touch: true,
    custom: 'banner',
    easing: 'cubic-bezier(0,.01,1,.99)'
  };

  constructor(
    private renderer: Renderer2,
    public translate: TranslateService,
    private ngRedux: NgRedux<IAppState>,
    private userActionService: UserActionService,
    private router: Router,
    private popupService: PopupService
  ) { }

  public showModal(elem: HTMLDivElement) {
    this.renderer.addClass(elem, 'show-modal');
    this.renderer.addClass(elem.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  public hideModal(elem: HTMLDivElement) {
    this.renderer.removeClass(elem, 'show-modal');
    this.renderer.removeClass(elem.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  public isInDevelopment(name: string, items: string[]) {
    if (items.some((elem) => elem === name)) {
      return true;
    }
    return false;
  }

  public createNewEstate() {
    if (this.ngRedux.getState().session.isAuthenticated) {
      if (!this.ngRedux.getState().session.currentUser.emailConfirmed || !this.ngRedux.getState().session.currentUser.phoneConfirmed) {
        this.popupService.popupError.next('NeedConfirmError');
      } else {
        this.ngRedux.dispatch({ type: CREATE_REAL_ESTATE });
        this.userActionService.sendUserAction({ 'create': 'estate' });
        this.router.navigateByUrl('/home/estate/general');
      };
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
  }

}
