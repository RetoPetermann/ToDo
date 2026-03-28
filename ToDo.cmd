@echo off
cd /d "%~dp0"
start /b node server.js

REM Warten bis der Server auf Port 3000 antwortet
:wait
powershell -Command "try { Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 1 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    timeout /t 1 /nobreak >nul
    goto wait
)

start http://localhost:3000
