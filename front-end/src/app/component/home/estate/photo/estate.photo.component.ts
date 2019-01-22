import { UserActionService } from './../../../../service/user.action.service';
import { ImageDirective } from './../../shared/image/image.directive';
import { RealEstate } from './../../../../model/real.estate.model';
import { UPDATE_REAL_ESTATE } from './../../../../store/actions';
import { IAppState } from './../../../../store/state';
import { NgRedux } from '@angular-redux/store';
import { Component, OnInit, OnDestroy, Inject, Injectable, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { UploadedImage } from './../../../../model/uploaded.image.model';
import { DOCUMENT } from '@angular/platform-browser';
import { ImageUploadService } from './../../../../service/image.upload.service';
import { Uploader } from 'angular2-http-file-upload';
import { Router } from '@angular/router';
import { UploadImageItem } from './../../../../model/upload.image.item';
import { UserFacadeService } from './../../../../service/user.facade.service';
import { UUID } from 'angular2-uuid';
import * as watermark from 'watermarkjs';
import { EstateDataChangesService } from './../../../../service/estate.data.changes.service';
import { IEstate } from './../../../../store/estate/estate.interface';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { CustomFile } from 'app/model/customFile';

@Component({
  selector: 'app-estate-photo',
  templateUrl: './estate.photo.component.html',
  styleUrls: ['./estate.photo.component.css', '../common.css']
})

export class EstatePhotoComponent implements OnInit, OnDestroy {
  @ViewChild('invalidModal') public invalidPhotoModal: ElementRef;
  public invalidPhotos: any[] = [];
  @select() public estate$: Observable<IEstate>;
  public images: any[] = [];
  public imgType = 'image';
  public realEstate: RealEstate;
  public isMouseOver: Boolean;
  public deleteAttempt: Boolean;
  public imageLoading: any[] = [];

  constructor(
    @Inject(DOCUMENT) private document: any,
    private uploadService: ImageUploadService,
    private ngRedux: NgRedux<IAppState>,
    private router: Router,
    private userService: UserFacadeService,
    private dataChangesService: EstateDataChangesService,
    private renderer: Renderer2,
    private userActionService: UserActionService
  ) { }

  public handleDrop(e) {
    e.preventDefault();
    this.handleFiles(e);
  }

  public handleFiles(e) {
    let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    console.log(files);
    const imageType = /image\/gif|image\/jpg|image\/jpeg|image\/png/;
    let filesArr = [];
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      if (imageType.test(file.type) && this.isValidPhotoSize(file)) {
        filesArr.push(file);
        let filesize = (file.size / 1024 / 1024).toFixed(3) + "MB";
        let filename = file.name;
        this.userActionService.sendUserAction({ 'img': filename, 'size': filesize });
      };
    };
    if (!!this.invalidPhotos.length) {
      this.invalidPhotos.forEach((item, index) => {
        this.imagePreview(index, item, true);
      });
      this.showModal(this.invalidPhotoModal);
    }
    filesArr.forEach((file, index) => {
      let j = this.images.length;
      this.images.push({});
      this.images[j].file = file;
      this.imagePreview(j, file);
      this.imageUpload(file);
    });
  }

  public imagePreview(i, file, invalidPhoto?: Boolean) {
    const reader: FileReader = new FileReader();
    reader.onload = function (ev) {
      const img = ev.target;
      if (invalidPhoto) {
        this.invalidPhotos[i].preview = img.result;
        return;
      }
      this.images[i].preview = img.result;
    }.bind(this);
    reader.readAsDataURL(file);
  }

  setSizeOfWatermarkElement(height, width) {
    let dimensions: any = {};
    dimensions.topOffset = (height / 100) * 25;
    dimensions.leftOffset = (width / 100) * 10;
    dimensions.fontSize = (height / 100) * 5;
    return dimensions;
  }

  private isValidPhotoSize(file: File): Boolean {
    let fileSize = file.size / 1024 / 1024;
    if (fileSize > 5) {
      this.invalidPhotos.push(file);
      return false;
    }
    return true;
  }

  public imageUpload(file: File): void {
    let type = file.type.toLowerCase();
    let reader = new FileReader();
    let maxWidth = 2000;
    let maxHeight = 1000;

    reader.onload = (e) => {
      let img = new Image();
      img.onload = (e) => {
        if (e.target['naturalHeight'] > maxHeight || e.target['naturalWidth'] > maxWidth) {
          let canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          let dataurl = canvas.toDataURL(type);
          let resizedImg = new Image()
          resizedImg.src = dataurl;
          resizedImg.onload = (e) => {
            this.addWatermarksAndUploadImage(file, resizedImg, e, type)
          }
        } else {
          this.addWatermarksAndUploadImage(file, img, e, type);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  public addWatermarksAndUploadImage(file, img, e, type) {
    let text = 'RENTORIO.com';
    let dimensions = this.setSizeOfWatermarkElement(e.target['naturalHeight'], e.target['naturalWidth']);
    function setCoords(val) {
      return () => {
        return val;
      };
    }
    this.imageLoading.push(true);
    watermark([img])
      .blob(watermark.text.atPos(setCoords(30), setCoords(dimensions.topOffset), text, `${dimensions.fontSize}px Roboto`, '#fff', 0.6))
      .render()
      .blob(watermark.text.atPos(setCoords(dimensions.leftOffset * 3), setCoords(dimensions.topOffset * 3), text, `${dimensions.fontSize}px Roboto`, '#fff', 0.6, dimensions.topOffset))
      .render()
      .blob(watermark.text.atPos(setCoords(dimensions.leftOffset * 6), setCoords(dimensions.topOffset), text, `${dimensions.fontSize}px Roboto`, '#fff', 0.6, dimensions.topOffset * 3, dimensions.leftOffset * 4))
      .render()
      .blob(watermark.text.atPos(setCoords(dimensions.leftOffset * 9), setCoords(dimensions.topOffset * 3), text, `${dimensions.fontSize}px Roboto`, '#fff', 0.6, dimensions.topOffset))
      .then((blob) => {
        let _file;
        try {
          _file = new File([blob], `${UUID.UUID()}.${type.split('/')[1]}`, {});
        } catch (e) {
          _file = new CustomFile([blob], `${UUID.UUID()}.${type.split('/')[1]}`, {});
        }
        const uploadItem = new UploadImageItem(_file, this.userService.getAuthToken(), this.imgType);
        this.images.forEach((image) => {
          if (image.file && image.file === file) {
            image.file = _file;
          }
        });

        this.uploadService.upload(uploadItem);
        console.log(this.images);
        this.uploadService.onProgressUpload = (item, percentComplete) => {
          this.images.forEach((image, index) => {
            if (image.file && image.file === item.file) {
              image.progress = percentComplete + '%';
            }
          });
        };

        this.uploadService.onSuccessUpload = (item, response, status, headers) => {
          console.log("onSuccessUpload");
          if (item['typeOfLoading'] === this.imgType) {
            this.images.forEach((image, index) => {
              if (image.file && image.file === item.file) {
                image.uploadedImg = response;
                image.loaded = true;
                this.imageLoading.splice(0, 1);
                setTimeout(() => {
                  image.loaded = false;
                }, 3000)
                console.log(response);
                this.updatePhotosState();
              }
            });
          }
        };

        this.uploadService.onErrorUpload = (item, response, status, headers) => {
          console.log('onError');
          this.images.forEach((image, index) => {
            if (image.file && image.file === item.file) {
              this.images.splice(index, 1);
              this.imageLoading.splice(0, 1);
              console.log(response, item, status, headers);
              if (status >= 500) {
                throw new Error('Server error');
              } else {
                throw new Error('Unknown error');
              }
            }
          });
        };

        this.uploadService.onCompleteUpload = (item, response, status, headers) => {
          console.log('onCompleteUpload');
          this.images.forEach((image, index) => {
            if (image.file && image.file === item.file) {
              delete image.progress;
            };
          });
        };
      });
  }

  public deleteImage(i): void {
    if (this.deleteAttempt) {
      const tmpImg = this.images.splice(i, 1);
      this.updatePhotosState();
      this.deleteAttempt = false;
    } else {
      this.deleteAttempt = true;
    }
    // this.uploadService.deleteImage(this.imgType, tmpImg[0].uploadedImg.imageId);
  }

  public updatePhotosState(): void {
    if (this.images.length) {
      const tmpImg = [];
      this.images.forEach((item) => {
        if (typeof item.uploadedImg === 'string') {
          tmpImg.push(JSON.parse(item.uploadedImg));
        } else {
          tmpImg.push(item.uploadedImg);
        }
      });
      this.realEstate.photos = tmpImg;
    } else {
      this.realEstate.photos = null;
    }
    this.ngRedux.dispatch({ type: UPDATE_REAL_ESTATE, payload: this.realEstate });
    console.log('Redux state after update:');
    console.log('=============================');
    console.log(this.ngRedux.getState().estate);
    console.log('=============================');
    this.isDataChanged(true);
  }

  public isDataChanged(changed: boolean) {
    this.dataChangesService.emitChange(changed);
  }

  public showModal(modal: ElementRef) {
    this.renderer.addClass(modal.nativeElement, 'show-modal');
    this.renderer.addClass(modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  public hideModal(modal: ElementRef) {
    this.renderer.removeClass(modal.nativeElement, 'show-modal');
    this.renderer.removeClass(modal.nativeElement.querySelector('.modal-inner'), 'show-modal-inner');
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  ngOnInit() {
    this.realEstate = this.ngRedux.getState().estate.realEstate;
    if (this.realEstate.photos) {
      this.realEstate.photos.forEach((photo) => {
        this.images.push({ uploadedImg: photo });
      });
    }
  }
  ngOnDestroy() {
    if (this.invalidPhotoModal) {
      this.hideModal(this.invalidPhotoModal);
    }
  }
}
