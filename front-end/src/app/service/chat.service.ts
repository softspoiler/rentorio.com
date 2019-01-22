import { IgnoredByUserError } from './error/ignored.by.user.error';
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { UserStorageService } from './user.storage.service';
import { Router } from '@angular/router';
import { MessageDto } from './../model/chat.message.model';
import { PhoneNumberNotConfirmedError } from 'app/service/error/phone.number.not.comfirmed.error';
import { LandlordNotAvailableNowError } from 'app/service/error/landlord.not.available.now.error';
import { TenantNotAvailableNowError } from 'app/service/error/tenant.not.available.now.error';
import { EmailNotConfirmedError } from 'app/service/error/email.not.confirmed.error';
import { NotFoundEstateError } from 'app/service/error/not.found.estate.error';
import { PopupService } from './popup.service';
import { ResponseContentType } from '@angular/http';

@Injectable()
export class ChatService {

  constructor(
    private restangular: Restangular,
    private router: Router,
    private storageService: UserStorageService,
    private popupService: PopupService) { }

  public getNewMessagesCount(): Promise<number> {
    return this.restangular.all('chat/message/new')
      .customGET('count', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response.plain());
        return response.count;
      }, (error) => {
        console.log(error);
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public messageViewed(chatId: number, messageId: number): Promise<any> {
    return this.restangular.one('chat', chatId).one('message', messageId)
      .customPUT({}, '', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response);
        return response;
      }, (error) => {
        console.log(error);
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public sendNewMessage(messageDto: MessageDto): Promise<any> {
    return this.restangular.all('chat/message/new')
      .customPOST(messageDto, '', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response);
        return response;
      }, (error) => {
        console.log(error);
        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('LandlordNotAvailableNowException') !== -1) {
            this.popupService.popupError.next('LandlordNotAvailableNowError');
            throw new LandlordNotAvailableNowError();
          } else if (error.data.exception.indexOf('IgnoredByUserException') !== -1) {
            this.popupService.popupError.next('IgnoredByUserError');
            throw new IgnoredByUserError();
          } else if (error.status >= 500) {
            throw new Error('Server error');
          } else {
            throw new Error('Unknown error');
          }
        }
      }
      );
  }

  public getAllChatsWithNewMessages(): Promise<any> {
    return this.restangular.all('chat/new')
      .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response.plain());
        let res = response.plain();
        let chats;
        if (res.length) {
          res.sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return -1;
            }
            return 0;
          });
          chats = [res[0]];
          for (let i = 1; i < res.length; i++) {
            if (res[i].id !== res[i - 1].id) {
              chats.push(res[i]);
            }
          }

          chats = chats.sort((a, b) => {
            if (a.createDate < b.createDate) {
              return 1;
            }
            if (a.createDate > b.createDate) {
              return -1;
            }
            return 0;
          });
          chats.forEach((chat) => {
            chat.createDate = new Date(chat.createDate);
          });
        }
        return chats;

      }, (error) => {
        console.log(error);
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public getAllChatMessages(chatId: number): Promise<any> {
    return this.restangular.one('chat', chatId)
      .customGET('message', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response.plain());
        let messages;
        messages = response.plain().sort((a, b) => {
          if (a.timestamp > b.timestamp) {
            return 1;
          }
          if (a.timestamp < b.timestamp) {
            return -1;
          }
          return 0;
        });
        messages.forEach((message) => {
          message.timestamp = new Date(message.timestamp);
        });
        return messages;
      }, (error) => {
        console.log(error);
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public sendMessage(chatId: number, messageDto: MessageDto): Promise<any> {
    return this.restangular.one('chat', chatId)
      .customPOST(messageDto, 'message', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        // console.log(response);
        return response;
      }, (error) => {
        console.log(error);
       

        if (error.data !== 'undefined') {
          if (error.data.exception.indexOf('LandlordNotAvailableNowException') !== -1) {
            this.popupService.popupError.next('LandlordNotAvailableNowError');
            throw new LandlordNotAvailableNowError();
          } else if (error.data.exception.indexOf('TenantNotAvailableNowException') !== -1) {
            this.popupService.popupError.next('TenantNotAvailableNowError');
            throw new TenantNotAvailableNowError();
          } else if (error.data.exception.indexOf('IgnoredByUserException') !== -1) {
            this.popupService.popupError.next('IgnoredByUserError');
            throw new IgnoredByUserError();
          } else if (error.data.exception.indexOf('NotFoundEstateException') !== -1) {
            throw new NotFoundEstateError();
          } else if (error.status >= 500) {
            throw new Error('Server error');
          } else {
            throw new Error('Unknown error');
          }
        }
      }
      );
  }
  public getAllUserChats(): Promise<any> {
    return this.restangular.all('chat')
      .customGET('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        let chats;
        chats = response.plain().sort((a, b) => {
          if (a.createDate < b.createDate) {
            return 1;
          }
          if (a.createDate > b.createDate) {
            return -1;
          }
          return 0;
        });
        chats.forEach((chat) => {
          chat.createDate = new Date(chat.createDate);
        });
        console.log(chats);
        return chats;
      }, (error) => {
        console.log(error);
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

  public deleteChat(chatId: number): Promise<any> {
    return this.restangular.one('chat', chatId)
      .customDELETE('', {}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then((response) => {
        console.log(response);
        return response;
      }, (error) => {
        console.log(error);
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      }
      );
  }

}
