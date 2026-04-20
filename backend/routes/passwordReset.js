const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const AdminAccount = require('../models/AdminAccount');
const TraineeAccount = require('../models/TraineeAccount');
const PasswordReset = require('../models/PasswordReset');
const { sendPasswordResetEmail } = require('../utils/emailService');

/**
 * POST /api/forgot-password
 * Request a password reset link
 * 
 * Security: Does NOT reveal if email exists in database
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Get requester IP for security logging
    const requestIp = req.ip || req.connection.remoteAddress;
    
    // Search for user in both Admin and Trainee collections
    let user = null;
    let accountType = null;
    
    // Check Admin accounts
    user = await AdminAccount.findOne({ email: normalizedEmail });
    if (user) {
      accountType = 'admin';
    } else {
      // Check Trainee accounts
      user = await TraineeAccount.findOne({ email: normalizedEmail });
      if (user) {
        accountType = 'trainee';
      }
    }
    
    // SECURITY: Always return success message, even if user doesn't exist
    // This prevents email enumeration attacks
    const successMessage = 'If an account exists with this email, you will receive a password reset link shortly.';
    
    // If user doesn't exist, return success message without sending email
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${normalizedEmail}`);
      return res.status(200).json({ message: successMessage });
    }
    
    // Generate secure random token (32 bytes = 256 bits)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token before storing (additional security layer)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set expiration time (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Delete any existing reset tokens for this email
    await PasswordReset.deleteMany({ 
      email: normalizedEmail,
      accountType: accountType 
    });
    
    // Create new password reset record
    await PasswordReset.create({
      email: normalizedEmail,
      accountType: accountType,
      token: hashedToken,
      expiresAt: expiresAt,
      requestIp: requestIp,
      used: false
    });
    
    // Send password reset email
    try {
      await sendPasswordResetEmail(
        normalizedEmail,
        resetToken, // Send unhashed token in email
        user.firstName || 'User'
      );
      
      console.log(`✓ Password reset email sent to: ${normalizedEmail} (${accountType})`);
    } catch (emailError) {
      console.error('✗ Failed to send password reset email:', emailError);
      
      // Delete the token if email fails
      await PasswordReset.deleteOne({ token: hashedToken });
      
      // Return generic error (don't reveal email sending failed)
      return res.status(500).json({ 
        message: 'An error occurred. Please try again later.' 
      });
    }
    
    // Return success message
    res.status(200).json({ message: successMessage });
    
  } catch (error) {
    console.error('✗ Error in forgot-password:', error);
    res.status(500).json({ 
      message: 'An error occurred. Please try again later.' 
    });
  }
});

/**
 * POST /api/reset-password
 * Reset password using valid token
 * 
 * Security: Validates token, checks expiration, hashes new password
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Token and new password are required' 
      });
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }
    
    // Hash the provided token to match stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() } // Token must not be expired
    });
    
    // If token is invalid, expired, or already used
    if (!resetRecord) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token. Please request a new password reset.' 
      });
    }
    
    // Find the user account
    let user = null;
    let UserModel = null;
    
    if (resetRecord.accountType === 'admin') {
      UserModel = AdminAccount;
      user = await AdminAccount.findOne({ email: resetRecord.email });
    } else if (resetRecord.accountType === 'trainee') {
      UserModel = TraineeAccount;
      user = await TraineeAccount.findOne({ email: resetRecord.email });
    }
    
    // If user no longer exists
    if (!user) {
      // Mark token as used and delete
      await PasswordReset.deleteOne({ _id: resetRecord._id });
      
      return res.status(404).json({ 
        message: 'User account not found' 
      });
    }
    
    // Hash the new password with bcrypt (salt rounds: 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();
    
    // Delete the used token (cleanup)
    await PasswordReset.deleteOne({ _id: resetRecord._id });
    
    console.log(`✓ Password reset successful for: ${resetRecord.email} (${resetRecord.accountType})`);
    
    // Return success message
    res.status(200).json({ 
      message: 'Password has been reset successfully. You can now login with your new password.',
      accountType: resetRecord.accountType
    });
    
  } catch (error) {
    console.error('✗ Error in reset-password:', error);
    res.status(500).json({ 
      message: 'An error occurred while resetting password. Please try again.' 
    });
  }
});

/**
 * GET /api/verify-reset-token/:token
 * Verify if a reset token is valid (optional endpoint for frontend validation)
 * 
 * This endpoint allows frontend to check token validity before showing reset form
 */
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ 
        valid: false,
        message: 'Token is required' 
      });
    }
    
    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Check if token exists and is valid
    const resetRecord = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRecord) {
      return res.status(200).json({ 
        valid: false,
        message: 'Invalid or expired token' 
      });
    }
    
    // Calculate time remaining
    const timeRemaining = Math.floor((resetRecord.expiresAt - new Date()) / 1000 / 60);
    
    res.status(200).json({ 
      valid: true,
      message: 'Token is valid',
      expiresIn: `${timeRemaining} minutes`,
      accountType: resetRecord.accountType
    });
    
  } catch (error) {
    console.error('✗ Error verifying token:', error);
    res.status(500).json({ 
      valid: false,
      message: 'Error verifying token' 
    });
  }
});

/**
 * Cleanup expired tokens (can be called periodically)
 * MongoDB TTL index will auto-delete, but this provides manual cleanup
 */
router.delete('/cleanup-expired-tokens', async (req, res) => {
  try {
    const result = await PasswordReset.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    res.status(200).json({ 
      message: 'Cleanup completed',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('✗ Error cleaning up tokens:', error);
    res.status(500).json({ message: 'Cleanup failed' });
  }
});

module.exports = router;
