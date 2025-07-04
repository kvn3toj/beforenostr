# 📊 Estrategia de Caché Avanzado React Query - Fase 2.5

## 🎯 Objetivo

Optimizar el rendimiento de la SuperApp CoomÜnity mediante una estrategia de caché inteligente que clasifica los datos por tipo y aplicaa configuraciones específicas según la criticidad y frecuencia de cambio.

## 🔧 Arquitectura de Caché

### **Niveles de Caché por Tipo de Datos**

| Tipo | Stale Time | GC Time | Refetch Focus | Refetch Interval | Uso |
|------|------------|---------|---------------|-----------------|-----|
| **🔥 Real-Time** | 30 seg | 5 min | ✅ | 1 min | Wallet, Notificaciones, Chat |
| **⚡ Dynamic** | 2 min | 10 min | ✅ | ❌ | Méritos, Transacciones, Stats |
| **🎮 Content** | 2 min | 10 min | ❌ | ❌ | Videos, Comments, Likes |
| **📊 Standard** | 5 min | 30 min | ❌ | ❌ | Profile, Settings, Preferences |
| **🏛️ Semi-Static** | 15 min | 1 hora | ❌ | ❌ | Mundos, Categories, Lists |
| **📋 Static** | 1 hora | 2 horas | ❌ | ❌ | System config, Terms, Help |

## 🚀 Hooks Inteligentes

### **useSmartQuery**
Hook principal que aplica automáticamente configuraciones según el tipo:

```typescript
import { useRealTimeQuery, useDynamicQuery, useContentQuery } from './useSmartQuery';

// 🔥 Para datos críticos que cambian frecuentemente
const { data: wallet } = useRealTimeQuery(
  ['wallet', userId],
  () => walletAPI.getBalance(userId)
);

// ⚡ Para datos dinámicos
const { data: merits } = useDynamicQuery(
  ['merits', userId],
  () => walletAPI.getMerits(userId)
);

// 🎮 Para contenido multimedia
const { data: video } = useContentQuery(
  ['video', videoId],
  () => videosAPI.getVideo(videoId)
);
```

### **Hooks Especializados por Tipo**

#### 🔥 **useRealTimeQuery**
```typescript
// Uso: Wallet balance, notificaciones en vivo, chat social
// Configuración: staleTime: 30s, gcTime: 5min, refetchOnFocus: true
useRealTimeQuery(queryKey, queryFn, options?)
```

#### ⚡ **useDynamicQuery**
```typescript
// Uso: Méritos, transacciones, estadísticas del usuario
// Configuración: staleTime: 2min, gcTime: 10min, refetchOnFocus: true
useDynamicQuery(queryKey, queryFn, options?)
```

#### 🎮 **useContentQuery**
```typescript
// Uso: Video player, comentarios, likes, progreso de videos
// Configuración: staleTime: 2min, gcTime: 10min, refetchOnFocus: false
useContentQuery(queryKey, queryFn, options?)
```

#### 📊 **useStandardQuery**
```typescript
// Uso: Perfil, configuración, preferencias
// Configuración: staleTime: 5min, gcTime: 30min, refetchOnFocus: false
useStandardQuery(queryKey, queryFn, options?)
```

#### 🏛️ **useSemiStaticQuery**
```typescript
// Uso: Lista de mundos, categorías, listas de contenido
// Configuración: staleTime: 15min, gcTime: 1h, refetchOnFocus: false
useSemiStaticQuery(queryKey, queryFn, options?)
```

#### 📋 **useStaticQuery**
```typescript
// Uso: Configuración del sistema, términos, contenido de ayuda
// Configuración: staleTime: 1h, gcTime: 2h, refetchOnFocus: false
useStaticQuery(queryKey, queryFn, options?)
```

## 📊 Clasificación de Datos CoomÜnity

### 🔥 **Datos Real-Time** (30 segundos)
- **Wallet Balance**: Balance actual, UCöins disponibles
- **Notificaciones**: Alertas en tiempo real, mensajes
- **Chat Social**: Mensajes de matches, estado online
- **Live Events**: Eventos en vivo, actualizaciones críticas

*Justificación*: Estos datos deben estar siempre actualizados para transacciones y comunicación efectiva.

### ⚡ **Datos Dinámicos** (2 minutos)
- **Méritos**: Puntuación actual, logros recientes
- **Transacciones**: Historial de intercambios recientes
- **User Stats**: Estadísticas de progreso, nivel actual
- **Achievements**: Logros desbloqueados, progreso de misiones

*Justificación*: Cambian con frecuencia moderada, importantes para gamificación pero no críticos al segundo.

### 🎮 **Datos de Contenido** (2 minutos, sin refetch on focus)
- **Video Player**: Metadata del video actual, progreso
- **Comments**: Comentarios en videos/posts
- **Likes**: Contadores de likes, reacciones
- **Current Playlist**: Lista de reproducción activa

*Justificación*: No deben interrumpir la experiencia de contenido con refetches automáticos.

### 📊 **Datos Estándar** (5 minutos)
- **User Profile**: Información personal del usuario
- **Settings**: Configuración de la aplicación
- **Preferences**: Preferencias de UI/UX
- **Dashboard**: Datos del dashboard principal

