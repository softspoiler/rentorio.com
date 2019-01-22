import { RxuError } from './rxu.error';

export class PhoneNumberNotConfirmedError extends RxuError {
    constructor(message: string = 'PhoneNumberNotConfirmedError') {
        super(message);
    }
}
