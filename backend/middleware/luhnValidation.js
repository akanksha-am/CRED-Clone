const luhn = require("luhn");
const bigPromise = require("./bigPromise");
const CustomError = require("../utils/customError");

exports.luhnValidation = bigPromise(async (req, res, next) => {
  if (req.params.id) {
    req.body.cardNumber = req.params.id;
  }
  const validCard = await luhn.validate(req.body.cardNumber);
  if (!validCard) {
    return next(new CustomError("Card is not valid!", 422));
  }

  next();
});
