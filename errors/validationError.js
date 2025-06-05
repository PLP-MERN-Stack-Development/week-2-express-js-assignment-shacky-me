// errors/validationError.js

class ValidationError extends Error {
  constructor(message = "Validation failed", errors = []) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.errors = errors;
  }
}

module.exports = ValidationError;
