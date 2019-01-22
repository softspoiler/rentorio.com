import { RxuError } from './rxu.error';

export class AccountDisabledError extends RxuError {
    constructor(message: string = 'AccountDisabledError') {
        super(message);
    }
}
