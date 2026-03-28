@echo off
echo ========================================
echo BETCI Application Startup
echo ========================================
echo.
echo IMPORTANT: Make sure MongoDB is running!
echo Run 'mongod' in another terminal if not started.
echo.
pause

echo.
echo Starting Backend Server with MongoDB...
echo.
cd backend
start cmd /k "npm start"

echo.
echo ========================================
echo Server starting...
echo ========================================
echo.
echo Wait 5 seconds, then open your browser to:
echo http://localhost:5500
echo.
echo Admin Login: http://localhost:5500/admin/login.html
echo   Email: admin@betci.com
echo   Password: admin123
echo.
echo Trainee Login: http://localhost:5500/auth/login.html
echo   Email: trainee@betci.com
echo   Password: trainee123
echo.
echo Test API: http://localhost:5500/test-api.html
echo ========================================
pause
