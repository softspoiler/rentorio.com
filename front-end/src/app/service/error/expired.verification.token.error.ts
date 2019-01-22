import { RxuError } from './rxu.error';

export class ExpiredVerificationTokenError extends RxuError {
    constructor(message: string = 'ExpiredVerificationTokenError') {
        super(message);
    }
}
