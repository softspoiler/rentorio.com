import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import { ISession } from 'app/store/session/session.interface';
import { GlobalNotification } from 'app/model/global.notifications';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/core';

@Component({
  selector: 'app-global-notifications',
  templateUrl: './global.notifications.component.html',
  styleUrls: ['./global.notifications.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.3s ease-out', style({ opacity: '1' })),
      ]),
      transition(':leave', [
        style({ 'opacity': '1' }),
        animate('.2s ease-out', style({ opacity: '0' }))
      ])
    ]),
  ],
})
export class GlobalNotificationsComponent implements OnInit {
  @select() public session$: Observable<ISession>;
  public notifications: any = [];

  constructor(private ngRedux: NgRedux<ISession>, private sanitizer: DomSanitizer, private cookieService: CookieService) {
    this.session$.subscribe((val) => {
      if (!val['isAuthenticated'] && this.notifications) {
        this.notifications = null;
        return;
      }
      if (val['globalNotifications'] && val['globalNotifications'] !== this.notifications) {
        this.notifications = val['globalNotifications'];
        this.notifications.map((ntf) => {
          ntf.message = this.sanitizer.bypassSecurityTrustHtml(ntf.message);
        });
      }

    });
  }

  public closeNotifications(id: number) {
    this.notifications = this.notifications.filter((ntf) => {
      return ntf.id !== id;
    });
    let viewedNotificationsId = this.cookieService.get('viewedNotificationsId').split(',') || [];
    viewedNotificationsId.push(id.toString());

    let expired = new Date();
    let time = expired.getTime();
    time += 600 * 1000;
    expired.setTime(time);

    this.cookieService.set(id.toString(), id.toString(), expired, '/');
    this.cookieService.set('viewedNotificationsId', viewedNotificationsId.join(), expired, '/');

    console.log('viewedNotificationsID', this.cookieService.get('viewedNotificationsId'));
    console.log(this.cookieService.getAll());
  }

  ngOnInit() {
  }
}
