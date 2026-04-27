// Test Email Configuration
// Run this script to test if your Gmail App Password is working
// Usage: node test-email.js

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n========================================');
console.log('Testing Email Configuration');
console.log('========================================\n');

// Check if environment variables are set
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ SET (hidden)' : '❌ NOT SET');
console.log('');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ ERROR: Email credentials not configured in .env file');
    console.log('\nPlease follow these steps:');
    console.log('1. Open backend/.env file');
    console.log('2. Set EMAIL_USER=baki40843@gmail.com');
    console.log('3. Generate App Password from: https://myaccount.google.com/apppasswords');
    console.log('4. Set EMAIL_PASSWORD=<your-16-character-app-password>');
    console.log('5. Save the file and run this test again');
    process.exit(1);
}

if (process.env.EMAIL_PASSWORD === 'PASTE_YOUR_APP_PASSWORD_HERE') {
    console.error('❌ ERROR: You need to replace PASTE_YOUR_APP_PASSWORD_HERE with your actual App Password');
    console.log('\nSteps to get App Password:');
    console.log('1. Go to: https://myaccount.google.com/apppasswords');
    console.log('2. Sign in with baki40843@gmail.com');
    console.log('3. Enable 2-Step Verification if not already enabled');
    console.log('4. Generate App Password for "Mail"');
    console.log('5. Copy the 16-character password');
    console.log('6. Update EMAIL_PASSWORD in backend/.env file');
    console.log('7. Run this test again');
    process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

console.log('Testing connection to Gmail...\n');

// Verify connection
transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ CONNECTION FAILED\n');
        console.error('Error:', error.message);
        console.log('\n========================================');
        console.log('Troubleshooting:');
        console.log('========================================');
        
        if (error.message.includes('Invalid login')) {
            console.log('❌ Invalid login - Your password is incorrect');
            console.log('\nCommon causes:');
            console.log('1. You are using your regular Gmail password (this will NOT work)');
            console.log('2. You need to use an App Password instead');
            console.log('3. App Password must be 16 characters (no spaces)');
            console.log('\nHow to fix:');
            console.log('1. Go to: https://myaccount.google.com/apppasswords');
            console.log('2. Generate a NEW App Password');
            console.log('3. Copy the 16-character password (remove spaces)');
            console.log('4. Update EMAIL_PASSWORD in backend/.env');
            console.log('5. Run this test again');
        } else if (error.message.includes('2-Step Verification')) {
            console.log('❌ 2-Step Verification not enabled');
            console.log('\nHow to fix:');
            console.log('1. Go to: https://myaccount.google.com/security');
            console.log('2. Enable 2-Step Verification');
            console.log('3. Then generate App Password');
        } else {
            console.log('Check your internet connection and try again');
        }
        
        process.exit(1);
    } else {
        console.log('✅ CONNECTION SUCCESSFUL!\n');
        console.log('========================================');
        console.log('Email service is configured correctly');
        console.log('========================================\n');
        console.log('Sending test email...\n');
        
        // Send test email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'BETCI Email Test - Configuration Successful',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #E67E22;">✅ Email Configuration Successful!</h2>
                    <p>This is a test email from your BETCI application.</p>
                    <p><strong>Email service is working correctly!</strong></p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 14px;">
                        <strong>Configuration Details:</strong><br>
                        Email: ${process.env.EMAIL_USER}<br>
                        Service: Gmail<br>
                        Status: Active
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        You can now use password reset and other email features in your BETCI application.
                    </p>
                </div>
            `
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error('❌ Failed to send test email:', error.message);
                process.exit(1);
            } else {
                console.log('✅ TEST EMAIL SENT SUCCESSFULLY!\n');
                console.log('Email sent to:', process.env.EMAIL_USER);
                console.log('Message ID:', info.messageId);
                console.log('\nCheck your inbox at baki40843@gmail.com');
                console.log('\n========================================');
                console.log('Setup Complete! Email service is ready.');
                console.log('========================================\n');
                process.exit(0);
            }
        });
    }
});
