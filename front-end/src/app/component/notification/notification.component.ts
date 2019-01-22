import { UserFacadeService } from './../../service/user.facade.service';
import { UPDATE_NOTIFICATIONS_NUMBER } from './../../store/actions';
import { ISession } from './../../store/session/session.interface';
import { NgRedux } from '@angular-redux/store';
import { NotificationService } from './../../service/notification.service';
import { Component, OnInit, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  public notifications: any;
  @Input() public isChild: Boolean;
  @Output() public openModal: EventEmitter<any> = new EventEmitter();
  public showInfo: Boolean;

  constructor(
    private notificationService: NotificationService,
    private ngRedux: NgRedux<ISession>,
    public translate: TranslateService,
    public sanitizer: DomSanitizer
  ) { }

  public notificationViewed(id: number) {
    let _notifications = [];
    this.notificationService.notificationViewed(id)
      .then(() => {
        this.notifications = this.notifications.map((item) => {
          if (item.id === id) {
            item.viewed = true;
            return item;
          } else if (!item.viewed) {
            _notifications.push(item);
          }
          return item;
        });
        this.ngRedux.dispatch({ type: UPDATE_NOTIFICATIONS_NUMBER, payload: _notifications.length });
      })
      .catch((err) => {
        console.log('NotificationViewed error: ' + err);
      });
  }

  public notificationBLockOnClick(event) {
    if (event.target.classList.contains('estate-recommendation')) {
      if (this.isChild) {
        this.openModal.emit();
      } else {
        this.showInfo = true;
      }
    }

  }

  public getUserNotifications() {
    this.notificationService.getUserNotifications()
      .then((res) => {
        this.notifications = res;
        for(let i = 0;i<res.length;i++){
          let message = this.sanitizer.bypassSecurityTrustHtml(this.notifications[i].message);
          this.notifications[i].message = message;
        }
      })
      .catch((err) => {
        console.log('Get notifications error:' + err);
      });
  }

  public removeNotification(id: number) {
    this.notificationService.removeNotification(id)
      .then(() => {
        let notification: any = {},
          viewedNotifications: Object[] = [];
        this.notifications = this.notifications.filter((item) => {
          if (item.id !== id) {
            if (!item.viewed) {
              viewedNotifications.push(item);
            }
            return item;
          } else {
            notification = item;
          }
        });
        if (!notification.viewed) {
          this.ngRedux.dispatch({ type: UPDATE_NOTIFICATIONS_NUMBER, payload: viewedNotifications.length });
        }
      })
      .catch((err) => {
        console.log('Remove notifications error: ' + err);
      });
  }

  public timestampToDate(timestamp: number): string {
    let date = new Date(timestamp),
      day, month, year;
    date.getDate() < 10 ? day = '0' + date.getDate() : day = date.getDate();
    date.getMonth() + 1 < 10 ? month = '0' + (date.getMonth() + 1) : month = date.getMonth() + 1;
    date.getFullYear() < 10 ? year = '0' + date.getFullYear() : year = date.getFullYear();
    return day + '.' + month + '.' + year;
  }

  hideEstateRecommendationModal() {
    this.showInfo = false;
  }

  ngOnInit() {
    this.getUserNotifications();
  }

}
