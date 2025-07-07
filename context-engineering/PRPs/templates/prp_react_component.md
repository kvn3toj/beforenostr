# 🎨 PRP Template: React Component Development

## 📋 Información del Template
- **Tipo:** Desarrollo de Componentes React
- **Proyecto:** CoomÜnity SuperApp/Admin
- **Contexto:** Frontend React + TypeScript + MUI + Tailwind
- **Nivel:** Intermedio-Avanzado

---

## 🎯 Prompt Pattern

### Contexto Inicial
```
Eres un experto en desarrollo de componentes React para CoomÜnity.

CONTEXTO CRÍTICO:
- Proyecto: CoomÜnity [SuperApp/Admin] (Puerto [3001/3000])
- Stack: React 18+, TypeScript, MUI v7, Tailwind CSS
- Filosofía: Bien Común, Ayni, Cooperación, Transparencia
- Directorio: [src/components/categoria/]

ARQUITECTURA OBLIGATORIA:
- Backend NestJS único en puerto 3002
- Frontend conectado via apiService
- Autenticación JWT automática
- Estados loading/error/empty OBLIGATORIOS

ANTES DE EMPEZAR:
1. Lee CLAUDE.md para reglas específicas
2. Verifica que backend esté corriendo en 3002
3. Confirma directorio de trabajo correcto
4. Identifica categoría del componente (common/layout/pages)
```

### Especificación del Componente
```
COMPONENTE REQUERIDO:
- Nombre: [ComponentName]
- Categoría: [common/layout/pages]
- Funcionalidad: [Descripción detallada]
- Props esperadas: [Lista de props]
- Estados internos: [Estados necesarios]
- Integraciones: [APIs, hooks, servicios]

REQUISITOS TÉCNICOS:
- TypeScript estricto con interfaces
- MUI components con sx prop
- Responsive design obligatorio
- Accesibilidad (aria-labels)
- Manejo de errores explícito
- Loading states durante operaciones

FILOSOFÍA COOMUNITY:
- ¿Cómo fomenta la colaboración?
- ¿Aplica principios de Ayni?
- ¿Evita patrones adictivos?
- ¿Promueve transparencia?
```

### Estructura Esperada
```
ESTRUCTURA REQUERIDA:
```tsx
// src/components/[categoria]/[ComponentName].tsx
import { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface [ComponentName]Props {
  // Props tipadas con JSDoc
}

export const [ComponentName]: FC<[ComponentName]Props> = ({ 
  ...props 
}) => {
  // 1. Hooks y estado local
  // 2. Funciones auxiliares
  // 3. Effects si necesario
  // 4. Event handlers
  // 5. Render con JSX

  return (
    <Box sx={{ /* estilos responsive */ }}>
      {/* JSX estructurado */}
    </Box>
  );
};
```

PATRONES OBLIGATORIOS:
- Componentes funcionales únicamente
- Destructuring de props
- Memoización cuando sea necesario
- Early returns para validaciones
- Comentarios JSDoc para props complejas
```

---

## 🔄 Response Pattern

### Análisis Inicial
```
**ANÁLISIS DEL COMPONENTE:**

🎯 **Propósito:** [Descripción clara del objetivo]
🏗️ **Categoría:** [common/layout/pages]
🔧 **Complejidad:** [Baja/Media/Alta]
🎨 **Filosofía CoomÜnity:** [Cómo se alinea con valores]

**DEPENDENCIAS IDENTIFICADAS:**
- Hooks necesarios: [lista]
- Servicios API: [lista]
- Componentes MUI: [lista]
- Utilidades: [lista]

**ESTADOS REQUERIDOS:**
- Loading: [cuándo y por qué]
- Error: [tipos de errores posibles]
- Data: [estructura de datos]
- UI: [estados visuales]
```

### Implementación Paso a Paso
```
**PASO 1: ESTRUCTURA BASE**
```tsx
// Implementación inicial con estructura completa
```

**PASO 2: TIPADO TYPESCRIPT**
```tsx
// Interfaces y tipos necesarios
```

**PASO 3: LÓGICA DE NEGOCIO**
```tsx
// Hooks, funciones auxiliares, handlers
```

**PASO 4: RENDERIZADO**
```tsx
// JSX con componentes MUI y estilos
```

**PASO 5: ESTADOS DE CARGA/ERROR**
```tsx
// Manejo de loading, error, empty states
```
```

### Validación y Testing
```
**VALIDACIÓN TÉCNICA:**
- [ ] TypeScript sin errores
- [ ] Props correctamente tipadas
- [ ] Responsive design implementado
- [ ] Accesibilidad verificada
- [ ] Estados loading/error/empty
- [ ] Integración con backend (si aplica)

**VALIDACIÓN FILOSÓFICA:**
- [ ] Fomenta colaboración
- [ ] Aplica principios de Ayni
- [ ] Evita patrones adictivos
- [ ] Promueve transparencia
- [ ] Diseño inclusivo

**TESTING SUGERIDO:**
```tsx
// Test unitario básico
describe('[ComponentName]', () => {
  it('should render correctly', () => {
    render(<[ComponentName] />);
    expect(screen.getByRole('[role]')).toBeInTheDocument();
  });
});
```
```

---

## 📝 Ejemplo de Uso

### Prompt de Ejemplo
```
Necesito crear un componente VideoItemCard para mostrar videos en la SuperApp.

ESPECIFICACIONES:
- Muestra thumbnail, título, duración, autor
- Permite like/dislike y comentarios
- Integra con backend para obtener datos
- Responsive para mobile y desktop
- Debe fomentar interacción colaborativa

FILOSOFÍA:
- Los likes/dislikes deben ser constructivos
- Comentarios deben promover diálogo
- Autor debe recibir Mëritos por engagement
- Transparencia en métricas de interacción
```

### Response Esperada
```
**ANÁLISIS DEL COMPONENTE:**

🎯 **Propósito:** Mostrar video con interacciones colaborativas
🏗️ **Categoría:** common (reutilizable)
🔧 **Complejidad:** Media
🎨 **Filosofía CoomÜnity:** Fomenta diálogo constructivo y reconocimiento

**IMPLEMENTACIÓN:**

```tsx
// src/components/common/VideoItemCard.tsx
import { FC, useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box,
  IconButton,
  Chip
} from '@mui/material';
import { ThumbUp, ThumbDown, Comment } from '@mui/icons-material';
import { useVideoInteraction } from '../../hooks/useVideoInteraction';

interface VideoItemCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
    author: string;
    likes: number;
    dislikes: number;
    comments: number;
  };
  onInteraction?: (type: 'like' | 'dislike' | 'comment', videoId: string) => void;
}

