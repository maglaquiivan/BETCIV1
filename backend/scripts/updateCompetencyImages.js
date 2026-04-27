const mongoose = require('mongoose');
const Competency = require('../models/Competency');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

// Image mappings for each competency
const competencyImages = {
  'COMP001': '/assets/img/fork.png',           // Forklift Operation
  'COMP002': '/assets/img/bulldozer.png',      // Bulldozer Operation
  'COMP003': '/assets/img/hydraulic excavator.png', // Hydraulic Excavator
  'COMP004': '/assets/img/dump truck.png',     // Dump Truck Operation
  'COMP005': '/assets/img/logo.png',           // Wheel Loader
  'COMP006': '/assets/img/logo.png'            // Backhoe Loader
};

async function updateCompetencyImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\n========================================');
    console.log('Updating competency images...');
    console.log('========================================\n');

    let updatedCount = 0;

    for (const [competencyId, imagePath] of Object.entries(competencyImages)) {
      const result = await Competency.findOneAndUpdate(
        { competencyId: competencyId },
        { $set: { image: imagePath } },
        { new: true }
      );

      if (result) {
        console.log(`✓ Updated ${competencyId}: ${result.title} - Image: ${imagePath}`);
        updatedCount++;
      } else {
        console.log(`⚠ Competency ${competencyId} not found`);
      }
    }

    console.log('\n========================================');
    console.log('Summary:');
    console.log('========================================');
    console.log(`Competencies updated: ${updatedCount}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error updating competency images:', error);
    process.exit(1);
  }
}

updateCompetencyImages();
