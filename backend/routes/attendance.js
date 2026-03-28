const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get attendance by user
router.get('/user/:userId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance by course
router.get('/course/:courseId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ courseId: req.params.courseId }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create attendance record
router.post('/', async (req, res) => {
  const attendance = new Attendance(req.body);
  try {
    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update attendance
router.put('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
