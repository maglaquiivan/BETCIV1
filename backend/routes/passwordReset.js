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
 * Request a password reset link using username OR email
 * 
 * Accepts both username and email for user convenience
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { username } = req.body;
    
    // Validate input
    if (!username || !username.trim()) {
      return res.status(400).json({ 
        message: 'Please provide a username or email' 
      });
    }
    
    // Normalize input
    const normalizedInput = username.trim().toLowerCase();
    
    // Get requester IP for security logging
    const requestIp = req.ip || req.connection.remoteAddress;
    
    // Search for user in both Admin and Trainee collections by username OR email
    let user = null;
    let accountType = null;
    let userEmail = null;
    
    // Check if input is email (contains @)
    const isEmail = normalizedInput.includes('@');
    
    if (isEmail) {
      // Search by email
      console.log(`Searching by email: ${normalizedInput}`);
      
      // Check Admin accounts by email
      user = await AdminAccount.findOne({ email: normalizedInput });
      if (user) {
        accountType = 'admin';
        userEmail = user.email;
      } else {
        // Check Trainee accounts by email
        user = await TraineeAccount.findOne({ email: normalizedInput });
        if (user) {
          accountType = 'trainee';
          userEmail = user.email;
        }
      }
    } else {
      // Search by username
      console.log(`Searching by username: ${normalizedInput}`);
      
      // Check Admin accounts by username
      user = await AdminAccount.findOne({ username: normalizedInput });
      if (user) {
        accountType = 'admin';
        userEmail = user.email;
      } else {
        // Check Trainee accounts by username
        user = await TraineeAccount.findOne({ username: normalizedInput });
        if (user) {
          accountType = 'trainee';
          userEmail = user.email;
        }
      }
    }
    
    // If user doesn't exist, return error message
    if (!user || !userEmail) {
      console.log(`Password reset requested for non-existent ${isEmail ? 'email' : 'username'}: ${normalizedInput}`);
      return res.status(404).json({ 
        message: isEmail 
          ? 'Email not found. Please check your email and try again.'
          : 'Username not found. Please check your username and try again.'
      });
    }
    
    // Normalize email
    const normalizedEmail = userEmail.toLowerCase().trim();
    
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
      email: userEmail,
      accountType: accountType 
    });
    
    // Create new password reset record
    await PasswordReset.create({
      email: userEmail,
      accountType: accountType,
      token: hashedToken,
      expiresAt: expiresAt,
      requestIp: requestIp,
      used: false
    });
    
    // Send password reset email
    try {
      // Check if email service is configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || 
          process.env.EMAIL_PASSWORD === 'PASTE_YOUR_APP_PASSWORD_HERE') {
        console.warn('\n⚠️  EMAIL SERVICE NOT CONFIGURED - DEVELOPMENT MODE');
        console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.warn('Password reset token generated but email NOT sent.');
        console.warn('To enable email sending, follow these steps:');
        console.warn('');
        console.warn('1. Enable 2-Step Verification on Gmail:');
        console.warn('   https://myaccount.google.com/security');
        console.warn('');
        console.warn('2. Generate App Password:');
        console.warn('   https://myaccount.google.com/apppasswords');
        console.warn('   - Select "Mail" and "Windows Computer"');
        console.warn('   - Copy the 16-character password (remove spaces)');
        console.warn('');
        console.warn('3. Update backend/.env file:');
        console.warn('   EMAIL_USER=baki40843@gmail.com');
        console.warn('   EMAIL_PASSWORD=<your-16-char-app-password>');
        console.warn('');
        console.warn('4. Restart server: npm start');
        console.warn('');
        console.warn('5. Test: node test-email-simple.js');
        console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`\n✓ Password reset token generated for ${isEmail ? 'email' : 'username'}: ${normalizedInput}`);
        console.log(`   Account Type: ${accountType}`);
        console.log(`   Email: ${userEmail}`);
        console.log(`   Token: ${resetToken}`);
        console.log(`   Valid for: 15 minutes`);
        console.log(`   Reset URL: ${process.env.FRONTEND_URL || 'http://localhost:5500'}/auth/reset-password.html?token=${resetToken}`);
        console.warn('\n⚠️  User will see success message but NO EMAIL will be sent!\n');
      } else {
        // Email is configured, send the email
        await sendPasswordResetEmail(
          userEmail,
          resetToken,
          user.firstName || 'User'
        );
        
        console.log(`✓ Password reset email sent for ${isEmail ? 'email' : 'username'}: ${normalizedInput} (${accountType})`);
        console.log(`   Email sent to: ${userEmail}`);
      }
    } catch (emailError) {
      console.error('✗ Failed to send password reset email:', emailError.message);
      
      // Delete the token if email fails
      await PasswordReset.deleteOne({ token: hashedToken });
      
      // Return generic error (don't reveal email sending failed)
      return res.status(500).json({ 
        message: 'An error occurred while sending the reset link. Please try again later.' 
      });
    }
    
    // Return success message
    res.status(200).json({ 
      message: 'Password reset link has been sent to your email address. Please check your inbox and spam folder.' 
    });
    
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
