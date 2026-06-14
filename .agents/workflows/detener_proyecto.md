---
description: Detener todos los procesos en ejecución asociados al backend y frontend del proyecto Huesitos
---

# Workflow: Detener el Proyecto

Este workflow permite detener todos los procesos en ejecución asociados al backend y frontend del proyecto Huesitos de forma limpia.

## Comandos Disponibles

### Opción 1: Usando PowerShell (Recomendado)
Ejecuta el script en la consola de PowerShell:
```powershell
.\.agents\workflows\control\detener.ps1
```

### Opción 2: Usando CMD (Símbolo del sistema)
Ejecuta el script de lote:
```cmd
.\.agents\workflows\control\detener.bat
```

## Funcionamiento
1. El script escanea los puertos ocupados por la aplicación:
   * Puerto `8080` para el Backend (Spring Boot / Java)
   * Puerto `5173` para el Frontend (Vite / Node)
2. Si detecta algún proceso escuchando en esos puertos, los finaliza de forma forzada (`Stop-Process -Force` o `taskkill /f /pid`).
3. Esto cierra las ventanas y detiene las ejecuciones en segundo plano de manera segura, liberando los puertos.
