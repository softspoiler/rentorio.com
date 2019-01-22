import { RxuError } from './rxu.error';

export class MandatoryProfileFieldsError extends RxuError {
    constructor(message: string = 'MandatoryProfileFieldsError') {
        super(message);
    }
}
