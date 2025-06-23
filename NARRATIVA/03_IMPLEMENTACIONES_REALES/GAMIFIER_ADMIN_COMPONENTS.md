# 🎮 Gamifier Admin - Componentes UI

Documentación completa de los componentes implementados para la administración de Gamifier.

## 📋 Índice

1. [Componentes Básicos](#componentes-básicos)
2. [Componentes de Datos](#componentes-de-datos)
3. [Componentes de Formularios](#componentes-de-formularios)
4. [Componentes de Notificaciones](#componentes-de-notificaciones)
5. [Componentes de Dashboard](#componentes-de-dashboard)
6. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🧱 Componentes Básicos

### Button (Botón Personalizado)

Botón personalizado con múltiples variantes y estados.

**Ubicación:** `src/components/common/Button/`

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Ejemplo:**
```tsx
import { Button } from '../components/common/Button';

<Button variant="primary" icon={<AddIcon />} isLoading={loading}>
  Crear Usuario
</Button>
```

### FilterPanel (Panel de Filtros)

Panel avanzado de filtros con múltiples tipos de campos.

**Ubicación:** `src/components/common/FilterPanel/`

**Props:**
```typescript
interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset: () => void;
  loading?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}
```

**Tipos de filtros soportados:**
- `text` - Campo de texto
- `select` - Selector simple
- `multiselect` - Selector múltiple
- `date` - Selector de fecha
- `dateRange` - Rango de fechas
- `number` - Campo numérico
- `boolean` - Switch/checkbox

**Ejemplo:**
```tsx
import { FilterPanel } from '../components/common/FilterPanel';

const filters = [
  {
    name: 'search',
    label: 'Buscar',
    type: 'text',
    placeholder: 'Buscar usuarios...',
  },
  {
    name: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
    ],
  },
];

<FilterPanel
  filters={filters}
  values={filterValues}
  onChange={setFilterValues}
  onReset={() => setFilterValues({})}
/>
```

---

## 📊 Componentes de Datos

### StatsCard (Tarjeta de Estadísticas)

Tarjeta para mostrar métricas y estadísticas importantes.

**Ubicación:** `src/components/common/StatsCard/`

**Props:**
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  progress?: {
    value: number;
    max?: number;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
  status?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
  actions?: React.ReactNode;
  onClick?: () => void;
}
```

**Características:**
- ✅ Iconos personalizables
- ✅ Indicadores de tendencia (↗️ ↘️)
- ✅ Barras de progreso
- ✅ Estados con chips
- ✅ Acciones personalizadas
- ✅ Efectos hover
- ✅ Clickeable

**Ejemplo:**
```tsx
import { StatsCard } from '../components/common/StatsCard';

<StatsCard
  title="Usuarios Activos"
  value="1,234"
  subtitle="Total de usuarios registrados"
  icon={<People />}
  trend={{ value: 12, isPositive: true, label: 'vs mes anterior' }}
  progress={{ value: 75, color: 'success' }}
  status={{ label: 'Activo', color: 'success' }}
  onClick={() => navigate('/users')}
/>
```

### DataTable (Tabla de Datos Avanzada)

Tabla con funcionalidades avanzadas para gestión de datos.

**Ubicación:** `src/components/common/DataTable/`

**Características:**
- ✅ Paginación
- ✅ Ordenamiento
- ✅ Filtros integrados
- ✅ Selección múltiple
- ✅ Acciones por fila
- ✅ Exportación
- ✅ Estados de carga
- ✅ Responsive

---

## 📝 Componentes de Formularios

### FormBuilder (Constructor de Formularios)

Constructor dinámico de formularios con validación.

**Ubicación:** `src/components/common/FormBuilder/`

**Props:**
```typescript
interface FormBuilderProps<T> {
  fields?: FormField[];
  sections?: FormSection[];
  onSubmit: (data: T) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  defaultValues?: Partial<T>;
}
```

**Tipos de campos soportados:**
- `text` - Campo de texto
- `email` - Campo de email
- `password` - Campo de contraseña
- `number` - Campo numérico
- `textarea` - Área de texto
- `select` - Selector
- `multiselect` - Selector múltiple
- `checkbox` - Checkbox
- `switch` - Switch
- `radio` - Radio buttons
- `date` - Selector de fecha
- `datetime` - Selector de fecha y hora
- `file` - Subida de archivos
- `divider` - Separador
- `section` - Sección con título

**Características:**
- ✅ Validación automática
- ✅ Campos condicionales
- ✅ Grid responsivo
- ✅ Secciones organizadas
- ✅ Valores por defecto
- ✅ Estados de carga

**Ejemplo:**
```tsx
import { FormBuilder, FormField } from '../components/common/FormBuilder';

const fields: FormField[] = [
  {
    name: 'name',
    label: 'Nombre',
    type: 'text',
    required: true,
    gridProps: { xs: 12, md: 6 },
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    gridProps: { xs: 12, md: 6 },
  },
  {
    name: 'role',
    label: 'Rol',
    type: 'select',
    options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'user', label: 'Usuario' },
    ],
    conditional: {
      field: 'type',
      value: 'internal',
      operator: 'equals',
    },
  },
];

<FormBuilder
  fields={fields}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitLabel="Crear Usuario"
/>
```

---

## 🔔 Componentes de Notificaciones

### NotificationCenter (Centro de Notificaciones)

Sistema completo de notificaciones con múltiples tipos y acciones.

**Ubicación:** `src/components/common/NotificationCenter/`

**Props:**
```typescript
interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onAction?: (id: string, actionIndex: number) => void;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  maxNotifications?: number;
}
```

**Hook useNotifications:**
```typescript
const {
  notifications,
  addNotification,
  removeNotification,
  clearAll,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} = useNotifications();
```

**Características:**
- ✅ 4 tipos: success, error, warning, info
- ✅ Auto-dismiss configurable
- ✅ Acciones personalizadas
- ✅ Posicionamiento flexible
- ✅ Animaciones suaves
- ✅ Timestamps
- ✅ Límite de notificaciones
- ✅ Notificaciones persistentes

**Ejemplo:**
```tsx
import { NotificationCenter, useNotifications } from '../components/common/NotificationCenter';

const { notifications, showSuccess, showError, removeNotification } = useNotifications();

// Mostrar notificaciones
showSuccess('Usuario creado exitosamente');
showError('Error al conectar con el servidor', {
  title: 'Error de Conexión',
  persistent: true,
  actions: [
    { label: 'Reintentar', onClick: () => retry() },
    { label: 'Reportar', onClick: () => report() },
  ],
});

// Renderizar
<NotificationCenter
  notifications={notifications}
  onDismiss={removeNotification}
  position={{ vertical: 'top', horizontal: 'right' }}
/>
```

---

## 📈 Componentes de Dashboard

### Dashboard (Dashboard Configurable)

Dashboard con widgets configurables y acciones.

**Ubicación:** `src/components/common/Dashboard/`

**Props:**
```typescript
interface DashboardProps {
  widgets: DashboardWidget[];
  onRefresh?: (widgetId: string) => void;
  onConfigure?: (widgetId: string) => void;
  onRemove?: (widgetId: string) => void;
  onFullscreen?: (widgetId: string) => void;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
```

**Widget Configuration:**
```typescript
interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  gridProps?: GridProps;
  loading?: boolean;
  error?: string;
  refreshable?: boolean;
  configurable?: boolean;
  removable?: boolean;
  fullscreenable?: boolean;
}
```

**Características:**
- ✅ Widgets configurables
- ✅ Grid responsivo
- ✅ Acciones por widget
- ✅ Estados de carga y error
- ✅ Menús contextuales
- ✅ Pantalla completa
- ✅ Drag & drop (futuro)

**Ejemplo:**
```tsx
import { Dashboard, DashboardWidget } from '../components/common/Dashboard';

const widgets: DashboardWidget[] = [
  {
    id: 'users',
    title: 'Total Usuarios',
    component: StatsCard,
    props: {
      title: 'Usuarios',
      value: '1,234',
      icon: <People />,
    },
    gridProps: { xs: 12, md: 6, lg: 3 },
    refreshable: true,
    configurable: true,
  },
];

<Dashboard
  title="Dashboard de Administración"
  widgets={widgets}
  onRefresh={handleRefresh}
  onConfigure={handleConfigure}
/>
```

---

## 🎨 Ejemplos de Uso

### Página de Administración Completa

```tsx
import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
  Dashboard,
  StatsCard,
  FilterPanel,
  FormBuilder,
  NotificationCenter,
  useNotifications,
} from '../components/common';

export const AdminPage: React.FC = () => {
  const { notifications, showSuccess, removeNotification } = useNotifications();
  const [filterValues, setFilterValues] = useState({});

  const widgets = [
    {
      id: 'users',
      title: 'Usuarios',
      component: StatsCard,
      props: {
        title: 'Total Usuarios',
        value: '1,234',
        trend: { value: 12, isPositive: true },
      },
      refreshable: true,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>

      <Dashboard
        widgets={widgets}
        onRefresh={() => showSuccess('Dashboard actualizado')}
      />

      <NotificationCenter
        notifications={notifications}
        onDismiss={removeNotification}
      />
    </Box>
  );
};
```

### Formulario de Creación de Usuario

```tsx
const userFormFields: FormField[] = [
  {
    name: 'personalInfo',
    label: 'Información Personal',
    type: 'section',
  },
  {
    name: 'name',
    label: 'Nombre Completo',
    type: 'text',
    required: true,
    gridProps: { xs: 12, md: 6 },
  },
  {
    name: 'email',
    label: 'Correo Electrónico',
    type: 'email',
    required: true,
    gridProps: { xs: 12, md: 6 },
  },
  {
    name: 'divider1',
    type: 'divider',
  },
  {
    name: 'permissions',
    label: 'Permisos y Roles',
    type: 'section',
  },
  {
    name: 'role',
    label: 'Rol Principal',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'moderator', label: 'Moderador' },
      { value: 'user', label: 'Usuario' },
    ],
    gridProps: { xs: 12, md: 6 },
  },
  {
    name: 'permissions',
    label: 'Permisos Adicionales',
    type: 'multiselect',
    options: [
      { value: 'users.create', label: 'Crear Usuarios' },
      { value: 'users.edit', label: 'Editar Usuarios' },
      { value: 'content.manage', label: 'Gestionar Contenido' },
    ],
    conditional: {
      field: 'role',
      value: 'user',
      operator: 'not_equals',
    },
    gridProps: { xs: 12 },
  },
];

<FormBuilder
  fields={userFormFields}
  onSubmit={handleCreateUser}
  submitLabel="Crear Usuario"
  loading={isCreating}
/>
```

---

## 🚀 Próximas Mejoras

### Componentes Planificados

1. **FileUploader** - Subida de archivos con drag & drop
2. **DataVisualization** - Gráficos y visualizaciones
3. **Calendar** - Calendario de eventos
4. **Timeline** - Línea de tiempo de actividades
5. **Kanban** - Tablero Kanban para tareas
6. **Chat** - Sistema de chat en tiempo real

### Mejoras Existentes

1. **Drag & Drop** en Dashboard
2. **Temas personalizables**
3. **Modo oscuro/claro**
4. **Internacionalización completa**
5. **Accesibilidad mejorada**
6. **Tests unitarios**

---

## 📚 Recursos Adicionales

- [Material-UI Documentation](https://mui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0  
**Autor:** Gamifier Development Team 