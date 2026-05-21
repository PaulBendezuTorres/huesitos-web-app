# Memoria de Desarrollo - Huesitos

Última actualización: 2026-05-20 (Fase 1 completada)

## 🚀 Logros Recientes
- [x] Rama `develop` creada y publicada en GitHub.
- [x] Nueva rama de características `feature/configuracion-base-backend` creada.
- [x] Base de datos MySQL `huesitos` creada localmente.
- [x] Configurada la conexión MySQL local y dialecto Hibernate en el backend.
- [x] Implementada la arquitectura de seguridad basada en Spring Security, CORS y tokens JWT.
- [x] Compilación y construcción del backend verificada con éxito (`BUILD SUCCESS`).
- [x] Creados el enumerador `Rol` y la entidad JPA `Usuario` en `huesitos_backend.entidades`.
- [x] Creados la entidad `Dueño` y los repositorios `UsuarioRepositorio` y `DueñoRepositorio`.

## 📌 Estado Actual de los Componentes
- **Backend (Spring Boot)**: Configurado con JPA, Security, JWT y repositorios básicos. Creadas entidades `Usuario` y `Dueño`.
- **Frontend (React)**: Inicializado con React 18, Vite y Tailwind CSS 3.4 con página de bienvenida premium en español.
- **Base de Datos (MySQL)**: Base de datos `huesitos` inicializada. Hibernate creará las tablas `usuarios` y `duenos` al levantar la aplicación.

## 🛠️ Próximos Pasos (Pendientes)
- [ ] Creación de entidades JPA restantes (`Mascota`, `Cita`).
- [ ] Implementar la lógica de negocio de autenticación y registro en el Servicio.
- [ ] Crear el controlador REST de Autenticación.

## 🧠 Decisiones Clave y Notas
- Se decidió reemplazar la inyección implícita de Lombok con constructores estándar Java en los componentes de seguridad para asegurar la máxima compatibilidad de compilación directa con Maven Compiler.
