import { RxuError } from './rxu.error';

export class TenantNotAvailableNowError extends RxuError {
    constructor(message: string = 'TenantNotAvailableNowError') {
        super(message);
    }
}
