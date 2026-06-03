# Memoria de Desarrollo - Huesitos

Última actualización: 2026-05-24 (Fase 10B de backend - Alertas de Insumos y Control de Vencimientos implementada con éxito)

## 🚀 Logros Recientes
- [x] Rama `develop` creada y publicada en GitHub.
- [x] Nueva rama de características `feature/configuracion-base-backend` creada.
- [x] Base de datos MySQL `huesitos` creada localmente.
- [x] Configurada la conexión MySQL local y dialecto Hibernate en el backend.
- [x] Implementada la arquitectura de seguridad basada en Spring Security, CORS y tokens JWT.
- [x] Compilación y construcción del backend verificada con éxito (`BUILD SUCCESS`).
- [x] Creados el enumerador `Rol` y la entidad JPA `Usuario` en `huesitos_backend.entidades`.
- [x] Creados la entidad `Dueño` y los repositorios `UsuarioRepositorio` y `DueñoRepositorio`.
- [x] Creada la clase `AutenticacionServicio` con la lógica de registro de clientes.
- [x] Creada la clase `AutenticacionControlador` con el endpoint de registro de clientes.
- [x] Creado el DTO `RespuestaLogin` e implementado el endpoint de inicio de sesión (`POST /login`) con generación de token JWT y retorno de rol del usuario.
- [x] Creado el DTO `SolicitudCambioRol`, modificado `AutenticacionServicio` y creado `UsuarioControlador` para el endpoint de cambio de rol (`PUT /api/usuarios/{id}/rol`).
- [x] Creado `FiltroAutenticacionJwt` y configurada la protección de rutas basada en roles en `SeguridadConfig.java`.
- [x] Rama de características `feature/configuracion-base-backend` fusionada en `develop` y subida a GitHub (`origin/develop`).
- [x] Creada la clase entidad JPA `Mascota` bajo el paquete `huesitos_backend.entidades` y su mapeo de relación con `Dueño`.
- [x] Agregada anotación `@JsonAlias({"dueño", "dueno"})` en `Mascota` para compatibilidad de codificación UTF-8/ASCII.
- [x] Creados la interfaz `MascotaRepositorio` y el servicio `MascotaServicio` con validaciones y lógica de negocio.
- [x] Creada la clase `MascotaControlador` exponiendo los endpoints REST de registro, búsqueda y listado.
- [x] Sesión de pruebas QA Fase 2 completada exitosamente (login JWT, registro de mascota, validación de dueño inexistente, listado por dueño).
- [x] Creado el enum `EstadoCita` con valores: `PENDIENTE`, `CONFIRMADA`, `COMPLETADA`, `CANCELADA`.
- [x] Creada la entidad JPA `Cita` mapeada a la tabla `citas` con relaciones `@ManyToOne` a `Mascota` (obligatoria) y `Usuario` como veterinario (opcional).
- [x] Creada la interfaz `CitaRepositorio` con métodos para verificar cruces de horario y listar citas por rango de fechas.
- [x] Creado `CitaServicio` con lógica de agendamiento (validación de mascota, veterinario, disponibilidad horaria), cambio de estado y listado diario.
- [x] Creado `CitaControlador` con endpoints `POST /api/citas`, `PUT /api/citas/{id}/estado` y `GET /api/citas/calendario?fecha=`.
- [x] Creada la entidad JPA `ConsultaMedica` en `huesitos_backend.entidades` mapeada a la tabla `consultas_medicas`.
- [x] Creada la entidad JPA `Servicio` en `huesitos_backend.entidades` mapeada a la tabla `servicios` con atributos de catálogo.
- [x] Creados los enums `MedioPago` y `EstadoPago`, y la entidad JPA `Transaccion` en `huesitos_backend.entidades` mapeada a la tabla `transacciones` con relación OneToOne a Cita.
- [x] Integrado el catálogo de Servicios en Citas: creado `ServicioRepositorio`, reemplazado el campo `motivo` en la entidad `Cita` por una relación obligatoria `@ManyToOne` hacia `Servicio`, y actualizada la validación en `CitaServicio` al agendar citas.
- [x] Creados `TransaccionRepositorio` y `TransaccionServicio` con métodos para crear órdenes de pago automáticas y registrar pagos presenciales cambiando estados de citas a `CONFIRMADA`.
- [x] Creado `TransaccionControlador` con endpoints para procesar compras web (webhook simulado) y pagos presenciales en caja, y configurada la creación automática de órdenes de pago al agendar citas en `CitaServicio`.
- [x] Creados `ServicioServicio.java` y `ServicioControlador.java` para la gestión (registro, listado de activos y desactivación lógica) del catálogo de servicios veterinarios, y configurada la ruta GET como pública en `SeguridadConfig.java`.
- [x] Creados `ConsultaMedicaRepositorio.java`, `ConsultaMedicaServicio.java` y `ConsultaMedicaControlador.java` para completar el ciclo del módulo clínico (registro de consultas con actualización automática a COMPLETADA de la cita asociada, y consulta de historial por mascota).
- [x] Corregida la restricción de base de datos en `Transaccion.java` estableciendo `medio_pago` como `nullable = true` para permitir registrar transacciones en estado `PENDIENTE`.
- [x] Sesión de pruebas de integración y QA manual completada con éxito vía Postman para todo el flujo clínico-financiero (registro, login JWT, servicios, mascotas, agendamiento de cita, orden de pago en caja, registro de consulta y consulta de historial clínico).
- [x] Creado `PerfilControlador.java` exponiendo endpoints para subir y comprimir fotos de perfil de usuarios (`POST /api/perfiles/usuario/{id}/foto`) y de mascotas (`POST /api/perfiles/mascota/{id}/foto`).
- [x] Modificado `AutenticacionControlador.java` para inyectar `AutenticacionAvanzadaServicio` y añadir endpoints públicos de restablecimiento de contraseña (`/olvide-contrasena` y `/restablecer-contrasena`).
- [x] Creado `ConfiguracionRolControlador.java` exponiendo endpoints para consultar configuraciones por rol (`GET /api/configuraciones/rol/{rol}`) y para registrar/actualizar configuraciones de forma segura (`POST /api/configuraciones`).
- [x] Configurado `SeguridadConfig.java` permitiendo acceso público a los endpoints de restablecimiento de contraseña en Spring Security.
- [x] Creados endpoints y métodos para la activación, desactivación y listado de usuarios por Rol (Fase 6).
- [x] Implementado endpoint de creación segura de Veterinarios y Recepcionistas por parte del Administrador (Fase 6).
- [x] Creada la entidad JPA `HorarioPersonal`, repositorio y servicios de gestión y configuración de horarios (Fase 6).
- [x] Agregada inicialización automática de horarios semanales por defecto (jornada estándar y domingos libres) al registrar nuevo personal (Fase 6).
- [x] Refinadas reglas de acceso en `SeguridadConfig.java` permitiendo que el personal autenticado consulte su propio horario y restringiendo la edición al Administrador (Fase 6).
- [x] Agregada la dependencia `openpdf` para permitir la generación y descarga de recetas en formato PDF (Fase 7).
- [x] Creadas las entidades `Vacuna` e `HistorialVacunacion` con repositorios, servicios y controladores para gestionar el catálogo e historial de vacunación de mascotas (Fase 7).
- [x] Creada la entidad `Receta` con el servicio `RecetaServicio` implementando la generación de PDF (con formato A5 premium, datos del veterinario, mascota y propietario) y endpoints de consulta y descarga (Fase 7).
- [x] Modificado `StorageService` para admitir subidas genéricas de archivos médicos en la subcarpeta `uploads/clinicos/` (Fase 7).
- [x] Creada la entidad `ArchivoClinico` y enum `TipoArchivoClinico` con endpoints para la subida y consulta de archivos asociados a mascotas y consultas (Fase 7).
- [x] Refinadas reglas de seguridad en `SeguridadConfig` permitiendo la consulta clínica a usuarios autenticados y restringiendo la subida y edición de recetas, vacunas y archivos a los roles `VETERINARIO` y `ADMINISTRADOR` (Fase 7).
- [x] Agregado el estado `EN_ESPERA` al enumerador `EstadoCita` para soportar la sala de espera de la clínica (Fase 8A).
- [x] Creado record DTO `SolicitudReprogramacion` para transferir nueva fecha/hora al reprogramar citas (Fase 8A).
- [x] Modificado `CitaRepositorio` agregando verificación de cruces de horario dinámico excluyendo la cita actual (Fase 8A).
- [x] Implementados servicios de cancelación, check-in y reprogramación de citas en `CitaServicio` (Fase 8A).
- [x] Expuestos endpoints PUT en `CitaControlador` para cancelación (`/{id}/cancelar`), check-in (`/{id}/check-in`) y reprogramación (`/{id}/reprogramar`) de citas (Fase 8A).
- [x] Inyectado `HorarioPersonalRepositorio` en `CitaServicio` e implementada la validación dinámica de horarios de atención (Fase 8B).
- [x] Agregados métodos de control `validarHorarioAtencion` y el auxiliar `traducirDiaSemana` para el formato amigable de excepciones en español (Fase 8B).
- [x] Agregada la consulta dinámica `buscarCitasConFiltros` en `CitaRepositorio` para filtrar por rango de fechas, veterinario y estado (Fase 8C).
- [x] Implementado el método `listarCitasConFiltros` en `CitaServicio` manejando la conversión opcional de fechas (Fase 8C).
- [x] Expuesto el endpoint de consulta estructurada `GET /api/citas/agenda` en `CitaControlador` (Fase 8C).
- [x] Implementada la búsqueda de transacciones por usuario y estado de pago en `TransaccionRepositorio` (Fase 9A).
- [x] Desarrollados los endpoints `GET` en `TransaccionControlador` para que clientes e inspectores/administradores verifiquen el historial de cobros y pagos (Fase 9A).
- [x] Asegurados los endpoints de caja presencial y listados de transacciones en `SeguridadConfig` bajo los roles `RECEPCIONISTA` y `ADMINISTRADOR` (Fase 9A).
- [x] Creado record DTO `ReporteFinanciero` para encapsular las estadísticas diarias, mensuales y globales (Fase 9B).
- [x] Agregadas las consultas de suma de ingresos `sumarMontoPorFechaPagoBetween` y `sumarMontoTotalAprobado` en `TransaccionRepositorio` (Fase 9B).
- [x] Creado el servicio `BoletaPdfServicio` implementando la maquetación en PDF de boletas tamaño A5 utilizando OpenPDF (Fase 9B).
- [x] Expuestos los endpoints GET `/reporte` (restringido al administrador) y `/{id}/boleta` (descarga general) en `TransaccionControlador` (Fase 9B).
- [x] Creadas las entidades JPA para `Categoria`, `Producto` e `Inventario` (lotes de stock y vencimiento) (Fase 10A).
- [x] Desarrollados repositorios, servicios y controladores para el CRUD y gestión lógica de lotes de inventario (Fase 10A).
- [x] Protegida la mutación de stock en `SeguridadConfig` bajo el rol `ADMINISTRADOR` y habilitado el listado público para el catálogo (Fase 10A).
- [x] Agregada la propiedad `stockMinimo` en la entidad `Producto` (Fase 10B).
- [x] Implementadas las consultas JPQL de bajo stock en `ProductoRepositorio` y de vencimientos en `InventarioRepositorio` (Fase 10B).
- [x] Expuestos los endpoints GET `/bajo-stock` y `/vencimientos` en `InventarioControlador` bajo seguridad restringida a los roles `VETERINARIO` y `ADMINISTRADOR` (Fase 10B).
- [x] **Fase 11A: Backend - Catálogo y Pedidos de Tienda Online**:
  - Creado el enum `EstadoPedido` con estados `PENDIENTE`, `PAGADO`, `ENTREGADO`, `CANCELADO`.
  - Creadas las entidades `CarritoItem` (asociado a cliente y producto), `Pedido` (cabecera con cliente, fecha, total, estado) y `DetallePedido` (líneas de pedido con precio unitario e inventario).
  - Creados los repositorios `CarritoItemRepositorio`, `PedidoRepositorio` y `DetallePedidoRepositorio`.
  - Modificado `InventarioRepositorio` con la consulta FEFO (`buscarLotesDisponiblesParaDescuento`) y `ProductoRepositorio` con búsqueda por coincidencia de nombre.
  - Modificado `ProductoServicio` y `ProductoControlador` para soportar la búsqueda de catálogo `/api/productos/buscar` de forma pública.
  - Creado `TiendaOnlineServicio` con el CRUD del carrito y checkout atómico (deducción FEFO lote por lote, guardado de cabecera y detalle de pedido y vaciado del carrito).
  - Creado `TiendaOnlineControlador` exponiendo `/api/carrito` (CRUD) y `/api/pedidos` (checkout, consultar historial, cambiar estado).
  - Actualizado `SeguridadConfig` protegiendo las rutas de carrito/checkout para clientes autenticados y cambio de estado de pedidos para Recepcionista y Administrador.
