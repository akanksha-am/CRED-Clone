const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  authCode: {
    type: String,
    default: null,
  },
  coins: {
    type: Number,
    default: 0,
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
