@echo off
echo ========================================
echo BETCI - Database Seeding Script
echo ========================================
echo.

echo Changing to backend directory...
cd /d "%~dp0backend"
echo Current directory: %CD%
echo.

echo Step 1: Installing dependencies...
call npm install
echo.

echo Step 2: Seeding database with users and courses...
call node scripts\seedData.js
echo.

echo ========================================
echo Database seeding complete!
echo ========================================
echo.
echo Default users created:
echo - Admin: admin@betci.com / admin123
echo - Trainee: trainee@betci.com / trainee123
echo.
echo You can now check MongoDB Compass for:
echo - Database: betci
echo - Collections: users, courses
echo.
pause