- [x] **Fase 11B: Backend - Tareas Programadas y Campañas de Marketing**:
  - Habilitado el planificador de Spring (`@EnableScheduling`) en `HuesitosBackendApplication`.
  - Creadas las entidades `Desparasitacion`, `Recordatorio`, `Campana` y `Oferta` con sus respectivos repositorios.
  - Implementados `DesparasitacionServicio` y `CampanaOfertaServicio` con CRUDs completos, auto-cálculos de porcentaje/precio de ofertas e inactivación de expirados.
  - Implementado `TareaProgramadaServicio` con métodos programados `@Scheduled` para:
    - Escaneo diario de próximas dosis de vacunas y desparasitaciones a 7 días y generación automática de `Recordatorio` en base de datos.
    - Inactivación automática de campañas y ofertas expiradas en base a la fecha de fin.
  - Creados controladores para desparasitaciones, recordatorios (incluyendo endpoints manuales de control `/procesar-manual` y `/inactivar-campanas-manual` para pruebas de QA) y campañas/ofertas.
  - Configurado `SeguridadConfig` permitiendo visualización pública de campañas y ofertas, y restringiendo mutaciones a Veterinario/Administrador.

## 📌 Estado Actual de los Componentes
- **Backend (Spring Boot)**: Configurado con JPA, Security, JWT, capas de Servicio y Controladores. Módulos de Autenticación, Mascotas, Citas, Servicios, Transacciones, Consultas Clínicas, Compresión de Fotos, Restablecimiento de Contraseñas, Configuraciones por Rol, Gestión de Usuarios/Bloqueo, Horarios de Personal, Catálogo de Vacunas/Historial, Recetas Clínicas PDF, Subida de Archivos Clínicos, Modelado e Inventario, Catálogo y Pedidos de Tienda Online, y el módulo de Tareas Programadas y Campañas de Marketing (Fase 11B finalizada) completamente implementados y validados.
- **Frontend (React)**: Inicializado con React 18, Vite y Tailwind CSS 3.4 con página de bienvenida premium en español.
- **Base de Datos (MySQL)**: Base de datos `huesitos` inicializada. Hibernate crea/actualiza las tablas `usuarios`, `duenos`, `mascotas`, `citas`, `consultas_medicas`, `servicios`, `transacciones`, `horarios_personal`, `vacunas`, `historial_vacunas`, `recetas`, `archivos_clinicos`, `categorias`, `productos` y `inventarios` al levantar la aplicación.

