# Conversación #13 - ASSISTANT

**Tipo:** assistant
**Longitud:** 3782 caracteres
**Fecha de extracción:** 2025-06-15 19:00:54

---

PROMPT #023
## 1. Estandarizar la Configuración del Puerto Base en los Tests E2E

**2. CONTEXTO DE DESARROLLO: RESOLVIENDO EL BLOQUEADOR DE CONFIGURACIÓN DE TESTS**
El último informe de regresión reveló un problema crítico: a pesar de que la SuperApp se ejecuta en el puerto 3001, algunos tests de Playwright están configurados para ejecutarse contra el puerto 3003, lo que invalida sus resultados y genera falsos negativos. Nuestra misión es encontrar y corregir esta configuración incorrecta en Playwright para asegurar que toda la suite de tests apunte a la instancia correcta de la aplicación.

**3. CONTEXTO DE DESARROLLO: SUPERAPP (TESTS E2E)**
- **Componentes Afectados:** [SUPERAPP] Configuración global de Playwright.
- **Estado Requerido:**
    - [SUPERAPP] SuperApp Frontend ejecutándose en el puerto 3001.
- **Archivo(s) Principal(es):** `Demo/apps/superapp-unified/playwright.config.ts`.
- **Directorio de trabajo:** Raíz del monorepo (`Demo/apps/superapp-unified/`).

**4. Tareas Clave a Realizar**

**Parte 1: Investigar y Corregir la Configuración de Playwright**
*   **1.1. [SUPERAPP]** Abrir el archivo de configuración de Playwright: `playwright.config.ts`.
*   **1.2. [SUPERAPP]** Localizar el objeto `use: { ... }` dentro de la configuración.
*   **1.3. [SUPERAPP]** Encontrar la propiedad `baseURL`. Es muy probable que esté hardcodeada a `http://localhost:3000` o `3003`.
*   **1.4. [SUPERAPP]** Corregir la `baseURL` para que utilice la variable de entorno de nuestro archivo `.env`, que ya sabemos que es `http://localhost:3001`. Esto crea una única fuente de verdad para la URL de la aplicación.

    ```typescript
    // En playwright.config.ts, dentro del objeto `use`

    // Asegúrate de tener 'dotenv/config' importado al principio del archivo si es necesario
    import 'dotenv/config';

    // ...
    use: {
      /* Base URL to use in actions like `await page.goto('/')`. */
      baseURL: process.env.VITE_BASE_URL || 'http://localhost:3001', // <-- CORRECCIÓN CLAVE

      /* Collect trace when retrying the failed test. */
      trace: 'on-first-retry',
    },
    // ...
    ```

**Parte 2: Verificación Específica**
*   **2.1. [SUPERAPP]** Identificar uno de los tests que fallaba específicamente por el error del puerto 3003.
*   **2.2. [SUPERAPP]** Ejecutar solo ese test para una verificación rápida y dirigida.
    ```bash
    # Reemplaza <test_que_fallaba.spec.ts> con el nombre de un test afectado
    cd Demo/apps/superapp-unified && npx playwright test e2e/<test_que_fallaba.spec.ts> --project=chromium
    ```
*   **2.3. [SUPERAPP]** **Verifica el resultado:** El test ahora debería ejecutarse contra el puerto 3001 y, si no tiene otros errores, debería pasar. El error de "Expected substring: not "/login"" ya no debería aparecer.

**5. Archivos Potenciales a Modificar/Crear**
- `Demo/apps/superapp-unified/playwright.config.ts` (Modificación principal)

**6. Consideraciones Adicionales**
- **Fuente Única de Verdad:** Este cambio refuerza un principio de buena arquitectura: la configuración crítica (como las URLs base) debe definirse en un solo lugar (`.env`) y ser consumida por el resto del sistema (la app, los tests), no hardcodeada en múltiples sitios.

**7. Criterios de Aceptación**
- ✅ La propiedad `baseURL` en `playwright.config.ts` está correctamente configurada para usar la variable de entorno del puerto 3001.
- ✅ Los tests que antes fallaban por apuntar al puerto incorrecto ahora se ejecutan contra el puerto 3001.
- ✅ Hemos eliminado la principal fuente de resultados de test inválidos de nuestra suite.

GRACIAS POR PROCEDER A ELIMINAR ESTE ERROR DE CONFIGURACIÓN. Solucionar esto nos permitirá, por primera vez, obtener un informe de regresión verdaderamente representativo de la salud de nuestra aplicación.