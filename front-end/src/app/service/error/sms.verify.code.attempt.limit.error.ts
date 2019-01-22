import { RxuError } from './rxu.error';

export class SmsVerifyCodeAttemptLimitError extends RxuError {
    constructor(message: string = 'SmsVerifyCodeAttemptLimitError') {
        super(message);
    }
}
