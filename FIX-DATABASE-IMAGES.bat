@echo off
title Fix Database Base64 Images
color 0E

echo.
echo ========================================
echo   Fix Database Base64 Images
echo ========================================
echo.
echo This script will fix Base64 images in
echo your database that are missing the
echo required "data:" prefix.
echo.
echo This prevents 431 and 404 errors.
echo.
echo ========================================
echo.

set /p confirm="Do you want to continue? (Y/N): "

if /i "%confirm%" NEQ "Y" (
    echo.
    echo Operation cancelled.
    pause
    exit
)

echo.
echo Running database migration...
echo.

cd backend
node scripts/fixBase64Images.js

echo.
echo ========================================
echo.
pause
