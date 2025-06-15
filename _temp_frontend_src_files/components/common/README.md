# Componentes Comunes - Tests Unitarios

Este directorio contiene componentes reusables del proyecto Gamifier Admin con sus respectivos tests unitarios.

## Componentes Implementados

### 1. MetricCard
**Ubicación**: `src/components/common/MetricCard/`
**Propósito**: Mostrar métricas y valores de forma consistente en tarjetas.

**Props**:
- `title`: Título de la métrica
- `value`: Valor a mostrar (string o number)
- `subtitle?`: Subtítulo opcional
- `variant?`: Variante de color ('default' | 'primary' | 'secondary')
- `isLoading?`: Estado de carga

**Tests**: 17 casos de prueba cubriendo renderizado, variantes, estados de carga y edge cases.

### 2. LoadingSpinner
**Ubicación**: `src/components/common/LoadingSpinner/`
**Propósito**: Indicador de carga reutilizable con diferentes variantes.

**Props**:
- `message?`: Mensaje a mostrar (default: 'Cargando...')
- `size?`: Tamaño del spinner (number | string)
- `minHeight?`: Altura mínima del contenedor
- `variant?`: Variante de layout ('default' | 'centered' | 'inline')

**Tests**: 17 casos de prueba cubriendo todas las variantes y configuraciones.

### 3. ErrorMessage
**Ubicación**: `src/components/common/ErrorMessage/`
**Propósito**: Mostrar mensajes de error con opciones de reintento.

**Props**:
- `message`: Mensaje de error
- `title?`: Título opcional
- `severity?`: Severidad ('error' | 'warning' | 'info')
- `onRetry?`: Función de reintento
- `retryLabel?`: Etiqueta del botón de reintento
- `showRetry?`: Mostrar botón de reintento
- `variant?`: Variante del Alert ('standard' | 'filled' | 'outlined')

**Tests**: 22 casos de prueba cubriendo interacciones, variantes y estados.

### 4. DataTable
**Ubicación**: `src/components/common/DataTable/`
**Propósito**: Tabla de datos con paginación, ordenamiento y filtrado.

**Props**:
- `data`: Array de datos
- `columns`: Definición de columnas
- `isLoading?`: Estado de carga
- `isError?`: Estado de error
- `page`, `pageSize`, `totalCount`: Configuración de paginación
- `sortBy`, `sortDirection`: Configuración de ordenamiento
- `onPageChange`, `onPageSizeChange`, `onSortChange`: Callbacks

**Tests**: 9 casos de prueba cubriendo renderizado, paginación, ordenamiento e interacciones.

### 5. ConfirmDialog
**Ubicación**: `src/components/common/ConfirmDialog/`
**Propósito**: Diálogo de confirmación para acciones destructivas.

**Props**:
- `open`: Estado del diálogo
- `onClose`, `onConfirm`: Callbacks
- `title`, `message`: Contenido del diálogo
- `isLoading?`: Estado de carga

**Tests**: 6 casos de prueba cubriendo renderizado, interacciones y estados.

## Patrones de Testing Implementados

### 1. Mocking de MUI Components
Todos los tests mockean los componentes de Material-UI para:
- Evitar dependencias del theme provider
- Simplificar el testing
- Mejorar la velocidad de ejecución
- Facilitar la verificación de props

```typescript
vi.mock('@mui/material', () => ({
  Card: vi.fn(({ children, sx }) => (
    <div data-testid="metric-card" style={sx}>{children}</div>
  )),
  // ... otros componentes
}));
```

### 2. Testing de Props y Estados
- **Props requeridas vs opcionales**: Verificación de renderizado con props mínimas y completas
- **Estados condicionales**: Loading, error, empty states
- **Variantes**: Diferentes configuraciones visuales
- **Edge cases**: Valores extremos, undefined, empty strings

### 3. Testing de Interacciones
- **Eventos de usuario**: Clicks, selecciones, inputs
- **Callbacks**: Verificación de llamadas a funciones
- **Prevención de propagación**: Eventos que deben detenerse

### 4. Accesibilidad
- **Roles semánticos**: Verificación de roles ARIA
- **Labels**: Verificación de etiquetas accesibles
- **Test IDs**: Uso de data-testid para queries estables

## Cobertura de Tests

| Componente | Tests | Cobertura |
|------------|-------|-----------|
| MetricCard | 17 | 100% |
| LoadingSpinner | 17 | 100% |
| ErrorMessage | 22 | 100% |
| DataTable | 9 | 95%+ |
| ConfirmDialog | 6 | 100% |
| **Total** | **71** | **~99%** |

## Comandos de Testing

```bash
# Ejecutar todos los tests de componentes comunes
npm test -- src/components/common --run

# Ejecutar tests en modo watch
npm test -- src/components/common

# Ejecutar tests con coverage
npm test -- src/components/common --coverage
```

## Mejores Prácticas Aplicadas

1. **Separación de Concerns**: Cada componente en su propia carpeta con su test
2. **Naming Conventions**: Tests descriptivos que explican el comportamiento esperado
3. **Setup/Teardown**: Limpieza de mocks entre tests
4. **Assertions Específicas**: Verificaciones precisas de comportamiento
5. **User-Centric Testing**: Tests que simulan interacciones reales del usuario

## Próximos Pasos

1. **Integración**: Actualizar imports en el proyecto para usar estos componentes
2. **Documentación**: Crear Storybook stories para documentación visual
3. **Expansión**: Agregar más componentes comunes según necesidades
4. **Performance**: Implementar tests de performance para componentes complejos

## Contribución

Al agregar nuevos componentes comunes:
1. Seguir la estructura de carpetas establecida
2. Implementar tests completos siguiendo los patrones existentes
3. Actualizar el archivo `index.ts` para exportar el nuevo componente
4. Documentar el componente en este README 