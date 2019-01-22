import { RxuError } from './rxu.error';

export class ExpiredPasswordRetriesLockTokenError extends RxuError {
    constructor(message: string = 'ExpiredPasswordRetriesLockTokenError') {
        super(message);
    }
}
