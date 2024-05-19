const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/user");

const {
  register,
  login,
  getProfile,
  logout,
  updateProfile,
  updateAuthCode,
} = require("../controllers/user.controller");

// routes
router.post("/signup", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isLoggedIn, getProfile);
router.get("/authCode", isLoggedIn, updateAuthCode);
router.patch("/profile", isLoggedIn, updateProfile);

module.exports = router;
