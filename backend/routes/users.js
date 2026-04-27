const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Account = require('../models/Account');
const AdminAccount = require('../models/AdminAccount');
const TraineeAccount = require('../models/TraineeAccount');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check session status - MUST be before /:id route
router.get('/check-session', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    res.json({
      isAuthenticated: true,
      userId: req.session.userId,
      username: req.session.username,
      email: req.session.email,
      role: req.session.role,
      userType: req.session.userType
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  const username = req.session.username;
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    console.log('User logged out:', username);
    res.json({ message: 'Logged out successfully' });
  });
});

// Login - accepts email or username (userId)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { emailOrUsername: email, password: '***' });
    
    let user = null;
    let userType = null;
    
    // Try to find user in AdminAccount collection first
    user = await AdminAccount.findOne({
      $or: [
        { email: email },
        { username: email },
        { accountId: email }
      ]
    });
    
    if (user) {
      userType = 'admin';
      console.log('User found in AdminAccount collection');
    }
    
    // If not found in admin accounts, try TraineeAccount collection
    if (!user) {
      user = await TraineeAccount.findOne({
        $or: [
          { email: email },
          { username: email },
          { accountId: email }
        ]
      });
      
      if (user) {
        userType = 'trainee';
        console.log('User found in TraineeAccount collection');
      }
    }
    
    // If not found in new collections, try old Account collection (for backward compatibility)
    if (!user) {
      user = await Account.findOne({
        $or: [
          { email: email },
          { username: email },
          { accountId: email }
        ]
      });
      
      if (user) {
        userType = 'legacy';
        console.log('User found in legacy Account collection');
      }
    }
    
    // If still not found, try users collection
    if (!user) {
      user = await User.findOne({
        $or: [
          { email: email },
          { userId: email }
        ]
      });
      
      if (user) {
        userType = 'user';
        console.log('User found in User collection');
      }
    }
    
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User details:');
    console.log('  Email:', user.email);
    console.log('  Username:', user.username);
    console.log('  Password field exists:', !!user.password);
    console.log('  Password length:', user.password ? user.password.length : 0);
    console.log('  Password starts with $2b$:', user.password ? user.password.startsWith('$2b$') : false);
    
    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    console.log('Password comparison:');
    console.log('  Input password:', password);
    console.log('  Stored hash:', user.password.substring(0, 30) + '...');
    console.log('  Match result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    if (user.accountId) {
      user.lastLogin = new Date();
      await user.save();
    }
    
    // Create session
    req.session.userId = user.userId || user.accountId;
    req.session.accountId = user.accountId;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.role = user.role;
    req.session.userType = userType;
    req.session.isAuthenticated = true;
    
    // Save session and wait for it to complete before responding
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
    
    console.log('Login successful for:', email, '- Type:', userType);
    console.log('Session created:', req.session.userId);
    
    res.json({
      userId: user.userId || user.accountId,
      accountId: user.accountId,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profilePicture: user.profilePicture,
      phone: user.phone,
      address: user.address,
      userType: userType
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json({
      userId: newUser.userId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ userId: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
