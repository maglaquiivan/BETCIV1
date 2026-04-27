const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Course = require('../models/Course');
const User = require('../models/User');
const Trainee = require('../models/Trainee');
const Appointment = require('../models/Appointment');
const Competency = require('../models/Competency');
const Account = require('../models/Account');
const AdminAccount = require('../models/AdminAccount');
const TraineeAccount = require('../models/TraineeAccount');
const Record = require('../models/Record');
const Attendance = require('../models/Attendance');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

const defaultCourses = [
  {
    courseId: 'forklift-operation',
    title: 'Forklift Operation NC II',
    description: 'Master forklift operation, safety protocols, and material handling techniques for industrial and warehouse environments.',
    image: '../../assets/img/fork.png',
    category: 'Heavy Equipment',
    duration: '3 months',
    status: 'active',
    traineeCount: 24
  },
  {
    courseId: 'bulldozer-operation',
    title: 'Bulldozer Operation NC II',
    description: 'Learn bulldozer operation, earthmoving techniques, and site preparation for construction and mining projects.',
    image: '../../assets/img/bulldozer.png',
    category: 'Heavy Equipment',
    duration: '3 months',
    status: 'active',
    traineeCount: 18
  },
  {
    courseId: 'dump-truck-operation',
    title: 'Dump Truck Operation NC II',
    description: 'Professional training for rigid on-highway dump truck operation, hauling, and transportation safety.',
    image: '../../assets/img/dump truck.png',
    category: 'Heavy Equipment',
    duration: '2 months',
    status: 'available',
    traineeCount: 0
  },
  {
    courseId: 'hydraulic-excavator',
    title: 'Hydraulic Excavator NC II',
    description: 'Advanced excavator operation, digging techniques, and hydraulic system maintenance for construction sites.',
    image: '../../assets/img/hydraulic excavator.png',
    category: 'Heavy Equipment',
    duration: '4 months',
    status: 'completed',
    traineeCount: 15
  },
  {
    courseId: 'wheel-loader',
    title: 'Wheel Loader NC II',
    description: 'Comprehensive wheel loader training, material handling, and loading techniques for various applications.',
    image: '../../assets/img/logo.png',
    category: 'Heavy Equipment',
    duration: '3 months',
    status: 'available',
    traineeCount: 0
  },
  {
    courseId: 'backhoe-loader',
    title: 'Backhoe Loader NC II',
    description: 'Master backhoe loader operation, digging, trenching, and utility work for construction projects.',
    image: '../../assets/img/logo.png',
    category: 'Heavy Equipment',
    duration: '3 months',
    status: 'available',
    traineeCount: 0
  }
];

const defaultUsers = [
  {
    userId: 'admin001',
    email: 'admin@betci.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    userId: 'trainee001',
    email: 'trainee@betci.com',
    password: 'trainee123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'trainee',
    phone: '09123456789',
    address: 'Sample Address'
  }
];

