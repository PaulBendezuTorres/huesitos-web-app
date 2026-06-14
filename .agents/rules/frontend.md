# Reglas de Desarrollo Frontend (Huesitos)

## Arquitectura y Enrutamiento (React Router)
- **Rutas Anidadas (Nested Routes)**: Para separar vistas lógicas principales o de gestión (ej. listado vs. formulario de registro), utilizar rutas y subrutas físicas de React Router (ej. `/admin/servicios` y `/admin/servicios/registrar`) en lugar de estados locales de visibilidad (`mostrarTabla`, `vistaActual`, etc.). Esto asegura URLs semánticas y la persistencia del estado al recargar la página (F5).
- **Sincronización del Sidebar**: Sincronizar el estado activo de la barra lateral u otros menús de navegación leyendo directamente la URL actual con `useLocation()` en lugar de mutar un estado local global en la plantilla del tablero.
- **Transición y Animaciones**: Toda carga de página y cambio de subvista debe incorporar animaciones de entrada fluidas usando las clases de Tailwind CSS (ej. `animate-in fade-in duration-300`).

## Componentes Premium Reutilizables
- **Uso Obligatorio de Componentes del Sistema**: Está prohibido el uso de elementos HTML nativos o inputs sin estilizar. Utilizar siempre las abstracciones premium del proyecto:
  * inputs de selección y autocompletado -> `<Combobox />`
  * áreas de texto con límite y contador -> `<AreaTexto />`
  * fotos de perfil o iconos de avatar -> `<Avatar />`
  * botones interactivos -> `<Boton />`
  * confirmación de acciones destructivas -> `<ModalConfirmacion />`
  * controles de tablas -> `<Paginacion />`
- **Micro-interacciones y Hover**: Todos los botones deben incorporar micro-interacciones interactivas, como cambios de escala en el click (`active:scale-95`), sombras dinámicas (`shadow-sky-500/20`) y transiciones suaves (`transition-all duration-200`).

## Nomenclatura e Idioma
- **Nombres en Español**: Los nombres de archivos, componentes, funciones, variables y subrutas web deben escribirse preferentemente en español (ej. usar `PaginaServicios.jsx` en lugar de `ServicesPage.jsx`, y la ruta `/admin/clientes` en lugar de `/admin/owners`).
