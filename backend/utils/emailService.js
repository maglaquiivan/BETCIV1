const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Email Service for sending password reset emails
 * Uses Gmail SMTP with Nodemailer
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Use App Password, not regular password
    },
    // Additional security options
    secure: true,
    tls: {
      rejectUnauthorized: true
    }
  });
};

/**
 * Send password reset email with styled HTML template
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} firstName - User's first name for personalization
 * @returns {Promise} - Resolves when email is sent
 */
const sendPasswordResetEmail = async (email, resetToken, firstName = 'User') => {
  try {
    const transporter = createTransporter();
    
    // Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Email HTML template with button and styling
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
                    
                    <p style="margin: 30px 0 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Or copy and paste this link into your browser:
                    </p>
                    
                    <p style="margin: 0 0 30px 0; padding: 15px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all;">
                      <a href="${resetUrl}" style="color: #E67E22; text-decoration: none; font-size: 13px;">${resetUrl}</a>
                    </p>
                    
                    <!-- Warning Box -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
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
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✓ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('✗ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Verify email configuration on startup
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✓ Email service configured successfully');
    return true;
  } catch (error) {
    console.error('✗ Email service configuration error:', error.message);
    console.error('  Please check EMAIL_USER and EMAIL_PASSWORD in .env file');
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  verifyEmailConfig
};
