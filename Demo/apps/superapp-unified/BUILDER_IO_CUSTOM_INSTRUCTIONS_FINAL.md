# 🎯 BUILDER.IO CUSTOM INSTRUCTIONS - COOMUNITY SUPERAPP
## Instrucciones Específicas para Copiar y Pegar en Builder.io

---

## 🚨 REGLAS CRÍTICAS OBLIGATORIAS

### 1. 🔧 IMPORTS DE MATERIAL UI - NUNCA MASIVOS

**❌ PROHIBIDO:**
```typescript
import { Box, Typography, Card, Button, IconButton } from '@mui/material';
import { PlayArrow, Pause, VolumeUp } from '@mui/icons-material';
```

**✅ OBLIGATORIO:**
```typescript
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
```

### 2. 🔄 ORDEN DE HOOKS - CRÍTICO PARA EVITAR ERRORES

**✅ ORDEN CORRECTO:**
```typescript
// 1. Primero: Funciones sin dependencias
const clearTimer = useCallback(() => {
  if (timerRef.current) clearInterval(timerRef.current);
}, []);

// 2. Segundo: Funciones que dependen de las anteriores
const handleAction = useCallback(() => {
  clearTimer(); // ✅ Ya definido
}, [clearTimer]);

// 3. Tercero: Funciones que dependen de las anteriores
const startProcess = useCallback(() => {
  handleAction(); // ✅ Ya definido
}, [handleAction]);
```

### 3. 🧹 CLEANUP OBLIGATORIO

**✅ SIEMPRE incluir al final del componente:**
```typescript
useEffect(() => {
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, []);
```

### 4. 🛡️ ERROR BOUNDARIES PARA COMPONENTES COMPLEJOS

**✅ Envolver componentes de video/media:**
```typescript
<VideoPlayerErrorBoundary>
  <MiComponenteComplejo />
</VideoPlayerErrorBoundary>
```

### 5. 📦 REFS TIPADOS CORRECTAMENTE

**✅ CORRECTO:**
```typescript
const videoRef = useRef<HTMLVideoElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
```

### 6. 🎯 ESTRUCTURA DE COMPONENTE OBLIGATORIA

```typescript
interface MiComponenteProps {
  title: string;
  onAction?: (data: any) => void;
}

const MiComponente: React.FC<MiComponenteProps> = ({ title, onAction }) => {
  // 1. Estados
  const [loading, setLoading] = useState(false);
  
  // 2. Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3. Hooks en orden correcto (sin dependencias primero)
  const clearState = useCallback(() => {
    setLoading(false);
  }, []);
  
  const handleClick = useCallback(() => {
    clearState(); // ✅ Ya definido
  }, [clearState]);
  
  // 4. Effects con cleanup
  useEffect(() => {
    return () => {
      // Cleanup aquí
    };
  }, []);
  
  // 5. Early returns
  if (!title) return null;
  
  // 6. Render
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6">{title}</Typography>
    </Card>
  );
};
```

### 7. 🚨 DETECCIÓN DE ERRORES BUILDER.IO

**✅ Incluir en componentes complejos:**
```typescript
useEffect(() => {
  const handleError = (event: ErrorEvent) => {
    if (event.message.includes('Builder') || event.message.includes('hook')) {
      console.error('🚨 Builder.io Error:', {
        message: event.message,
        component: 'MiComponente'
      });
    }
  };
  
  window.addEventListener('error', handleError);
  return () => window.removeEventListener('error', handleError);
}, []);
```

---

## 🎯 TERMINOLOGÍA COOMUNITY OBLIGATORIA

### Usar estos términos específicos:
- **Mëritos** (no "points" o "credits")
- **Öndas** (energía vibracional)
- **Lükas** (moneda interna)
- **Reciprocidad** (reciprocidad)
- **Bien Común** (no "common good")
- **Emprendedores Confiables** (no "trusted sellers")

### Módulos específicos:
- **ÜPlay** = GPL Gamified Play List (reproductor de video)
- **Marketplace** = GMP Gamified Match Place (productos Y servicios)
- **Social** = funcionalidades sociales y colaboración
- **UStats** = estadísticas y métricas

---

## 🚫 ERRORES CRÍTICOS A EVITAR

### ❌ NUNCA hagas:
1. Imports masivos de Material UI
2. useCallback en orden incorrecto
3. Componentes sin cleanup effects
4. Refs mal tipados
5. Fetch directo (usar apiService)
6. Conectar con Supabase
7. Terminología genérica en lugar de CoomÜnity

### ✅ SIEMPRE haz:
1. Imports específicos individuales
2. Hooks en orden de dependencias
3. Cleanup effects para timers
4. Error boundaries para componentes complejos
5. Tipado estricto TypeScript
6. Manejo de estados loading/error/success

---

## 🔧 CONFIGURACIÓN TÉCNICA

### Stack Tecnológico:
- React 18+ con TypeScript
- Material UI v7 (imports individuales)
- Tailwind CSS para utilities
- Backend NestJS (puerto 3002)
- JWT para autenticación

### Variables de entorno:
```bash
VITE_API_BASE_URL=http://localhost:3002
VITE_ENABLE_MOCK_AUTH=false
```

### Credenciales de testing:
```typescript
admin: { email: 'admin@gamifier.com', password: 'admin123' }
user: { email: 'user@gamifier.com', password: '123456' }
```

---

## 📋 CHECKLIST PRE-GENERACIÓN

Antes de generar código, verificar:
- [ ] ✅ Imports específicos (no masivos) de Material UI
- [ ] ✅ useCallback en orden correcto de dependencias
- [ ] ✅ Cleanup effect implementado
- [ ] ✅ Error boundary si es componente complejo
- [ ] ✅ Refs tipados correctamente
- [ ] ✅ Terminología CoomÜnity incluida
- [ ] ✅ TypeScript con tipado estricto
- [ ] ✅ Manejo de estados loading/error/success

---

## 🎯 FILOSOFÍA COOMUNITY

Cada componente debe reflejar:
1. **Reciprocidad (Reciprocidad):** Equilibrio entre dar y recibir
2. **Bien Común:** Beneficio colectivo sobre individual
3. **Cooperación:** Facilitar colaboración vs competencia
4. **Transparencia:** Código claro y mantenible

---

**🚨 ESTAS REGLAS SON OBLIGATORIAS PARA PREVENIR ERRORES COMO "d5xc6yq0t"**

*Implementado después del error de hooks en HorizontalPlayerDemo - 2025-06-14* 