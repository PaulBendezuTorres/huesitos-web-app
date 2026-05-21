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

## 📌 Estado Actual de los Componentes
- **Backend (Spring Boot)**: Configurado con soporte para JPA, Security y JWT en el puerto 8080. Creados `Rol` y `Usuario`.
- **Frontend (React)**: Inicializado con React 18, Vite y Tailwind CSS 3.4 con página de bienvenida premium en español.
- **Base de Datos (MySQL)**: Base de datos `huesitos` inicializada. Hibernate creará la tabla `usuarios` al levantar la aplicación.

## 🛠️ Próximos Pasos (Pendientes)
- [ ] Creación de entidades JPA restantes (`Mascota`, `Dueno`, `Cita`).
- [ ] Creación de repositorios e interfaces de acceso a datos (ej. `RepositorioUsuario`).
- [ ] Lógica de negocio de autenticación y registro.
- [ ] Controladores REST y pruebas de endpoints.

## 🧠 Decisiones Clave y Notas
- Se decidió reemplazar la inyección implícita de Lombok con constructores estándar Java en los componentes de seguridad para asegurar la máxima compatibilidad de compilación directa con Maven Compiler.
