class ApiError {
    constructor(statusCode, message = "Success") {
        this.statusCode = statusCode
        this.message = message
        this.error = true
        this.success = false
    }
}

export { ApiError }