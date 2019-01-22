import { RxuError } from './rxu.error';

export class BadCredentialsError extends RxuError {
    constructor(message: string = 'BadCredentialsError') {
        super(message);
    }
}
