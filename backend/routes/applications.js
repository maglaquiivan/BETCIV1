const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({ applicationId: req.params.id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create application
router.post('/', async (req, res) => {
  const application = new Application(req.body);
  try {
    const newApplication = await application.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update application
router.put('/:id', async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { applicationId: req.params.id },
      req.body,
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ applicationId: req.params.id });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
