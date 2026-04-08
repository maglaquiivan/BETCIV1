const express = require('express');
const router = express.Router();
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
    
    if (!user || user.password !== password) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    if (user.accountId) {
      user.lastLogin = new Date();
      await user.save();
    }
    
    console.log('Login successful for:', email, '- Type:', userType);
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
      userType: userType // Added to help frontend know which collection to use
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
