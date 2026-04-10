@echo off
title BETCI Error Fix Tool
color 0A

:menu
cls
echo.
echo ========================================
echo    BETCI Error Fix Tool
echo ========================================
echo.
echo Select the fix you need:
echo.
echo [1] Fix 431 Error (Request Header Too Large)
echo [2] Fix Database Images (Add data: prefix)
echo [3] Clear All Cache
echo [4] Clear Session Data
echo [5] Open Documentation
echo [6] Exit
echo.
echo ========================================
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo Opening 431 Error Fix Tool...
    start http://localhost:5500/fix-431-error.html
    echo.
    echo Tool opened in your browser.
    echo Click "Fix Storage Now" to remove large Base64 data.
    pause
    goto menu
)

if "%choice%"=="2" (
    echo.
    echo ========================================
    echo   Fix Database Images
    echo ========================================
    echo.
    echo This will scan your database and add
    echo the "data:" prefix to Base64 images.
    echo.
    set /p confirm="Continue? (Y/N): "
    if /i "!confirm!" EQU "Y" (
        echo.
        echo Running database migration...
        cd backend
        node scripts/fixBase64Images.js
        cd ..
        echo.
        pause
    )
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo Opening Cache Clear Tool...
    start http://localhost:5500/clear-cache.html?auto
    echo.
    echo Cache will be cleared automatically.
    pause
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo Opening Session Clear Tool...
    start http://localhost:5500/clear-session.html
    echo.
    echo Session data will be cleared.
    pause
    goto menu
)

if "%choice%"=="5" (
    echo.
    echo Opening Documentation...
    start COMPLETE_FIX_GUIDE.md
    echo.
    echo Documentation opened.
    pause
    goto menu
)

if "%choice%"=="6" (
    echo.
    echo Exiting...
    exit
)

echo.
echo Invalid choice. Please try again.
pause
goto menu
