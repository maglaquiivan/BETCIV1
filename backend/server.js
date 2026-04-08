const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5500;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✓ MongoDB connected successfully');
  console.log(`✓ Database: ${MONGODB_URI}`);
})
.catch(err => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});

// Import routes
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');
const recordRoutes = require('./routes/records');
const traineeRoutes = require('./routes/trainees');
const appointmentRoutes = require('./routes/appointments');
const competencyRoutes = require('./routes/competencies');
const accountRoutes = require('./routes/accounts');
const adminAccountRoutes = require('./routes/adminAccounts');
const traineeAccountRoutes = require('./routes/traineeAccounts');
const enrollmentRoutes = require('./routes/enrollments');
const applicationRoutes = require('./routes/applications');
const admissionRoutes = require('./routes/admissions');

// ============================================
// API ROUTES - MUST BE FIRST!
// ============================================
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/trainees', traineeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/competencies', competencyRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/admin-accounts', adminAccountRoutes);
app.use('/api/trainee-accounts', traineeAccountRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admissions', admissionRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is working!', 
    timestamp: new Date(),
    version: '2.0' // Added version to verify server restart
  });
});

// ============================================
// STATIC FILES - AFTER API ROUTES
// ============================================
const frontendPath = path.join(__dirname, '../frontend');
console.log('Serving static files from:', frontendPath);
console.log('Image directory should be at:', path.join(frontendPath, 'assets/img'));

// Check if the directory exists
const fs = require('fs');
if (fs.existsSync(path.join(frontendPath, 'assets/img/fork.png'))) {
  console.log('✓ fork.png exists at expected location');
} else {
  console.log('✗ fork.png NOT FOUND at expected location');
}

// Add CSP headers middleware - permissive for development
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: chrome-extension:; " +
    "style-src 'self' 'unsafe-inline' https:; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' https: data:; " +
    "connect-src 'self' ws: wss: http: https:; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "frame-src 'self';"
  );
  next();
});

// Log all requests for debugging
app.use((req, res, next) => {
  if (req.path.includes('/assets/')) {
    console.log(`Asset request: ${req.method} ${req.path}`);
  }
  next();
});

app.use(express.static(frontendPath));

// Root route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// No fallback route - let express.static handle everything
// If a file doesn't exist, it will naturally return 404

// Start server - Listen on 0.0.0.0 to accept connections from both localhost and 127.0.0.1
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Also accessible at http://127.0.0.1:${PORT}`);
  console.log(`✓ MongoDB URI: ${MONGODB_URI}`);
  console.log(`✓ API Endpoints:`);
  console.log(`  - http://localhost:${PORT}/api/accounts`);
  console.log(`  - http://localhost:${PORT}/api/trainees`);
  console.log(`  - http://localhost:${PORT}/api/courses`);
  console.log(`  - http://localhost:${PORT}/api/test`);
  console.log('='.repeat(60));
});
