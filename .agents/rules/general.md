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
  - **Actualización de Memoria y Docs**: El agente debe realizar la actualización de `memoria.md` de forma directa y automática (sin preguntar, pedir confirmación o aprobación previa al usuario) cuando ejecute el workflow `/actualizar_memoria` o cuando se requiera registrar el avance. Las modificaciones en `docs/` siguen estando restringidas y solo se realizarán bajo indicación del usuario.

## Tecnologías Principales (Monolito)
- **Backend**: Java 26 / Spring Boot 4.
- **Frontend**: React 18 / Tailwind CSS 3.4.
- **Base de Datos**: MySQL 8.4.

## Estándares del Proyecto
- **Idioma y Comunicación**: El asistente debe responder SIEMPRE en español, iniciando obligatoriamente su mensaje saludando a "Paul" (ej. "Paul, ..."). Todo el código nuevo (nombres de variables, clases, métodos) y la documentación técnica deben escribirse preferentemente en español. **Las explicaciones y respuestas del asistente deben ser obligatoriamente muy breves, concisas y directas al grano, sin rodeos ni explicaciones redundantes.**
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
- **Frecuencia y Ejecución**: El agente tiene **prohibido** realizar commits de forma automática o ejecutar el comando `git commit`. Al finalizar cada tarea o plan de implementación completado, el agente debe dejar redactado el mensaje de commit estructurado en español al final de su respuesta, para que el usuario realice el commit de forma manual.
- **Archivos Locales Excluidos**: Nunca se deben agregar, hacer commit o subir al repositorio remoto el archivo `memoria.md`. Este archivo es estrictamente de uso local y contexto para los agentes en el entorno de desarrollo.
- **Archivos Ignorados**: Está estrictamente prohibido forzar la adición (`git add -f`) de archivos o directorios que estén excluidos en el archivo `.gitignore` del proyecto.
