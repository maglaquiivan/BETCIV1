const express = require('express');
const router = express.Router();
const TraineeAccount = require('../models/TraineeAccount');

// Get all trainee accounts
router.get('/', async (req, res) => {
  try {
    const traineeAccounts = await TraineeAccount.find().sort({ createdAt: -1 });
    res.json(traineeAccounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trainee account by ID
router.get('/:id', async (req, res) => {
  try {
    const traineeAccount = await TraineeAccount.findOne({ accountId: req.params.id });
    if (!traineeAccount) {
      return res.status(404).json({ message: 'Trainee account not found' });
    }
    res.json(traineeAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new trainee account
router.post('/', async (req, res) => {
  try {
    const traineeAccount = new TraineeAccount(req.body);
    const newTraineeAccount = await traineeAccount.save();
    res.status(201).json(newTraineeAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update trainee account
router.put('/:id', async (req, res) => {
  try {
    const traineeAccount = await TraineeAccount.findOne({ accountId: req.params.id });
    if (!traineeAccount) {
      return res.status(404).json({ message: 'Trainee account not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        traineeAccount[key] = req.body[key];
      }
    });

    const updatedTraineeAccount = await traineeAccount.save();
    res.json(updatedTraineeAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete trainee account
router.delete('/:id', async (req, res) => {
  try {
    const traineeAccount = await TraineeAccount.findOne({ accountId: req.params.id });
    if (!traineeAccount) {
      return res.status(404).json({ message: 'Trainee account not found' });
    }
    await traineeAccount.deleteOne();
    res.json({ message: 'Trainee account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
