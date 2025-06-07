/**
 * ========================================================================
 * 🛠️ ENHANCED RECOMMENDATION MANAGER - HELPER METHODS
 * ========================================================================
 * 
 * Métodos auxiliares y de utilidad para el Enhanced Recommendation Manager
 * 
 * ========================================================================
 */

// Extender EnhancedRecommendationManager con métodos faltantes
if (typeof EnhancedRecommendationManager !== 'undefined') {

  // Métodos de tracking avanzado
  EnhancedRecommendationManager.prototype.setupAdvancedTracking = function() {
    // Setup tracking avanzado de interacciones
    this.trackingConfig = {
      clickTracking: true,
      scrollTracking: true,
      timeTracking: true,
      focusTracking: true,
      exitIntentTracking: true
    };

    this.setupClickTracking();
    this.setupScrollTracking();
    this.setupTimeTracking();
    this.setupFocusTracking();
    this.setupExitIntentTracking();

    console.log('🔍 Advanced tracking system initialized');
  };

  EnhancedRecommendationManager.prototype.setupClickTracking = function() {
    document.addEventListener('click', (event) => {
      const element = event.target;
      const elementData = this.extractElementData(element);
      
      this.trackMLInteraction('click', {
        element: elementData,
        coordinates: { x: event.clientX, y: event.clientY },
        timestamp: Date.now()
      });

      // Actualizar métricas de click frequency
      const elementId = this.getElementIdentifier(element);
      const currentCount = this.userProfile.behaviorMetrics.clickFrequency.get(elementId) || 0;
      this.userProfile.behaviorMetrics.clickFrequency.set(elementId, currentCount + 1);
    });
  };

  EnhancedRecommendationManager.prototype.setupScrollTracking = function() {
    let scrollTimeout;
    let lastScrollPosition = 0;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const currentPosition = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (currentPosition / maxScroll) * 100;

        this.trackMLInteraction('scroll', {
          position: currentPosition,
          percentage: Math.round(scrollPercentage),
          direction: currentPosition > lastScrollPosition ? 'down' : 'up',
          timestamp: Date.now()
        });

        lastScrollPosition = currentPosition;
      }, 150);
    });
  };

  EnhancedRecommendationManager.prototype.setupTimeTracking = function() {
    this.sessionStartTime = Date.now();
    this.pageStartTime = Date.now();

    // Track time spent on page
    window.addEventListener('beforeunload', () => {
      const timeSpent = Date.now() - this.pageStartTime;
      const currentPage = window.location.pathname;
      
      const existingTime = this.userProfile.behaviorMetrics.timeSpent.get(currentPage) || 0;
      this.userProfile.behaviorMetrics.timeSpent.set(currentPage, existingTime + timeSpent);

      this.saveProfile();
    });

    // Track session depth
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const sessionTime = Date.now() - this.sessionStartTime;
        this.userProfile.behaviorMetrics.sessionDepth.push(sessionTime);
        this.saveProfile();
      } else {
        this.sessionStartTime = Date.now();
      }
    });
  };

  EnhancedRecommendationManager.prototype.setupFocusTracking = function() {
    let focusStartTime = Date.now();

    window.addEventListener('focus', () => {
      focusStartTime = Date.now();
    });

    window.addEventListener('blur', () => {
      const focusTime = Date.now() - focusStartTime;
      if (focusTime > 1000) { // Solo si el foco duró más de 1 segundo
        this.trackMLInteraction('focus_lost', {
          duration: focusTime,
          timestamp: Date.now()
        });
      }
    });
  };

  EnhancedRecommendationManager.prototype.setupExitIntentTracking = function() {
    let exitIntentShown = false;

    document.addEventListener('mouseleave', (event) => {
      if (event.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        this.trackMLInteraction('exit_intent', {
          timestamp: Date.now(),
          timeOnPage: Date.now() - this.pageStartTime
        });

        // Opcional: mostrar recomendaciones de retención
        this.showExitIntentRecommendations();
      }
    });
  };

  // Métodos de datos ML
  EnhancedRecommendationManager.prototype.startMLDataCollection = function() {
    // Recolección automática de datos para ML
    setInterval(() => {
      this.collectPerformanceMetrics();
      this.updateBehaviorPatterns();
      this.cleanOldData();
    }, 60000); // Cada minuto

    console.log('📊 ML data collection started');
  };

  EnhancedRecommendationManager.prototype.updateUserProfileFromInteraction = function(interaction) {
    const { type, data } = interaction;

    // Actualizar patrones basados en tipo de interacción
    switch (type) {
      case 'click':
        this.updateClickPatterns(data);
        break;
      case 'scroll':
        this.updateScrollPatterns(data);
        break;
      case 'recommendation_engagement':
        this.updateEngagementPatterns(data);
        break;
      case 'recommendation_feedback':
        this.updateFeedbackPatterns(data);
        break;
    }

    // Recalcular engagement score
    this.calculateUserEngagement();
  };

  EnhancedRecommendationManager.prototype.updateClickPatterns = function(data) {
    const hour = new Date().getHours();
    const device = this.getDeviceType();

    // Actualizar actividad por hora
    const currentHourActivity = this.userProfile.contextualFactors.timeOfDayActivity.get(hour) || 0;
    this.userProfile.contextualFactors.timeOfDayActivity.set(hour, currentHourActivity + 1);

    // Actualizar uso por dispositivo
    const currentDeviceUsage = this.userProfile.contextualFactors.deviceUsage.get(device) || 0;
    this.userProfile.contextualFactors.deviceUsage.set(device, currentDeviceUsage + 1);
  };

  EnhancedRecommendationManager.prototype.adjustProfileFromFeedback = function(recommendationId, feedback) {
    // Ajustar perfil basado en feedback del usuario
    const recommendation = this.findRecommendationById(recommendationId);
    if (!recommendation) return;

    const category = recommendation.category;
    const currentPreference = this.userProfile.preferences.categories.get(category) || 0;

    switch (feedback) {
      case 'like':
        this.userProfile.preferences.categories.set(category, currentPreference + 1);
        break;
      case 'dislike':
        this.userProfile.preferences.categories.set(category, Math.max(0, currentPreference - 1));
        break;
      case 'not-interested':
        this.userProfile.preferences.categories.set(category, Math.max(0, currentPreference - 0.5));
        break;
    }
  };

  // Métodos de cache y utilidades
  EnhancedRecommendationManager.prototype.generateCacheKey = function(algorithm, count, filters, context) {
    const contextHash = this.hashObject({
      timeOfDay: context.timeOfDay,
      deviceType: context.deviceType,
      page: context.page
    });
    return `${algorithm}_${count}_${filters.join('_')}_${contextHash}`;
  };

  EnhancedRecommendationManager.prototype.getCachedRecommendations = function(cacheKey) {
    const cached = this.recommendationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log('📦 Using cached recommendations');
      return cached.data;
    }
    return null;
  };

  EnhancedRecommendationManager.prototype.cacheRecommendations = function(cacheKey, recommendations) {
    this.recommendationCache.set(cacheKey, {
      data: recommendations,
      timestamp: Date.now()
    });
  };

  EnhancedRecommendationManager.prototype.cleanExpiredCache = function() {
    const now = Date.now();
    for (const [key, value] of this.recommendationCache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.recommendationCache.delete(key);
      }
    }
  };

  // Métodos de contenido y filtros
  EnhancedRecommendationManager.prototype.getAvailableContent = async function() {
    // Simular obtención de contenido disponible
    try {
      const mockData = await this.loadMockData();
      return mockData.recommendations;
    } catch (error) {
      console.error('Error loading available content:', error);
      return [];
    }
  };

  EnhancedRecommendationManager.prototype.getPopularContent = async function() {
    const content = await this.getAvailableContent();
    // Simular popularidad basada en mlFeatures.engagementPotential
    return content
      .sort((a, b) => (b.mlFeatures?.engagementPotential || 0) - (a.mlFeatures?.engagementPotential || 0));
  };

  EnhancedRecommendationManager.prototype.getContextualContent = async function(context) {
    const content = await this.getAvailableContent();
    const hour = context.timeOfDay;
    
    // Filtrar contenido basado en contexto temporal
    return content.filter(item => {
      const optimalHours = item.seasonality?.timeOfDayOptimal || [];
      return optimalHours.length === 0 || optimalHours.includes(hour);
    });
  };

  EnhancedRecommendationManager.prototype.deduplicateRecommendations = function(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      if (seen.has(rec.id)) {
        return false;
      }
      seen.add(rec.id);
      return true;
    });
  };

  EnhancedRecommendationManager.prototype.applyFilters = function(recommendations, filters) {
    let filtered = [...recommendations];

    filters.forEach(filterName => {
      if (this.recommendationEngine.filters[filterName]) {
        filtered = this.recommendationEngine.filters[filterName](filtered);
      }
    });

    return filtered;
  };

  EnhancedRecommendationManager.prototype.applyDiversityFilter = function(recommendations) {
    // Asegurar diversidad de categorías
    const categories = new Set();
    const diverse = [];
    const threshold = Math.ceil(recommendations.length * 0.3); // Max 30% de una categoría

    recommendations.forEach(rec => {
      const categoryCount = Array.from(categories).filter(c => c === rec.category).length;
      if (categoryCount < threshold) {
        diverse.push(rec);
        categories.add(rec.category);
      }
    });

    return diverse;
  };

  EnhancedRecommendationManager.prototype.applyNoveltyFilter = function(recommendations) {
    // Priorizar contenido no visto
    return recommendations.map(rec => {
      const hasInteracted = this.userProfile.behaviorMetrics.clickFrequency.has(rec.id);
      if (!hasInteracted) {
        rec.score = (rec.score || 0.5) + 0.1; // Boost de novedad
      }
      return rec;
    });
  };

  EnhancedRecommendationManager.prototype.applyQualityFilter = function(recommendations) {
    // Filtrar contenido de baja calidad
    const qualityThreshold = 0.6;
    return recommendations.filter(rec => {
      const quality = rec.mlFeatures?.engagementPotential || 0.5;
      return quality >= qualityThreshold;
    });
  };

  EnhancedRecommendationManager.prototype.rankByRelevance = function(recommendations) {
    return recommendations.sort((a, b) => {
      const scoreA = a.personalizedScore || a.score || 0;
      const scoreB = b.personalizedScore || b.score || 0;
      return scoreB - scoreA;
    });
  };

  EnhancedRecommendationManager.prototype.rankByPopularity = function(recommendations) {
    return recommendations.sort((a, b) => {
      const popA = a.mlFeatures?.engagementPotential || 0;
      const popB = b.mlFeatures?.engagementPotential || 0;
      return popB - popA;
    });
  };

  EnhancedRecommendationManager.prototype.rankByFreshness = function(recommendations) {
    return recommendations.sort((a, b) => {
      const timeA = new Date(a.metadata?.timestamp || 0).getTime();
      const timeB = new Date(b.metadata?.timestamp || 0).getTime();
      return timeB - timeA;
    });
  };

  // Métodos de UI helpers
  EnhancedRecommendationManager.prototype.showLoadingState = function(container) {
    container.innerHTML = `
      <div class="recommendations-loading">
        <div class="loading-spinner"></div>
        <p>Generando recomendaciones personalizadas...</p>
      </div>
    `;
  };

  EnhancedRecommendationManager.prototype.showErrorState = function(container) {
    container.innerHTML = `
      <div class="recommendations-error">
        <div class="error-icon">⚠️</div>
        <p>Error al cargar recomendaciones</p>
        <button onclick="window.enhancedRecommendationManager.displayRecommendations('${container.id}')">
          Reintentar
        </button>
      </div>
    `;
  };

  EnhancedRecommendationManager.prototype.updateRecommendationsContainer = function(container, elements, metadata) {
    container.innerHTML = `
      <div class="recommendations-header">
        <h2>Recomendaciones para ti</h2>
        <div class="recommendations-metadata">
          <span class="algorithm-info">Algoritmo: ${metadata?.algorithm || 'personalizado'}</span>
          <span class="confidence-info">Confianza: ${Math.round((metadata?.confidence || 0.8) * 100)}%</span>
        </div>
      </div>
      <div class="recommendations-grid" id="recommendations-grid"></div>
      <div class="recommendations-footer">
        <button class="load-more-btn" onclick="window.enhancedRecommendationManager.loadMoreRecommendations()">
          Cargar más recomendaciones
        </button>
      </div>
    `;

    const grid = container.querySelector('#recommendations-grid');
    elements.forEach(element => grid.appendChild(element));
  };

  EnhancedRecommendationManager.prototype.trackRecommendationImpression = function(recommendationId) {
    this.trackMLInteraction('recommendation_impression', {
      recommendationId,
      timestamp: Date.now(),
      viewportPosition: this.getViewportPosition(recommendationId)
    });
  };

  // Métodos de utilidad y helpers
  EnhancedRecommendationManager.prototype.extractElementData = function(element) {
    return {
      tagName: element.tagName,
      className: element.className,
      id: element.id,
      text: element.textContent?.slice(0, 100) || '',
      href: element.href || null,
      type: element.type || null
    };
  };

  EnhancedRecommendationManager.prototype.getElementIdentifier = function(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  };

  EnhancedRecommendationManager.prototype.getElementSelector = function(element) {
    // Generar selector CSS único para el elemento
    if (element.id) return `#${element.id}`;
    
    let selector = element.tagName.toLowerCase();
    if (element.className) {
      selector += `.${element.className.split(' ').join('.')}`;
    }
    
    return selector;
  };

  EnhancedRecommendationManager.prototype.hashObject = function(obj) {
    // Simple hash function para objetos
    const str = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  };

  EnhancedRecommendationManager.prototype.getLastInteractionTime = function(contentId) {
    // Buscar la última interacción con este contenido
    const interactions = this.mlMetrics.interactions.filter(
      i => i.data?.recommendationId === contentId || i.data?.element?.includes(contentId)
    );
    
    return interactions.length > 0 
      ? Math.max(...interactions.map(i => i.timestamp))
      : null;
  };

  EnhancedRecommendationManager.prototype.findRecommendationById = function(id) {
    // Buscar recomendación en caché o datos mock
    for (const [key, cachedData] of this.recommendationCache.entries()) {
      const found = cachedData.data?.recommendations?.find(r => r.id === id);
      if (found) return found;
    }
    return null;
  };

  EnhancedRecommendationManager.prototype.getScoreFactors = function(recommendation) {
    return {
      clickFrequency: this.userProfile.behaviorMetrics.clickFrequency.get(recommendation.id) || 0,
      timeSpent: this.userProfile.behaviorMetrics.timeSpent.get(recommendation.id) || 0,
      categoryPreference: this.userProfile.preferences.categories.get(recommendation.category) || 0,
      contextualRelevance: this.calculateContextualRelevance(recommendation)
    };
  };

  // Métodos de datos temporales y de sesión
  EnhancedRecommendationManager.prototype.getSessionStartTime = function() {
    return this.sessionStartTime || Date.now();
  };

  EnhancedRecommendationManager.prototype.getSessionInteractionCount = function() {
    const sessionId = this.getCurrentSessionId();
    return this.mlMetrics.interactions.filter(i => i.sessionId === sessionId).length;
  };

  EnhancedRecommendationManager.prototype.getSessionPages = function() {
    const sessionId = this.getCurrentSessionId();
    const pages = new Set();
    this.mlMetrics.interactions
      .filter(i => i.sessionId === sessionId)
      .forEach(i => pages.add(i.context?.page));
    return Array.from(pages);
  };

  EnhancedRecommendationManager.prototype.getSessionConversions = function() {
    const sessionId = this.getCurrentSessionId();
    return this.mlMetrics.conversionEvents.filter(c => c.sessionId === sessionId);
  };

  EnhancedRecommendationManager.prototype.getDeviceInfo = function() {
    return {
      type: this.getDeviceType(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  };

  EnhancedRecommendationManager.prototype.calculateSessionEngagement = function() {
    const sessionDuration = Date.now() - this.getSessionStartTime();
    const interactions = this.getSessionInteractionCount();
    const pages = this.getSessionPages().length;
    
    // Normalizar valores
    const durationScore = Math.min(sessionDuration / 1800000, 1); // 30 min = max
    const interactionScore = Math.min(interactions / 50, 1); // 50 interactions = max
    const pageScore = Math.min(pages / 10, 1); // 10 pages = max
    
    return (durationScore + interactionScore + pageScore) / 3;
  };

  // Métodos para estadísticas de usuario
  EnhancedRecommendationManager.prototype.getDaysSinceFirstVisit = function() {
    const firstVisit = localStorage.getItem('coomunity_first_visit');
    if (!firstVisit) {
      localStorage.setItem('coomunity_first_visit', Date.now().toString());
      return 0;
    }
    return Math.floor((Date.now() - parseInt(firstVisit)) / (1000 * 60 * 60 * 24));
  };

  EnhancedRecommendationManager.prototype.getVisitFrequency = function() {
    const visits = parseInt(localStorage.getItem('coomunity_visit_count') || '0');
    const daysSinceFirst = this.getDaysSinceFirstVisit() + 1;
    return visits / daysSinceFirst;
  };

  EnhancedRecommendationManager.prototype.getActiveHours = function() {
    return this.userProfile.contextualFactors.timeOfDayActivity.size;
  };

  EnhancedRecommendationManager.prototype.getTopCategories = function() {
    const categories = Array.from(this.userProfile.preferences.categories.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, score]) => ({ category, score }));
    
    return categories;
  };

  // Métodos de serialización para ML
  EnhancedRecommendationManager.prototype.serializeProfileForAPI = function() {
    return {
      userId: this.userProfile.userId,
      preferences: Object.fromEntries(this.userProfile.preferences.categories),
      behaviorMetrics: {
        engagementScore: this.userProfile.behaviorMetrics.engagementScore,
        totalClicks: Array.from(this.userProfile.behaviorMetrics.clickFrequency.values()).reduce((a, b) => a + b, 0),
        totalTime: Array.from(this.userProfile.behaviorMetrics.timeSpent.values()).reduce((a, b) => a + b, 0),
        sessionCount: this.userProfile.behaviorMetrics.sessionDepth.length
      },
      contextualFactors: {
        deviceTypes: Array.from(this.userProfile.contextualFactors.deviceUsage.keys()),
        activeHours: Array.from(this.userProfile.contextualFactors.timeOfDayActivity.keys()),
        averageSessionLength: this.userProfile.contextualFactors.sessionLength.reduce((a, b) => a + b, 0) / this.userProfile.contextualFactors.sessionLength.length || 0
      }
    };
  };

  EnhancedRecommendationManager.prototype.serializeProfileForML = function() {
    return {
      userId: this.userProfile.userId,
      featureVector: this.extractFeatureVector(),
      preferences: Object.fromEntries(this.userProfile.preferences.categories),
      behaviorMetrics: this.userProfile.behaviorMetrics,
      contextualFactors: Object.fromEntries(this.userProfile.contextualFactors.deviceUsage),
      mlFeatures: this.userProfile.mlFeatures
    };
  };

  EnhancedRecommendationManager.prototype.assessDataQuality = function() {
    const interactions = this.mlMetrics.interactions.length;
    const sessions = this.mlMetrics.sessionData.length;
    const conversions = this.mlMetrics.conversionEvents.length;
    
    let quality = 0;
    if (interactions > 10) quality += 0.3;
    if (sessions > 3) quality += 0.3;
    if (conversions > 1) quality += 0.2;
    if (this.userProfile.behaviorMetrics.engagementScore > 0.5) quality += 0.2;
    
    return Math.min(quality, 1.0);
  };

  // Métodos de migración de datos existentes
  EnhancedRecommendationManager.prototype.migrateExistingBehaviorData = function(behaviorPatterns) {
    // Migrar datos del AdaptiveContextualManager
    if (behaviorPatterns.pageFrequency) {
      Object.entries(behaviorPatterns.pageFrequency).forEach(([page, freq]) => {
        this.userProfile.behaviorMetrics.clickFrequency.set(page, freq);
      });
    }

    if (behaviorPatterns.featureUsage) {
      Object.entries(behaviorPatterns.featureUsage).forEach(([feature, usage]) => {
        this.userProfile.preferences.contentTypes.set(feature, usage);
      });
    }

    console.log('📋 Migrated existing behavior data');
  };

  EnhancedRecommendationManager.prototype.migrateExistingUsageHistory = function(usageHistory) {
    // Convertir historial de uso a interacciones ML
    usageHistory.forEach(entry => {
      if (entry.timestamp && entry.page) {
        this.mlMetrics.interactions.push({
          timestamp: entry.timestamp,
          userId: this.userProfile.userId,
          type: 'page_visit',
          data: { page: entry.page },
          context: { page: entry.page },
          sessionId: this.getCurrentSessionId()
        });
      }
    });

    console.log('📋 Migrated existing usage history');
  };

  // Métodos de fallback y recuperación
  EnhancedRecommendationManager.prototype.getFallbackRecommendations = function(count = 5) {
    // Recomendaciones básicas cuando falla todo lo demás
    return {
      recommendations: [
        {
          id: 'fallback_1',
          title: 'Explora CoomÜnity',
          description: 'Descubre todas las características de nuestra plataforma',
          category: 'community',
          type: 'social',
          personalizedScore: 0.7,
          reason: 'Contenido popular'
        }
      ],
      metadata: {
        algorithm: 'fallback',
        confidence: 0.5,
        timestamp: Date.now()
      }
    };
  };

  EnhancedRecommendationManager.prototype.generateFallbackRecommendations = function(options) {
    return this.getFallbackRecommendations(options.count);
  };

  // Método para cargar más recomendaciones
  EnhancedRecommendationManager.prototype.loadMoreRecommendations = function() {
    const container = document.getElementById('recommendations-container');
    if (container) {
      this.displayRecommendations('recommendations-container');
    }
  };

  // Método para mostrar recomendaciones en exit intent
  EnhancedRecommendationManager.prototype.showExitIntentRecommendations = function() {
    // Crear modal con recomendaciones de retención
    const modal = document.createElement('div');
    modal.className = 'exit-intent-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>¡Espera! Antes de irte...</h3>
        <p>Tenemos contenido que creemos que te gustará</p>
        <div id="exit-intent-recommendations"></div>
        <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cargar recomendaciones específicas para retención
    this.displayRecommendations('exit-intent-recommendations');
  };

  // Inicialización de eventos y observers
  EnhancedRecommendationManager.prototype.updateContextualData = function() {
    // Actualizar datos contextuales
    this.contextualData = this.getCurrentContext();
  };

  EnhancedRecommendationManager.prototype.evaluateAdaptationTriggers = function() {
    // Evaluar si hay cambios que requieren adaptación
    const engagement = this.calculateUserEngagement();
    
    if (engagement > 0.8 && this.userProfile.personalizationLevel < 4) {
      this.upgradePersonalizationLevel();
    }
  };

  EnhancedRecommendationManager.prototype.upgradePersonalizationLevel = function() {
    this.userProfile.personalizationLevel = Math.min(this.userProfile.personalizationLevel + 1, 4);
    console.log(`🔄 Personalization level upgraded to: ${this.userProfile.personalizationLevel}`);
  };

  EnhancedRecommendationManager.prototype.recordSuccessfulRecommendation = function(recommendationId) {
    // Registrar recomendación exitosa para ML training
    const recommendation = this.findRecommendationById(recommendationId);
    if (recommendation) {
      // Aumentar peso de la categoría
      const category = recommendation.category;
      const currentPref = this.userProfile.preferences.categories.get(category) || 0;
      this.userProfile.preferences.categories.set(category, currentPref + 0.5);
    }
  };

  EnhancedRecommendationManager.prototype.collectPerformanceMetrics = function() {
    // Recopilar métricas de rendimiento
    if (performance && performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        this.performanceMetrics = {
          loadTime: nav.loadEventEnd - nav.loadEventStart,
          domContentLoadedTime: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          timeToFirstByte: nav.responseStart - nav.requestStart
        };
      }
    }
  };

  EnhancedRecommendationManager.prototype.updateBehaviorPatterns = function() {
    // Actualizar patrones de comportamiento basados en actividad reciente
    const recentInteractions = this.mlMetrics.interactions.slice(-50); // Últimas 50 interacciones
    
    // Analizar patrones temporales
    const hourCounts = {};
    recentInteractions.forEach(interaction => {
      const hour = new Date(interaction.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    // Actualizar patrones de tiempo
    Object.entries(hourCounts).forEach(([hour, count]) => {
      this.userProfile.preferences.timePreferences.set(parseInt(hour), count);
    });
  };

  EnhancedRecommendationManager.prototype.cleanOldData = function() {
    // Limpiar datos antiguos para mantener el rendimiento
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Limpiar interacciones antiguas
    this.mlMetrics.interactions = this.mlMetrics.interactions.filter(
      interaction => interaction.timestamp > oneWeekAgo
    );
    
    // Limpiar eventos de conversión antiguos
    this.mlMetrics.conversionEvents = this.mlMetrics.conversionEvents.filter(
      event => event.timestamp > oneWeekAgo
    );
  };

  console.log('🛠️ Enhanced Recommendation Manager helpers loaded');
}

// Para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    extendEnhancedRecommendationManager: () => {
      console.log('Helper methods available for EnhancedRecommendationManager');
    }
  };
} 