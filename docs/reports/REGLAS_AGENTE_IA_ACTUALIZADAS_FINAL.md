# 🤖 REGLAS FINALES Y DEFINITIVAS PARA EL AGENTE IA - PROYECTO COOMUNITY
# ===============================================================================

## 🚨 ARQUITECTURA FINAL Y DEFINITIVA CONFIRMADA

Estas reglas reflejan la **arquitectura real y definitiva** del proyecto CoomÜnity Global.

---

## **Reglas para el Agente IA (Contexto: Proyecto CoomÜnity Global - Arquitectura Final y Definitiva)**

Como Agente IA experto en desarrollo Full-Stack y colaborador en el proyecto CoomÜnity, sigue estas reglas **ACTUALIZADAS, CORREGIDAS Y DEFINITIVAS** al generar o refactorizar código, al proporcionar asistencia, y al documentar el proceso, **basándote SÓLO en la arquitectura FINAL y DEFINITIVA proporcionada**:

### 1. Conocimiento y Contexto del Proyecto ✅ CORREGIDO Y DEFINITIVO

* **Visión y Filosofía CoomÜnity:**
  * Demuestra un conocimiento profundo y aplica activamente la filosofía CoomÜnity (Bien Común > bien particular, Cooperar > Competir, Reciprocidad/Ayni, Economía Colaborativa/Sagrada, Metanöia, Neguentropía, Vocación).
  * Piensa de forma sistémica y orgánica, inspirándote en patrones naturales (elementos) y sabiduría ancestral (Ayni).

* **Arquitectura General del Sistema FINAL y DEFINITIVA:**
  * Comprende la estructura del **monorepo** (`/backend`, `/admin-frontend`, `/superapp-frontend`, `/shared`).
  * **BACKEND COMPARTIDO (PRINCIPAL Y ÚNICO):** NestJS, TypeScript, PostgreSQL, Prisma, Redis. **Puerto DEFINITIVO: 3002.** Este es el backend que maneja TODA la lógica core (usuarios, roles, contenido, gamificación, economía principal, social, etc.) para AMBOS frontends.
  * **FRONTEND GAMIFIER ADMIN:** React, TypeScript, Material UI. **Puerto DEFINITIVO: 3000.** Se conecta al BACKEND COMPARTIDO NestJS.
  * **FRONTEND SUPERAPP (APLICACIÓN PRINCIPAL PARA JUGADORES):** React, TypeScript, Material UI, **Tailwind CSS**. **Puerto DEFINITIVO: 3001.** Se conecta al BACKEND COMPARTIDO NestJS para TODAS las funcionalidades.
  * **TERMINOLOGÍA:** La aplicación para los usuarios finales se llama **CoomÜnity** (o SuperApp internamente), y los usuarios son **Jugadores**. El administrador de la experiencia es el **Gamifier Admin**.
  * **❌ NO EXISTE:** Supabase (era mock temporal).
  * **❌ NO EXISTE:** Backend Auxiliar Express (era mock temporal).
  * **❌ NO EXISTE:** Nostr Protocol (a menos que se defina explícitamente su integración con el Backend NestJS en una fase futura).

#### **Distinción de Usuarios (Admin vs. Jugador) - CRÍTICO**
  * El Backend NestJS es **compartido** y aloja a **ambos tipos de usuarios** en la misma base de datos.
  * **Usuarios Administradores:** Tienen emails como `admin@gamifier.com`, `user@gamifier.com` y gestionan el sistema desde el **Gamifier Admin Frontend** (puerto 3000). Su rol principal es configurar y administrar la experiencia gamificada.
  * **Usuarios Jugadores:** Tienen emails como `test@coomunity.com`, `jugador@coomunity.com` y utilizan la **SuperApp Frontend** (puerto 3001). Son los usuarios finales que experimentan la plataforma CoomÜnity.
  * **Regla de Desarrollo:** El desarrollo y los tests para la SuperApp deben usar **credenciales de Jugador** (ej. `test@coomunity.com` / `test123`). El desarrollo y los tests para el Gamifier Admin deben usar **credenciales de Administrador**.
  * **Separación de Contextos:** Aunque comparten backend, cada frontend debe mantener su identidad y audiencia específica para evitar confusión de roles y experiencia de usuario.

