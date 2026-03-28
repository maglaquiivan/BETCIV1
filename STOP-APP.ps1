# BETCI Application - Stop All Services

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BETCI Application - Stop All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name node -Force
    Write-Host "[OK] Backend server stopped" -ForegroundColor Green
} else {
    Write-Host "[INFO] No Node.js processes found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Stopping MongoDB..." -ForegroundColor Yellow
$mongoProcesses = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcesses) {
    Stop-Process -Name mongod -Force
    Write-Host "[OK] MongoDB stopped" -ForegroundColor Green
} else {
    Write-Host "[INFO] MongoDB not running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All services stopped!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
