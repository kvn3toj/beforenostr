# 🔍 Guía de Verificación de Monitoreo en Tiempo Real

Esta guía te ayudará a verificar que todas las herramientas de monitoreo están correctamente integradas y funcionando en la aplicación CoomÜnity SuperApp.

## 📋 Pre-requisitos

Antes de verificar el monitoreo, asegúrate de tener:

1. **Variables de entorno configuradas** (copia `.env.example` a `.env`)
2. **Cuentas creadas** en las plataformas de monitoreo
3. **Dependencias instaladas** (`npm install`)

## 🚀 Paso 1: Instalar Dependencias

```bash
cd apps/superapp-unified
npm install
```

**Verificar que se instalaron las nuevas dependencias:**
- `@sentry/react`
- `@sentry/vite-plugin`
- `web-vitals`
- `gtag`

## ⚙️ Paso 2: Configurar Variables de Entorno

### 2.1 Sentry Configuration

1. **Crear cuenta en Sentry.io** (si no la tienes)
2. **Crear un nuevo proyecto React**
3. **Obtener DSN del proyecto:**
   - Ve a Sentry.io > Tu Proyecto > Settings > Client Keys (DSN)
   - Copia el DSN público (comienza con `https://`)

4. **Configurar variables en `.env`:**
```env
VITE_SENTRY_DSN=https://tu-sentry-dsn@sentry.io/project-id
SENTRY_ORG=tu-organizacion
SENTRY_PROJECT=tu-proyecto
SENTRY_AUTH_TOKEN=tu-auth-token
```

### 2.2 Google Analytics 4 Configuration

1. **Crear propiedad GA4** (si no la tienes)
2. **Obtener Measurement ID:**
   - Ve a GA4 Admin > Data Streams > Tu Stream
   - Copia el Measurement ID (formato: `G-XXXXXXXXXX`)

3. **Configurar en `.env`:**
```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2.3 Configuración General

```env
VITE_APP_VERSION=1.0.0
VITE_ENABLE_WEB_VITALS=true
VITE_PERFORMANCE_SAMPLE_RATE=0.1
```

## 🏃‍♂️ Paso 3: Iniciar la Aplicación

```bash
npm run dev
```

**Verificar que la aplicación inicia sin errores:**
```
✅ Debe mostrar: "🔍 Monitoring initialized" en la consola
✅ Puerto: http://localhost:3333
✅ Sin errores de compilación
```

## 🧪 Paso 4: Pruebas de Verificación

### 4.1 Verificar Sentry Error Tracking

**Método 1: Error Boundary Test**
1. Navega a `http://localhost:3333`
2. Abre DevTools (F12)
3. En la consola, ejecuta:
```javascript
// Simular un error para testing
throw new Error('Test error for Sentry verification');
```

**Método 2: Generar Error en Componente**
1. Temporalmente añade este código en cualquier componente:
```jsx
// SOLO PARA TESTING - REMOVER DESPUÉS
const TestError = () => {
  throw new Error('Component test error');
  return null;
};
```

**Verificación:**
- ✅ Error debe aparecer en Sentry dashboard en ~1-2 minutos
- ✅ Debe incluir stack trace y contexto del navegador
- ✅ Consola debe mostrar: `[Custom Error]` en desarrollo

### 4.2 Verificar Google Analytics 4

**Método 1: Navegación entre páginas**
1. Navega entre diferentes rutas:
   - `/` → `/profile` → `/marketplace` → `/social`
2. Cada cambio de página debe generar un evento

**Método 2: GA4 Real-time verification**
1. Ve a GA4 > Reports > Realtime
2. Debe mostrar usuarios activos
3. Ve eventos de `page_view`

**Verificación:**
- ✅ GA4 Real-time debe mostrar actividad
- ✅ Eventos `page_view` en GA4 Events
- ✅ Consola debe mostrar: `[Custom Event] page_view`

### 4.3 Verificar Web Vitals

**Método 1: Performance testing**
1. Navega por la aplicación normalmente
2. Interactúa con elementos (botones, formularios)
3. Espera 30 segundos

**Método 2: Verificar métricas**
1. Abre DevTools > Network
2. Refresca la página (F5)
3. Interactúa con elementos

**Verificación:**
- ✅ Consola debe mostrar: `[Web Vitals] LCP:`, `[Web Vitals] FID:`, etc.
- ✅ Métricas deben aparecer en Sentry Performance
- ✅ Eventos Web Vitals en GA4

## 📊 Paso 5: Verificar Dashboards

### 5.1 Sentry Dashboard

Accede a tu proyecto en Sentry.io:

**Issues Tab:**
- ✅ Debe mostrar errores capturados
- ✅ Stack traces completos
- ✅ Información del navegador y usuario

