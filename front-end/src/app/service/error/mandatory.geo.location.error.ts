import { RxuError } from './rxu.error';

export class MandatoryGeoLocationError extends RxuError {
    constructor(message: string = 'MandatoryGeoLocationError') {
        super(message);
    }
}
