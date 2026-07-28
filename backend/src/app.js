const express = require('express');
const cors = require('cors');
const jobsRouter = require('./routes/jobs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/jobs', jobsRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CareerFetch API is healthy' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
