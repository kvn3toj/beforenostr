# 🤖 Enhanced Recommendation System - CoomÜnity

Sistema de recomendaciones avanzado con capacidades de Machine Learning, personalización adaptativa y analytics en tiempo real.

## 🎯 Características Principales

### 🧠 ML-Ready Architecture
- **Vector de características de 12 dimensiones** preparado para entrenamiento de modelos ML
- **Recolección automática de datos** para training de algoritmos de recomendación
- **Sistema de scoring multifactorial** con 7 factores ponderados
- **Preparación para backend de ML** con estructura de API definida

### 🎯 Personalización Adaptativa
- **5 niveles de personalización** que evolucionan con el engagement del usuario
- **Migración automática** de datos del AdaptiveContextualManager existente
- **Perfiles de usuario enriquecidos** con Maps para preferencias y métricas de comportamiento
- **Contextualización temporal** y por dispositivo

### 🧪 A/B Testing Integrado
- **4 variantes automáticas** basadas en hash del userId
- **Tracking de conversiones** por experimento
- **Métricas de calidad** de recomendaciones (precisión, diversidad, novedad, serendipity)

### 📊 Analytics Avanzados
- **Tracking granular** de impresiones, clicks, hover time, scroll patterns
- **Métricas de sesión** y patrones de comportamiento
- **Export de datos ML** en formato JSON para análisis
- **Sistema de cache** con expiración inteligente

## 📁 Estructura de Archivos

```
shared/
├── js/
│   ├── enhanced-recommendation-manager.js          # Core del sistema
│   ├── enhanced-recommendation-manager-helpers.js  # Métodos auxiliares
│   ├── enhanced-recommendation-manager-optimizations.js # A/B testing y optimizaciones
│   └── enhanced-recommendation-demo.js             # Sistema de demostración
├── css/
│   └── enhanced-recommendations.css                # Estilos responsive y modernos
└── data/
    └── mock-recommendations.json                   # Datos mock con 20 recomendaciones

recommendation-demo.html                            # Página de demostración completa
```

## 🚀 Instalación y Uso Básico

### 1. Integración Simple

```html
<!-- CSS -->
<link rel="stylesheet" href="./shared/css/enhanced-recommendations.css">

<!-- JavaScript -->
<script src="./shared/js/enhanced-recommendation-manager.js"></script>
<script src="./shared/js/enhanced-recommendation-manager-helpers.js"></script>
<script src="./shared/js/enhanced-recommendation-manager-optimizations.js"></script>

<!-- Contenedor para recomendaciones -->
<div id="recommendations-container"></div>

<script>
// El sistema se auto-inicializa
// Mostrar recomendaciones
window.enhancedRecommendationManager.displayRecommendations('recommendations-container');
</script>
```

### 2. Configuración Avanzada

```javascript
// Acceder al manager
const manager = window.enhancedRecommendationManager;

// Configurar tracking personalizado
manager.trackUserInteraction(element, 'custom_action');

// Obtener recomendaciones con opciones
const recommendations = await manager.getRecommendations({
  algorithm: 'hybrid',
  count: 10,
  filters: ['diversity', 'quality'],
  context: {
    category: 'specific_category',
    difficulty: 'intermediate'
  }
});

// Proporcionar feedback
manager.provideFeedback('recommendation_id', 'like');

// Obtener insights del usuario
const insights = manager.getUserInsights();
console.log('Engagement Level:', insights.engagementLevel);
console.log('Top Categories:', insights.topCategories);
```

## 🎛️ Configuración del Sistema

### Pesos de Scoring

```javascript
manager.scoringWeights = {
  clickFrequency: 0.25,    // 25% - Frecuencia de clics
  timeSpent: 0.20,         // 20% - Tiempo gastado
  recency: 0.15,           // 15% - Recencia de interacción
  completion: 0.15,        // 15% - Tasa de finalización
  contextual: 0.10,        // 10% - Relevancia contextual
  seasonal: 0.08,          // 8%  - Factores estacionales
  social: 0.07             // 7%  - Señales sociales (futuro)
};
```

### Configuración de Cache

```javascript
manager.cacheExpiry = 300000; // 5 minutos
manager.recommendationCache = new Map();
```

### Configuración de API

```javascript
manager.apiConfig = {
  baseUrl: '/api/recommendations',
  mockMode: true,           // Cambiar a false para usar API real
  retries: 3,
  timeout: 5000
};
```

## 🔬 Algoritmos de Recomendación

