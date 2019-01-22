import { RxuError } from './rxu.error';

export class BadRequestError extends RxuError {
    constructor(message: string = 'BadRequestError') {
        super(message);
    }
}