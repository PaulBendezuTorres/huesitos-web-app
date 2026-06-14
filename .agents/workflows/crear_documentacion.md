---
description: Crear de manera estructurada documentación técnica (APIs, base de datos, guías o decisiones de arquitectura)
---

# Workflow: Crear Documentación Técnica

Este workflow permite crear de manera estructurada y autónoma documentación técnica (APIs, base de datos, guías o decisiones de arquitectura) directamente en la carpeta `docs/` sin necesidad de confirmación o aprobación manual previa por parte del usuario.

## Pasos del Workflow

### 1. Determinar el Tipo de Documentación
El agente identificará el tipo de documento basándose en el requerimiento del usuario:
1. **Registro de Decisión de Arquitectura (ADR)**: Elección de tecnologías, frameworks, base de datos, seguridad, etc.
2. **Documentación Técnica General**: Guías de endpoints, diagramas de flujo, modelos de datos, configuraciones, etc.

### 2. Invocación Autónoma de Skills
Si la documentación corresponde a un **ADR**, el agente aplicará de forma autónoma las directrices de la skill:
*   [architecture-decision-records](file:///.agents/skills/architecture-decision-records/SKILL.md)

Seleccionará la plantilla adecuada (Standard ADR, Lightweight, o Y-Statement) según la magnitud de la decisión.

### 3. Estructuración y Redacción
El agente redactará el documento en español con la estructura recomendada:
*   Sintaxis Markdown limpia.
*   Tablas comparativas e información estructurada.
*   Diagramas Mermaid para flujos de datos o secuencias de control.
*   Cumplimiento de las reglas de seguridad (sin exponer credenciales ni rutas absolutas).

### 4. Escritura Directa del Archivo
El agente creará y guardará directamente el archivo dentro de la carpeta `docs/` del proyecto:
*   Si es un ADR, lo creará en `docs/adr/NNNN-nombre-decision.md` y actualizará el índice principal en `docs/adr/README.md`.
*   Si es documentación general, lo guardará en `docs/nombre_documento.md`.

### 5. Notificación
El agente informará al usuario la ruta del archivo generado y presentará un resumen de su contenido en el chat.
