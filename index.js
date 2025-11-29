require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect DB
connectDB();

const app = express();

// ================== CORS ==================
const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://expense-tracker-frontend-859b.vercel.app', // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS Error: ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ================== Middlewares ==================
app.use(express.json());
app.use(morgan('dev'));

// ================== Routes ==================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/categories', require('./routes/categories'));

// ================== Error Handler ==================
app.use(errorHandler);

// ================== Root ==================
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ================== Export for Vercel ==================
module.exports = app;
