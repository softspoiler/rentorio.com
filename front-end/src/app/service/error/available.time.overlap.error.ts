import { RxuError } from './rxu.error';

export class AvailableTimeOverlapError extends RxuError {
    constructor(message: string = 'AvailableTimeOverlapError') {
        super(message);
    }
}
