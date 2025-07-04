# Guía Definitiva de Despliegue de la SuperApp en Vercel

Este documento contiene las instrucciones y soluciones probadas para desplegar la `superapp-unified` desde nuestro monorepo a Vercel. Seguir esta guía previene errores comunes de build que hemos enfrentado.

## 1. Configuración del Proyecto en Vercel

Al configurar el proyecto en el dashboard de Vercel, es crucial usar los siguientes parámetros para que Vercel entienda la estructura de nuestro monorepo:

| Parámetro | Valor | Notas |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | Vercel optimizará el build para Vite. |
| **Root Directory** | `Demo/apps/superapp-unified` | **CRÍTICO:** Le dice a Vercel que ignore la raíz del monorepo y trabaje solo dentro de la SuperApp. |
| **Build Command** | `npm run build` | Vercel ejecutará `npm install` automáticamente. El flag `--legacy-peer-deps` se gestiona vía `.npmrc`. |
| **Output Directory** | `dist` | Es el directorio de salida estándar para los builds de Vite. |
| **Install Command** | `npm install --legacy-peer-deps` | Sobrescribir el comando de instalación para asegurar la compatibilidad de dependencias (Ej: MUI v7). |

---

## 2. Gestión de la Configuración del Monorepo

Para evitar conflictos y asegurar builds consistentes, seguimos dos principios clave:

### A. Centralizar la Configuración en `.npmrc`

- **Problema:** Vercel ignora los archivos `.npmrc` que están dentro de los workspaces (ej: `superapp-unified/.npmrc`), causando el warning `npm warn config ignoring workspace config`.
- **Solución:** Tener un **único archivo `.npmrc` en la raíz del monorepo**. Este archivo debe contener toda la configuración necesaria para todos los workspaces.

**Contenido del archivo `/.npmrc` raíz:**
```
legacy-peer-deps=true
fund=false
audit=false
package-lock=false
```

### B. Uso de Alias de Ruta en lugar de Rutas Relativas

- **Problema:** Las rutas relativas como `import '../utils/some-file'` son frágiles y pueden romperse fácilmente en diferentes entornos de build.
- **Solución:** Usar siempre los **alias de ruta** configurados en `tsconfig.json`. En nuestro caso, `@/` apunta a `src/`.

**Ejemplo de refactorización:**
```typescript
// ❌ Incorrecto (frágil)
import MyComponent from '../components/MyComponent';

// ✅ Correcto (robusto)
import MyComponent from '@/components/MyComponent';
```

---

## 3. Protocolo de Troubleshooting de Errores de Build

Aquí se detallan los errores que hemos encontrado y su solución definitiva.

### Error 1: `Could not resolve "..."` o `ENOENT: no such file or directory`

Este es el error más común y puede tener múltiples causas. Sigue estos pasos en orden:

**Paso 1: Verificar si el archivo está ignorado por Git**

El archivo no puede ser resuelto porque no existe en el contenedor de build de Vercel.
- **Causa:** Una regla en el archivo `.gitignore` raíz está impidiendo que el archivo sea subido al repositorio.
- **Ejemplo Real:** La regla `*debug*.ts` ignoraba nuestro archivo `cosmic-debug.ts`.
- **Solución:** Revisa `.gitignore` y comenta o haz más específica la regla conflictiva. Luego, asegúrate de hacer `git add` y `git commit` del archivo que antes era ignorado.

**Paso 2: Usar Importaciones Dinámicas para Módulos de Desarrollo**

Si el módulo que falla solo se usa para debugging o en desarrollo, no debe ser parte del build de producción.
- **Causa:** Una importación estática (`import ... from '...'`) al inicio del archivo obliga a Vite a buscarlo, aunque solo se use dentro de un bloque condicional `if (import.meta.env.DEV)`.
- **Solución:** Convertir la importación estática en una **importación dinámica** dentro del bloque condicional.

**Ejemplo de refactorización en `Home.tsx`:**
```typescript
// ❌ Incorrecto: Falla en producción
import debugCosmicTypes from '@/utils/cosmic-debug.ts';
if (import.meta.env.DEV) {
  debugCosmicTypes();
}

// ✅ Correcto: Se ignora de forma segura en el build de producción
if (import.meta.env.DEV) {
  import('@/utils/cosmic-debug.ts').then(({ default: debugCosmicTypes }) => {
    // Usar el módulo aquí dentro
    debugCosmicTypes();
  });
}
```

### Error 2: TypeScript/Linter - `Property 'env' does not exist on type 'ImportMeta'`

- **Causa:** El entorno de TypeScript no reconoce las variables de entorno de Vite (`import.meta.env`).
- **Solución:** Crear un archivo de declaración de tipos y asegurarse de que `tsconfig.json` lo incluya.

1.  **Crear/Restaurar `src/vite-env.d.ts`:**
    ```typescript
    /// <reference types="vite/client" />

    interface ImportMetaEnv {
      readonly VITE_API_BASE_URL: string;
      readonly VITE_BASE_URL: string;
      // ... otras variables de entorno ...
      readonly DEV: boolean;
    }

    interface ImportMeta {
      readonly env: ImportMetaEnv;
    }
    ```

2.  **Incluirlo en `Demo/apps/superapp-unified/tsconfig.json`:**
    ```json
    {
      // ...
      "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/vite-env.d.ts" // <-- Asegurarse de que esta línea exista
      ],
      // ...
    }
    ```
---

Siguiendo esta guía, los despliegues en Vercel serán predecibles y estables. 
