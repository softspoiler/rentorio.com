import { RxuError } from './rxu.error';

export class NotAgreedTermOfUseError extends RxuError {
    constructor(message: string = 'NotAgreedTermOfUseError') {
        super(message);
    }
}
