const Expenses = require("./../db/expenseModel");

async function getExpenses(req, res) {
  const { userId } = req.user;
  try {
    const expenses = await Expenses.find({ userId });
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: "There was an error getting expenses" });
  }
}

async function addExpense(req, res) {
  const { name, amount, category, description } = req.body;
  const { userId } = req.user;

  try {
    if (!name || !amount || !category) {
      return res.status(400).json({
        message: "Please provide the amount field and category field please",
      });
    }

    const expense = await Expenses.create({
      name,
      userId,
      amount,
      category,
      description,
    });

    res.status(201).json({ message: "Successfully created", expense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error posting expenses", error });
  }
}

async function deleteExpense(req, res) {
  const { expenseId } = req.params;
  try {
    const expense = await Expenses.findOneAndDelete({ _id: expenseId });
    res.status(200).json({ message: "Successfully deleted", expense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error deleting expense", error });
  }
}

async function getTotalAmount(req, res) {
  const { userId, category } = req.params;
  try {
    const totalAmount = await Expenses.aggregate([
      {
        $match: {
          userId: userId,
          category: category,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    if (totalAmount.length > 0) {
      res.json({ totalAmount: totalAmount[0].total });
    } else {
      res.json({ totalAmount: 0 });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getChartData(req, res) {
  try {
    const { userId } = req.user;
    const expenses = await Expenses.aggregate([
      { $match: { userId: userId, category: { $ne: "income" } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
  getTotalAmount,
  getChartData,
};
