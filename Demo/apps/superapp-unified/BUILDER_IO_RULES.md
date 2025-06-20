# 🎯 Builder.io Rules & Best Practices

## 🚨 CRITICAL: Preventing Hook Errors and Import Issues

Este documento define las reglas obligatorias para prevenir errores como el **error d5xc6yq0t** que ocurrió en `HorizontalPlayerDemo` y otros componentes complejos cuando se usan con Builder.io.

---

## 📋 Quick Start

### ✅ Antes de cada commit:
```bash
npm run validate:builder
```

### 🔧 Auto-fix issues:
```bash
npm run validate:builder:fix
```

### 📖 Ver ayuda completa:
```bash
npm run builder:help
```

---

## 🚨 REGLAS CRÍTICAS

### 1. 🔧 IMPORTS DE MATERIAL UI - OBLIGATORIO

**❌ NUNCA hacer esto:**
```typescript
import {
  Box, Typography, Card, Button, IconButton, Dialog, DialogContent,
  Fade, Zoom, Grid, Container, Stack, Slide, Alert, Slider
} from '@mui/material';

import {
  PlayArrow, Pause, VolumeUp, VolumeOff, Fullscreen, FullscreenExit,
  Quiz, CheckCircle, Cancel, Star, EmojiEvents, ArrowBack, Settings
} from '@mui/icons-material';
```

**✅ SIEMPRE hacer esto:**
```typescript
// Imports específicos de componentes MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Imports específicos de iconos MUI
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
```

**🎯 Razón:** Los imports masivos causan bundle bloat y pueden generar errores de dependencias circulares en Builder.io.

### 2. 🔄 ORDEN DE HOOKS - CRÍTICO

**✅ ORDEN CORRECTO:**
```typescript
// 1. Primero: Funciones sin dependencias de otros callbacks
const clearQuestionTimer = useCallback(() => {
  if (questionTimerRef.current) {
    clearInterval(questionTimerRef.current);
    questionTimerRef.current = null;
  }
  setIsQuestionTimerActive(false);
}, []);

// 2. Segundo: Funciones que dependen de las anteriores
const handleSkipQuestion = useCallback(() => {
  if (!activeQuestion) return;
  clearQuestionTimer(); // ✅ Ya está definido
  setActiveQuestion(null);
}, [activeQuestion, clearQuestionTimer]);

// 3. Tercero: Funciones que dependen de las anteriores
const startQuestionTimer = useCallback((timeLimit: number) => {
  setQuestionTimeRemaining(timeLimit);
  // Puede usar handleSkipQuestion
}, [handleSkipQuestion]);
```

**❌ ORDEN INCORRECTO:**
```typescript
// ❌ startQuestionTimer usa handleSkipQuestion que aún no existe
const startQuestionTimer = useCallback(() => {
  handleSkipQuestion(); // ❌ Error: no está definido
}, [handleSkipQuestion]);

const handleSkipQuestion = useCallback(() => {
  // Definido después
}, []);
```

### 3. 🧹 CLEANUP OBLIGATORIO

**✅ SIEMPRE implementar:**
```typescript
// Cleanup effect al final del componente
useEffect(() => {
  return () => {
    // Limpiar todos los timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }
  };
}, []);

// Error handlers para debugging
useEffect(() => {
  const handleError = (event: ErrorEvent) => {
    console.error('🚨 Error capturado:', event.message);
  };
  
  window.addEventListener('error', handleError);
  return () => window.removeEventListener('error', handleError);
}, []);
```

### 4. 🛡️ ERROR BOUNDARIES ESPECIALIZADOS

**✅ Para componentes complejos:**
```typescript
// En App.tsx
<VideoPlayerErrorBoundary>
  <HorizontalPlayerDemo />
</VideoPlayerErrorBoundary>
```

### 5. 📦 REFS TIPADOS CORRECTAMENTE

**✅ CORRECTO:**
```typescript
const videoRef = useRef<HTMLVideoElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
```

**❌ INCORRECTO:**
```typescript
const videoRef = useRef<HTMLIFrameElement>(null); // Para video HTML5
```

---

## 🎯 CASOS ESPECÍFICOS

### 📹 Componentes de Video/Media

Para componentes como `HorizontalPlayerDemo`, `VideoPlayer`, etc.:

