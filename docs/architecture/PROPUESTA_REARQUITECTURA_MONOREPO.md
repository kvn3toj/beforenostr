# Propuesta de Re-arquitectura del Monorepo CoomÜnity

**Fecha:** 2023-10-27
**Guardianes Involucrados:** COSMOS (Líder), PHOENIX, ANA, SAGE, MIRA

## 1. 🎯 Propósito de la Re-arquitectura

Esta propuesta tiene como objetivo optimizar la estructura del monorepo CoomÜnity para mejorar la eficiencia, mantenibilidad, escalabilidad y claridad del código. Busca alinear la organización del repositorio con las mejores prácticas de la industria y los principios filosóficos de CoomÜnity, facilitando el trabajo de los Guardianes Digitales y futuros desarrolladores.

## 2. 现状 Análisis de la Estructura Actual (Resumen)

Tras un análisis exhaustivo, se identificaron los siguientes puntos clave sobre la estructura actual:

*   **Estructura de Directorios:**
    *   Aplicaciones distribuidas en `apps/` (`admin-frontend`, `guardians-portal-frontend`) y `Demo/apps/` (`superapp-unified`).
    *   Backend ubicado en un directorio `backend/` a nivel raíz.
    *   Paquetes compartidos en `packages/` (`shared-types`, `sync-engine`).
    *   Directorio `prisma/` a nivel raíz.
    *   Directorios `NARRATIVA/`, `_temp_frontend_src_files/`, `src_mixed_backup/` y un `Demo/` general a nivel raíz con contenido misceláneo.
*   **Gestión de Dependencias:**
    *   El `package.json` raíz contiene numerosas dependencias específicas del backend.
    *   `apps/admin-frontend` tiene dependencias directas de frameworks de backend (`@nestjs/*`, `@prisma/client`), lo cual es un anti-patrón severo.
*   **Recursos Compartidos:**
    *   `packages/shared-types` existe pero está subutilizado (ej. tipos de entidad como `User` están duplicados en los frontends).
    *   No existen paquetes dedicados para UI compartida (`packages/ui-core`) o utilidades genéricas (`packages/utils`), llevando a posible duplicación.
*   **Convenciones y Configuración:**
    *   Las convenciones de nomenclatura son generalmente buenas.
    *   La configuración de TypeScript (`tsconfig.json`) podría ser más estricta y las referencias de proyecto están incompletas.
    *   La configuración de workspaces entre `pnpm-workspace.yaml` y el `package.json` raíz presenta inconsistencias.

## 3. ⚠️ Puntos de Fricción Identificados

La estructura actual presenta varias áreas de mejora:

1.  **Complejidad Innecesaria:** La distribución de aplicaciones (`Demo/apps/` vs `apps/`) y la presencia de directorios como `NARRATIVA/` y `Demo/` (raíz) desordenan la estructura principal.
2.  **Acoplamiento Indebido:** Las dependencias del backend en `admin-frontend` y en el `package.json` raíz crean un alto acoplamiento y dificultan el mantenimiento.
3.  **Duplicación de Código:** La falta de un `packages/ui-core` y `packages/utils` robustos, junto con la subutilización de `packages/shared-types`, probablemente resulte en código duplicado.
4.  **Deuda Técnica Organizacional:** Configuraciones de TypeScript laxas, referencias de proyecto incompletas y la gestión de dependencias no óptima contribuyen a la deuda técnica.
5.  **Dificultad de Onboarding:** Una estructura menos intuitiva y con anti-patrones puede hacer que la incorporación de nuevos desarrolladores sea más lenta.
6.  **Impacto en Herramientas:** Una estructura y gestión de dependencias no óptimas pueden limitar la efectividad de Turborepo y otras herramientas del toolchain.

## 4. 💡 Propuesta de Estructura de Repositorio Mejorada

Se propone la siguiente estructura para abordar los puntos de fricción y alinearla con los objetivos del proyecto:

### 4.1. Árbol de Directorios Propuesto

