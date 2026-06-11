# Script de PowerShell para iniciar la aplicación Huesitos
Write-Host "Iniciando el backend (Spring Boot)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd huesitos-backend; ./mvnw spring-boot:run" -WindowStyle Normal

Write-Host "Iniciando el frontend (React/Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd huesitos-frontend; npm run dev" -WindowStyle Normal

Write-Host "El proyecto se esta iniciando." -ForegroundColor Cyan
Write-Host "- Backend ejecutandose en: http://localhost:8080" -ForegroundColor Cyan
Write-Host "- Frontend ejecutandose en: http://localhost:5173" -ForegroundColor Cyan
