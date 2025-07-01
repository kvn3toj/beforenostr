# Sistema de Temas CoomÜnity

## Visión General

Este sistema de temas proporciona una experiencia visual coherente y armoniosa en toda la aplicación CoomÜnity, alineada con los principios filosóficos de la plataforma. Está diseñado para ser flexible, mantenible y escalable.

## Estructura

```
src/theme/
├── colors.ts             # Definiciones centralizadas de colores
├── GuardianColorProvider.tsx  # Proveedor de contexto para colores dinámicos
├── index.ts             # Punto de entrada y exportaciones
├── README.md           # Esta documentación
└── CHANGELOG.md        # Registro de cambios
```

## Componentes Principales

### 1. Sistema de Colores

El archivo `colors.ts` contiene todas las definiciones de colores utilizadas en la aplicación:

- `BRAND_COLORS`: Colores primarios de la marca CoomÜnity
- `THEME_PALETTES`: Paletas temáticas para diferentes secciones
- `MODULE_COLORS`: Colores específicos para cada módulo (ÜPlay, Marketplace, etc.)
- `ELEMENT_COLORS`: Colores asociados a los elementos (Tierra, Agua, Fuego, Aire, Éter)

### 2. GuardianColorProvider

Componente que proporciona colores dinámicos basados en el contexto actual:

```jsx
<GuardianColorProvider element="tierra">
  <YourComponent />
</GuardianColorProvider>
```

Acceso a colores desde componentes:

```jsx
const { palette, getElementColor } = useGuardianColors();
```

## Implementación en Módulos

### Módulo ÜPlay (GPL)

El módulo ÜPlay implementa el sistema de temas con:
- Header y tabs con estilo minimalista
- Cards y chips actualizados
- Transiciones sutiles
- Paleta de colores unificada

### Módulo Marketplace (GMP)

El módulo Marketplace implementa el sistema de temas con:
- Estilo minimalista consistente en tarjetas de productos
- Filtros y barra de búsqueda actualizada
- Estados de carga y error con estilo unificado
- Uso de `MODULE_COLORS.marketplace` para mantener identidad visual
- Componentes de listado con diseño optimizado

## Guía de Uso

### 1. Importación de Colores

```jsx
import { BRAND_COLORS, MODULE_COLORS } from '../theme/colors';
```

### 2. Uso del Proveedor de Colores

```jsx
import { useGuardianColors } from '../components/theme/GuardianColorProvider';

const MyComponent = () => {
  const { palette, getElementColor } = useGuardianColors();
  
  return (
    <Box sx={{ 
      backgroundColor: palette.background,
      color: palette.text.primary 
    }}>
      Contenido
    </Box>
  );
};
```

### 3. Colores de Módulo

Para mantener la identidad visual de cada módulo:

```jsx
<Button 
  sx={{ 
    backgroundColor: MODULE_COLORS.marketplace,
    '&:hover': {
      backgroundColor: alpha(MODULE_COLORS.marketplace, 0.9),
    }
  }}
>
  Acción
</Button>
```

## Mejores Prácticas

1. **Centralización**: Siempre usar colores desde `colors.ts`, nunca hardcodear valores
2. **Consistencia**: Mantener patrones consistentes en componentes similares
3. **Accesibilidad**: Asegurar suficiente contraste entre texto y fondo
4. **Transiciones**: Usar transiciones sutiles para mejorar la experiencia
5. **Estados**: Implementar estados de carga, error y vacío con el mismo sistema de temas

## Versiones

Ver [CHANGELOG.md](./CHANGELOG.md) para el historial completo de cambios. 
