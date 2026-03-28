const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: true,
    unique: true
  },
  traineeName: {
    type: String,
    required: true
  },
  traineeEmail: {
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
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  purpose: {
    type: String,
    default: 'Assessment'
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
