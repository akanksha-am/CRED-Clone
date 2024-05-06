const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  credDeb: {
    type: Boolean,
    required: true,
    default: true,
  },
  category: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  transactionDateTime: {
    type: Date,
    required: true,
  },
  userAssociated: {
    type: String,
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
    required: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
