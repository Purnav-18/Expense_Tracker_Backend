const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Valid email required').isEmail(),
    body('password', 'Password min length 6').isLength({ min: 6 }),
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [body('email', 'Valid email required').isEmail(), body('password', 'Password required').exists()],
  authController.login
);

module.exports = router;