const defaultTrainees = [
  {
    traineeId: 'TRN001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '09171234567',
    address: '123 Main St, Manila',
    dateOfBirth: new Date('1995-05-15'),
    gender: 'Male',
    enrolledCourses: [{
      courseId: 'forklift-operation',
      courseName: 'Forklift Operation NC II',
      enrollmentDate: new Date('2024-01-15'),
      status: 'active',
      progress: 65
    }],
    status: 'active',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Sister',
      phone: '09187654321'
    }
  },
  {
    traineeId: 'TRN002',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@example.com',
    phone: '09181234567',
    address: '456 Rizal Ave, Quezon City',
    dateOfBirth: new Date('1998-08-20'),
    gender: 'Female',
    enrolledCourses: [{
      courseId: 'bulldozer-operation',
      courseName: 'Bulldozer Operation NC II',
      enrollmentDate: new Date('2024-01-20'),
      status: 'active',
      progress: 45
    }],
    status: 'active',
    emergencyContact: {
      name: 'Pedro Santos',
      relationship: 'Father',
      phone: '09197654321'
    }
  },
  {
    traineeId: 'TRN003',
    firstName: 'Carlos',
    lastName: 'Reyes',
    email: 'carlos.reyes@example.com',
    phone: '09191234567',
    address: '789 Bonifacio St, Makati',
    dateOfBirth: new Date('1992-03-10'),
    gender: 'Male',
    enrolledCourses: [{
      courseId: 'hydraulic-excavator',
      courseName: 'Hydraulic Excavator NC II',
      enrollmentDate: new Date('2023-10-01'),
      status: 'completed',
      progress: 100
    }],
    status: 'active',
    emergencyContact: {
      name: 'Ana Reyes',
      relationship: 'Wife',
      phone: '09207654321'
    }
  },
  {
    traineeId: 'TRN004',
    firstName: 'Lisa',
    lastName: 'Garcia',
    email: 'lisa.garcia@example.com',
    phone: '09201234567',
    address: '321 Luna St, Pasig',
    dateOfBirth: new Date('1997-11-25'),
    gender: 'Female',
    enrolledCourses: [{
      courseId: 'forklift-operation',
      courseName: 'Forklift Operation NC II',
      enrollmentDate: new Date('2024-02-01'),
      status: 'active',
      progress: 30
    }],
    status: 'active',
    emergencyContact: {
      name: 'Roberto Garcia',
      relationship: 'Brother',
      phone: '09217654321'
    }
  },
  {
    traineeId: 'TRN005',
    firstName: 'Miguel',
    lastName: 'Cruz',
    email: 'miguel.cruz@example.com',
    phone: '09211234567',
    address: '654 Del Pilar St, Taguig',
    dateOfBirth: new Date('1994-07-08'),
    gender: 'Male',
    enrolledCourses: [{
      courseId: 'bulldozer-operation',
      courseName: 'Bulldozer Operation NC II',
      enrollmentDate: new Date('2024-01-10'),
      status: 'active',
      progress: 55
    }],
    status: 'active',
    emergencyContact: {
      name: 'Carmen Cruz',
      relationship: 'Mother',
      phone: '09227654321'
    }
  }
];

const defaultAppointments = [
  {
    appointmentId: 'APT001',
    traineeName: 'John Doe',
    traineeEmail: 'john.doe@example.com',
    courseId: 'forklift-operation',
    courseName: 'Forklift Operation NC II',
    appointmentDate: new Date('2024-03-15'),
    appointmentTime: '10:00 AM',
    status: 'confirmed',
    purpose: 'Initial Assessment',
    notes: 'First time assessment for forklift certification'
  },
  {
    appointmentId: 'APT002',
    traineeName: 'Maria Santos',
    traineeEmail: 'maria.santos@example.com',
    courseId: 'bulldozer-operation',
    courseName: 'Bulldozer Operation NC II',
    appointmentDate: new Date('2024-03-16'),
    appointmentTime: '2:00 PM',
    status: 'pending',
    purpose: 'Mid-term Evaluation',
    notes: 'Progress check and skill assessment'
  },
  {
    appointmentId: 'APT003',
    traineeName: 'Carlos Reyes',
    traineeEmail: 'carlos.reyes@example.com',
    courseId: 'hydraulic-excavator',
    courseName: 'Hydraulic Excavator NC II',
    appointmentDate: new Date('2024-03-18'),
    appointmentTime: '9:00 AM',
    status: 'completed',
    purpose: 'Final Certification',
    notes: 'Completed all requirements, ready for certification'
  },
  {
    appointmentId: 'APT004',
    traineeName: 'Lisa Garcia',
    traineeEmail: 'lisa.garcia@example.com',
    courseId: 'forklift-operation',
    courseName: 'Forklift Operation NC II',
    appointmentDate: new Date('2024-03-20'),
    appointmentTime: '11:00 AM',
    status: 'confirmed',
    purpose: 'Safety Training',
    notes: 'Mandatory safety protocols training session'
  }
];

