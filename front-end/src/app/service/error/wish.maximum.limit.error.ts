import { RxuError } from './rxu.error';

export class WishMaximumLimitError extends RxuError {
    constructor(message: string = 'WishMaximumLimitError') {
        super(message);
    }
}
