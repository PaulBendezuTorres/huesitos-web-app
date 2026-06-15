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
  * indicador de carga y procesos asíncronos -> `<CargadorSpinner />`
- **Cargas y Prevención de Layout Shift (CargadorSpinner)**: En todas las operaciones de carga asíncrona desde el backend/base de datos, se debe utilizar obligatoriamente el componente `<CargadorSpinner />` de Huesitos. Para evitar saltos visuales y encogimientos de pantalla (Layout Shift):
  * Mantener siempre visibles y fijas las cabeceras/headers principales de la sección.
  * Colocar el spinner en el área de contenido específico debajo de la cabecera.
  * Definir una altura mínima estable para el contenedor del spinner (ej. `min-h-[400px]` o `min-h-[50vh]`) de modo que la pantalla no colapse de golpe mientras se espera la respuesta.
- **Micro-interacciones y Hover**: Todos los botones deben incorporar micro-interacciones interactivas, como cambios de escala en el click (`active:scale-95`), sombras dinámicas (`shadow-sky-500/20`) y transiciones suaves (`transition-all duration-200`).

## Nomenclatura e Idioma
- **Nombres en Español**: Los nombres de archivos, componentes, funciones, variables y subrutas web deben escribirse preferentemente en español (ej. usar `PaginaServicios.jsx` en lugar de `ServicesPage.jsx`, y la ruta `/admin/clientes` en lugar de `/admin/owners`).

## Paleta y Soporte de Temas (Claro/Oscuro)
- **Modo Oscuro Semántico**: Para el tema oscuro, utilizar obligatoriamente las clases semánticas personalizadas definidas en `tailwind.config.js` para mantener una paleta coherente de azul marino profundo:
  * Fondo base general -> `dark:bg-oscuro-base` (color `#0B1A30`)
  * Fondo secundario (secciones alternas) -> `dark:bg-oscuro-secundario` (color `#102442`)
  * Tarjetas, modales, campos de input y menús -> `dark:bg-oscuro-tarjeta` (color `#152E54`)
  * Bordes y líneas divisoras -> `dark:border-oscuro-borde` (color `#1D3E70`)
- **Legibilidad de Texto**: Asegurar el contraste de los textos sobre fondos marinos. Usar `dark:text-slate-100` para títulos principales, `dark:text-slate-300` para descripciones generales y evitar el uso de clases no estándar o inventadas (como `slate-355` o `slate-655`).

## Modularización y Estructura por Características
- **Estructura Atómica de Componentes**: Separar las páginas y flujos complejos en subcomponentes atómicos e independientes ubicados en subdirectorios por feature (ej. `/src/componentes/portada/`, `/src/componentes/autenticacion/`) para evitar archivos gigantes.
- **Uso de Alias de Ruta**: Emplear siempre el alias `@` configurado para la carpeta `/src` (ej. `import BotonVolver from '@/componentes/autenticacion/BotonVolver'`) para evitar rutas relativas largas y confusas.
- **Desacoplamiento de Lógica**: Desacoplar la lógica de negocio y las llamadas de API de las vistas de presentación, centralizando llamadas de API en helpers específicos (`src/servicios/`).

## Maquetación y Layout General
- **Alineación a la Izquierda (Estética Paul)**: Las vistas del panel, páginas completas y formularios de registro deben alinearse a la izquierda ocupando todo el ancho disponible (`w-full`). Queda estrictamente prohibido centrar o limitar estrechamente el ancho del contenido principal (evitar `max-w-2xl mx-auto` para contenedores de página), garantizando que todo el frontend mantenga una maquetación ancha, fluida y homogénea.
