const express = require('express');
const router = express.Router();
const Trainee = require('../models/Trainee');

// Get all trainees
router.get('/', async (req, res) => {
  try {
    const trainees = await Trainee.find().sort({ createdAt: -1 });
    res.json(trainees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single trainee
router.get('/:id', async (req, res) => {
  try {
    const trainee = await Trainee.findOne({ traineeId: req.params.id });
    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }
    res.json(trainee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create trainee
router.post('/', async (req, res) => {
  const trainee = new Trainee(req.body);
  try {
    const newTrainee = await trainee.save();
    res.status(201).json(newTrainee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update trainee
router.put('/:id', async (req, res) => {
  try {
    const trainee = await Trainee.findOneAndUpdate(
      { traineeId: req.params.id },
      req.body,
      { new: true }
    );
    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }
    res.json(trainee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete trainee
router.delete('/:id', async (req, res) => {
  try {
    const trainee = await Trainee.findOneAndDelete({ traineeId: req.params.id });
    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }
    res.json({ message: 'Trainee deleted', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
