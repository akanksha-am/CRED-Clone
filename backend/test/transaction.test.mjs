import mongoose from 'mongoose';
import { expect } from 'chai';
import dotenv from 'dotenv';
import Transaction from '../model/transaction.js';
import Card from '../model/card.js';
 
// Load environment variables from a .env file if available
dotenv.config();
 
// Connect to a test database before running tests
before(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
 
// Drop the test database after running tests
after(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});
 
describe("Transaction Model Test", () => {
  let card;
 
  beforeEach(async () => {
    await Transaction.deleteMany({});
    await Card.deleteMany({});
 
    // Create a card to associate with transactions
    card = new Card({
      cardOwnerName: "John Doe",
      cardNumber: "1234567812345678",
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: 123,
    });
 
    await card.save();
  });
 
  it("should create a transaction with valid data", async () => {
    const transaction = new Transaction({
      amount: 100.0,
      vendor: "Amazon",
      type: "debit",
      category: "Shopping",
      cardNumber: "1234567812345678",
      transactionDateTime: new Date(),
      userAssociated: "user123",
      cardId: card._id,
    });
 
    await transaction.save();
    expect(transaction._id).to.exist;
  });
 
  it("should not create a transaction without a required field", async () => {
    const transaction = new Transaction({
      vendor: "Amazon",
      type: "debit",
      category: "Shopping",
      cardNumber: "1234567812345678",
      transactionDateTime: new Date(),
      cardId: card._id,
    });
 
    let error;
 
    try {
      await transaction.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.amount).to.exist;
  });
 
  it("should not create a transaction with an invalid type", async () => {
    const transaction = new Transaction({
      amount: 100.0,
      vendor: "Amazon",
      type: "invalid_type",
      category: "Shopping",
      cardNumber: "1234567812345678",
      transactionDateTime: new Date(),
      cardId: card._id,
    });
 
    let error;
 
    try {
      await transaction.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.type).to.exist;
    expect(error.errors.type.message).to.include('`invalid_type` is not a valid enum value for path `type`');
  });
 
  it("should not create a transaction without a cardId", async () => {
    const transaction = new Transaction({
      amount: 100.0,
      vendor: "Amazon",
      type: "debit",
      category: "Shopping",
      cardNumber: "1234567812345678",
      transactionDateTime: new Date(),
    });
 
    let error;
 
    try {
      await transaction.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.cardId).to.exist;
  });
});