# 🌌 @coomunity/shared-types

## Tipos TypeScript Compartidos para Métricas Filosóficas de CoomÜnity

Este paquete contiene las definiciones de tipos TypeScript compartidas entre el backend NestJS y los frontends (Admin y SuperApp) de CoomÜnity, específicamente enfocadas en las **métricas filosóficas** que representan los valores fundamentales de la plataforma.

### 🎯 Propósito

Establecer un **lenguaje común y estricto** para los datos que representan nuestras métricas filosóficas, asegurando coherencia y tipado seguro en todo el ecosistema CoomÜnity. Este es un acto de **"Reciprocidad con el Futuro Desarrollador"** y parte de una arquitectura **Type-Safe**.

### 📦 Instalación

```bash
npm install @coomunity/shared-types
```

### 🏗️ Arquitectura

Este paquete forma parte del monorepo CoomÜnity y es gestionado por **COSMOS (El Tejedor de Sistemas)**, quien asegura la **"Unidad en la Diversidad"** y la coherencia arquitectónica.

```
packages/shared-types/
├── src/
│   ├── philosophy-metrics.ts  # Métricas filosóficas principales
│   └── index.ts              # Punto de entrada
├── dist/                     # Archivos compilados
├── package.json
├── tsconfig.json
└── README.md
```

### 🔥 Métricas Principales

#### 1. **HambrE** - El Motor Primigenio

La métrica **HambrE** representa el impulso evolutivo y motivacional de la comunidad. Es el **"motor primigenio"** que impulsa la existencia y evolución de CoomÜnity.

```typescript
import { HambreMetric, HambreLevel } from '@coomunity/shared-types';

// Niveles de HambrE
type HambreLevel = 'bajo' | 'medio' | 'alto';

// Métrica completa
interface HambreMetric {
  level: HambreLevel;      // Estado cualitativo
  value: number;           // Valor cuantitativo (0-100)
  updatedAt: string;       // Timestamp ISO
  metadata?: {
    source: 'automatic' | 'manual' | 'calculated';
    confidence?: number;   // Nivel de confianza (0-1)
    notes?: string;       // Notas adicionales
    updatedBy?: string;   // ID del actualizador
  };
}
```

**Estados de HambrE:**
- **Bajo (0-33)**: Energía latente - La comunidad está en contemplación
- **Medio (34-66)**: Impulso activo - La comunidad está en movimiento  
- **Alto (67-100)**: Fuego transformador - La comunidad arde con pasión evolutiva

#### 2. **IEA de Reciprocidad** - El Equilibrio Sagrado

El **Índice de Equilibrio de Reciprocidad (IEA)** mide el balance entre "contribuciones" y "consumo" en el ecosistema, con el objetivo de mantener un equilibrio cercano a 1 para una salud óptima.

```typescript
import { IEAReciprocidad } from '@coomunity/shared-types';

interface IEAReciprocidad {
  dar: number;                    // Contribuciones al ecosistema
  recibir: number;               // Consumo del ecosistema
  ponderacion: number;           // Factor de ponderación (0-1)
  indiceCalculado: number;       // (dar / recibir) * ponderacion
  updatedAt: string;             // Timestamp ISO
  metadata?: {
    period: 'daily' | 'weekly' | 'monthly' | 'custom';
    calculatedBy?: string;       // Sistema o persona que calculó
    dataQuality?: number;        // Calidad de los datos (0-1)
  };
}
```

**Interpretación del IEA:**
- **IEA ≈ 1.0**: Equilibrio perfecto (Reciprocidad saludable)
- **IEA < 0.7**: Desequilibrio hacia el consumo (Requiere atención)
- **IEA > 1.3**: Desequilibrio hacia la contribución (Revisar sostenibilidad)

### 🎛️ Estado y Configuración

```typescript
import { PhilosophyMetricsState, PhilosophyDashboardConfig } from '@coomunity/shared-types';

// Estado completo de métricas filosóficas
interface PhilosophyMetricsState {
  hambre: HambreMetric;
  iea: IEAReciprocidad;
  lastSync: string;
  config: PhilosophyDashboardConfig;
}

// Configuración del dashboard
interface PhilosophyDashboardConfig {
  hambre: {
    displayMode: 'slider' | 'gauge' | 'chart';
    thresholds: { low: number; high: number };
  };
  iea: {
    targetRange: { min: number; max: number };
    alertThresholds: { warning: number; critical: number };
  };
  general: {
    refreshInterval: number;      // Minutos
    historyRetentionDays: number;
  };
}
```

