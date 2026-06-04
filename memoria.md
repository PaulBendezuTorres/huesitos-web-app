# Memoria de Desarrollo - Huesitos

Última actualización: 2026-06-04 (Implementación de Vistas del Cliente en Frontend: Historial Clínico, Agendamiento y Tienda)

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
  - Creados controladores para desparasitaciones, recordatorios (incluyendo endpoints manuales de control `/procesar-manual` y `/inactivar-campanas-manual` para pruebas de QA) y campañas/ofertas.
  - Configurado `SeguridadConfig` permitiendo visualización pública de campañas y ofertas, y restringiendo mutaciones a Veterinario/Administrador.
- [x] **Frontend - Historial Clínico del Cliente**:
  - Creado `mascotaAPI.js` para consumir endpoints de mascotas, consultas, vacunas, recetas PDF y archivos.
  - Creado hook personalizado `useHistorialClinico.js` para carga paralela unificada y cronológica.
  - Reescrito `MascotaFichaHistorial.jsx` con buscador, filtros y un timeline premium adaptativo.
  - Creado `ClienteMascotas.jsx` y enlazado desde el panel y el inicio.
- [x] **Frontend - Agendamiento de Citas e Integración de Tienda**:
  - Creado `citaAPI.js` y `tiendaAPI.js` para conectar con la API de citas y tienda.
  - Desarrollada vista `ClienteAgendarCita.jsx` interactiva en 4 pasos (Mascota, Servicio, Profesional, Horario/Fecha).
  - Desarrollada vista `ClienteTienda.jsx` con catálogo, buscador de productos, carrito lateral (drawer) y checkout FEFO.
  - Integradas todas las vistas en el ruteo de `App.jsx` y la botonera de `ClienteDashboard.jsx`.
- [x] **Frontend - Vista de Veterinario (Tablet)**:
  - Creado `veterinarioAPI.js` para los servicios de consultas, recetas, vacunas, historial y subida de archivos clínicos.
  - Diseñada e implementada la interfaz `VeterinarioDashboard.jsx` optimizada para tablets en formato Split View 30/70.
  - Integrada la sala de espera del día y el inicio de consultas con diagnóstico, prescripción de recetas y carga multipart de análisis de laboratorio.
  - Configuradas las rutas correspondientes y redirección dinámica en login por rol.
- [x] **Frontend - Vista de Recepcionista (POS y Caja)**:
  - Agregadas las llamadas al POS de caja, alertas de stock mínimo, vencimientos (FEFO) y boleta PDF en `finanzasService.js`.
  - Diseñada e implementada la interfaz táctil `RecepcionistaDashboard.jsx` en formato Split View 40/60 para tablets.
  - Integrado el modal de cobro táctil con cálculo de vuelto por efectivo, códigos de referencia y descarga/impresión inmediata de la boleta de venta en formato PDF A5.
  - Expuesto el endpoint `GET /api/pagos/{id}/boleta` en `TransaccionControlador.java` del backend para vincular `BoletaPdfServicio`.
  - Registradas las rutas y redirecciones en `App.jsx` y `Login.jsx` respectivamente.

## 📌 Estado Actual de los Componentes
- **Backend (Spring Boot)**: Configurado con JPA, Security, JWT, capas de Servicio y Controladores. Módulos de Autenticación, Mascotas, Citas, Servicios, Transacciones, Consultas Clínicas, Compresión de Fotos, Restablecimiento de Contraseñas, Configuraciones por Rol, Gestión de Usuarios/Bloqueo, Horarios de Personal, Catálogo de Vacunas/Historial, Recetas Clínicas PDF, Subida de Archivos Clínicos, Modelado e Inventario, Catálogo y Pedidos de Tienda Online, y el módulo de Tareas Programadas y Campañas de Marketing (Fase 11B finalizada) completamente implementados y validados.
- **Frontend (React)**: Inicializado con React 18, Vite y Tailwind CSS 3.4. Vistas implementadas: Landing Page, Cliente (Inicio, Mascotas, Historial/Timeline, Agendar Cita, Tienda y Carrito), Veterinario (Agenda, Sala de Espera y Ficha Clínica Activa) y Recepcionista (POS, Caja y alertas FEFO). Compilación validada con éxito.
- **Base de Datos (MySQL)**: Base de datos `huesitos` inicializada. Hibernate crea/actualiza las tablas `usuarios`, `duenos`, `mascotas`, `citas`, `consultas_medicas`, `servicios`, `transacciones`, `horarios_personal`, `vacunas`, `historial_vacunas`, `recetas`, `archivos_clinicos`, `categorias`, `productos` y `inventarios` al levantar la aplicación.

