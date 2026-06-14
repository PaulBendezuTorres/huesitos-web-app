---
description: Sincronizar el contexto del agente con las reglas y la memoria del proyecto al iniciar un nuevo chat
---

# Workflow: Iniciar Nuevo Chat

Este workflow se ejecuta al comenzar una nueva conversación para sincronizar el contexto del agente con las reglas y la memoria del proyecto Huesitos.

## Pasos del Workflow

### 1. Cargar las Reglas del Proyecto
El agente debe leer los archivos de reglas del proyecto para alinearse con los estándares requeridos (como nomenclatura en español, inyección por constructores, Tailwind responsive, etc.):
*   [general.md](file:///.agents/rules/general.md) (Reglas generales del proyecto)
*   [backend.md](file:///.agents/rules/backend.md) (Estándares para Spring Boot)
*   [frontend.md](file:///.agents/rules/frontend.md) (Estándares para React/Tailwind)

### 2. Recuperar la Memoria del Desarrollo
El agente debe leer el archivo de memoria para situarse en el punto exacto de avance de las tareas:
*   [memoria.md](file:///memoria.md) (Progreso de los componentes y próximos pasos)

### 3. Confirmación de Carga de Contexto
El agente presentará un mensaje en el chat confirmando que ha procesado las reglas y la memoria, resumiendo brevemente:
*   El último logro completado (según la memoria).
*   La tarea pendiente prioritaria en la que se debe trabajar a continuación.
