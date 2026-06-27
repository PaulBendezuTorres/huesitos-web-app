# Memoria de Desarrollo - Huesitos

Última actualización: 2026-06-24 (Optimización de flujo de citas, sesión activa y Mercado Pago local)

## 🚀 Logros por Módulo

### Autenticación y Seguridad
- [x] Flujo completo: registro, login JWT, recuperación/restablecimiento de contraseña, cambio de contraseña con validación de actual (mín. 6 chars).
- [x] Spring Security + CORS + JWT. Filtro `FiltroAutenticacionJwt`, protección de rutas por rol en `SeguridadConfig.java`.
- [x] DTOs: `RespuestaLogin` (incluye foto perfil), `SolicitudCambioRol`. Endpoint `PUT /api/usuarios/{id}/rol`.
- [x] Modularización frontend: subcomponentes atómicos (`ContenedorAutenticacion`, `CampoFormulario`, `CasillerosCodigo`, `PanelIzquierdoAutenticacion`, `BotonVolver`).
- [x] Card de auth con altura fija 600px en desktop, scroll interno, responsividad completa en móvil (contenido decorativo oculto en breakpoints pequeños).
- [x] Alternador de tema corregido: Luna en modo oscuro, Sol en modo claro.
- [x] Redirección automática de sesión activa en Login al navegar hacia atrás.

### Usuarios y Perfiles
- [x] CRUD completo: creación segura de Veterinarios/Recepcionistas por Admin, activación/desactivación, listado por rol.
- [x] Validación de seguridad: confirmación con contraseña de admin para promover a rol `ADMINISTRADOR`.
- [x] Subida y compresión de fotos a WebP (75% calidad, canal alfa para PNG). Limpieza de disco al cambiar imagen. Bloqueo de subidas concurrentes con spinner.
- [x] Sincronización de avatar en Header/Sidebar en tiempo real via eventos `storage`.
- [x] Desacoplamiento frontend: modales extraídos a `ModalCrearPersonal`, `ModalDetallesUsuario`, `ModalEliminarUsuario` en `src/componentes/usuario/`. `PaginaUsuarios` reducida de 593 a 250 líneas.

### Mascotas
- [x] Entidad `Mascota` con `@JsonAlias({"dueño", "dueno"})` para compatibilidad UTF-8/ASCII.
- [x] CRUD completo: `MascotaRepositorio`, `MascotaServicio`, `MascotaControlador`. QA completado.
- [x] Nueva página física `RegistrarMascotaCliente.jsx` (`/cliente/mascotas/nueva`) desacoplada con el subcomponente `FormularioRegistroMascota.jsx` estructurado en 4 cuadrantes independientes (grilla de 2 columnas), alineado a la izquierda (`w-full`), con subida de fotos (máximo 2 MB), previsualización interactiva y límite de 350 caracteres con contador en tiempo real para las alertas médicas.
- [x] Resuelta la redundancia visual de los botones "Actualizar" y "Registrar mascota" en la cabecera cuando la lista de mascotas del cliente está vacía (ahora solo se muestra el botón central del estado vacío).

### Citas y Agenda
- [x] Entidad `Cita` con estados: `PENDIENTE`, `CONFIRMADA`, `COMPLETADA`, `CANCELADA`, `EN_ESPERA`.
- [x] Validación dinámica de horarios de atención, verificación de cruces de horario (excluyendo cita actual en reprogramación).
- [x] Endpoints: agendar, cancelar, check-in, reprogramar, filtros avanzados (`GET /api/citas/agenda`).
- [x] Horarios del personal: entidad `HorarioPersonal`, inicialización automática de jornada estándar (domingos libres).
- [x] Frontend: `AgendaSemanal` compartida (Admin/Recepcionista), `ModalReprogramarCita` modular, filtros con `<Combobox compacto>`, `ConfiguracionHorarios` con switches por día y excepciones.
- [x] `ClienteAgendarCita` interactivo en 4 pasos (Mascota → Servicio → Profesional → Horario/Fecha).
- [x] Desacoplamiento: `ListaPersonalClinica` extraído con avatares gradiente, badges por rol, buscador integrado.
- [x] Endpoint público de veterinarios para resolver error 403 de clientes al agendar.
- [x] Integración de descuentos de campañas en reserva de citas (en cascada hasta el total y transacción).
- [x] Flujo de pago inmediato en la línea de reserva: opciones de "Pagar en clínica" y "Pagar en línea con Mercado Pago".
- [x] Rediseño de paso de horario con placeholder y mensaje de instrucción dinámico.
- [x] Límite de 2 citas activas (PENDIENTE, CONFIRMADA, EN_ESPERA) por cliente en backend para evitar abuso y spam del botón "Pagar en clínica".
- [x] Botón de cancelación de citas pendientes en el panel del cliente, integrado con el componente ModalConfirmacion y recarga de datos reactiva.
- [x] Selector de horarios en el agendamiento del cliente rediseñado de forma premium con agrupación por turnos (Turno Mañana y Turno Tarde) con iconos Sol y Atardecer.
- [x] Cancelación automática de citas expiradas (por inasistencia): tarea programada cada 15 minutos en `TareaProgramadaServicio.java` que detecta citas en estado `PENDIENTE` o `CONFIRMADA` cuya hora programada ya pasó, actualizando su estado a `CANCELADA` para liberar la disponibilidad.
- [x] Configuración de horario de almuerzo/comida para veterinarios: campos `horaAlmuerzoInicio` y `horaAlmuerzoFin` en `HorarioPersonal` (backend + frontend en `ConfiguracionHorarios.jsx`) con validación al agendar/reprogramar citas para evitar solapamientos con el descanso del profesional.
- [x] Rediseño premium de la Agenda Semanal del Administrador: adaptación del layout a pantalla completa (`h-[calc(100vh-140px)]`), scroll vertical independiente por columna de día para evitar desbordes globales y tarjetas de citas estilizadas con bordes izquierdos coloreados por estado.

