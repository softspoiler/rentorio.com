import { RxuError } from './rxu.error';

export class LandlordNotAvailableNowError extends RxuError {
    constructor(message: string = 'LandlordNotAvailableNowError') {
        super(message);
    }
}
