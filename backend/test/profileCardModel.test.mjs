// test/profileCardModel.test.mjs
import mongoose from 'mongoose';
import { expect } from 'chai';
import ProfileCard from '../model/profileCard.js';
import Profile from '../model/profile.js';
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
 
describe("ProfileCard Model Test", () => {
  let profile;
  let card;
 
  // Ensure a clean state before each test
  beforeEach(async () => {
    await Profile.deleteMany({});
    await Card.deleteMany({});
    await ProfileCard.deleteMany({});
 
    profile = new Profile({ userId: new mongoose.Types.ObjectId() });
    card = new Card({
      cardOwnerName: "John Doe",
      cardNumber: "1234567890123456",
      outstandingAmount: 100.50,
      expiryMonth: 12,
      expiryYear: 2025,
      cvv: 123,
    });
 
    await profile.save();
    await card.save();
  });
 
  it("should create a profile card with valid data", async () => {
    const validProfileCard = new ProfileCard({
      profileId: profile._id,
      cardId: card._id,
    });
 
    const savedProfileCard = await validProfileCard.save();
    expect(savedProfileCard._id).to.exist;
    expect(savedProfileCard.profileId.toString()).to.equal(profile._id.toString());
    expect(savedProfileCard.cardId.toString()).to.equal(card._id.toString());
  });
 
  it("should not create a profile card without profileId", async () => {
    const invalidProfileCard = new ProfileCard({
      cardId: card._id,
    });
    let error;
 
    try {
      await invalidProfileCard.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.profileId).to.exist;
    expect(error.errors.profileId.message).to.equal('Path `profileId` is required.');
  });
 
  it("should not create a profile card without cardId", async () => {
    const invalidProfileCard = new ProfileCard({
      profileId: profile._id,
    });
    let error;
 
    try {
      await invalidProfileCard.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.cardId).to.exist;
    expect(error.errors.cardId.message).to.equal('Path `cardId` is required.');
  });
});
 