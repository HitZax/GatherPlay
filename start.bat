@echo off
echo ========================================
echo   GatherPlay v2.0 - Starting Servers
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

echo [2/2] Starting servers...
echo.
echo Frontend: http://localhost:5173
echo Backend:  Port 3001
echo.
echo Press Ctrl+C to stop servers
echo ========================================
echo.

npm run dev

pause
