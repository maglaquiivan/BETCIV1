const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const AdminAccount = require('../models/AdminAccount');
const TraineeAccount = require('../models/TraineeAccount');

// Hash password using SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Change password endpoint
router.post('/change-password', async (req, res) => {
    try {
        const { accountId, currentPassword, newPassword, userType } = req.body;

        // Validate input
        if (!accountId || !currentPassword || !newPassword || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Validate new password strength
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters long' 
            });
        }

        // Determine which collection to use
        const AccountModel = userType === 'admin' ? AdminAccount : TraineeAccount;

        // Find user account
        const account = await AccountModel.findOne({ accountId: accountId });

        if (!account) {
            return res.status(404).json({ 
                success: false, 
                message: 'Account not found' 
            });
        }

        // Verify current password
        // Check both plain text (for old accounts) and hashed passwords
        const currentPasswordHash = hashPassword(currentPassword);
        const isPasswordValid = account.password === currentPassword || 
                               account.password === currentPasswordHash;

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Hash new password
        const newPasswordHash = hashPassword(newPassword);

        // Update password
        account.password = newPasswordHash;
        account.passwordChangedAt = new Date();
        await account.save();

        res.json({ 
            success: true, 
            message: 'Password changed successfully' 
        });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while changing password' 
        });
    }
});

module.exports = router;
