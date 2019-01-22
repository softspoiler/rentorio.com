import { RxuError } from './rxu.error';

export class CallerIsAlreadyInCallError extends RxuError {
    constructor(message: string = 'CallerIsAlreadyInCallError') {
        super(message);
    }
}
