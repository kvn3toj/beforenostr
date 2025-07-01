# 🤖 CUSTOM INSTRUCTIONS FOR BUILDER.IO - PROYECTO COOMUNITY SUPERAPP

## 🚨 ARQUITECTURA OBLIGATORIA Y ESTRUCTURA DEL PROYECTO

### **Contexto del Proyecto:**
- **Proyecto:** CoomÜnity SuperApp (PWA) - Plataforma gamificada de economía colaborativa
- **Stack:** React 18+, TypeScript, Material UI v7, Tailwind CSS, Vite
- **Backend:** NestJS (puerto 3002) con PostgreSQL, Prisma, JWT
- **Filosofía:** Ayni (reciprocidad), Bien Común, Cooperación > Competencia

---

## 📁 ESTRUCTURA DE DIRECTORIOS OBLIGATORIA

**Ubicación del proyecto:** `Demo/apps/superapp-unified/src/`

```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Componentes comunes (Header, Footer, etc.)
│   ├── modules/         # Componentes específicos por módulo
│   │   ├── uplay/       # GPL Gamified Play List (video player)
│   │   ├── marketplace/ # GMP Gamified Match Place (productos/servicios)
│   │   ├── social/      # Funcionalidades sociales
│   │   └── ustats/      # Estadísticas y métricas
│   └── ui/              # Componentes UI básicos
├── pages/               # Páginas principales
├── hooks/               # Custom hooks
├── lib/                 # Servicios y utilidades
│   ├── api-service.ts   # 🔥 SERVICIO API PRINCIPAL
│   ├── environment.ts   # Variables de entorno
│   └── analytics.ts     # Analytics y tracking
├── contexts/            # React Contexts
├── stores/              # Zustand stores
├── types/               # Definiciones TypeScript
└── utils/               # Funciones utilitarias
```

---

## 🎯 REGLAS DE IMPORTACIÓN CRÍTICAS

### **1. NUNCA uses estos imports (CAUSAN ERRORES):**

```typescript
// ❌ PROHIBIDO - No existen
import { Privacy } from '@mui/icons-material';
import { Configuration } from '@prisma/client';
import { apiService } from '../../lib/api-service'; // Path incorrecto
```

### **2. SIEMPRE usa estos imports correctos:**

```typescript
// ✅ CORRECTO - Material UI Icons
import { 
  Lock,           // En lugar de Privacy
  Security,       // Para seguridad
  Shield,         // Para protección
  AccountCircle,  // Para perfil
  Settings,       // Para configuración
} from '@mui/icons-material';

// ✅ CORRECTO - API Service (ajustar path según ubicación)
// Desde components/modules/uplay/components/
import { apiService } from '../../../../lib/api-service';
// Desde pages/
import { apiService } from '../lib/api-service';
// Desde hooks/
import { apiService } from '../lib/api-service';

// ✅ CORRECTO - Prisma Types
import { AppConfig } from '@prisma/client'; // NO 'Configuration'
```

### **3. Cálculo de Paths Relativos:**

**FORMULA:** Contar niveles desde archivo actual hasta `src/`, luego navegar a destino

```typescript
// Ejemplo: desde src/components/modules/uplay/components/MiComponente.tsx
// Niveles: components/ → modules/ → uplay/ → components/ = 4 niveles
// Path: ../../../../lib/api-service

// Ejemplo: desde src/pages/MiPagina.tsx  
// Niveles: pages/ = 1 nivel
// Path: ../lib/api-service
```

---

## 🎨 CONVENCIONES DE CÓDIGO OBLIGATORIAS

### **Naming Conventions:**

```typescript
// ✅ Componentes: PascalCase
const VideoPlayerCard: React.FC = () => {};

// ✅ Hooks: camelCase con prefijo 'use'
const useVideoData = () => {};

// ✅ Services: camelCase con sufijo 'Service'
const videoItemService = {};

// ✅ Types/Interfaces: PascalCase con sufijo descriptivo
interface VideoPlayerProps {}

// ✅ Archivos: kebab-case para utils, PascalCase para componentes
// video-utils.ts, VideoPlayer.tsx
```

