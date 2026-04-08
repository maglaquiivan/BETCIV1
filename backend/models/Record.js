const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Pending'],
    default: 'In Progress'
  },
  progress: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completionDate: Date,
  grade: String,
  certificate: String,
  // Enrollee data from enrollment form
  enrolleeData: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    dateOfBirth: Date,
    gender: String,
    education: String,
    emergencyContact: {
      name: String,
      phone: String
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Record', recordSchema);
