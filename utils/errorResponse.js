class ErrorResponse extends Error {
  constructor(message, statusCode, page, redirectstatus) {
    super(message);
    this.statusCode = statusCode;
    this.page = page;
    if (redirectstatus === 302) {
      this.redirectstatus = redirectstatus;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