### 1. Content-Based (60%)
Analiza las características del contenido y las preferencias históricas del usuario.

```javascript
// Ejemplo de recomendación content-based
const contentBased = await manager.generateContentBasedRecommendations(context, 10);
```

### 2. Collaborative Filtering (40%)
Encuentra patrones entre usuarios similares (preparado para implementación futura).

```javascript
// Ejemplo de filtrado colaborativo
const collaborative = await manager.generateCollaborativeRecommendations(context, 10);
```

### 3. Hybrid Approach
Combina múltiples algoritmos para optimizar precisión y diversidad.

```javascript
// Algoritmo híbrido (por defecto)
const hybrid = await manager.generateHybridRecommendations(context, 10);
```

### 4. Contextual
Considera el contexto temporal, dispositivo y patrones de uso.

```javascript
// Recomendaciones contextuales
const contextual = await manager.generateContextualRecommendations(context, 10);
```

## 📊 Métricas de Machine Learning

### Métricas de Calidad

```javascript
const qualityMetrics = {
  precision: 0,       // Recomendaciones clickeadas / total mostradas
  recall: 0,          // Cobertura de elementos relevantes
  f1Score: 0,         // Media armónica de precisión y recall
  diversity: 0,       // Variedad de categorías en recomendaciones
  novelty: 0,         // Contenido nuevo para el usuario
  coverage: 0,        // Cobertura del catálogo
  serendipity: 0,     // Sorpresas positivas inesperadas
  temporalAccuracy: 0 // Relevancia temporal
};
```

### Vector de Características

El sistema extrae automáticamente un vector de 12 características para ML:

```javascript
const featureVector = manager.extractFeatureVector();
// [engagement, clicks, time, sessionDepth, devices, timeActivity, 
//  sessionLength, categories, contentTypes, daysSinceFirst, visitFreq, activeHours]
```

### Export de Datos ML

```javascript
const mlData = manager.exportMLData();
// Incluye: user profile, interactions, sessions, conversions, metadata
```

## 🧪 A/B Testing

### Configuración Automática

El sistema asigna automáticamente una variante basada en el hash del userId:

```javascript
const variants = ['control', 'variant_a', 'variant_b', 'variant_c'];
const userVariant = manager.abTestConfig.currentVariant;
```

### Experimentos Activos

```javascript
const experiments = {
  'recommendation_algorithm': {
    control: 'hybrid',
    variant_a: 'content_based_enhanced',
    variant_b: 'collaborative_advanced',
    variant_c: 'ml_optimized'
  },
  'ui_layout': {
    control: 'grid_3_columns',
    variant_a: 'grid_4_columns', 
    variant_b: 'masonry_layout',
    variant_c: 'list_view'
  }
};
```

### Tracking de Conversiones

```javascript
manager.trackABTestConversion('recommendation_algorithm', 'click');
manager.trackABTestConversion('ui_layout', 'engagement');
```

## 🎪 Demo Interactiva

### Ejecutar Demo

1. **Navegador**: Abrir `recommendation-demo.html`
2. **Con parámetros**: `recommendation-demo.html?autostart=true`
3. **Programáticamente**:

```javascript
// Crear demo completa
createRecommendationDemoPage();

// O inicializar componente demo
const demo = new RecommendationDemo();
```

### Funciones de Demo

```javascript
// Simular diferentes tipos de usuarios
RecommendationDemoUtils.simulateUser('new_user');
RecommendationDemoUtils.simulateUser('returning_user');
RecommendationDemoUtils.simulateUser('power_user');

// Exportar datos de la demo
const demoData = RecommendationDemoUtils.exportDemoData();

// Resetear demo completamente
RecommendationDemoUtils.resetDemo();
```

## 🔌 Casos de Uso por Industria

### E-commerce

```javascript
// Setup para e-commerce
integrationExamples.ecommerce.setup();

// Tracking de productos
manager.trackProductView('prod_123', 'electronics', 299.99);
manager.trackPurchase('prod_123', 'electronics', 299.99);

// Recomendaciones de productos
const productRecs = await manager.getRecommendations({
  category: 'electronics',
  priceRange: [200, 500]
});
```

### Blog/Contenido

```javascript
// Setup para blog
integrationExamples.blog.setup();

// Tracking de lectura
manager.trackArticleRead('article_456', 'technology', 0.85);

// Recomendaciones de artículos
const articleRecs = await manager.getRecommendations({
  contentType: 'article',
  readingTime: [5, 15]
});
```

