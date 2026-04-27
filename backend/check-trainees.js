const mongoose = require('mongoose');
const Trainee = require('./models/Trainee');
const TraineeAccount = require('./models/TraineeAccount');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('\n=== TRAINEES COLLECTION ===');
    const trainees = await Trainee.find();
    console.log('Count:', trainees.length);
    trainees.forEach(t => {
      console.log('ID:', t.traineeId || t._id);
      console.log('Name:', t.firstName, t.lastName);
      console.log('Email:', t.email);
      console.log('---');
    });

    console.log('\n=== TRAINEE ACCOUNTS COLLECTION ===');
    const accounts = await TraineeAccount.find();
    console.log('Count:', accounts.length);
    accounts.forEach(a => {
      console.log('ID:', a.accountId);
      console.log('Name:', a.firstName, a.lastName);
      console.log('Email:', a.email);
      console.log('---');
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