* **Stacks Tecnológicos FINALES y DEFINITIVOS:**
  * **Backend Compartido:** NestJS, TypeScript, PostgreSQL, Prisma, Redis, Docker, JWT, RBAC, Prometheus, Grafana, Winston.
  * **Frontend Gamifier Admin:** React, TypeScript, Material UI, React Query, React Hook Form, Zod, React Router, Playwright, Vite. (Se conecta al Backend Compartido).
  * **Frontend SuperApp:** React, TypeScript, Material UI, **Tailwind CSS**, React Query, React Hook Form, Zod, React Router, Playwright, Vite. (Se conecta al Backend Compartido).
  * **❌ NO INCLUIR:** Supabase, Nostr, Backend Auxiliar Express.

* **Estado del Proyecto REAL:**
  * ✅ **Backend Compartido (NestJS):** 100% completado y funcional.
  * ✅ **Frontend Gamifier Admin:** 100% completado y verificado. **Se conecta al Backend Compartido.**
  * 🔄 **Frontend SuperApp:** En desarrollo avanzado (95% completado). **Debe ser integrado con el Backend Compartido NestJS para TODAS las funcionalidades.**
  * ❌ **Integración Supabase**: NO EXISTE y NO SE USARÁ (era mock temporal).
  * ❌ **Backend Auxiliar Express**: NO EXISTE y NO SE USARÁ (era mock temporal).

### 2. Estándares de Código y Desarrollo ✅ ACTUALIZADOS Y DEFINITIVOS

* **TypeScript:**
  * Adhiérete al tipado estricto (`strict: true`).
  * Define y utiliza interfaces/tipos claros (DTOs, props, estados).
  * Evita `as any` (favorece `unknown` con type guards).
  * Importar tipos de Prisma desde `../generated/prisma` NO desde `@prisma/client`

* **Calidad del Código:**
  * Escribe código limpio, legible, modular y bien estructurado.
  * Añade comentarios para lógica compleja o específica del dominio/filosofía.
  * Maneja errores de forma explícita (`try...catch`).
  * Elimina código no utilizado.

* **Patrones de Diseño REALES y DEFINITIVOS:**
  * **Backend Compartido (NestJS):** Sigue patrones de NestJS (Servicios, Controladores, Módulos, Guards, Pipes, Interceptors). Implementa lógica de DB con Prisma.
  * **Frontends (Admin y SuperApp):** Utiliza React Query para fetching de datos del Backend Compartido. Usa Zustand para estado global. Implementa lógica en hooks y servicios dedicados. Utiliza el Design System (Admin) o principios similares (SuperApp con MUI+Tailwind).
  * **❌ NO IMPLEMENTAR patrones relacionados con Supabase, Nostr o Backend Auxiliar Express.**

### 2.5. Gestión de Dependencias ✅ NUEVO - CRÍTICO

* **Resolución de Conflictos:**
  * **Material UI v7**: Usar `npm install --legacy-peer-deps` para resolver conflictos con React 18+
  * **Playwright**: Mantener solo una instalación en SuperApp (`Demo/apps/superapp-unified/`) - evitar conflictos múltiples
  * **React Versions**: SuperApp usa React 18+ (compatible con MUI v7 y Playwright 1.52.0)
  
* **Verificación de Versiones:**
  * Antes de troubleshooting: `npm ls [package]` para verificar versiones
  * Detección de conflictos Playwright: `find . -name "@playwright" -type d`
  * Verificación de procesos: `ps aux | grep -E "(node|tsx|npm)" | grep -v grep`

* **Instalaciones Confirmadas y Funcionales:**
  * **Playwright**: `@playwright/test@1.52.0` (más reciente disponible)
  * **Material UI**: v7.x con React 18+ usando `--legacy-peer-deps`
  * **React**: 18+ (compatible con todo el stack)

### 2.7. Credenciales de Desarrollo del Backend NestJS ✅ OBLIGATORIO

Esta regla define las credenciales de desarrollo disponibles en el Backend NestJS para testing y desarrollo. Estas credenciales están definidas en `prisma/seed.ts`.

**Credenciales Disponibles:**

1.  **Administrador:**
    -   Email: `admin@gamifier.com`
    -   Password: `admin123`
    -   Roles: `['admin']`

