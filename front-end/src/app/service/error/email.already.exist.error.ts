import { RxuError } from './rxu.error';

export class EmailAlreadyExistError extends RxuError {
    constructor(message: string = 'EmailAlreadyExistError') {
        super(message);
    }
}
