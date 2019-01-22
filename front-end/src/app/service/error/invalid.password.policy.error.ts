import { RxuError } from './rxu.error';

export class InvalidPasswordPolicyError extends RxuError {
    constructor(message: string = 'InvalidPasswordPolicyError') {
        super(message);
    }
}
