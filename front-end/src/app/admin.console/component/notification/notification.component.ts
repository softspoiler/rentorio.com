import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService, GlobalNotification, GlobalNotificationType } from './../../service/notification.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css', '../common.css']
})
export class NotificationComponent implements OnInit {
  public notifications: GlobalNotification[];
  public currentNotification: GlobalNotification;
  public updateTable: Boolean;
  public isEditNotification: Boolean;

  constructor(private notificationService: NotificationService,private sanitizer:DomSanitizer) {
    this.getNotifications();
  }

  getNotifications() {
    this.updateTable = true;
    this.notificationService.getGlobalNotifications()
      .then((res) => {
        console.log('GlobalNotifications:', res);
        this.notifications = res;
        this.updateTable = false;
      })
      .catch((err) => {
        console.log(err);
        this.updateTable = false;
      })
  }

  createNewNotification() {
    this.isEditNotification = false;
    this.currentNotification = new GlobalNotification();
  }

  saveNewNotification(type: GlobalNotificationType, readableType: string) {
    let confirmSave = confirm(`Вы уверены что хотите сохранить уведомление, как ${readableType}?`);
    if (confirmSave) {
      this.currentNotification.type = GlobalNotificationType[GlobalNotificationType[type]];
      if (this.isEditNotification) {
        this.updateNotification();
      } else {
        console.log('Type: ' + this.currentNotification.type);
        this.notificationService.createGlobalNotification(this.currentNotification)
          .then((res) => {
            console.log('Notification created');
            this.resetCurrentNotification();
            this.getNotifications();
          })
          .catch((err) => {
            console.log('Notification create error: ', err);
          });
      }
    }
  }

  resetCurrentNotification() {
    this.currentNotification = null;
  }

  getNotification(id: number) {
    let confirmEdit = confirm(`Вы уверены что хотите изменить уведомление ID: ${id}`);
    if (confirmEdit) {
      this.isEditNotification = true;
      this.notificationService.getGlobalNotification(id)
        .then((res) => {
          console.log('get notification by id: success')
          this.currentNotification = res;
        })
        .catch((err) => {
          console.log(`get notification by id: ${id} fail:', err`)
        });
    };
  }
 
  deleteNotification(id: number) {
    let confirmDelete = confirm(`Вы уверены что хотите удалить уведомление ID: ${id}`);
    if (confirmDelete) {
      this.notificationService.deleteGlobalNotification(id)
        .then((res) => {
          console.log('notification deleted')
          this.getNotifications();
        })
        .catch((err) => {
          console.log('notification delete fail:', err);
        });
    };
  }

  // archiveNotification(id: number) {
  //   let confirmArchive = confirm(`Вы уверены что хотите архивировать уведомление ID: ${id}`);
  //   if (confirmArchive) {
  //     this.notificationService.archiveGlobalNotification(id)
  //       .then((res) => {
  //         console.log('notification archived')
  //         this.getNotifications();
  //       })
  //       .catch((err) => {
  //         console.log('notification archive fail:', err);
  //       });
  //   };
  // }

  updateNotification() {
    this.notificationService.editGlobalNotification(this.currentNotification)
      .then(() => {
        console.log(`notification ID: ${this.currentNotification.id} update success`);
        this.resetCurrentNotification();
        this.getNotifications();
      })
      .catch((err) => {
        console.log(`notification ID: ${this.currentNotification.id} update fail:`, err);
      });
  }

  ngOnInit() {
  }

}
