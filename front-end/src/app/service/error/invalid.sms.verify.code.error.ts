import { RxuError } from './rxu.error';

export class InvalidSmsVerifyCodeError extends RxuError {
    constructor(message: string) {
        super(message);
    }
}