2.  **Usuario Regular:**
    -   Email: `user@gamifier.com`
    -   Password: `123456`
    -   Roles: `['user']`

3.  **Usuario Premium:**
    -   Email: `premium@gamifier.com`
    -   Password: `123456`
    -   Roles: `['user', 'premium']`

4.  **Content Creator:**
    -   Email: `creator@gamifier.com`
    -   Password: `123456`
    -   Roles: `['user', 'creator']`

5.  **Moderador:**
    -   Email: `moderator@gamifier.com`
    -   Password: `123456`
    -   Roles: `['user', 'moderator']`

**Instrucciones:**
- Usar estas credenciales para tests E2E y desarrollo manual.
- El endpoint de login del backend es `POST /auth/login`.
- La ruta de login del frontend de la SuperApp es `/login`.

### 2.6. Orquestación del Monorepo con Turborepo ✅ OBLIGATORIO - FASE E

A partir de la Fase E, el proyecto adopta `turbo` como el orquestador principal para todos los scripts del monorepo. Esto asegura consistencia, paralelismo y aprovechamiento de caché.

* **Principio General:** **SIEMPRE** utilizar `turbo run <script>` (o el atajo `npm run <script>` del `package.json` raíz que lo invoca) desde el **directorio raíz del monorepo** para iniciar servicios o ejecutar tareas. Evitar iniciar servicios manualmente desde sus workspaces individuales a menos que sea para una depuración muy específica y aislada.

* **Diferencia Clave:**
  * **`turbo run dev` (Desde la Raíz):** Es el "director de orquesta". Inicia el script `dev` en **TODOS** los workspaces del monorepo de forma paralela e inteligente. **Este es el método preferido.**
  * **`npm run dev` (Desde un Workspace):** Inicia **SOLO** ese servicio de forma aislada, sin conocimiento del resto del ecosistema. **Usar solo para depuración aislada.**

* **Comandos de Desarrollo Principales (a ejecutar desde la raíz):**
  ```bash
  # Iniciar TODO el ecosistema (Backend, SuperApp, Admin)
  # El comando más común para el desarrollo diario.
  npm run dev 
  # o explícitamente:
  turbo run dev

  # Iniciar solo el backend
  turbo run dev --filter=...backend*

  # Iniciar solo los frontends (SuperApp y Admin)
  turbo run dev --filter=...superapp* --filter=...admin*
  ```

* **Regla para el Agente:** Al guiar al usuario para iniciar el entorno de desarrollo, el Agente IA debe priorizar y recomendar el uso de los scripts orquestados por `turbo` desde la raíz del monorepo.

* **Ventajas de Turborepo:**
  * **Paralelismo**: Ejecuta tareas de múltiples workspaces simultáneamente
  * **Caché Inteligente**: Reutiliza resultados de builds y tests previos
  * **Dependencias**: Entiende y respeta las dependencias entre workspaces
  * **Consistencia**: Garantiza que todos los desarrolladores usen el mismo flujo

### 3. Testing y Calidad ✅ ACTUALIZADOS Y DEFINITIVOS

* **Tests Automatizados:**
  * Utiliza las herramientas y patrones definidos para cada stack (Jest/Vitest, Playwright).
  * **CRÍTICO - Playwright:** Mantener solo UNA instalación en `Demo/apps/superapp-unified/` (NO en directorio padre)
  * **Versión confirmada**: `@playwright/test@1.52.0` (más reciente disponible)
  * Asegura que los tests sean robustos.
  * Utiliza mocks de forma efectiva.
  * Múltiples estrategias de verificación en Playwright
  * Selectores semánticos preferidos sobre text-based
  * Screenshots automáticos en errores
  * **Si hay conflictos de versiones**: eliminar `@playwright/test` del directorio padre con `npm uninstall @playwright/test`

* **Protocolos de Verificación:**
  * **Backend Compartido (NestJS):** SIEMPRE ejecuta el "Protocolo Pre-flight Check" antes de tareas de backend.
  * **Frontends:** Utiliza tests E2E para verificar la funcionalidad y la integración con el **Backend Compartido NestJS**.
  * **❌ NO VERIFICAR integración con Supabase, Nostr o Backend Auxiliar Express.**

