const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('\n=== COURSES IN DATABASE ===');
    const courses = await Course.find();
    console.log('Total courses:', courses.length);
    
    courses.forEach(c => {
      console.log('\nTitle:', c.title || c.courseName);
      console.log('ID:', c.courseId || c._id);
      console.log('Category:', c.category);
      console.log('Duration:', c.duration);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
