// Quick test to check if server starts
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5500;
const MONGODB_URI = 'mongodb://localhost:27017/BETCI';

app.use(express.json());

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Test route
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is working!' });
});