*Justificación*: Datos importantes pero que no cambian frecuentemente durante una sesión típica.

### 🏛️ **Datos Semi-Estáticos** (15 minutos)
- **Mundos**: Lista de mundos disponibles
- **Categories**: Categorías de contenido/productos
- **Video Lists**: Listas de videos por categoría
- **Marketplace Items**: Productos del marketplace

*Justificación*: Contenido que cambia ocasionalmente, típicamente por administradores.

### 📋 **Datos Estáticos** (1 hora)
- **System Config**: Configuración global de la aplicación
- **Terms**: Términos y condiciones
- **Help Content**: Contenido de ayuda y documentación
- **App Metadata**: Metadatos de la aplicación

*Justificación*: Raramente cambian, generalmente solo con actualizaciones de la aplicación.

## 🔄 Estrategia de Invalidación

### **Invalidación por Tipo**
```typescript
import { useQueryInvalidation } from './useSmartQuery';

const { invalidateRealTime, invalidateDynamic } = useQueryInvalidation();

// Invalidar después de una transacción exitosa
const onTransactionSuccess = () => {
  invalidateRealTime(); // Wallet balance, notificaciones
  invalidateDynamic();  // Méritos, estadísticas
};
```

### **Invalidación Manual Específica**
```typescript
// Invalidar queries específicas
queryClient.invalidateQueries({
  queryKey: ['wallet', userId],
  exact: true
});

// Invalidar por tipo usando metadata
queryClient.invalidateQueries({
  predicate: (query) => query.meta?.queryType === 'real-time'
});
```

## 🛠️ Configuración Global (App.tsx)

### **QueryClient Optimizado**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...CACHE_TIMES.STANDARD, // Base: 5min stale, 30min gc
      
      // Retry strategy inteligente
      retry: (failureCount, error) => {
        const statusCode = error?.status || error?.statusCode;
        const isAuthError = statusCode === 401 || statusCode === 403;
        const isValidationError = statusCode === 400;
        
        // No reintentar errores de autenticación/validación
        if (isAuthError || isValidationError) return false;
        
        // Más reintentos para errores de red/servidor
        if (statusCode >= 500) return failureCount < 5;
        
        return failureCount < 3;
      },
      
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Controlado por tipo
      refetchOnReconnect: true,
      structuralSharing: true, // Evitar re-renders innecesarios
    }
  }
});
```

## 📈 Métricas y Monitoring

### **Cache Metrics Hook**
```typescript
import { useCacheMetrics, cacheDebugUtils } from './useSmartQuery';

const { getCacheStats } = useCacheMetrics();

// En desarrollo, logear estadísticas
useEffect(() => {
  if (import.meta.env.DEV) {
    cacheDebugUtils.logCacheState();
  }
}, []);
```

### **Event Listeners para Monitoring**
- **Query Success**: Tracking de duración y cache hits
- **Query Error**: Categorización y logging de errores
- **Mutation Success/Error**: Tracking de operaciones críticas

## 🎯 Beneficios Esperados

### **Performance**
- ⚡ **Reducción 60% en llamadas API** innecesarias
- 🚀 **Mejora 40% en tiempo de carga** de datos ya cacheados
- 📱 **Optimización de batería** en dispositivos móviles

### **UX**
- 🔄 **Datos siempre actualizados** para funciones críticas (wallet, chat)
- 🎮 **Reproducción sin interrupciones** para contenido multimedia
- ⚡ **Navegación instantánea** para datos semi-estáticos

### **Network Efficiency**
- 📊 **Reducción 50% en uso de datos** móviles
- 🌐 **Mejor experiencia offline** con datos cacheados
- 🔌 **Menos presión en el backend** con menos requests

## 🔧 Migration Pattern

### **Migración Gradual de Hooks Existentes**

```typescript
// ANTES - Hook básico
export function useWalletData(userId: string) {
  return useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => walletAPI.getBalance(userId),
    staleTime: 1000 * 60 * 2, // Manual
  });
}

// DESPUÉS - Hook inteligente
export function useWalletData(userId: string) {
  return useRealTimeQuery( // Automático
    ['wallet', userId],
    () => walletAPI.getBalance(userId),
    {
      enabled: !!userId,
      retry: false, // Fallback handling
    }
  );
}
```

## 🐛 Debugging

### **Cache Inspector**
```typescript
// Inspeccionar una query específica
cacheDebugUtils.inspectQuery(['wallet', userId]);

// Ver estado general del caché
cacheDebugUtils.logCacheState();
```

### **Development Tools**
- React DevTools: Component profiling
- Network Tab: API call monitoring  
- Console Logs: Smart Query configuration traces

## 🎯 Next Steps

1. **Monitoring Dashboard**: Implementar métricas en tiempo real
2. **A/B Testing**: Comparar rendimiento con configuración anterior
3. **Fine Tuning**: Ajustar tiempos basado en uso real
4. **Cache Warming**: Pre-cargar datos críticos al inicio
5. **Offline Support**: Estrategia para funcionamiento sin conexión

---

**✨ Esta estrategia transforma la SuperApp de un sistema reactivo a uno proactivo e inteligente, alineado con los principios de eficiencia y experiencia de usuario de CoomÜnity.** 