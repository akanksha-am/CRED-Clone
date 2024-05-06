const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  couponId: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  promocode: {
    type: String,
    required: true,
  },
  coinsNeeded: {
    type: Number,
    required: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
});

module.exports = mongoose.model("Reward", rewardSchema);
