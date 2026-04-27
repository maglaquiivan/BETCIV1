const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const TraineeAccount = require('./models/TraineeAccount');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    try {
      // Create a trainee account
      const traineeData = {
        accountId: 'TRN-0001',
        username: 'trainee',
        email: 'trainee@betci.com',
        password: 'trainee123', // Will be hashed by pre-save hook
        firstName: 'John',
        lastName: 'Trainee',
        role: 'trainee',
        status: 'active'
      };

      const trainee = new TraineeAccount(traineeData);
      await trainee.save();

      console.log('✓ Trainee account created successfully');
      console.log('Email: trainee@betci.com');
      console.log('Password: trainee123');
      console.log('AccountId: TRN-0001');

      process.exit(0);
    } catch (error) {
      console.error('Error creating trainee:', error.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
