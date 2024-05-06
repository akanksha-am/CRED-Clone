const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardOwnerName: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  outstandingAmount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  expiryMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  expiryYear: {
    type: Number,
    required: true,
    min: 2024,
    max: 3000,
  },
  cvv: {
    type: Number,
    required: true,
    min: 100,
    max: 9999,
  },
});

module.exports = mongoose.model("Card", cardSchema);
