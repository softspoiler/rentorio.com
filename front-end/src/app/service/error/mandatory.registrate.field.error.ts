import { RxuError } from './rxu.error';

export class MandatoryRegistrateFieldError extends RxuError {
    constructor(message: string = 'MandatoryRegistrateFieldError') {
        super(message);
    }
}
