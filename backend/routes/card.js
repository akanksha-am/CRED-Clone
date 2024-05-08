const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/user");

const {
  addCard,
  getAllCards,
  getCardById,
  payBill,
  getAllStatements,
  getStatementsYearMonth,
  postStatements,
  getSmartStatementData,
  getSmartStatementYearMonth,
} = require("../controllers/card.controller");
const { luhnValidation } = require("../middleware/luhnValidation");

// routes
router.post("/", isLoggedIn, luhnValidation, addCard);
router.get("/", isLoggedIn, getAllCards);
router.get("/:card_id", isLoggedIn, getCardById);
router.post("/:cardNumber/pay", isLoggedIn, luhnValidation, payBill);
router.get(
  "/:cardNumber/statements",
  isLoggedIn,
  luhnValidation,
  getAllStatements
);
router.get(
  "/:cardNumber/statements/:year/:month",
  isLoggedIn,
  luhnValidation,
  getStatementsYearMonth
);
router.post(
  "/:cardNumber/statements/:year/:month",
  luhnValidation,
  postStatements
);
router.get(
  "/:cardNumber/smartStatement",
  isLoggedIn,
  luhnValidation,
  getSmartStatementData
);

router.get(
  "/:cardNumber/smartStatement/:year/:month",
  isLoggedIn,
  luhnValidation,
  getSmartStatementYearMonth
);

module.exports = router;
