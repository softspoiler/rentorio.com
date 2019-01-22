import { RxuError } from './rxu.error';

export class PhoneNumberAlreadyExistError extends RxuError {
    constructor(message: string = 'PhoneNumberAlreadyExistError') {
        super(message);
    }
}
