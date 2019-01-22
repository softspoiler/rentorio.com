import { RxuError } from './rxu.error';

export class EstateOfflineError extends RxuError {
    constructor(message: string = 'EstateOfflineError') {
        super(message);
    }
}
