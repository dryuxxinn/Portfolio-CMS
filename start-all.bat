@echo off
title Menjalankan Port-sin Dynamic Full-Stack
echo ========================================================
echo  Menjalankan Port-sin (Portfolio & Hotspot/PPPoE System)
echo ========================================================
echo.

echo [1/2] Menjalankan Backend API (Port 5000)...
start "Port-sin Backend API" cmd /k "cd backend && node src/server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Menjalankan Frontend Next.js (Port 3000)...
start "Port-sin Frontend" cmd /k "cd frontend && npx.cmd next dev --webpack -p 3000"

echo.
echo ========================================================
echo  Aplikasi Berhasil Dijalankan!
echo  - Frontend Web Publik : http://localhost:3000
echo  - Dasbor CMS Admin    : http://localhost:3000/admin/login
echo  - Backend REST API    : http://localhost:5000
echo  - Dokumentasi Swagger : http://localhost:5000/api-docs
echo ========================================================
pause

