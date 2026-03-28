const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '../assets/img/logo.png'
  },
  category: {
    type: String,
    default: 'Heavy Equipment'
  },
  duration: {
    type: String,
    default: '3 months'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'available'],
    default: 'available'
  },
  traineeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
