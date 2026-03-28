const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'trainee'],
    default: 'trainee'
  },
  phone: String,
  address: String,
  enrolledCourses: [{
    courseId: String,
    enrolledDate: Date,
    status: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
