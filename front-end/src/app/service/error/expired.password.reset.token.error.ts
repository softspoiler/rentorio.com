import { RxuError } from './rxu.error';

export class ExpiredPasswordResetTokenError extends RxuError {
    constructor(message: string = 'ExpiredPasswordResetTokenError') {
        super(message);
    }
}
