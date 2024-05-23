const express = require("express");
const router = express.Router();
const {
  getExpenses,
  addExpense,
  deleteExpense,
  getTotalAmount,
  getChartData,
} = require("./../controllers/expenseController");
const auth = require("./../utils/auth");

router.get("/expenses", auth, getExpenses);

router.get("/total/:userId/:category", auth, getTotalAmount);

router.get("/chartdata", auth, getChartData);

router.post("/add/expenses", auth, addExpense);

router.delete("/delete/expenses/:expenseId", auth, deleteExpense);

module.exports = router;
