const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const expenseController = require('../controllers/expenseController');

// Create expense
router.post(
  '/',
  auth,
  [
    body('amount', 'Amount is required and must be a number').isFloat({ gt: 0 }),
    body('category', 'Category is required').notEmpty(),
    body('date', 'Valid date required').isISO8601(),
  ],
  expenseController.createExpense
);

// Get expenses
router.get('/', auth, expenseController.getExpenses);

// Monthly category summary
router.get('/summary/monthly', auth, expenseController.monthlyCategorySummary);

// Total spending
router.get('/summary/total', auth, expenseController.totalSpending);

// Get single expense
router.get('/:id', auth, expenseController.getExpenseById);

// Delete expense
router.delete('/:id', auth, expenseController.deleteExpense);

module.exports = router;
