class CastError extends Error {
  constructor(message, code) {
    super(message);
    this.statusCode = code || 500;
  }
}

module.exports = CastError;
