const User = require("../model/user");
const CustomError = require("../utils/customError");
const bigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = bigPromise(async (req, res, next) => {
  let token;
  try {
    token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");
  } catch (error) {
    return next(new CustomError("No Logged-in User"), 400);
  }

  if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id); //can be used where token is present by injecting info

  next();
});
