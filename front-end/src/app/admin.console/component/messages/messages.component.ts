import { UserService } from './../../service/user.service';
import { MessageService } from './../../service/message.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css', '../common.css']
})

export class MessagesComponent implements OnInit {
  public messages: SupportMessage;
  public currentPage: Number = 1;
  public totalPages: number;
  public showFullMessage: Boolean;
  public fullMessage: String;
  public id: number;
  public showUserProfile: Boolean;
  public updateTable: Boolean;
  public filter: any = {
    registered: false,
    anonymous: false,
    archived: false,
    type: '',
    pageSize: 10,
    pageNumber: 0,
  };

  constructor(private messageService: MessageService, private userService: UserService) { }

  ngOnInit() {
    this.getMessages(1);
  }

  public getMessages(page: number) {
    this.filter.pageNumber = page - 1;
    this.currentPage = page;
    this.updateTable = true;
    this.messageService.getMessages(this.filter)
      .then((res) => {
        this.totalPages = res.pageRequest.totalPages;
        this.messages = res.supportMessages;
        this.updateTable = false;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public setupReadableMessageDate(timestamp: number): string {
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

  public check(property: string) {
    this.filter[property] = !this.filter[property];
    this.getMessages(1);
  }

  public deleteMessage(messageId) {
    let question = confirm('Вы Уверены что хотите УДАЛИТЬ сообщение?');
    if (question) {
      this.messageService.removeMessage(messageId)
        .then((res) => {
          this.getMessages(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  public archiveMessage(messageId: number) {
    let question = confirm('Вы Уверены что хотите АРХИВИРОВАТЬ сообщение?');
    if (question) {
      this.messageService.archiveMessage(messageId)
        .then((res) => {
          this.getMessages(1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}

class SupportMessage {
  id: number;
  who: string;
  email: string;
  userId: number;
  type: string;
  message: String;
  timestamp: number;
  isArchived: Boolean;
}
