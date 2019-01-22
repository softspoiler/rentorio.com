import { RxuError } from './rxu.error';

export class AccountAutoBlockedError extends RxuError {
    constructor(message: string = 'AccountAutoBlockedError') {
        super(message);
    }
}
