---
trigger: always_on
description: Reglas y estándares del frontend, incluyendo componentes funcionales en React y estilos responsivos con Tailwind CSS.
---

# Reglas de Desarrollo Frontend (Huesitos)

## Estilos y Componentes (Frontend)
- **Componentes React**: Crear componentes funcionales modulares utilizando sintaxis de funciones flecha (`const MiComponente = () => {}`).
- **Estilos responsivos**: Usar exclusivamente clases utilitarias de Tailwind CSS asegurando un diseño adaptativo (móvil primero).
- **Abstracción de Estilos**:
  - **Componentes Reutilizables**: Extraer elementos repetitivos de interfaz (botones, inputs, campos de formulario) en componentes funcionales de React para evitar la duplicación de clases de Tailwind.
  - **Uso de @apply**: Permitido el uso de la directiva `@apply` de Tailwind CSS dentro de `index.css` para abstraer clases utilitarias largas en nombres semánticos de clase (ej. `.auth-container`, `.auth-panel-left`), manteniendo el JSX limpio y legible.

## Idioma y Nomenclatura
- **Nombres en Español**: Todos los nombres de archivos de páginas, componentes, variables, funciones y rutas en la medida de lo posible deben nombrarse en español (ej. usar `IniciarSesion.jsx` en lugar de `Login.jsx`).
- **Contenido e Interfaz**: Todo el contenido textual, etiquetas de campos, mensajes y elementos visuales para el usuario final deben estar redactados en español.