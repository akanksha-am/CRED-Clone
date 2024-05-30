class CustomError extends Error {
  constructor(message, code) {
    super(message);
    res.statusCode = code;
  }
}

module.exports = CustomError;
