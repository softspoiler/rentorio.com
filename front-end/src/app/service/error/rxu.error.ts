/**
 * Base Error class is an umbrella for all businnes errors of the application.
 */
export class RxuError extends Error {
    constructor(message: string) {
        super(message);
    }
}
