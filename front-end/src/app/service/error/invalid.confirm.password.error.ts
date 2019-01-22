import { RxuError } from './rxu.error';

export class InvalidConfirmPasswordError extends RxuError {
    constructor(message: string = 'InvalidConfirmPasswordError') {
        super(message);
    }
}
