class ApiResponse {
    constructor(data = null, statusCode, message = "Success", password) {

        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.password = password
        this.success = true;
    }
}
export default ApiResponse;
