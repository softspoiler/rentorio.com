import { UserActionService } from 'app/service/user.action.service';
import { CookieService } from 'ngx-cookie-service';
import { GlobalNotificationService } from 'app/service/global.notification.service';
import { UPDATE_NOTIFICATIONS_NUMBER, UPDATE_GLOBAL_NOTIFICATIONS } from './../../store/actions';
import { NotificationComponent } from './../../component/notification/notification.component';
import { NotificationService } from './../../service/notification.service';
import { EstateService } from './../../service/estate.service';
import { ChatService } from './../../service/chat.service';
import { ISession } from './../../store/session/session.interface';
import { Observable } from 'rxjs/Observable';
import { select, NgRedux } from '@angular-redux/store';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PopupService } from './../../service/popup.service';
import { EstateDataChangesService } from './../../service/estate.data.changes.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @select() public session$: Observable<ISession>;
  @Output() public logoutEvent = new EventEmitter();
  @Output() public newEstateEvent = new EventEmitter();
  @ViewChild(NotificationComponent) notificationComponent: NotificationComponent;
  public showEstateMenu: Boolean = false;
  public messagesCount: number;
  public reloadMessagesCountHendler: any;
  public tmpStatus: any = false;
  public isDeclare: Boolean = false;
  public sideNav: Boolean = false;
  private needConfirm = false;
  public showInfo: Boolean;
  public globalNotificationsInterval: any;

  constructor(
    public translate: TranslateService,
    private estateService: EstateService,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private router: Router,
    private renderer: Renderer2,
    private ngRedux: NgRedux<ISession>,
    private popupService: PopupService,
    private estateDataService: EstateDataChangesService,
    private globalNotificationService: GlobalNotificationService,
    private cookieService: CookieService,
    private userActionService: UserActionService
  ) {
    this.session$
      .subscribe((value) => {
        if (value['isAuthenticated']) {
          if (!this.isDeclare) {
            this.tmpStatus = !value['isAuthenticated'];
            this.isDeclare = true;
          } else {
            this.tmpStatus = !this.tmpStatus;
          }
          if (value['isAuthenticated'] !== this.tmpStatus) {
            this.tmpStatus = !this.tmpStatus;
            this.estateService.getUserEstates()
              .then((estates) => {
                if (estates.length > 0) {
                  this.showEstateMenu = true;
                } else {
                  this.showEstateMenu = false;
                }
              })
              .catch((error) => {
                console.log(error);
              });
            this.estateDataService.userEstatesCount
              .subscribe((count) => {
                if (count > 0) {
                  this.showEstateMenu = true;
                } else {
                  this.showEstateMenu = false;
                }
              });
            if (!this.reloadMessagesCountHendler && !this.globalNotificationsInterval) {
              this.getNewMessagesCount();
              this.getNotificationsNumber();
              this.getGlobalNotifications();
              this.getRequestsWithInterval();
              this.getGlobalNotificationsWithInterval();
            }
          }

          if (value['currentUser']['emailConfirmed'] && value['currentUser']['phoneConfirmed']) {
            this.needConfirm = false;
          } else {
            this.needConfirm = true;
          };
        } else {
          if (!this.isDeclare) {
            this.tmpStatus = value['isAuthenticated'];
            this.isDeclare = true;
          } else {
            this.tmpStatus = !this.tmpStatus;
          }
          if (this.reloadMessagesCountHendler) {
            this.reloadMessagesCountHendler = clearInterval(this.reloadMessagesCountHendler);
          }
          if (this.globalNotificationsInterval) {
            this.globalNotificationsInterval = clearInterval(this.globalNotificationsInterval);
          }
        }
      });
  }

  ngOnInit() { }

  public logout() {
    this.logoutEvent.emit();
  }

  public newEstate() {
    if (this.needConfirm) {
      this.popupService.popupError.next('NeedConfirmError');
    } else {
      this.router.navigateByUrl('home/estate');
      this.newEstateEvent.emit();
      this.userActionService.sendUserAction({ 'create': 'estate' });
    }


  }

  public getNewMessagesCount() {
    this.chatService.getNewMessagesCount()
      .then((count) => {
        this.messagesCount = count;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public getRequestsWithInterval() {
    this.reloadMessagesCountHendler = clearInterval(this.reloadMessagesCountHendler);
    this.reloadMessagesCountHendler = setInterval(() => {
      this.getNewMessagesCount();
      this.getNotificationsNumber();
      this.notificationComponent.getUserNotifications();
    }, 30000);
  }

  public getNotificationsNumber() {
    this.notificationService.getNotificationsNumber()
      .then((count) => {
        this.ngRedux.dispatch({ type: UPDATE_NOTIFICATIONS_NUMBER, payload: count });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public getGlobalNotifications() {
    this.globalNotificationService.getGlobalNotifications()
      .then((res) => {
        let viewedNotificationsId = this.cookieService.get('viewedNotificationsId').split(',');
        viewedNotificationsId.forEach((val) => {
          if (!this.cookieService.get(val)) {
            viewedNotificationsId = viewedNotificationsId.filter((v) => {
              return v !== val
            });
          }
        });
        let unViewedNotifications = [];
        res.forEach((ntf) => {
          if (!(viewedNotificationsId.some((val) => { return Number(val) === ntf.id }))) {
            unViewedNotifications.push(ntf);
          }
        });
        this.cookieService.set('viewedNotificationsId', viewedNotificationsId.join(), 1, '/');
        console.log('Global notifications success', unViewedNotifications);
        this.ngRedux.dispatch({ type: UPDATE_GLOBAL_NOTIFICATIONS, payload: unViewedNotifications });
      })
      .catch((err) => {
        console.log('Global notifications fail:', err);
      });
  }

  public getGlobalNotificationsWithInterval() {
    this.globalNotificationsInterval = clearInterval(this.globalNotificationsInterval);
    this.globalNotificationsInterval = setInterval(() => {
      this.getGlobalNotifications();
    }, 120000);
  }

  public viewNewMessages() {
    this.router.navigate(['/home/messages'], { queryParams: { showNew: this.messagesCount } });
    this.messagesCount = null;
  }

  public showSideNav() {
    this.sideNav = true;
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  public hideSideNav() {
    this.sideNav = false;
    this.renderer.setStyle(document.body, 'overflow-y', 'scroll');
  }

  public hideEstateRecommendationModal() {
    this.showInfo = false;
  }
  public showEstateRecommendationModal() {
    this.showInfo = true;
  }

  public changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
