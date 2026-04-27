const mongoose = require('mongoose');
const Competency = require('./models/Competency');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('\n=== COMPETENCIES IN DATABASE ===');
    const competencies = await Competency.find();
    console.log('Total competencies:', competencies.length);
    
    competencies.forEach(c => {
      console.log('\nTitle:', c.title);
      console.log('Code:', c.code);
      console.log('Level:', c.level);
      console.log('Has image:', !!c.image);
      if (c.image) {
        console.log('Image (first 50 chars):', c.image.substring(0, 50));
      }
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
