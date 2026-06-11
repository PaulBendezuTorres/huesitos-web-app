@echo off
echo Iniciando el backend (Spring Boot)...
start powershell -NoExit -Command "cd huesitos-backend; ./mvnw spring-boot:run"
echo Iniciando el frontend (React/Vite)...
start powershell -NoExit -Command "cd huesitos-frontend; npm run dev"
echo El proyecto se esta iniciando.
echo - Backend: http://localhost:8080
echo - Frontend: http://localhost:5173
