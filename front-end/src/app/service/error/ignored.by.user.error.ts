import { RxuError } from './rxu.error';

export class IgnoredByUserError extends RxuError {
    constructor(message: string = 'IgnoredByUserError') {
        super(message);
    }
}
