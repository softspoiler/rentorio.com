import { RxuError } from './rxu.error';

export class MandatoryWishFieldsError extends RxuError {
    constructor(message: string = 'MandatoryWishFieldsError') {
        super(message);
    }
}
