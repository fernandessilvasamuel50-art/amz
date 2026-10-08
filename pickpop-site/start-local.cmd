@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -File "%~dp0start-local.ps1"
pause
