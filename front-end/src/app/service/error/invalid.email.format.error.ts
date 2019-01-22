import { RxuError } from './rxu.error';

export class InvalidEmailFormatError extends RxuError {
    constructor(message: string = 'InvalidEmailFormatError') {
        super(message);
    }
}
