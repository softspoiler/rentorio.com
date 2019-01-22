import { RxuError } from './rxu.error';

export class NoFreeCallChannelsError extends RxuError {
    constructor(message: string = 'NoFreeCallChannelsError') {
        super(message);
    }
}
