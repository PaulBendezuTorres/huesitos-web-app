---
trigger: always_on
description: Reglas y estándares para el desarrollo del backend en Java y Spring Boot.
---

## Contexto General
- **Backend**: Java 26 + Spring Boot 4 | **Frontend**: React 18 + Tailwind CSS 3.4 | **BD**: MySQL 8.4
- **Idioma**: SIEMPRE español, saludando a Paul. Código, variables y documentación en español.

---

## Backend (Spring Boot)

### Arquitectura
- Estructura por dominios: `autenticacion`, `cita`, `mascota`, `usuario`, `producto`, `transaccion`
- Capas: `web` (REST) → `servicio` (lógica) → `repositorio` (datos)
- Inyección con constructor + Lombok: `@RequiredArgsConstructor + private final` (NO `@Autowired`)
- Excepciones centralizadas en `@ControllerAdvice` con respuestas en español
- `@Transactional` en operaciones críticas (citas, finanzas)

### Estándares
- Nombres en español: `UsuarioServicio.java`, `validarCredenciales()`
- SOLID (SRP, DIP) con validación estricta (`@Valid`, `@NotNull`)
- Acceso configurado en `SeguridadConfig`

---

## Frontend (React + Tailwind)

### Enrutamiento
- Rutas anidadas físicas: `/admin/servicios` + `/admin/servicios/registrar` (NO toggles locales)
- URLs semánticas, sincroniza sidebar con `useLocation()`
- Transiciones fluidas: `animate-in fade-in duration-300`

### Componentes Premium (OBLIGATORIO)
SIN HTML nativo. Usa: `<Combobox />`, `<AreaTexto />`, `<Avatar />`, `<Boton />`, `<ModalConfirmacion />`, `<Paginacion />`, `<CargadorSpinner />` (OBLIGATORIO en async)

### Layout & Diseño
- Maquetación ancha izquierda: `w-full` (PROHIBIDO `max-w-2xl mx-auto`)
- Tema oscuro: `dark:bg-oscuro-base` (#0B1A30), `dark:bg-oscuro-secundario` (#102442), `dark:bg-oscuro-tarjeta` (#152E54), `dark:border-oscuro-borde` (#1D3E70)
- Texto: `dark:text-slate-100` (títulos), `dark:text-slate-300` (descripciones)
- Estructura atómica por feature: `/src/componentes/portada/`, alias `@` para `/src`
- Centraliza API calls en `src/servicios/` y `src/api/`

### Nomenclatura
- Archivos, componentes, variables en español: `PaginaServicios.jsx`, `/admin/clientes`

---

## Seguridad (OBLIGATORIO)

### 1. PROHIBIDO Hardcoding de Credenciales
NUNCA escribas contraseñas, URLs de producción, API keys o tokens directamente. Usa SIEMPRE: `${NOMBRE_VARIABLE:valor_por_defecto_local}`

### 2. application.properties Seguro
```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/huesitos?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
spring.datasource.username=${DB_USER:root}
spring.datasource.password=${DB_PASSWORD:admin}
spring.mail.username=${SMTP_USER:paultorres2266@gmail.com}
spring.mail.password=${SMTP_PASSWORD}
```
*SMTP_PASSWORD: SIN valor por defecto (proteger producción)*

### 3. Almacenamiento de Imágenes
- PROHIBIDO guardar localmente en Render (efímero)
- Delegar a **Cloudinary** con variables de entorno: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- BD: solo URLs públicas (Strings) de Cloudinary

---

## Git y Commits

### Formato
- Prefijos: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`
- SIEMPRE español con viñetas detalladas
- Ejemplo: `feat: modal de metas` → `* Alinear verticalmente...` → `* Corregir z-index...`

### Restricciones
- NO commits automáticos (usuario lo hace manual)
- NO merges automáticos
- Ramas nuevas desde `develop`
- PROHIBIDO `git add -f` de archivos en `.gitignore`
- `memoria.md` NUNCA se sube

---

## Restricciones Generales

- Modifica frontend + backend
- Planes solo para tareas complejas (explícitas)
- NO navegador automático (usuario valida)
- Actualiza `memoria.md` en workflows
- `docs/` requiere indicación explícita

---

## Respuesta

- Brevedad obligatoria, directo al grano
- Sin redundancias, solo lo esencial
- Español siempre
