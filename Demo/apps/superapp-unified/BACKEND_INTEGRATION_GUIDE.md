# 🔗 Guía de Integración Backend - CoomÜnity SuperApp

## 📋 Resumen de la Integración Completada

La **Fase 48: Integración Backend Completa** ha sido implementada exitosamente. La aplicación React ahora puede conectarse al backend real en lugar de usar solo datos mockeados.

## 🚀 Cómo Verificar la Integración

### **Paso 1: Configurar Variables de Entorno**

1. Copia el archivo de configuración:
```bash
cd apps/superapp-unified
cp env.example .env.local
```

2. Edita `.env.local` con las configuraciones correctas:
```bash
# Backend principal
VITE_API_BASE_URL=http://localhost:3333
VITE_ENABLE_MOCK_AUTH=false

# Gamifier API (si tienes uno)
VITE_GAMIFIER_API_URL=http://localhost:1111
VITE_GAMIFIER_API_KEY=tu-api-key

# Modo desarrollo
VITE_DEV_MODE=true
VITE_DEBUG_BACKEND=true
```

### **Paso 2: Iniciar el Backend**

Asegúrate de que el backend está corriendo:

```bash
# Desde la raíz del proyecto
cd backend
node server.js
```

Deberías ver:
```
🚀 CoomÜnity Backend API Server
=====================================
🌐 Server running on: http://localhost:3333
📊 Health check: http://localhost:3333/health
📚 API docs: http://localhost:3333/api
```

### **Paso 3: Iniciar el Frontend**

En otra terminal:

```bash
cd apps/superapp-unified
npm run dev
```

### **Paso 4: Verificar la Conectividad**

Abre la aplicación en tu navegador: `http://localhost:3333`

#### **🔍 Indicadores de Conexión**

**✅ Backend Conectado:**
- Mensaje: "🌐 Conectado al servidor • Datos en tiempo real"
- Los datos se cargan desde el backend
- No aparecen alertas de modo offline

**❌ Backend Offline:**
- Mensaje: "🔌 Modo Offline - Usando datos simulados"
- Aparece un banner amarillo de advertencia
- Los datos son simulados (fallback)

### **Paso 5: Probar Funcionalidades Específicas**

#### **🏠 Dashboard (Home)**
- Verifica que los datos de gamificación se cargan del backend
- Los puntos Öndas y nivel deberían reflejar datos reales
- El balance del wallet debería mostrar información del servidor

#### **💰 Wallet**
- Los balances y transacciones deberían venir del backend
- Verifica que las cuentas se muestren correctamente
- Las transacciones deberían tener timestamps reales

#### **🏪 Marketplace**
- Los productos deberían cargarse desde el backend
- El perfil del merchant debería mostrar datos reales
- Las estadísticas deberían reflejar información del servidor

### **Paso 6: Verificar Network Tab**

1. Abre **DevTools** → **Network**
2. Recarga la página
3. Busca llamadas a:
   - `http://localhost:3333/health`
   - `http://localhost:3333/api/user-profile/`
   - `http://localhost:3333/api/merchant-data`
   - `http://localhost:3333/api/pilgrim/profile`

**Status 200 = ✅ Conexión exitosa**
**Status 4xx/5xx = ❌ Error de conexión**

## 🔧 Componentes Actualizados

### **Nuevos Servicios Creados:**

1. **`api-service.ts`** - Servicio centralizado para llamadas HTTP
2. **`useRealBackendData.ts`** - Hooks de React Query para datos del backend

### **Páginas Actualizadas:**

1. **`Home.tsx`** - Dashboard con datos híbridos (real + fallback)
2. **`Wallet.tsx`** - Wallet conectado al backend
3. **`MarketplaceMain.tsx`** - Marketplace con productos reales

### **Funcionalidades Implementadas:**

- ✅ **Health Check automático** del backend
- ✅ **Fallback inteligente** a datos mockeados
- ✅ **Indicadores visuales** de estado de conexión
- ✅ **React Query** para caching y sincronización
- ✅ **Manejo de errores** robusto
- ✅ **Botones de refresh** para reintento manual

## 📊 Endpoints del Backend Utilizados

| Endpoint | Descripción | Hook Usado |
|----------|-------------|------------|
| `/health` | Health check del servidor | `useBackendHealth()` |
| `/api/user-profile/:userId` | Perfil del usuario | `useUserProfile()` |
| `/api/pilgrim/profile` | Datos de gamificación | `useGameData()` |
| `/api/merchant-data` | Datos del marketplace | `useMarketplaceData()` |
| `/api/merchant/profile` | Perfil del merchant | `useMerchantProfile()` |
| `/api/merchant/products` | Productos disponibles | `useProducts()` |

## 🎯 Configuración de React Query

La aplicación usa **React Query** para:
- **Caching inteligente** (5-30 minutos según el tipo de dato)
- **Refetch automático** al reconectar
- **Retry logic** con backoff exponencial
- **Background updates**
- **Optimistic updates** para mutaciones

## 🔄 Sistema de Fallback

La aplicación implementa un **sistema híbrido** que:

1. **Intenta conectar** al backend real
2. **Detecta errores** de conexión automáticamente
3. **Cambia a datos mockeados** si el backend no está disponible
4. **Muestra indicadores visuales** del estado de conexión
5. **Permite reintentos manuales** con botones de refresh

## 🐛 Troubleshooting

### **Problema: "Modo Offline" permanente**
**Solución:**
1. Verifica que el backend esté corriendo en `localhost:3333`
2. Revisa las variables de entorno (`VITE_API_BASE_URL`)
3. Comprueba la consola del navegador para errores CORS
4. Verifica que no haya un firewall bloqueando el puerto 3000

### **Problema: Datos no se actualizan**
**Solución:**
1. Usa el botón de "Refresh" en cada página
2. Limpia el cache del navegador
3. Verifica que el endpoint del backend devuelve datos actualizados

### **Problema: Errores en la consola**
**Solución:**
1. Verifica que todas las dependencias estén instaladas
2. Revisa que el backend devuelve el formato JSON esperado
3. Comprueba que los tipos TypeScript coincidan con la respuesta del backend

## 🎉 Estado Actual

✅ **COMPLETADO:** Integración Backend Completa
- ✅ Servicios de API centralizados
- ✅ Hooks de React Query implementados
- ✅ Páginas principales conectadas
- ✅ Sistema de fallback robusto
- ✅ Indicadores de estado visual
- ✅ Manejo de errores completo

## 🔄 Próximos Pasos Sugeridos

1. **Implementar autenticación real** con tokens JWT
2. **Agregar más endpoints** según las necesidades
3. **Optimizar el caching** según patrones de uso
4. **Implementar WebSockets** para actualizaciones en tiempo real
5. **Añadir tests** para los hooks y servicios de API

## 📞 Soporte

Si encuentras problemas con la integración, verifica:
1. **Backend Status**: `curl http://localhost:3333/health`
2. **Variables de entorno**: Revisa `.env.local`
3. **Console logs**: Busca errores en DevTools
4. **Network tab**: Verifica las llamadas HTTP

La aplicación está diseñada para funcionar tanto **online** como **offline**, proporcionando una experiencia fluida independientemente del estado del backend. 