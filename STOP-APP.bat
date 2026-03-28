@echo off
echo ========================================
echo BETCI Application - Stop All Services
echo ========================================
echo.

echo Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend server stopped
) else (
    echo [INFO] No Node.js processes found
)

echo.
echo Stopping MongoDB...
taskkill /F /IM mongod.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB stopped
) else (
    echo [INFO] MongoDB not running or installed as service
)

echo.
echo ========================================
echo All services stopped!
echo ========================================
echo.
pause
