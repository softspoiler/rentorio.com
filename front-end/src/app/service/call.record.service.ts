import { ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { UserStorageService } from './user.storage.service';

@Injectable()
export class CallRecordService {

    constructor(
        private restangular: Restangular,
        private storageService: UserStorageService,
    ) { }

    public getUserAudioRecord(id: String): Promise<any> {
        return this.restangular.one('users/phone/calls/audio')
            .withHttpConfig({ responseType: ResponseContentType.Blob })
            .customGET(id, {}, this.storageService.getAuthTokenWithCheck())
            .toPromise()
            .then((response) => {
                return response;
            }, (error) => {
                return error;
            });
    }
}