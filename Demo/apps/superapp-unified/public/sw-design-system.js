/**
 * 🌌 DESIGN SYSTEM SERVICE WORKER
 * ==============================
 * 
 * Cache inteligente para componentes del design system CoomÜnity
 * Parte de la Fase 5: Optimización Extrema
 */

const DESIGN_SYSTEM_CACHE = 'coomunity-ds-v2.0';
const PERFORMANCE_CACHE = 'coomunity-performance-v2.0';
const CRITICAL_COMPONENTS = [
  '/static/js/components.chunk.js',
  '/static/css/design-system.css',
  '/static/css/critical.css',
  '/static/js/main.chunk.js',
  // Fonts críticas
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  // Iconos Material UI
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Estrategias de cache por tipo de recurso
const cacheStrategies = {
  tokens: 'cache-first', // Tokens de diseño raramente cambian
  components: 'stale-while-revalidate', // Componentes con updates
  animations: 'network-first', // Animaciones pueden ser pesadas
  images: 'cache-first', // Imágenes del design system
  fonts: 'cache-first', // Fonts raramente cambian
  api: 'network-first' // Datos dinámicos
};

// Performance metrics para monitoreo
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  totalSaved: 0,
  lastOptimization: Date.now()
};

/**
 * Instalación del Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('🌌 CoomÜnity Design System SW: Installing...');
  
  event.waitUntil(
    caches.open(DESIGN_SYSTEM_CACHE)
      .then(cache => {
        console.log('🌌 Caching critical design system resources...');
        return cache.addAll(CRITICAL_COMPONENTS);
      })
      .then(() => {
        console.log('✅ Critical resources cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Error caching critical resources:', error);
      })
  );
});

/**
 * Activación del Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('🌌 CoomÜnity Design System SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Limpiar caches obsoletos
            if (cacheName.startsWith('coomunity-') && 
                cacheName !== DESIGN_SYSTEM_CACHE && 
                cacheName !== PERFORMANCE_CACHE) {
              console.log('🧹 Cleaning old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated and ready');
        return self.clients.claim();
      })
  );
});

/**
 * Intercepción de requests
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Solo interceptar requests relevantes
  if (shouldIntercept(event.request)) {
    event.respondWith(handleRequest(event.request));
  }
});

/**
 * Determina si un request debe ser interceptado
 */
function shouldIntercept(request) {
  const url = new URL(request.url);
  
  // Interceptar recursos del design system
  if (url.pathname.includes('/design-system/') ||
      url.pathname.includes('/static/css/') ||
      url.pathname.includes('/static/js/') ||
      url.pathname.includes('/components/') ||
      url.hostname.includes('fonts.googleapis.com') ||
      url.pathname.includes('/api/')) {
    return true;
  }
  
  return false;
}

/**
 * Maneja requests con estrategias inteligentes
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const resourceType = determineResourceType(url);
  const strategy = cacheStrategies[resourceType] || 'network-first';
  
  console.log(`🔍 Handling ${resourceType} request with ${strategy} strategy:`, url.pathname);
  
  try {
    switch (strategy) {
      case 'cache-first':
        return await handleCacheFirst(request);
      
      case 'network-first':
        return await handleNetworkFirst(request);
      
      case 'stale-while-revalidate':
        return await handleStaleWhileRevalidate(request);
      
      default:
        return await handleNetworkFirst(request);
    }
  } catch (error) {
    console.error('❌ Error handling request:', error);
    return await handleFallback(request);
  }
}

/**
 * Determina el tipo de recurso
 */
function determineResourceType(url) {
  if (url.pathname.includes('/tokens/') || url.pathname.includes('/theme/')) {
    return 'tokens';
  }
  
  if (url.pathname.includes('/components/') || url.pathname.includes('.chunk.js')) {
    return 'components';
  }
  
  if (url.pathname.includes('/animations/') || url.pathname.includes('animations.css')) {
    return 'animations';
  }
  
  if (url.pathname.includes('/images/') || /\.(png|jpg|jpeg|svg|webp)$/.test(url.pathname)) {
    return 'images';
  }
  
  if (url.hostname.includes('fonts.googleapis.com') || url.pathname.includes('/fonts/')) {
    return 'fonts';
  }
  
  if (url.pathname.includes('/api/')) {
    return 'api';
  }
  
  return 'components'; // Default
}

/**
 * Estrategia Cache First
 */
