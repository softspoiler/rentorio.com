import { RxuError } from './rxu.error';

export class NotFoundEmailError extends RxuError {
    constructor(message: string = 'NotFoundEmailError') {
        super(message);
    }
}
