import { RxuError } from './rxu.error';

export class NotAvailableTimeError extends RxuError {
    constructor(message: string = 'NotAvailableTimeError') {
        super(message);
    }
}
