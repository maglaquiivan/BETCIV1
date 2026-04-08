const express = require('express');
const router = express.Router();
const AdminAccount = require('../models/AdminAccount');

// Get all admin accounts
router.get('/', async (req, res) => {
  try {
    const adminAccounts = await AdminAccount.find().sort({ createdAt: -1 });
    res.json(adminAccounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin account by ID
router.get('/:id', async (req, res) => {
  try {
    const adminAccount = await AdminAccount.findOne({ accountId: req.params.id });
    if (!adminAccount) {
      return res.status(404).json({ message: 'Admin account not found' });
    }
    res.json(adminAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new admin account
router.post('/', async (req, res) => {
  try {
    const adminAccount = new AdminAccount(req.body);
    const newAdminAccount = await adminAccount.save();
    res.status(201).json(newAdminAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update admin account
router.put('/:id', async (req, res) => {
  try {
    const adminAccount = await AdminAccount.findOne({ accountId: req.params.id });
    if (!adminAccount) {
      return res.status(404).json({ message: 'Admin account not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        adminAccount[key] = req.body[key];
      }
    });

    const updatedAdminAccount = await adminAccount.save();
    res.json(updatedAdminAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete admin account
router.delete('/:id', async (req, res) => {
  try {
    const adminAccount = await AdminAccount.findOne({ accountId: req.params.id });
    if (!adminAccount) {
      return res.status(404).json({ message: 'Admin account not found' });
    }
    await adminAccount.deleteOne();
    res.json({ message: 'Admin account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
