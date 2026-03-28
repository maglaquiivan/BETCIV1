@echo off
echo ========================================
echo BETCI Application - Status Check
echo ========================================
echo.

echo Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB is RUNNING
) else (
    echo [X] MongoDB is NOT running
)

echo.
echo Checking Backend Server (Node.js)...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Backend Server is RUNNING
) else (
    echo [X] Backend Server is NOT running
)

echo.
echo Checking if port 5500 is in use...
netstat -ano | findstr :5500 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Port 5500 is IN USE (server is running)
) else (
    echo [X] Port 5500 is FREE (server is not running)
)

echo.
echo ========================================
echo Testing API Connection...
echo ========================================
echo.

curl -s http://localhost:5500/api/trainees >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] API is responding!
    echo.
    echo You can open the application:
    echo   http://localhost:5500/frontend/admin/pages/dashboard.html
) else (
    echo [X] API is not responding
    echo.
    echo Please run RUN-APP.bat to start the application
)

echo.
echo ========================================
pause