const defaultCompetencies = [
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
    status: 'active'
  },
  {
    competencyId: 'COMP002',
    title: 'Operate Bulldozer',
    code: 'CON311202',
    description: 'This unit covers the knowledge, skills and attitudes required to operate bulldozer for earthmoving operations.',
    courseId: 'bulldozer-operation',
    courseName: 'Bulldozer Operation NC II',
    level: 'NC II',
    units: [
      { unitCode: 'CON311202-01', unitTitle: 'Plan earthmoving operations', hours: 10 },
      { unitCode: 'CON311202-02', unitTitle: 'Perform pre-operation inspection', hours: 12 },
      { unitCode: 'CON311202-03', unitTitle: 'Operate bulldozer', hours: 50 },
      { unitCode: 'CON311202-04', unitTitle: 'Perform maintenance checks', hours: 10 }
    ],
    status: 'active'
  },
  {
    competencyId: 'COMP003',
    title: 'Operate Hydraulic Excavator',
    code: 'CON311203',
    description: 'This unit covers the knowledge, skills and attitudes required to operate hydraulic excavator.',
    courseId: 'hydraulic-excavator',
    courseName: 'Hydraulic Excavator NC II',
    level: 'NC II',
    units: [
      { unitCode: 'CON311203-01', unitTitle: 'Prepare for excavation work', hours: 12 },
      { unitCode: 'CON311203-02', unitTitle: 'Conduct pre-operation checks', hours: 15 },
      { unitCode: 'CON311203-03', unitTitle: 'Operate hydraulic excavator', hours: 60 },
      { unitCode: 'CON311203-04', unitTitle: 'Perform routine maintenance', hours: 13 }
    ],
    status: 'active'
  }
];

const defaultAccounts = [
  {
    accountId: 'ACC001',
    username: 'admin',
    email: 'admin@betci.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    lastLogin: new Date(),
    permissions: ['all']
  },
  {
    accountId: 'ACC002',
    username: 'instructor1',
    email: 'instructor@betci.com',
    password: 'instructor123',
    firstName: 'Robert',
    lastName: 'Johnson',
    role: 'instructor',
    status: 'active',
    lastLogin: new Date(),
    permissions: ['view_trainees', 'edit_records', 'manage_courses']
  },
  {
    accountId: 'ACC003',
    username: 'staff1',
    email: 'staff@betci.com',
    password: 'staff123',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: 'staff',
    status: 'active',
    lastLogin: new Date(),
    permissions: ['view_trainees', 'manage_appointments']
  }
];

const defaultRecords = [
  {
    userId: 'TRN001',
    courseId: 'forklift-operation',
    courseName: 'Forklift Operation NC II',
    status: 'In Progress',
    progress: 65,
    startDate: new Date('2024-01-15'),
    grade: 'N/A'
  },
  {
    userId: 'TRN002',
    courseId: 'bulldozer-operation',
    courseName: 'Bulldozer Operation NC II',
    status: 'In Progress',
    progress: 45,
    startDate: new Date('2024-01-20'),
    grade: 'N/A'
  },
  {
    userId: 'TRN003',
    courseId: 'hydraulic-excavator',
    courseName: 'Hydraulic Excavator NC II',
    status: 'Completed',
    progress: 100,
    startDate: new Date('2023-10-01'),
    completionDate: new Date('2024-02-15'),
    grade: 'Passed',
    certificate: 'CERT-2024-001'
  }
];

