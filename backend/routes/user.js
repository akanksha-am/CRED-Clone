const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/user");

const {
  register,
  login,
  profile,
  logout,
} = require("../controllers/user.controller");

// routes
router.post("/signup", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isLoggedIn, profile);
router.patch("/profile");

module.exports = router;
