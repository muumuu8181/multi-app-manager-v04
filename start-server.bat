@echo off
echo Multi-App Manager v0.46 Server Starting...
echo.

cd /d "%~dp0"

echo Installing dependencies...
npm install

echo.
echo Starting server...
echo Firebase Authentication will work at: http://localhost:3003
echo.

node simple-server.js

pause