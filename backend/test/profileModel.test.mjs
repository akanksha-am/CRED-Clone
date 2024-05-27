// test/profileModel.test.mjs
import mongoose from 'mongoose';
import { expect } from 'chai';
import Profile from '../model/profile.js'; // Correct relative path
 
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
 
describe("Profile Model Test", () => {
  it("should create a profile with valid data", async () => {
    const validProfile = new Profile({
      authCode: "12345",
      coins: 100,
      reminder: true,
      userId: new mongoose.Types.ObjectId(),
    });
 
    const savedProfile = await validProfile.save();
    expect(savedProfile._id).to.exist;
    expect(savedProfile.authCode).to.equal("12345");
    expect(savedProfile.coins).to.equal(100);
    expect(savedProfile.reminder).to.equal(true);
    expect(savedProfile.userId).to.exist;
  });
 
  it("should not create a profile without userId", async () => {
    const invalidProfile = new Profile({});
    let error;
 
    try {
      await invalidProfile.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.userId).to.exist;
    expect(error.errors.userId.message).to.equal('Path `userId` is required.');
  });
 
  it("should not create a profile with duplicate userId", async () => {
    const userId = new mongoose.Types.ObjectId();
 
    const profile1 = new Profile({
      authCode: "12345",
      coins: 100,
      reminder: true,
      userId: userId,
    });
    await profile1.save();
 
    const profile2 = new Profile({
      authCode: "67890",
      coins: 50,
      reminder: false,
      userId: userId, // Duplicate userId
    });
    let error;
 
    try {
      await profile2.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.code).to.equal(11000); // Duplicate key error code
  });
 
  it("should create a profile with default values", async () => {
    const profileWithDefaults = new Profile({
      userId: new mongoose.Types.ObjectId(),
    });
 
    const savedProfile = await profileWithDefaults.save();
    expect(savedProfile._id).to.exist;
    expect(savedProfile.authCode).to.be.null;
    expect(savedProfile.coins).to.equal(0);
    expect(savedProfile.reminder).to.equal(false);
  });
});