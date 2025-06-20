# Plan de Migración: APIs Mockeadas → Backend Separado

Este documento detalla el plan completo para migrar las llamadas a APIs mockeadas del frontend al nuevo backend separado en Node.js/Express.

## 📋 Resumen Ejecutivo

**Objetivo:** Separar la lógica de APIs del servidor de archivos estáticos, moviendo todas las llamadas de API mockeadas a un backend dedicado.

**Arquitectura Actual:**
- Servidor único en puerto 8080 (archivos estáticos + APIs mockeadas)
- APIs mezcladas con servencia de archivos HTML/CSS/JS

**Arquitectura Objetivo:**
- **Frontend Server** (puerto 8080): Solo archivos estáticos
- **Backend API Server** (puerto 3000): Solo APIs RESTful
- Comunicación HTTP entre ambos servidores

## 🎯 Beneficios de la Migración

1. **Separación de Responsabilidades:** Frontend y backend con roles específicos
2. **Escalabilidad:** Backend independiente fácil de escalar y desplegar
3. **Desarrollo:** Equipos pueden trabajar independientemente
4. **Testing:** APIs testeable independientemente del frontend
5. **Flexibilidad:** Frontend puede consumir APIs desde cualquier servidor

## 📊 Análisis del Estado Actual

### Servidor Actual (`coomunity-local-server.js`)

**Funciones identificadas:**
- ✅ Servir archivos estáticos HTML/CSS/JS
- ✅ APIs mockeadas para /api/health
- ✅ APIs para secciones: Pilgrim, Merchant, Red Pill
- ✅ Manejo de formularios
- ✅ Servir archivos de datos JSON

**Problemas a resolver:**
- ❌ Responsabilidades mezcladas
- ❌ Configuración CORS interna
- ❌ Difícil testing independiente
- ❌ Escalabilidad limitada

## 🚀 Plan de Migración por Fases

### Fase 1: Preparación y Setup Backend ✅

**Estado:** ✅ **COMPLETADO**

**Tareas realizadas:**
- [x] Crear directorio `backend/` 
- [x] Setup `package.json` con dependencias
- [x] Crear `server.js` con Express
- [x] Configurar CORS para puerto 8080
- [x] Implementar endpoints básicos
- [x] Documentación completa (`README.md`)

**Archivos creados:**
- `backend/package.json`
- `backend/server.js`
- `backend/env.example`
- `backend/README.md`

### Fase 2: Implementación de APIs

**Estado:** ✅ **COMPLETADO**

**Endpoints implementados:**

#### Core APIs
- [x] `GET /health` - Health check
- [x] `GET /api` - Documentación de endpoints

#### Pilgrim APIs
- [x] `GET /api/pilgrim-data` - Datos principales
- [x] `GET /api/pilgrim/profile` - Perfil de usuario
- [x] `GET /api/pilgrim/journey` - Progreso del viaje
- [x] `GET /api/pilgrim/quests` - Misiones disponibles

#### Merchant APIs
- [x] `GET /api/merchant-data` - Datos principales
- [x] `GET /api/merchant/profile` - Perfil del merchant
- [x] `GET /api/merchant/products` - Productos
- [x] `GET /api/merchant/matches` - Conexiones

#### Red Pill APIs
- [x] `GET /api/red-pill-data` - Datos principales
- [x] `GET /api/red-pill/questions` - Preguntas de quiz
- [x] `GET /api/red-pill/results` - Resultados y análisis

#### User & Data APIs
- [x] `GET /api/user-profile/:userId` - Perfil de usuario
- [x] `GET /api/user/preferences/:userId` - Preferencias
- [x] `GET /api/data/recommendations` - Recomendaciones
- [x] `POST /api/submit-form` - Formularios genéricos

### Fase 3: Identificación de Llamadas Frontend

**Estado:** 🔄 **EN PROCESO**

**Archivos a revisar:**

#### HTML Files
```bash
# Buscar referencias a fetch() o $.ajax() en archivos HTML
find data/backups/my_recovered_website -name "*.html" -exec grep -l "fetch\|ajax\|XMLHttpRequest" {} \;
```

#### JavaScript Files  
```bash
# Buscar llamadas de API en archivos JS
find data/backups/my_recovered_website -name "*.js" -exec grep -l "api/" {} \;
```

