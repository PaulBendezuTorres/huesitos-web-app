---
description: Actualizar el progreso y estado de la base de código en el archivo memoria.md usando la skill resumen-memoria
---

# Workflow: Actualizar Memoria del Proyecto

Este workflow permite actualizar el progreso y estado de la base de código en el archivo local `memoria.md` en la raíz del proyecto, utilizando la skill `resumen-memoria`.

## Pasos del Workflow

### 1. Escaneo de Cambios Recientes
* El agente debe revisar el historial reciente de commits (`git log -n 5`) o el estado actual de los archivos modificados para detectar los últimos avances en el backend, frontend y base de datos.

### 2. Invocación de la Skill
* El agente debe invocar las directrices de la skill `resumen-memoria` (ubicada en `.agents/skills/resumen-memoria/SKILL.md`) para estructurar el contenido de forma correcta.

### 3. Lectura de Memoria Actual
* Leer el archivo actual [memoria.md](file:///memoria.md) en la raíz del espacio de trabajo.

### 4. Generación de Propuesta
* El agente redactará una propuesta estructurada de actualización para el archivo `memoria.md` que incluya:
  * Última fecha de actualización.
  * Logros recientes (añadiendo los nuevos hitos completados).
  * Estado actual de los componentes (Backend, Frontend, Base de datos).
  * Próximos pasos pendientes.
  * Decisiones clave tomadas en las últimas tareas.

### 5. Escritura Directa y Automática (Sin Confirmación)
* El agente escribirá y guardará la actualización directamente en el archivo `memoria.md` en la raíz del proyecto de forma automática.
* **CRÍTICO**: El agente NO debe realizar preguntas, presentar una propuesta previa en el chat, ni solicitar confirmación o aprobación antes de escribir. Debe guardar los cambios directamente.
* Posteriormente, presentará un resumen extremadamente conciso de la actualización realizada al usuario en el chat.
