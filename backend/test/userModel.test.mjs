// test/userModel.test.mjs
import mongoose from 'mongoose';
import { expect } from 'chai';
import User from '../model/user.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
 
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
 
describe("User Model Test", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
 
  it("should create a user with valid data", async () => {
    const user = new User({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    });
 
    const savedUser = await user.save();
    expect(savedUser._id).to.exist;
    expect(savedUser.email).to.equal("test@example.com");
    expect(savedUser.name).to.equal("Test User");
    expect(savedUser.password).to.not.equal("password123");
  });
 
  it("should not create a user without an email", async () => {
    const user = new User({
      name: "Test User",
      password: "password123",
    });
    let error;
 
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.email).to.exist;
    expect(error.errors.email.message).to.equal('Path `email` is required.');
  });
 
  it("should not create a user without a name", async () => {
    const user = new User({
      email: "test@example.com",
      password: "password123",
    });
    let error;
 
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.name).to.exist;
    expect(error.errors.name.message).to.equal('Path `name` is required.');
  });
 
  it("should not create a user with an invalid email", async () => {
    const user = new User({
      email: "invalid-email",
      name: "Test User",
      password: "password123",
    });
    let error;
 
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.email).to.exist;
    expect(error.errors.email.message).to.equal('Invalid email format');
  });
 
  it("should not create a user with a password less than 6 characters", async () => {
    const user = new User({
      email: "test@example.com",
      name: "Test User",
      password: "123",
    });
    let error;
 
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
 
    expect(error).to.exist;
    expect(error.errors.password).to.exist;
    expect(error.errors.password.message).to.equal('Path `password` (`123`) is shorter than the minimum allowed length (6).');
  });
 
  it("should hash the password before saving the user", async () => {
    const user = new User({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    });
 
    const savedUser = await user.save();
    const isMatch = await bcrypt.compare("password123", savedUser.password);
    expect(isMatch).to.be.true;
  });
 
  it("should compare the entered password with the hashed password", async () => {
    const user = new User({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    });
 
    await user.save();
    const isMatch = await user.comparePassword("password123");
    expect(isMatch).to.be.true;
  });
 
  it("should generate a JWT token", async () => {
    const user = new User({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    });
 
    await user.save();
    const token = user.getJwtToken();
    expect(token).to.exist;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).to.equal(user._id.toString());
  });
});