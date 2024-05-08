const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardOwnerName: {
    type: String,
    required: [true, "Card owner name is required"],
  },
  cardNumber: {
    type: String,
    required: [true, "Card number is required"],
    unique: true,
  },
  outstandingAmount: {
    type: Number,
    default: 0.0,
  },
  expiryMonth: {
    type: Number,
    required: [true, "Expiry month is required"],
    min: [1, "Expiry month must be between 1 and 12"],
    max: [12, "Expiry month must be between 1 and 12"],
  },
  expiryYear: {
    type: Number,
    required: [true, "Expiry year is required"],
    min: [2024, "Expiry year must be from 2024 onwards"],
    max: [3000, "Expiry year must be before 3000"],
  },
  cvv: {
    type: Number,
    required: [true, "CVV is required"],
    min: [100, "CVV must be a 3-digit number"],
    max: [9999, "CVV must be a 3-digit number"],
  },
});

module.exports = mongoose.model("Card", cardSchema);
