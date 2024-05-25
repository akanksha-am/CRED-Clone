// test/cardModel.test.js
import mongoose from 'mongoose';
import { expect } from 'chai';
import Card from '../model/card.js';
 
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
 
describe("Card Model Test", () => {
  it("should create a card with valid data", async () => {
    const validCard = new Card({
      cardOwnerName: "John Doe",
      cardNumber: "1234567890123456",
      outstandingAmount: 100.50,
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: 123,
    });
 
    const savedCard = await validCard.save();
    expect(savedCard._id).to.exist;
    expect(savedCard.cardOwnerName).to.equal("John Doe");
    expect(savedCard.cardNumber).to.equal("1234567890123456");
    expect(savedCard.outstandingAmount).to.equal(100.50);
    expect(savedCard.expiryMonth).to.equal(12);
    expect(savedCard.expiryYear).to.equal(2025);
    expect(savedCard.cvv).to.equal(123);
  });
 
  it("should not create a card without required fields", async () => {
    const invalidCard = new Card({});
    let error;
 
    try {
      await invalidCard.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.cardOwnerName).to.exist;
    expect(error.errors.cardNumber).to.exist;
    expect(error.errors.expiryMonth).to.exist;
    expect(error.errors.expiryYear).to.exist;
    expect(error.errors.cvv).to.exist;
  });
 
  it("should not create a card with an invalid expiry month", async () => {
    const invalidCard = new Card({
      cardOwnerName: "John Doe",
      cardNumber: "1234567890123456",
      expiryMonth: 13, // Invalid month
      expiryYear: 2025,
      cvv: 123,
    });
    let error;
 
    try {
      await invalidCard.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.expiryMonth).to.exist;
    expect(error.errors.expiryMonth.message).to.equal("Expiry month must be between 1 and 12");
  });
 
  it("should not create a card with an invalid expiry year", async () => {
    const invalidCard = new Card({
      cardOwnerName: "John Doe",
      cardNumber: "1234567890123456",
      expiryMonth: 12,
      expiryYear: 2023, // Invalid year
      cvv: 123,
    });
    let error;
 
    try {
      await invalidCard.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.expiryYear).to.exist;
    expect(error.errors.expiryYear.message).to.equal("Expiry year must be from 2024 onwards");
  });
 
  it("should not create a card with an invalid CVV", async () => {
    const invalidCard = new Card({
      cardOwnerName: "John Doe",
      cardNumber: "1234567890123456",
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: 12, // Invalid CVV
    });
    let error;
 
    try {
      await invalidCard.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.cvv).to.exist;
    expect(error.errors.cvv.message).to.equal("CVV must be a 3-digit number");
  });
});