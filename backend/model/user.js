const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Please enter email in correct format"],
  },
  name:{
    type:String,
    required:[true, "Please provide an Name"]
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "PW should be atleast 6 char"],
    select: false, // to ensure this field is not returned by default in queries
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//encrypt password before save- HOOKS
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
