
class ApiError extends Error {
        constructor(statusCode, errors = [], message = "Something went wrong", stack = "",) {
                super(message);
                this.errors = Array.isArray(errors) ? errors : [errors];
                this.statusCode = statusCode;
                this.success = false

                if (stack) {
                        this.stack = stack
                } else {
                        Error.captureStackTrace(this, this.constructor)
                }
        }
}

export default ApiError