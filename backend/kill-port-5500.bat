@echo off
REM Kill process using port 5500

echo Checking for process on port 5500...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5500') do (
    echo Found process: %%a
    taskkill /F /PID %%a
    echo Process killed!
)

echo.
echo Port 5500 is now free.
echo You can now run: npm start
pause
