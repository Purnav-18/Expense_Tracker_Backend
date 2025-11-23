
const { validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; // ✅ use new ObjectId when needed

// Create a new expense
exports.createExpense = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { amount, category, date, description } = req.body;

    // Prevent future dates
    if (new Date(date) > new Date()) {
      return res.status(400).json({ message: "Expense date cannot be in the future" });
    }

    const expense = new Expense({
      user: req.user,
      amount,
      category,
      date: new Date(date),
      description,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

// Get list of expenses with optional filters
exports.getExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, category } = req.query;
    const query = { user: req.user };

    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(query);

    res.json({ total, page: parseInt(page), limit: parseInt(limit), expenses });
  } catch (err) {
    next(err);
  }
};

// Get expense by ID
exports.getExpenseById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: 'Invalid id' });

    const expense = await Expense.findOne({ _id: req.params.id, user: req.user });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json(expense);
  } catch (err) {
    next(err);
  }
};

// Delete expense by ID
exports.deleteExpense = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: 'Invalid id' });

    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
};

// Monthly summary by category
exports.monthlyCategorySummary = async (req, res, next) => {
  try {
    let { month } = req.query; // format YYYY-MM
    if (!month) {
      const d = new Date();
      month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    const [y, m] = month.split('-');
    const start = new Date(y, parseInt(m) - 1, 1);
    const end = new Date(y, parseInt(m), 0, 23, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          user: new ObjectId(req.user), // ✅ use new ObjectId
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { category: '$_id', total: 1, _id: 0 } },
      { $sort: { total: -1 } },
    ];

    const result = await Expense.aggregate(pipeline);
    res.json({ month, start, end, breakdown: result });
  } catch (err) {
    next(err);
  }
};

// Total spending summary
exports.totalSpending = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { user: new ObjectId(req.user) }; // ✅ use new ObjectId
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ];

    const agg = await Expense.aggregate(pipeline);
    const total = agg.length ? agg[0].total : 0;
    res.json({ total });
  } catch (err) {
    next(err);
  }
};
