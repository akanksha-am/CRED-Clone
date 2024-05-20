const luhn = require("luhn");
const bigPromise = require("./bigPromise");
const CustomError = require("../utils/customError");

exports.luhnValidation = bigPromise(async (req, res, next) => {
  if (req.params.cardNumber) {
    req.body.cardNumber = req.params.cardNumber;
  }
  const validCard = await luhn.validate(req.body.cardNumber);
  if (!validCard) {
    res.statusCode = 422;
    throw new Error("Card is not valid!");
  }

  next();
});
