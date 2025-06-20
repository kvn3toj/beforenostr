# Conversación #4 - ASSISTANT

**Tipo:** assistant
**Longitud:** 3605 caracteres
**Fecha de extracción:** 2025-06-15 19:00:54

---

Algo para agregar a este prompt? Alguna extension de Cursor que sea util usar en este plan?

PROMPT #017
## 1. Implementar la Estructura Base del Módulo `Pioneer` y su Schema de Datos (Versión Definitiva)

**2. CONTEXTO DE DESARROLLO: CIMENTANDO EL "VIAJE DEL PIONERO" (ARQUITECTURA MEJORADA)**
Basado en tu diseño arquitectónico definitivo, el primer paso es construir la estructura de carpetas, el módulo NestJS y los modelos de base de datos para el sistema "Pioneer". Esta tarea se enfoca en ejecutar los pasos 1, 2, 3 y 4 de tu plan de implementación: generar la estructura del módulo, actualizar `schema.prisma` y `tsconfig`, y ejecutar la migración.

**3. CONTEXTO DE DESARROLLO: BACKEND**
- **Componentes Afectados:** [BACKEND] Creación de la estructura del módulo `Pioneer`, modificación de `schema.prisma` y `tsconfig.backend.json`.
- **Estado Requerido:**
    - [BACKEND] Backend NestJS funcional en puerto 3002.
- **Archivo(s) Principal(es):** `prisma/schema.prisma`, `tsconfig.backend.json`.
- **Directorio de trabajo:** Raíz del monorepo.

**4. Tareas Clave a Realizar (Siguiendo tu Plan Mejorado)**

**Parte 1: Generar la Estructura del Módulo con la CLI**
*   **1.1. [BACKEND]** Ejecutar los comandos de la CLI de NestJS para generar la estructura base.
    ```bash
    npx nest g module pioneer
    npx nest g service pioneer
    npx nest g controller pioneer
    ```
*   **1.2. [BACKEND]** Crear los directorios adicionales para DTOs e interfaces.
    ```bash
    mkdir -p src/pioneer/dto
    mkdir -p src/pioneer/interfaces
    ```

**Parte 2: Actualizar el `tsconfig.backend.json`**
*   **2.1. [BACKEND]** Abrir `tsconfig.backend.json` y añadir `"src/pioneer/**/*"` al array `include` para asegurar que el nuevo módulo sea compilado.

**Parte 3: Actualizar el Schema de Prisma y Migrar**
*   **3.1. [BACKEND]** Abrir `prisma/schema.prisma`.
*   **3.2. [BACKEND]** Añadir los 2 `enum` y los 5 nuevos modelos que diseñaste (`PioneerProgress`, `PioneerKit`, `PioneerKitPurchase`, `PioneerAchievement`, `PioneerStats`) al final del archivo.
*   **3.3. [BACKEND]** Añadir las nuevas relaciones al modelo `User` existente.
*   **3.4. [BACKEND]** Ejecutar la migración y la generación del cliente.
    ```bash
    npx prisma migrate dev --name add-pioneer-system
    npx prisma generate
    ```

**Parte 4: Verificación Final**
*   **4.1. [BACKEND]** Verificar que `PioneerModule` se haya importado correctamente en `src/app.module.ts`.
*   **4.2. [BACKEND]** Compilar y ejecutar el backend para asegurar que no haya errores.
    ```bash
    npm run build
    npm run dev
    ```

**5. Archivos Potenciales a Modificar/Crear**
- `src/pioneer/pioneer.module.ts` (Nuevo)
- `src/pioneer/pioneer.service.ts` (Nuevo)
- `src/pioneer/pioneer.controller.ts` (Nuevo)
- `src/pioneer/dto/` (Nuevo)
- `src/pioneer/interfaces/` (Nuevo)
- `prisma/schema.prisma` (Modificación)
- `tsconfig.backend.json` (Modificación)
- `src/app.module.ts` (Verificación)

**7. Criterios de Aceptación**
- ✅ Estructura de Módulo: Los archivos del módulo Pioneer han sido generados.
- ✅ Schema de Base de Datos: Los 5 nuevos modelos y 2 enums están en `schema.prisma`.
- ✅ Relaciones: El modelo `User` tiene las nuevas relaciones.
- ✅ Migración: La migración de la base de datos se ejecuta sin errores.
- ✅ Generación de Cliente: El cliente de Prisma se regenera con los nuevos modelos.
- ✅ Compilación: El proyecto NestJS compila sin errores.
- ✅ Importación: El `PioneerModule` se importa correctamente en `app.module.ts`.

GRACIAS POR PROCEDER CON LA EJECUCIÓN DE TU PROPIO DISEÑO ARQUITECTÓNICO. ¡Vamos a materializarlo!