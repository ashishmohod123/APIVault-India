@echo off
title APIVault India - Launcher
echo =======================================================
echo    APIVault India - Developer API Marketplace & Gateway
echo    Architect: Ashish Mohod (Nagpur, Maharashtra)
echo =======================================================
echo.

echo [1/2] Launching FastAPI Backend on http://0.0.0.0:8000 ...
start cmd /k "cd /d %~dp0backend && python run.py"

echo [2/2] Launching Vite Frontend on http://0.0.0.0:5173 ...
start cmd /k "cd /d %~dp0frontend && npm run dev -- --host 0.0.0.0"

echo.
echo All services launched!
echo Access Web App:        http://localhost:5173
echo Swagger Documentation: http://127.0.0.1:8000/docs
echo Mobile / Wi-Fi Access: http://172.20.10.2:5173
echo.
pause
