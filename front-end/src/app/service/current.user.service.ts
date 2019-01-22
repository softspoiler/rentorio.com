import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserStorageService } from './user.storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrentUserService {
    private httpOptions:any;

    constructor(
        private storageService: UserStorageService,
        private http: HttpClient
    ) { }

    private setupHeaders(){
        this.httpOptions = {
            headers: new HttpHeaders(Object.assign(
                { 'Content-Type': 'application/json'}, this.storageService.getAuthTokenWithCheck()
            ))
        }
    }

    public getCurrentUser() {
        this.setupHeaders();
        return this.http.get('/rest/users/current', this.httpOptions).toPromise()
    }
}