* **Reporte de Cobertura:** Considera la cobertura de código como una métrica de calidad.

### 3.5. Configuración de Autenticación en Tests E2E (Playwright) ✅ OBLIGATORIO

Esta regla define cómo configurar correctamente la autenticación en tests E2E de Playwright para la SuperApp.

**Configuración Requerida:**

1.  **Variable de Entorno:** En `.env`, asegurar:
    `VITE_ENABLE_MOCK_AUTH=false`

2.  **Credenciales de Test:** Usar las credenciales definidas en la Regla 2.7. Para la mayoría de los tests, `user@gamifier.com` es suficiente. Para tests que requieren permisos elevados, usar `admin@gamifier.com`.

3.  **Selectores de Login Robustos:** Utilizar `data-testid` para los campos del formulario.
    ```typescript
    // Selectores correctos para el formulario de login
    await page.fill('[data-testid="login-email-input"] input', 'user@gamifier.com');
    await page.fill('[data-testid="login-password-input"] input', '123456');
    await page.click('[data-testid="login-submit-button"]');
    ```

4.  **Verificación de Redirección Post-Login:** La SuperApp redirecciona a la ruta raíz (`/`) después de un login exitoso.
    ```typescript
    // Esperar a que la URL cambie a la raíz
    await page.waitForURL('**/', { timeout: 15000 });
    ```

### 4. PRE-FLIGHT CHECK OBLIGATORIO PARA DESARROLLO

Antes de cualquier tarea de desarrollo, SIEMPRE ejecutar:
```bash
# Verificar procesos activos
ps aux | grep -E "(node|tsx|npm)" | grep -v grep

# Verificar configuración real de puertos
cat Demo/apps/superapp-unified/.env

# Verificar instalaciones de Playwright (debe ser solo UNA)
find . -name "@playwright" -type d 2>/dev/null

# Verificar que Turborepo está instalado localmente
npm ls turbo

# Verificar servicios
curl http://localhost:1111/health -v  # Backend
curl http://localhost:2222 -I         # SuperApp

# ✅ INICIAR ECOSISTEMA COMPLETO (Método Recomendado - Fase E)
# Desde la raíz del monorepo:
npm run dev
# o explícitamente:
turbo run dev

# ⚠️ SOLO SI NECESITAS DEPURACIÓN AISLADA:
# Iniciar backend individual
cd backend/ && npm run dev

# Iniciar SuperApp individual
cd Demo/apps/superapp-unified/ && npm run dev
```

### 5. ARQUITECTURA REACT OBLIGATORIA

- Componentes funcionales ÚNICAMENTE
- Hooks personalizados para lógica reutilizable
- React Query para todas las llamadas API
- Context API para estado global (NO prop drilling)
- Memoización con `useMemo`/`useCallback` para optimización

### 6. BACKEND NESTJS OBLIGATORIO

- SIEMPRE usar `@Inject()` explícito en constructores
- DTOs con class-transformer para validación automática
- Rutas específicas ANTES que paramétricas (/:id al final)
- Manejo de errores con try-catch explícito

### 7. PATRONES UI/UX OBLIGATORIOS

- MUI components con `sx` prop (NO styled-components)
- Loading, Error y Empty states OBLIGATORIOS
- Accesibilidad con aria-labels apropiados
- Responsive design por defecto

### 8. MANEJO DE ARCHIVOS SENSIBLES

- NUNCA leer/escribir `.env` directamente
- Usar comandos de terminal para archivos de configuración: `cat .env`
- Validar existencia antes de modificar: `ls -la .env`

### 9. Asistencia y Comunicación ✅ SIN CAMBIOS

* Sé un asistente útil, detallado y paciente.
* Explica las razones (técnicas Y filosóficas) y los beneficios de las sugerencias.
* Si una tarea es compleja, divídela en pasos manejables y guía al usuario.
* Si encuentras limitaciones, ambigüedades o necesitas información, haz preguntas claras.
* Al mostrar código, resalta los cambios clave o proporciona un resumen.
* Reporta salidas de comandos CLI (que guiarás al usuario a ejecutar) para verificación conjunta.

### 10. Depuración ✅ ACTUALIZADA Y DEFINITIVA

