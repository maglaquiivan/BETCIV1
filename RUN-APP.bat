@echo off
echo ========================================
echo BETCI Application - Easy Startup
echo ========================================
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB is not installed or not in PATH!
    echo.
    echo You have 2 options:
    echo 1. Install MongoDB from: https://www.mongodb.com/try/download/community
    echo 2. Use MongoDB Atlas (cloud) - see INSTALL_MONGODB.md
    echo.
    echo For now, trying to start backend server only...
    echo If you're using MongoDB Atlas, this should work.
    echo.
    pause
    goto START_BACKEND
)

REM Check if MongoDB is already running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB is already running!
    echo.
) else (
    echo Starting MongoDB...
    start "MongoDB Server" cmd /k "mongod"
    echo [OK] MongoDB started in new window
    echo.
    timeout /t 3 /nobreak >nul
)

:START_BACKEND
echo Starting Backend Server...
cd backend
start "BETCI Backend Server" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo Application is starting...
echo ========================================
echo.
echo Wait 5 seconds, then open your browser to:
echo.
echo Admin Dashboard:
echo   http://localhost:5500/frontend/admin/pages/dashboard.html
echo.
echo Admin Login:
echo   http://localhost:5500/frontend/admin/login.html
echo   Email: admin@betci.com
echo   Password: admin123
echo.
echo Trainees Page:
echo   http://localhost:5500/frontend/admin/pages/trainees.html
echo.
echo ========================================
echo.
echo Press any key to open the dashboard in your browser...
pause >nul

start http://localhost:5500/frontend/admin/pages/dashboard.html

echo.
echo Dashboard opened in browser!
echo.
echo To stop the application:
echo - Close the MongoDB window (if opened)
echo - Close the Backend Server window
echo.
pause
