import { RxuError } from './rxu.error';

export class InvalidPasswordResetTokenError extends RxuError {
    constructor(message: string = 'InvalidPasswordResetTokenError') {
        super(message);
    }
}
