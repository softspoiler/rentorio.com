import { RxuError } from './rxu.error';

export class NotFoundEstateError extends RxuError {
    constructor(message: string = "NotFoundEstateError") {
        super(message);
    }
}