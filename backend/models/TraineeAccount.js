const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

// Hash password before saving
traineeAccountSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('TraineeAccount', traineeAccountSchema);
