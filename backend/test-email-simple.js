/**
 * Simple Email Configuration Test
 * Run this to verify your Gmail App Password is working
 * 
 * Usage: node test-email-simple.js
 */

require('dotenv').config();
const { testEmailConfig } = require('./utils/emailService');

console.log('Starting email configuration test...\n');

testEmailConfig()
  .then((success) => {
    if (success) {
      console.log('\n✓ SUCCESS! Your email configuration is working correctly.');
      console.log('  You can now use password reset functionality.');
      process.exit(0);
    } else {
      console.log('\n✗ FAILED! Please fix the errors above and try again.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n✗ Test failed with error:', error.message);
    process.exit(1);
  });
