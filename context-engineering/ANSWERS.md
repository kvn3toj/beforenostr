# ❓ ANSWERS.md — Respuestas a Preguntas Frecuentes

## 🎯 Propósito
Este documento contiene respuestas detalladas a las preguntas más frecuentes sobre el desarrollo en el proyecto CoomÜnity. Está diseñado para resolver dudas rápidamente y mantener la consistencia en el desarrollo.

---

## 1. 🏗️ Arquitectura y Estructura

### P: ¿Cuál es la arquitectura definitiva del proyecto CoomÜnity?

**R:** La arquitectura definitiva es un monorepo con tres componentes principales:

```
proyecto-coomunity/
├── backend/                    # NestJS (Puerto 3002) - Backend compartido
├── admin-frontend/             # React (Puerto 3000) - Gamifier Admin
├── Demo/apps/superapp-unified/ # React (Puerto 3001) - SuperApp Principal
└── shared/                     # Tipos y utilidades compartidas
```

**Importante:** Solo hay UN backend (NestJS) que sirve a AMBOS frontends. No hay Supabase, ni Express, ni backends auxiliares.

### P: ¿Qué puertos usa cada componente?

**R:** 
- **Backend NestJS:** Puerto 3002 (único backend)
- **Frontend Admin:** Puerto 3000 (Gamifier Admin)
- **Frontend SuperApp:** Puerto 3001 (Aplicación principal)

### P: ¿Cómo se comunican los frontends con el backend?

**R:** Ambos frontends se conectan al mismo Backend NestJS en puerto 3002 usando:
- **Protocolo:** HTTP REST
- **Autenticación:** JWT tokens
- **Cliente:** Axios configurado
- **URL Base:** `http://localhost:3002`

---

## 2. 🛠️ Stack Tecnológico

### P: ¿Qué tecnologías específicas usa cada componente?

**R:**

**Backend NestJS (Puerto 3002):**
- Framework: NestJS 11+
- Lenguaje: TypeScript
- Base de datos: PostgreSQL
- ORM: Prisma
- Cache: Redis
- Autenticación: JWT + RBAC
- Logging: Winston
- Testing: Jest

**Frontend SuperApp (Puerto 3001):**
- Framework: React 18+
- Lenguaje: TypeScript
- UI: Material UI v7 + Tailwind CSS
- Estado: Zustand (global) + React Query (server)
- Formularios: React Hook Form + Zod
- Routing: React Router
- Build: Vite
- Testing: Playwright (E2E) + Vitest (unit)

**Frontend Admin (Puerto 3000):**
- Framework: React 18+
- Lenguaje: TypeScript
- UI: Material UI v7 (Design System)
- Estado: Zustand + React Query
- Testing: Playwright + Vitest
- Build: Vite

### P: ¿Por qué se usa Material UI v7 + Tailwind CSS?

**R:** 
- **MUI v7:** Componentes robustos y consistentes con el Design System
- **Tailwind CSS:** Utilidades CSS para personalización rápida
- **Combinación:** MUI para componentes base + Tailwind para estilos utilitarios
- **Patrón:** Usar `sx` prop de MUI, NO styled-components

---

## 3. 🔧 Desarrollo y Patrones

### P: ¿Cuáles son los patrones de código obligatorios?

**R:**

**React (Frontend):**
- Componentes funcionales ÚNICAMENTE
- Hooks personalizados para lógica reutilizable
- React Query para TODAS las llamadas API
- Zustand para estado global
- TypeScript estricto con interfaces
- Loading/Error/Empty states OBLIGATORIOS

**NestJS (Backend):**
- Inyección de dependencias explícita con `@Inject()`
- DTOs con class-transformer
- Rutas específicas ANTES que paramétricas
- Try-catch explícito para manejo de errores

### P: ¿Cómo debo estructurar un componente React?

**R:**
```tsx
// src/components/[categoria]/[ComponentName].tsx
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface ComponentNameProps {
  // Props tipadas
}

export const ComponentName: FC<ComponentNameProps> = ({ ...props }) => {
  // 1. Hooks y estado
  // 2. Funciones auxiliares
  // 3. Effects
  // 4. Handlers
  
  return (
    <Box sx={{ /* estilos */ }}>
      {/* JSX */}
    </Box>
  );
};
```

### P: ¿Cómo implemento un hook personalizado?

