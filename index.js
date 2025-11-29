require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect DB
connectDB();

const app = express();

// Middlewares
app.use(express.json());

// CORS setup
const allowedOrigins = [
    'http://localhost:3000', // local dev
    'https://expense-tracker-backend-pied-iota.vercel.app', // deployed frontend
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // allow cookies/auth headers if needed
}));

// Logging
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/categories', require('./routes/categories'));

// Error handler
app.use(errorHandler);

// Local server only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Root route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Export for Vercel
module.exports = app;
