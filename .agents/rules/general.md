---
trigger: always_on
description: Reglas generales del proyecto Huesitos, incluyendo flujo de git, documentación y seguridad.
---

# Reglas Generales del Proyecto (Huesitos)

## Restricciones de Modificación y Ramas
- **Ámbito de Trabajo**: El agente/desarrollador tiene permitido realizar modificaciones tanto en el frontend ([huesitos-frontend/](./huesitos-frontend)) como en el backend ([huesitos-backend/](./huesitos-backend)) del proyecto Huesitos.
- **Creación de Ramas**: Cualquier nueva rama de características debe crearse a partir de la rama `develop`.
- **Integración y Merges**: El agente NO debe realizar merges entre ramas de forma automática ni sin indicación explícita del usuario. El usuario siempre avisará explícitamente cuándo se debe realizar un merge.
- **Planes de Trabajo e Implementación**: El agente solo debe crear o escribir planes de trabajo, planes de implementación (`implementation_plan.md`) o definición de tareas (`task.md`) para tareas grandes o cambios complejos, o cuando el usuario lo solicite de forma explícita. Para cambios o tareas pequeñas, no se debe requerir un plan.
- **Seguimiento del Proyecto & Documentación**:
  - **Uso de Pruebas de Navegador**: Para optimizar el tiempo de ejecución y ahorrar tokens, el agente tiene **prohibido** utilizar el subagente de navegación web (`browser_subagent`) de forma autónoma o automática. La validación visual y funcional en el navegador la realizará manualmente el usuario. El agente solo debe verificar la compilación local y pruebas de terminal.
  - **Actualización de Memoria y Docs**: El agente **NO debe realizar** actualizaciones automáticas en `memoria.md` ni en `docs/`. La actualización y creación de estos archivos **será realizada única y exclusivamente por el usuario**. El agente no debe sugerir actualizarlos automáticamente ni realizar modificaciones en ellos a menos que el usuario lo ordene de forma directa y explícita.

## Tecnologías Principales (Monolito)
- **Backend**: Java 26 / Spring Boot 4.
- **Frontend**: React 18 / Tailwind CSS 3.4.
- **Base de Datos**: MySQL 8.4.

## Estándares del Proyecto
- **Idioma**: El asistente debe responder SIEMPRE en español. Todo el código nuevo (nombres de variables, clases, métodos) y la documentación técnica deben escribirse preferentemente en español. Las explicaciones y respuestas deben ser breves, concisas y estrictamente al grano.
- **Seguridad**:
  - Nunca expongas credenciales, llaves API, tokens o información sensible en el código ni en repositorios. Usa archivos de propiedades configurados adecuadamente o variables de entorno.
  - Asegurar la validación estricta de datos de entrada (DTOs, anotaciones `@Valid` en Spring Boot).
  - Nunca expongas rutas locales absolutas del sistema de archivos del usuario (ej. `C:/Users/...`) en archivos públicos del repositorio.

## Reglas de Git y Commits
- **Formato de Mensaje**: Redactar los mensajes de commits **obligatoriamente en español** con prefijos semánticos (`feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`). Está estrictamente prohibido redactar commits en inglés. El mensaje debe ser estructurado y conciso, incluyendo un título descriptivo y un cuerpo con una lista de viñetas (puntos) que resuma detalladamente los aspectos desarrollados.
  - Ejemplo de formato:
    ```
    feat: implementar modal de metas
    
    * Ajustar alineación vertical al centro
    * Corregir z-index para superponer sobre el sidebar
    * Eliminar animación de desplazamiento vertical heredada
    ```
- **Frecuencia**: Realizar obligatoriamente un commit al finalizar cada tarea (sea una tarea pequeña e individual o un paso de un plan de trabajo), antes de proceder con el siguiente cambio.
- **Archivos Locales Excluidos**: Nunca se deben agregar, hacer commit o subir al repositorio remoto el archivo `memoria.md`. Este archivo es estrictamente de uso local y contexto para los agentes en el entorno de desarrollo.