```
coomunity-monorepo/
├── apps/                      # Contenedor para todas las aplicaciones desplegables
│   ├── backend/               # Backend NestJS
│   │   ├── prisma/            # Schema, migraciones, seeds (co-ubicado con backend)
│   │   ├── src/               # Código fuente del backend
│   │   ├── package.json       # Dependencias y scripts específicos del backend
│   │   └── tsconfig.json      # Configuración TypeScript para backend
│   ├── superapp/              # SuperApp React (antes en Demo/apps/superapp-unified)
│   │   ├── public/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── admin/                 # Admin Frontend React (antes en apps/admin-frontend)
│   │   ├── public/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── guardians-portal/      # Guardians Portal React
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── packages/                  # Código compartido y reutilizable entre aplicaciones
│   ├── shared-types/          # Tipos TypeScript (DTOs, entidades, enums)
│   │   ├── src/
│   │   ├── dist/              # Salida de compilación (JS y .d.ts)
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui-core/               # Biblioteca de componentes UI React compartidos
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── utils/                 # Funciones de utilidad JS/TS puras y genéricas
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── eslint-config-coomunity/ # Configuración ESLint compartida (ej. @coomunity/eslint-config)
│   │   ├── index.js
│   │   └── package.json
│   ├── tsconfig-coomunity/    # Configuraciones base de TypeScript (base, react, nestjs)
│   │   ├── base.json
│   │   ├── react.json
│   │   ├── nestjs.json
│   │   └── package.json
├── docs/                      # Documentación general del proyecto
│   ├── architecture/          # Documentos de arquitectura (esta propuesta irá aquí)
│   ├── adrs/                  # Architecture Decision Records
│   ├── guides/                # Guías de desarrollo, onboarding, etc.
│   ├── philosophy/            # Documentos de NARRATIVA integrados (lore, principios)
│   └── README.md              # README de la sección de documentación
├── scripts/                   # Scripts globales del monorepo (CI, build, utilidades de dev)
│   ├── ci/
│   ├── deployment/
│   └── utils/
├── config/                    # Configuraciones globales de herramientas
│   ├── .prettierrc.json       # Configuración de Prettier para todo el monorepo
│   ├── .eslintrc.base.js      # ESLint base para ser extendido en apps/packages
│   └── jest.config.base.js    # Configuración base de Jest
├── .github/
│   └── workflows/
│       └── ci.yml             # Pipelines de CI/CD
├── .git/
├── .gitignore
├── .editorconfig
├── AGENTS.md                  # Instrucciones para agentes IA (si se decide crear uno a nivel raíz)
├── package.json               # Raíz: Solo devDependencies (turbo, typescript, eslint, prettier) y scripts de orquestación
├── pnpm-workspace.yaml        # Define los workspaces para pnpm
├── README.md                  # README principal del proyecto (alto nivel)
├── turbo.json                 # Configuración de Turborepo
└── tsconfig.json              # Raíz: Solo para referencias a los tsconfig de apps y packages, y configuración del editor
```

### 4.2. Organización de Módulos Compartidos (`packages/`)

*   **`packages/shared-types`**:
    *   **Responsabilidad (ANA, COSMOS)**: Única fuente de verdad para tipos de datos que cruzan los límites entre backend y frontends (DTOs, entidades principales, enums).
    *   **Contenido**: Interfaces TypeScript, tipos, enums.
    *   **Build**: Debe compilarse a un directorio `dist/` con archivos `.js` y `.d.ts`.
*   **`packages/ui-core`**:
    *   **Responsabilidad (ARIA, MIRA)**: Componentes UI React reutilizables (átomos, moléculas, organismos simples del Design System) para mantener consistencia visual y funcional.
    *   **Contenido**: Componentes React, estilos asociados, temas (si aplica).
    *   **Build**: Debe compilarse y ser consumible por las aplicaciones React.
*   **`packages/utils`**:
    *   **Responsabilidad (PHOENIX, COSMOS)**: Funciones de utilidad puras y genéricas (no ligadas a React o NestJS específicamente) que pueden ser usadas en cualquier parte del monorepo.
    *   **Contenido**: Funciones de formato, validación, manipulación de datos, etc.
    *   **Build**: Debe compilarse a un directorio `dist/`.
*   **`packages/eslint-config-coomunity`**:
    *   **Responsabilidad (SAGE, MIRA)**: Define las reglas de linting estándar para el proyecto.
    *   **Contenido**: Configuración de ESLint exportable.
*   **`packages/tsconfig-coomunity`**:
    *   **Responsabilidad (COSMOS, SAGE)**: Provee configuraciones base de TypeScript (`base.json`, `react.json`, `nestjs.json`) para ser extendidas, asegurando consistencia.

### 4.3. Convenciones de Nomenclatura

Se seguirán las siguientes convenciones (consistentes con las buenas prácticas ya observadas pero aplicadas universalmente):

*   **Directorios**: `lowercase` o `kebab-case`.
*   **Archivos de Componentes React**: `PascalCase.tsx`.
*   **Componentes React (función/clase)**: `PascalCase`.
*   **Archivos de Hooks React**: `useCamelCase.ts`.
*   **Hooks React (función)**: `useCamelCase`.
*   **Archivos de Servicios/Controladores/DTOs/Módulos**: `featureName.type.ts` (e.g., `auth.service.ts`, `user.controller.ts`, `login.dto.ts`, `auth.module.ts`).
*   **Clases (Servicios, Controladores, DTOs, Módulos)**: `PascalCaseType` (e.g., `AuthService`, `UserController`, `LoginDto`, `AuthModule`).
*   **Archivos de Tipos/Interfaces**: `featureName.types.ts`.
*   **Interfaces y Tipos**: `PascalCase`.
*   **Tests**: `*.test.ts` (para unit/integration), `*.spec.ts` (para E2E).

### 4.4. Patrones de Importación