### Módulo Clínico (Consultas, Vacunas, Recetas, Archivos)
- [x] Entidades: `ConsultaMedica`, `Servicio`, `Vacuna`, `HistorialVacunacion`, `Receta`, `ArchivoClinico` + enum `TipoArchivoClinico`.
- [x] Ciclo completo: registro de consulta → actualización automática de cita a `COMPLETADA` → historial por mascota.
- [x] Recetas PDF (formato A5 premium con OpenPDF). Subida genérica de archivos médicos en `uploads/clinicos/`.
- [x] Frontend veterinario: `VeterinarioDashboard` (sidebar clásico, agenda diaria con KPIs, consulta activa con sub-pestañas), `VeterinarioAgenda`, `ConsultaActiva`.
- [x] `MascotaHistorialTimeline` reutilizable: timeline premium con buscador, filtros y descarga de recetas PDF.
- [x] `ModalEditarServicio` modular extraído de `PaginaServicios`.

### Transacciones y Finanzas
- [x] Entidad `Transaccion` con enums `MedioPago`, `EstadoPago`. Campo `medioPago` nullable para estado `PENDIENTE`.
- [x] Creación automática de órdenes de pago al agendar citas. Pago presencial en caja.
- [x] `BoletaPdfServicio`: boletas PDF tamaño A5. Endpoint `GET /api/pagos/{id}/boleta`.
- [x] `ReporteFinanciero` DTO con estadísticas diarias/mensuales/globales. Endpoint `GET /reporte` (admin).
- [x] Frontend: `CajaPOS` táctil con cálculo de vuelto, descarga/impresión de boleta. `TablaTransacciones` modular con paginación. `PaginaFinanzas` simplificada.
- [x] Integración de Mercado Pago (Checkout Pro) para el pago en línea de citas pendientes con redirección a Sandbox y webhook `/api/pagos/webhook` asíncrono para cambiar el estado a `APROBADO` en base de datos.
- [x] Frontend: Botón de pago en listado de próximas citas, consulta asíncrona de transacciones y página de retorno `/cliente/citas/retorno-pago` responsiva y compatible con modo oscuro.
- [x] Robustecimiento de preferencia de Mercado Pago omitiendo URL de notificación en local (previene error 400).
- [x] Corrección de generación de preferencias de pago con Mercado Pago usando carga ávida (Fetch Join) de Cita y Servicio en el repositorio de Transacciones.
- [x] Integración de la pasarela PagoEfectivo (código CIP) en backend y frontend con modo de simulación local para agilizar pruebas en desarrollo.

### Inventario y Tienda
- [x] Entidades: `Categoria`, `Producto` (con `stockMinimo`, foto WebP), `Inventario` (lotes stock/vencimiento FEFO).
- [x] CRUD completo con alertas de bajo stock y vencimientos. Búsqueda pública de catálogo.
- [x] Límite de 350 chars en descripción de producto (frontend + backend).
- [x] Frontend: `PaginaInventario` modular (`TarjetasAlertasInventario`, `TablaInventario`, `ModalIngresoLote`, `ModalAjusteStockLote`). `RegistrarProductoNuevo` como página dedicada (ancho completo). `ModalCrearCategoria` independiente. Paginación con `<Paginacion />`. Filtro de categorías con `<Combobox compacto>`. Tema oscuro corregido.
- [x] Tienda online: entidades `CarritoItem`, `Pedido`, `DetallePedido`. Checkout atómico con deducción FEFO. `ClienteTienda` con catálogo, buscador, carrito drawer.
- [x] Gestión de pedidos: `GestionPedidos` compartida (Admin/Recepcionista) con `ListaPedidosDespacho` y `DetallePedidoDespacho` modulares. Paginación de 6 pedidos/página.
- [x] `InventarioCriticoWidget` reutilizable con paginación (5 items/página). Término "FEFO" eliminado de la UI.