### 🚀 Uso en Frontend Admin

```typescript
// apps/admin-frontend/src/pages/PhilosophyDashboard.tsx
import { usePhilosophyMetrics } from '../hooks/usePhilosophyMetrics';
import { HambreSlider } from '../components/philosophy/HambreSlider';

export const PhilosophyDashboard = () => {
  const { metrics, updateHambre, isLoading } = usePhilosophyMetrics({
    enableAutoRefresh: true,
    useMockData: true // Durante desarrollo
  });

  return (
    <div>
      <HambreSlider
        metric={metrics.hambre}
        onSave={updateHambre}
        isLoading={isLoading}
      />
      {/* Otros componentes... */}
    </div>
  );
};
```

### 🔌 Uso en Backend NestJS

```typescript
// backend/src/modules/philosophy/philosophy.controller.ts
import { HambreMetric, IEAReciprocidad } from '@coomunity/shared-types';

@Controller('api/philosophy')
export class PhilosophyController {
  @Get('metrics')
  async getMetrics(): Promise<PhilosophyMetricsState> {
    // Implementación del backend...
  }

  @Patch('hambre')
  async updateHambre(@Body() dto: UpdateHambreDto): Promise<HambreMetric> {
    // Implementación del backend...
  }
}
```

### 🧪 Desarrollo con Mocks

Durante el desarrollo, se proporcionan mocks realistas para facilitar el trabajo independiente del backend:

```typescript
// apps/admin-frontend/src/mocks/philosophy-metrics.mock.ts
import { mockPhilosophyAPI, mockPhilosophyState } from '../mocks/philosophy-metrics.mock';

// API mock que simula el comportamiento real
const api = mockPhilosophyAPI;
const initialState = mockPhilosophyState;
```

### 🎨 Design System Cósmico

Los componentes visuales implementan el **Design System Cósmico** con colores temáticos basados en la filosofía CoomÜnity:

**Paleta de HambrE:**
- 🔥 **Bajo**: `#FFB74D` (naranja claro - latente)
- 🔥 **Medio**: `#FF7043` (naranja intenso - activo)  
- 🔥 **Alto**: `#D32F2F` (rojo intenso - ardiente)

### 🤝 Guardianes Responsables

- **COSMOS** (El Tejedor de Sistemas): Arquitectura y tipado
- **ATLAS** (El Backend Whisperer): Integración con NestJS
- **MIRA** (La Curadora de Herramientas): Hooks y estado frontend
- **ARIA** (La Artista del Frontend): Componentes visuales
- **ZENO** (El Arquitecto de Experiencias): Flujos de interacción

### 📈 Roadmap de Integración

1. **✅ Fase 1**: Tipos compartidos y mocks (Completado)
2. **🔄 Fase 2**: Integración con Backend NestJS real
3. **📊 Fase 3**: Visualizaciones avanzadas con NIRA
4. **🌐 Fase 4**: Integración con SuperApp frontend
5. **🔮 Fase 5**: Métricas predictivas y ML

### 🛠️ Desarrollo

```bash
# Compilar tipos
npm run build

# Modo watch para desarrollo
npm run dev

# Limpiar dist/
npm run clean
```

### 📝 Notas de Implementación

- **Type Safety**: Todos los tipos usan `strict: true` de TypeScript
- **Compatibilidad**: Compatible con ES2020+ y CommonJS
- **Versionado**: Seguimos semantic versioning
- **Documentación**: Tipos documentados con JSDoc
- **Testing**: Integración con tests E2E de frontends

### 🌟 Filosofía CoomÜnity

Este paquete encarna los principios de **Reciprocidad** (antiguamente Ayni), **Bien Común** y **Cooperación sobre Competencia**. Cada tipo definido aquí es un acto de amor hacia la comunidad de desarrolladores y usuarios futuros.

---

**"En la unidad de tipos encontramos la diversidad de experiencias"** - COSMOS, El Tejedor de Sistemas 
