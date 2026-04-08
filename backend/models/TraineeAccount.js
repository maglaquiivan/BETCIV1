const mongoose = require('mongoose');

const traineeAccountSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
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
    enum: ['trainee'],
    required: true,
    default: 'trainee'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  profilePicture: {
    type: String,
    default: null
  },
  phone: String,
  course: String,
  address: String,
  lastLogin: Date,
  dateOfBirth: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('TraineeAccount', traineeAccountSchema);
