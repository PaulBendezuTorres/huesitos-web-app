# Workflow: Iniciar el Proyecto

Este workflow permite iniciar de forma automática tanto el backend (Spring Boot) como el frontend (React/Vite) del proyecto Huesitos.

## Comandos Disponibles

### Opción 1: Usando PowerShell (Recomendado)
Ejecuta el script `./iniciar.ps1` en la consola de PowerShell:
```powershell
.\iniciar.ps1
```

### Opción 2: Usando CMD (Símbolo del sistema)
Ejecuta el script de lote:
```cmd
iniciar.bat
```

## Funcionamiento
1. El script iniciará el **Backend** en una nueva ventana de PowerShell ejecutando `./mvnw spring-boot:run` dentro de la carpeta `huesitos-backend/` (puerto `8080`).
2. El script iniciará el **Frontend** en otra ventana de PowerShell ejecutando `npm run dev` dentro de la carpeta `huesitos-frontend/` (puerto `5173`).
3. Ambas ventanas se mantendrán abiertas para poder visualizar los logs de salida.
