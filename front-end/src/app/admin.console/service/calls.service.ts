import { UserStorageService } from './../../service/user.storage.service';
import { HttpHeaders, HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CallsService {

  constructor(
    private userStorageService: UserStorageService,
    private http: HttpClient
  ) { }

  public getCalls(filter): Promise<any> {
    return this.http.get(
      '/rest/console/calls',
      {
        headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, this.userStorageService.getAuthTokenWithCheck())),
        params: this.applyFillter(filter)
      }
    ).toPromise()
      .then((res) => {
        return res;
      }, (err) => {
        if (err.error !== 'undefined') {
          if (err.error.exception.indexOf('NoSuchUserException') !== -1) {
            throw new Error('NoSuchUserException');
          }
        }
      });
  }

  public resetActiveCall(callId: number): Promise<any> {
    return this.http.put(
      `/rest/console/calls/${callId}/reset`,
      JSON.stringify({ callId: callId }),
      {
        headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, this.userStorageService.getAuthTokenWithCheck())),
        responseType: 'text'
      }
    ).toPromise()
      .then(
        (res) => res,
        (err) => {
          console.log(err);
          if (err.error && err.error.message) {
            throw new Error(err.error.message);
          } else {
            throw new Error('Unknown error');
          }
        }
      )
  }

  private applyFillter(filter: any) {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    if (filter.phoneNumber !== '') {
      let obj = {
        pageNumber: filter.pageNumber,
        phoneNumber: filter.phoneNumber,
        pageSize: filter.pageSize
      }
      for (let key in obj) {
        params = params.append(key, obj[key]);
      }
      return params
    }
    for (let key in filter) {
      if (filter[key] !== '' && filter[key] !== null) {
        params = params.append(key, filter[key]);
      }
    }
    return params;
  }

}

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
