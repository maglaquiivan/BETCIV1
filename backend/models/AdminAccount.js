const mongoose = require('mongoose');

const adminAccountSchema = new mongoose.Schema({
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
    enum: ['admin', 'instructor', 'staff'],
    required: true,
    default: 'admin'
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
  address: String,
  lastLogin: Date,
  permissions: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminAccount', adminAccountSchema);
