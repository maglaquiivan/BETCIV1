/**
 * Database Migration Script: Fix Base64 Images
 * 
 * This script fixes Base64 image strings in the database that are missing
 * the required "data:" prefix. This prevents 431 and 404 errors.
 * 
 * Run with: node backend/scripts/fixBase64Images.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BETCI';

// Import models
const Course = require('../models/Course');
const TraineeAccount = require('../models/TraineeAccount');
const AdminAccount = require('../models/AdminAccount');

/**
 * Check if a string is a Base64 image without the data: prefix
 */
function isBase64WithoutPrefix(str) {
    if (!str || typeof str !== 'string') return false;
    
    // Check if it's already a proper data URL
    if (str.startsWith('data:')) return false;
    
    // Check if it's a regular file path
    if (str.startsWith('/') || str.startsWith('http') || str.startsWith('../')) return false;
    
    // Check if it looks like a Base64 string
    return str.includes('base64,') || str.startsWith('image/');
}

/**
 * Fix a Base64 string by adding the data: prefix
 */
function fixBase64String(str) {
    if (isBase64WithoutPrefix(str)) {
        console.log(`  ⚠️  Found Base64 without prefix (${str.substring(0, 50)}...)`);
        return 'data:' + str;
    }
    return str;
}

/**
 * Fix courses with Base64 images
 */
async function fixCourses() {
    console.log('\n📚 Checking Courses...');
    
    const courses = await Course.find({});
    let fixedCount = 0;
    
    for (const course of courses) {
        if (course.image && isBase64WithoutPrefix(course.image)) {
            const originalLength = course.image.length;
            course.image = fixBase64String(course.image);
            
            await course.save();
            fixedCount++;
            
            console.log(`  ✅ Fixed: ${course.title || course.courseName}`);
            console.log(`     Size: ${(originalLength / 1024).toFixed(1)}KB`);
        }
    }
    
    if (fixedCount === 0) {
        console.log('  ✓ All courses have correct image format');
    } else {
        console.log(`  ✅ Fixed ${fixedCount} course(s)`);
    }
    
    return fixedCount;
}

/**
 * Fix trainee accounts with Base64 profile pictures
 */
async function fixTraineeAccounts() {
    console.log('\n👤 Checking Trainee Accounts...');
    
    const accounts = await TraineeAccount.find({});
    let fixedCount = 0;
    
    for (const account of accounts) {
        if (account.profilePicture && isBase64WithoutPrefix(account.profilePicture)) {
            const originalLength = account.profilePicture.length;
            account.profilePicture = fixBase64String(account.profilePicture);
            
            await account.save();
            fixedCount++;
            
            console.log(`  ✅ Fixed: ${account.email}`);
            console.log(`     Size: ${(originalLength / 1024).toFixed(1)}KB`);
        }
    }
    
    if (fixedCount === 0) {
        console.log('  ✓ All trainee accounts have correct image format');
    } else {
        console.log(`  ✅ Fixed ${fixedCount} trainee account(s)`);
    }
    
    return fixedCount;
}

/**
 * Fix admin accounts with Base64 profile pictures
 */
async function fixAdminAccounts() {
    console.log('\n👨‍💼 Checking Admin Accounts...');
    
    const accounts = await AdminAccount.find({});
    let fixedCount = 0;
    
    for (const account of accounts) {
        if (account.profilePicture && isBase64WithoutPrefix(account.profilePicture)) {
            const originalLength = account.profilePicture.length;
            account.profilePicture = fixBase64String(account.profilePicture);
            
            await account.save();
            fixedCount++;
            
            console.log(`  ✅ Fixed: ${account.email}`);
            console.log(`     Size: ${(originalLength / 1024).toFixed(1)}KB`);
        }
    }
    
    if (fixedCount === 0) {
        console.log('  ✓ All admin accounts have correct image format');
    } else {
        console.log(`  ✅ Fixed ${fixedCount} admin account(s)`);
    }
    
    return fixedCount;
}

/**
 * Main migration function
 */
async function runMigration() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   Base64 Image Fix - Database Migration Script        ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n🔌 Connecting to: ${MONGODB_URI}`);
    
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB\n');
        console.log('🔍 Scanning database for Base64 images without data: prefix...');
        
        // Fix all collections
        const coursesFixed = await fixCourses();
        const traineesFixed = await fixTraineeAccounts();
        const adminsFixed = await fixAdminAccounts();
        
        const totalFixed = coursesFixed + traineesFixed + adminsFixed;
        
        // Summary
        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║                    MIGRATION COMPLETE                  ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log(`\n📊 Summary:`);
        console.log(`   • Courses fixed: ${coursesFixed}`);
        console.log(`   • Trainee accounts fixed: ${traineesFixed}`);
        console.log(`   • Admin accounts fixed: ${adminsFixed}`);
        console.log(`   • Total records fixed: ${totalFixed}`);
        
        if (totalFixed > 0) {
            console.log('\n✅ Database migration successful!');
            console.log('   All Base64 images now have the correct data: prefix.');
        } else {
            console.log('\n✅ No issues found! Database is already in good shape.');
        }
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the migration
runMigration();
