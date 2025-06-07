# 🎨 Gamifier Design System

## Introducción

El **Gamifier Design System** es un conjunto coherente de tokens de diseño, componentes reutilizables y pautas que garantizan una experiencia de usuario consistente en toda la aplicación Gamifier Admin.

## 🏗️ Arquitectura

El Design System está organizado siguiendo la metodología **Atomic Design**:

```
src/components/design-system/
├── tokens/           # Tokens de diseño (colores, espaciado, tipografía)
├── atoms/           # Componentes básicos (Button, TextField)
├── molecules/       # Componentes compuestos (Card)
└── index.ts         # Exportaciones centralizadas
```

## 🎯 Tokens de Diseño

### Colores

Los colores están organizados por categorías y siguen la identidad visual de CoomÜnity:

```typescript
import { colors } from '@/components/design-system';

// Colores primarios
colors.primary.main     // #CEA93A (Dorado principal)
colors.primary.light    // #E4C373 (Dorado claro)
colors.primary.dark     // #B8954A (Dorado oscuro)

// Colores de estado
colors.success.main     // #10B981
colors.error.main       // #EF4444
colors.warning.main     // #F59E0B
colors.info.main        // #3B82F6
```

### Espaciado

Sistema basado en múltiplos de 8px:

```typescript
import { spacing, componentSpacing } from '@/components/design-system';

spacing.xs      // 4px
spacing.sm      // 8px
spacing.md      // 16px
spacing.lg      // 24px
spacing.xl      // 32px
spacing['2xl']  // 48px

// Espaciado para componentes específicos
componentSpacing.padding.button.medium  // "8px 24px"
componentSpacing.padding.card           // 24px
```

### Tipografía

Fuentes y estilos de texto consistentes:

```typescript
import { typography, textStyles } from '@/components/design-system';

// Familias de fuentes
typography.fontFamily.primary  // "Inter", "Poppins", "Helvetica", "Arial", sans-serif

// Estilos predefinidos
textStyles.h1      // Encabezado principal
textStyles.body    // Texto de cuerpo
textStyles.button  // Texto de botones
```

## 🧱 Componentes Atómicos

### Button

Botón personalizable con múltiples variantes y estados:

```typescript
import { Button } from '@/components/design-system';

<Button 
  variant="primary"      // primary | secondary | outline | ghost | danger | success
  size="medium"          // small | medium | large
  loading={false}
  icon={<SaveIcon />}
  iconPosition="left"    // left | right
  fullWidth={false}
>
  Guardar Cambios
</Button>
```

**Variantes disponibles:**
- `primary`: Acción principal (dorado)
- `secondary`: Acción secundaria (gris oscuro)
- `outline`: Botón con borde
- `ghost`: Botón transparente
- `danger`: Acciones destructivas (rojo)
- `success`: Confirmaciones (verde)

### TextField

Campo de texto con validación y estados mejorados:

```typescript
import { TextField } from '@/components/design-system';

<TextField
  variant="outlined"     // outlined | filled
  size="medium"          // small | medium | large
  label="Email"
  placeholder="Ingresa tu email"
  error={false}
  success={false}
  helpText="Campo requerido"
  showPasswordToggle={true}  // Para campos de contraseña
  startIcon={<EmailIcon />}
  endIcon={<SearchIcon />}
/>
```

## 🧬 Componentes Moleculares

### Card

Contenedor versátil para organizar contenido:

```typescript
import { Card } from '@/components/design-system';

<Card
  variant="default"      // default | outlined | elevated | interactive
  title="Título de la Tarjeta"
  subtitle="Subtítulo opcional"
  headerIcon={<UserIcon />}
  contentPadding="medium" // none | small | medium | large
  showDivider={true}
  actions={
    <Button variant="primary">Acción</Button>
  }
  onClick={() => console.log('Card clicked')} // Solo para variant="interactive"
>
  Contenido de la tarjeta
</Card>
```

## 📚 Uso e Importación

### Importación Individual

```typescript
import { Button, TextField, Card } from '@/components/design-system';
import { colors, spacing, textStyles } from '@/components/design-system';
```

### Importación Completa

```typescript
import * as DS from '@/components/design-system';

<DS.Button variant="primary">Click me</DS.Button>
```

## 🎨 Utilidades

### Helper Functions

```typescript
import { 
  applyTextStyle, 
  getColorWithOpacity, 
  shadows 
} from '@/components/design-system';

// Aplicar estilos de texto
const headingStyle = applyTextStyle('h1');

// Colores con opacidad
const primaryWithOpacity = getColorWithOpacity('#CEA93A', 0.5);

// Sombras consistentes
sx={{ boxShadow: shadows.md }}
```

## 🔧 Implementación en Páginas Existentes

### LoginPage ✅

**Antes:**
```typescript
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
```

**Después:**
```typescript
import { Button, TextField } from '../components/design-system';
import { colors, spacing } from '../components/design-system';
```

### UsersPage ✅

**Mejoras aplicadas:**
- Botón "Crear Usuario" usa `variant="primary"`
- Campo de filtro usa componente TextField del DS
- Contenedores con colores y espaciado consistentes
- DialogTitle con estilos del Design System

## 🎯 Beneficios del Design System

### 1. **Consistencia Visual**
- Todos los componentes siguen la misma paleta de colores
- Espaciado uniforme en toda la aplicación
- Tipografía coherente

### 2. **Mantenibilidad**
- Cambios centralizados en tokens de diseño
- Componentes reutilizables
- Documentación clara

### 3. **Escalabilidad**
- Fácil agregar nuevos componentes
- Tokens extensibles
- Arquitectura modular

### 4. **Experiencia de Desarrollo**
- Autocompletado con TypeScript
- Props tipadas y documentadas
- Importaciones centralizadas

## 🚀 Próximos Pasos

### Componentes Pendientes
- [ ] **Dropdown/Select** - Selector avanzado
- [ ] **Modal** - Diálogos personalizados
- [ ] **Table** - Tabla de datos mejorada
- [ ] **Stepper** - Wizard de pasos
- [ ] **Toast** - Notificaciones
- [ ] **Badge** - Indicadores de estado

### Mejoras Planificadas
- [ ] **Tema Oscuro** - Soporte para dark mode
- [ ] **Responsive Tokens** - Espaciado adaptativo
- [ ] **Animaciones** - Transiciones consistentes
- [ ] **Accesibilidad** - Mejoras ARIA
- [ ] **Storybook** - Documentación interactiva

## 📋 Guía de Migración

Para migrar componentes existentes al Design System:

1. **Identificar componentes MUI** que necesitan reemplazo
2. **Importar del Design System** en lugar de MUI
3. **Actualizar props** según la nueva API
4. **Aplicar tokens** de colores y espaciado
5. **Verificar visualmente** que todo funciona

## 🔗 Referencias

- [Material-UI Documentation](https://mui.com/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [Design Tokens W3C](https://www.w3.org/community/design-tokens/)

---

**Implementado por:** Cursor AI & Kevin P.  
**Fecha:** Enero 2025  
**Versión:** 1.0.0 