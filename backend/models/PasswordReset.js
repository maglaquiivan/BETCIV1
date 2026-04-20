const mongoose = require('mongoose');

/**
 * Password Reset Token Schema
 * Stores temporary tokens for password reset functionality
 */
const passwordResetSchema = new mongoose.Schema({
  // User email (not storing user ID to avoid revealing if user exists)
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  // Account type: 'admin' or 'trainee'
  accountType: {
    type: String,
    required: true,
    enum: ['admin', 'trainee']
  },
  
  // Secure reset token (hashed)
  token: {
    type: String,
    required: true,
    unique: true
  },
  
  // Token expiration time (15 minutes from creation)
  expiresAt: {
    type: Date,
    required: true,
    // Automatically delete document after expiration
    index: { expires: 0 }
  },
  
  // Track if token has been used
  used: {
    type: Boolean,
    default: false
  },
  
  // IP address of requester (for security logging)
  requestIp: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster lookups
passwordResetSchema.index({ token: 1, expiresAt: 1 });
passwordResetSchema.index({ email: 1, accountType: 1 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
