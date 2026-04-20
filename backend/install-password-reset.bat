@echo off
REM Password Reset System Installation Script for Windows
REM Run this script to install dependencies and set up the password reset system

echo ============================================================
echo   BETCI Password Reset System - Installation
echo ============================================================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the backend directory.
    echo.
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
echo.
call npm install bcrypt nodemailer

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/4] Checking .env file...
echo.

if not exist ".env" (
    echo WARNING: .env file not found!
    echo Creating .env file with template...
    echo.
    (
        echo PORT=5500
        echo MONGODB_URI=mongodb://localhost:27017/BETCI
        echo NODE_ENV=development
        echo.
        echo # Email Configuration for Password Reset
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASSWORD=your-app-password-here
        echo FRONTEND_URL=http://localhost:3000
    ) > .env
    echo .env file created!
    echo.
    echo IMPORTANT: You need to edit .env and add your Gmail credentials!
) else (
    echo .env file exists - checking configuration...
    findstr /C:"EMAIL_USER" .env >nul
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Adding email configuration to .env...
        (
            echo.
            echo # Email Configuration for Password Reset
            echo EMAIL_USER=your-email@gmail.com
            echo EMAIL_PASSWORD=your-app-password-here
            echo FRONTEND_URL=http://localhost:3000
        ) >> .env
        echo Email configuration added!
    ) else (
        echo Email configuration found in .env
    )
)

echo.
echo [3/4] Verifying installation...
echo.

REM Check if bcrypt is installed
call npm list bcrypt >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] bcrypt installed
) else (
    echo [FAIL] bcrypt not installed
)

REM Check if nodemailer is installed
call npm list nodemailer >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] nodemailer installed
) else (
    echo [FAIL] nodemailer not installed
)

REM Check if required files exist
if exist "models\PasswordReset.js" (
    echo [OK] PasswordReset model found
) else (
    echo [FAIL] PasswordReset model not found
)

if exist "routes\passwordReset.js" (
    echo [OK] passwordReset routes found
) else (
    echo [FAIL] passwordReset routes not found
)

if exist "utils\emailService.js" (
    echo [OK] emailService utility found
) else (
    echo [FAIL] emailService utility not found
)

echo.
echo [4/4] Installation complete!
echo.
echo ============================================================
echo   Next Steps:
echo ============================================================
echo.
echo 1. Get Gmail App Password:
echo    - Visit: https://myaccount.google.com/apppasswords
echo    - Enable 2-Step Verification
echo    - Generate App Password for "Mail"
echo.
echo 2. Edit .env file and add your credentials:
echo    EMAIL_USER=your-email@gmail.com
echo    EMAIL_PASSWORD=your-16-char-app-password
echo.
echo 3. Start the server:
echo    npm start
echo.
echo 4. Test the system:
echo    node test-password-reset.js
echo.
echo 5. Read the documentation:
echo    - PASSWORD_RESET_SYSTEM.md
echo    - SETUP_PASSWORD_RESET.md
echo.
echo ============================================================
echo.

pause
