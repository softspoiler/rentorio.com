import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import { UploadedImage } from './../model/uploaded.image.model';
import { Router } from '@angular/router';
import { Uploader } from 'angular2-http-file-upload';
import { UserStorageService } from './user.storage.service';

@Injectable()
export class ImageUploadService extends Uploader {
  constructor(
    private restangular: Restangular,
    private storageService: UserStorageService,
    private router: Router
  ) {
    super();
  }

  public deleteImage(imgType: string, imgId: number): Promise<any> {
    return this.restangular.all('remove').one(imgType, imgId)
      .remove({}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then(() => {
        console.log(JSON.stringify('Image is deleted.'));
      }, (error) => {
        console.log(JSON.stringify(error));
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      });
  }

  public deleteAvatar(imgType: string, userId: number): Promise<any> {
    return this.restangular.all('remove').one(imgType, userId)
      .remove({}, this.storageService.getAuthTokenWithCheck()).toPromise()
      .then(() => {
        console.log(JSON.stringify('Image is deleted.'));
      }, (error) => {
        console.log(JSON.stringify(error));
        if (error.status >= 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Unknown error');
        }
      });
  }
}
