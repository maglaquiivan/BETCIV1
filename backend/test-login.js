const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const TraineeAccount = require('./models/TraineeAccount');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    try {
      const email = 'trainee@betci.com';
      const passwordToTest = 'trainee123';

      console.log('Testing login for:', email);
      console.log('Password to test:', passwordToTest);

      const user = await TraineeAccount.findOne({ email });
      
      if (!user) {
        console.log('❌ User not found');
        process.exit(1);
      }

      console.log('\nUser found:');
      console.log('Email:', user.email);
      console.log('Username:', user.username);
      console.log('Password hash exists:', !!user.password);
      console.log('Password hash (first 30 chars):', user.password.substring(0, 30));

      // Test bcrypt comparison
      const isMatch = await bcrypt.compare(passwordToTest, user.password);
      console.log('\nPassword comparison result:', isMatch);

      if (isMatch) {
        console.log('✓ Login would succeed');
      } else {
        console.log('❌ Login would fail - password mismatch');
      }

      process.exit(0);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
