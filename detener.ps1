# Script de PowerShell para detener la aplicación Huesitos
Write-Host "Buscando procesos ejecutandose en los puertos del proyecto..." -ForegroundColor Yellow

# Detener Backend en puerto 8080
$backendProcess = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($backendProcess) {
    Stop-Process -Id $backendProcess -Force
    Write-Host "Backend detenido exitosamente." -ForegroundColor Green
} else {
    Write-Host "No se detecto ningun backend corriendo en el puerto 8080." -ForegroundColor Gray
}

# Detener Frontend en puerto 5173
$frontendProcess = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($frontendProcess) {
    Stop-Process -Id $frontendProcess -Force
    Write-Host "Frontend detenido exitosamente." -ForegroundColor Green
} else {
    Write-Host "No se detecto ningun frontend corriendo en el puerto 5173." -ForegroundColor Gray
}

Write-Host "Todos los servicios del proyecto han sido detenidos." -ForegroundColor Cyan