async function handleCacheFirst(request) {
  const cache = await caches.open(DESIGN_SYSTEM_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    performanceMetrics.cacheHits++;
    console.log('✅ Cache hit:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    performanceMetrics.networkRequests++;
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      console.log('📥 Cached new resource:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    performanceMetrics.cacheMisses++;
    console.log('⚠️ Network failed, no cache available:', request.url);
    return await handleFallback(request);
  }
}

/**
 * Estrategia Network First
 */
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    performanceMetrics.networkRequests++;
    
    if (networkResponse.ok) {
      const cache = await caches.open(DESIGN_SYSTEM_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('🌐 Network success, updated cache:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('⚠️ Network failed, trying cache:', request.url);
    
    const cache = await caches.open(DESIGN_SYSTEM_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      performanceMetrics.cacheHits++;
      console.log('✅ Fallback to cache:', request.url);
      return cachedResponse;
    }
    
    performanceMetrics.cacheMisses++;
    return await handleFallback(request);
  }
}

/**
 * Estrategia Stale While Revalidate
 */
async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(DESIGN_SYSTEM_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Respuesta inmediata del cache si existe
  if (cachedResponse) {
    performanceMetrics.cacheHits++;
    console.log('✅ Stale response from cache:', request.url);
    
    // Actualizar en background
    fetch(request)
      .then(networkResponse => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
          console.log('🔄 Background update completed:', request.url);
        }
      })
      .catch(error => {
        console.log('⚠️ Background update failed:', request.url);
      });
    
    return cachedResponse;
  }
  
  // Si no hay cache, obtener de red
  try {
    const networkResponse = await fetch(request);
    performanceMetrics.networkRequests++;
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    performanceMetrics.cacheMisses++;
    return await handleFallback(request);
  }
}

/**
 * Fallback para requests fallidos
 */
async function handleFallback(request) {
  const url = new URL(request.url);
  
  // Fallbacks específicos por tipo de recurso
  if (url.pathname.includes('.css')) {
    return new Response(`
      /* Design System Offline Fallback */
      .offline-message {
        background: #ff9800;
        color: white;
        padding: 16px;
        text-align: center;
        font-family: 'Roboto', sans-serif;
      }
    `, {
      headers: { 'Content-Type': 'text/css' }
    });
  }
  
  if (url.pathname.includes('.js')) {
    return new Response(`
      // Design System Offline Fallback
      console.warn('Design System component unavailable offline:', '${url.pathname}');
      window.designSystemOffline = true;
    `, {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }
  
  if (url.pathname.includes('/api/')) {
    return new Response(JSON.stringify({
      error: 'Service unavailable offline',
      fallback: true,
      timestamp: Date.now()
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Resource unavailable offline', { status: 503 });
}

/**
 * Determina si el design system está estable (menos updates)
 */
function isDesignSystemStable() {
  const now = Date.now();
  const lastUpdate = performanceMetrics.lastOptimization;
  const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60);
  
  // Considerar estable si no hay updates en las últimas 6 horas
  return hoursSinceUpdate > 6;
}

/**
 * Optimización proactiva de cache
 */
async function optimizeCache() {
  console.log('🔧 Starting cache optimization...');
  
  const cache = await caches.open(DESIGN_SYSTEM_CACHE);
  const requests = await cache.keys();
  
  // Limpiar recursos obsoletos
  const obsoleteRequests = requests.filter(request => {
    const url = new URL(request.url);
    // Eliminar versiones antiguas o recursos no utilizados
    return url.pathname.includes('v1.') || url.pathname.includes('.old.');
  });
  
  for (const request of obsoleteRequests) {
    await cache.delete(request);
    console.log('🗑️ Removed obsolete resource:', request.url);
  }
  
  // Precargar recursos críticos que falten
  for (const criticalResource of CRITICAL_COMPONENTS) {
    const cached = await cache.match(criticalResource);
    if (!cached) {
      try {
        const response = await fetch(criticalResource);
        if (response.ok) {
          await cache.put(criticalResource, response);
          console.log('📥 Preloaded critical resource:', criticalResource);
        }
      } catch (error) {
        console.log('⚠️ Failed to preload:', criticalResource);
      }
    }
  }
  
  performanceMetrics.lastOptimization = Date.now();
  console.log('✅ Cache optimization completed');
}

/**
 * Reporte de performance metrics
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_METRICS') {
    const cacheEfficiency = performanceMetrics.cacheHits / 
      (performanceMetrics.cacheHits + performanceMetrics.cacheMisses) * 100;
    
    event.ports[0].postMessage({
      ...performanceMetrics,
      cacheEfficiency: Math.round(cacheEfficiency) || 0,
      timestamp: Date.now()
    });
  }
  
  if (event.data && event.data.type === 'OPTIMIZE_CACHE') {
    optimizeCache();
  }
});

/**
 * Optimización automática cada 2 horas
 */
setInterval(() => {
  optimizeCache();
}, 2 * 60 * 60 * 1000);

console.log('🌌 CoomÜnity Design System Service Worker loaded successfully'); 