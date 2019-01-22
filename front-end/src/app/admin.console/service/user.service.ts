import { UserStorageService } from './../../service/user.storage.service';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  constructor(private restangular: Restangular, private userStorageService: UserStorageService) { }

  public getUserProfile(userId: number): Promise<any> {
    return this.restangular.one('console/users').customGET(userId, {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((res) => {
        return this.sutupUserProfileResponse(res);
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error')
        } else {
          throw new Error('Unknow error' + error)
        }
      });
  }

  public getUserAvatar(userId: number): Promise<any> {
    return this.restangular.one('console/users')
      .customGET(userId + '/avatar', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error')
        } else {
          throw new Error('Unknow error' + error)
        }
      });
  }

  public getUserChats(userId: number): Promise<any> {
    return this.restangular.one('console/users')
      .customGET(userId + '/chats', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((res) => {
        return res.plain();
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error')
        } else {
          throw new Error('Unknow error' + error)
        }
      });
  }

  public getUserChatReplies(userId: number, chatId: number): Promise<any> {
    return this.restangular.one('console/users')
      .customGET(userId + '/chats/' + chatId, {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((res) => {
        return res.plain();
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error')
        } else {
          throw new Error('Unknow error' + error)
        }
      });
  }

  public getUserEstates(userId: number): Promise<any> {
    return this.restangular.one('console/users')
      .customGET(userId + '/estates', {}, { 'X-Auth-Token': this.userStorageService.getAuthToken() })
      .toPromise()
      .then((res) => {
        return res.plain();
      })
      .catch((error) => {
        if (error.status >= 500) {
          throw new Error('Server error')
        } else {
          throw new Error('Unknow error' + error)
        }
      });
  }

  public sutupUserProfileResponse(res: any): ConsoleUserProfile {
    let userProfile: ConsoleUserProfile = new ConsoleUserProfile;
    userProfile.firstName = res.firstName;
    userProfile.middleName = res.middleName;
    userProfile.lastName = res.lastName;
    userProfile.email = res.email;
    userProfile.emailConfirmed = res.emailConfirmed;
    userProfile.phoneNumber = res.phoneNumber;
    userProfile.gender = res.gender;
    userProfile.birthday = res.birthday;
    userProfile.registrationDate = res.registrationDate;
    userProfile.placeOfEducation = res.placeOfEducation;
    userProfile.placeOfWork = res.placeOfWork;
    userProfile.timeZone = res.timeZone;
    return userProfile;
  }
}

export class ConsoleUserProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  emailConfirmed;
  phoneNumber: string;
  gender: string;
  birthday: number;
  registrationDate: number;
  placeOfEducation: string;
  placeOfWork: string;
  timeZone: string;
}
