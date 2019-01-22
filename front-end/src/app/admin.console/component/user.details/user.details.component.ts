import { Observable } from 'rxjs/Observable';
import { ConsoleUserProfile, UserService } from './../../service/user.service';
import { Component, Input, OnChanges, EventEmitter, Output, ViewChild } from '@angular/core';
import { PlayerComponent } from 'app/admin.console/component/player/player.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user.details.component.html',
  styleUrls: ['./user.details.component.css']
})
export class UserDetailsComponent implements OnChanges {
  public userProfile: ConsoleUserProfile;
  public tabsNumber: Number = 1;
  @Input() public isExtendedDetails: Boolean;
  @Input() public userId: number;
  @Output() closeEvent: EventEmitter<any> = new EventEmitter;
  @ViewChild(PlayerComponent) public playerComponent: PlayerComponent;
  public userAvatar: any;
  public userChatsCollocutors: Object[];
  public userChat: Object;
  public userEstates: any;

  constructor(private userService: UserService) { }

  public getUserProfile(userId: number): void {
    this.userService.getUserProfile(userId)
      .then((res) => {
        this.userProfile = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public getUserAvatar(userId: number): void {
    this.userService.getUserAvatar(userId)
      .then((res) => {
        this.userAvatar = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public getUserChats() {
    this.userService.getUserChats(this.userId)
      .then((res) => {
        this.userChatsCollocutors = [];
        res.forEach(elem => {
          let obj: any = {};
          obj.createDate = this.converTimestampToReadableDate(elem.createDate);
          obj.id = elem.id;
          if (elem.collocutor.id !== this.userId) {
            obj.collocutor = elem.collocutor;
          } else {
            obj.collocutor = elem.creator;
          }
          this.userChatsCollocutors.push(obj);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public getUserChatReplies(chatId) {
    this.userService.getUserChatReplies(this.userId, chatId)
      .then((res) => {
        this.userChat = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public getUserEstates() {
    this.userService.getUserEstates(this.userId)
      .then((res) => {
        this.userEstates = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public converTimestampToReadableDate(timestamp: number): string {
    let date = new Date(timestamp),
      day, month, year, hours, minutes, seconds;
    date.getHours() < 10 ? hours = '0' + date.getHours() : hours = date.getHours();
    date.getMinutes() < 10 ? minutes = '0' + date.getMinutes() : minutes = date.getMinutes();
    date.getSeconds() < 10 ? seconds = '0' + date.getSeconds() : seconds = date.getSeconds();
    date.getDate() < 10 ? day = '0' + date.getDate() : day = date.getDate();
    date.getMonth() + 1 < 10 ? month = '0' + (date.getMonth() + 1) : month = date.getMonth() + 1;
    date.getFullYear() < 10 ? year = '0' + date.getFullYear() : year = date.getFullYear();
    return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  public showPlayer(id: string) {
    this.playerComponent.play(id);
  }

  ngOnChanges() {
    if (this.userId !== undefined) {
      this.getUserProfile(this.userId);
      this.getUserAvatar(this.userId);
    }
  }
}
