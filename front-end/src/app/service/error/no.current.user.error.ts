import { RxuError } from './rxu.error';

export class NoCurrentUserError extends RxuError {
    constructor(message: string) {
        super(message);
    }
}
