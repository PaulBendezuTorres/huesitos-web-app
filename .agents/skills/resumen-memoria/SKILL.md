---
name: resumen-memoria
description: Generar, actualizar o consultar un resumen del estado de memoria y progreso del proyecto. Usar cuando el usuario pida un resumen de lo que se ha avanzado, desee guardar el estado actual para un nuevo chat, o necesite sincronizar el contexto sin duplicar las reglas estáticas definidas en .cursorrules.
---

# Resumen de Memoria del Proyecto

Esta habilidad permite mantener un registro dinámico del progreso y estado actual del proyecto en un archivo local llamado `memoria.md` en la raíz del espacio de trabajo. 

## Cuándo usar esta habilidad
- Al finalizar una tarea importante o sesión para registrar los avances.
- Al iniciar un nuevo chat para recuperar rápidamente el contexto del estado del desarrollo.
- Cuando el usuario solicite saber "qué se ha hecho" o "en qué nos quedamos".

> [!IMPORTANT]
> Esta habilidad no debe duplicar las reglas tecnológicas ni estándares de `.cursorrules`. Su propósito es almacenar el **estado dinámico** del avance y las decisiones tomadas durante el desarrollo.

## Instrucciones de Uso

### 1. Lectura del estado (Inicio de Sesión/Chat)
Al iniciar un nuevo chat o cuando el usuario lo solicite:
1. Buscar y leer el archivo `memoria.md` en la raíz del proyecto.
2. Si existe, usar su contenido para comprender el punto exacto en el que se encuentra el desarrollo del backend, frontend y base de datos.
3. Si no existe, ofrecer crear el archivo para comenzar a documentar el progreso.

### 2. Escritura/Actualización del estado (Progreso de Tareas)
Cada vez que se complete un cambio relevante (ej. inicialización de frontend, creación de APIs, etc.) o a petición del usuario:
1. Leer el archivo `memoria.md` existente (si lo hay).
2. Actualizar las secciones correspondientes con los nuevos avances.
3. Guardar el archivo en la raíz del proyecto.

## Estructura de `memoria.md`
El archivo `memoria.md` debe mantener la siguiente estructura limpia en español:

```markdown
# Memoria de Desarrollo - Huesitos

Última actualización: [Fecha y Hora actual]

## 🚀 Logros Recientes
- [ ] Breve lista de características terminadas y subidas a producción o rama develop.

## 📌 Estado Actual de los Componentes
- **Backend (Spring Boot)**: Estado actual de la API, endpoints creados, dependencias configuradas.
- **Frontend (React)**: Componentes creados, vistas implementadas, diseño y Tailwind.
- **Base de Datos (MySQL)**: Tablas creadas, migraciones ejecutadas, conexiones activas.

## 🛠️ Próximos Pasos (Pendientes)
- [ ] Lista ordenada de prioridades para el siguiente paso del desarrollo.

## 🧠 Decisiones Clave y Notas
- Registro de decisiones técnicas o de arquitectura tomadas en el camino.
```
