---
trigger: model_decision
description: Reglas generales del proyecto, estándares de codificación, flujo de Git, commits, gestión de tareas y prioridades de habilidades para el monorepo Huesitos.
---

# Reglas Generales del Proyecto Huesitos

## Tecnologías del Proyecto
- **Backend**: Java 26 / Spring Boot 4.
- **Frontend**: React 18 / Tailwind CSS 3.4.
- **Base de Datos**: MySQL 8.4.
- **Estructura**: Monorepo.

## Estándares del Proyecto
- **Respuestas**: Responder siempre de manera sumamente breve, concisa y directa al grano. Al terminar las tareas asignadas, la respuesta final debe ser muy corta y directa al grano.
- Todo el código nuevo debe respetar la estructura de carpetas:
  - `huesitos-backend/` para Spring Boot.
  - `huesitos-frontend/` para React.
- Escribir código limpio, modular y autodocumentado.
- **Patrón y Principios**: Aplicar obligatoriamente el patrón de diseño MVC (desacoplado) y los principios SOLID en todo el desarrollo de la aplicación.
- Seguir las mejores prácticas de seguridad e inyección de dependencias.
- **Seguridad**: Nunca exponer ni registrar rutas locales absolutas del sistema de archivos del usuario (ej. `C:/Users/...`) en archivos públicos del repositorio (como `README.md`).

## Flujo de Git y Ramas
- **`main`**: Solo código en producción 100% funcional.
- **`develop`**: Rama de integración de características.
- **`feature/nombre-funcion`**: Ramas temporales para avanzar tareas específicas.
- **Merge**: Trabajar en `feature/` y fusionar hacia `develop` una vez finalizado y probado por completo.

## Reglas de Commits y Control de Versiones
- Todos los mensajes y descripciones de los commits deben redactarse estrictamente en **español**.
- **Granularidad de Commits (Estricto)**: Se debe realizar un único commit al finalizar por completo cada fase de desarrollo. No se deben acumular cambios no descritos; el commit debe detallar obligatoriamente y de manera explícita cada uno de los puntos que se movieron o desarrollaron en la fase actual.
- **Mensajes de Commit Descriptivos**: El mensaje de commit debe ser muy detallado, especificando archivo por archivo o clase por clase las modificaciones y su objetivo preciso (evitando mensajes genéricos que no indiquen claramente qué se ha movido).
- Usar los siguientes prefijos:
  - `feat: ...` -> Nueva funcionalidad.
  - `fix: ...` -> Corrección de errores.
  - `docs: ...` -> Cambios en documentación.
  - `style: ...` -> Cambios visuales con Tailwind.
- **Permiso de Integración (Merge)**: Antes de realizar cualquier fusión (merge) de ramas (como de `feature/*` a `develop` o `develop` a `main`), se debe **solicitar siempre permiso explícito del usuario**.

## Gestión de Planes y Tareas (Desarrollo Basado en Especificaciones - SDD)
- Para cualquier desarrollo complejo o no trivial, se debe elaborar/actualizar un plan de implementación (`implementation_plan.md`) y una lista de tareas (`task.md`).
- Se debe ir actualizando el progreso de las tareas marcándolas como en progreso `[/]` y completadas `[x]` a medida que se avanza en cada paso.
- **Flujo Híbrido de Especificaciones y Memoria**:
  - **memoria.md**: Lo usamos para registrar la fecha de actualización, la lista rápida de logros de la semana y la lista de tareas pendientes generales (`## 🛠️ Próximos Pasos`).
  - **.agents/specs/**: Se crea y utiliza únicamente para características (features) complejas y módulos grandes. No se crea un archivo de especificaciones para pequeños cambios de diseño.
  - Es obligatorio actualizar el archivo `memoria.md` inmediatamente después de completar el desarrollo y/o las pruebas de un plan de trabajo.

## Prioridad y Uso de Skills (.agents/skills/)
Al diseñar e implementar soluciones en el proyecto, se deben revisar y priorizar los skills locales en la carpeta `.agents/skills/` en el siguiente orden de importancia:
1. **Desarrollo Backend y Base de Datos (Prioridad Alta)**:
   - [java-springboot](.agents/skills/java-springboot/SKILL.md): Reglas específicas para Spring Boot 4 y Java 26.
   - [springboot-security](.agents/skills/springboot-security/SKILL.md): Configuración de seguridad, filtros y cifrado JWT.
   - [backend-patterns](.agents/skills/backend-patterns/SKILL.md): Estructuras, inyección de dependencias y organización en capas.
   - [mysql](.agents/skills/mysql/SKILL.md): Diseño de tablas en plural/minúsculas y mapeo JPA.
   - [error-handling-patterns](.agents/skills/error-handling-patterns/SKILL.md): Control y gestión de excepciones y respuestas de error uniformes.
2. **Desarrollo Frontend (Prioridad Media)**:
   - [frontend-design](.agents/skills/frontend-design/SKILL.md): Arquitectura limpia y reusable en React con Tailwind CSS.
3. **Flujo de Trabajo (Prioridad Soporte)**:
   - [resumen-memoria](.agents/skills/resumen-memoria/SKILL.md): Generar, actualizar o consultar la bitácora de progreso `memoria.md` bajo el modelo híbrido (manteniendo la fecha, logros de la semana y tareas pendientes, sin duplicar especificaciones de `.agents/specs/` ni reglas de `.agents/rules/`).

## Idioma y Nomenclatura
- Todo el código (clases, variables, métodos, tablas en minúscula/plural) y la documentación se escriben estrictamente en **español**.

## Reglas de Verificación y Pruebas
- **Pruebas de Navegador**: Queda ESTRICTAMENTE PROHIBIDO usar la herramienta automatizada del navegador (`browser_subagent`) para realizar pruebas de interfaz o verificar flujos. Estas pruebas consumen demasiado tiempo y tokens. Toda verificación visual o funcional de la interfaz debe dejarse para que el usuario la valide manualmente en su entorno.