**Performance Tab:**
- ✅ Métricas de Web Vitals
- ✅ Transacciones de navegación
- ✅ Renders de componentes

**Releases Tab:**
- ✅ Version `1.0.0` (cuando hagas build de producción)

### 5.2 Google Analytics 4 Dashboard

Accede a tu propiedad GA4:

**Real-time reports:**
- ✅ Usuarios activos en tiempo real
- ✅ Páginas vistas actualmente
- ✅ Eventos en tiempo real

**Events reports:**
- ✅ Evento `page_view`
- ✅ Eventos personalizados de Web Vitals
- ✅ Eventos de interacción de usuario

## 🐛 Paso 6: Testing de Funcionalidades Específicas

### 6.1 Test Error Reporting

```javascript
// En DevTools console
import { reportError } from './lib/monitoring';

// Test error manual
reportError(new Error('Manual test error'), {
  testType: 'manual',
  component: 'console'
});
```

### 6.2 Test Custom Events

```javascript
// En DevTools console
import { reportEvent } from './lib/monitoring';

// Test evento personalizado
reportEvent('test_verification', {
  action: 'manual_test',
  timestamp: new Date().toISOString()
});
```

### 6.3 Test Hooks de Monitoreo

En cualquier componente, temporalmente añade:

```jsx
import { useMonitoring } from '../hooks/useMonitoring';

const TestComponent = () => {
  const { reportButtonClick, reportFormSubmission } = useMonitoring();
  
  return (
    <button onClick={() => reportButtonClick('test_button', 'verification')}>
      Test Monitoring
    </button>
  );
};
```

## ✅ Checklist de Verificación

### Configuración Inicial
- [ ] Dependencias instaladas sin errores
- [ ] Variables de entorno configuradas
- [ ] Aplicación inicia en `http://localhost:3333`
- [ ] Consola muestra "🔍 Monitoring initialized"

### Error Tracking (Sentry)
- [ ] Errores aparecen en Sentry dashboard
- [ ] Stack traces son completos y útiles
- [ ] Contexto del navegador está incluido
- [ ] Error Boundary funciona correctamente

### Analytics (GA4)
- [ ] Eventos de navegación se registran
- [ ] Real-time muestra actividad
- [ ] Eventos personalizados aparecen
- [ ] Métricas de rendimiento se capturan

### Performance Monitoring
- [ ] Web Vitals se miden automáticamente
- [ ] Métricas aparecen en Sentry Performance
- [ ] Componentes lentos se detectan
- [ ] Operaciones async se rastrean

### Hooks Personalizados
- [ ] `useMonitoring` funciona en componentes
- [ ] `usePageViewTracking` captura navegación
- [ ] `useErrorTracking` reporta errores correctamente
- [ ] `usePerformanceTracking` mide rendimiento

## 🚨 Troubleshooting

### Problemas Comunes

**Sentry no recibe errores:**
1. Verifica el DSN en `.env`
2. Comprueba que `VITE_SENTRY_DSN` tiene el prefijo correcto
3. Revisa la consola del navegador por errores de configuración

**GA4 no muestra eventos:**
1. Verifica el Measurement ID
2. Comprueba que `VITE_GA4_MEASUREMENT_ID` es correcto
3. Asegúrate de que el script gtag se carga

**Web Vitals no se reportan:**
1. Verifica que las métricas se están midiendo (consola)
2. Interactúa con la página para generar métricas
3. Espera tiempo suficiente para que se reporten

**Variables de entorno no funcionan:**
1. Reinicia el servidor de desarrollo
2. Verifica que usan el prefijo `VITE_`
3. Comprueba que el archivo `.env` está en la raíz correcta

### Logs de Debugging

Para debugging adicional, activa logs detallados:

```env
VITE_ENABLE_DEBUG_MODE=true
```

## 📈 Próximos Pasos

Una vez verificado el monitoreo básico:

1. **Configurar alertas** en Sentry para errores críticos
2. **Crear dashboards personalizados** en GA4
3. **Configurar umbrales** de performance
4. **Implementar monitoreo de APIs** específicas
5. **Añadir métricas de negocio** personalizadas

## 🎯 Métricas de Éxito

El monitoreo está correctamente implementado si:

- **Error Tracking:** Errores se capturan en <30 segundos
- **Analytics:** Eventos aparecen en tiempo real
- **Performance:** Web Vitals se miden automáticamente
- **Usabilidad:** Impacto mínimo en performance (<5ms overhead)

---

**¡Monitoreo en Tiempo Real implementado exitosamente! 🎉**

La aplicación CoomÜnity SuperApp ahora está preparada para producción con visibilidad completa de errores, performance y comportamiento del usuario. 