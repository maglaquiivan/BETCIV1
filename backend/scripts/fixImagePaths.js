const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

async function fixImagePaths() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const coursesCollection = db.collection('courses');

    const courses = await coursesCollection.find({}).toArray();
    console.log(`Found ${courses.length} courses`);

    for (const course of courses) {
      const updates = {};
      
      // Fix image paths
      if (course.image) {
        let newPath = course.image;
        
        // Handle full URLs
        if (newPath.startsWith('http')) {
          try {
            const url = new URL(newPath);
            newPath = url.pathname;
          } catch (e) {
            console.log(`Could not parse URL: ${newPath}`);
          }
        }
        
        // Extract /assets/img/ part
        if (newPath.includes('/assets/img/')) {
          newPath = '/assets/img/' + newPath.split('/assets/img/')[1];
        } else if (newPath.includes('assets/img/')) {
          newPath = '/assets/img/' + newPath.split('assets/img/')[1];
        } else if (!newPath.startsWith('/assets/')) {
          // Convert relative paths
          newPath = newPath.replace(/^(\.\.\/)+/, '/').replace(/^\.\//, '/');
        }
        
        if (newPath !== course.image) {
          console.log(`Updating ${course.title}: ${course.image} -> ${newPath}`);
          updates.image = newPath;
        }
      }
      
      // Fix duration if it's a string
      if (course.duration && typeof course.duration === 'string') {
        const durationNum = parseInt(course.duration);
        if (!isNaN(durationNum)) {
          console.log(`Fixing duration for ${course.title}: ${course.duration} -> ${durationNum}`);
          updates.duration = durationNum;
        } else {
          // Default to 40 hours if can't parse
          console.log(`Setting default duration for ${course.title}: ${course.duration} -> 40`);
          updates.duration = 40;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        await coursesCollection.updateOne(
          { _id: course._id },
          { $set: updates }
        );
      }
    }

    console.log('Image paths and durations fixed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixImagePaths();
