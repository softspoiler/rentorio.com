import { UserActionService } from 'app/service/user.action.service';
import { Router } from '@angular/router';
import { EDIT_REAL_ESTATE } from './../../../../store/actions';
import { DetailsService } from './../../../../service/details.service';
import { FavoriteService } from './../../../../service/favorite.service';
import { Location } from '@angular/common';
import { UserFacadeService } from './../../../../service/user.facade.service';
import { ChatService } from './../../../../service/chat.service';
import { MessageDto } from './../../../../model/chat.message.model';
import { User } from './../../../../model/user.model';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  NgZone,
  HostListener,
  Renderer2
} from '@angular/core';
import { RealEstate } from './../../../../model/real.estate.model';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryComponent } from 'ngx-gallery';
import { UploadedImage } from './../../../../model/uploaded.image.model';
import { ISession } from './../../../../store/session/session.interface';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { CallService } from './../../../../service/call.service';
import { PopupService } from './../../../../service/popup.service';
import { ISubscription } from 'rxjs/Subscription';
import { CLEAR_ESTATE } from './../../../../store/actions';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';
import { EstateService } from './../../../../service/estate.service';

@Component({
  selector: 'app-preview',
  templateUrl: './estate.preview.component.html',
  styleUrls: ['./estate.preview.component.css']
})
export class EstatePreviewComponent implements OnInit, OnDestroy, AfterViewInit {
  @select() public session$: Observable<ISession>;
  @ViewChild('order') public order: ElementRef;
  @ViewChild('estateProperty') public estateProperty: ElementRef;
  @ViewChild('modal') public modal: ElementRef;
  @ViewChild('gallery') public galleryComponent: NgxGalleryComponent;
  @ViewChild('save') save: ElementRef;
  @ViewChild('close') close: ElementRef;
  @Input() public isDetails;
  public realEstate: RealEstate | any;
  public confirmDialog = false;
  public userName: String;
  public avatar: UploadedImage;
  public shortAddress: String;
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[] = [];
  public confortProperty: number[] = [];
  public securityProperty: number[] = [];
  public latitude: number;
  public longitude: number;
  public message: '';
  public favoriteList: any = [];
  public currentUser: User;
  public landlord: any;
  public typeOfError: string;
  public isCalling: boolean;
  public loading: Boolean;
  public orderFixed: Boolean;
  public orderBottom: Boolean = false;
  public orderTopOffset: String;
  public showBackButton: Boolean;
  public estateError: String;
  public unsavedData = false;
  public subscriptionUnsavedData: ISubscription;
  public success = false;
  public callBtnLoading: Boolean;

  @HostListener('window:scroll', []) onWindowScroll() {
    if (!this.estateError) {
      this.ngZone.run(() => {
        let estatePropertyValue = this.estateProperty && this.estateProperty.nativeElement.getBoundingClientRect();
        if (estatePropertyValue) {
          if (estatePropertyValue.top >= 143 && this.orderFixed && !this.orderBottom) {
            this.orderFixed = false;
          } else if (estatePropertyValue.top <= 143 && !this.orderFixed && !this.orderBottom) {
            this.orderFixed = true;
          } else if ((estatePropertyValue.height + estatePropertyValue.top - 99) <= this.order.nativeElement.getBoundingClientRect().height + 40) {
            this.orderBottom = true;
            this.orderTopOffset = estatePropertyValue.height - this.order.nativeElement.getBoundingClientRect().height + 'px';
          } else {
            this.orderBottom = false;
          }
        }
      });
    }
  }
  constructor(
    private chatService: ChatService,
    private ngRedux: NgRedux<IAppState>,
    private userService: UserFacadeService,
    private favoriteService: FavoriteService,
    private location: Location,
    private callService: CallService,
    private detailsService: DetailsService,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private popupService: PopupService,
    private router: Router,
    private estateService: EstateService,
    private dataChangesService: EstateDataChangesService,
    private userActionService: UserActionService
  ) {
    this.unsavedData = this.dataChangesService.emitChangeSource.getValue();
    console.log(this.unsavedData);
    this.subscriptionUnsavedData = this.dataChangesService.emitChangeSource.subscribe(
      unsavedData => {
        this.unsavedData = unsavedData;
        console.log(this.unsavedData);
      });
  }

