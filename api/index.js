require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('../config/db');
const errorHandler = require('../middleware/errorHandler');

// Connect DB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/expenses', require('../routes/expenses'));
app.use('/api/categories', require('../routes/categories'));

// Error handler
app.use(errorHandler);

// Export handler instead of app.listen
module.exports = app;
