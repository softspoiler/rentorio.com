import { RxuError } from './rxu.error';

export class InvalidPasswordRetriesLockTokenError extends RxuError {
    constructor(message: string = 'InvalidPasswordRetriesLockTokenError') {
        super(message);
    }
}