  public setupCurrentEstate() {
    this.ngZone.run(() => {
      this.realEstate = this.ngRedux.getState().estate.realEstate;
      console.log(this.realEstate);
      this.setupPhotoGallery();
      this.latitude = this.realEstate.latitude;
      this.longitude = this.realEstate.longitude;
      this.currentUser = this.ngRedux.getState().session.currentUser;
      this.landlord = this.realEstate.landlord;
      if (this.landlord) {
        this.avatar = this.landlord.avatar && this.landlord.avatar;
        console.log(this.landlord);
        this.userName = (this.landlord.firstName || '') + ' ' + (this.landlord.middleName || '');
        if (this.realEstate.estateProperties) {
          this.realEstate.estateProperties.forEach((prop) => {
            if (prop.id > 4000) {
              this.securityProperty.push(prop.id);
            } else {
              this.confortProperty.push(prop.id);
            }
          });
        }
        this.getUserFavorites();
        if (this.ngRedux.getState().search.searchResult) {
          this.showBackButton = true;
        }
      } else {
        this.avatar = this.ngRedux.getState().session.avatar;
        this.userName = (this.currentUser.firstName || '') + ' ' + (this.currentUser.middleName || '');
        if (this.realEstate.estateProperties) {
          this.realEstate.estateProperties.forEach((prop) => {
            if (prop > 4000) {
              this.securityProperty.push(prop);
            } else {
              this.confortProperty.push(prop);
            }
          });
        }
      }
      this.loading = false;
    });
  }

  public setupPhotoGallery() {
    this.galleryOptions = [
      {
        fullWidth: true,
        imagePercent: 100,
        thumbnails: false,
        imageArrows: false,
        imageSize: NgxGalleryImageSize.Cover
      }
    ];
    if (this.realEstate.photos && this.realEstate.photos[0]) {
      this.realEstate.photos.forEach((photo: UploadedImage) => {
        this.galleryImages.push({ medium: photo.imageUrl, big: photo.imageUrl });
      });
    } else {
      this.galleryImages.push({
        medium: '../../../../../assets/image/empty-photo.png',
        big: '../../../../../assets/image/empty-photo.png'
      });
    }
  }

  public isAddedToFavorite(id) {
    let added = '#ddd';
    this.favoriteList.forEach((obj) => {
      if (obj.realEstate.id === id) {
        added = '#cbb6ff';
      }
    });
    return added;
  }

  public getUserFavorites() {
    this.favoriteService.getUserFavorites()
      .then((res) => {
        this.favoriteList = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public addToFavorite(id: number): void {
    if (this.isDetails) {
      let added = false;
      let currentId = null;
      this.favoriteList.forEach((obj) => {
        if (obj.realEstate.id === id) {
          currentId = obj.id;
          added = true;
        }
      });
      if (added) {
        this.favoriteList = this.favoriteList.filter((elem) => {
          return elem.id !== currentId;
        });
        this.favoriteService.removeFromFavorite(currentId);
      } else {
        this.favoriteService.addToFavorite(id)
          .then((res) => {
            this.getUserFavorites();
          })
      }
    }
  }

  canDeactivate(): Promise<boolean> | boolean {
    console.log(this.unsavedData);
    if (!this.unsavedData || this.ngRedux.getState().estate.isNew) {
      return true;
    };
    return this.confirmChanges();
  }
  public confirmChanges(): Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.confirmDialog = true;
      this.save.nativeElement.onclick = () => {
        if (!this.realEstate.type || !this.realEstate.accommodation) {
          this.router.navigateByUrl('home/estate/general');
          this.confirmDialog = false;
          resolve(false);
          return;
        }
        if (!this.realEstate.latitude || !this.realEstate.longitude) {
          this.router.navigateByUrl('home/estate/location');
          this.confirmDialog = false;
          resolve(false);
          return;
        }
        if (this.realEstate.photos.length < 2) {
          this.router.navigateByUrl('home/estate/photo');
          this.confirmDialog = false;
          resolve(false);
          return;
        }
        if (!this.realEstate.price) {
          this.confirmDialog = false;
          resolve(false);
          return;
        }
        this.estateService.updateEstate(this.realEstate.id, this.realEstate)
          .then(() => {
            this.unsavedData = false;
            this.dataChangesService.emitChange(false);
            this.success = true;
            setTimeout(() => {
              this.confirmDialog = false;
              this.success = false;
              resolve(true);
              // this.router.navigateByUrl('/home/estate/list');
            }, 4000);
          })
          .catch((error) => {
            this.confirmDialog = false;
            resolve(false);
            alert(error);
          });
      };
      this.close.nativeElement.onclick = () => {
        this.dataChangesService.emitChange(false);
        resolve(true);
        this.ngRedux.dispatch({ type: CLEAR_ESTATE });
        console.log('Redux state after update:');
        console.log('=============================');
        console.log(this.ngRedux.getState().estate);
        console.log('=============================');
      };
    });
  }