### **Imports Organizados:**

```typescript
// 1. React y externos
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

// 2. Internos del proyecto
import { apiService } from '../lib/api-service';
import { useAuth } from '../contexts/AuthContext';

// 3. Relativos
import { VideoControls } from './VideoControls';
import { mockVideoData } from './mockData';
```

---

## 🔧 PATRONES TÉCNICOS OBLIGATORIOS

### **1. Estructura de Componente React:**

```typescript
interface MiComponenteProps {
  title: string;
  onAction?: (data: any) => void;
}

const MiComponente: React.FC<MiComponenteProps> = ({ 
  title, 
  onAction 
}) => {
  // 1. Hooks de React
  const [loading, setLoading] = useState(false);
  
  // 2. Custom hooks
  const { user } = useAuth();
  
  // 3. Handlers
  const handleClick = async () => {
    try {
      setLoading(true);
      const result = await apiService.get('/endpoint');
      onAction?.(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Early returns
  if (!user) return <Typography>No autorizado</Typography>;

  // 5. Render principal
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">{title}</Typography>
      {/* Contenido */}
    </Card>
  );
};

export default MiComponente;
```

### **2. API Calls con apiService:**

```typescript
// ✅ SIEMPRE usar apiService, NUNCA fetch directo
const fetchUserData = async (userId: string) => {
  try {
    const response = await apiService.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ✅ Con React Query (patrón preferido)
const useUserData = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiService.get(`/users/${userId}`),
    enabled: !!userId,
  });
};
```

### **3. Material UI + Tailwind (Híbrido):**

```typescript
// ✅ MUI para componentes complejos
<Card sx={{ 
  p: 2, 
  borderRadius: 2,
  boxShadow: theme.shadows[2] 
}}>
  
// ✅ Tailwind para utilities
<div className="flex items-center gap-4 p-4">

// ✅ Combinado cuando sea necesario
<Box 
  sx={{ backgroundColor: theme.palette.primary.main }}
  className="rounded-lg shadow-lg"
>
```

---

## 🏛️ MÓDULOS ESPECÍFICOS - TERMINOLOGÍA COOMUNITY

### **ÜPlay (GPL Gamified Play List):**

```typescript
// ✅ Términos correctos para ÜPlay
interface UPlayProps {
  videoUrl: string;
  questions?: QuestionOverlay[]; // Preguntas gamificadas
  meritos?: number;            // Mëritos ganados
  ondas?: number;              // Öndas (energía vibracional)
  ayniLevel?: number;          // Nivel de reciprocidad
}

// ✅ Componentes típicos de ÜPlay
- InteractiveVideoPlayer
- QuestionOverlay  
- RewardDisplay
- ProgressTracker
- GameficationMetrics
```

### **Marketplace (GMP Gamified Match Place):**

```typescript
// ✅ Términos correctos para Marketplace
interface MarketplaceItem {
  type: 'product' | 'service'; // Productos Y servicios
  title: string;
  description: string;
  units: number;               // Ünits (moneda interna)
  emprendedor: string;         // Emprendedor Confiable
  ayniScore: number;           // Puntuación Ayni
}
```

### **Social:**

```typescript
// ✅ Conceptos sociales CoomÜnity
interface SocialFeatures {
  bienComun: boolean;          // Bien Común
  colaboracion: 'alta' | 'media' | 'baja';
  reciprocidad: number;        // Nivel Ayni
  community: string;           // Nombre de CoomÜnidad
}
```

---

## 🚫 ERRORES COMUNES A EVITAR

### **1. Imports Incorrectos:**

```typescript
// ❌ NUNCA hagas esto
import { Privacy } from '@mui/icons-material';     // No existe
import '../../../lib/api-service';                 // Path incorrecto común
import { Configuration } from '@prisma/client';    // Modelo incorrecto

// ✅ En su lugar usa:
import { Lock } from '@mui/icons-material';
import '../../../../lib/api-service';               // Verifica path
import { AppConfig } from '@prisma/client';
```

