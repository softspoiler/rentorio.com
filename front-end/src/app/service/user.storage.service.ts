import { Injectable } from '@angular/core';
import { Constants } from './constants';
import { UploadedImage } from './../model/uploaded.image.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class UserStorageService {

  constructor( private cookieService: CookieService ) { }

  public setUserAvatar(avatar: UploadedImage): void {
    localStorage.setItem(Constants.USER_AVATAR, JSON.stringify(avatar));
  }

  public getUserAvatar(): UploadedImage {
    return JSON.parse(localStorage.getItem(Constants.USER_AVATAR));
  }

  public removeUserAvatar(): void {
    localStorage.removeItem(Constants.USER_AVATAR);
  }

  public setAuthToken(token: string): void {
    localStorage.setItem(Constants.AUTH_TOKEN, token);
  }

  public getAuthToken(): string {
    return localStorage.getItem(Constants.AUTH_TOKEN);
  }

  public getAuthTokenWithCheck(): object {
    if (this.getAuthToken()) {
      return { 'X-Auth-Token': this.getAuthToken() };
    } 
  }

  public removeAuthToken(): void {
    localStorage.removeItem(Constants.AUTH_TOKEN);
  }

  public setWatchedList(watchedList: any): void {
    if (watchedList.length) {
      var date = new Date;
      date.setMonth(date.getMonth() + 1);
      this.cookieService.set(Constants.WATCHED_LIST, JSON.stringify(watchedList), date);
    } else {
      this.cookieService.delete(Constants.WATCHED_LIST);
    }
  }
  public checkWatchedList(): boolean {
    return this.cookieService.check(Constants.WATCHED_LIST);
  }
  
  public getWatchedList(): any {
    return JSON.parse(this.cookieService.get(Constants.WATCHED_LIST));
  }

public setEstateRemember(): any {
  localStorage.setItem(Constants.ESTATE_REMEMBER, JSON.stringify(true));
}
  
public getEstateRemember(): any {
  return JSON.parse(localStorage.getItem(Constants.ESTATE_REMEMBER));
}

}