  public getEstate(id: number) {
    this.detailsService.getEstate(id)
      .then((res) => {
        this.ngRedux.dispatch({ type: EDIT_REAL_ESTATE, payload: res });
        this.setupCurrentEstate();
      })
      .catch((err) => {
        this.ngZone.run(() => {
          this.estateError = err.message || console.log(err);
        })
      });
  }

  public counter(maxValue: number, value: string): number {
    if (value) {
      return maxValue - value.length;
    } else {
      return maxValue;
    }
  }

  public sendNewMessage(estateId: number, message: string) {
    if (this.landlord && this.currentUser && this.landlord.id !== this.currentUser.id && message) {
      let messageDto: MessageDto;
      messageDto = { estateId, message };
      this.chatService.sendNewMessage(messageDto)
        .then(() => {
          this.message = ''
          this.hideMessageModal(this.modal.nativeElement);
        })
    }
  }

  call() {
    if (this.checkUserConfirmation()) {
      this.callBtnLoading = true;
      this.estateService.getPublicPhoneNumber(this.realEstate.id)
        .then((res) => {
          if (res.phoneNumber !== null) {
            this.popupService.popupCall.next({ user: "tenant", estateId: this.realEstate.id, phoneNumber: res.phoneNumber });
          } else {
            this.popupService.popupCall.next({ user: "tenant", estateId: this.realEstate.id });
          }
          this.callBtnLoading = false;
          this.userActionService.sendUserAction({ 'call': this.realEstate.id });
        })
        .catch(() => {
          this.callBtnLoading = false;
        })
    } else {
      this.popupService.popupError.next('EmailNotConfirmedError');
      let currentUser = this.ngRedux.getState().session.currentUser;
      this.userActionService.sendUserAction({ 'tryCallWithoutConfirmation': this.realEstate.id, 'phoneConfirmed': currentUser.phoneConfirmed, 'emailConfirmed': currentUser.emailConfirmed });
    }
  }

  public checkUserConfirmation() {
    let currentUser = this.ngRedux.getState().session.currentUser;
    if (!currentUser.emailConfirmed) {
      return false;
    }
    return true;
  }

  public showMessageModal(elem: HTMLDivElement) {
    if (this.checkUserConfirmation()) {
      this.renderer.addClass(elem, 'show-modal');
      this.renderer.addClass(elem.querySelector('.modal-inner'), 'show-modal-inner');
      this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
      this.userActionService.sendUserAction({ 'messages': this.realEstate.id });
    } else {
      this.popupService.popupError.next('EmailNotConfirmedError');
      let currentUser = this.ngRedux.getState().session.currentUser;
      this.userActionService.sendUserAction({ 'trySendMessageWithoutConfirmation': this.realEstate.id, 'phoneConfirmed': currentUser.phoneConfirmed, 'emailConfirmed': currentUser.emailConfirmed });
    }
  }

  public hideMessageModal(elem: HTMLDivElement) {
    this.renderer.removeClass(elem, 'show-modal');
    this.renderer.removeClass(elem.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  public redirectHome() {
    this.router.navigateByUrl('');
  }

  ngOnDestroy() {
    if (!this.estateError && this.modal) {
      this.hideMessageModal(this.modal.nativeElement);
    }
  }

  ngAfterViewInit() {
    this.onWindowScroll();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    if (this.isDetails) {
      let id: any = this.location.path().split('/');
      if (!this.ngRedux.getState().estate.realEstate || this.ngRedux.getState().estate.realEstate.id !== id) {
        this.getEstate(Number(id[id.length - 1]));
      }
    } else {
      if (!this.ngRedux.getState().estate.realEstate) {
        this.router.navigateByUrl('/home/estate/list');
      } else {
        this.setupCurrentEstate();
      }
    }
  }

}