const defaultAttendance = [
  {
    userId: 'TRN001',
    firstName: 'John',
    lastName: 'Doe',
    courseId: 'forklift-operation',
    date: new Date('2024-03-01'),
    status: 'present',
    timeIn: '08:00 AM',
    timeOut: '05:00 PM',
    remarks: 'On time'
  },
  {
    userId: 'TRN001',
    firstName: 'John',
    lastName: 'Doe',
    courseId: 'forklift-operation',
    date: new Date('2024-03-02'),
    status: 'present',
    timeIn: '08:15 AM',
    timeOut: '05:00 PM',
    remarks: 'Slightly late'
  },
  {
    userId: 'TRN002',
    firstName: 'Maria',
    lastName: 'Santos',
    courseId: 'bulldozer-operation',
    date: new Date('2024-03-01'),
    status: 'present',
    timeIn: '08:00 AM',
    timeOut: '05:00 PM',
    remarks: 'On time'
  },
  {
    userId: 'TRN002',
    firstName: 'Maria',
    lastName: 'Santos',
    courseId: 'bulldozer-operation',
    date: new Date('2024-03-02'),
    status: 'late',
    timeIn: '09:30 AM',
    timeOut: '05:00 PM',
    remarks: 'Traffic delay'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    await User.deleteMany({});
    await Trainee.deleteMany({});
    await Appointment.deleteMany({});
    await Competency.deleteMany({});
    await Account.deleteMany({});
    await AdminAccount.deleteMany({});
    await TraineeAccount.deleteMany({});
    await Record.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data');

    // Insert courses
    await Course.insertMany(defaultCourses);
    console.log('✓ Courses seeded successfully (6 courses)');

    // Insert users (using create to trigger pre-save hook)
    for (const user of defaultUsers) {
      await User.create(user);
    }
    console.log('✓ Users seeded successfully (2 users)');

    // Insert trainees
    await Trainee.insertMany(defaultTrainees);
    console.log('✓ Trainees seeded successfully (5 trainees)');

    // Insert appointments
    await Appointment.insertMany(defaultAppointments);
    console.log('✓ Appointments seeded successfully (4 appointments)');

    // Insert competencies
    await Competency.insertMany(defaultCompetencies);
    console.log('✓ Competencies seeded successfully (3 competencies)');

    // Insert accounts (using create to trigger pre-save hook)
    for (const acc of defaultAccounts) {
      await Account.create(acc);
    }
    console.log('✓ Accounts seeded successfully (3 accounts)');

    // Insert admin accounts (using create to trigger pre-save hook)
    const adminAccounts = defaultAccounts.filter(acc => acc.role === 'admin' || acc.role === 'instructor' || acc.role === 'staff');
    if (adminAccounts.length > 0) {
      for (const acc of adminAccounts) {
        await AdminAccount.create({
          accountId: acc.accountId,
          username: acc.username,
          email: acc.email,
          password: acc.password,
          firstName: acc.firstName,
          lastName: acc.lastName,
          role: acc.role,
          status: acc.status,
          lastLogin: acc.lastLogin
        });
      }
      console.log(`✓ Admin accounts seeded successfully (${adminAccounts.length} accounts)`);
    }

    // Insert trainee account (using create to trigger pre-save hook)
    const traineeAccountData = {
      accountId: 'ACC1774597634318',
      username: 'trainee',
      email: 'trainee@betci.com',
      password: 'trainee123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'trainee',
      status: 'active',
      phone: '+63 912 345 6789',
      address: '123 Main St, Manila',
      dateOfBirth: new Date('1995-05-15')
    };
    await TraineeAccount.create(traineeAccountData);
    console.log('✓ Trainee accounts seeded successfully (1 account)');

    // Insert records
    await Record.insertMany(defaultRecords);
    console.log('✓ Records seeded successfully (3 records)');

    // Insert attendance
    await Attendance.insertMany(defaultAttendance);
    console.log('✓ Attendance seeded successfully (4 attendance records)');

    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log('\nCollections created:');
    console.log('- courses (6)');
    console.log('- users (2)');
    console.log('- trainees (5)');
    console.log('- appointments (4)');
    console.log('- competencies (3)');
    console.log('- accounts (3 - legacy)');
    console.log('- adminaccounts (3 - new)');
    console.log('- traineeaccounts (1 - new)');
    console.log('- records (3)');
    console.log('- attendances (4)');
    console.log('\nDefault login credentials:');
    console.log('- Admin: admin@betci.com / admin123 (ACC001)');
    console.log('- Trainee: trainee@betci.com / trainee123 (ACC1774597634318)');
    console.log('- Instructor: instructor@betci.com / instructor123 (ACC002)');
    console.log('========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
