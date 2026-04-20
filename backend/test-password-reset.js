/**
 * Password Reset System Test Script
 * 
 * This script tests the password reset functionality
 * Run with: node test-password-reset.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const AdminAccount = require('./models/AdminAccount');
const TraineeAccount = require('./models/TraineeAccount');
const PasswordReset = require('./models/PasswordReset');
const { sendPasswordResetEmail, verifyEmailConfig } = require('./utils/emailService');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n${colors.cyan}${msg}${colors.reset}\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`)
};

async function runTests() {
  try {
    log.section('PASSWORD RESET SYSTEM TEST');
    
    // Connect to MongoDB
    log.info('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    log.success('MongoDB connected');
    
    // Test 1: Verify Email Configuration
    log.section('Test 1: Email Configuration');
    const emailConfigValid = await verifyEmailConfig();
    if (emailConfigValid) {
      log.success('Email service configured correctly');
    } else {
      log.error('Email service configuration failed');
      log.warn('Please check EMAIL_USER and EMAIL_PASSWORD in .env file');
      log.info('You need a Gmail App Password, not your regular password');
      log.info('Visit: https://myaccount.google.com/apppasswords');
    }
    
    // Test 2: Check Database Models
    log.section('Test 2: Database Models');
    
    const adminCount = await AdminAccount.countDocuments();
    log.info(`Admin accounts in database: ${adminCount}`);
    
    const traineeCount = await TraineeAccount.countDocuments();
    log.info(`Trainee accounts in database: ${traineeCount}`);
    
    if (adminCount === 0 && traineeCount === 0) {
      log.warn('No user accounts found in database');
      log.info('You may need to create test accounts first');
    }
    
    // Test 3: Find Test User
    log.section('Test 3: Finding Test User');
    
    let testUser = await AdminAccount.findOne().limit(1);
    let accountType = 'admin';
    
    if (!testUser) {
      testUser = await TraineeAccount.findOne().limit(1);
      accountType = 'trainee';
    }
    
    if (!testUser) {
      log.error('No test user found');
      log.info('Creating a test admin account...');
      
      const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
      testUser = await AdminAccount.create({
        accountId: 'TEST-ADMIN-001',
        username: 'testadmin',
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'Admin',
        role: 'admin',
        status: 'active'
      });
      accountType = 'admin';
      log.success('Test admin account created');
    }
    
    log.success(`Found test user: ${testUser.email} (${accountType})`);
    log.info(`Name: ${testUser.firstName} ${testUser.lastName}`);
    
    // Test 4: Generate Reset Token
    log.section('Test 4: Token Generation');
    
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    log.success(`Generated token: ${resetToken.substring(0, 20)}...`);
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    log.success(`Hashed token: ${hashedToken.substring(0, 20)}...`);
    
    // Test 5: Store Token in Database
    log.section('Test 5: Token Storage');
    
    // Delete existing tokens for this user
    await PasswordReset.deleteMany({ 
      email: testUser.email,
      accountType: accountType 
    });
    
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const resetRecord = await PasswordReset.create({
      email: testUser.email,
      accountType: accountType,
      token: hashedToken,
      expiresAt: expiresAt,
      requestIp: '127.0.0.1',
      used: false
    });
    
    log.success('Token stored in database');
    log.info(`Token ID: ${resetRecord._id}`);
    log.info(`Expires at: ${expiresAt.toLocaleString()}`);
    
    // Test 6: Send Email (Optional)
    log.section('Test 6: Email Sending (Optional)');
    
    if (emailConfigValid) {
      log.warn('This will send a real email. Continue? (Ctrl+C to cancel)');
      log.info('Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        await sendPasswordResetEmail(
          testUser.email,
          resetToken,
          testUser.firstName
        );
        log.success(`Email sent to: ${testUser.email}`);
        log.info('Check your inbox for the password reset email');
      } catch (error) {
        log.error(`Failed to send email: ${error.message}`);
      }
    } else {
      log.warn('Skipping email test (email not configured)');
    }
    
    // Test 7: Verify Token
    log.section('Test 7: Token Verification');
    
    const foundToken = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (foundToken) {
      log.success('Token found and valid');
      log.info(`Email: ${foundToken.email}`);
      log.info(`Account Type: ${foundToken.accountType}`);
      log.info(`Expires: ${foundToken.expiresAt.toLocaleString()}`);
    } else {
      log.error('Token not found or invalid');
    }
    
    // Test 8: Password Hashing
    log.section('Test 8: Password Hashing');
    
    const testPassword = 'NewSecurePassword123!';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    log.success('Password hashed successfully');
    log.info(`Original: ${testPassword}`);
    log.info(`Hashed: ${hashedPassword.substring(0, 30)}...`);
    
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    if (isMatch) {
      log.success('Password verification works correctly');
    } else {
      log.error('Password verification failed');
    }
    
    // Test 9: Cleanup
    log.section('Test 9: Cleanup');
    
    const deleteResult = await PasswordReset.deleteOne({ _id: resetRecord._id });
    if (deleteResult.deletedCount > 0) {
      log.success('Test token deleted from database');
    }
    
    // Summary
    log.section('TEST SUMMARY');
    log.success('All tests completed!');
    log.info('');
    log.info('Next steps:');
    log.info('1. Ensure EMAIL_USER and EMAIL_PASSWORD are set in .env');
    log.info('2. Test the API endpoints with cURL or Postman');
    log.info('3. Create frontend forms for password reset');
    log.info('');
    log.info('API Endpoints:');
    log.info('  POST /api/forgot-password');
    log.info('  POST /api/reset-password');
    log.info('  GET  /api/verify-reset-token/:token');
    
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    log.info('\nMongoDB connection closed');
  }
}

// Run tests
runTests();