**Patrones a buscar:**
- `fetch('/api/...')`
- `fetch('http://localhost:8080/api/...')`
- `$.get('/api/...')`
- `$.ajax({ url: '/api/...' })`
- `XMLHttpRequest` con URLs de API

### Fase 4: Mapeo de URLs

**Estado:** 📋 **PLANIFICADO**

#### Mapeo de Endpoints

| URL Original | Nueva URL Backend | Método | Sección |
|-------------|-------------------|--------|---------|
| `/api/health` | `http://localhost:3000/health` | GET | Core |
| `/api/pilgrim/*` | `http://localhost:3000/api/pilgrim/*` | GET | Pilgrim |
| `/api/merchant/*` | `http://localhost:3000/api/merchant/*` | GET | Merchant |
| `/api/red-pill/*` | `http://localhost:3000/api/red-pill/*` | GET | Red Pill |
| `/api/data/*` | `http://localhost:3000/api/data/*` | GET | Data |
| `/api/submit-form` | `http://localhost:3000/api/submit-form` | POST | Forms |

#### Configuración de Base URLs

**Opción 1: Variable Global**
```javascript
// En cada sección, definir:
const API_BASE_URL = 'http://localhost:3000';

// Usar en fetch:
fetch(`${API_BASE_URL}/api/pilgrim/profile`)
```

**Opción 2: Función Helper**
```javascript
function getApiUrl(endpoint) {
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

// Usar:
fetch(getApiUrl('/api/pilgrim/profile'))
```

### Fase 5: Migración de JavaScript

**Estado:** 📋 **PLANIFICADO**

#### Estrategia de Migración

**5.1 Crear Archivos de Configuración**

```javascript
// config/api-config.js
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    HEALTH: '/health',
    PILGRIM: {
      DATA: '/api/pilgrim-data',
      PROFILE: '/api/pilgrim/profile',
      JOURNEY: '/api/pilgrim/journey',
      QUESTS: '/api/pilgrim/quests'
    },
    MERCHANT: {
      DATA: '/api/merchant-data',
      PROFILE: '/api/merchant/profile',
      PRODUCTS: '/api/merchant/products',
      MATCHES: '/api/merchant/matches'
    },
    RED_PILL: {
      DATA: '/api/red-pill-data',
      QUESTIONS: '/api/red-pill/questions',
      RESULTS: '/api/red-pill/results'
    },
    USER: {
      PROFILE: '/api/user-profile',
      PREFERENCES: '/api/user/preferences'
    },
    DATA: {
      RECOMMENDATIONS: '/api/data/recommendations'
    },
    FORMS: {
      SUBMIT: '/api/submit-form'
    }
  }
};
```

**5.2 Crear Utility Functions**

