@echo off
echo Iniciando el backend (Spring Boot)...
start "Backend" /D "%~dp0..\..\..\huesitos-backend" powershell -NoExit -Command ".\mvnw spring-boot:run"
echo Iniciando el frontend (React/Vite)...
start "Frontend" /D "%~dp0..\..\..\huesitos-frontend" powershell -NoExit -Command "npm run dev"
echo El proyecto se esta iniciando.
echo - Backend: http://localhost:8080
echo - Frontend: http://localhost:5173