### **2. Arquitectura Incorrecta:**

```typescript
// ❌ NUNCA conectes con Supabase
import { createClient } from '@supabase/supabase-js';

// ❌ NUNCA uses fetch directo
fetch('http://localhost:3002/api/users');

// ✅ SIEMPRE usa apiService
import { apiService } from '../lib/api-service';
const data = await apiService.get('/users');
```

### **3. Terminología Incorrecta:**

```typescript
// ❌ Términos genéricos
points, credits, money, likes

// ✅ Terminología CoomÜnity
meritos, ondas, units, ayni, bienComun
```

---

## 🎯 CHECKLIST DE VALIDACIÓN PRE-GENERACIÓN

Antes de generar código, VERIFICA:

- [ ] **¿Los imports tienen paths correctos relativo a src/?**
- [ ] **¿Usas iconos MUI que realmente existen?**
- [ ] **¿El componente sigue la estructura React obligatoria?**
- [ ] **¿Usas apiService en lugar de fetch directo?**
- [ ] **¿Incorporas terminología CoomÜnity relevante?**
- [ ] **¿El código es TypeScript con tipado estricto?**
- [ ] **¿Manejas estados de loading, error y success?**
- [ ] **¿El diseño usa MUI + Tailwind apropiadamente?**

---

## 🌟 FILOSOFÍA COOMUNITY EN CÓDIGO

### **Principios a Reflejar:**

1. **Ayni (Reciprocidad):** Las funciones deben ser equilibradas - si tomas datos, provides valor
2. **Bien Común:** Prioriza experiencia colectiva sobre optimización individual
3. **Cooperación:** Componentes que faciliten colaboración vs competencia
4. **Transparencia:** Código claro, comentado, mantenible

### **Ejemplo de Alineación Filosófica:**

```typescript
// ✅ Refleja filosofía CoomÜnity
const AyniExchangeComponent: React.FC = () => {
  // Principio: Dar y recibir en equilibrio
  const handleExchange = async (offering: Offering, requesting: Request) => {
    const ayniBalance = calculateAyniBalance(offering, requesting);
    if (ayniBalance.isBalanced) {
      // Procede con intercambio justo
      await apiService.post('/exchanges', { offering, requesting });
    } else {
      // Sugiere ajustes para equilibrio
      showAyniSuggestions(ayniBalance.suggestions);
    }
  };

  return (
    <Card className="ayni-exchange">
      <Typography variant="h6">
        Intercambio en Equilibrio (Ayni)
      </Typography>
      {/* UI que promueve reciprocidad justa */}
    </Card>
  );
};
```

---

## 🎖️ CONFIGURACIÓN DE DESARROLLO

### **Variables de Entorno:**

```bash
# Backend NestJS
VITE_API_BASE_URL=http://localhost:3002

# SuperApp Frontend
VITE_BASE_URL=http://localhost:3001  # O puerto auto-asignado

# Autenticación 
VITE_ENABLE_MOCK_AUTH=false  # Usar backend real
```

### **Credenciales de Testing:**

```typescript
// ✅ Credenciales válidas del backend
const testCredentials = {
  admin: { email: 'admin@gamifier.com', password: 'admin123' },
  user: { email: 'user@gamifier.com', password: '123456' },
  premium: { email: 'premium@gamifier.com', password: '123456' }
};
```

---

## 🚀 RESUMEN EJECUTIVO

**¡ESTAS INSTRUCCIONES SON CRÍTICAS!**
Siguiendo estas reglas, Builder.io generará código que:

- ✅ Se integra perfectamente con la arquitectura existente
- ✅ Respeta la filosofía CoomÜnity
- ✅ Evita errores de importación
- ✅ Mantiene consistencia en el codebase
- ✅ Funciona con el backend NestJS real

**Recuerda:** Cada línea de código debe servir al **Bien Común** de la plataforma CoomÜnity. 🌟

---

*Generado para prevenir errores de importación y mantener la coherencia arquitectónica del proyecto CoomÜnity SuperApp.*