### Plataforma Educativa

```javascript
// Setup para educación
integrationExamples.education.setup();

// Tracking de progreso
manager.trackCourseProgress('course_789', 'javascript', 0.75);

// Recomendaciones basadas en nivel
const courseRecs = await manager.getRecommendations({
  category: 'programming',
  difficulty: 'intermediate'
});
```

## 📈 Analytics y Monitoreo

### Métricas en Tiempo Real

```javascript
// Engagement score del usuario
const engagement = manager.calculateUserEngagement();

// Métricas de sesión
const sessionMetrics = {
  duration: Date.now() - manager.sessionStartTime,
  interactions: manager.getSessionInteractionCount(),
  pages: manager.getSessionPages(),
  conversions: manager.getSessionConversions()
};

// Calidad de recomendaciones
const quality = manager.calculateRecommendationQuality(recommendations, interactions);
```

### Dashboard de Analytics

```javascript
// CTR de recomendaciones
const ctr = manager.calculateRecommendationCTR();

// Retención de usuarios
const retention = manager.calculateUserRetention();

// Diversidad de contenido explorado
const diversity = manager.calculateContentDiversity();
```

## 🔮 Roadmap y Futuras Características

### Próximas Versiones

1. **Deep Learning Models**
   - Implementación de redes neuronales para patrones complejos
   - Autoencoders para representación de usuarios y contenido
   - RNNs para modelado de secuencias temporales

2. **Real-time Learning**
   - Actualización en tiempo real de modelos
   - Online learning algorithms
   - Adaptación inmediata a cambios de comportamiento

3. **Social Signals**
   - Integración de datos sociales y compartidos
   - Recomendaciones basadas en red social
   - Influencia de peers y comunidades

4. **Cross-platform Tracking**
   - Seguimiento entre dispositivos
   - Sincronización de perfiles
   - Experiencia unificada

5. **Explainable AI**
   - Explicaciones detalladas de recomendaciones
   - Transparencia en algoritmos
   - Control granular por parte del usuario

### Integración con Backend ML

```javascript
// Preparación para backend real
const apiIntegration = {
  // Endpoint para entrenar modelos
  trainModel: async (userData) => {
    return await fetch('/api/ml/train', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  // Obtener predicciones del modelo
  getPredictions: async (featureVector) => {
    return await fetch('/api/ml/predict', {
      method: 'POST',
      body: JSON.stringify({ features: featureVector })
    });
  },
  
  // Feedback para mejorar modelo
  provideFeedback: async (predictionId, feedback) => {
    return await fetch('/api/ml/feedback', {
      method: 'POST',
      body: JSON.stringify({ predictionId, feedback })
    });
  }
};
```

## 🛠️ Mantenimiento y Optimización

### Limpieza de Datos

```javascript
// Limpiar datos antiguos (automático cada 5 minutos)
manager.cleanOldInteractions();
manager.optimizeDataStructures();

// Limpiar cache expirado
manager.cleanExpiredCache();
```

### Optimización de Rendimiento

```javascript
// Lazy loading activado por defecto
manager.setupLazyLoading();

// Debounced saving
manager.debouncedSave = manager.debounce(manager.saveProfile.bind(manager), 1000);

// Memory management
manager.setupMemoryManagement();
```

### Configuración de Producción

```javascript
// Configurar para producción
manager.apiConfig.mockMode = false;
manager.apiConfig.baseUrl = 'https://api.coomunity.com';

// Configurar analytics endpoint
manager.analyticsConfig.endpoint = '/api/analytics/recommendations';

// Habilitar service worker para cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}
```

## 📚 Referencias y Recursos

- [Demo Interactiva](./recommendation-demo.html)
- [Código Fuente Core](./shared/js/enhanced-recommendation-manager.js)
- [Datos Mock](./shared/data/mock-recommendations.json)
- [Estilos CSS](./shared/css/enhanced-recommendations.css)

## 🤝 Contribución

Para contribuir al sistema:

1. Mantener compatibilidad con `AdaptiveContextualManager`
2. Seguir patrones de código existentes
3. Añadir tests para nuevas funcionalidades
4. Documentar cambios en el API
5. Considerar impacto en rendimiento y ML training

## 📄 Licencia

Sistema desarrollado para CoomÜnity. Todos los derechos reservados.

---

**Versión:** 1.0.0  
**Última actualización:** Junio 2024  
**Compatibilidad:** ES6+, Navegadores modernos  
**Dependencias:** Ninguna (sistema standalone) 