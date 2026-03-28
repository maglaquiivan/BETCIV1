const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Get all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find().select('-password').sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single account
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findOne({ accountId: req.params.id }).select('-password');
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create account
router.post('/', async (req, res) => {
  const account = new Account(req.body);
  try {
    const newAccount = await account.save();
    const accountData = newAccount.toObject();
    delete accountData.password;
    res.status(201).json(accountData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update account
router.put('/:id', async (req, res) => {
  try {
    const account = await Account.findOneAndUpdate(
      { accountId: req.params.id },
      req.body,
      { new: true }
    ).select('-password');
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete account
router.delete('/:id', async (req, res) => {
  try {
    const account = await Account.findOneAndDelete({ accountId: req.params.id });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json({ message: 'Account deleted', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
