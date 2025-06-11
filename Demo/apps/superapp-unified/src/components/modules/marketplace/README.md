# Marketplace Module - Mobile Wireframe Implementation

Este módulo implementa el diseño del marketplace basado en el wireframe de Figma proporcionado, combinando el estado actual con el nuevo diseño móvil.

## Componentes Creados

### 1. RoleToggle.tsx

- Toggle para alternar entre "Consumidor" y "Proveedor"
- Diseño pill con colores específicos del wireframe (#740056)
- Responsive y accesible

### 2. MobileHeader.tsx

- Header móvil con hamburger menu, título "ÜMarket" y iconos de chat/notificaciones
- Implementa la estructura exacta del wireframe
- Colores y tipografía según especificaciones Material Design 3

### 3. MobileSearchBar.tsx

- Barra de búsqueda optimizada para móvil
- Placeholder "¿Qué quieres encontrar?"
- Iconos de búsqueda y micrófono
- Fondo semi-transparente según diseño

### 4. CategoryCarousel.tsx

- Carrusel horizontal de categorías con iconos circulares
- Botón "Ver todo" con icono de suma
- Máximo 4 categorías visibles + botón "Ver todo"
- Etiquetas debajo de cada categoría

### 5. ProductCard.tsx

- Card de producto mejorado basado en el wireframe
- Badge de precio con "ü" para Lükas
- Rating con estrellas y posición "1st"
- Información del proveedor con avatar
- Iconos de bookmark, chat y tag
- Chip "Producto" con borde punteado

## Características Implementadas

### Diseño Móvil First

- Layout optimizado para pantallas de 360px
- Navegación táctil mejorada
- Tipografía Rubik como especificada en el wireframe

### Status Bar Simulado

- Hora "9:30" y iconos de señal/batería
- Fondo #FEF7FF según wireframe
- Tipografía Inter como especificado

### Secciones Principales

1. **Status Bar** - Información del dispositivo
2. **Header** - Navegación y título
3. **Role Toggle** - Consumidor/Proveedor
4. **Search Bar** - Búsqueda principal
5. **Categories** - Carrusel de categorías
6. **Recomendados** - Grid de productos recomendados
7. **Categorías** - Sección adicional de productos por categoría

### Bottom Navigation Actualizado

- Orden: ÜPlay, ÜStats, ÜSocial, ÜMarket
- ÜMarket resaltado con círculo rosa (#E91E63)
- Iconos y etiquetas según wireframe

## Integración con Backend

### Datos Mock vs Reales

- Fallback automático a datos mock cuando el backend no está disponible
- Estructura compatible con API existente
- Productos de ejemplo con todas las propiedades necesarias

### Estados de Carga

- Skeletons mientras cargan los datos
- Mensajes de estado vacío
- Manejo de errores de conexión

## Responsive Design

### Mobile (< 768px)

- Layout del wireframe completo
- Navegación touch-optimizada
- Cards en grid 2x2

### Desktop (>= 768px)

- Mantiene diseño existente
- Layout de grid expandido
- Funcionalidad completa preservada

## Estilos CSS

### marketplace-mobile.css

- Estilos específicos para el diseño móvil
- Variables de colores del wireframe
- Animaciones y transiciones
- Soporte para high contrast mode
- Estados de hover y focus accesibles

## Colores Principales

- **Primary Purple**: #740056 (Consumidor activo, textos)
- **Background**: #FFFFFF (Fondo principal)
- **Surface**: #FFF8F8 (Header background)
- **Secondary**: #625B71 (Títulos, iconos)
- **Accent Pink**: #E91E63 (ÜMarket highlight)
- **Search Background**: rgba(29, 27, 32, 0.08)
- **Category Background**: #E5E5E5

## Funcionalidades

### Interacciones

- Toggle de roles funcional
- Búsqueda integrada con sistema existente
- Navegación entre categorías
- Favoritos (bookmark) con persistencia
- Cards clickeables para detalles

### Accesibilidad

- ARIA labels en todos los elementos interactivos
- Navegación por teclado
- Contraste de colores WCAG compliant
- Estados focus visibles
- Textos descriptivos para screen readers

## Próximos Pasos

1. **Integración de Imágenes**

   - Agregar imágenes reales de categorías
   - Placeholder mejorados para productos
   - Optimización de carga de imágenes

2. **Funcionalidades Avanzadas**

   - Filtros por ubicación geográfica
   - Sistema de chat integrado
   - Notificaciones en tiempo real
   - Sistema de reviews y ratings

3. **Performance**

   - Lazy loading de productos
   - Infinite scroll para catálogo
   - Cache optimizado
   - Imágenes WebP

4. **Testing**
   - Tests unitarios para componentes
   - Tests de integración
   - Tests de accesibilidad
   - Tests de performance móvil

## Estructura de Archivos

```
marketplace/
├── components/
│   ├── RoleToggle.tsx
│   ├── MobileHeader.tsx
│   ├── MobileSearchBar.tsx
│   ├── CategoryCarousel.tsx
│   ├── ProductCard.tsx
│   └── AdvancedSearch.tsx (existente)
├── MarketplaceMain.tsx (actualizado)
└── README.md
```

## Dependencias

- Material-UI 5.x para componentes base
- React Router para navegación
- React Query para manejo de estado servidor
- CSS personalizado para estilos específicos

## Compatibilidad

- React 18+
- Material-UI 5.x
- Navegadores modernos (Chrome 90+, Firefox 88+, Safari 14+)
- iOS Safari 14+
- Chrome Mobile 90+
