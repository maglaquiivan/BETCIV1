# BETCI Application - PowerShell Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BETCI Application - Easy Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is installed
$mongoInstalled = Get-Command mongod -ErrorAction SilentlyContinue
if (-not $mongoInstalled) {
    Write-Host "[WARNING] MongoDB is not installed or not in PATH!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You have 2 options:" -ForegroundColor Yellow
    Write-Host "1. Install MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host "2. Use MongoDB Atlas (cloud) - see INSTALL_MONGODB.md" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For now, trying to start backend server only..." -ForegroundColor Yellow
    Write-Host "If you're using MongoDB Atlas, this should work." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue"
} else {
    # Check if MongoDB is already running
    $mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoRunning) {
        Write-Host "[OK] MongoDB is already running!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "Starting MongoDB..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "mongod" -WindowStyle Normal
        Write-Host "[OK] MongoDB started in new window" -ForegroundColor Green
        Write-Host ""
        Start-Sleep -Seconds 3
    }
}

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Set-Location backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Application is starting..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 5 seconds, then open your browser to:" -ForegroundColor White
Write-Host ""
Write-Host "Admin Dashboard:" -ForegroundColor Green
Write-Host "  http://localhost:5500/frontend/admin/pages/dashboard.html" -ForegroundColor White
Write-Host ""
Write-Host "Admin Login:" -ForegroundColor Green
Write-Host "  http://localhost:5500/frontend/admin/login.html" -ForegroundColor White
Write-Host "  Email: admin@betci.com" -ForegroundColor Gray
Write-Host "  Password: admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "Trainees Page:" -ForegroundColor Green
Write-Host "  http://localhost:5500/frontend/admin/pages/trainees.html" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Wait and open browser
Start-Sleep -Seconds 5
Start-Process "http://localhost:5500/frontend/admin/pages/dashboard.html"

Write-Host "Dashboard opened in browser!" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the application:" -ForegroundColor Yellow
Write-Host "- Close the MongoDB window (if opened)" -ForegroundColor Gray
Write-Host "- Close the Backend Server window" -ForegroundColor Gray
Write-Host "- Or run STOP-APP.ps1" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit this window"
