/**
 * ========================================================================
 * 🤖 ENHANCED RECOMMENDATION MANAGER - ML READY
 * ========================================================================
 * 
 * Motor de recomendaciones avanzado que extiende el AdaptiveContextualManager
 * con capacidades preparadas para Machine Learning.
 * 
 * Funcionalidades:
 * - Sistema de scoring avanzado basado en múltiples factores
 * - Preparación para integración con backend de ML
 * - Simulación de API de recomendaciones
 * - Tracking granular de interacciones
 * - Perfiles de usuario enriquecidos
 * - Métricas preparadas para ML training
 * 
 * ========================================================================
 */

class EnhancedRecommendationManager {
  constructor() {
    this.version = '1.0.0';
    this.isMLReady = true;
    
    // Inicializar perfil de usuario enriquecido
    this.userProfile = {
      userId: this.generateUserId(),
      preferences: {
        contentTypes: new Map(), // Preferencias por tipo de contenido
        categories: new Map(),   // Preferencias por categoría
        timePreferences: new Map(), // Patrones temporales
        interactionStyles: new Map() // Estilos de interacción
      },
      behaviorMetrics: {
        clickFrequency: new Map(),      // Frecuencia de clics por elemento
        timeSpent: new Map(),           // Tiempo gastado por página/sección
        completionRates: new Map(),     // Tasas de finalización de acciones
        sessionDepth: [],               // Profundidad de sesiones
        returnPatterns: new Map(),      // Patrones de retorno
        engagementScore: 0,             // Score general de engagement
        learningVelocity: 0,            // Velocidad de aprendizaje del usuario
        expertiseLevel: new Map()       // Nivel de expertise por área
      },
      contextualFactors: {
        deviceUsage: new Map(),         // Uso por dispositivo
        timeOfDayActivity: new Map(),   // Actividad por hora del día
        sessionLength: [],              // Longitud de sesiones
        navigationPatterns: [],         // Patrones de navegación
        exitPoints: new Map(),          // Puntos comunes de salida
        entryPoints: new Map()          // Puntos comunes de entrada
      },
      mlFeatures: {
        featureVector: [],              // Vector de características para ML
        clusterAssignment: null,        // Asignación de cluster
        personalityProfile: {},         // Perfil de personalidad inferido
        predictedInterests: []          // Intereses predichos
      }
    };
    
    // Sistema de scoring avanzado
    this.scoringWeights = {
      clickFrequency: 0.25,
      timeSpent: 0.20,
      recency: 0.15,
      completion: 0.15,
      contextual: 0.10,
      seasonal: 0.08,
      social: 0.07  // Para futuras características sociales
    };
    
    // Cache de recomendaciones
    this.recommendationCache = new Map();
    this.cacheExpiry = 300000; // 5 minutos
    
    // Configuración de API mock
    this.apiConfig = {
      baseUrl: '/api/recommendations',
      mockMode: true,
      retries: 3,
      timeout: 5000
    };
    
    // Tracking de métricas para ML
    this.mlMetrics = {
      interactions: [],
      sessionData: [],
      conversionEvents: [],
      abTestResults: []
    };
    
    this.init();
  }

  /**
   * =====================================
   * 🚀 INICIALIZACIÓN
   * =====================================
   */

  init() {
    this.loadUserProfile();
    this.setupAdvancedTracking();
    this.setupScoringSystem();
    this.setupRecommendationEngine();
    this.setupMLDataCollection();
    this.setupAPIInterface();
    this.startRecommendationLoop();
    
    console.log('🤖 Enhanced Recommendation Manager initialized', {
      version: this.version,
      userId: this.userProfile.userId,
      mlReady: this.isMLReady
    });
  }

  generateUserId() {
    // Generar ID único para el usuario (compatible con analytics)
    let userId = localStorage.getItem('coomunity_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('coomunity_user_id', userId);
    }
    return userId;
  }

  loadUserProfile() {
    const savedProfile = localStorage.getItem('coomunity_enhanced_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        // Merge con perfil actual manteniendo Maps
        Object.keys(parsed).forEach(key => {
          if (this.userProfile[key] && typeof this.userProfile[key] === 'object') {
            this.mergeProfileSection(key, parsed[key]);
          }
        });
      } catch (e) {
        console.warn('Error loading enhanced profile:', e);
      }
    }
    
