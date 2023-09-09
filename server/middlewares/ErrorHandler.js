export const ErrorHandler = (status, message) => {
    console.log(status, message);
    const error = new Error()
    error.status = status
    error.message = message
    return error
}