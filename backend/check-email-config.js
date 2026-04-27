/**
 * Quick Email Configuration Checker
 * Run this to see if your email is configured correctly
 */

require('dotenv').config();

console.log('\n='.repeat(60));
console.log('EMAIL CONFIGURATION CHECK');
console.log('='.repeat(60));

console.log('\n📧 Current Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 
  (process.env.EMAIL_PASSWORD === 'PASTE_YOUR_APP_PASSWORD_HERE' ? 
    '❌ NOT CONFIGURED (still placeholder)' : 
    '✓ Configured (length: ' + process.env.EMAIL_PASSWORD.length + ' chars)') 
  : '❌ NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

console.log('\n🔍 Diagnosis:');

if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
  console.log('❌ EMAIL_USER is not configured');
  console.log('   Fix: Set EMAIL_USER=your-email@gmail.com in .env');
} else {
  console.log('✓ EMAIL_USER is configured:', process.env.EMAIL_USER);
}

if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'PASTE_YOUR_APP_PASSWORD_HERE' || process.env.EMAIL_PASSWORD === 'your-app-password-here') {
  console.log('❌ EMAIL_PASSWORD is NOT configured (still has placeholder)');
  console.log('   This is why emails are not sending!');
  console.log('\n📝 To fix this:');
  console.log('   1. Go to: https://myaccount.google.com/apppasswords');
  console.log('   2. Generate App Password for "Mail"');
  console.log('   3. Copy the 16-character password');
  console.log('   4. Open backend/.env');
  console.log('   5. Replace PASTE_YOUR_APP_PASSWORD_HERE with your password');
  console.log('   6. Save and restart server');
} else {
  console.log('✓ EMAIL_PASSWORD is configured (length:', process.env.EMAIL_PASSWORD.length, 'chars)');
  
  if (process.env.EMAIL_PASSWORD.length !== 16) {
    console.log('⚠️  Warning: Gmail App Passwords are usually 16 characters');
    console.log('   Your password is', process.env.EMAIL_PASSWORD.length, 'characters');
    console.log('   Make sure you removed spaces from the password');
  }
}

console.log('\n🧪 Testing Email Service...');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email service verification FAILED');
    console.log('   Error:', error.message);
    console.log('\n💡 Common causes:');
    console.log('   - Wrong email address');
    console.log('   - Wrong App Password');
    console.log('   - Using regular password instead of App Password');
    console.log('   - Spaces in the password');
    console.log('   - 2-Step Verification not enabled');
  } else {
    console.log('✅ Email service is configured correctly!');
    console.log('   Emails should be sending now.');
  }
  
  console.log('\n' + '='.repeat(60));
  process.exit(error ? 1 : 0);
});