export const VideoItemCard: FC<VideoItemCardProps> = ({ 
  video, 
  onInteraction 
}) => {
  const { handleLike, handleDislike, isLoading } = useVideoInteraction(video.id);
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        borderRadius: 3,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        }
      }}
    >
      <CardMedia
        component="img"
        height="194"
        image={video.thumbnail}
        alt={video.title}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent>
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {video.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Por {video.author}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Chip 
            label={formatDuration(video.duration)} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 2 
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={() => handleLike()}
              disabled={isLoading}
              size="small"
              color="primary"
              aria-label="Me gusta"
            >
              <ThumbUp fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {video.likes}
              </Typography>
            </IconButton>
            
            <IconButton 
              onClick={() => handleDislike()}
              disabled={isLoading}
              size="small"
              color="secondary"
              aria-label="No me gusta"
            >
              <ThumbDown fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {video.dislikes}
              </Typography>
            </IconButton>
          </Box>
          
          <IconButton 
            onClick={() => onInteraction?.('comment', video.id)}
            size="small"
            aria-label="Comentarios"
          >
            <Comment fontSize="small" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {video.comments}
            </Typography>
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};
```

**FILOSOFÍA APLICADA:**
- ✅ Interacciones constructivas (like/dislike con propósito)
- ✅ Reconocimiento al autor visible
- ✅ Diseño que invita al diálogo (comentarios prominentes)
- ✅ Transparencia en métricas
- ✅ Accesibilidad completa
```

---

## 🎯 Criterios de Éxito

### Técnicos
- [ ] Componente funcional sin errores
- [ ] TypeScript estricto cumplido
- [ ] Responsive design verificado
- [ ] Accesibilidad implementada
- [ ] Estados loading/error manejados
- [ ] Integración backend funcionando

### Filosóficos
- [ ] Alineado con valores CoomÜnity
- [ ] Fomenta colaboración
- [ ] Evita patrones adictivos
- [ ] Promueve transparencia
- [ ] Diseño inclusivo

### Calidad
- [ ] Código limpio y mantenible
- [ ] Documentación completa
- [ ] Tests unitarios pasando
- [ ] Performance optimizado
- [ ] Reutilizable y escalable

---

## 📚 Recursos Adicionales

### Documentación
- [CLAUDE.md](../CLAUDE.md) - Reglas globales
- [Material UI Components](https://mui.com/components/)
- [React Hooks](https://react.dev/reference/react)

### Herramientas
- **React DevTools:** Debugging de componentes
- **Storybook:** Desarrollo aislado
- **Chromatic:** Visual testing

### Patrones Relacionados
- [PRP Hook Development](./prp_react_hooks.md)
- [PRP API Integration](./prp_api_integration.md)
- [PRP Testing](./prp_testing.md)

---

**Este template PRP garantiza componentes React consistentes, de alta calidad y alineados con la filosofía CoomÜnity.** 