# Gamifier Admin UI Components

Este documento proporciona una guía completa de todos los componentes de UI disponibles en el sistema Gamifier Admin, incluyendo ejemplos de uso, props y mejores prácticas.

## 📋 Índice

1. [Componentes de Botón](#componentes-de-botón)
2. [Componentes de Navegación](#componentes-de-navegación)
3. [Componentes de Layout](#componentes-de-layout)
4. [Componentes de Filtrado](#componentes-de-filtrado)
5. [Componentes de Datos](#componentes-de-datos)
6. [Componentes de Estado](#componentes-de-estado)
7. [Componentes de Feedback](#componentes-de-feedback)
8. [Tema y Estilos](#tema-y-estilos)

## 🔘 Componentes de Botón

### GamifierButton

Botón personalizado con múltiples variantes y estados.

**Ubicación**: `src/components/common/Button/GamifierButton.tsx`

**Props**:
```typescript
interface GamifierButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Ejemplo de uso**:
```tsx
import { GamifierButton } from '../components/common/Button';
import { Add as AddIcon } from '@mui/icons-material';

<GamifierButton 
  variant="primary" 
  icon={<AddIcon />}
  onClick={handleCreate}
>
  Crear Nuevo
</GamifierButton>
```

**Variantes disponibles**:
- `primary`: Botón principal (dorado)
- `secondary`: Botón secundario (gris oscuro)
- `outline`: Botón con borde
- `ghost`: Botón transparente
- `danger`: Botón de acción destructiva (rojo)

## 🧭 Componentes de Navegación

### NavigationMenu

Menú de navegación jerárquico con soporte para categorías y anidamiento.

**Ubicación**: `src/components/common/Navigation/NavigationMenu.tsx`

**Props**:
```typescript
interface NavigationMenuProps {
  items: NavigationItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed?: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: NavigationItem[];
  category?: string;
  badge?: string | number;
  divider?: boolean;
  disabled?: boolean;
}
```

**Ejemplo de uso**:
```tsx
import { NavigationMenu } from '../components/common/Navigation';

const navigationItems = [
  {
    id: 'home',
    label: 'Inicio',
    icon: <HomeIcon />,
    path: '/',
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: <SecurityIcon />,
    category: 'Admin',
    children: [
      {
        id: 'users',
        label: 'Usuarios',
        icon: <PeopleIcon />,
        path: '/users',
      }
    ]
  }
];

<NavigationMenu
  items={navigationItems}
  currentPath={location.pathname}
  onNavigate={navigate}
/>
```

### GamifierHeader

Header personalizado con breadcrumbs, menú de usuario y notificaciones.

**Ubicación**: `src/components/common/Header/GamifierHeader.tsx`

**Props**:
```typescript
interface GamifierHeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
    roles?: string[];
  };
  notifications?: number;
  onMenuToggle?: () => void;
  onLogout?: () => void;
  actions?: React.ReactNode;
}
```

## 📐 Componentes de Layout

### ResponsiveContainer

Contenedor base para layouts responsivos.

**Ubicación**: `src/components/common/Layout/ResponsiveContainer.tsx`

**Props**:
```typescript
interface ResponsiveContainerProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  padding?: number | string;
  margin?: number | string;
  children: React.ReactNode;
}
```

### AdminPageContainer

Contenedor específico para páginas de administración con título y subtítulo.

**Props**:
```typescript
interface AdminPageContainerProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}
```

**Ejemplo de uso**:
```tsx
import { AdminPageContainer } from '../components/common/Layout';

<AdminPageContainer
  title="Gestión de Usuarios"
  subtitle="Administra los usuarios del sistema"
  actions={
    <GamifierButton variant="primary" icon={<AddIcon />}>
      Nuevo Usuario
    </GamifierButton>
  }
>
  {/* Contenido de la página */}
</AdminPageContainer>
```

### ResponsiveGrid

Grid CSS responsivo con configuración de breakpoints.

**Props**:
```typescript
interface ResponsiveGridProps {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number | string;
  children: React.ReactNode;
}
```

## 🔍 Componentes de Filtrado

### FilterPanel

Panel de filtros avanzado con múltiples tipos de entrada.

**Ubicación**: `src/components/common/FilterPanel/FilterPanel.tsx`

**Props**:
```typescript
interface FilterPanelProps {
  filters: FilterOption[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
  defaultExpanded?: boolean;
  title?: string;
}

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'autocomplete';
  placeholder?: string;
  options?: { value: string; label: string }[];
  multiple?: boolean;
}
```

**Ejemplo de uso**:
```tsx
import { FilterPanel } from '../components/common/FilterPanel';

const filterOptions = [
  {
    key: 'search',
    label: 'Buscar',
    type: 'text',
    placeholder: 'Buscar por nombre...',
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
    ],
  }
];

<FilterPanel
  filters={filterOptions}
  values={filterValues}
  onChange={setFilterValues}
  onClear={() => setFilterValues({})}
/>
```

## 📊 Componentes de Datos

### DataTable

Tabla de datos con paginación, ordenamiento y filtrado.

**Ubicación**: `src/components/common/DataTable/DataTable.tsx`

**Props**:
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  isLoading?: boolean;
  isError?: boolean;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSortChange?: (sortBy: string, direction: 'asc' | 'desc') => void;
}
```

### MetricCard

Tarjeta para mostrar métricas y valores importantes.

**Ubicación**: `src/components/common/MetricCard/MetricCard.tsx`

**Props**:
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'secondary';
  isLoading?: boolean;
}
```

## ⏳ Componentes de Estado

### LoadingSpinner

Indicador de carga con diferentes variantes.

**Ubicación**: `src/components/common/LoadingSpinner/LoadingSpinner.tsx`

**Props**:
```typescript
interface LoadingSpinnerProps {
  message?: string;
  size?: number | string;
  minHeight?: string;
  variant?: 'default' | 'centered' | 'inline';
}
```

## 💬 Componentes de Feedback

### ErrorMessage

Componente para mostrar mensajes de error con opciones de reintento.

**Ubicación**: `src/components/common/ErrorMessage/ErrorMessage.tsx`

**Props**:
```typescript
interface ErrorMessageProps {
  message: string;
  title?: string;
  severity?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  retryLabel?: string;
  showRetry?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
}
```

### ConfirmDialog

Diálogo de confirmación para acciones destructivas.

**Ubicación**: `src/components/common/ConfirmDialog/ConfirmDialog.tsx`

**Props**:
```typescript
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}
```

## 🎨 Tema y Estilos

### Paleta de Colores

El tema utiliza los siguientes colores principales:

- **Primary**: `#CDAB5A` (Dorado Gamifier)
- **Secondary**: `#272727` (Gris oscuro)
- **Background**: `#F8F9FA` (Claro) / `#121212` (Oscuro)
- **Paper**: `#FFFFFF` (Claro) / `#1E1E1E` (Oscuro)

### Tipografía

- **Font Family**: Poppins, Helvetica, Arial, sans-serif
- **Tamaños**: h1 (2.5rem) a h6 (1rem)
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Espaciado

- **Base**: 8px
- **Border Radius**: 8px (componentes), 12px (tarjetas)

## 📱 Diseño Responsivo

Todos los componentes siguen un enfoque mobile-first con breakpoints:

- **xs**: 0px
- **sm**: 600px
- **md**: 900px
- **lg**: 1200px
- **xl**: 1536px

## 🚀 Ejemplo de Página Completa

Puedes ver todos los componentes en acción en la página de ejemplo:

**Ruta**: `/example`
**Archivo**: `src/pages/ExamplePage.tsx`

Esta página demuestra:
- Todas las variantes de botones
- Panel de filtros interactivo
- Grid responsivo con tarjetas
- Layout de página de administración

## 📦 Importación

Para usar cualquier componente, puedes importarlo desde el índice principal:

```tsx
import { 
  GamifierButton, 
  FilterPanel, 
  AdminPageContainer,
  DataTable,
  MetricCard 
} from '../components/common';
```

O desde su ubicación específica:

```tsx
import { GamifierButton } from '../components/common/Button';
import { FilterPanel } from '../components/common/FilterPanel';
```

## 🔧 Personalización

Todos los componentes aceptan la prop `sx` de Material-UI para personalización adicional:

```tsx
<GamifierButton 
  variant="primary"
  sx={{ 
    borderRadius: 2, 
    textTransform: 'uppercase' 
  }}
>
  Botón Personalizado
</GamifierButton>
```

## 🧪 Testing

Todos los componentes incluyen tests unitarios completos. Para ejecutar los tests:

```bash
npm test -- src/components/common --run
```

## 📝 Contribución

Al agregar nuevos componentes:

1. Crear la carpeta del componente en `src/components/common/`
2. Implementar el componente con TypeScript
3. Crear tests unitarios
4. Actualizar el archivo `index.ts`
5. Documentar en este archivo
6. Agregar ejemplo en `ExamplePage.tsx` si es relevante 