---
trigger: always_on
description: Reglas y estándares para el desarrollo del backend en Java y Spring Boot.
---

# Reglas de Desarrollo Backend (Huesitos)

## Arquitectura y Patrones (Spring Boot)
- **Estructura de Carpetas**: Separación clara de responsabilidades en los paquetes de `huesitos-backend`:
  - `controlador` / `web`: Controladores REST.
  - `servicio`: Lógica de negocio e interfaces.
  - `repositorio`: Acceso a datos.
  - `entidades` / `modelos`: Entidades JPA de base de datos.
  - `dto`: Objetos de transferencia de datos.
- **Modularización por Dominios Funcionales**: Organizar el backend en paquetes específicos por dominio de negocio (ej. `autenticacion`, `cita`, `mascota`, `usuario`, `producto`, `transaccion`), estructurando de forma cohesiva los controladores, servicios, repositorios, entidades y DTOs correspondientes a cada dominio para reducir el acoplamiento.
- **Inyección de Dependencias**: Preferir la inyección basada en constructor utilizando Lombok (`@RequiredArgsConstructor` con variables `private final`) sobre `@Autowired` para una arquitectura más limpia.
- **Principios SOLID**: Adherirse estrictamente a los principios SOLID. Especialmente, asegurar el principio de Responsabilidad Única (SRP) separando claramente la lógica de negocio, y el principio de Inversión de Dependencias (DIP) mediante la inyección de interfaces en lugar de implementaciones directas.
- **Manejo de Errores**: Centralizar el manejo de excepciones mediante un `@ControllerAdvice` global retornando respuestas estructuradas en español.
- **Transaccionalidad**: En operaciones clínicas, financieras o de actualización crítica de estado, asegurar el uso correcto de `@Transactional` y el manejo adecuado de excepciones para evitar estados inconsistentes en la base de datos MySQL.

## Estándares de Código y Nomenclatura
- **Nombres en Español**: Todos los nombres de archivos, entidades, controladores, servicios, repositorios, variables y métodos en la medida de lo posible deben nombrarse en español (ej. usar `Usuario.java`, `AutenticacionServicio.java` en lugar de `User.java`, `AuthService.java`).
- **Seguridad**:
  - Asegurar la validación estricta de datos de entrada mediante DTOs y anotaciones de validación (`@Valid`, `@NotNull`, `@NotBlank`, etc.).
  - Configurar las reglas de acceso en `SeguridadConfig` correspondientes a cada endpoint REST.