## 🛠️ Próximos Pasos (Pendientes)
- [ ] **Desarrollo del Frontend (React + Tailwind CSS)**:
  - **Vistas de Cliente / Público (Visitantes)**:
    - [ ] **Landing Page**: Página de inicio, servicios destacados, contacto (Marcona, Ica) y emergencias.
    - [ ] **Registro, Login y Recuperación**: Registro de propietario, inicio de sesión JWT, y flujo de recuperación con token de 6 dígitos.
    - [ ] **Dashboard de Cliente**: Grid de mascotas, próximas citas agendadas y accesos rápidos.
    - [ ] **Ficha de Mascota e Historial Clínico**: Línea de tiempo de consultas, vacunas aplicadas y descarga de recetas.
    - [ ] **Agendamiento de Citas**: Formulario interactivo en 4 pasos (Mascota, Servicio, Profesional, Horario/Fecha).
    - [ ] **Tienda Online**: Catálogo de productos, buscador por categorías, carrito de compras lateral y checkout.
  - **Vistas de Veterinario**:
    - [ ] **Agenda y Sala de Espera (Tablet)**: Lista de mascotas en espera con botón de inicio de consulta.
    - [ ] **Ficha Clínica Activa (Tablet)**: Registro de diagnóstico, vacunas, recetas (PDF A5) y subida de archivos ecográficos/análisis.
  - **Vistas de Recepcionista**:
    - [ ] **Punto de Venta (POS) y Caja**: Cobros de citas y tienda con múltiples métodos de pago (Yape/Plin, tarjeta, efectivo), cálculo de vuelto e impresión de Boleta A5 en PDF.
    - [ ] **Despacho de Pedidos**: Control y entrega de las compras realizadas en la tienda online.
    - [ ] **Agenda Semanal de Citas**: Gestión de turnos y arrastre para reprogramación.
  - **Vistas de Administrador**:
    - [ ] **Dashboard Financiero**: Métricas clave en soles (S/), gráficos de ingresos y servicios más solicitados.
    - [ ] **Gestión de Personal**: Registro de veterinarios y recepcionistas, y control de bloqueo lógico de cuentas.
    - [ ] **Configuración de Horarios**: Grilla semanal de trabajo por empleado y calendario de excepciones/vacaciones.
    - [ ] **Gestión de Inventario FEFO**: Control de stock general, alerta de bajo stock y detalle de lotes con fechas de vencimiento.
    - [ ] **Catálogo de Servicios y Tarifas**: CRUD y activación lógica de servicios médicos.
    - [ ] **Campañas y Ofertas**: Creación de campañas de marketing e indicadores de expiración.
  - **Componentes y Vistas Reutilizables**:
    - [ ] **Historial Clínico / Ficha de Mascota**: Reutilizable entre el *Cliente* (lectura) y el *Veterinario* (consulta durante la atención).
    - [ ] **Agenda Semanal de Citas**: Compartido y reutilizable entre la *Recepcionista* (gestión operativa) y el *Administrador* (vista de supervisión).
    - [ ] **Inventario Crítico / Alertas**: La alerta de bajo stock y próximos a vencer se reutiliza en el dashboard del *Administrador* y en el panel POS de la *Recepcionista*.
    - [ ] **Gestión de Pedidos**: Compartido entre la *Recepcionista* (despacho físico) y el *Administrador* (auditoría).

 
 