```typescript
const VideoComponent: React.FC = () => {
  // 1. Error handler específico
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('Builder') || 
          event.message.includes('hook')) {
        console.error('🚨 Builder.io Error:', {
          message: event.message,
          component: 'VideoComponent'
        });
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // 2. Refs tipados correctamente
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 3. Cleanup obligatorio
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 4. Hooks en orden correcto
  const clearTimer = useCallback(() => {
    // Lógica de limpieza
  }, []);

  const handleAction = useCallback(() => {
    clearTimer(); // ✅ Definido antes
  }, [clearTimer]);

  // Resto del componente...
};
```

---

## 🔧 HERRAMIENTAS DE VALIDACIÓN

### Scripts Disponibles:

```bash
# Validación completa
npm run validate:builder

# Validación + auto-fix
npm run validate:builder:fix

# Linting específico Builder.io
npm run lint:builder

# Pre-commit completo
npm run pre-commit

# Check rápido
npm run builder:check

# Ayuda completa
npm run builder:help
```

### Archivos de Configuración:

- `.builderrules` - Reglas detalladas
- `.eslintrc.builder.js` - ESLint específico
- `scripts/validate-builder-rules.js` - Validador automático
- `.husky/pre-commit` - Hook de Git

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### Error: "Rendered more hooks than during the previous render"

**Causa:** Orden incorrecto de hooks o dependencias circulares.

**Solución:**
1. Reorganizar `useCallback` en orden de dependencias
2. Verificar que no hay referencias circulares
3. Agregar cleanup effects

### Error: "Cannot resolve module @mui/material"

**Causa:** Imports masivos que confunden el bundler.

**Solución:**
1. Cambiar a imports específicos
2. Ejecutar `npm run validate:builder:fix`

### Error: "Hook call order changed"

**Causa:** Hooks condicionales o en orden incorrecto.

**Solución:**
1. Mover todos los hooks al inicio del componente
2. Evitar hooks dentro de condicionales
3. Usar el validador: `npm run validate:builder`

---

## 📊 CHECKLIST PRE-COMMIT

Antes de hacer commit, verificar:

- [ ] ✅ Imports específicos (no masivos) de Material UI
- [ ] ✅ useCallback en orden correcto de dependencias  
- [ ] ✅ Cleanup effect implementado
- [ ] ✅ Error boundary aplicado si es componente complejo
- [ ] ✅ Refs tipados correctamente
- [ ] ✅ Logging de debugging incluido
- [ ] ✅ Todas las dependencias en useEffect
- [ ] ✅ Manejo de errores Builder.io implementado

---

## 🎯 TESTING

### Para componentes complejos:

1. **Crear versión simplificada para testing:**
   ```typescript
   // HorizontalPlayerDemo.tsx - Versión principal
   // HorizontalPlayerDemoSimple.tsx - Versión de testing
   ```

2. **Probar en Builder.io preview:**
   - Verificar que no hay errores en consola
   - Confirmar que los hooks funcionan correctamente
   - Validar que las interacciones responden

3. **Ejecutar validaciones:**
   ```bash
   npm run validate:builder
   npm run test:e2e
   ```

---

## 🆘 TROUBLESHOOTING

### Si encuentras un error de hooks:

1. **Ejecutar validador:**
   ```bash
   npm run validate:builder
   ```

2. **Revisar orden de hooks:**
   - Verificar que `useCallback` están en orden correcto
   - Confirmar que no hay dependencias circulares

3. **Agregar debugging:**
   ```typescript
   useEffect(() => {
     console.log('🔍 Component mounted:', componentName);
     return () => console.log('🧹 Component unmounted:', componentName);
   }, []);
   ```

4. **Crear versión simplificada:**
   - Remover funcionalidades complejas temporalmente
   - Probar que React funciona básicamente
   - Agregar funcionalidades gradualmente

---

## 📞 SOPORTE

Si tienes problemas con Builder.io:

1. **Revisar logs:** Buscar errores con IDs específicos (ej. d5xc6yq0t)
2. **Ejecutar validador:** `npm run validate:builder`
3. **Consultar documentación:** Ver `.builderrules`
4. **Crear issue:** Con logs completos y pasos para reproducir

---

**🎯 Estas reglas son OBLIGATORIAS para todos los componentes que usen Builder.io**

*Última actualización: 2025-06-14 - Implementado después del error d5xc6yq0t* 