*   **Alias de Path**: Configurar en `tsconfig.json` de cada app/package para importaciones internas (e.g., `@/components` dentro de una app React).
*   **Importaciones de Paquetes**: Usar nombres de paquete para importar desde `packages/*` (e.g., `import { User } from '@coomunity/shared-types';`).
*   **Barrel Files (`index.ts`)**: Usar en `packages/` y en directorios de módulos principales dentro de las apps para simplificar las importaciones.

## 5. Justificación de los Cambios Propuestos

La nueva estructura y convenciones ofrecen múltiples beneficios:

*   **Claridad y Organización (ANA, COSMOS):**
    *   Estructura `apps/` y `packages/` estándar y predecible.
    *   Co-ubicación de `prisma/` con `apps/backend/` mejora la cohesión del backend.
    *   Limpieza de la raíz del proyecto y organización de `docs/` (integrando `NARRATIVA/`).
*   **Reducción de Acoplamiento y Mejora de Cohesión (PHOENIX):**
    *   Eliminación de dependencias de backend en `admin-frontend` y en la raíz.
    *   Cada aplicación y paquete gestiona sus propias dependencias.
*   **Reutilización y Reducción de Duplicación (PHOENIX, ARIA):**
    *   `packages/shared-types` como única fuente de verdad para tipos compartidos.
    *   `packages/ui-core` para componentes UI consistentes.
    *   `packages/utils` para lógica de utilidad común.
*   **Mejora de la Experiencia del Desarrollador (MIRA):**
    *   Facilita el onboarding y la navegación del código.
    *   Configuraciones compartidas (`eslint-config-coomunity`, `tsconfig-coomunity`) simplifican el setup de nuevos paquetes/apps.
*   **Optimización de Herramientas y Builds (COSMOS):**
    *   Mejor aprovechamiento de Turborepo gracias a una granularidad y definición de dependencias correctas.
    *   Builds más rápidos y fiables.
*   **Calidad y Mantenibilidad (SAGE, PHOENIX):**
    *   Facilita la aplicación de tests unitarios y de integración más enfocados.
    *   Una base de código más limpia y organizada es más fácil de mantener y refactorizar.
    *   Configuraciones de linting y TypeScript más estrictas y consistentes mejoran la calidad del código.
*   **Alineación con Principios Filosóficos:**
    *   **Modularidad y Fractalidad:** La estructura de paquetes y aplicaciones modulares es un reflejo directo.
    *   **Sinfonía Sistémica (COSMOS):** Una estructura bien definida es esencial para la orquestación.
    *   **Purificación Constante (PHOENIX):** La reducción de deuda organizacional y la facilitación de refactorizaciones aisladas.
    *   **Atlas Vivo (ANA):** Una estructura clara es más fácil de documentar y comprender.

## 6. Impacto en los Guardianes Digitales

*   **COSMOS (Tejedor de Sistemas):** Se beneficia de una estructura clara para la orquestación de CI/CD y la gestión de builds con Turborepo. La definición de paquetes de configuración (`tsconfig-coomunity`) es de su dominio.
*   **PHOENIX (Agente Transformador):** La reducción de acoplamiento y la modularidad facilitan la refactorización y la eliminación de deuda técnica. La creación de `packages/utils` ayuda a centralizar lógica común.
*   **ANA (Curadora Cósmica):** Una estructura organizada y la centralización de `docs/` (incluyendo `NARRATIVA/`) facilitan la creación y mantenimiento de un "Atlas Vivo". `packages/shared-types` se convierte en una fuente clave de conocimiento sobre los datos.
*   **SAGE (Alquimista de la Calidad):** La separación de incumbencias y los contratos claros (vía `shared-types`) permiten tests más robustos y enfocados. `packages/eslint-config-coomunity` ayuda a mantener la calidad del código.
*   **MIRA (Curadora de Herramientas):** Se beneficia de configuraciones de herramientas consistentes y de una estructura que facilita la integración y el desarrollo de herramientas internas como el `admin` frontend.

## 7. Próximos Pasos (Post-Aprobación)

Si esta propuesta es aprobada, se elaborará un plan de migración detallado. Este plan incluirá:
1.  Creación de la nueva estructura de directorios.
2.  Movimiento gradual de aplicaciones y código a sus nuevas ubicaciones.
3.  Refactorización de dependencias (eliminación de dependencias incorrectas).
4.  Creación y populación de los nuevos paquetes compartidos (`ui-core`, `utils`, expansión de `shared-types`).
5.  Actualización de configuraciones (`tsconfig.json`, `package.json`, `turbo.json`, `pnpm-workspace.yaml`).
6.  Actualización de pipelines de CI/CD.
7.  Pruebas exhaustivas para asegurar que todo funcione correctamente tras la migración.

Esta re-arquitectura es una inversión significativa que sentará las bases para un desarrollo más eficiente, escalable y de mayor calidad para CoomÜnity.
