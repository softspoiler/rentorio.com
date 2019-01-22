import { RxuError } from './rxu.error';

export class AccountBlockedError extends RxuError {
    constructor(message: string = 'AccountBlockedError') {
        super(message);
    }
}