**R:**
```typescript
// src/hooks/use[HookName].ts
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api-service';

export const useHookName = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['key'],
    queryFn: async () => {
      const response = await apiService.get('/endpoint');
      return response.data;
    },
    retry: false,
  });

  return { data, isLoading, error };
};
```

---

## 4. 🔌 Integración Backend-Frontend

### P: ¿Cómo configuro la conexión con el backend?

**R:**
```typescript
// src/services/api-service.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para JWT automático
apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### P: ¿Cómo manejo la autenticación JWT?

**R:**
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await apiService.get('/auth/me');
      return response.data;
    },
    retry: false,
  });

  const login = async (credentials) => {
    const response = await apiService.post('/auth/login', credentials);
    localStorage.setItem('auth_token', response.data.token);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.reload();
  };

  return { user, isLoading, login, logout, isAuthenticated: !!user };
};
```

---

## 5. 🧪 Testing y Validación

### P: ¿Cómo escribo tests E2E con Playwright?

**R:**
```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

### P: ¿Cómo escribo tests unitarios con Vitest?

**R:**
```typescript
// src/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### P: ¿Cuáles son los criterios de éxito para testing?

**R:**
- ✅ 95%+ cobertura de código
- ✅ Tests E2E para flujos críticos
- ✅ Tests unitarios para componentes y hooks
- ✅ Mocks para llamadas API
- ✅ Selectores semánticos en tests E2E

---

## 6. 🚨 Debugging y Resolución de Problemas

### P: ¿Cómo debuggeo problemas de conexión con el backend?

**R:**
1. **Verificar que el backend esté corriendo:**
   ```bash
   curl http://localhost:3002/health -v
   ```

2. **Verificar logs del backend:**
   ```bash
   cd backend/ && npm run dev
   # Revisar logs en consola
   ```

3. **Verificar Network tab en DevTools:**
   - Requests a `http://localhost:3002`
   - Status codes (200, 401, 403, 500)
   - Headers de autorización

4. **Verificar token JWT:**
   ```javascript
   // En console del navegador
   localStorage.getItem('auth_token')
   ```

### P: ¿Cómo debuggeo problemas de React Query?

**R:**
```typescript
// Habilitar DevTools de React Query
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Tu app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### P: ¿Qué hago si el frontend no se conecta al backend?

**R:**
1. **Verificar URLs:**
   - Backend: `http://localhost:3002`
   - Frontend: `http://localhost:3001` o `http://localhost:3000`

2. **Verificar CORS:**
   - Backend debe permitir origins de frontend
   - Headers correctos en requests

3. **Verificar variables de entorno:**
   ```bash
   # .env del frontend
   VITE_API_BASE_URL=http://localhost:3002
   ```

---

## 7. 🎨 UI/UX y Filosofía CoomÜnity

### P: ¿Cómo aplico la filosofía CoomÜnity en el diseño?

**R:**
- **Bien Común:** Diseña para beneficio colectivo, no individual
- **Ayni:** Intercambios equilibrados y transparentes
- **Cooperación:** Elementos que fomenten colaboración
- **Transparencia:** Información clara y accesible
- **Inclusión:** Accesible para todos los usuarios

### P: ¿Qué patrones UI debo evitar?

**R:**
- ❌ Dark patterns que manipulen decisiones
- ❌ Elementos que fomenten adicción
- ❌ Competencia destructiva
- ❌ Información oculta o confusa
- ❌ Barreras artificiales

### P: ¿Cómo uso Material UI con Tailwind CSS?

**R:**
```tsx
// Usar MUI components con sx prop
<Button
  variant="contained"
  sx={{
    bgcolor: 'primary.main',
    borderRadius: 2,
    '&:hover': { bgcolor: 'primary.dark' },
  }}
  className="shadow-lg" // Tailwind para utilidades
>
  Click me
</Button>
```

---

## 8. 🔄 Migración y Mantenimiento

### P: ¿Cómo migro código mock al backend real?

**R:**
1. **Identificar código mock:**
   ```typescript
   // ANTES (Mock)
   const mockService = { getData: () => mockData };
   
   // DESPUÉS (Real)
   const realService = { getData: () => apiService.get('/data') };
   ```

2. **Actualizar hooks:**
   ```typescript
   // Cambiar de mock a React Query
   const { data } = useQuery({
     queryKey: ['data'],
     queryFn: () => realService.getData(),
   });
   ```

