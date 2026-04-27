const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

// Get all admissions
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admissions by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const admissions = await Admission.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single admission
router.get('/:id', async (req, res) => {
  try {
    const admission = await Admission.findOne({ admissionId: req.params.id });
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create admission
router.post('/', async (req, res) => {
  const admission = new Admission(req.body);
  try {
    const newAdmission = await admission.save();
    res.status(201).json(newAdmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update admission
router.put('/:id', async (req, res) => {
  try {
    const admission = await Admission.findOneAndUpdate(
      { admissionId: req.params.id },
      req.body,
      { new: true }
    );
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }
    res.json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete admission
router.delete('/:id', async (req, res) => {
  try {
    // Try to find by MongoDB _id first
    let admission = await Admission.findByIdAndDelete(req.params.id);
    
    // If not found by _id, try by admissionId
    if (!admission) {
      admission = await Admission.findOneAndDelete({ admissionId: req.params.id });
    }
    
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' });
    }
    res.json({ message: 'Admission deleted', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
