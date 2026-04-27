const mongoose = require('mongoose');
const TraineeAccount = require('./models/TraineeAccount');
const AdminAccount = require('./models/AdminAccount');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('\n=== ALL TRAINEE ACCOUNTS ===');
    const trainees = await TraineeAccount.find();
    console.log('Count:', trainees.length);
    trainees.forEach(t => {
      console.log('\nEmail:', t.email);
      console.log('Username:', t.username);
      console.log('AccountId:', t.accountId);
      console.log('Role:', t.role);
      console.log('FirstName:', t.firstName);
      console.log('LastName:', t.lastName);
      console.log('Has Password:', !!t.password);
    });

    console.log('\n\n=== ALL ADMIN ACCOUNTS ===');
    const admins = await AdminAccount.find();
    console.log('Count:', admins.length);
    admins.forEach(a => {
      console.log('\nEmail:', a.email);
      console.log('Username:', a.username);
      console.log('AccountId:', a.accountId);
      console.log('Role:', a.role);
      console.log('FirstName:', a.firstName);
      console.log('LastName:', a.lastName);
      console.log('Has Password:', !!a.password);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