3. **Actualizar tests:**
   - Mockear apiService en lugar de datos
   - Verificar llamadas API correctas

### P: ¿Cómo mantengo la consistencia en el código?

**R:**
- **Linting:** `npm run lint` regularmente
- **Formatting:** `npm run format` antes de commits
- **Type checking:** `npm run type-check`
- **Testing:** `npm run test` y `npm run test:e2e`
- **Seguir patrones:** Usar CLAUDE.md como referencia

---

## 9. 📁 Estructura y Organización

### P: ¿Cómo organizo los archivos en el proyecto?

**R:**
```
src/
├── components/
│   ├── common/          # Componentes reutilizables
│   ├── layout/          # Layouts (Header, Footer, etc.)
│   └── pages/           # Componentes específicos de página
├── hooks/               # Hooks personalizados
├── services/            # Servicios API y lógica de negocio
├── store/               # Estado global (Zustand)
├── types/               # Tipos TypeScript
├── utils/               # Utilidades y helpers
└── __tests__/           # Tests
```

### P: ¿Cómo nombro archivos y componentes?

**R:**
- **Componentes:** `PascalCase.tsx` (ej: `VideoItemCard.tsx`)
- **Hooks:** `useCamelCase.ts` (ej: `useAuth.ts`)
- **Servicios:** `camelCaseService.ts` (ej: `userService.ts`)
- **Tipos:** `PascalCase.types.ts` (ej: `User.types.ts`)
- **Tests:** `Component.test.tsx` o `service.test.ts`

---

## 10. 🚀 Comandos y Desarrollo

### P: ¿Cuáles son los comandos esenciales para desarrollo?

**R:**
```bash
# Iniciar backend
cd backend/ && npm run dev

# Iniciar frontend SuperApp
cd Demo/apps/superapp-unified/ && npm run dev

# Iniciar frontend Admin
cd admin-frontend/ && npm run dev

# Validación completa
npm run lint
npm run test
npm run test:e2e
npm run build
npm run type-check
```

### P: ¿Cómo ejecuto el protocolo pre-flight check?

**R:**
```bash
# 1. Verificar procesos activos
ps aux | grep -E "(node|tsx|npm)" | grep -v grep

# 2. Verificar conectividad del backend
curl http://localhost:3002/health -v

# 3. Si no responde, iniciar backend
cd backend/ && npm run dev
```

---

## 11. 🎯 Terminología CoomÜnity

### P: ¿Qué significan los términos específicos de CoomÜnity?

**R:**
- **Ünits:** Moneda interna de la plataforma
- **Mëritos:** Sistema de reputación basado en contribución
- **Gamifier:** Administrador de la experiencia gamificada
- **Jugador:** Usuario final de la SuperApp
- **Ayni:** Principio de reciprocidad equilibrada
- **SuperApp:** Frontend principal para jugadores
- **Admin:** Frontend de administración

### P: ¿Cómo implemento la lógica de Ayni en el código?

**R:**
```typescript
// Ejemplo de transacción Ayni
const processAyniTransaction = async (giver, receiver, value) => {
  // Verificar equilibrio
  const balance = await checkAyniBalance(giver, receiver);
  
  // Procesar intercambio
  await apiService.post('/ayni/transaction', {
    giver,
    receiver,
    value,
    type: 'equilibrium',
  });
  
  // Actualizar méritos
  await updateMeritos(giver, receiver, value);
};
```

---

## 🎯 Resumen de Respuestas Clave

### Arquitectura:
- **UN solo backend NestJS** (puerto 3002)
- **Dos frontends React** (puertos 3000 y 3001)
- **NO Supabase, NO Express auxiliar**

### Stack:
- **Backend:** NestJS + TypeScript + PostgreSQL + Prisma
- **Frontend:** React + TypeScript + MUI v7 + Tailwind + Zustand + React Query

### Patrones:
- **Componentes funcionales** únicamente
- **React Query** para API calls
- **TypeScript estricto** siempre
- **Loading/Error states** obligatorios

### Testing:
- **Playwright** para E2E
- **Vitest** para unitarios
- **95%+ cobertura** requerida

### Filosofía:
- **Bien Común** > bien particular
- **Ayni** = reciprocidad equilibrada
- **Cooperación** > competencia
- **Transparencia** en todo

---

**¿No encuentras la respuesta que buscas? Consulta CLAUDE.md para reglas detalladas o PROMPTS.md para prompts específicos.**



```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```





```