const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/user");

const { addCard } = require("../controllers/card.controller");
const { luhnValidation } = require("../middleware/luhnValidation");

// routes
router.post("/", isLoggedIn, luhnValidation, addCard);

module.exports = router;
