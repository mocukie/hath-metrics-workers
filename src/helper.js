export class HttpError extends Error {
    constructor(code, ...args) {
        super(...args)
        this.code = code
        Error.captureStackTrace(this, HttpError)
    }
}
