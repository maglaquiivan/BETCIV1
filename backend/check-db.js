const mongoose = require('mongoose');
const TraineeAccount = require('./models/TraineeAccount');
const AdminAccount = require('./models/AdminAccount');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('\n=== TRAINEE ACCOUNTS ===');
    const trainees = await TraineeAccount.find().select('email username accountId role password');
    trainees.forEach(t => {
      console.log('Email:', t.email);
      console.log('Username:', t.username);
      console.log('AccountId:', t.accountId);
      console.log('Role:', t.role);
      console.log('Has Password:', !!t.password);
      console.log('---');
    });

    console.log('\n=== ADMIN ACCOUNTS ===');
    const admins = await AdminAccount.find().select('email username accountId role password');
    admins.forEach(a => {
      console.log('Email:', a.email);
      console.log('Username:', a.username);
      console.log('AccountId:', a.accountId);
      console.log('Role:', a.role);
      console.log('Has Password:', !!a.password);
      console.log('---');
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
