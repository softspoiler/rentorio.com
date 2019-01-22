import { RxuError } from './rxu.error';

export class EmailNotConfirmedError extends RxuError {
    constructor(message: string = 'EmailNotConfirmedError') {
        super(message);
    }
}