## 🧠 Decisiones Clave y Notas
- Se decidió reemplazar la inyección implícita de Lombok con constructores estándar Java en los componentes de seguridad para asegurar la máxima compatibilidad de compilación directa con Maven Compiler.
- Se simplificó temporalmente `SeguridadConfig` para desactivar la autenticación estricta JWT en los endpoints, permitiendo pruebas del servicio de registro sin requerir cabeceras de autorización de forma temporal.
- Se agregó `@JsonAlias` al campo `dueño` en `Mascota` para resolver problemas de deserialización JSON con caracteres Unicode (ñ) desde clientes con distintas codificaciones.
- El campo `veterinario` en `Cita` es `nullable = true` para permitir que clientes agenden citas generales desde la web y la recepcionista asigne veterinario posteriormente.
- Se configuró el campo `medioPago` en `Transaccion` como `nullable = true` en base de datos debido a que las transacciones se crean originalmente como órdenes de pago en estado `PENDIENTE` sin medio de pago definido (el cual se asigna una vez efectuado el cobro).
- **Emergencia 24h**: Dado que una emergencia requiere atención médica inmediata, el módulo de emergencias se resolverá a nivel de frontend únicamente como un botón de marcación directa por llamada telefónica y enlace directo a WhatsApp (sin soporte de agendamiento web transaccional por su naturaleza crítica).
- **Adherencia a Patrones y Principios**: Todo el backend nuevo de las siguientes fases se desarrollará estrictamente bajo el patrón MVC (desacoplado) y los principios SOLID (especialmente SRP para la separación de lógica de negocio y DIP en la inyección de dependencias).
- **Diseño e Integración para Tablets**: Toda la API y estructura de datos del backend se optimizará para un consumo ágil, intuitivo y responsivo. Aunque la lógica se implementa en backend, se considera el uso táctil y flujo rápido en Tablets (especialmente para Recepcionistas y Veterinarios en clínica) mediante endpoints de respuesta rápida, paginados y eficientes.
- **Validación Flexible de Horarios**: En el agendamiento de citas (Fase 8), la validación contra el horario del veterinario será dinámica. Si un veterinario no tiene horarios registrados en la base de datos, el sistema no impondrá restricciones, permitiendo flexibilidad. Si el Administrador configura un horario para el veterinario, este se validará estrictamente.
- **Cruce de Horario en Reprogramación**: Para la reprogramación de citas se verifica que no existan colisiones de horario para el veterinario en la nueva fecha y hora propuesta, excluyendo la propia cita actual del cálculo para evitar falsos positivos de cruces de agenda cuando no se cambia la hora.
- **División de Fases y Commits**: A partir de la Fase 11A, se decide realizar una división más granular de las fases y sus correspondientes commits. Esto asegura que cada commit al final de una fase contenga de manera explícita y pormenorizada los puntos y archivos específicos modificados, mejorando enormemente la claridad y control de los cambios realizados.
- **Planificación de Vistas Frontend (Figma / Stitch)**: Estructuración y diseño inicial del frontend mapeados a las APIs del backend de Huesitos para facilitar la maquetación rápida en Figma y generación con Stitch.



