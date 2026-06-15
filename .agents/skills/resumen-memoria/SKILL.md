---
name: resumen-memoria
description: Generar, actualizar o consultar un resumen del estado de memoria y progreso del proyecto. Usar cuando el usuario pida un resumen de lo que se ha avanzado, desee guardar el estado actual para un nuevo chat, o necesite sincronizar el contexto sin duplicar las reglas estáticas definidas en .cursorrules.
---

# Resumen de Memoria del Proyecto

Esta habilidad mantiene un registro dinámico del progreso y estado actual del proyecto en `memoria.md` (raíz del workspace).

## Cuándo usar esta habilidad
- Al finalizar una tarea importante o sesión para registrar avances.
- Al iniciar un nuevo chat para recuperar el contexto.
- Cuando el usuario solicite saber "qué se ha hecho" o "en qué nos quedamos".

> [!IMPORTANT]
> No duplicar las reglas tecnológicas ni estándares de las reglas del proyecto. Solo almacenar el **estado dinámico** del avance y decisiones tomadas.

## Instrucciones de Uso

### 1. Lectura (Inicio de Chat)
1. Buscar y leer `memoria.md` en la raíz del proyecto.
2. Si existe, usar su contenido para comprender el estado del desarrollo.
3. Si no existe, ofrecer crearlo.

### 2. Escritura/Actualización (Progreso)
Cada vez que se complete un cambio relevante o a petición del usuario:
1. Leer `memoria.md` existente.
2. Actualizar las secciones correspondientes con los nuevos avances.
3. **Aplicar las reglas de compresión** antes de guardar.
4. Guardar en la raíz del proyecto.

## Estructura de `memoria.md`

```markdown
# Memoria de Desarrollo - Huesitos

Última actualización: [Fecha] ([Breve resumen de lo último hecho])

## 🚀 Logros por Módulo

### [Nombre del Módulo]
- [x] Descripción compacta del logro (1 línea por logro, sin rutas de archivo).

## 📌 Estado Actual
- **Backend**: Resumen de 1-2 líneas.
- **Frontend**: Resumen de 1-2 líneas.
- **Base de Datos**: Resumen de 1-2 líneas.

## 🛠️ Próximos Pasos
- Lista de 2-5 prioridades.

## 🧠 Decisiones Clave
- Decisiones técnicas relevantes (1 línea cada una).
```

## Reglas de Compresión (OBLIGATORIAS)

> [!CAUTION]
> El archivo `memoria.md` NUNCA debe superar las **120 líneas**. Si al agregar nuevos logros se excede este límite, el agente DEBE comprimir antes de guardar.

### Principios de compresión

1. **Agrupar por módulo funcional**: Nunca listar logros cronológicamente uno por uno. Siempre agrupar bajo encabezados de módulo (`### Autenticación`, `### Citas`, `### Marketing`, etc.).

2. **Consolidar logros granulares**: Cuando un módulo tenga más de 4-5 viñetas, fusionar los puntos relacionados en una sola línea compacta.
   - ❌ Mal (4 líneas):
     ```
     - [x] Creada entidad Cita.
     - [x] Creado repositorio CitaRepositorio.
     - [x] Creado servicio CitaServicio.
     - [x] Creado controlador CitaControlador.
     ```
   - ✅ Bien (1 línea):
     ```
     - [x] CRUD completo de Citas: entidad, repositorio, servicio y controlador.
     ```

3. **Eliminar detalles de implementación internos**: No incluir nombres de clases CSS, breakpoints específicos, nombres de props de componentes ni tamaños en píxeles. Esos detalles están en el código.
   - ❌ Mal: `Altura fija escalonada (420px mobile, 340px tablet, 400px lg, 460px xl) con object-cover`
   - ✅ Bien: `Carrusel unificado split 75/25, altura fija responsiva por breakpoint`

4. **No incluir rutas de archivos**: Las rutas están en el código fuente. Solo mencionar nombres de componentes clave sin path.
   - ❌ Mal: `Extraído al componente [ModalReprogramarCita.jsx](./huesitos-frontend/src/componentes/cita/ModalReprogramarCita.jsx)`
   - ✅ Bien: `Modal de reprogramación extraído a componente independiente`

5. **No repetir "Validada la compilación"**: La compilación exitosa es implícita si el logro está marcado como completado `[x]`.

6. **Decisiones Clave compactas**: Máximo 1 línea por decisión. Solo registrar decisiones que impacten a futuro, no las triviales.

7. **Estado Actual breve**: Máximo 3 líneas (una por capa: backend, frontend, base de datos).

### Proceso de compresión al actualizar

1. Contar las líneas actuales del archivo.
2. Si `líneas + nuevos logros > 120`:
   - Fusionar logros granulares dentro de cada módulo.
   - Eliminar detalles de implementación (rutas, CSS, píxeles).
   - Consolidar decisiones redundantes.
3. Agregar los nuevos logros en el módulo correspondiente.
4. Verificar que el resultado final sea ≤ 120 líneas.

### Módulos estándar para agrupar
Usar estos encabezados (crear nuevos solo si no encajan):
- `Autenticación y Seguridad`
- `Usuarios y Perfiles`
- `Mascotas`
- `Citas y Agenda`
- `Módulo Clínico`
- `Transacciones y Finanzas`
- `Inventario y Tienda`
- `Marketing`
- `Dashboard y Analíticas`
- `Configuración Global`
- `Arquitectura Frontend`
- `Git y Despliegue`
