const mongoose = require('mongoose');
const Competency = require('./models/Competency');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

// Image paths for competencies
const competencyImages = {
  'CON311201': '../../assets/img/fork.png',      // Forklift
  'CON311202': '../../assets/img/bulldozer.png', // Bulldozer
  'CON311203': '../../assets/img/hydraulic excavator.png' // Excavator
};

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('\n=== UPDATING COMPETENCY IMAGES ===');
    
    for (const [code, imagePath] of Object.entries(competencyImages)) {
      const result = await Competency.findOneAndUpdate(
        { code: code },
        { image: imagePath },
        { new: true }
      );
      
      if (result) {
        console.log(`✓ Updated ${result.title} with image: ${imagePath}`);
      } else {
        console.log(`✗ Competency with code ${code} not found`);
      }
    }

    console.log('\n=== VERIFICATION ===');
    const competencies = await Competency.find();
    competencies.forEach(c => {
      console.log(`${c.title}: ${c.image || 'NO IMAGE'}`);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
