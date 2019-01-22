import { RxuError } from './rxu.error';

export class InvalidRecaptchaResponseError extends RxuError {
    constructor(message: string = 'InvalidRecaptchaResponseError') {
        super(message);
    }
}