### Marketing (Campañas y Ofertas)
- [x] Entidades: `Campana` (con `precioPromocional`, relación Many-to-Many con `Servicio`, banner WebP hasta 10MB), `Oferta`, `Desparasitacion`, `Recordatorio`.
- [x] `CampanaOfertaServicio`: CRUDs, auto-cálculos de descuento, inactivación de expirados. `TareaProgramadaServicio` con `@Scheduled` para recordatorios automáticos.
- [x] Doble lógica: desactivación lógica (icono `Power`) + eliminación física irreversible (icono `Trash2` rojo) con `desvincularCampana` para claves foráneas.
- [x] Separación de rutas: `/admin/campanas` (salud) y `/admin/ofertas` (farmacia) con menú independiente en `BarraLateral`.
- [x] Desacoplamiento: `ListaCampanasPublicitarias`, `ListaOfertasProductos`, `RegistrarCampana` (con buscador Combobox + panel de servicios + resumen financiero reactivo), `RegistrarOferta` (con descuento por categoría completa vía `POST /api/ofertas/categoria`).
- [x] Carrusel en `ClienteInicio`: diseño unificado split 75% imagen / 25% panel info desde `md` (tablet y desktop). Altura fija escalonada (420px mobile, 340px tablet, 400px lg, 460px xl) con `object-cover` para consistencia entre imágenes. En mobile: columna vertical. Badge simplificado a "Campaña" (sin "Activa").
- [x] Descripción de campaña ampliada a 500 chars con contador en tiempo real.
- [x] Límite de un único uso de campañas promocionales por cliente, validado en backend al crear transacciones y filtrado en frontend en el mapeo de servicios.
- [x] Redirección correcta del botón "Adquiere tu Promo" en el carrusel de campañas a `/cliente/citas` con preselección del servicio de la promoción.

### Dashboard y Analíticas
- [x] `TableroAnaliticas` con `AuditoriaSistema` modular (paginación configurable 5/10/15/20 filas).
- [x] `InventarioCriticoWidget` renombrado (sin "FEFO") con paginación integrada (5 items/página) en ambas columnas.

### Configuración Global
- [x] `ConfiguracionDinamica` con subcomponentes: `FormularioInfoNegocio`, `FormularioContacto`, `FormularioFinanciero`.
- [x] API `configuracionApi.js` con envío condicional de JWT. Esqueleto de carga para eliminar parpadeo. Interfaz de fallo de conexión con "Reintentar Carga".
- [x] `ConfiguracionRolControlador` con endpoints por rol.
- [x] Migración de almacenamiento local a Cloudinary en backend para fotos de perfil, mascotas, productos, campañas y archivos clínicos.
- [x] Eliminación de credenciales hardcodeadas de Mercado Pago y del correo SMTP por defecto en application.properties, delegándolos al archivo .env.
- [x] Implementación de cargador automático de archivo .env en HuesitosBackendApplication.java para resolver variables en local sin necesidad de dependencias adicionales de terceros.

### Arquitectura Frontend Compartida
- [x] `PlantillaTablero`: estructura unificada responsiva (sidebar drawer, overlay, header hamburguesa, badge perfil).
- [x] `BarraLateral` dinámica unificada para todos los roles (Admin/Vet/Recepcionista/Cliente). Colores adaptativos (emerald para vet, sky para resto).
- [x] Portales migrados: `TableroAdministrador`, `TableroCliente`, `TableroVeterinario` y `TableroRecepcionista` usan `PlantillaTablero`.
- [x] `Portada` modularizada en componentes autónomos (Hero, Nosotros, Servicios, etc.). Menú hamburguesa funcional, CTAs, tipografía responsiva.
- [x] Tema oscuro semántico: `darkMode: 'class'`, paleta `slate` premium, color base `#0B1A30`. `ContextoTema` global reactivo.
- [x] Componente `<Paginacion />` reutilizable. `<Combobox />` con modo compacto e iconos customizados.
- [x] Spinners de carga en vistas financieras y clínicas.
- [x] Corrección de desbordamientos en headers/celdas de tablas. Responsividad consistente en todos los tableros.
- [x] Desacoplamiento de `ClienteInicio` en componentes atómicos (`CarruselCampanas`, `TarjetasMascotasCliente` y `TablaCitasProximas`) con soporte adaptativo completo de tema claro y oscuro.
- [x] Migración de subvistas del portal de clientes a rutas físicas reales de React Router (`/cliente/*`), garantizando la persistencia tras recargas (F5).
- [x] Incorporación de reglas de Maquetación y Layout General en `frontend.md` para alinear el panel a la izquierda ocupando todo el ancho (`w-full`).
- [x] Componente `Combobox.jsx` optimizado y accesible con soporte completo de navegación por teclado.
- [x] Helper `imagenServicio` para formatear URLs dinámicas permitiendo compatibilidad entre Cloudinary (absoluto) y local (relativo).

