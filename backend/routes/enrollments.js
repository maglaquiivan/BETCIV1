const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Enrollment Schema
const enrollmentSchema = new mongoose.Schema({
    enrollmentId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    enrollmentDate: { type: Date, default: Date.now },
    completionDate: { type: Date },
    lastAccessedDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// GET all enrollments for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.params.userId });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single enrollment
router.get('/:enrollmentId', async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ enrollmentId: req.params.enrollmentId });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new enrollment
router.post('/', async (req, res) => {
    try {
        const { userId, courseId, courseName } = req.body;
        
        // Check if already enrolled
        const existing = await Enrollment.findOne({ userId, courseId });
        if (existing) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }
        
        // Generate enrollment ID
        const enrollmentId = 'ENR' + Date.now();
        
        const enrollment = new Enrollment({
            enrollmentId,
            userId,
            courseId,
            courseName,
            status: 'active',
            progress: 0
        });
        
        const newEnrollment = await enrollment.save();
        res.status(201).json(newEnrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update enrollment progress
router.put('/:enrollmentId/progress', async (req, res) => {
    try {
        const { progress } = req.body;
        
        const enrollment = await Enrollment.findOne({ enrollmentId: req.params.enrollmentId });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        
        enrollment.progress = progress;
        enrollment.lastAccessedDate = new Date();
        
        // Auto-complete if progress reaches 100%
        if (progress >= 100 && enrollment.status !== 'completed') {
            enrollment.status = 'completed';
            enrollment.completionDate = new Date();
        }
        
        const updatedEnrollment = await enrollment.save();
        res.json(updatedEnrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update enrollment status
router.put('/:enrollmentId/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        const enrollment = await Enrollment.findOne({ enrollmentId: req.params.enrollmentId });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        
        enrollment.status = status;
        if (status === 'completed' && !enrollment.completionDate) {
            enrollment.completionDate = new Date();
        }
        
        const updatedEnrollment = await enrollment.save();
        res.json(updatedEnrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE enrollment
router.delete('/:enrollmentId', async (req, res) => {
    try {
        const enrollment = await Enrollment.findOneAndDelete({ enrollmentId: req.params.enrollmentId });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
