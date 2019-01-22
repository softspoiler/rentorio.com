import { CustomFile } from './../../../../model/customFile';
import { Component, OnInit } from '@angular/core';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { UploadedImage } from './../../../../model/uploaded.image.model';
import { ImageUploadService } from './../../../../service/image.upload.service';
import { UserFacadeService } from './../../../../service/user.facade.service';
import { Uploader } from 'angular2-http-file-upload';
import { UploadAvatarItem } from './../../../../model/upload.avatar.item';
import { Constants } from './../../../../service/constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { ISession } from './../../../../store/session/session.interface';
import { UPDATE_USER_AVATAR } from './../../../../store/actions';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'profile-photo',
  templateUrl: './profile.photo.component.html',
  styleUrls: ['./profile.photo.component.css']
})
export class ProfilePhotoComponent implements OnInit {
  @select() public session$: Observable<ISession>;
  public image: any = {};
  public isMouseOver: Boolean;
  public imgType = 'avatar';
  public imageChanged: Boolean;
  public deleteAttempt: Boolean = false;

  constructor(
    private uploadService: ImageUploadService,
    private router: Router,
    private userService: UserFacadeService,
    private ngRedux: NgRedux<IAppState>
  ) {
    this.image.avatar = this.ngRedux.getState().session.avatar;
  }

  public handleDrop(e) {
    e.preventDefault();
    this.handleInputChange(e);
  }

  public handleInputChange(e) {
    if (e.dataTransfer && e.dataTransfer.files.length !== 0 || e.target.files.length !== 0) {
      this.imageChanged = true;
      const file: File = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      const imageType = /image\/gif|image\/jpg|image\/jpeg|image\/png/;
      if (imageType.test(file.type)) {
        // this.imagePreview(file);
        this.imageUpload(file);
      }
    }
  }

  // public imagePreview(file: File) {
  //   const reader: FileReader = new FileReader();
  //   reader.onload = function (ev) {
  //     const img = ev.target;
  //     // this.image.preview = img.result;
  //   }.bind(this);
  //   reader.readAsDataURL(file);
  // }
  private isJSON(val) {
    try {
      JSON.parse(val);
    } catch (e) {
      return false;
    }
    return true;
  }

  public imageUpload(file: File): void {
    let type = file.type.toLowerCase();
    let _file;
    try {
      _file = new File([file], `${UUID.UUID()}.${type.split('/')[1]}`, {});
    } catch (e) {
      _file = new CustomFile([file], `${UUID.UUID()}.${type.split('/')[1]}`, {});
    }
    const uploadItem = new UploadAvatarItem(_file, this.userService.getAuthToken(), this.imgType);
    this.uploadService.onProgressUpload = (item, percentComplete) => {
      if (item['typeOfLoading'] === this.imgType) {
        this.image.progress = percentComplete + '%';
      }
    };
    this.uploadService.onSuccessUpload = (item, response, status, headers) => {
      if (item['typeOfLoading'] === this.imgType) {
        if (this.isJSON(response)) {
          response = JSON.parse(response);
        }
        console.log(response);
        this.ngRedux.dispatch({ type: UPDATE_USER_AVATAR, payload: response });
        console.log(this.ngRedux.getState());
        this.userService.setUserAvatar(response);
        this.image.avatar = response;
        this.image.progress = null;
        console.log('Avatar is uploaded.');
        this.imageChanged = false;
      }
    };
    this.uploadService.onErrorUpload = (item, response, status, headers) => {
      this.imageChanged = false;
      console.log(response, item, status, headers);
      if (status >= 500) {
        throw new Error('Server error');
      } else {
        throw new Error('Unknown error');
      }
    };
    this.uploadService.onCompleteUpload = (item, response, status, headers) => {
    };
    this.uploadService.upload(uploadItem);
  }

  public delete(elem: HTMLSpanElement, input: HTMLInputElement): void {
    if (this.deleteAttempt) {
      if (!this.imageChanged) {
        this.imageChanged = true;
        this.uploadService.deleteAvatar(this.imgType, this.ngRedux.getState().session.currentUser.id)
          .then(() => {
            this.userService.removeUserAvatar();
            this.ngRedux.dispatch({ type: UPDATE_USER_AVATAR, payload: {} });
            this.image = {};
            this.imageChanged = false;
            console.log(this.ngRedux.getState());
            input.value = null;
          })
          .catch((e) => {
            this.imageChanged = false;
            console.log(e);
          });
      } else {
        return;
      }
    } else {
      elem.style.display = 'inline-block'
      this.deleteAttempt = true;
    }
  }

  ngOnInit() {
  }

}
