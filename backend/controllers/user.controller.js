const User = require("../model/user");
const bigPromise = require("../middleware/bigPromise");
const cookieToken = require("../utils/cookieToken");
const CustomError = require("../utils/customError");

exports.register = bigPromise(async (req, res, next) => {
  try {
    await User.validate(req.body);
    const { email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new CustomError(`Email "${email}" is already registered!`, 409)
      );
    }

    const user = await User.create({
      email,
      password,
    });
    cookieToken(user, res, "User Created");
  } catch (error) {
    return next(new CustomError(error.message, 400));
  }
});

exports.login = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  //check for presence of email and password
  if (!email || !password) {
    return next(new CustomError("please provide email and password", 400));
  }

  //get user from db
  const user = await User.findOne({ email }).select("+password");

  //if user not found in db
  if (!user) {
    return next(
      new CustomError("Email or password does not match or exist", 400)
    );
  }

  const ispassword = await user.comparePassword(password);

  //if password dont match
  if (!ispassword) {
    return next(
      new CustomError("Email or password does not match or exist", 400)
    );
  }

  //if all goes good we will send the token
  cookieToken(user, res, "Successfully logged-In");
});

exports.logout = bigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout",
  });
});

exports.profile = async (req, res, next) => {
  res.send("Welcome");
};
