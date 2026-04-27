const mongoose = require('mongoose');
const Competency = require('./models/Competency');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

// Competencies for each course
const competenciesToCreate = [
  {
    competencyId: 'COMP001',
    title: 'Operate Forklift Truck',
    code: 'CON311201',
    level: 'NC II',
    image: '../../assets/img/fork.png',
    description: 'This unit covers the knowledge, skills and attitudes required to operate forklift truck.',
    courseId: 'forklift-operation',
    courseName: 'Forklift Operation NC II',
    units: [
      { unitCode: 'U1', unitTitle: 'Plan and prepare for task', hours: 20 },
      { unitCode: 'U2', unitTitle: 'Perform pre-operation checks', hours: 15 },
      { unitCode: 'U3', unitTitle: 'Operate forklift truck', hours: 40 },
      { unitCode: 'U4', unitTitle: 'Perform post-operation activities', hours: 10 }
    ]
  },
  {
    competencyId: 'COMP002',
    title: 'Operate Bulldozer',
    code: 'CON311202',
    level: 'NC II',
    image: '../../assets/img/bulldozer.png',
    description: 'This unit covers the knowledge, skills and attitudes required to operate bulldozer for earthmoving operations.',
    courseId: 'bulldozer-operation',
    courseName: 'Bulldozer Operation NC II',
    units: [
      { unitCode: 'U1', unitTitle: 'Plan earthmoving operations', hours: 25 },
      { unitCode: 'U2', unitTitle: 'Perform pre-operation inspection', hours: 20 },
      { unitCode: 'U3', unitTitle: 'Operate bulldozer', hours: 50 },
      { unitCode: 'U4', unitTitle: 'Perform maintenance checks', hours: 15 }
    ]
  },
  {
    competencyId: 'COMP003',
    title: 'Operate Hydraulic Excavator',
    code: 'CON311203',
    level: 'NC II',
    image: '../../assets/img/hydraulic excavator.png',
    description: 'This unit covers the knowledge, skills and attitudes required to operate hydraulic excavator.',
    courseId: 'hydraulic-excavator',
    courseName: 'Hydraulic Excavator NC II',
    units: [
      { unitCode: 'U1', unitTitle: 'Prepare for excavation work', hours: 20 },
      { unitCode: 'U2', unitTitle: 'Conduct pre-operation checks', hours: 15 },
      { unitCode: 'U3', unitTitle: 'Operate hydraulic excavator', hours: 45 },
      { unitCode: 'U4', unitTitle: 'Perform routine maintenance', hours: 20 }
    ]
  },
  {
    competencyId: 'COMP004',
    title: 'Operate Dump Truck',
    code: 'CON311204',
    level: 'NC II',
    image: '../../assets/img/dump truck.png',
    description: 'This unit covers the knowledge, skills and attitudes required to operate dump truck for material transport.',
    courseId: 'dump-truck-operation',
    courseName: 'Dump Truck Operation NC II',
    units: [
      { unitCode: 'U1', unitTitle: 'Plan transport operations', hours: 15 },
      { unitCode: 'U2', unitTitle: 'Perform vehicle inspection', hours: 10 },
      { unitCode: 'U3', unitTitle: 'Operate dump truck', hours: 35 },
      { unitCode: 'U4', unitTitle: 'Perform post-operation checks', hours: 10 }
    ]
  },
  {
    competencyId: 'COMP005',
    title: 'Operate Wheel Loader',
    code: 'CON311205',
    level: 'NC II',
    image: '../../assets/img/fork.png',
    description: 'This unit covers the knowledge, skills and attitudes required to operate wheel loader for material handling.',
    courseId: 'wheel-loader',
    courseName: 'Wheel Loader NC II',
    units: [
      { unitCode: 'U1', unitTitle: 'Plan loading operations', hours: 20 },
      { unitCode: 'U2', unitTitle: 'Perform pre-operation checks', hours: 15 },
      { unitCode: 'U3', unitTitle: 'Operate wheel loader', hours: 40 },
      { unitCode: 'U4', unitTitle: 'Perform maintenance activities', hours: 15 }
    ]
  },
  {
    competencyId: 'COMP006',
    title: 'Operate Backhoe Loader',
    code: 'CON311206',
    level: 'NC II',
    image: '../../assets/img/bulldozer.png',
    description: 'This unit covers the knowledge, skills and attitudes required to operate backhoe loader for excavation and loading.',
    courseId: 'backhoe-loader',
    courseName: 'Backhoe Loader NC II',
    units: [
      { unitCode: 'U1', unitTitle: 'Plan excavation and loading tasks', hours: 20 },
      { unitCode: 'U2', unitTitle: 'Perform pre-operation checks', hours: 15 },
      { unitCode: 'U3', unitTitle: 'Operate backhoe loader', hours: 45 },
      { unitCode: 'U4', unitTitle: 'Perform routine maintenance', hours: 15 }
    ]
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('\n=== CREATING COMPETENCIES FOR ALL COURSES ===');
    
    // Delete existing competencies first
    await Competency.deleteMany({});
    console.log('Cleared existing competencies');
    
    // Create new competencies
    for (const comp of competenciesToCreate) {
      const result = await Competency.create(comp);
      console.log(`✓ Created: ${result.title} (${result.code})`);
    }

    console.log('\n=== VERIFICATION ===');
    const competencies = await Competency.find();
    console.log(`Total competencies created: ${competencies.length}`);
    
    competencies.forEach(c => {
      const totalHours = c.units.reduce((sum, u) => sum + (u.hours || 0), 0);
      console.log(`${c.title}: ${totalHours} hours, ${c.units.length} units`);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
