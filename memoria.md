# Memoria de Desarrollo - Huesitos

Última actualización: 2026-06-15 (Desacoplamiento de panel de cliente y optimización de tema oscuro)

## 🚀 Logros por Módulo

### Autenticación y Seguridad
- [x] Flujo completo: registro, login JWT, recuperación, restablecimiento y cambio de contraseña (mín. 6 chars).
- [x] Spring Security + CORS + JWT. Filtro de autenticación y protección de rutas por rol.
- [x] DTOs y endpoints de gestión de roles (Admin).
- [x] Subcomponentes de autenticación desacoplados con diseño responsivo y fixed-height en desktop.
- [x] Alternador de tema corregido (Luna/Sol).

### Usuarios y Perfiles
- [x] CRUD completo de usuarios por rol (Admin/Personal) con confirmación segura para promover a administrador.
- [x] Subida y compresión de fotos a WebP (75% calidad) con limpieza de disco y bloqueo concurrente.
- [x] Desacoplamiento de modales de usuario a componentes independientes en vista de gestión.

### Mascotas
- [x] Entidad Mascota con @JsonAlias para compatibilidad UTF-8/ASCII y CRUD completo.

### Citas y Agenda
- [x] Entidad Cita con estados avanzados, validación dinámica de horarios y prevención de cruces.
- [x] AgendaSemanal compartida, modales de reprogramación y configuración de horarios del personal.
- [x] Agendamiento web interactivo en 4 pasos para clientes.

### Módulo Clínico
- [x] Entidades clínicas y ciclo: consulta médica -> cita completada -> historial.
- [x] Recetas PDF premium en A5 y subida genérica de archivos médicos.
- [x] Dashboard de veterinario con agenda, KPIs y consulta activa.
- [x] MascotaHistorialTimeline reutilizable con descarga de recetas.

### Transacciones y Finanzas
- [x] Órdenes de pago automáticas y pago presencial en caja POS con vuelto.
- [x] Emisión de boletas PDF en tamaño A5.
- [x] Dashboard financiero y reportes consolidados para el administrador.

### Inventario y Tienda
- [x] CRUD de inventario FEFO con alertas de stock mínimo y vencimiento.
- [x] Tienda online para clientes con catálogo, buscador, carrito y checkout FEFO.
- [x] Gestión de pedidos y despachos compartida (Admin/Recepcionista).
- [x] InventarioCriticoWidget con paginación de 5 items/página.

### Marketing
- [x] CRUD de campañas, ofertas, desparasitación y recordatorios automáticos (@Scheduled).
- [x] Doble lógica: desactivación lógica y eliminación física irreversible con integridad referencial.
- [x] Rutas separadas para campañas (salud) y ofertas (farmacia) en BarraLateral.
- [x] Desacoplamiento: registrar campañas con buscador y registrar ofertas por categoría.
- [x] Carrusel de campañas unificado 75/25 responsivo y optimizado.
- [x] Descripción de campaña ampliada a 500 chars con contador reactivo.

### Dashboard y Analíticas
- [x] Tablero de analíticas con widget de auditoría del sistema paginado.

### Configuración Global
- [x] Configuración dinámica del negocio (información, contacto, finanzas) con carga optimizada.

### Arquitectura Frontend
- [x] PlantillaTablero y BarraLateral dinámica unificada para todos los roles con colores adaptativos.
- [x] Tema oscuro semántico premium (darkMode class, slate #0B1A30, ContextoTema reactivo).
- [x] Componentes reutilizables: Paginacion, Combobox compacto y spinners de carga.
- [x] Desacoplamiento de ClienteInicio en componentes atómicos: CarruselCampanas, TarjetasMascotasCliente y TablaCitasProximas con soporte de tema claro/oscuro.

### Git y Despliegue
- [x] Rama develop creada y publicada como base para nuevas características.

## 📌 Estado Actual
- **Backend**: Spring Boot 4 / Java 26 con lógica modularizada y APIs REST protegidas por JWT.
- **Frontend**: React 18 / Vite / Tailwind 3.4 con vistas responsivas para los 4 roles.
- **Base de Datos**: MySQL 8.4 con auto-generación de esquema por Hibernate.

## 🛠️ Próximos Pasos
- Pruebas de flujo completo en portal del cliente.
- Evaluar desacoplamiento de formularios restantes en páginas independientes.

## 🧠 Decisiones Clave
- **Inyección de dependencias**: Constructor estándar Lombok (@RequiredArgsConstructor).
- **Cita y Transaccion**: Permisión de campos nulables para asignación y pagos pendientes en la web.
- **Horarios flexibles**: Sin restricciones si no hay horario; verificación estricta con exclusión de la propia cita en reprogramación.
- **Eliminación de fotos**: Borrado físico de la foto vieja del disco al subir una nueva para optimizar almacenamiento.