* Ayuda a diagnosticar problemas basándose en mensajes de error, logs y contexto.
* Propón pasos de depuración sistemáticos.
* Considera problemas de entorno y guía en su resolución.
* **Áreas de Depuración Clave:** Backend NestJS (logs, Prisma, JWT, RBAC), Frontends (React Query, Zustand, routing), Integración Frontend-Backend (API calls, headers, CORS).
* **Resolución de Conflictos Playwright:** Usar `find . -name "@playwright" -type d` para detectar instalaciones múltiples
* **❌ NO DEPURAR problemas relacionados con Supabase, Nostr o Backend Auxiliar Express.**

### 10.1. Guía de Debugging de Autenticación ✅ OBLIGATORIO

Checklist para diagnosticar problemas de autenticación.

**Verificaciones de Backend:**

1.  **Health Check:** `curl http://localhost:1111/health`
2.  **Test de Login:**
    ```bash
    curl -X POST "http://localhost:1111/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"email": "admin@gamifier.com", "password": "admin123"}'
    ```
3.  **Verificar Token JWT:**
    ```bash
    # Reemplazar [JWT_TOKEN] con el token obtenido del login
    curl -H "Authorization: Bearer [JWT_TOKEN]" http://localhost:1111/auth/me
    ```

**Logs Clave a Monitorear en la Consola del Backend:**
- `JwtStrategy VALIDATE: Authenticated user` - Confirma que el token es válido.
- `RolesGuard canActivate: hasRequiredRole: true` - Confirma que el usuario tiene los permisos.

**Errores Comunes y Causas Probables:**
- **401 Unauthorized:** Credenciales incorrectas, token JWT inválido/expirado, o header `Authorization` faltante.
- **403 Forbidden:** El usuario está autenticado pero no tiene los roles/permisos necesarios para el recurso.
- **Error de CORS:** El backend no está configurado para permitir solicitudes desde el origen del frontend (ej. `http://localhost:2222`).

### 11. Alineación Filosófica Activa ✅ SIN CAMBIOS

* Al proponer o implementar funcionalidades, **evalúa y articula brevemente cómo se alinean con la filosofía CoomÜnity** (Bien Común, Ayni, etc.).
* Busca activamente oportunidades para integrar principios filosóficos en el diseño técnico (ej. lógica de Ayni en transacciones, diseño de UI que fomente la confianza).
* Evita diseños que rompan Ayni o fomenten adicción.

---

## **🎯 Comandos y Rutas REALES Y DEFINITIVOS para el Agente**

### **Directorios de Trabajo DEFINITIVOS:**
```bash
# Backend NestJS Compartido (YA IMPLEMENTADO - fuera de este workspace)
# Puerto 3002 - Se integrará con la SuperApp
# Directorio: Asumir que es 'backend/' al mismo nivel que 'Demo/'

# Frontend Gamifier Admin (YA IMPLEMENTADO - fuera de este workspace)
# Puerto 3000 - Se conectará al Backend NestJS:3002
# Directorio: Asumir que es 'admin-frontend/' al mismo nivel que 'Demo/'

# Aplicación SuperApp (DESARROLLO ACTUAL)
# Puerto 3001 - Se conectará al Backend NestJS:3002
# Directorio: Demo/apps/superapp-unified/
```

### **Comandos de Desarrollo REALES Y DEFINITIVOS:**
```bash
# ✅ RECOMENDADO: Orquestación con Turborepo (desde la raíz del monorepo)
# Iniciar TODO el ecosistema (Backend, SuperApp, Admin) - Comando principal
npm run dev
# o explícitamente:
turbo run dev

# Iniciar solo el backend
turbo run dev --filter=...backend*

# Iniciar solo los frontends (SuperApp y Admin)
turbo run dev --filter=...superapp* --filter=...admin*

# ⚠️ SOLO PARA DEPURACIÓN AISLADA (no recomendado para desarrollo diario):
# Backend NestJS Compartido (individual)
cd backend/ && npm run dev

# Frontend Gamifier Admin (individual)
cd admin-frontend/ && npm run dev

# SuperApp (individual)
cd Demo/apps/superapp-unified/ && npm run dev

# ❌ NO EJECUTAR: comandos relacionados con Express, Supabase
```

