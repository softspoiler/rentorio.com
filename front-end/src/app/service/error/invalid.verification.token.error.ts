import { RxuError } from './rxu.error';

export class InvalidVerificationTokenError extends RxuError {
    constructor(message: string = 'InvalidVerificationTokenError') {
        super(message);
    }
}
