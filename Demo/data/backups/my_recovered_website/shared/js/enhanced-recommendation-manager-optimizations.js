/**
 * ========================================================================
 * 🔧 ENHANCED RECOMMENDATION MANAGER - OPTIMIZATIONS & EXTENSIONS
 * ========================================================================
 * 
 * Optimizaciones y extensiones avanzadas para el motor de recomendaciones
 * 
 * Nuevas funcionalidades:
 * - A/B Testing integrado
 * - Métricas de calidad de recomendaciones
 * - Algoritmos de diversidad y novedad
 * - Sistema de retroalimentación implícita
 * - Optimización de rendimiento
 * - Analytics avanzados
 * 
 * ========================================================================
 */

// Extender EnhancedRecommendationManager con optimizaciones
if (typeof EnhancedRecommendationManager !== 'undefined') {

  /**
   * =====================================
   * 🧪 A/B TESTING SYSTEM
   * =====================================
   */

  EnhancedRecommendationManager.prototype.setupABTesting = function() {
    this.abTestConfig = {
      enabled: true,
      currentVariant: this.determineABVariant(),
      experiments: new Map(),
      conversionTracking: new Map()
    };

    // Configurar experimentos activos
    this.setupActiveExperiments();
    
    console.log('🧪 A/B Testing system initialized:', this.abTestConfig.currentVariant);
  };

  EnhancedRecommendationManager.prototype.determineABVariant = function() {
    const userId = this.userProfile.userId;
    const hash = this.hashString(userId);
    const variants = ['control', 'variant_a', 'variant_b', 'variant_c'];
    return variants[hash % variants.length];
  };

  EnhancedRecommendationManager.prototype.setupActiveExperiments = function() {
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
      },
      'scoring_weights': {
        control: 'balanced',
        variant_a: 'engagement_focused',
        variant_b: 'completion_focused',
        variant_c: 'recency_focused'
      }
    };

    Object.keys(experiments).forEach(experimentName => {
      this.abTestConfig.experiments.set(experimentName, {
        variant: experiments[experimentName][this.abTestConfig.currentVariant],
        startTime: Date.now(),
        interactions: 0,
        conversions: 0
      });
    });
  };

  EnhancedRecommendationManager.prototype.trackABTestConversion = function(experimentName, conversionType) {
    if (this.abTestConfig.experiments.has(experimentName)) {
      const experiment = this.abTestConfig.experiments.get(experimentName);
      experiment.conversions++;
      
      this.trackMLInteraction('ab_test_conversion', {
        experiment: experimentName,
        variant: this.abTestConfig.currentVariant,
        conversionType: conversionType,
        timestamp: Date.now()
      });
    }
  };

  /**
   * =====================================
   * 📊 QUALITY METRICS SYSTEM
   * =====================================
   */

  EnhancedRecommendationManager.prototype.setupQualityMetrics = function() {
    this.qualityMetrics = {
      precision: 0,
      recall: 0,
      f1Score: 0,
      diversity: 0,
      novelty: 0,
      coverage: 0,
      serendipity: 0,
      temporalAccuracy: 0
    };

    this.startQualityMonitoring();
  };

  EnhancedRecommendationManager.prototype.calculateRecommendationQuality = function(recommendations, userInteractions) {
    const metrics = {};

    // Calcular precisión (recommendations clicked / total recommendations shown)
    const clickedRecommendations = userInteractions.filter(i => i.type === 'recommendation_click').length;
    metrics.precision = recommendations.length > 0 ? clickedRecommendations / recommendations.length : 0;

    // Calcular diversidad (variedad de categorías en las recomendaciones)
    const categories = new Set(recommendations.map(r => r.category));
    metrics.diversity = categories.size / Math.max(recommendations.length, 1);

    // Calcular novedad (cuántos elementos son nuevos para el usuario)
    const seenBefore = recommendations.filter(r => this.hasUserSeenContent(r.id)).length;
    metrics.novelty = recommendations.length > 0 ? (recommendations.length - seenBefore) / recommendations.length : 0;

    // Calcular serendipity (sorpresa positiva)
    metrics.serendipity = this.calculateSerendipity(recommendations, userInteractions);

    return metrics;
  };

  EnhancedRecommendationManager.prototype.calculateSerendipity = function(recommendations, interactions) {
    // Serendipity = unexpected but positive interactions
    const unexpectedInteractions = interactions.filter(i => {
      const recommendation = recommendations.find(r => r.id === i.recommendationId);
      return recommendation && this.isUnexpectedForUser(recommendation) && i.positive;
    });

    return interactions.length > 0 ? unexpectedInteractions.length / interactions.length : 0;
  };

  EnhancedRecommendationManager.prototype.isUnexpectedForUser = function(recommendation) {
    const userCategories = Array.from(this.userProfile.preferences.categories.keys());
    const topCategories = userCategories.slice(0, 3); // Top 3 preferencias
    return !topCategories.includes(recommendation.category);
  };

  /**
   * =====================================
   * 🎲 DIVERSITY & NOVELTY ALGORITHMS
   * =====================================
   */

  EnhancedRecommendationManager.prototype.applyDiversityFilter = function(recommendations, diversityThreshold = 0.3) {
    if (recommendations.length <= 1) return recommendations;

    const diversified = [];
    const categoryCount = new Map();
    const maxPerCategory = Math.ceil(recommendations.length * diversityThreshold);

    // Ordenar por score y aplicar filtro de diversidad
    const sortedRecommendations = recommendations.sort((a, b) => (b.score || 0) - (a.score || 0));

    for (const recommendation of sortedRecommendations) {
      const category = recommendation.category;
      const currentCount = categoryCount.get(category) || 0;

      if (currentCount < maxPerCategory) {
        diversified.push(recommendation);
        categoryCount.set(category, currentCount + 1);
      }

      if (diversified.length >= recommendations.length) break;
    }

    return diversified;
  };

  EnhancedRecommendationManager.prototype.applyNoveltyBoost = function(recommendations) {
    const currentTime = Date.now();
    const noveltyWindow = 7 * 24 * 60 * 60 * 1000; // 7 días

    return recommendations.map(recommendation => {
      const lastSeen = this.getLastSeenTime(recommendation.id);
      const timeSinceLastSeen = currentTime - (lastSeen || 0);
      
      let noveltyBoost = 0;
      if (!lastSeen || timeSinceLastSeen > noveltyWindow) {
        noveltyBoost = 0.2; // 20% boost para contenido no visto recientemente
      }

      return {
        ...recommendation,
        score: (recommendation.score || 0) + noveltyBoost,
        noveltyBoost: noveltyBoost
      };
    });
  };

  EnhancedRecommendationManager.prototype.getLastSeenTime = function(contentId) {
    const interactions = this.mlMetrics.interactions.filter(i => 
      i.data.recommendationId === contentId && i.type === 'impression'
    );
    
    if (interactions.length === 0) return null;
    return Math.max(...interactions.map(i => i.timestamp));
  };

  /**
   * =====================================
   * 🔍 IMPLICIT FEEDBACK SYSTEM
   * =====================================
   */

  EnhancedRecommendationManager.prototype.setupImplicitFeedback = function() {
    this.implicitFeedbackConfig = {
      timeThresholds: {
        quick_view: 3000,      // 3 segundos
        engaged_view: 10000,   // 10 segundos
        deep_engagement: 30000 // 30 segundos
      },
      scrollThresholds: {
        shallow: 0.2,   // 20% de scroll
        moderate: 0.5,  // 50% de scroll
        deep: 0.8       // 80% de scroll
      }
    };

    this.setupImplicitTracking();
  };

  EnhancedRecommendationManager.prototype.setupImplicitTracking = function() {
    // Tracking de hover time en recomendaciones
    let hoverStartTime = null;
    
    document.addEventListener('mouseover', (event) => {
      const recommendationCard = event.target.closest('.recommendation-card');
      if (recommendationCard) {
        hoverStartTime = Date.now();
      }
    });

    document.addEventListener('mouseout', (event) => {
      const recommendationCard = event.target.closest('.recommendation-card');
      if (recommendationCard && hoverStartTime) {
        const hoverDuration = Date.now() - hoverStartTime;
        const recommendationId = recommendationCard.dataset.recommendationId;
        
        this.processImplicitFeedback('hover', {
          recommendationId: recommendationId,
          duration: hoverDuration,
          timestamp: Date.now()
        });
      }
    });

    // Tracking de click patterns
    document.addEventListener('click', (event) => {
      const recommendationCard = event.target.closest('.recommendation-card');
      if (recommendationCard) {
        const recommendationId = recommendationCard.dataset.recommendationId;
        this.processImplicitFeedback('click', {
          recommendationId: recommendationId,
          clickTarget: event.target.tagName,
          timestamp: Date.now()
        });
      }
    });
  };

  EnhancedRecommendationManager.prototype.processImplicitFeedback = function(type, data) {
    let feedbackScore = 0;

    switch (type) {
      case 'hover':
        if (data.duration > this.implicitFeedbackConfig.timeThresholds.engaged_view) {
          feedbackScore = 0.3;
        } else if (data.duration > this.implicitFeedbackConfig.timeThresholds.quick_view) {
          feedbackScore = 0.1;
        }
        break;
      
      case 'click':
        feedbackScore = 0.5;
        break;
      
      case 'scroll':
        if (data.percentage > this.implicitFeedbackConfig.scrollThresholds.deep) {
          feedbackScore = 0.4;
        } else if (data.percentage > this.implicitFeedbackConfig.scrollThresholds.moderate) {
          feedbackScore = 0.2;
        }
        break;
    }

    if (feedbackScore > 0 && data.recommendationId) {
      this.updateRecommendationFeedback(data.recommendationId, feedbackScore);
    }
  };

  EnhancedRecommendationManager.prototype.updateRecommendationFeedback = function(recommendationId, score) {
    // Actualizar el perfil del usuario basado en feedback implícito
    const recommendation = this.findRecommendationById(recommendationId);
    if (!recommendation) return;

    const category = recommendation.category;
    const currentPreference = this.userProfile.preferences.categories.get(category) || 0;
    this.userProfile.preferences.categories.set(category, currentPreference + score);

    // Guardar para análisis ML
    this.trackMLInteraction('implicit_feedback', {
      recommendationId: recommendationId,
      category: category,
      score: score,
      timestamp: Date.now()
    });
  };

  /**
   * =====================================
   * ⚡ PERFORMANCE OPTIMIZATIONS
   * =====================================
   */

  EnhancedRecommendationManager.prototype.setupPerformanceOptimizations = function() {
    // Lazy loading de recomendaciones
    this.setupLazyLoading();
    
    // Debounced saving
    this.debouncedSave = this.debounce(this.saveProfile.bind(this), 1000);
    
    // Memory management
    this.setupMemoryManagement();
    
    // Cache optimization
    this.optimizeCache();
  };

  EnhancedRecommendationManager.prototype.setupLazyLoading = function() {
    this.lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const recommendationCard = entry.target;
          this.loadRecommendationContent(recommendationCard);
          this.lazyLoadObserver.unobserve(recommendationCard);
        }
      });
    }, {
      rootMargin: '50px'
    });
  };

  EnhancedRecommendationManager.prototype.loadRecommendationContent = function(card) {
    // Lazy load de imágenes y contenido pesado
    const img = card.querySelector('img[data-src]');
    if (img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }

    // Aplicar animaciones de entrada
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  };

  EnhancedRecommendationManager.prototype.setupMemoryManagement = function() {
    // Limpiar datos antiguos periódicamente
    setInterval(() => {
      this.cleanOldInteractions();
      this.optimizeDataStructures();
    }, 300000); // Cada 5 minutos
  };

  EnhancedRecommendationManager.prototype.cleanOldInteractions = function() {
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 días
    const cutoffTime = Date.now() - maxAge;

    this.mlMetrics.interactions = this.mlMetrics.interactions.filter(
      interaction => interaction.timestamp > cutoffTime
    );

    this.mlMetrics.sessionData = this.mlMetrics.sessionData.filter(
      session => session.timestamp > cutoffTime
    );
  };

  EnhancedRecommendationManager.prototype.optimizeDataStructures = function() {
    // Convertir maps grandes a estructuras más eficientes si es necesario
    if (this.userProfile.behaviorMetrics.clickFrequency.size > 1000) {
      this.compressClickFrequencyData();
    }
  };

  /**
   * =====================================
   * 📈 ADVANCED ANALYTICS
   * =====================================
   */

  EnhancedRecommendationManager.prototype.setupAdvancedAnalytics = function() {
    this.analyticsConfig = {
      batchSize: 50,
      sendInterval: 60000, // 1 minuto
      retryAttempts: 3,
      endpoint: '/api/analytics/recommendations'
    };

    this.analyticsBatch = [];
    this.setupAnalyticsBatching();
  };

  EnhancedRecommendationManager.prototype.trackAnalyticsEvent = function(event, data) {
    const analyticsEvent = {
      id: this.generateEventId(),
      userId: this.userProfile.userId,
      sessionId: this.getCurrentSessionId(),
      event: event,
      data: data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    this.analyticsBatch.push(analyticsEvent);

    if (this.analyticsBatch.length >= this.analyticsConfig.batchSize) {
      this.sendAnalyticsBatch();
    }
  };

  EnhancedRecommendationManager.prototype.setupAnalyticsBatching = function() {
    setInterval(() => {
      if (this.analyticsBatch.length > 0) {
        this.sendAnalyticsBatch();
      }
    }, this.analyticsConfig.sendInterval);

    // Enviar batch antes de cerrar la página
    window.addEventListener('beforeunload', () => {
      if (this.analyticsBatch.length > 0) {
        navigator.sendBeacon(
          this.analyticsConfig.endpoint,
          JSON.stringify(this.analyticsBatch)
        );
      }
    });
  };

  EnhancedRecommendationManager.prototype.sendAnalyticsBatch = function() {
    if (this.analyticsConfig.endpoint && this.analyticsBatch.length > 0) {
      // En modo mock, solo log los eventos
      console.log('📊 Analytics batch:', this.analyticsBatch);
      this.analyticsBatch = [];
    }
  };

  /**
   * =====================================
   * 🔧 UTILITY METHODS
   * =====================================
   */

  EnhancedRecommendationManager.prototype.hashString = function(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  EnhancedRecommendationManager.prototype.generateEventId = function() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  EnhancedRecommendationManager.prototype.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  EnhancedRecommendationManager.prototype.hasUserSeenContent = function(contentId) {
    return this.mlMetrics.interactions.some(i => 
      i.data.recommendationId === contentId && 
      (i.type === 'impression' || i.type === 'click')
    );
  };

  EnhancedRecommendationManager.prototype.findRecommendationById = function(id) {
    // Buscar en cache de recomendaciones activas
    for (const [key, value] of this.recommendationCache.entries()) {
      if (value.recommendations) {
        const found = value.recommendations.find(r => r.id === id);
        if (found) return found;
      }
    }
    return null;
  };

  // Auto-inicializar optimizaciones cuando el manager esté listo
  const originalInit = EnhancedRecommendationManager.prototype.init;
  EnhancedRecommendationManager.prototype.init = function() {
    originalInit.call(this);
    
    // Inicializar optimizaciones
    this.setupABTesting();
    this.setupQualityMetrics();
    this.setupImplicitFeedback();
    this.setupPerformanceOptimizations();
    this.setupAdvancedAnalytics();
    
    console.log('🔧 Enhanced Recommendation Manager optimizations loaded');
  };
} 