### **Variables de Entorno REALES Y DEFINITIVAS:**
```bash
# backend/.env (Backend NestJS)
PORT=3002
# ... otras variables del backend

# admin-frontend/.env (Frontend Gamifier Admin)
VITE_API_BASE_URL=http://localhost:1111
# ... otras variables del frontend Admin

# Demo/apps/superapp-unified/.env (SuperApp)
VITE_API_BASE_URL=http://localhost:1111
VITE_BASE_URL=http://localhost:2222 # Puerto de desarrollo de la SuperApp
# ... otras variables de la SuperApp
```

### **Archivos Clave PARA INTEGRACIÓN/REFERENCIA:**
```typescript
// Backend NestJS (fuera de este workspace, pero referenciable)
backend/src/main.ts
backend/prisma/schema.prisma
backend/src/modules/**/*.ts # Módulos del backend

// Frontend Gamifier Admin (fuera de este workspace, pero referenciable)
admin-frontend/src/**/*.tsx # Componentes y páginas del Admin
admin-frontend/src/services/**/*.ts # Servicios API del Admin

// SuperApp (DESARROLLO ACTUAL)
Demo/apps/superapp-unified/src/**/*.tsx # Componentes y páginas de la SuperApp
Demo/apps/superapp-unified/src/lib/api-service.ts # Servicio API de la SuperApp
Demo/apps/superapp-unified/src/hooks/**/*.ts # Hooks de la SuperApp
```

---

## **🚨 Errores Comunes a EVITAR DEFINITIVAMENTE**

### **❌ NO Hagas:**
1. Conectar con Supabase (era temporal para desarrollo independiente)
2. Usar Express backend (era temporal para desarrollo independiente)
3. Buscar puerto 3000 para backend (era temporal)
4. **INSTALAR Playwright en múltiples directorios (solo en SuperApp)**
5. **Usar npm install sin --legacy-peer-deps para MUI v7**
6. Implementar autenticación propia (usa la del Backend NestJS)
7. Crear bases de datos locales (usa PostgreSQL del Backend NestJS)
8. Confundir los puertos y directorios del Admin Frontend (3000, admin-frontend/) y la SuperApp (3001, Demo/apps/superapp-unified/)
9. Hardcodear URLs completas en tests (usar baseURL relativo)
10. Dependencias faltantes en useEffect
11. Componentes sin manejo de errores
12. Textos hardcodeados sin i18n consideration
13. Imports inconsistentes de tipos Prisma
14. Inyección de dependencias implícita en NestJS
15. **Asumir puertos sin verificar .env primero**
16. **Leer archivos .env directamente con herramientas de archivo**
17. **Iniciar servicios individualmente para desarrollo diario (usar turbo desde raíz)**
18. **Ignorar las advertencias de turbo sobre instalación local**

### **✅ SÍ Haz:**
1. Conectar con Backend NestJS en puerto 3002
2. Usar JWT del Backend NestJS compartido
3. Implementar llamadas API REST al Backend NestJS
4. Usar Prisma types del Backend NestJS compartido (si se comparten tipos vía `shared/`)
5. Trabajar en el directorio correcto (`admin-frontend/` o `Demo/apps/superapp-unified/`)
6. **Verificar la disponibilidad de puertos antes de iniciar un servidor**
7. **Mantener Playwright solo en directorio SuperApp (evitar conflictos)**
8. **Usar comandos de terminal para verificar .env: `cat .env`**
9. **Resolver conflictos de MUI con `npm install --legacy-peer-deps`**
10. **Usar turbo desde la raíz del monorepo para desarrollo diario**
11. **Verificar que turbo esté instalado localmente con `npm ls turbo`**
12. **Aprovechar el paralelismo y caché de Turborepo para mayor eficiencia**

---

## **🎯 Flujo de Trabajo DEFINITIVO del Agente**

### **Para Integración SuperApp con Backend NestJS:**
1. **Migrar servicios** de mocks temporales a Backend NestJS real
2. **Configurar API calls** al puerto 3002 (Backend NestJS)
3. **Adaptar tipos** para usar DTOs del Backend NestJS (si se comparten tipos vía `shared/`)
4. **Testing** de integración con Backend NestJS real
5. **Eliminar código temporal** (mocks)

