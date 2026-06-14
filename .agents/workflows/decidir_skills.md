---
description: Analiza los requerimientos de la tarea y selecciona cuáles skills cargar para optimizar el consumo de tokens
---

# Workflow: Decidir Skills (Ahorro de Tokens)

Este workflow analiza un requerimiento de desarrollo y decide qué skills locales específicas se deben cargar y aplicar para la tarea, optimizando el consumo de tokens del contexto al evitar leer contenidos innecesarios.

## Lista Resumida de Skills Locales (Para uso del agente)
*El agente debe consultar esta lista interna directamente sin leer los archivos de las skills.*

1. **`api-design-principles`**: Diseño óptimo de endpoints y APIs REST/GraphQL.
   * *Ruta:* [SKILL.md](file:///.agents/skills/api-design-principles/SKILL.md)
2. **`architecture-patterns`**: Principios Clean Architecture, Hexagonal, SOLID y DDD.
   * *Ruta:* [SKILL.md](file:///.agents/skills/architecture-patterns/SKILL.md)
3. **`auth-implementation-patterns`**: Autenticación, tokens JWT, sesiones y control de acceso (RBAC).
   * *Ruta:* [SKILL.md](file:///.agents/skills/auth-implementation-patterns/SKILL.md)
4. **`backend-patterns`**: Patrones genéricos de backend, APIs y rendimiento del lado servidor.
   * *Ruta:* [SKILL.md](file:///.agents/skills/backend-patterns/SKILL.md)
5. **`design-system-patterns`**: Componentes UI, variables visuales y tokens de diseño.
   * *Ruta:* [SKILL.md](file:///.agents/skills/design-system-patterns/SKILL.md)
6. **`error-handling-patterns`**: Manejo de excepciones, códigos de error y flujos de control.
   * *Ruta:* [SKILL.md](file:///.agents/skills/error-handling-patterns/SKILL.md)
7. **`frontend-design`**: Creación de maquetados responsivos y UI premium con Tailwind.
   * *Ruta:* [SKILL.md](file:///.agents/skills/frontend-design/SKILL.md)
8. **`interface-design`**: Diseño de páneles, dashboards y herramientas interactivas.
   * *Ruta:* [SKILL.md](file:///.agents/skills/interface-design/SKILL.md)
9. **`java-springboot`**: Desarrollo MVC en Spring Boot, inyección por constructor e inversión de dependencias.
   * *Ruta:* [SKILL.md](file:///.agents/skills/java-springboot/SKILL.md)
10. **`monorepo-management`**: Gestión de monorepos multiproyecto y dependencias cruzadas.
    * *Ruta:* [SKILL.md](file:///.agents/skills/monorepo-management/SKILL.md)
11. **`mysql`**: Base de datos MySQL, transacciones, optimización de esquemas y tipos de datos.
    * *Ruta:* [SKILL.md](file:///.agents/skills/mysql/SKILL.md)
12. **`react-state-management`**: Manejo de estado en React (Zustand, React Query, Context).
    * *Ruta:* [SKILL.md](file:///.agents/skills/react-state-management/SKILL.md)
13. **`responsive-design`**: Diseño responsivo y layouts fluidos móvil-primero con Tailwind CSS.
    * *Ruta:* [SKILL.md](file:///.agents/skills/responsive-design/SKILL.md)
14. **`resumen-memoria`**: Actualización estructurada del progreso en `memoria.md`.
    * *Ruta:* [SKILL.md](file:///.agents/skills/resumen-memoria/SKILL.md)
15. **`skill-creator`**: Diseño y optimización de nuevas directrices/skills para el agente.
    * *Ruta:* [SKILL.md](file:///.agents/skills/skill-creator/SKILL.md)
16. **`springboot-security`**: Seguridad en Spring Boot (CORS, CSRF, JWT, validación DTO).
    * *Ruta:* [SKILL.md](file:///.agents/skills/springboot-security/SKILL.md)
17. **`sql-optimization-patterns`**: Ajuste y optimización de consultas SQL complejas o lentas.
    * *Ruta:* [SKILL.md](file:///.agents/skills/sql-optimization-patterns/SKILL.md)
18. **`systematic-debugging`**: Flujo de depuración sistemática para resolver errores y lints.
    * *Ruta:* [SKILL.md](file:///.agents/skills/systematic-debugging/SKILL.md)
19. **`tailwind-design-system`**: Tokens, tipografías y estilos estructurados en Tailwind CSS.
    * *Ruta:* [SKILL.md](file:///.agents/skills/tailwind-design-system/SKILL.md)
20. **`vercel-react-best-practices`**: Buenas prácticas de rendimiento e hidratación en React/Next.js.
    * *Ruta:* [SKILL.md](file:///.agents/skills/vercel-react-best-practices/SKILL.md)
21. **`workflow-patterns`**: Flujos de trabajo, TDD y procesos de verificación.
    * *Ruta:* [SKILL.md](file:///.agents/skills/workflow-patterns/SKILL.md)

---

## Pasos de Ejecución del Workflow

1. **Solicitar el requerimiento del usuario**:
   El agente debe pedir al usuario el prompt o la descripción de la tarea a realizar (por ejemplo: *"Vamos a cambiar la lógica del backend"*).

2. **Identificar las Skills necesarias**:
   Utilizando la lista resumida de arriba (sin leer los archivos físicos), el agente seleccionará las skills que apliquen directamente al requerimiento.

3. **Generar un Prompt Mejorado**:
   El agente reescribirá el prompt del usuario haciéndolo más claro, estructurado y técnico. 

4. **Incrustar Enlaces a las Skills**:
   En cada sección del prompt mejorado donde se recomiende aplicar una skill, el agente debe insertar una instrucción explícita con el enlace relativo.
   * *Ejemplo:* `"Para la seguridad del endpoint, lee y aplica la skill [springboot-security](file:///.agents/skills/springboot-security/SKILL.md)"`

5. **Entregar el resultado**:
   El agente presentará únicamente el prompt mejorado en el chat para que el usuario pueda copiarlo o indicar al agente que proceda con él.
