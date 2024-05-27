import 'dotenv/config';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { expect } from 'chai';
import bcrypt from 'bcryptjs';
import User from '../model/user.js';
import dotenv from 'dotenv';

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
  let testUser;

  beforeEach(async () => {
    await User.deleteMany({});
    testUser = new User({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    });
    await testUser.save();
  });

  it("should create a user with valid data", async () => {
    const user = await User.findOne({ email: "test@example.com" });
    expect(user._id).to.exist;
    expect(user.email).to.equal("test@example.com");
    expect(user.name).to.equal("Test User");
    expect(user.password).to.not.equal("password123"); // Check hashed password
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
    const user = await User.findOne({ email: "test@example.com" }).select('+password'); // Include password field explicitly
    const isMatch = await bcrypt.compare("password123", user.password);
    expect(isMatch).to.be.true;
  });

  it("should compare the entered password with the hashed password", async () => {
    const user = await User.findOne({ email: "test@example.com" }).select('+password'); // Include password field explicitly
    const isMatch = await user.comparePassword("password123");
    expect(isMatch).to.be.true;
  });

  it("should generate a JWT token", async () => {
    const token = testUser.getJwtToken();
    expect(token).to.exist;
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_EXPIRY:', process.env.JWT_EXPIRY);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).to.equal(testUser._id.toString());
  });
});