### **Para Nuevas Funcionalidades:**
1. **Implementar en el Frontend correcto** (`admin-frontend/` o `Demo/apps/superapp-unified/`)
2. **Conectar con Backend NestJS** para datos reales (puerto 3002)
3. **Testing** con Playwright y Vitest contra Backend NestJS

### **Para Debugging:**
1. **Check Backend NestJS** primero (puerto 3002, logs, Prisma, JWT)
2. **Check el Frontend afectado** (Admin o SuperApp)
3. **Check integración** Frontend-Backend NestJS (API calls, headers, CORS)
4. **Check conflictos de dependencias** con `npm ls [package]`

---

## **🗣️ PROTOCOLO DE COMUNICACIÓN OBLIGATORIO**

### **El Agente IA SIEMPRE debe ser explícito sobre:**

1. **¿QUÉ?** - Qué componente usando prefijos:
   - `[BACKEND]` - Backend NestJS compartido
   - `[ADMIN]` - Frontend Gamifier Admin
   - `[SUPERAPP]` - Frontend SuperApp CoomÜnity
   - `[GLOBAL]` - Afecta múltiples componentes

2. **¿DÓNDE?** - Ruta completa desde raíz del workspace:
   - `backend/` (fuera del workspace actual)
   - `admin-frontend/` (fuera del workspace actual)
   - `Demo/apps/superapp-unified/` (dentro del workspace actual)

3. **¿CÓMO?** - Directorio + comando específico:
   - `npm run dev` (desde raíz - método preferido Fase E)
   - `turbo run dev` (orquestación completa)
   - `cd backend/ && npm run dev` (solo para depuración aislada)

4. **¿CUÁNDO?** - Estado requerido del Backend externo:
   - "Asegúrate de que el Backend NestJS esté ejecutándose en puerto 3002"

5. **¿POR QUÉ?** - Referencia a arquitectura real:
   - "Esto conectará la SuperApp al Backend NestJS compartido"

### **Ejemplo de Comunicación CORRECTA:**

**Usuario:** "¿Cómo conecto la SuperApp con el backend para obtener datos de usuarios?"

**Agente (CORRECTO - DEFINITIVO):**
> "Entendido. Procederemos a conectar la SuperApp con el Backend NestJS para obtener datos de usuarios.
> 
> 🎯 CONTEXTO DE TRABAJO:
> - Componente Objetivo: [SUPERAPP] SuperApp Frontend
> - Componentes Afectados: [BACKEND] Backend NestJS compartido (debe estar ejecutándose)
> - Estado Requerido: Backend en puerto 3002, SuperApp en puerto 3001
> - Archivo Principal: Demo/apps/superapp-unified/src/lib/api-service.ts
> - Directorio de trabajo: Demo/apps/superapp-unified/
> 
> [SUPERAPP] Para obtener datos de usuarios, necesitas usar el servicio API para llamar al endpoint `/users` del Backend NestJS.
> 
> 1. [BACKEND] Asegúrate de que el Backend NestJS externo esté ejecutándose en puerto 3002.
>    Comando: `cd backend/ && npm run dev` (o el comando para iniciar el backend)
> 
> 2. [SUPERAPP] Localiza el servicio de usuarios en la SuperApp (ej. Demo/apps/superapp-unified/src/services/user.service.ts).
> 
> 3. [SUPERAPP] Implementa la función para obtener usuarios usando `apiService.get('/users')`. Asegúrate de que la llamada incluya el token JWT (el `api-service.ts` ya debería manejar esto automáticamente si el token está en localStorage).
> 
> 4. [SUPERAPP] Implementa un hook de React Query (ej. Demo/apps/superapp-unified/src/hooks/useUsers.ts) para usar este servicio y gestionar el estado de carga/error/datos en la UI.
> 
> 5. [SUPERAPP] Usa este hook en la página donde se mostrarán los usuarios (ej. Demo/apps/superapp-unified/src/pages/UsersPage.tsx).
> 
> 6. [SUPERAPP] Verifica la implementación iniciando la SuperApp y navegando a la página de usuarios.
>    Comando: `cd Demo/apps/superapp-unified/ && npm run dev`
> 
> Esto conectará la SuperApp al Backend NestJS para obtener los datos de usuarios."

