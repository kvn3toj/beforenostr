# 🤖 CLAUDE.md — Reglas Globales de Context Engineering

## 🎯 Propósito

Este documento define las reglas, filosofía, arquitectura, convenciones y estándares para que cualquier asistente IA o desarrollador trabaje de forma consistente y alineada con el proyecto **CoomÜnity Global**.

---

## 1. 🌟 Filosofía y Valores CoomÜnity

### Principios Fundamentales

- **Bien Común > bien particular:** Prioriza el beneficio colectivo sobre el individual
- **Cooperar > Competir:** Fomenta la colaboración sobre la competencia
- **Reciprocidad:** Intercambio equilibrado de valor, colaboración y mutualidad
- **Economía Sagrada:** Abundancia, sostenibilidad, regeneración y colaboración
- **Metanöia:** Transformación de conciencia hacia el bien común
- **Neguentropía:** Creación de orden y armonía en lugar de caos

### Aplicación en el Código

- Diseña funcionalidades que fomenten la colaboración
- Evita patrones que generen adicción o competencia destructiva
- Implementa lógica de Ayni en transacciones y recompensas
- Prioriza la transparencia y la confianza en las interfaces

---

## 2. 🏗️ Arquitectura Final y Definitiva

### Estructura del Monorepo

```
proyecto-coomunity/
├── backend/                 # Backend NestJS (Puerto 3002)
├── admin-frontend/          # Frontend Gamifier Admin (Puerto 3000)
├── Demo/apps/superapp-unified/ # SuperApp Principal (Puerto 3001)
└── shared/                  # Tipos y utilidades compartidas
```

### Stack Tecnológico Definitivo

#### Backend Compartido (NestJS) - Puerto 3002

- **Framework:** NestJS 11+, TypeScript
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Cache:** Redis
- **Autenticación:** JWT + RBAC
- **Logging:** Winston
- **Monitoreo:** Prometheus + Grafana
- **Testing:** Jest

#### Frontend SuperApp - Puerto 3001

- **Framework:** React 18+, TypeScript
- **UI:** Material UI v7 + Tailwind CSS
- **Estado:** Zustand (global), React Query (server state)
- **Formularios:** React Hook Form + Zod
- **Routing:** React Router
- **Testing:** Playwright (E2E) + Vitest (unit)
- **Build:** Vite

#### Frontend Gamifier Admin - Puerto 3000

- **Framework:** React 18+, TypeScript
- **UI:** Material UI v7 (Design System)
- **Estado:** Zustand + React Query
- **Testing:** Playwright + Vitest
- **Build:** Vite

---

## 3. 🎮 Terminología Específica

- **Ünits:** Moneda interna de la plataforma CoomÜnity
- **Mëritos:** Sistema de reputación y reconocimiento basado en contribución
- **Gamifier:** Administrador de la experiencia gamificada
- **Jugador:** Usuario final de la SuperApp CoomÜnity
- **SuperApp:** Frontend principal para jugadores (CoomÜnity)
- **Admin:** Frontend de administración (Gamifier Admin)
- **Reciprocidad:** Principio de reciprocidad en transacciones y relaciones

---

## 4. 📁 Patrones de Código Obligatorios

### Estructura de Archivos

```
src/
├── components/
│   ├── common/              # Componentes reutilizables
│   ├── layout/              # Layouts y estructura
│   └── pages/               # Componentes específicos de página
├── hooks/                   # Hooks personalizados
├── services/                # Servicios API y lógica de negocio
├── store/                   # Estado global (Zustand)
├── types/                   # Tipos TypeScript
├── utils/                   # Utilidades y helpers
└── __tests__/               # Tests
```

### Convenciones de Naming

- **Componentes:** `PascalCase.tsx` (ej: `VideoItemCard.tsx`)
- **Hooks:** `useCamelCase.ts` (ej: `useAuth.ts`)
- **Servicios:** `camelCaseService.ts` (ej: `userService.ts`)
- **Stores:** `camelCaseStore.ts` (ej: `authStore.ts`)
- **Tipos:** `PascalCase.types.ts` (ej: `User.types.ts`)
- **Tests:** `Component.test.tsx` o `service.test.ts`

### Patrones React Obligatorios

- **Componentes funcionales ÚNICAMENTE**
- **Hooks personalizados para lógica reutilizable**
- **React Query para todas las llamadas API**
- **Context API para estado global (NO prop drilling)**
- **Memoización con `useMemo`/`useCallback` para optimización**

### Patrones Backend NestJS Obligatorios

- **SIEMPRE usar `@Inject()` explícito en constructores**
- **DTOs con class-transformer para validación automática**
- **Rutas específicas ANTES que paramétricas (/:id al final)**
- **Manejo de errores con try-catch explícito**

---

## 5. 🎨 Estándares UI/UX Obligatorios

### Material UI + Tailwind

- **MUI components con `sx` prop (NO styled-components)**
- **Tailwind para utilidades CSS complementarias**
- **Loading, Error y Empty states OBLIGATORIOS**
- **Accesibilidad con aria-labels apropiados**
- **Responsive design por defecto**

### Ejemplo de Componente