```javascript
// utils/api-utils.js
function buildApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

async function apiRequest(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Funciones específicas por sección
const PilgrimAPI = {
  getProfile: () => apiRequest(API_CONFIG.ENDPOINTS.PILGRIM.PROFILE),
  getJourney: () => apiRequest(API_CONFIG.ENDPOINTS.PILGRIM.JOURNEY),
  getQuests: () => apiRequest(API_CONFIG.ENDPOINTS.PILGRIM.QUESTS)
};

const MerchantAPI = {
  getProfile: () => apiRequest(API_CONFIG.ENDPOINTS.MERCHANT.PROFILE),
  getProducts: () => apiRequest(API_CONFIG.ENDPOINTS.MERCHANT.PRODUCTS),
  getMatches: () => apiRequest(API_CONFIG.ENDPOINTS.MERCHANT.MATCHES)
};

const RedPillAPI = {
  getQuestions: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${API_CONFIG.ENDPOINTS.RED_PILL.QUESTIONS}${queryString ? '?' + queryString : ''}`;
    return apiRequest(endpoint);
  },
  getResults: (sessionId) => {
    const endpoint = `${API_CONFIG.ENDPOINTS.RED_PILL.RESULTS}?sessionId=${sessionId}`;
    return apiRequest(endpoint);
  }
};
```

**5.3 Migrar Llamadas Existentes**

**Antes:**
```javascript
// Código existente
fetch('/api/pilgrim/profile')
  .then(response => response.json())
  .then(data => {
    // Manejar datos
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

**Después:**
```javascript
// Código migrado
PilgrimAPI.getProfile()
  .then(data => {
    // Manejar datos (misma estructura)
  })
  .catch(error => {
    console.error('Error:', error);
    // Manejo de errores mejorado
  });
```

### Fase 6: Migración de Formularios

**Estado:** 📋 **PLANIFICADO**

#### Identificar Formularios Existentes

**Tipos de formularios esperados:**
- Formularios de contacto
- Formularios de registro
- Formularios de feedback
- Respuestas de quiz/challenges

#### Migrar Envío de Formularios

**Antes:**
```javascript
// Código existente (simulado)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  
  // Simulación local o llamada a API mockeada
  console.log('Form submitted:', Object.fromEntries(formData));
});
```

**Después:**
```javascript
// Código migrado
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.FORMS.SUBMIT, {
      method: 'POST',
      body: JSON.stringify({
        formType: 'contact', // o el tipo apropiado
        data: data,
        timestamp: new Date().toISOString()
      })
    });
    
    console.log('Form submitted successfully:', response);
    // Mostrar mensaje de éxito
  } catch (error) {
    console.error('Form submission error:', error);
    // Mostrar mensaje de error
  }
});
```

### Fase 7: Testing y Validación

**Estado:** 📋 **PLANIFICADO**

#### 7.1 Testing del Backend

**Tests de Endpoints:**
```bash
# Health check
curl http://localhost:3000/health

# Pilgrim APIs
curl http://localhost:3000/api/pilgrim/profile
curl http://localhost:3000/api/pilgrim/journey
curl http://localhost:3000/api/pilgrim/quests

# Merchant APIs  
curl http://localhost:3000/api/merchant/profile
curl http://localhost:3000/api/merchant/products
curl http://localhost:3000/api/merchant/matches

# Red Pill APIs
curl http://localhost:3000/api/red-pill/questions
curl "http://localhost:3000/api/red-pill/questions?category=critical-thinking"
curl "http://localhost:3000/api/red-pill/results?sessionId=test123"

# Form submission
curl -X POST http://localhost:3000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{"formType":"test","data":{"field":"value"}}'
```

#### 7.2 Testing del Frontend Migrado

**Checklist de Funcionalidades:**
- [ ] Cargar perfil de Pilgrim
- [ ] Mostrar progreso de journey
- [ ] Listar quests disponibles
- [ ] Cargar perfil de Merchant
- [ ] Mostrar productos
- [ ] Listar matches/conexiones
- [ ] Cargar preguntas de Red Pill
- [ ] Filtrar preguntas por categoría/dificultad
- [ ] Enviar respuestas de quiz
- [ ] Enviar formularios de contacto
- [ ] Manejo de errores de red

#### 7.3 Testing de Integración

**Escenarios de Testing:**
1. **Ambos servidores corriendo:** Frontend + Backend
2. **Solo frontend:** Manejo de errores cuando backend está down
3. **CORS:** Verificar que las requests cross-origin funcionan
4. **Performance:** Comparar tiempos de respuesta vs APIs mockeadas

### Fase 8: Optimización y Limpieza

**Estado:** 📋 **PLANIFICADO**

#### 8.1 Limpiar Servidor Frontend

**Modificar `coomunity-local-server.js`:**
```javascript
// Remover todas las rutas API mockeadas
// Mantener solo servencia de archivos estáticos
// Simplificar configuración

// Antes: APIs mockeadas + archivos estáticos
// Después: Solo archivos estáticos
```

#### 8.2 Optimizar Backend

**Mejoras a implementar:**
- [ ] Validación de parámetros de entrada
- [ ] Rate limiting básico
- [ ] Logging estructurado
- [ ] Manejo de errores mejorado
- [ ] Compresión de respuestas
- [ ] Headers de cache apropiados

#### 8.3 Documentación Final

**Actualizar documentación:**
- [ ] README principal del proyecto
- [ ] Instrucciones de desarrollo
- [ ] Guía de deployment
- [ ] Troubleshooting común

## 🛠️ Instrucciones de Ejecución

### Setup Inicial

```bash
# 1. Instalar dependencias del backend
cd backend/
npm install

# 2. Configurar variables de entorno (opcional)
cp env.example .env

# 3. Iniciar backend
npm run dev  # o npm start

# 4. En otra terminal, iniciar frontend
cd ../
node scripts/setup/coomunity-local-server.js
```

### Verificación

```bash
# 1. Verificar backend está corriendo
curl http://localhost:3000/health

# 2. Verificar frontend está corriendo  
curl http://localhost:8080

# 3. Verificar CORS está funcionando
# (Abrir frontend en navegador y verificar console de desarrollador)
```

## 🚦 Estados de Migración por Sección

### Pilgrim Section

| Funcionalidad | Estado | Endpoint | Frontend Migrado |
|---------------|--------|----------|-------------------|
| Datos principales | ✅ | `/api/pilgrim-data` | ⏳ |
| Perfil de usuario | ✅ | `/api/pilgrim/profile` | ⏳ |
| Progreso del viaje | ✅ | `/api/pilgrim/journey` | ⏳ |
| Lista de quests | ✅ | `/api/pilgrim/quests` | ⏳ |

### Merchant Section

| Funcionalidad | Estado | Endpoint | Frontend Migrado |
|---------------|--------|----------|-------------------|
| Datos principales | ✅ | `/api/merchant-data` | ⏳ |
| Perfil del merchant | ✅ | `/api/merchant/profile` | ⏳ |
| Lista de productos | ✅ | `/api/merchant/products` | ⏳ |
| Matches/conexiones | ✅ | `/api/merchant/matches` | ⏳ |

### Red Pill Section

| Funcionalidad | Estado | Endpoint | Frontend Migrado |
|---------------|--------|----------|-------------------|
| Datos principales | ✅ | `/api/red-pill-data` | ⏳ |
| Preguntas de quiz | ✅ | `/api/red-pill/questions` | ⏳ |
| Resultados | ✅ | `/api/red-pill/results` | ⏳ |

### General Features

| Funcionalidad | Estado | Endpoint | Frontend Migrado |
|---------------|--------|----------|-------------------|
| Health check | ✅ | `/health` | ⏳ |
| Perfiles de usuario | ✅ | `/api/user-profile/:id` | ⏳ |
| Envío de formularios | ✅ | `/api/submit-form` | ⏳ |
| Datos compartidos | ✅ | `/api/shared-data/:file` | ⏳ |

## ⚠️ Consideraciones y Riesgos

### Riesgos Técnicos

1. **CORS Issues:** Solución implementada con configuración explícita
2. **Breaking Changes:** Todas las APIs mantienen compatibilidad con datos existentes
3. **Performance:** Puede haber latencia adicional por separación de servidores
4. **Error Handling:** Nuevos puntos de falla de red entre frontend y backend

### Mitigaciones

1. **Testing Exhaustivo:** Antes de migrar cada sección
2. **Rollback Plan:** Mantener servidor original funcional durante migración
3. **Monitoring:** Logs detallados en ambos servidores
4. **Documentation:** Documentación completa para troubleshooting

## 📈 Métricas de Éxito

### KPIs de Migración

1. **✅ Funcionalidad:** Todas las funciones existentes deben seguir funcionando
2. **⚡ Performance:** Tiempo de respuesta < 500ms para APIs locales
3. **🔒 Estabilidad:** Cero downtime durante migración
4. **📊 Mantenibilidad:** Código más limpio y separado por responsabilidades

### Criterios de Aceptación

- [ ] Todos los endpoints responden correctamente
- [ ] Frontend carga sin errores en consola
- [ ] Formularios se envían exitosamente
- [ ] Datos se muestran correctamente en todas las secciones
- [ ] Manejo de errores funciona apropiadamente
- [ ] Documentación está actualizada

## 🔮 Próximos Pasos Post-Migración

1. **Base de Datos Real:** Migrar de datos mock a DB (PostgreSQL/MongoDB)
2. **Autenticación:** Implementar sistema de login/registro
3. **Optimización:** Caching, CDN, optimización de queries
4. **Deployment:** CI/CD pipeline para production
5. **Monitoring:** APM y alertas para production
6. **Scaling:** Preparar para múltiples instancias y load balancing

---

## 📞 Contacto y Soporte

Para dudas sobre la migración:
- Revisar documentación en `backend/README.md`
- Verificar logs de ambos servidores
- Consultar este plan de migración

**Estado del Plan:** 🔄 En ejecución - Fase 3 (Identificación de llamadas frontend) 