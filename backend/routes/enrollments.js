const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Trainee = require('../models/Trainee');
const User = require('../models/User');

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
    lastAccessedDate: { type: Date, default: Date.now },
    // Enrollee data from enrollment form
    enrolleeData: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        dateOfBirth: Date,
        gender: String,
        education: String,
        emergencyContact: {
            name: String,
            phone: String
        }
    }
}, { timestamps: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// GET all enrollments (for admin dashboard)
router.get('/', async (req, res) => {
    try {
        const enrollments = await Enrollment.find().sort({ enrollmentDate: -1 });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
        const { userId, courseId, courseName, enrolleeData } = req.body;
        
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
            progress: 0,
            enrolleeData: enrolleeData || {} // Save the complete form data
        });
        
        const newEnrollment = await enrollment.save();
        
        // Get user information
        const user = await User.findOne({ userId: userId });
        
        if (user) {
            // Check if trainee already exists
            let trainee = await Trainee.findOne({ email: user.email });
            
            if (trainee) {
                // Update existing trainee - add course to enrolledCourses if not already there
                const courseExists = trainee.enrolledCourses.some(c => c.courseId === courseId);
                
                if (!courseExists) {
                    trainee.enrolledCourses.push({
                        courseId: courseId,
                        courseName: courseName,
                        enrollmentDate: new Date(),
                        status: 'active',
                        progress: 0
                    });
                    await trainee.save();
                }
            } else {
                // Create new trainee record
                const traineeId = 'TRN' + Date.now();
                
                trainee = new Trainee({
                    traineeId: traineeId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone || '',
                    address: user.address || '',
                    status: 'active',
                    enrolledCourses: [{
                        courseId: courseId,
                        courseName: courseName,
                        enrollmentDate: new Date(),
                        status: 'active',
                        progress: 0
                    }]
                });
                
                await trainee.save();
            }
        }
        
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
        
        // Update trainee record as well
        const user = await User.findOne({ userId: enrollment.userId });
        if (user) {
            const trainee = await Trainee.findOne({ email: user.email });
            if (trainee) {
                const courseIndex = trainee.enrolledCourses.findIndex(c => c.courseId === enrollment.courseId);
                if (courseIndex !== -1) {
                    trainee.enrolledCourses[courseIndex].progress = progress;
                    trainee.enrolledCourses[courseIndex].status = enrollment.status;
                    await trainee.save();
                }
            }
        }
        
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
        
        // Update trainee record as well
        const user = await User.findOne({ userId: enrollment.userId });
        if (user) {
            const trainee = await Trainee.findOne({ email: user.email });
            if (trainee) {
                const courseIndex = trainee.enrolledCourses.findIndex(c => c.courseId === enrollment.courseId);
                if (courseIndex !== -1) {
                    trainee.enrolledCourses[courseIndex].status = status;
                    await trainee.save();
                }
            }
        }
        
        res.json(updatedEnrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update enrollment by MongoDB _id (for approve/decline from frontend)
router.put('/:id', async (req, res) => {
    try {
        const { status, progress } = req.body;
        
        // Try to find by MongoDB _id first
        let enrollment = await Enrollment.findById(req.params.id);
        
        // If not found by _id, try by enrollmentId
        if (!enrollment) {
            enrollment = await Enrollment.findOne({ enrollmentId: req.params.id });
        }
        
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        
        // Update status if provided
        if (status) {
            enrollment.status = status;
            if (status === 'Approved') {
                enrollment.status = 'active';
            } else if (status === 'Declined') {
                enrollment.status = 'dropped';
            }
            
            if (enrollment.status === 'completed' && !enrollment.completionDate) {
                enrollment.completionDate = new Date();
            }
        }
        
        // Update progress if provided
        if (progress !== undefined) {
            enrollment.progress = progress;
            enrollment.lastAccessedDate = new Date();
            
            // Auto-complete if progress reaches 100%
            if (progress >= 100 && enrollment.status !== 'completed') {
                enrollment.status = 'completed';
                enrollment.completionDate = new Date();
            }
        }
        
        const updatedEnrollment = await enrollment.save();
        
        // Update trainee record as well
        const user = await User.findOne({ userId: enrollment.userId });
        if (user) {
            const trainee = await Trainee.findOne({ email: user.email });
            if (trainee) {
                const courseIndex = trainee.enrolledCourses.findIndex(c => c.courseId === enrollment.courseId);
                if (courseIndex !== -1) {
                    if (status) trainee.enrolledCourses[courseIndex].status = enrollment.status;
                    if (progress !== undefined) trainee.enrolledCourses[courseIndex].progress = progress;
                    await trainee.save();
                }
            }
        }
        
        res.json(updatedEnrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE enrollment by MongoDB _id
router.delete('/:id', async (req, res) => {
    try {
        // Try to find by MongoDB _id first
        let enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        
        // If not found by _id, try by enrollmentId
        if (!enrollment) {
            enrollment = await Enrollment.findOneAndDelete({ enrollmentId: req.params.id });
        }
        
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        
        // Also remove from trainee record
        const user = await User.findOne({ userId: enrollment.userId });
        if (user) {
            const trainee = await Trainee.findOne({ email: user.email });
            if (trainee) {
                trainee.enrolledCourses = trainee.enrolledCourses.filter(c => c.courseId !== enrollment.courseId);
                await trainee.save();
            }
        }
        
        res.json({ message: 'Enrollment deleted successfully', enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
