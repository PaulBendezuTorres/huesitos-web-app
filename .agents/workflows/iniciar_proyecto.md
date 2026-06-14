---
description: Iniciar el backend (Spring Boot) y el frontend (React/Vite) en segundo plano a través del agente
---

# Workflow: Iniciar el Proyecto

Este workflow inicia el backend y el frontend en segundo plano ejecutando directamente los comandos a través de la terminal del agente.

## Funcionamiento por el Agente
Cuando el usuario solicita `/iniciar_proyecto`, el agente ejecutará los siguientes comandos en segundo plano:

1. **Backend**: `.\mvnw spring-boot:run` dentro de `huesitos-backend/` (puerto `8080`).
2. **Frontend**: `npm run dev` dentro de `huesitos-frontend/` (puerto `5173`).

El agente mantendrá los procesos corriendo en segundo plano e informará al usuario cuando estén listos.