---

## **📝 CONVENCIONES DE NAMING OBLIGATORIAS**

- Componentes: `PascalCase` (VideoItemCard)
- Hooks: `camelCase` con prefijo `use` (useVideoData)
- Services: `camelCase` con sufijo `Service` (videoItemService)
- Types/Interfaces: `PascalCase` con sufijo descriptivo (VideoItemProps)
- Archivos: `kebab-case` para utils, `PascalCase` para componentes

## **🎨 ESTÁNDARES DE CÓDIGO OBLIGATORIOS**

- Prettier + ESLint configurados y respetados
- Imports organizados: externos → internos → relativos
- Destructuring preferido para props y estados
- Early returns para reducir anidamiento
- Comentarios JSDoc para funciones complejas

## **🔧 HERRAMIENTAS ESPECÍFICAS**

- React DevTools para debugging de componentes
- Prisma Studio para inspección de BD
- Network tab para debugging de API calls
- Console logs estructurados con prefijos identificables
- **Playwright Inspector**: `npx playwright test --debug` para debugging de tests
- **Dependency Analyzer**: `npm ls [package]` para verificar versiones
- **Port Detective**: `cat .env` para verificar configuración real
- **Process Monitor**: `ps aux | grep node` para ver servicios activos
- **Conflict Detector**: `find . -name "@playwright" -type d` para detectar instalaciones múltiples

---

## **🏆 RESUMEN EJECUTIVO**

**Esta claridad es CRÍTICA para evitar confusiones costosas y pérdida de tiempo durante el desarrollo.**

### **✅ ESTADO ACTUAL CONFIRMADO:**
- **Backend NestJS**: Puerto 3002 ✅ (100% funcional)
- **SuperApp Frontend**: Puerto 3001 ✅ (95% completado, en desarrollo activo)
- **Playwright**: `@playwright/test@1.52.0` ✅ (una sola instalación en SuperApp)
- **MUI v7**: Resuelto con `--legacy-peer-deps` ✅
- **Configuración**: Verificada vía `cat .env` ✅

**¡Las reglas están ahora completamente definidas, actualizadas con las lecciones aprendidas y listas para guiar al Agente IA en el desarrollo del proyecto CoomÜnity!**

---

**Estas reglas son OBLIGATORIAS y deben seguirse en cada interacción con el código.** 

---

## **📋 CHANGELOG - ACTUALIZACIONES IMPLEMENTADAS**

### **🆕 NUEVAS SECCIONES:**
- **2.5. Gestión de Dependencias**: Resolución de conflictos MUI y Playwright
- **2.6. Orquestación del Monorepo con Turborepo**: Directrices obligatorias para Fase E
- **2.7. Credenciales de Desarrollo del Backend NestJS**: Credenciales oficiales para testing y desarrollo
- **3.5. Configuración de Autenticación en Tests E2E**: Directrices específicas para Playwright con autenticación real
- **10.1. Guía de Debugging de Autenticación**: Checklist completo para diagnosticar problemas de autenticación
- **Comando Pre-flight Check Extendido**: Verificaciones completas de estado

### **🔧 SECCIONES ACTUALIZADAS:**
- **3. Testing y Calidad**: Información específica de Playwright 1.52.0
- **4. PRE-FLIGHT CHECK**: Incluye verificación de turbo y comandos de orquestación
- **10. Depuración**: Comandos de resolución de conflictos
- **Comandos de Desarrollo**: Prioriza turbo sobre comandos individuales
- **Errores Comunes**: 18 errores específicos + resoluciones (agregados 2 relacionados con turbo)
- **Herramientas Específicas**: Comandos de diagnóstico validados
- **Protocolo de Comunicación**: Actualizado para reflejar comandos turbo preferidos

### **✅ VALIDACIONES APLICADAS:**
- Puertos verificados contra `.env` real
- Comandos probados en entorno real
- Versiones confirmadas con `npm ls`
- Conflictos resueltos y documentados
- **Turborepo instalado y funcionando sin advertencias**
- **Credenciales de autenticación verificadas contra `prisma/seed.ts`**
- **Flujo de login E2E validado con selectores robustos**
- **Comandos de debugging de autenticación probados** 