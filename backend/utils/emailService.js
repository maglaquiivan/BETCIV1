const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Email Service for sending password reset emails
 * Uses Gmail SMTP with Nodemailer
 * 
 * IMPORTANT: You MUST use Gmail App Password, not your regular password
 * Get it from: https://myaccount.google.com/apppasswords
 */

/**
 * Create and verify email transporter
 * @returns {Promise<nodemailer.Transporter>} Configured transporter
 */
const createTransporter = async () => {
  // Check if credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('EMAIL_USER and EMAIL_PASSWORD must be set in .env file');
  }

  if (process.env.EMAIL_PASSWORD === 'PASTE_YOUR_APP_PASSWORD_HERE') {
    throw new Error('Please replace PASTE_YOUR_APP_PASSWORD_HERE with your actual Gmail App Password');
  }

  console.log('📧 Creating email transporter...');
  console.log('   Email User:', process.env.EMAIL_USER);
  console.log('   Password Set:', process.env.EMAIL_PASSWORD ? 'Yes (hidden)' : 'No');

  // Create transporter with Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: true
    },
    debug: true, // Enable debug output
    logger: true // Log to console
  });

  // Verify transporter configuration
  try {
    await transporter.verify();
    console.log('✓ Email transporter verified successfully');
    return transporter;
  } catch (error) {
    console.error('✗ Email transporter verification failed:', error.message);
    throw new Error(`Email configuration error: ${error.message}`);
  }
};

/**
 * Send password reset email with styled HTML template
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} firstName - User's first name for personalization
 * @returns {Promise<Object>} - Result with success status and messageId
 */
const sendPasswordResetEmail = async (email, resetToken, firstName = 'User') => {
  console.log('\n📨 Attempting to send password reset email...');
  console.log('   To:', email);
  console.log('   First Name:', firstName);
  console.log('   Token:', resetToken.substring(0, 10) + '...');

  try {
    // Create and verify transporter
    const transporter = await createTransporter();
    
    // Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5500'}/auth/reset-password.html?token=${resetToken}`;
    console.log('   Reset URL:', resetUrl);
    
    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #E67E22 0%, #F4C430 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Password Reset Request</h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                      Hello <strong>${firstName}</strong>,
                    </p>
                    
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                      We received a request to reset your password for your BETCI account. If you didn't make this request, you can safely ignore this email.
                    </p>
                    
                    <p style="margin: 0 0 30px 0; color: #666666; font-size: 15px; line-height: 1.6;">
                      To reset your password, click the button below:
                    </p>
                    
                    <!-- Reset Button -->
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="border-radius: 6px; background: #E67E22;">
                          <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Warning Box -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 30px 0 20px 0;">
                      <tr>
                        <td style="padding: 15px;">
                          <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                            <strong>⚠️ Important:</strong> This link will expire in <strong>15 minutes</strong> for security reasons.
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px;">
                      © ${new Date().getFullYear()} BETCI. All rights reserved.
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      This is an automated message, please do not reply to this email.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    // Plain text fallback
    const textContent = `
Password Reset Request

Hello ${firstName},

We received a request to reset your password for your BETCI account.

To reset your password, please visit the following link:
${resetUrl}

This link will expire in 15 minutes for security reasons.

If you didn't request a password reset, please ignore this email.

© ${new Date().getFullYear()} BETCI. All rights reserved.
    `;
    
    // Email options
    const mailOptions = {
      from: `"BETCI Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - BETCI',
      text: textContent,
      html: htmlContent
    };
    
    console.log('   Sending email...');
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✓ Password reset email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    
    return { 
      success: true, 
      messageId: info.messageId,
      response: info.response 
    };
    
  } catch (error) {
    console.error('\n✗ Failed to send password reset email');
    console.error('   Error Type:', error.name);
    console.error('   Error Message:', error.message);
    console.error('   Error Code:', error.code);
    console.error('   Full Error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('Invalid login')) {
      throw new Error('Invalid Gmail credentials. Please check EMAIL_USER and EMAIL_PASSWORD in .env file. Make sure you are using an App Password, not your regular Gmail password.');
    } else if (error.message.includes('EAUTH')) {
      throw new Error('Authentication failed. Please generate a new Gmail App Password from https://myaccount.google.com/apppasswords');
    } else if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
      throw new Error('Connection to Gmail SMTP server failed. Please check your internet connection and firewall settings.');
    } else if (error.message.includes('EMAIL_USER') || error.message.includes('EMAIL_PASSWORD')) {
      throw new Error(error.message);
    } else {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
};

/**
 * Test email configuration
 * Call this function to verify your email setup is working
 */
const testEmailConfig = async () => {
  console.log('\n========================================');
  console.log('Testing Email Configuration');
  console.log('========================================\n');

  try {
    // Check environment variables
    console.log('1. Checking environment variables...');
    if (!process.env.EMAIL_USER) {
      throw new Error('EMAIL_USER is not set in .env file');
    }
    if (!process.env.EMAIL_PASSWORD) {
      throw new Error('EMAIL_PASSWORD is not set in .env file');
    }
    if (process.env.EMAIL_PASSWORD === 'PASTE_YOUR_APP_PASSWORD_HERE') {
      throw new Error('EMAIL_PASSWORD is still set to placeholder value');
    }
    console.log('   ✓ Environment variables are set');

    // Create and verify transporter
    console.log('\n2. Creating and verifying transporter...');
    const transporter = await createTransporter();
    console.log('   ✓ Transporter created and verified');

    // Send test email
    console.log('\n3. Sending test email...');
    const testResult = await sendPasswordResetEmail(
      process.env.EMAIL_USER, // Send to yourself
      'TEST_TOKEN_' + Date.now(),
      'Test User'
    );
    console.log('   ✓ Test email sent successfully');

    console.log('\n========================================');
    console.log('✓ Email Configuration Test PASSED');
    console.log('========================================\n');
    console.log('Check your inbox at:', process.env.EMAIL_USER);
    console.log('Message ID:', testResult.messageId);

    return true;
  } catch (error) {
    console.error('\n========================================');
    console.error('✗ Email Configuration Test FAILED');
    console.error('========================================\n');
    console.error('Error:', error.message);
    console.error('\nPlease fix the issue and try again.');
    return false;
  }
};

/**
 * Verify email configuration on startup (silent check)
 */
const verifyEmailConfig = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || 
        process.env.EMAIL_PASSWORD === 'PASTE_YOUR_APP_PASSWORD_HERE') {
      console.warn('⚠️  Email service not configured. Password reset will not work.');
      console.warn('   Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
      return false;
    }

    const transporter = await createTransporter();
    console.log('✓ Email service configured and ready');
    return true;
  } catch (error) {
    console.error('✗ Email service configuration error:', error.message);
    console.error('  Password reset emails will not be sent until this is fixed.');
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  verifyEmailConfig,
  testEmailConfig
};
