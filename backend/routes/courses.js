const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    
    // Try to get enrollment counts if Enrollment model exists
    let coursesWithEnrollments = courses;
    try {
      // Check if Enrollment model is registered
      const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment');
      
      coursesWithEnrollments = await Promise.all(
        courses.map(async (course) => {
          const enrollmentCount = await Enrollment.countDocuments({ courseId: course.courseId });
          return {
            ...course.toObject(),
            enrolledCount: enrollmentCount
          };
        })
      );
    } catch (enrollmentError) {
      // If Enrollment model doesn't exist, just return courses with 0 count
      console.log('Enrollment model not available, returning courses with 0 count');
      coursesWithEnrollments = courses.map(course => ({
        ...course.toObject(),
        enrolledCount: 0
      }));
    }
    
    res.json(coursesWithEnrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    let course;
    
    // Try to find by courseId first
    course = await Course.findOne({ courseId: req.params.id });
    
    // If not found and ID looks like a MongoDB ObjectId, try that
    if (!course && mongoose.Types.ObjectId.isValid(req.params.id)) {
      try {
        course = await Course.findById(req.params.id);
      } catch (err) {
        console.log('Error finding by ObjectId:', err.message);
      }
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create course
router.post('/', async (req, res) => {
  const course = new Course(req.body);
  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    let course;
    
    // Try to find and update by courseId first
    course = await Course.findOneAndUpdate(
      { courseId: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    // If not found and ID looks like a MongoDB ObjectId, try that
    if (!course && mongoose.Types.ObjectId.isValid(req.params.id)) {
      try {
        course = await Course.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
        );
      } catch (err) {
        console.log('Error updating by ObjectId:', err.message);
      }
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Course update error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    let course;
    
    // Try to find and delete by courseId first
    course = await Course.findOneAndDelete({ courseId: req.params.id });
    
    // If not found and ID looks like a MongoDB ObjectId, try that
    if (!course && mongoose.Types.ObjectId.isValid(req.params.id)) {
      try {
        course = await Course.findByIdAndDelete(req.params.id);
      } catch (err) {
        console.log('Error deleting by ObjectId:', err.message);
      }
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted', success: true });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
