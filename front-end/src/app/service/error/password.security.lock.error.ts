import { RxuError } from './rxu.error';

export class PasswordSecurityLockError extends RxuError {
    constructor(message: string = 'PasswordSecurityLockError') {
        super(message);
    }
}
