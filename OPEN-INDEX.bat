@echo off
echo Opening BETCI Main Page...
echo.
echo IMPORTANT: Make sure your Node.js backend is running!
echo If not, run START-BACKEND.bat first
echo.
timeout /t 2
start http://localhost:5500/