    // Cargar datos del AdaptiveContextualManager si existe
    this.integrateWithExistingManager();
  }

  mergeProfileSection(section, data) {
    // Convertir objetos planos de vuelta a Maps donde sea necesario
    if (section === 'preferences' || section === 'behaviorMetrics' || section === 'contextualFactors') {
      Object.keys(data).forEach(key => {
        if (data[key] && typeof data[key] === 'object' && data[key].constructor === Object) {
          this.userProfile[section][key] = new Map(Object.entries(data[key]));
        } else {
          this.userProfile[section][key] = data[key];
        }
      });
    } else {
      this.userProfile[section] = { ...this.userProfile[section], ...data };
    }
  }

  integrateWithExistingManager() {
    // Integrar con AdaptiveContextualManager si existe
    if (window.adaptiveManager) {
      const existingProfile = window.adaptiveManager.getUserProfile();
      
      // Migrar datos existentes
      if (existingProfile.behaviorPatterns) {
        this.migrateExistingBehaviorData(existingProfile.behaviorPatterns);
      }
      
      if (existingProfile.usageHistory) {
        this.migrateExistingUsageHistory(existingProfile.usageHistory);
      }
    }
  }

  /**
   * =====================================
   * 📊 SISTEMA DE SCORING AVANZADO
   * =====================================
   */

  setupScoringSystem() {
    this.scoringEngine = {
      // Algoritmos de scoring
      calculateContentScore: this.calculateContentScore.bind(this),
      calculateUserEngagement: this.calculateUserEngagement.bind(this),
      calculateSeasonalRelevance: this.calculateSeasonalRelevance.bind(this),
      calculateSocialRelevance: this.calculateSocialRelevance.bind(this),
      
      // Funciones de normalización
      normalizeScore: this.normalizeScore.bind(this),
      applyDecayFunction: this.applyDecayFunction.bind(this),
      
      // Machine Learning prep
      extractFeatureVector: this.extractFeatureVector.bind(this),
      updateClusterAssignment: this.updateClusterAssignment.bind(this)
    };
  }

  calculateContentScore(content) {
    let score = 0.5; // Base score
    
    // Factor 1: Frecuencia de clics (25%)
    const clickFreq = this.userProfile.behaviorMetrics.clickFrequency.get(content.id) || 0;
    const normalizedClickFreq = Math.min(clickFreq / 10, 1); // Normalizar a 0-1
    score += normalizedClickFreq * this.scoringWeights.clickFrequency;
    
    // Factor 2: Tiempo gastado (20%)
    const timeSpent = this.userProfile.behaviorMetrics.timeSpent.get(content.id) || 0;
    const normalizedTime = Math.min(timeSpent / 300000, 1); // 5 minutos = score máximo
    score += normalizedTime * this.scoringWeights.timeSpent;
    
    // Factor 3: Recencia (15%)
    const lastInteraction = this.getLastInteractionTime(content.id);
    const recencyScore = this.calculateRecencyScore(lastInteraction);
    score += recencyScore * this.scoringWeights.recency;
    
    // Factor 4: Tasa de finalización (15%)
    const completionRate = this.userProfile.behaviorMetrics.completionRates.get(content.id) || 0;
    score += completionRate * this.scoringWeights.completion;
    
    // Factor 5: Relevancia contextual (10%)
    const contextualScore = this.calculateContextualRelevance(content);
    score += contextualScore * this.scoringWeights.contextual;
    
    // Factor 6: Relevancia estacional (8%)
    const seasonalScore = this.calculateSeasonalRelevance(content);
    score += seasonalScore * this.scoringWeights.seasonal;
    
    // Factor 7: Relevancia social futura (7%)
    const socialScore = this.calculateSocialRelevance(content);
    score += socialScore * this.scoringWeights.social;
    
    return this.normalizeScore(score);
  }

  calculateUserEngagement() {
    const metrics = this.userProfile.behaviorMetrics;
    
    // Calcular engagement basado en múltiples factores
    let engagement = 0;
    
    // Frecuencia de visitas
    const totalClicks = Array.from(metrics.clickFrequency.values()).reduce((a, b) => a + b, 0);
    engagement += Math.min(totalClicks / 100, 1) * 0.3;
    
    // Tiempo total en la plataforma
    const totalTime = Array.from(metrics.timeSpent.values()).reduce((a, b) => a + b, 0);
    engagement += Math.min(totalTime / 3600000, 1) * 0.3; // 1 hora = score máximo
    
    // Diversidad de contenido explorado
    const contentDiversity = metrics.clickFrequency.size / 50; // 50 elementos diferentes = score máximo
    engagement += Math.min(contentDiversity, 1) * 0.2;
    
    // Profundidad de sesiones
    const avgSessionDepth = metrics.sessionDepth.reduce((a, b) => a + b, 0) / metrics.sessionDepth.length || 0;
    engagement += Math.min(avgSessionDepth / 10, 1) * 0.2;
    
    this.userProfile.behaviorMetrics.engagementScore = this.normalizeScore(engagement);
    return this.userProfile.behaviorMetrics.engagementScore;
  }

  calculateRecencyScore(lastInteraction) {
    if (!lastInteraction) return 0;
    
    const timeDiff = Date.now() - lastInteraction;
    const daysSince = timeDiff / (1000 * 60 * 60 * 24);
    
    // Función de decaimiento exponencial
    return Math.exp(-daysSince / 7); // Decae a la mitad cada 7 días
  }

  calculateContextualRelevance(content) {
    let contextScore = 0;
    
    // Factor temporal
    const currentHour = new Date().getHours();
    const timeActivity = this.userProfile.contextualFactors.timeOfDayActivity.get(currentHour) || 0;
    contextScore += Math.min(timeActivity / 10, 1) * 0.4;
    
    // Factor de dispositivo
    const deviceType = this.getDeviceType();
    const deviceUsage = this.userProfile.contextualFactors.deviceUsage.get(deviceType) || 0;
    contextScore += Math.min(deviceUsage / 20, 1) * 0.3;
    
    // Factor de categoría preferida
    if (content.category) {
      const categoryPref = this.userProfile.preferences.categories.get(content.category) || 0;
      contextScore += Math.min(categoryPref / 5, 1) * 0.3;
    }
    
    return this.normalizeScore(contextScore);
  }

  calculateSeasonalRelevance(content) {
    // Para futuras implementaciones de contenido estacional
    const month = new Date().getMonth();
    const seasonalFactors = {
      winter: [11, 0, 1],
      spring: [2, 3, 4],
      summer: [5, 6, 7],
      autumn: [8, 9, 10]
    };
    
    // Por ahora retornamos un score base
    return 0.5;
  }

  calculateSocialRelevance(content) {
    // Preparado para características sociales futuras
    // (compartidos, likes, comentarios, etc.)
    return 0.5;
  }

  normalizeScore(score) {
    return Math.max(0, Math.min(1, score));
  }

  applyDecayFunction(score, ageInDays) {
    // Aplicar decaimiento temporal al score
    return score * Math.exp(-ageInDays / 30); // Decae a la mitad cada 30 días
  }

  /**
   * =====================================
   * 🎯 SISTEMA DE RECOMENDACIONES
   * =====================================
   */

  setupRecommendationEngine() {
    this.recommendationEngine = {
      algorithms: {
        contentBased: this.generateContentBasedRecommendations.bind(this),
        collaborative: this.generateCollaborativeRecommendations.bind(this),
        hybrid: this.generateHybridRecommendations.bind(this),
        contextual: this.generateContextualRecommendations.bind(this)
      },
      
      filters: {
        diversity: this.applyDiversityFilter.bind(this),
        novelty: this.applyNoveltyFilter.bind(this),
        quality: this.applyQualityFilter.bind(this)
      },
      
      rankers: {
        relevance: this.rankByRelevance.bind(this),
        popularity: this.rankByPopularity.bind(this),
        freshness: this.rankByFreshness.bind(this)
      }
    };
  }

  async generateRecommendations(options = {}) {
    const {
      algorithm = 'hybrid',
      count = 10,
      filters = ['diversity', 'quality'],
      context = this.getCurrentContext()
    } = options;
    
    // Verificar cache
    const cacheKey = this.generateCacheKey(algorithm, count, filters, context);
    const cached = this.getCachedRecommendations(cacheKey);
    if (cached) {
      return cached;
    }
    
    try {
      // Generar recomendaciones usando el algoritmo especificado
      let recommendations = await this.recommendationEngine.algorithms[algorithm](context, count);
      
      // Aplicar filtros
      recommendations = this.applyFilters(recommendations, filters);
      
      // Ranking final
      recommendations = this.rankByRelevance(recommendations);
      
      // Limitar cantidad
      recommendations = recommendations.slice(0, count);
      
      // Cachear resultado
      this.cacheRecommendations(cacheKey, recommendations);
      
      // Registrar para métricas ML
      this.logRecommendationGeneration(algorithm, recommendations, context);
      
      return recommendations;
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(count);
    }
  }

  async generateContentBasedRecommendations(context, count) {
    // Recomendaciones basadas en contenido similar
    const userPreferences = this.extractUserPreferences();
    const availableContent = await this.getAvailableContent();
    
    return availableContent
      .map(content => ({
        ...content,
        score: this.calculateContentScore(content),
        reason: 'Similar a tu contenido preferido'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  async generateCollaborativeRecommendations(context, count) {
    // Preparado para filtrado colaborativo futuro
    // Por ahora retorna recomendaciones populares
    const popularContent = await this.getPopularContent();
    
    return popularContent
      .map(content => ({
        ...content,
        score: this.calculatePopularityScore(content),
        reason: 'Popular entre usuarios similares'
      }))
      .slice(0, count);
  }

  async generateHybridRecommendations(context, count) {
    // Combina múltiples algoritmos
    const contentBased = await this.generateContentBasedRecommendations(context, Math.ceil(count * 0.6));
    const collaborative = await this.generateCollaborativeRecommendations(context, Math.ceil(count * 0.4));
    
    // Combinar y deduplicar
    const combined = [...contentBased, ...collaborative];
    const unique = this.deduplicateRecommendations(combined);
    
    return unique.slice(0, count);
  }

  async generateContextualRecommendations(context, count) {
    // Recomendaciones basadas en contexto actual
    const contextualContent = await this.getContextualContent(context);
    
    return contextualContent
      .map(content => ({
        ...content,
        score: this.calculateContextualRelevance(content),
        reason: 'Relevante para tu contexto actual'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  /**
   * =====================================
   * 🔌 INTERFAZ DE API
   * =====================================
   */

  setupAPIInterface() {
    this.apiInterface = {
      fetchRecommendations: this.fetchRecommendations.bind(this),
      sendUserFeedback: this.sendUserFeedback.bind(this),
      updateUserProfile: this.updateUserProfile.bind(this),
      getMLInsights: this.getMLInsights.bind(this)
    };
  }

  async fetchRecommendations(options = {}) {
    if (this.apiConfig.mockMode) {
      return this.fetchMockRecommendations(options);
    }
    
    try {
      const response = await this.makeAPIRequest('/recommendations', {
        method: 'POST',
        body: JSON.stringify({
          userId: this.userProfile.userId,
          profile: this.serializeProfileForAPI(),
          context: this.getCurrentContext(),
          ...options
        })
      });
      
      return response.recommendations;
      
    } catch (error) {
      console.error('API request failed:', error);
      return this.fetchMockRecommendations(options);
    }
  }

  async fetchMockRecommendations(options = {}) {
    // Simular delay de red
    await this.simulateNetworkDelay();
    
    try {
      // Intentar cargar desde archivo JSON mock
      const mockData = await this.loadMockData();
      
      // Filtrar y personalizar según perfil del usuario
      const personalizedRecommendations = this.personalizeRecommendations(mockData.recommendations);
      
      return {
        recommendations: personalizedRecommendations.slice(0, options.count || 10),
        metadata: {
          algorithm: 'mock_hybrid',
          confidence: 0.85,
          timestamp: Date.now(),
          version: this.version
        }
      };
      
    } catch (error) {
      console.error('Error loading mock recommendations:', error);
      return this.generateFallbackRecommendations(options);
    }
  }

  async loadMockData() {
    // Intentar cargar datos mock desde archivo JSON
    try {
      const response = await fetch('/shared/data/mock-recommendations.json');
      return await response.json();
    } catch (error) {
      // Si no existe el archivo, generar datos mock en tiempo real
      return this.generateMockData();
    }
  }

  generateMockData() {
    return {
      recommendations: [
        {
          id: 'pilgrim_1',
          title: 'Experiencia Pilgrim Avanzada',
          type: 'interactive',
          category: 'pilgrim',
          description: 'Sumérgete en una experiencia interactiva personalizada',
          thumbnail: '/assets/img/pilgrim-thumb.jpg',
          estimatedTime: 15,
          difficultyLevel: 'intermediate',
          tags: ['interactivo', 'personalización', 'experiencia']
        },
        {
          id: 'merchant_form_1',
          title: 'Crear tu Perfil de Merchant',
          type: 'form',
          category: 'merchant',
          description: 'Configura tu perfil de merchant para mejores oportunidades',
          thumbnail: '/assets/img/merchant-thumb.jpg',
          estimatedTime: 10,
          difficultyLevel: 'beginner',
          tags: ['formulario', 'perfil', 'configuración']
        },
        {
          id: 'redpill_journey_1',
          title: 'Desafío Red Pill: Pensamiento Crítico',
          type: 'quiz',
          category: 'red-pill',
          description: 'Pon a prueba tu capacidad de pensamiento independiente',
          thumbnail: '/assets/img/redpill-thumb.jpg',
          estimatedTime: 20,
          difficultyLevel: 'advanced',
          tags: ['quiz', 'filosofía', 'pensamiento crítico']
        },
        {
          id: 'community_1',
          title: 'Conecta con la Comunidad',
          type: 'social',
          category: 'community',
          description: 'Descubre otros miembros con intereses similares',
          thumbnail: '/assets/img/community-thumb.jpg',
          estimatedTime: 5,
          difficultyLevel: 'beginner',
          tags: ['social', 'comunidad', 'networking']
        }
      ],
      metadata: {
        totalCount: 4,
        categories: ['pilgrim', 'merchant', 'red-pill', 'community'],
        lastUpdated: Date.now()
      }
    };
  }

  personalizeRecommendations(recommendations) {
    return recommendations.map(rec => {
      const personalizedScore = this.calculateContentScore(rec);
      const userEngagement = this.calculateUserEngagement();
      
      return {
        ...rec,
        personalizedScore,
        confidence: personalizedScore * userEngagement,
        reason: this.generateRecommendationReason(rec, personalizedScore),
        metadata: {
          algorithm: 'personalized_mock',
          factors: this.getScoreFactors(rec),
          timestamp: Date.now()
        }
      };
    }).sort((a, b) => b.personalizedScore - a.personalizedScore);
  }

  generateRecommendationReason(recommendation, score) {
    const reasons = [];
    
    if (score > 0.8) {
      reasons.push('Altamente relevante para ti');
    } else if (score > 0.6) {
      reasons.push('Basado en tu actividad reciente');
    } else if (score > 0.4) {
      reasons.push('Popular en tu categoría preferida');
    } else {
      reasons.push('Nuevo contenido que podría interesarte');
    }
    
    // Agregar razones específicas
    const categoryPref = this.userProfile.preferences.categories.get(recommendation.category) || 0;
    if (categoryPref > 3) {
      reasons.push(`Te gusta ${recommendation.category}`);
    }
    
    return reasons.join(' • ');
  }

  /**
   * =====================================
   * 📱 INTERFAZ DE USUARIO
   * =====================================
   */

  async displayRecommendations(containerId = 'recommendations-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} not found`);
      return;
    }
    
    try {
      // Mostrar loading
      this.showLoadingState(container);
      
      // Obtener recomendaciones
      const result = await this.fetchRecommendations({ count: 6 });
      const recommendations = result.recommendations || [];
      
      // Crear elementos de UI
      const recommendationElements = recommendations.map(rec => 
        this.createRecommendationCard(rec)
      );
      
      // Actualizar contenedor
      this.updateRecommendationsContainer(container, recommendationElements, result.metadata);
      
      // Setup event listeners
      this.setupRecommendationInteractions(container);
      
    } catch (error) {
      console.error('Error displaying recommendations:', error);
      this.showErrorState(container);
    }
  }

  createRecommendationCard(recommendation) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.dataset.recommendationId = recommendation.id;
    card.dataset.category = recommendation.category;
    
    // Crear estrellas de score
    const starsHtml = this.createStarsHTML(recommendation.personalizedScore || 0.5);
    
    card.innerHTML = `
      <div class="recommendation-card-inner">
        <div class="recommendation-thumbnail">
          <img src="${recommendation.thumbnail || '/assets/img/default-thumb.jpg'}" 
               alt="${recommendation.title}" 
               loading="lazy">
          <div class="recommendation-score">
            ${starsHtml}
          </div>
        </div>
        
        <div class="recommendation-content">
          <h3 class="recommendation-title">${recommendation.title}</h3>
          <p class="recommendation-description">${recommendation.description}</p>
          
          <div class="recommendation-meta">
            <span class="recommendation-time">⏱️ ${recommendation.estimatedTime} min</span>
            <span class="recommendation-difficulty ${recommendation.difficultyLevel}">
              ${this.formatDifficulty(recommendation.difficultyLevel)}
            </span>
          </div>
          
          <div class="recommendation-tags">
            ${recommendation.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          
          <div class="recommendation-reason">
            <small>💡 ${recommendation.reason}</small>
          </div>
        </div>
        
        <div class="recommendation-actions">
          <button class="btn-primary recommendation-action" 
                  data-action="engage" 
                  data-recommendation-id="${recommendation.id}">
            ${this.getActionLabel(recommendation.type)}
          </button>
          
          <div class="recommendation-feedback">
            <button class="feedback-btn" data-feedback="like" title="Me gusta">👍</button>
            <button class="feedback-btn" data-feedback="dislike" title="No me gusta">👎</button>
            <button class="feedback-btn" data-feedback="not-interested" title="No me interesa">🚫</button>
          </div>
        </div>
      </div>
    `;
    
    return card;
  }

  createStarsHTML(score) {
    const totalStars = 5;
    const filledStars = Math.round(score * totalStars);
    
    let starsHTML = '';
    for (let i = 1; i <= totalStars; i++) {
      starsHTML += `<span class="star ${i <= filledStars ? 'filled' : ''}">${i <= filledStars ? '★' : '☆'}</span>`;
    }
    
    return `<div class="stars-container">${starsHTML}</div>`;
  }

  formatDifficulty(level) {
    const labels = {
      beginner: '🟢 Principiante',
      intermediate: '🟡 Intermedio',
      advanced: '🔴 Avanzado'
    };
    return labels[level] || level;
  }

  getActionLabel(type) {
    const labels = {
      interactive: 'Comenzar Experiencia',
      form: 'Completar Formulario',
      quiz: 'Tomar Quiz',
      social: 'Explorar',
      default: 'Ver Más'
    };
    return labels[type] || labels.default;
  }

  setupRecommendationInteractions(container) {
    // Event delegation para manejar clicks
    container.addEventListener('click', (event) => {
      const card = event.target.closest('.recommendation-card');
      if (!card) return;
      
      const recommendationId = card.dataset.recommendationId;
      
      if (event.target.matches('.recommendation-action')) {
        this.handleRecommendationEngagement(recommendationId, 'click');
      } else if (event.target.matches('.feedback-btn')) {
        const feedback = event.target.dataset.feedback;
        this.handleRecommendationFeedback(recommendationId, feedback);
      }
    });
    
    // Tracking de impresiones
    this.setupImpressionTracking(container);
  }

  setupImpressionTracking(container) {
    // Usar Intersection Observer para tracking de impresiones
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const recommendationId = entry.target.dataset.recommendationId;
            this.trackRecommendationImpression(recommendationId);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    container.querySelectorAll('.recommendation-card').forEach(card => {
      observer.observe(card);
    });
  }

  /**
   * =====================================
   * 📊 TRACKING Y MÉTRICAS ML
   * =====================================
   */

  setupMLDataCollection() {
    this.mlDataCollector = {
      trackInteraction: this.trackMLInteraction.bind(this),
      trackConversion: this.trackMLConversion.bind(this),
      collectSessionData: this.collectSessionData.bind(this),
      exportMLData: this.exportMLData.bind(this)
    };
    
    // Iniciar recolección automática
    this.startMLDataCollection();
  }

  trackMLInteraction(type, data) {
    const interaction = {
      timestamp: Date.now(),
      userId: this.userProfile.userId,
      type: type,
      data: data,
      context: this.getCurrentContext(),
      sessionId: this.getCurrentSessionId()
    };
    
    this.mlMetrics.interactions.push(interaction);
    
    // Mantener solo las últimas 1000 interacciones
    if (this.mlMetrics.interactions.length > 1000) {
      this.mlMetrics.interactions = this.mlMetrics.interactions.slice(-1000);
    }
    
    // Actualizar perfil de usuario en tiempo real
    this.updateUserProfileFromInteraction(interaction);
  }

  trackMLConversion(recommendationId, conversionType) {
    const conversion = {
      timestamp: Date.now(),
      userId: this.userProfile.userId,
      recommendationId: recommendationId,
      conversionType: conversionType,
      context: this.getCurrentContext(),
      sessionId: this.getCurrentSessionId()
    };
    
    this.mlMetrics.conversionEvents.push(conversion);
    
    // Registrar conversión exitosa
    this.recordSuccessfulRecommendation(recommendationId);
  }

  collectSessionData() {
    const sessionData = {
      sessionId: this.getCurrentSessionId(),
      userId: this.userProfile.userId,
      startTime: this.getSessionStartTime(),
      endTime: Date.now(),
      totalInteractions: this.getSessionInteractionCount(),
      pagesVisited: this.getSessionPages(),
      conversionEvents: this.getSessionConversions(),
      deviceInfo: this.getDeviceInfo(),
      engagementScore: this.calculateSessionEngagement()
    };
    
    this.mlMetrics.sessionData.push(sessionData);
    return sessionData;
  }

  extractFeatureVector() {
    // Extraer vector de características para ML
    const metrics = this.userProfile.behaviorMetrics;
    const context = this.userProfile.contextualFactors;
    
    const features = [
      // Características de comportamiento
      metrics.engagementScore || 0,
      Array.from(metrics.clickFrequency.values()).reduce((a, b) => a + b, 0) / 100,
      Array.from(metrics.timeSpent.values()).reduce((a, b) => a + b, 0) / 3600000,
      metrics.sessionDepth.length > 0 ? metrics.sessionDepth.reduce((a, b) => a + b, 0) / metrics.sessionDepth.length : 0,
      
      // Características contextuales
      context.deviceUsage.size,
      context.timeOfDayActivity.size,
      context.sessionLength.length > 0 ? context.sessionLength.reduce((a, b) => a + b, 0) / context.sessionLength.length : 0,
      
      // Características de preferencias
      this.userProfile.preferences.categories.size,
      this.userProfile.preferences.contentTypes.size,
      
      // Características temporales
      this.getDaysSinceFirstVisit(),
      this.getVisitFrequency(),
      this.getActiveHours()
    ];
    
    this.userProfile.mlFeatures.featureVector = features;
    return features;
  }

  exportMLData() {
    // Exportar datos para entrenamiento de ML
    const mlData = {
      user: {
        id: this.userProfile.userId,
        profile: this.serializeProfileForML(),
        featureVector: this.extractFeatureVector()
      },
      interactions: this.mlMetrics.interactions,
      sessions: this.mlMetrics.sessionData,
      conversions: this.mlMetrics.conversionEvents,
      metadata: {
        exportTimestamp: Date.now(),
        version: this.version,
        dataQuality: this.assessDataQuality()
      }
    };
    
    return mlData;
  }

  /**
   * =====================================
   * 🔧 UTILIDADES Y HELPERS
   * =====================================
   */

  getCurrentContext() {
    return {
      timestamp: Date.now(),
      page: window.location.pathname,
      referrer: document.referrer,
      deviceType: this.getDeviceType(),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      sessionId: this.getCurrentSessionId(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language
    };
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  getCurrentSessionId() {
    let sessionId = sessionStorage.getItem('coomunity_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('coomunity_session_id', sessionId);
    }
    return sessionId;
  }

  simulateNetworkDelay() {
    return new Promise(resolve => {
      const delay = Math.random() * 1000 + 500; // 500-1500ms
      setTimeout(resolve, delay);
    });
  }

  saveProfile() {
    try {
      // Convertir Maps a objetos para serialización
      const serializable = this.serializeProfileForStorage();
      localStorage.setItem('coomunity_enhanced_profile', JSON.stringify(serializable));
    } catch (error) {
      console.error('Error saving enhanced profile:', error);
    }
  }

  serializeProfileForStorage() {
    const serializable = { ...this.userProfile };
    
    // Convertir Maps a objetos
    Object.keys(serializable).forEach(section => {
      if (typeof serializable[section] === 'object') {
        Object.keys(serializable[section]).forEach(key => {
          if (serializable[section][key] instanceof Map) {
            serializable[section][key] = Object.fromEntries(serializable[section][key]);
          }
        });
      }
    });
    
    return serializable;
  }

  /**
   * =====================================
   * 🎮 API PÚBLICA
   * =====================================
   */

  // Métodos públicos para integración
  async getRecommendations(options) {
    return this.generateRecommendations(options);
  }

  trackUserInteraction(element, interactionType) {
    this.trackMLInteraction('user_interaction', {
      element: this.getElementSelector(element),
      type: interactionType,
      page: window.location.pathname
    });
  }

  provideFeedback(recommendationId, feedback) {
    this.handleRecommendationFeedback(recommendationId, feedback);
  }

  getUserInsights() {
    return {
      engagementLevel: this.calculateUserEngagement(),
      topCategories: this.getTopCategories(),
      personalityProfile: this.userProfile.mlFeatures.personalityProfile,
      predictedInterests: this.userProfile.mlFeatures.predictedInterests,
      recommendations: this.getSuggestions()
    };
  }

  // Cleanup y destructor
  destroy() {
    // Guardar datos antes de destruir
    this.saveProfile();
    
    // Limpiar intervals y observers
    if (this.recommendationLoop) {
      clearInterval(this.recommendationLoop);
    }
    
    console.log('🤖 Enhanced Recommendation Manager destroyed');
  }
}

// Inicialización automática si está en el DOM
if (typeof window !== 'undefined') {
  window.EnhancedRecommendationManager = EnhancedRecommendationManager;
  
  // Auto-inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.enhancedRecommendationManager = new EnhancedRecommendationManager();
    });
  } else {
    window.enhancedRecommendationManager = new EnhancedRecommendationManager();
  }
}

// Implementación de métodos faltantes (continuación...)

// Extender la clase con métodos auxiliares
EnhancedRecommendationManager.prototype.handleRecommendationEngagement = function(recommendationId, action) {
  // Registrar engagement
  this.trackMLInteraction('recommendation_engagement', {
    recommendationId,
    action,
    timestamp: Date.now()
  });
  
  // Actualizar scoring
  const currentScore = this.userProfile.behaviorMetrics.clickFrequency.get(recommendationId) || 0;
  this.userProfile.behaviorMetrics.clickFrequency.set(recommendationId, currentScore + 1);
  
  // Disparar conversión
  this.trackMLConversion(recommendationId, 'engagement');
  
  console.log(`🎯 Recommendation engagement tracked: ${recommendationId} - ${action}`);
};

EnhancedRecommendationManager.prototype.handleRecommendationFeedback = function(recommendationId, feedback) {
  // Registrar feedback
  this.trackMLInteraction('recommendation_feedback', {
    recommendationId,
    feedback,
    timestamp: Date.now()
  });
  
  // Ajustar perfil basado en feedback
  this.adjustProfileFromFeedback(recommendationId, feedback);
  
  console.log(`📝 Recommendation feedback recorded: ${recommendationId} - ${feedback}`);
};

EnhancedRecommendationManager.prototype.startRecommendationLoop = function() {
  // Loop principal de recomendaciones
  this.recommendationLoop = setInterval(() => {
    this.updateUserEngagement();
    this.saveProfile();
    
    // Limpiar cache expirado
    this.cleanExpiredCache();
    
    // Recolectar datos de sesión
    if (Math.random() < 0.1) { // 10% de probabilidad
      this.collectSessionData();
    }
  }, 30000); // Cada 30 segundos
};

// Export para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedRecommendationManager;
} 