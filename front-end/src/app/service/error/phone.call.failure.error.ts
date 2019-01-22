import { RxuError } from './rxu.error';

export class PhoneCallFailureError extends RxuError {
    constructor(message: string = 'PhoneCallFailureError') {
        super(message);
    }
}
