import { CustomFile } from 'app/model/customFile';
import { ProfileService } from './../../../service/profile.service';
import { ChatService } from './../../../service/chat.service';
import { IAppState } from './../../../store/state';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MessageDto } from './../../../model/chat.message.model';
import { User } from './../../../model/user.model';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { ISession } from './../../../store/session/session.interface';
import { ComplaintComponent } from './../../../component/complaint/complaint.component';
import { CallService } from './../../../service/call.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PopupService } from './../../../service/popup.service';
import { EstateService } from './../../../service/estate.service';
import { NotFoundEstateError } from './../../../service/error/not.found.estate.error';
import { CallRecordService } from 'app/service/call.record.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  @select() public session$: Observable<ISession>;
  @ViewChild('audio') public audio: ElementRef;
  public allChats: any[];
  public chatsWithNewMessages: any[];
  public newMessagesCount: number;
  public chats: Array<any>;
  public currentChat: any;
  public messages: Array<any>;
  public filterNewMessages: boolean;
  public currentDate: Date;
  public newMessage: string;
  public currentUser: User;
  public chatUser: any;
  public showProfile: boolean;
  public showEstate: boolean;
  public tenantProfile: any;
  public showProfileDetails = false;
  public loadList: Boolean = false;
  public loadMessages: Boolean = false;
  public refreshViewHendler: any;
  public reloadMessagesCountHendler: any;
  @ViewChild(ComplaintComponent) ComplaintComponent: ComplaintComponent;
  public typeOfError: string;
  public showNew: number;
  public firstLoad: boolean;
  public showChatsList: boolean = false;
  public estateDetails: any;
  public showRecordModal: Boolean;
  public recordLoading: Boolean;

  constructor(private profileService: ProfileService,
    private chatService: ChatService,
    private callService: CallService,
    private ngRedux: NgRedux<IAppState>,
    private router: Router,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private estateService: EstateService,
    private callRecordService: CallRecordService
  ) {
    this.session$
      .subscribe((value) => {
        if (value['isAuthenticated']) {
          this.currentUser = this.ngRedux.getState().session.currentUser;
        }
      });
  }

  public showAllChats() {
    this.loadList = true;
    this.chatService.getAllUserChats()
      .then((chats) => {
        this.allChats = chats;
        this.chats = this.allChats;
        this.filterNewMessages = false;
        this.loadList = false;
        if (this.chats && this.chats.length) {
          this.currentChat = this.chats[0];
          this.showCurrentChat(this.chats[0], true);
        } else {
          this.loadMessages = false;
          this.messages = null;
          this.firstLoad = false;
          this.currentChat = null;
        }
      }).catch((e) => {
        this.loadList = false;
        console.log(e);
      });
    this.showProfileDetails = false;
  }

  public showChatsWithNewMessages() {
    this.typeOfError = '';
    this.loadList = true;
    this.chatService.getAllChatsWithNewMessages()
      .then((chats) => {
        this.chatsWithNewMessages = chats;
        this.chats = this.chatsWithNewMessages;
        this.filterNewMessages = true;
        this.loadList = false;
        if (this.chats && this.chats.length) {
          this.currentChat = this.chats[0];
          this.showCurrentChat(this.chats[0], true);
        } else {
          this.loadMessages = false;
          this.messages = null;
          this.firstLoad = false;
        }
      }).catch((e) => {
        this.loadList = false;
        console.log(e);
      });
    this.showProfileDetails = false;
  }

  public getNewMessagesCount() {
    this.chatService.getNewMessagesCount()
      .then((count) => {
        this.newMessagesCount = count;
      }).catch((e) => {
        console.log(e);
      });
  }

  public setUser(chat: any) {
    if (this.currentUser && chat.creator.id === this.currentUser.id) {
      return (chat.collocutor.firstName || '') + ' ' + (chat.collocutor.middleName || '') + ' ' + (chat.collocutor.lastName || '');
    };
    if (this.currentUser && chat.collocutor.id === this.currentUser.id) {
      return (chat.creator.firstName || '') + ' ' + (chat.creator.middleName || '') + ' ' + (chat.creator.lastName || '');
    }
  }

  public setAvatar(chat: any) {
    if (chat && chat.creator.id === this.currentUser.id && chat.collocutor.avatar) {
      return chat.collocutor.avatar.thumbnailUrl;
    };
    if (chat && chat.collocutor.id === this.currentUser.id && chat.creator.avatar) {
      return chat.creator.avatar.thumbnailUrl;
    }
  }

  public showCurrentChat(chat: any, load: Boolean): void {
    this.loadMessages = load;
    this.estateDetails = null;
    this.typeOfError = '';
    if (chat.collocutor.id === this.currentUser.id) {
      this.estateService.getEstate(chat.estateId)
        .then((res) => {
          console.log(res);
          this.estateDetails = {};
          this.estateDetails.shortDescription = res.shortDescription;
          this.estateDetails.address = res.address.addressLine1;
        })
    }


    this.chatService.getAllChatMessages(chat.id)
      .then((res) => {
        this.messages = res;
        console.log(this.messages);
        this.firstLoad = false;
        if (chat.btnLoading) {
          this.showChatsList = false;
          chat.btnLoading = false;
        };

        this.loadMessages = false;
        ;
        this.messages.forEach((message, index) => {
          if (message.user.id !== this.currentUser.id) {
            if (!message.viewed) {
              this.chatService.messageViewed(message.chatId, message.id)
                .then((result) => {
                  if (index === this.messages.length - 1) {
                    this.getNewMessagesCount();
                  };
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          }
        });
      })
      .catch((e) => {
        this.loadMessages = false;
        console.log(e);
      });


    if (chat.creator.id === this.currentUser.id) {
      this.chatUser = chat.collocutor;
    } else {
      this.chatUser = chat.creator;
    }
  }

  public showDate(i: number) {
    return i === 0 || this.messages[i].timestamp.getFullYear() !== this.messages[i - 1].timestamp.getFullYear()
      || this.messages[i].timestamp.getMonth() !== this.messages[i - 1].timestamp.getMonth()
      || this.messages[i].timestamp.getDate() !== this.messages[i - 1].timestamp.getDate();
  }

  public checkDay(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  }
  public checkYear(date) {
    const year = new Date().getFullYear();
    return date.getFullYear() === year;
  }

  public sendMessage(chat: any, estateId: number, message: string) {
    if (this.currentUser.id !== this.chatUser.id && message) {
      let messageDto: MessageDto;
      messageDto = { estateId, message };
      this.chatService.sendMessage(chat.id, messageDto)
        .then(() => {
          this.showCurrentChat(chat, true);
          this.newMessage = '';
        })
        .catch((e) => {
          if (e.message === 'NotFoundEstateError') {
            this.typeOfError = 'NotFoundEstateError';
            this.newMessage = '';
          }
        });
    }
  }

  switchChat(chat: any): void {
    if (!this.showChatsList) {
      this.showCurrentChat(chat, true);
    } else {
      this.showCurrentChat(chat, false);
    }
    this.currentChat = chat;
    this.showProfileDetails = false;
    chat.btnLoading = true;
  }

  public showTenantProfile(userId: number) {
    this.profileService.getTenantProfile(userId)
      .then((profile) => {
        this.tenantProfile = profile;
        console.log(this.tenantProfile);
        this.showProfileDetails = true;
      });
  }

  public deleteChat(chatId: number) {
    this.chatService.deleteChat(chatId)
      .then(() => {
        this.chats = this.chats.filter((chat) => {
          return chat.id !== chatId;
        });
        if (this.chats && this.chats.length) {
          this.currentChat = this.chats[0];
          this.showCurrentChat(this.chats[0], true);
        } else if (this.allChats && this.allChats.length) {
          this.showAllChats();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public counter(maxValue: number, value: string): number {
    if (value) {
      return maxValue - value.length;
    } else {
      return maxValue;
    }
  }

  public refreshView() {
    this.refreshViewHendler = setInterval(() => {
      this.chatService.getAllUserChats()
        .then((chats) => {
          this.allChats = chats;
          if (!this.filterNewMessages) {
            this.chats = this.allChats;
          }
          if (this.chats && this.chats.length) {
            if (this.currentChat) {
              if (this.showChatsList) {
                this.showCurrentChat(this.currentChat, false);
              } else {
                this.showCurrentChat(this.currentChat, false);
              }
            } else {
              this.currentChat = this.chats[0];
            }
          }

        }).catch((e) => {
          console.log(e);
        });
    }, 30000)
  }

  public reloadMessagesCount() {
    this.reloadMessagesCountHendler = setInterval(() => {
      this.getNewMessagesCount();
    }, 30000);
  }

  public complaintHandler() {
    this.ComplaintComponent.showComplaintModalWithCheck();
  }

  public call() {
    this.popupService.popupCall.next({ user: "landlord", chatId: this.currentChat.id });
  }
  ngOnInit() {
    this.firstLoad = true;
    this.showNew = this.route.snapshot.queryParams['showNew'] || 0;
    console.log(this.showNew);
    this.loadMessages = true;
    if (Number(this.showNew) > 0) {
      this.showChatsWithNewMessages();
    } else {
      this.showAllChats();
    }
    this.getNewMessagesCount();
    this.refreshView();
    this.reloadMessagesCount();
  }

  ngOnDestroy() {
    clearInterval(this.refreshViewHendler);
    clearInterval(this.reloadMessagesCountHendler);
    if (this.audio) {
      this.showRecordModal = false;
      this.audio.nativeElement.pause();
    }
  }

  public showPlayer(id) {
    this.recordLoading = true;
    this.callRecordService.getUserAudioRecord(id)
      .then((res) => {

        if (this.showRecordModal) {
          let record;
          try {
            record = new File([res], 'record.mp3', { type: 'audio/mp3' })
          }
          catch (e) {
            record = new CustomFile([res], 'record.mp3', { type: 'audio/mp3' })
          }
          let reader = new FileReader();
          reader.readAsDataURL(record)
          reader.onload = (val) => {
            this.audio.nativeElement.src = val.target['result'];
            this.audio.nativeElement.play();
          }
          this.recordLoading = false;
        }
      })
      .catch((err) => {
        this.recordLoading = false;
        console.log(err);
      })
  }
}


