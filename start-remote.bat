@echo off
echo Starting Laptop Remote Control Services...

:: Start Unified Remote Service (assuming default installation path)
net start "Unified Remote" 2>nul
if %errorlevel% neq 0 (
    echo [!] Unified Remote service could not be started. Make sure it is installed.
) else (
    echo [+] Unified Remote service is running.
)

:: Optional: Open Remote Desktop settings for confirmation
echo [+] Opening Remote Desktop settings...
start ms-settings:remotedesktop

echo.
echo Setup complete. You can now connect from your mobile phone.
pause
