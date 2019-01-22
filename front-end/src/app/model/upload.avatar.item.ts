import { UploadItem } from 'angular2-http-file-upload';
import { Constants } from './../service/constants';

export class UploadAvatarItem extends UploadItem {
    public typeOfLoading: String;
    constructor(file: any, token: string, type?: String) {
        super();

        this.url = Constants.BASE_URL + '/upload/avatar';
        this.headers = token === null ? {} : { 'X-Auth-Token': token };
        this.file = file;
        this.typeOfLoading = type;
    }
}