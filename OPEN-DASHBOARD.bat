@echo off
echo Opening BETCI Admin Dashboard...
echo.
echo IMPORTANT: Make sure your Node.js backend is running!
echo If not, run START-BACKEND.bat first
echo.
timeout /t 2
start http://localhost:5500/admin/pages/dashboard.html