### Renombrado y Organización
- [x] Frontend renombrado a español: `components` → `componentes`, `pages` → `paginas`, `services` → `servicios`, `Modules` → `modulos`. Script automático de refactorización ejecutado.
- [x] Módulos clínicos y POS en carpetas `modulos/recepcionista/pages` y `modulos/veterinario/pages`.

### Git y Despliegue
- [x] Rama `develop` creada y publicada. Feature branches desde `develop`. Merge `develop` → `main` validado.

## 📌 Estado Actual
- **Backend (Spring Boot 4 / Java 26)**: Integración con Cloudinary finalizada y compilación exitosa. Todos los módulos implementados y validados: Autenticación JWT, Mascotas, Citas (con reprogramación/check-in), Servicios, Transacciones/Boletas PDF, Consultas Clínicas, Vacunas/Recetas, Archivos Clínicos, Inventario FEFO, Tienda Online/Pedidos, Marketing/Campañas, Horarios de Personal, Perfiles/Fotos WebP, Configuración por Rol, Tareas Programadas.
- **Frontend (React 18 / Vite / Tailwind 3.4)**: Todas las vistas de los 4 roles implementadas y modularizadas. Tema oscuro completo. Responsividad validada. Compilación de producción sin errores.
- **Base de Datos (MySQL 8.4)**: Hibernate auto-genera todas las tablas al iniciar.

## 🛠️ Próximos Pasos
- Pruebas de flujo completo (registro de producto con foto, creación de categoría rápida, navegación paginada).
- Evaluar desacoplamiento de formularios restantes en páginas independientes.

## 🧠 Decisiones Clave
- **Inyección de dependencias**: Constructor estándar Java en componentes de seguridad (compatibilidad Maven).
- **`@JsonAlias`**: Resuelve deserialización con caracteres Unicode (ñ) desde distintas codificaciones.
- **`Cita.veterinario`**: nullable para agendamiento web sin veterinario asignado.
- **`Transaccion.medioPago`**: nullable para órdenes de pago `PENDIENTE`.
- **Emergencia 24h**: Solo botón de llamada/WhatsApp (sin agendamiento transaccional).
- **Principios SOLID + MVC**: Estricta separación de capas en todo el backend.
- **Diseño tablet-first**: Endpoints optimizados para uso táctil rápido (Recepcionista/Veterinario).
- **Horarios flexibles**: Sin horario registrado = sin restricciones; con horario = validación estricta.
- **Reprogramación**: Verificación de cruces excluyendo la propia cita para evitar falsos positivos.
- **Tema oscuro**: `darkMode: 'class'` + paleta `slate` premium + base `#0B1A30`.
- **Modularización**: Formularios complejos migrados a páginas independientes en vez de modales.
- **Fotos**: WebP 75%, eliminación automática de imagen anterior, canal alfa para PNG.
- **Cloudinary**: Integración de SDK oficial para prevenir almacenamiento local efímero y transformaciones automáticas de imágenes en la nube.
- **Commits granulares**: División detallada por fase desde Fase 11A.
- **Límite de memoria**: Ampliado a 240 líneas por indicación del usuario, con compresión ejecutada únicamente bajo demanda explícita.
- **Mercado Pago (Preferencia)**: Uso de carga ávida (`FETCH JOIN` de `Cita` y `Servicio`) en `TransaccionRepositorio` para evitar excepciones de inicialización perezosa de Hibernate (`LazyInitializationException`) en hilos fuera de sesión.
- **PagoEfectivo (CIP)**: Incorporación de un modo de simulación local en desarrollo (CIP aleatorio de 8 dígitos) que permite probar el flujo completo de agendamiento y webhook de aprobación sin bloqueos de credenciales de pasarela.