```tsx
// src/components/common/Button/GamifierButton.tsx
import { Button, ButtonProps } from '@mui/material';
import { FC } from 'react';

interface GamifierButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const GamifierButton: FC<GamifierButtonProps> = ({ 
  children, 
  variant = 'primary',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } };
      case 'secondary':
        return { bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } };
      case 'danger':
        return { bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } };
      default:
        return {};
    }
  };

  return (
    <Button
      variant="contained"
      sx={{
        ...getVariantStyles(),
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
```

---

## 6. 🔧 Integración Backend-Frontend

### Configuración API

```typescript
// src/services/api-service.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para JWT
apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Hook de Autenticación

```typescript
// src/hooks/useAuth.ts
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api-service';

export const useAuth = () => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
    
      const response = await apiService.get('/auth/me');
      return response.data;
    },
    retry: false,
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiService.post('/auth/login', credentials);
      localStorage.setItem('auth_token', response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.reload();
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
```

---

## 7. 🚨 Protocolo Pre-flight Check OBLIGATORIO

### Antes de cualquier tarea de backend:

```bash
# 1. Verificar procesos activos
ps aux | grep -E "(node|tsx|npm)" | grep -v grep

# 2. Iniciar backend si no está corriendo
cd backend/ && npm run dev

# 3. Verificar conectividad
curl http://localhost:3002/health -v
```

### Antes de cualquier tarea de frontend:

```bash
# 1. Verificar que el backend esté corriendo
curl http://localhost:3002/health

# 2. Iniciar frontend correspondiente
cd admin-frontend/ && npm run dev          # Puerto 3000
# O
cd Demo/apps/superapp-unified/ && npm run dev  # Puerto 3001
```

---

## 8. 🧪 Testing y Validación

### Comandos de Validación

```bash
# Lint y formato
npm run lint
npm run format

# Testing
npm run test              # Tests unitarios
npm run test:e2e         # Tests E2E
npm run test:coverage    # Cobertura

# Build y type-check
npm run build
npm run type-check

# Validación completa
npm run preflight
```

### Criterios de Éxito

- ✅ **100% features implementadas en primera iteración**
- ✅ **95%+ cobertura de tests**
- ✅ **0 violaciones de arquitectura**
- ✅ **0 errores de TypeScript**
- ✅ **100% alineación con valores CoomÜnity**
- ✅ **Tiempo de carga < 3 segundos**

---

## 9. ❌ Patrones Prohibidos y Anti-patrones

### NO Hagas:

- ❌ Conectar con Supabase (era temporal)
- ❌ Usar Express backend (era temporal)
- ❌ Buscar puerto 3000 para backend
- ❌ Implementar autenticación propia (usar Backend NestJS)
- ❌ Crear bases de datos locales
- ❌ Hardcodear URLs completas en tests
- ❌ Dependencias faltantes en useEffect
- ❌ Componentes sin manejo de errores
- ❌ Imports inconsistentes de tipos Prisma
- ❌ Inyección de dependencias implícita en NestJS

### SÍ Haz:

- ✅ Conectar con Backend NestJS en puerto 3002
- ✅ Usar JWT del Backend NestJS compartido
- ✅ Implementar llamadas API REST al Backend NestJS
- ✅ Usar Prisma types del Backend NestJS
- ✅ Trabajar en el directorio correcto
- ✅ Verificar disponibilidad de puertos

---

## 10. 🗣️ Protocolo de Comunicación

### El Agente IA SIEMPRE debe ser explícito sobre:

1. **¿QUÉ?** - Componente usando prefijos:

   - `[BACKEND]` - Backend NestJS compartido
   - `[ADMIN]` - Frontend Gamifier Admin
   - `[SUPERAPP]` - Frontend SuperApp CoomÜnity
   - `[GLOBAL]` - Afecta múltiples componentes
2. **¿DÓNDE?** - Ruta completa:

   - `backend/` (fuera del workspace actual)
   - `admin-frontend/` (fuera del workspace actual)
   - `Demo/apps/superapp-unified/` (workspace actual)
3. **¿CÓMO?** - Comando específico:

   - `cd backend/ && npm run dev`
   - `cd Demo/apps/superapp-unified/ && npm run dev`
4. **¿CUÁNDO?** - Estado requerido:

   - "Backend NestJS ejecutándose en puerto 3002"
5. **¿POR QUÉ?** - Referencia a arquitectura:

   - "Conecta SuperApp al Backend NestJS compartido"

---

## 11. 🔄 Mantenimiento y Evolución

### Actualizaciones Obligatorias

- **Cada cambio en arquitectura** → Actualizar CLAUDE.md
- **Nuevas dependencias** → Actualizar stack tecnológico
- **Cambios en filosofía** → Actualizar valores y principios
- **Nuevos patrones** → Actualizar convenciones

### Versionado

- **Versión actual:** 1.0.0
- **Última actualización:** [Fecha actual]
- **Próxima revisión:** [Fecha + 30 días]

---

## 🎯 Resumen Ejecutivo

Este documento es la **fuente única de verdad** para el desarrollo en CoomÜnity. Garantiza:

1. **Consistencia** en todos los desarrollos
2. **Alineación** con la filosofía del proyecto
3. **Calidad** mediante estándares estrictos
4. **Eficiencia** con patrones probados
5. **Escalabilidad** con arquitectura sólida

**¡Estas reglas son OBLIGATORIAS y deben seguirse en cada interacción con el código!**

---

*"En CoomÜnity, el código no solo funciona, sino que también sirve al bien común."*
