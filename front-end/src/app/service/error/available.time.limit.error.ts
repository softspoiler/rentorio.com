import { RxuError } from './rxu.error';

export class AvailableTimeLimitError extends RxuError {
    constructor(message: string = 'AvailableTimeLimitError') {
        super(message);
    }
}
