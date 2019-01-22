import { RxuError } from './rxu.error';

export class CalleeIsAlreadyInCallError extends RxuError {
    constructor(message: string = 'CalleeIsAlreadyInCallError') {
        super(message);
    }
}