## 🛠️ Próximos Pasos (Pendientes)
- [ ] **Desarrollo del Frontend (React + Tailwind CSS)**:
  - **Vistas de Cliente / Público (Visitantes)**:
    - [x] **Landing Page**: Página de inicio, servicios destacados, contacto (Marcona, Ica) y emergencias.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Diseña una página de inicio (Landing Page) interactiva y premium para la veterinaria "Huesitos" en Perú (sede Marcona, Ica). Usa Tailwind CSS con un fondo slate-50, textos en slate-800, y botones/detalles en gradientes de azul-600 a sky-400.
      Debe incluir:
      1. Navegación superior (Navbar): Logo circular con diseño de huesito, nombre "Huesitos", links de navegación (Inicio, Nosotros, Servicios, Ubicación) y un botón de "Iniciar Sesión" en la esquina derecha.
      2. Sección Hero: Título grande "Excelencia médica para quienes más amas", un subtítulo amigable, y una imagen destacada a la derecha de un veterinario examinando un perro. Incluye dos botones: uno para agendar cita y otro para llamar a emergencias 24/7 en rojo suave con el número de contacto de Ica, Perú.
      3. Grid de Servicios Destacados: 4 cards de servicios (Consultas, Vacunas, Laboratorio, Internamiento) con iconos lineales.
      4. Sección Nosotros: Texto descriptivo de la veterinaria Huesitos con un banner a la derecha que resalte "10+ Años de Experiencia".
      5. Pie de página (Footer) en tono azul oscuro (slate-950) con datos de contacto (Teléfono, Correo, Dirección en Santo Domingo De Marcona C-22, Ica, Perú) y redes sociales.
      ```
      </details>
    - [x] **Registro, Login y Recuperación**: Registro de propietario, inicio de sesión JWT y flujos de recuperación.
      <details>
      <summary>Prompts Figma / Stitch (Registro, Recuperación y Verificación)</summary>

      * **[x] Inicio de Sesión (Login)**: Implementado.
      * **[x] Registro**: Registro de cliente (dueño + usuario) con campos completos y foto de perfil por defecto.
      * **[x] Recuperación y Verificación**: Enlace de recuperación por correo y restablecimiento con token UUID.

      **Registro**:
      ```text
      Diseña una pantalla de registro (Crear Cuenta) en español peruano para la veterinaria "Huesitos" en Perú. Formato de pantalla dividida (split-screen 50/50).
      - Columna izquierda: Formulario de registro limpio con fondo blanco.
        1. Título "Crea tu cuenta" y descripción para clientes.
        2. Input de Nombre Completo del Propietario.
        3. Input de Teléfono celular peruano (9 dígitos) e Input de Dirección (Marcona, Ica, Perú).
        4. Input de Correo electrónico.
        5. Input de Contraseña y confirmación.
        6. Checkbox de términos y condiciones de privacidad y protección de datos personales.
        7. Botón azul de ancho completo para "Crear Cuenta".
      - Columna derecha: Foto de un cliente feliz cargando a su mascota en un entorno moderno y luminoso.
      ```

      **Recuperación de Contraseña**:
      ```text
      Diseña una pantalla de "Recuperar Contraseña" en español para la veterinaria "Huesitos" en Perú. Formato de pantalla dividida (split-screen 50/50).
      - Columna izquierda: Formulario para ingresar el correo registrado.
        1. Título "Recuperar Contraseña" e instrucciones que indiquen que se enviará un enlace de restablecimiento con un token temporal de seguridad.
        2. Input de Correo electrónico con icono de correo.
        3. Botón azul ancho completo "Enviar Enlace de Recuperación".
        4. Enlace para volver a la pantalla de Login: "Regresar al inicio de sesión".
      - Columna derecha: Foto del mostrador de recepción moderno y minimalista de la clínica veterinaria Huesitos.
      ```

      **Verificación de Seguridad / Código**:
      ```text
      Diseña una pantalla de "Verificación de Seguridad" (validación de token de contraseña) en español para la veterinaria "Huesitos" en Perú. Formato split-screen 50/50.
      - Columna izquierda: Formulario de verificación de identidad.
        1. Título "Verifica tu cuenta" con descripción: "Ingresa el código de seguridad de 6 dígitos que enviamos a tu correo".
        2. Fila horizontal con 6 casilleros cuadrados individuales para ingresar los dígitos del código.
        3. Enlace para reenviar código: "¿No recibiste el código? Reenviar en 59s".
        4. Botón azul de ancho completo "Verificar y Continuar".
      - Columna derecha: Foto de un veterinario y una dueña conversando alegremente en una sala de consulta de la clínica.
      ```
      </details>
    - [x] **Dashboard de Cliente**: Grid de mascotas, próximas citas agendadas y accesos rápidos.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Genera un dashboard de cliente para una clínica veterinaria llamada "Huesitos" en Perú. Usa Tailwind CSS con un estilo de diseño limpio y premium. Paleta de colores: fondo slate-50, texto slate-900, botones y acentos en azul-600 y sky-500, bordes finos slate-200/50 y cristalografía (backdrop-blur).
      La vista debe incluir:
      1. Una barra lateral de navegación con links: Dashboard, Mis Mascotas, Reservar Cita, Tienda Online, Mis Recetas y Facturación.
      2. Un banner superior estilo gradiente de azul a cian que diga "Campaña del Mes en Huesitos Perú: Protégelo contra la Rabia y Parásitos. 20% de descuento en vacunas quíntuples".
      3. Sección "Mis Mascotas": Un grid con cards de mascotas. Cada card debe tener foto de perfil circular de la mascota, nombre ("Max"), especie/raza ("Perro - Golden Retriever"), edad ("2 años"), un badge verde de "Saludable" o amarillo de "Próxima Vacuna", un botón azul para "Ver Historial" y un botón blanco con borde gris para "Descargar Recetas".
      4. Sección "Próximas Citas": Una tabla o lista horizontal con citas agendadas que muestre: Fecha/Hora, Servicio ("Consulta General"), Veterinario asignado, y Estado con badges de color (Pendiente en amarillo, Confirmada en verde).
      Diseño responsivo para móviles y escritorio con fuentes modernas (Inter o Outfit).
      ```
      </details>
    - [x] **Ficha de Mascota e Historial Clínico**: Línea de tiempo de consultas, vacunas aplicadas y descarga de recetas.
    - [x] **Agendamiento de Citas**: Formulario interactivo en 4 pasos (Mascota, Servicio, Profesional, Horario/Fecha).
    - [x] **Tienda Online**: Catálogo de productos, buscador por categorías, carrito de compras lateral y checkout.

  - **Vistas de Veterinario**:
    - [x] **Agenda y Sala de Espera, y Ficha Clínica Activa (Tablet)**: Gestión completa de citas del día y edición del historial.

  - **Vistas de Recepcionista**:
    - [x] **Punto de Venta (POS) y Caja**: Cobros de citas y tienda con múltiples métodos de pago, vuelto e impresión de Boleta A5 PDF.
    - [ ] **Despacho de Pedidos**: Control y entrega de las compras realizadas en la tienda online.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Diseña un panel de control en español para que la recepcionista gestione y despache las compras en línea realizadas por los clientes de la tienda online de Huesitos en Perú. Orientación Tablet horizontal o Desktop, colores claros y alta legibilidad.
      La interfaz debe incluir:
      1. Pestañas de Estado de Pedidos: Filtros rápidos para alternar entre: Todos, Pendientes, Pagados, Entregados, Cancelados.
      2. Grid de Pedidos Entrantes: Cards de pedidos ordenadas de la más reciente a la más antigua. Cada card debe tener: Código de pedido, Nombre del cliente, Fecha y hora de compra, Total del pedido en Soles ("S/ 120.00") y un badge de estado (e.g., "PAGADO" en azul, "PENDIENTE" en amarillo).
      3. Panel de Detalle del Pedido Seleccionado:
         - Listado de productos comprados con sus cantidades, precios unitarios y subtotal.
         - Indicador del lote FEFO del cual se descontará el inventario.
         - Información de contacto del cliente (DNI, teléfono y dirección de entrega/recojo).
      4. Botones de acción principales: Botón verde grande "Marcar como Entregado" (para pedidos listos para recojo/envío) y un botón rojo "Cancelar Pedido" (que revierte el stock descontado al inventario).
      ```
      </details>
    - [ ] **Agenda Semanal de Citas**: Gestión de turnos y arrastre para reprogramación.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Diseña una interfaz en español de "Agenda Semanal de Citas" para la recepcionista o administrador de la clínica Huesitos Perú. Formato de alto rendimiento optimizado para Tablet/Desktop.
      Debe tener:
      1. Filtros avanzados superiores: Rango de fechas, Veterinario asignado, y Estado de la cita (Pendiente, Confirmada, En Espera, Completada, Cancelada).
      2. Vista de Calendario semanal con columnas por cada día de la semana. Cada columna contiene tarjetas de citas posicionadas por hora.
      3. Tarjeta de Cita individual: Muestra la hora de la cita, nombre del paciente, nombre del veterinario asignado, tipo de servicio, y un badge del estado de la cita.
      4. Botón rápido de reprogramación: Permite arrastrar la cita o hacer clic para cambiar la fecha y hora validando colisiones en tiempo real.
      ```
      </details>

  - **Vistas de Administrador**:
    - [x] **Dashboard Financiero**: Métricas clave en soles (S/), gráficos de ingresos y servicios más solicitados.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Diseña un dashboard de analíticas financieras y de operaciones en español para el rol Administrador de Huesitos en Perú. Estilo moderno, profesional, fondo slate-950 (modo oscuro premium) o slate-50, con tarjetas tipo vidrio (glassmorphism) y bordes redondeados.
      Componentes:
      1. Indicadores clave (KPIs) en la fila superior con precios en Soles (S/):
         - Card 1: "Ingresos Totales" (Monto S/ 15,240.00 con un indicador de +12.5% en verde).
         - Card 2: "Citas Completadas" (Número 342 con un mini gráfico de línea de tendencia).
         - Card 3: "Pedidos de Tienda" (Monto S/ 4,890.00 con indicador mensual).
         - Card 4: "Productos con Bajo Stock" (Badge de alerta en rojo con número 5).
      2. Gráfico Principal (Cuerpo Central): Un área para un gráfico de barras de ingresos mensuales y flujo de caja diario con selectores de fechas (Hoy, Últimos 7 días, Este mes, Año).
      3. Tabla de "Servicios Más Solicitados": Lista ordenada por volumen de ventas (e.g., Consulta General, Vacuna Triple Felina, Ecografía Abdominal) con su respectiva ganancia en Soles y porcentaje de participación.
      4. Diseño con colores armoniosos (azul-600 para marcas, esmeralda-500 para tendencias positivas, y rojo para alertas de inventario).
      ```
      </details>
    - [x] **Gestión de Personal**: Registro de veterinarios y recepcionistas, y control de bloqueo lógico de cuentas.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Diseña la vista de administración en español para gestionar los usuarios y el personal de la clínica Huesitos en Perú. Estilo de diseño limpio con Tailwind CSS.
      Debe contener:
      1. Cabecera: Buscador de personal por DNI, correo o nombre, y botón azul "+ Registrar Personal" para dar de alta veterinarios y recepcionistas.
      2. Tabla de Usuarios: Columnas para Nombre, Correo, Rol (con badges de color verde para Veterinario, azul para Recepcionista, morado para Cliente), y Estado (Activo o Bloqueado).
      3. Acciones rápidas: Un interruptor toggle para bloquear o desbloquear de forma inmediata el acceso de un usuario al sistema y un botón para editar sus datos de perfil o configuración.
      ```
      </details>
    - [ ] **Configuración de Horarios**: Grilla semanal de trabajo por empleado y calendario de excepciones/vacaciones.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Genera una vista de administración en español para configurar y gestionar el horario laboral semanal de los veterinarios y recepcionistas de la clínica Huesitos Perú. Diseño limpio con Tailwind CSS.
      Componentes requeridos:
      1. Selector de Empleado: Barra lateral o menú desplegable con tarjetas de perfil de los miembros del equipo ("Dr. Luis Gómez - Veterinario", "Dra. Ana Martínez - Pediatra", "Clara Vega - Recepcionista").
      2. Grilla Semanal de Horarios (Lunes a Domingo):
         - Cada día de la semana debe tener controles para configurar: Estado (Laboral / Libre), Hora de Entrada (selector de tiempo), Hora de Salida, y Hora de Refrigerio/Descanso.
         - Switch toggle deslizable para marcar rápidamente "Día Libre" (que deshabilita los campos de hora para ese día).
      3. Sección de "Excepciones y Vacaciones": Un mini-calendario que permita bloquear fechas específicas (por ejemplo, vacaciones o feriados en Perú) para que la API no permita agendar citas en esos días.
      4. Botón de acción principal inferior: "Guardar Jornada Semanal" en azul brillante y un botón de cancelación en gris.
      ```
      </details>
    - [ ] **Gestión de Inventario FEFO**: Control de stock general, alerta de bajo stock y detalle de lotes con fechas de vencimiento.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Genera una interfaz de gestión de inventarios y control de caducidad en español orientada a la clínica veterinaria Huesitos en Perú con control estricto FEFO (First Expired, First Out). Fondo slate-50, diseño limpio.
      La vista debe incluir:
      1. Panel superior de Alertas Críticas:
         - Alerta 1 (Bajo Stock): Caja roja con el listado de 3 insumos médicos que bajaron del "Stock Mínimo" de seguridad con botón "Generar Orden de Compra".
         - Alerta 2 (Próximos a Vencer): Caja naranja con productos y lotes que vencen en menos de 30 días, mostrando el número de lote y fecha de vencimiento exacta.
      2. Buscador y Filtro por Categorías: Buscador general con filtros tipo chip (Todos, Medicamentos, Alimentos, Juguetes, Accesorios).
      3. Tabla Principal de Productos y Lotes: Columnas para: Código de barras, Nombre del producto, Categoría, Stock General, y sub-filas desplegables que muestren los Lotes con sus respectivas fechas de vencimiento y cantidades en stock para visualización de descuento FEFO.
      4. Botón flotante o superior azul: "+ Registrar Nuevo Lote / Producto" con un formulario modal limpio de fondo.
      ```
      </details>
    - [x] **Catálogo de Servicios y Tarifas**: CRUD y activación lógica de servicios médicos.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Diseña una página de administración de "Catálogo de Servicios y Precios" en español para la veterinaria "Huesitos" en Perú. Estilo de diseño moderno con Tailwind CSS.
      Debe incluir:
      1. Botón superior "+ Nuevo Servicio" y barra de búsqueda.
      2. Grid de tarjetas de servicios activos: Cada tarjeta muestra el nombre del servicio (e.g., "Consulta de Cardiología"), categoría, precio regular en Soles ("S/ 250.00"), icono representativo y un interruptor toggle para marcar como "Activo / Inactivo" (desactivación lógica).
      3. Panel modal simple para editar nombre, precio regular, descripción y cambiar la categoría del servicio.
      ```
      </details>
    - [ ] **Campañas y Ofertas**: Creación de campañas de marketing e indicadores de expiración.
      <details>
      <summary>Prompt Figma / Stitch</summary>

      ```text
      Diseña un panel de administración en español para crear y visualizar campañas de marketing y ofertas de la tienda veterinaria Huesitos en Perú. Fondo slate-50 y tarjetas rounded-2xl.
      Componentes de la interfaz:
      1. Listado de Campañas Activas: Cards que muestren el nombre de la campaña ("Descuento de Vacunas de Otoño"), porcentaje de descuento (e.g., 15%), fecha de inicio, fecha de término, y un toggle para activar/desactivar la campaña de forma lógica e inmediata.
      2. Formulario para Crear Campaña: Panel lateral con campos para: Título de campaña, Descripción, Descuento (%), Fecha Inicio, Fecha Fin, y Selector múltiple de productos o servicios aplicables.
      3. Indicador de Expiración Automática: Un badge en cada card de campaña que muestre los días restantes antes de que se inactive automáticamente por la tarea programada del backend de Spring Boot.
      4. Diseño premium y limpio con iconos intuitivos para diferenciar ofertas de servicios y productos.
      ```
      </details>

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




