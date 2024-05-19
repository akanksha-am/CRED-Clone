const validator = require("validator");
const User = require("../model/user");
const Profile = require("../model/profile");
const bigPromise = require("../middleware/bigPromise");
const cookieToken = require("../utils/cookieToken");
const CustomError = require("../utils/customError");

exports.register = bigPromise(async (req, res, next) => {
  const { email, name, password } = req.body;

  try {
    if (!email || !name || !password) {
      res.statusCode = 400;
      throw new Error("Please provide email, name, and password");
    }

    if (!validator.isEmail(email)) {
      res.statusCode = 400;
      throw new Error("Invalid Email Format");
    }

    if (password.length < 6) {
      res.statusCode = 400;
      throw new Error("Password should be at least 6 characters long");
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.statusCode = 409;
      throw new Error(`Email "${email}" is already registered!`);
    }

    const user = await User.create({
      email,
      password,
      name,
    });

    await Profile.create({
      userId: user._id,
    });

    cookieToken(user, res, "User Created");
  } catch (error) {
    return next(error);
  }
});

exports.login = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //check for presence of email and password
    if (!email || !password) {
      res.statusCode = 400;
      throw new Error("please provide email and password");
    }

    //get user from db
    const user = await User.findOne({ email }).select("+password");

    //if user not found in db
    if (!user) {
      // return next(new Error("Email or password does not match or exist"));
      res.statusCode = 401;
      throw new Error("User does not exist");
    }

    const ispassword = await user.comparePassword(password);

    //if password dont match
    if (!ispassword) {
      res.statusCode = 401;
      throw new Error("Password does not match");
    }

    //if all goes good we will send the token
    cookieToken(user, res, "Successfully logged-In");
  } catch (error) {
    return next(error);
  }
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

exports.getProfile = bigPromise(async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId);

    // Find the user profile associated with the user ID
    const profile = await Profile.findOne({ userId }).populate("userId");

    // Check if profile exists
    if (!profile) {
      res.statusCode = 404;
      throw new Error("Profile not found");
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return next(error);
  }
});

exports.updateProfile = bigPromise(async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find the user profile associated with the user ID
    const profile = await Profile.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      res.statusCode = 404;
      throw new Error("Profile not found");
    }

    // Update profile fields
    const { name, authCode, coins, reminder } = req.body;
    profile.name = name || profile.name;
    profile.authCode = authCode || profile.authCode;
    profile.coins = coins || profile.coins;
    profile.reminder = reminder || profile.reminder;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return next(error);
  }
});
