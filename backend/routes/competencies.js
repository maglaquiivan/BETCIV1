const express = require('express');
const router = express.Router();
const Competency = require('../models/Competency');

// Get all competencies
router.get('/', async (req, res) => {
  try {
    const competencies = await Competency.find().sort({ createdAt: -1 });
    res.json(competencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get competencies by course
router.get('/course/:courseId', async (req, res) => {
  try {
    const competencies = await Competency.find({ courseId: req.params.courseId });
    res.json(competencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single competency
router.get('/:id', async (req, res) => {
  try {
    let competency;
    // Try to find by _id first (MongoDB ID), then by competencyId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid MongoDB ObjectId
      competency = await Competency.findById(req.params.id);
    }
    if (!competency) {
      competency = await Competency.findOne({ competencyId: req.params.id });
    }
    if (!competency) {
      return res.status(404).json({ message: 'Competency not found' });
    }
    res.json(competency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create competency
router.post('/', async (req, res) => {
  const competency = new Competency(req.body);
  try {
    const newCompetency = await competency.save();
    res.status(201).json(newCompetency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update competency
router.put('/:id', async (req, res) => {
  try {
    let competency;
    // Try to find by _id first (MongoDB ID), then by competencyId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid MongoDB ObjectId
      competency = await Competency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    }
    if (!competency) {
      competency = await Competency.findOneAndUpdate(
        { competencyId: req.params.id },
        req.body,
        { new: true }
      );
    }
    if (!competency) {
      return res.status(404).json({ message: 'Competency not found' });
    }
    res.json(competency);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete competency
router.delete('/:id', async (req, res) => {
  try {
    let competency;
    // Try to find by _id first (MongoDB ID), then by competencyId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid MongoDB ObjectId
      competency = await Competency.findByIdAndDelete(req.params.id);
    }
    if (!competency) {
      competency = await Competency.findOneAndDelete({ competencyId: req.params.id });
    }
    if (!competency) {
      return res.status(404).json({ message: 'Competency not found' });
    }
    res.json({ message: 'Competency deleted', success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
