const mongoose = require('mongoose');
const Course = require('../models/Course');
const Competency = require('../models/Competency');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

// Competency templates for courses that don't have them yet
const newCompetencies = [
  {
    competencyId: 'COMP001',
    title: 'Operate Forklift Truck',
    code: 'CON311201',
    description: 'This unit covers the knowledge, skills and attitudes required to operate forklift truck.',
    courseId: 'forklift-operation',
    courseName: 'Forklift Operation NC II',
    level: 'NC II',
    units: [
      { unitCode: 'CON311201-01', unitTitle: 'Plan and prepare for task', hours: 8 },
      { unitCode: 'CON311201-02', unitTitle: 'Perform pre-operation checks', hours: 12 },
      { unitCode: 'CON311201-03', unitTitle: 'Operate forklift truck', hours: 40 },
      { unitCode: 'CON311201-04', unitTitle: 'Perform post-operation activities', hours: 8 }
    ],
    status: 'active',
    image: '/assets/img/fork.png'
  },
  {
    competencyId: 'COMP004',
    title: 'Operate Dump Truck',
    code: 'CON311204',
    description: 'This unit covers the knowledge, skills and attitudes required to operate rigid on-highway dump truck for hauling and transportation.',
    courseId: 'dump-truck-operation',
    courseName: 'Dump Truck Operation NC II',
    level: 'NC II',
    units: [
      { unitCode: 'CON311204-01', unitTitle: 'Plan hauling operations', hours: 8 },
      { unitCode: 'CON311204-02', unitTitle: 'Perform pre-trip inspection', hours: 10 },
      { unitCode: 'CON311204-03', unitTitle: 'Operate dump truck', hours: 45 },
      { unitCode: 'CON311204-04', unitTitle: 'Perform post-trip activities', hours: 7 }
    ],
    status: 'active',
    image: '/assets/img/dump truck.png'
  },
  {
    competencyId: 'COMP005',
    title: 'Operate Wheel Loader',
    code: 'CON311205',
    description: 'This unit covers the knowledge, skills and attitudes required to operate wheel loader for material handling and loading operations.',
    courseId: 'wheel-loader',
    courseName: 'Wheel Loader NC II',
    level: 'NC II',
    units: [
      { unitCode: 'CON311205-01', unitTitle: 'Prepare for loading operations', hours: 10 },
      { unitCode: 'CON311205-02', unitTitle: 'Conduct pre-operation checks', hours: 12 },
      { unitCode: 'CON311205-03', unitTitle: 'Operate wheel loader', hours: 50 },
      { unitCode: 'CON311205-04', unitTitle: 'Perform maintenance procedures', hours: 10 }
    ],
    status: 'active',
    image: '/assets/img/logo.png'
  },
  {
    competencyId: 'COMP006',
    title: 'Operate Backhoe Loader',
    code: 'CON311206',
    description: 'This unit covers the knowledge, skills and attitudes required to operate backhoe loader for digging, trenching, and utility work.',
    courseId: 'backhoe-loader',
    courseName: 'Backhoe Loader NC II',
    level: 'NC II',
    units: [
      { unitCode: 'CON311206-01', unitTitle: 'Plan excavation and loading work', hours: 10 },
      { unitCode: 'CON311206-02', unitTitle: 'Perform pre-operation inspection', hours: 12 },
      { unitCode: 'CON311206-03', unitTitle: 'Operate backhoe loader', hours: 48 },
      { unitCode: 'CON311206-04', unitTitle: 'Perform routine maintenance', hours: 10 }
    ],
    status: 'active',
    image: '/assets/img/logo.png'
  }
];

async function addMissingCompetencies() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all courses
    const courses = await Course.find();
    console.log(`\nFound ${courses.length} courses in database`);

    // Get all existing competencies
    const existingCompetencies = await Competency.find();
    console.log(`Found ${existingCompetencies.length} existing competencies`);

    // Create a map of courseId to competency
    const competencyMap = {};
    existingCompetencies.forEach(comp => {
      competencyMap[comp.courseId] = comp;
    });

    console.log('\n========================================');
    console.log('Checking courses for missing competencies...');
    console.log('========================================\n');

    let addedCount = 0;
    let skippedCount = 0;

    for (const course of courses) {
      if (competencyMap[course.courseId]) {
        console.log(`✓ ${course.title} - Already has competency (${competencyMap[course.courseId].competencyId})`);
        skippedCount++;
      } else {
        // Find matching competency template
        const template = newCompetencies.find(comp => comp.courseId === course.courseId);
        
        if (template) {
          // Create new competency
          const newComp = new Competency(template);
          await newComp.save();
          console.log(`+ ${course.title} - Created competency (${template.competencyId})`);
          addedCount++;
        } else {
          console.log(`⚠ ${course.title} - No competency template found`);
        }
      }
    }

    console.log('\n========================================');
    console.log('Summary:');
    console.log('========================================');
    console.log(`Total courses: ${courses.length}`);
    console.log(`Competencies added: ${addedCount}`);
    console.log(`Courses already with competencies: ${skippedCount}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error adding competencies:', error);
    process.exit(1);
  }
}

addMissingCompetencies();
