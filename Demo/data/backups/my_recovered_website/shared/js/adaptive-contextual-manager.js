/**
 * ========================================================================
 * 🧠 ADAPTIVE & CONTEXTUAL MANAGER - HEURÍSTICA UX 16
 * ========================================================================
 * 
 * Gestiona la experiencia adaptativa y contextual
 * 
 * Funcionalidades:
 * - Personalización inteligente basada en comportamiento
 * - Adaptación contextual de la interfaz
 * - Aprendizaje automático de preferencias
 * - Contenido dinámico y relevante
 * - Adaptación multi-dispositivo
 * - Inteligencia ambiental
 * - Recomendaciones contextuales
 * - Experiencias evolutivas
 * 
 * ========================================================================
 */

class AdaptiveContextualManager {
  constructor() {
    this.userProfile = {
      personalizationLevel: 1, // 0-4: none, basic, moderate, advanced, expert
      preferences: {},
      behaviorPatterns: {},
      usageHistory: [],
      contextualData: {},
      learningProgress: {}
    };
    
    this.contextualData = {
      timeOfDay: '',
      location: null,
      device: {},
      connection: {},
      battery: {},
      lighting: '',
      usage: {}
    };
    
    this.adaptationRules = new Map();
    this.contextualActions = new Map();
    this.learningTriggers = new Set();
    this.personalizedElements = new Set();
    this.contextObservers = new Map();
    this.adaptationQueue = [];
    this.smartSuggestions = [];
    this.relevanceScores = new Map();
    
    this.init();
  }

  /**
   * Inicializa el sistema adaptativo y contextual
   */
  init() {
    this.loadUserProfile();
    this.setupContextDetection();
    this.setupBehaviorTracking();
    this.setupEnvironmentalAdaptation();
    this.setupPersonalizationEngine();
    this.setupLearningSystem();
    this.setupContextualInterface();
    this.setupMobileNavigation();
    this.startAdaptationLoop();
    
    console.log('🧠 Adaptive & Contextual Manager initialized');
  }

  /**
   * =====================================
   * 👤 USER PROFILE & PERSONALIZATION
   * =====================================
   */

  loadUserProfile() {
    // Cargar perfil desde localStorage
    const savedProfile = localStorage.getItem('coomunity_user_profile');
    if (savedProfile) {
      try {
        this.userProfile = { ...this.userProfile, ...JSON.parse(savedProfile) };
      } catch (e) {
        console.warn('Error loading user profile:', e);
      }
    }
    
    // Detectar nivel inicial basado en actividad
    this.detectInitialPersonalizationLevel();
    
    // Aplicar personalización inicial
    this.applyPersonalizationLevel();
  }

  saveUserProfile() {
    try {
      localStorage.setItem('coomunity_user_profile', JSON.stringify(this.userProfile));
    } catch (e) {
      console.warn('Error saving user profile:', e);
    }
  }

  detectInitialPersonalizationLevel() {
    const visits = localStorage.getItem('coomunity_visit_count') || 0;
    const actions = localStorage.getItem('coomunity_action_count') || 0;
    const timeSpent = localStorage.getItem('coomunity_time_spent') || 0;
    
    let level = 0;
    
    if (visits > 1) level = 1; // Basic
    if (visits > 5 && actions > 20) level = 2; // Moderate
    if (visits > 10 && actions > 50 && timeSpent > 3600) level = 3; // Advanced
    if (visits > 20 && actions > 100) level = 4; // Expert
    
    this.userProfile.personalizationLevel = Math.max(this.userProfile.personalizationLevel, level);
  }

  applyPersonalizationLevel() {
    const level = this.userProfile.personalizationLevel;
    const body = document.body;
    
    // Remover clases previas
    body.classList.remove('personalization-none', 'personalization-basic', 'personalization-moderate', 'personalization-advanced', 'personalization-expert');
    
    // Aplicar clase correspondiente
    const levelClasses = ['none', 'basic', 'moderate', 'advanced', 'expert'];
    body.classList.add(`personalization-${levelClasses[level]}`);
    
    // Aplicar adaptaciones específicas
    this.adaptInterfaceForLevel(level);
    
    console.log(`🎯 Personalization level applied: ${levelClasses[level]}`);
  }

  adaptInterfaceForLevel(level) {
    const adaptations = {
      0: () => this.applyBasicInterface(),
      1: () => this.applyBasicPersonalization(),
      2: () => this.applyModeratePersonalization(),
      3: () => this.applyAdvancedPersonalization(),
      4: () => this.applyExpertPersonalization()
    };
    
    if (adaptations[level]) {
      adaptations[level]();
    }
  }

  applyBasicInterface() {
    // Interfaz simple y directa
    this.setDensity('normal');
    this.setAnimationSpeed('normal');
    this.hideAdvancedFeatures();
  }

  applyBasicPersonalization() {
    // Personalización mínima
    this.setDensity('normal');
    this.setAnimationSpeed('normal');
    this.showBasicHints();
  }

  applyModeratePersonalization() {
    // Personalización moderada
    this.setDensity('comfortable');
    this.setAnimationSpeed('fast');
    this.showContextualHints();
    this.enableSmartSuggestions();
  }

  applyAdvancedPersonalization() {
    // Personalización avanzada
    this.setDensity('comfortable');
    this.setAnimationSpeed('fast');
    this.showContextualHints();
    this.enableSmartSuggestions();
    this.enableAdvancedFeatures();
    this.showUsagePatterns();
  }

  applyExpertPersonalization() {
    // Personalización experta
    this.setDensity('compact');
    this.setAnimationSpeed('instant');
    this.enablePowerUserFeatures();
    this.showKeyboardShortcuts();
    this.enableAdvancedControls();
  }

  /**
   * =====================================
   * 🌍 CONTEXT DETECTION
   * =====================================
   */

  setupContextDetection() {
    // Detectar contexto temporal
    this.detectTimeContext();
    setInterval(() => this.detectTimeContext(), 60000); // Cada minuto
    
    // Detectar contexto de dispositivo
    this.detectDeviceContext();
    
    // Detectar contexto de red
    this.detectNetworkContext();
    
    // Detectar contexto de batería
    this.detectBatteryContext();
    
    // Detectar contexto de ubicación (si permitido)
    this.detectLocationContext();
    
    // Observar cambios de contexto
    this.setupContextObservers();
  }

  detectTimeContext() {
    const hour = new Date().getHours();
    let timeContext = '';
    
    if (hour >= 6 && hour < 12) timeContext = 'morning';
    else if (hour >= 12 && hour < 18) timeContext = 'afternoon';
    else if (hour >= 18 && hour < 22) timeContext = 'evening';
    else timeContext = 'night';
    
    if (this.contextualData.timeOfDay !== timeContext) {
      this.contextualData.timeOfDay = timeContext;
      this.applyTimeBasedAdaptations(timeContext);
    }
  }

  detectDeviceContext() {
    this.contextualData.device = {
      type: this.getDeviceType(),
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio || 1
      },
      orientation: screen.orientation?.type || 'unknown',
      touchCapable: 'ontouchstart' in window,
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown'
    };
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    if (width < 1440) return 'desktop';
    return 'large-screen';
  }

  detectNetworkContext() {
    if ('connection' in navigator) {
      this.contextualData.connection = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
      
      this.applyNetworkAdaptations();
    }
  }

  detectBatteryContext() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        this.contextualData.battery = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
        
        this.applyBatteryAdaptations();
        
        // Observar cambios de batería
        battery.addEventListener('levelchange', () => this.detectBatteryContext());
        battery.addEventListener('chargingchange', () => this.detectBatteryContext());
      });
    }
  }

  detectLocationContext() {
    if ('geolocation' in navigator && this.userProfile.preferences.allowLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.contextualData.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        this.applyLocationBasedAdaptations();
      });
    }
  }

  setupContextObservers() {
    // Observar cambios de orientación
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.detectDeviceContext(), 100);
    });
    
    // Observar cambios de red
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => this.detectNetworkContext());
    }
    
    // Observar cambios de visibilidad
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
    
    // Observar cambios de tamaño de ventana
    window.addEventListener('resize', this.debounce(() => {
      this.detectDeviceContext();
      this.adaptToScreenSize();
    }, 250));
  }

  /**
   * =====================================
   * 📊 BEHAVIOR TRACKING & LEARNING
   * =====================================
   */

  setupBehaviorTracking() {
    // Trackear clics y interacciones
    document.addEventListener('click', (e) => this.trackInteraction(e));
    
    // Trackear navegación
    this.trackPageNavigation();
    
    // Trackear tiempo de permanencia
    this.trackTimeSpent();
    
    // Trackear patrones de scroll
    this.trackScrollPatterns();
    
    // Trackear uso de features
    this.trackFeatureUsage();
  }

  trackInteraction(event) {
    const element = event.target;
    const interaction = {
      timestamp: Date.now(),
      element: this.getElementSelector(element),
      type: 'click',
      context: {
        page: window.location.pathname,
        timeOfDay: this.contextualData.timeOfDay,
        device: this.contextualData.device.type
      }
    };
    
    this.userProfile.usageHistory.push(interaction);
    this.updateBehaviorPatterns(interaction);
    this.limitHistorySize();
  }

  trackPageNavigation() {
    // Trackear página actual
    const pageView = {
      timestamp: Date.now(),
      page: window.location.pathname,
      referrer: document.referrer,
      timeOfDay: this.contextualData.timeOfDay
    };
    
    this.userProfile.usageHistory.push(pageView);
    this.updatePageFrequency(window.location.pathname);
  }

  trackTimeSpent() {
    this.sessionStart = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeSpent = Date.now() - this.sessionStart;
      const currentTime = parseInt(localStorage.getItem('coomunity_time_spent') || '0');
      localStorage.setItem('coomunity_time_spent', (currentTime + timeSpent).toString());
    });
  }

  trackScrollPatterns() {
    let scrollData = { depth: 0, speed: 0, lastPosition: 0, lastTime: Date.now() };
    
    window.addEventListener('scroll', this.throttle(() => {
      const currentPosition = window.scrollY;
      const currentTime = Date.now();
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      scrollData.depth = Math.max(scrollData.depth, (currentPosition + windowHeight) / documentHeight);
      scrollData.speed = Math.abs(currentPosition - scrollData.lastPosition) / (currentTime - scrollData.lastTime);
      scrollData.lastPosition = currentPosition;
      scrollData.lastTime = currentTime;
      
      this.userProfile.behaviorPatterns.scrollDepth = scrollData.depth;
      this.userProfile.behaviorPatterns.scrollSpeed = scrollData.speed;
    }, 100));
  }

  trackFeatureUsage() {
    // Trackear uso de features específicas
    const features = ['search', 'navigation', 'help', 'shortcuts'];
    
    features.forEach(feature => {
      document.addEventListener(`${feature}-used`, () => {
        this.incrementFeatureUsage(feature);
      });
    });
  }

  updateBehaviorPatterns(interaction) {
    const patterns = this.userProfile.behaviorPatterns;
    
    // Actualizar frecuencia de elementos
    const element = interaction.element;
    patterns.elementFrequency = patterns.elementFrequency || {};
    patterns.elementFrequency[element] = (patterns.elementFrequency[element] || 0) + 1;
    
    // Actualizar patrones temporales
    patterns.timePatterns = patterns.timePatterns || {};
    patterns.timePatterns[interaction.context.timeOfDay] = (patterns.timePatterns[interaction.context.timeOfDay] || 0) + 1;
    
    // Actualizar patrones de dispositivo
    patterns.devicePatterns = patterns.devicePatterns || {};
    patterns.devicePatterns[interaction.context.device] = (patterns.devicePatterns[interaction.context.device] || 0) + 1;
  }

  updatePageFrequency(page) {
    const patterns = this.userProfile.behaviorPatterns;
    patterns.pageFrequency = patterns.pageFrequency || {};
    patterns.pageFrequency[page] = (patterns.pageFrequency[page] || 0) + 1;
  }

  incrementFeatureUsage(feature) {
    const patterns = this.userProfile.behaviorPatterns;
    patterns.featureUsage = patterns.featureUsage || {};
    patterns.featureUsage[feature] = (patterns.featureUsage[feature] || 0) + 1;
    
    // Trigger learning update
    this.updatePersonalizationLevel();
  }

  /**
   * =====================================
   * 🎯 SMART RECOMMENDATIONS
   * =====================================
   */

  setupLearningSystem() {
    // Generar recomendaciones basadas en comportamiento
    setInterval(() => this.generateSmartSuggestions(), 30000); // Cada 30 segundos
    
    // Actualizar scores de relevancia
    setInterval(() => this.updateRelevanceScores(), 60000); // Cada minuto
    
    // Evaluar progreso de personalización
    setInterval(() => this.evaluatePersonalizationProgress(), 300000); // Cada 5 minutos
  }

  generateSmartSuggestions() {
    this.smartSuggestions = [];
    
    // Sugerencias basadas en frecuencia de páginas
    this.addPageFrequencySuggestions();
    
    // Sugerencias basadas en tiempo
    this.addTimeBasedSuggestions();
    
    // Sugerencias basadas en contexto
    this.addContextualSuggestions();
    
    // Sugerencias de nuevas features
    this.addFeatureDiscoverySuggestions();
    
    // Mostrar sugerencias si el nivel de personalización lo permite
    if (this.userProfile.personalizationLevel >= 2) {
      this.displaySmartSuggestions();
    }
  }

  addPageFrequencySuggestions() {
    const pageFreq = this.userProfile.behaviorPatterns.pageFrequency || {};
    const sortedPages = Object.entries(pageFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    sortedPages.forEach(([page, frequency]) => {
      if (window.location.pathname !== page && frequency > 2) {
        this.smartSuggestions.push({
          type: 'navigation',
          title: `Volver a ${this.getPageTitle(page)}`,
          description: `Has visitado esta página ${frequency} veces`,
          action: () => window.location.href = page,
          relevance: frequency * 0.1,
          icon: '🔄'
        });
      }
    });
  }

  addTimeBasedSuggestions() {
    const timeOfDay = this.contextualData.timeOfDay;
    const timePatterns = this.userProfile.behaviorPatterns.timePatterns || {};
    
    const suggestions = {
      morning: [
        { title: 'Revisar actualizaciones', description: 'Comienza el día al día', icon: '🌅' },
        { title: 'Planificar actividades', description: 'Organiza tu jornada', icon: '📋' }
      ],
      afternoon: [
        { title: 'Revisar progreso', description: 'Ve tu avance del día', icon: '📊' },
        { title: 'Colaborar con otros', description: 'Conecta con la comunidad', icon: '🤝' }
      ],
      evening: [
        { title: 'Revisar resumen del día', description: 'Repasa lo logrado', icon: '📝' },
        { title: 'Explorar contenido nuevo', description: 'Descubre novedades', icon: '🔍' }
      ],
      night: [
        { title: 'Modo nocturno', description: 'Activa el tema oscuro', icon: '🌙' },
        { title: 'Guardar progreso', description: 'Asegura tus cambios', icon: '💾' }
      ]
    };
    
    if (suggestions[timeOfDay]) {
      suggestions[timeOfDay].forEach(suggestion => {
        this.smartSuggestions.push({
          type: 'contextual',
          ...suggestion,
          relevance: 0.7,
          action: () => this.executeContextualAction(suggestion.title)
        });
      });
    }
  }

  addContextualSuggestions() {
    const device = this.contextualData.device.type;
    const connection = this.contextualData.connection;
    
    if (device === 'mobile') {
      this.smartSuggestions.push({
        type: 'optimization',
        title: 'Optimizar para móvil',
        description: 'Activa el modo móvil optimizado',
        icon: '📱',
        relevance: 0.8,
        action: () => this.enableMobileOptimizations()
      });
    }
    
    if (connection && connection.effectiveType === 'slow-2g') {
      this.smartSuggestions.push({
        type: 'optimization',
        title: 'Modo conexión lenta',
        description: 'Reduce el uso de datos',
        icon: '🐌',
        relevance: 0.9,
        action: () => this.enableDataSaverMode()
      });
    }
  }

  addFeatureDiscoverySuggestions() {
    const usedFeatures = Object.keys(this.userProfile.behaviorPatterns.featureUsage || {});
    const allFeatures = ['search', 'shortcuts', 'help', 'themes', 'accessibility'];
    const unusedFeatures = allFeatures.filter(f => !usedFeatures.includes(f));
    
    if (unusedFeatures.length > 0 && this.userProfile.personalizationLevel >= 2) {
      const feature = unusedFeatures[Math.floor(Math.random() * unusedFeatures.length)];
      
      const featureInfo = {
        search: { title: 'Búsqueda avanzada', description: 'Encuentra contenido rápidamente', icon: '🔍' },
        shortcuts: { title: 'Atajos de teclado', description: 'Navega más rápido', icon: '⌨️' },
        help: { title: 'Sistema de ayuda', description: 'Obtén asistencia contextual', icon: '❓' },
        themes: { title: 'Personalizar tema', description: 'Cambia la apariencia', icon: '🎨' },
        accessibility: { title: 'Opciones de accesibilidad', description: 'Mejora tu experiencia', icon: '♿' }
      };
      
      if (featureInfo[feature]) {
        this.smartSuggestions.push({
          type: 'discovery',
          ...featureInfo[feature],
          relevance: 0.6,
          action: () => this.introduceFeature(feature)
        });
      }
    }
  }

  displaySmartSuggestions() {
    // Buscar o crear contenedor de sugerencias
    let container = document.querySelector('.smart-suggestions');
    if (!container) {
      container = this.createSuggestionsContainer();
    }
    
    // Limpiar sugerencias anteriores
    const suggestionsList = container.querySelector('.suggestion-list');
    suggestionsList.innerHTML = '';
    
    // Ordenar por relevancia y mostrar las top 3
    const topSuggestions = this.smartSuggestions
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 3);
    
    if (topSuggestions.length === 0) {
      container.style.display = 'none';
      return;
    }
    
    topSuggestions.forEach(suggestion => {
      const suggestionElement = this.createSuggestionElement(suggestion);
      suggestionsList.appendChild(suggestionElement);
    });
    
    container.style.display = 'block';
  }

  createSuggestionsContainer() {
    const container = document.createElement('div');
    container.className = 'smart-suggestions';
    container.innerHTML = `
      <div class="suggestion-header">
        <span>Sugerencias para ti</span>
        <button class="suggestion-close" onclick="this.parentElement.parentElement.style.display='none'">×</button>
      </div>
      <div class="suggestion-list"></div>
    `;
    
    // Insertar después del header principal
    const main = document.querySelector('main');
    if (main) {
      main.insertBefore(container, main.firstChild);
    }
    
    return container;
  }

  createSuggestionElement(suggestion) {
    const element = document.createElement('a');
    element.href = '#';
    element.className = 'suggestion-item';
    element.innerHTML = `
      <span class="suggestion-icon">${suggestion.icon}</span>
      <div class="suggestion-content">
        <div class="suggestion-title">${suggestion.title}</div>
        <div class="suggestion-description">${suggestion.description}</div>
      </div>
    `;
    
    element.addEventListener('click', (e) => {
      e.preventDefault();
      suggestion.action();
      this.trackSuggestionClick(suggestion);
    });
    
    return element;
  }

  /**
   * =====================================
   * 🔄 ADAPTIVE INTERFACE UPDATES
   * =====================================
   */

  setupContextualInterface() {
    // Aplicar indicadores de contexto
    this.applyContextualIndicators();
    
    // Configurar navegación adaptativa
    this.setupAdaptiveNavigation();
    
    // Configurar controles adaptativos
    this.setupAdaptiveControls();
    
    // Aplicar scores de relevancia iniciales
    this.updateRelevanceScores();
  }

  applyContextualIndicators() {
    const cards = document.querySelectorAll('.contextual-card, .minimalist-card');
    
    cards.forEach(card => {
      const cardData = this.getCardData(card);
      
      // Aplicar indicador de contexto
      this.addContextIndicator(card, cardData);
      
      // Aplicar clase de prioridad
      this.applyPriorityClass(card, cardData);
      
      // Añadir acciones contextuales
      this.addContextualActions(card, cardData);
    });
  }

  setupAdaptiveNavigation() {
    const navItems = document.querySelectorAll('.adaptive-nav-item, .minimalist-nav-link');
    
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      const frequency = this.getPageFrequency(href);
      const recency = this.getPageRecency(href);
      
      // Aplicar clases según uso
      if (frequency > 5) {
        item.classList.add('frequently-used');
        this.addUsageIndicator(item, frequency);
      }
      
      if (recency < 86400000) { // Menos de 24 horas
        item.classList.add('recently-used');
      }
      
      // Añadir recomendaciones
      if (this.shouldRecommendPage(href)) {
        item.classList.add('recommended');
      }
    });
  }

  setupAdaptiveControls() {
    // Crear panel de controles adaptativos si no existe
    if (!document.querySelector('.adaptive-controls')) {
      this.createAdaptiveControlsPanel();
    }
  }

  createAdaptiveControlsPanel() {
    const panel = document.createElement('div');
    panel.className = 'adaptive-controls';
    panel.innerHTML = `
      <button class="adaptive-control density-control" title="Cambiar densidad" onclick="window.adaptiveContextualManager?.cycleDensity()">
        <span>⬚</span>
      </button>
      <button class="adaptive-control theme-control" title="Cambiar tema" onclick="window.adaptiveContextualManager?.cycleTheme()">
        <span>🎨</span>
      </button>
      <button class="adaptive-control personalization-control" title="Nivel de personalización" onclick="window.adaptiveContextualManager?.adjustPersonalization()">
        <span>🎯</span>
      </button>
    `;
    
    document.body.appendChild(panel);
  }

  /**
   * =====================================
   * 🎛️ ADAPTIVE ACTIONS & CONTROLS
   * =====================================
   */

  cycleDensity() {
    const densityLevels = ['compact', 'normal', 'comfortable', 'spacious'];
    const currentDensity = document.body.dataset.density || 'normal';
    const currentIndex = densityLevels.indexOf(currentDensity);
    const nextIndex = (currentIndex + 1) % densityLevels.length;
    const newDensity = densityLevels[nextIndex];
    
    this.setDensity(newDensity);
    
    // Track del cambio
    this.trackInteraction({
      type: 'density_change',
      from: currentDensity,
      to: newDensity,
      timestamp: Date.now()
    });
    
    console.log(`🎛️ Density changed from ${currentDensity} to ${newDensity}`);
  }

  setDensity(density) {
    const validDensities = ['compact', 'normal', 'comfortable', 'spacious'];
    if (!validDensities.includes(density)) {
      console.warn(`Invalid density level: ${density}`);
      return;
    }
    
    const body = document.body;
    
    // Remover clases de densidad previas
    validDensities.forEach(d => {
      body.classList.remove(`density-${d}`);
    });
    
    // Aplicar nueva densidad
    body.classList.add(`density-${density}`);
    body.dataset.density = density;
    
    // Actualizar variables CSS personalizadas
    const densityFactors = {
      compact: 0.75,
      normal: 1,
      comfortable: 1.25,
      spacious: 1.5
    };
    
    const factor = densityFactors[density];
    document.documentElement.style.setProperty('--current-density', factor);
    
    // Actualizar elementos adaptativos
    this.updateAdaptiveElementsForDensity(density, factor);
    
    // Guardar preferencia
    this.userProfile.preferences.density = density;
    this.saveUserProfile();
    
    // Mostrar notificación
    this.showNotification(`Densidad cambiada a: ${density}`, 'info');
    
    console.log(`🎛️ Density set to: ${density} (factor: ${factor})`);
  }

  updateAdaptiveElementsForDensity(density, factor) {
    // Actualizar padding/margin de elementos adaptativos
    const adaptiveElements = document.querySelectorAll('.adaptive-container, .adaptive-grid, .contextual-card');
    
    adaptiveElements.forEach(element => {
      // Aplicar factor de densidad a espaciado
      const baseSpacing = parseInt(getComputedStyle(element).getPropertyValue('--spacing-base') || '16');
      const newSpacing = Math.round(baseSpacing * factor);
      
      element.style.setProperty('--computed-spacing', `${newSpacing}px`);
    });
    
    // Actualizar controles adaptativos
    const densityControl = document.querySelector('[data-adaptive-control="density"]');
    if (densityControl) {
      densityControl.setAttribute('data-current-density', density);
      densityControl.setAttribute('aria-label', `Densidad actual: ${density}. Clic para cambiar`);
    }
  }

  cycleTheme() {
    const themes = ['auto', 'light', 'dark'];
    const current = this.userProfile.preferences.theme || 'auto';
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    this.setTheme(nextTheme);
    this.userProfile.preferences.theme = nextTheme;
    this.saveUserProfile();
    
    this.showNotification(`Tema cambiado a: ${nextTheme}`, 'info');
  }

  setTheme(theme) {
    const html = document.documentElement;
    html.classList.remove('theme-auto', 'theme-light', 'theme-dark');
    html.classList.add(`theme-${theme}`);
    
    if (theme === 'auto') {
      const hour = new Date().getHours();
      const isDark = hour < 6 || hour > 20;
      html.classList.toggle('auto-dark-mode', isDark);
    }
  }

  adjustPersonalization() {
    const currentLevel = this.userProfile.personalizationLevel;
    const nextLevel = currentLevel < 4 ? currentLevel + 1 : 0;
    
    this.userProfile.personalizationLevel = nextLevel;
    this.applyPersonalizationLevel();
    this.saveUserProfile();
    
    const levelNames = ['Ninguna', 'Básica', 'Moderada', 'Avanzada', 'Experta'];
    this.showNotification(`Personalización: ${levelNames[nextLevel]}`, 'info');
  }

  setAnimationSpeed(speed) {
    const speedValues = {
      instant: 0,
      fast: 150,
      normal: 300,
      slow: 500
    };
    
    document.documentElement.style.setProperty('--current-animations', `${speedValues[speed]}ms`);
  }

  /**
   * =====================================
   * 🌍 ENVIRONMENTAL ADAPTATIONS
   * =====================================
   */

  setupEnvironmentalAdaptation() {
    // Adaptación a tiempo
    this.applyTimeBasedAdaptations(this.contextualData.timeOfDay);
    
    // Adaptación a batería
    this.applyBatteryAdaptations();
    
    // Adaptación a red
    this.applyNetworkAdaptations();
    
    // Observar cambios de preferencias del sistema
    this.observeSystemPreferences();
  }

  applyTimeBasedAdaptations(timeOfDay) {
    const body = document.body;
    body.classList.remove('time-morning', 'time-afternoon', 'time-evening', 'time-night');
    body.classList.add(`time-${timeOfDay}`);
    
    // Ajustar tema automáticamente si está configurado
    if (this.userProfile.preferences.theme === 'auto') {
      this.setTheme('auto');
    }
  }

  applyBatteryAdaptations() {
    const battery = this.contextualData.battery;
    if (!battery) return;
    
    const body = document.body;
    
    if (battery.level < 0.2 && !battery.charging) {
      body.classList.add('battery-low');
      this.showNotification('Modo de ahorro de batería activado', 'warning');
    } else {
      body.classList.remove('battery-low');
    }
  }

  applyNetworkAdaptations() {
    const connection = this.contextualData.connection;
    if (!connection) return;
    
    const body = document.body;
    body.classList.remove('connection-slow', 'connection-fast');
    
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      body.classList.add('connection-slow');
    } else {
      body.classList.add('connection-fast');
    }
  }

  observeSystemPreferences() {
    // Observar cambios en preferencias de movimiento reducido
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMediaQuery.addListener(() => this.handleReducedMotionChange());
    
    // Observar cambios en preferencias de contraste
    const contrastMediaQuery = window.matchMedia('(prefers-contrast: high)');
    contrastMediaQuery.addListener(() => this.handleContrastChange());
    
    // Observar cambios en esquema de color
    const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeMediaQuery.addListener(() => this.handleColorSchemeChange());
  }

  /**
   * =====================================
   * 📊 RELEVANCE & SCORING
   * =====================================
   */

  updateRelevanceScores() {
    const elements = document.querySelectorAll('[data-relevant], .contextual-content');
    
    elements.forEach(element => {
      const score = this.calculateRelevanceScore(element);
      this.relevanceScores.set(element, score);
      this.applyRelevanceVisualization(element, score);
    });
  }

  calculateRelevanceScore(element) {
    let score = 0.5; // Base score
    
    // Factor: Frecuencia de interacción
    const selector = this.getElementSelector(element);
    const frequency = this.userProfile.behaviorPatterns.elementFrequency?.[selector] || 0;
    score += Math.min(frequency * 0.1, 0.3);
    
    // Factor: Recencia de uso
    const lastUsed = this.getElementLastUsed(selector);
    if (lastUsed) {
      const daysSince = (Date.now() - lastUsed) / (1000 * 60 * 60 * 24);
      score += Math.max(0.2 - (daysSince * 0.02), 0);
    }
    
    // Factor: Contexto temporal
    const timeRelevance = this.getTimeRelevance(element);
    score += timeRelevance * 0.1;
    
    // Factor: Personalización del usuario
    if (element.dataset.personalizationLevel) {
      const requiredLevel = parseInt(element.dataset.personalizationLevel);
      if (this.userProfile.personalizationLevel >= requiredLevel) {
        score += 0.2;
      } else {
        score -= 0.3;
      }
    }
    
    return Math.max(0, Math.min(1, score));
  }

  applyRelevanceVisualization(element, score) {
    // Remover clases previas
    element.classList.remove('relevant-high', 'relevant-medium', 'relevant-low');
    
    // Aplicar clase según score
    if (score > 0.7) {
      element.classList.add('relevant-high');
    } else if (score > 0.4) {
      element.classList.add('relevant-medium');
    } else {
      element.classList.add('relevant-low');
    }
    
    // Añadir indicador visual de relevancia
    this.addRelevanceIndicator(element, score);
  }

  addRelevanceIndicator(element, score) {
    // Buscar indicador existente
    let indicator = element.querySelector('.relevance-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'relevance-indicator';
      element.appendChild(indicator);
    }
    
    // Crear estrellas según score
    const stars = Math.round(score * 5);
    indicator.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = `relevance-star ${i <= stars ? 'filled' : ''}`;
      indicator.appendChild(star);
    }
  }

  /**
   * =====================================
   * 🔧 UTILITY METHODS
   * =====================================
   */

  startAdaptationLoop() {
    // Loop principal de adaptación
    setInterval(() => {
      this.processAdaptationQueue();
      this.updateContextualData();
      this.evaluateAdaptationTriggers();
    }, 5000); // Cada 5 segundos
  }

  processAdaptationQueue() {
    while (this.adaptationQueue.length > 0) {
      const adaptation = this.adaptationQueue.shift();
      this.executeAdaptation(adaptation);
    }
  }

  executeAdaptation(adaptation) {
    try {
      adaptation.execute();
      console.log(`🔄 Adaptation executed: ${adaptation.type}`);
    } catch (error) {
      console.error('Adaptation execution failed:', error);
    }
  }

  getElementSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  getCardData(card) {
    return {
      id: card.id || '',
      title: card.querySelector('h3, .minimalist-card-title')?.textContent || '',
      href: card.querySelector('a')?.href || '',
      lastViewed: this.getElementLastUsed(this.getElementSelector(card)),
      frequency: this.getElementFrequency(this.getElementSelector(card))
    };
  }

  getPageFrequency(href) {
    if (!href) return 0;
    const page = new URL(href, window.location.origin).pathname;
    return this.userProfile.behaviorPatterns.pageFrequency?.[page] || 0;
  }

  getPageRecency(href) {
    if (!href) return Infinity;
    const page = new URL(href, window.location.origin).pathname;
    const history = this.userProfile.usageHistory.filter(h => h.page === page);
    return history.length > 0 ? Date.now() - Math.max(...history.map(h => h.timestamp)) : Infinity;
  }

  getElementFrequency(selector) {
    return this.userProfile.behaviorPatterns.elementFrequency?.[selector] || 0;
  }

  getElementLastUsed(selector) {
    const interactions = this.userProfile.usageHistory.filter(h => h.element === selector);
    return interactions.length > 0 ? Math.max(...interactions.map(h => h.timestamp)) : null;
  }

  getPageTitle(page) {
    const titleMap = {
      '/sections/pilgrim/': 'Pilgrim',
      '/sections/merchant/': 'Merchant',
      '/sections/red-pill/': 'Red Pill',
      '/docs/': 'Documentación'
    };
    return titleMap[page] || page;
  }

  getTimeRelevance(element) {
    // Calcular relevancia basada en tiempo
    const timePatterns = this.userProfile.behaviorPatterns.timePatterns || {};
    const currentTime = this.contextualData.timeOfDay;
    return (timePatterns[currentTime] || 0) / Math.max(...Object.values(timePatterns), 1);
  }

  shouldRecommendPage(href) {
    if (!href) return false;
    const frequency = this.getPageFrequency(href);
    const recency = this.getPageRecency(href);
    return frequency > 2 && recency > 86400000; // Usado frecuentemente pero no recientemente
  }

  updatePersonalizationLevel() {
    const actions = parseInt(localStorage.getItem('coomunity_action_count') || '0') + 1;
    localStorage.setItem('coomunity_action_count', actions.toString());
    
    // Recalcular nivel de personalización
    this.detectInitialPersonalizationLevel();
    this.applyPersonalizationLevel();
  }

  limitHistorySize() {
    // Mantener solo los últimos 1000 elementos en el historial
    if (this.userProfile.usageHistory.length > 1000) {
      this.userProfile.usageHistory = this.userProfile.usageHistory.slice(-1000);
    }
  }

  // Utility functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  showNotification(message, type = 'info') {
    if (window.feedbackManager) {
      window.feedbackManager.showNotification({ message, type, duration: 3000 });
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Cleanup
  destroy() {
    this.saveUserProfile();
    this.contextObservers.clear();
    this.personalizedElements.clear();
    this.adaptationQueue = [];
  }

  /**
   * =====================================
   * 🌐 PUBLIC API
   * =====================================
   */

  // API para obtener perfil de usuario
  getUserProfile() {
    return { ...this.userProfile };
  }

  // API para actualizar preferencias
  updatePreferences(preferences) {
    this.userProfile.preferences = { ...this.userProfile.preferences, ...preferences };
    this.saveUserProfile();
    this.applyPersonalizationLevel();
  }

  // API para obtener contexto actual
  getCurrentContext() {
    return { ...this.contextualData };
  }

  // API para añadir elemento personalizable
  addPersonalizableElement(element, config) {
    this.personalizedElements.add({ element, config });
    this.updateElementPersonalization(element, config);
  }

  // API para obtener sugerencias
  getSuggestions() {
    return [...this.smartSuggestions];
  }

  // API para ejecutar acción contextual
  executeContextualAction(actionName) {
    const action = this.contextualActions.get(actionName);
    if (action) {
      action();
    }
  }

  /**
   * =====================================
   * 📱 MOBILE NAVIGATION MANAGEMENT
   * =====================================
   */

  setupMobileNavigation() {
    // Configurar toggle del menú móvil
    const mobileToggle = document.querySelector('.enhanced-mobile-toggle');
    const navLinks = document.querySelector('.enhanced-nav-links');
    
    if (mobileToggle && navLinks) {
      // Función para togglear el menú
      const toggleMobileMenu = () => {
        const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isOpen;
        
        // Actualizar aria-expanded
        mobileToggle.setAttribute('aria-expanded', newState.toString());
        
        // Togglear clase del menú
        if (newState) {
          navLinks.classList.add('mobile-menu-open');
          // Foco en el primer elemento del menú
          const firstLink = navLinks.querySelector('.enhanced-nav-item');
          if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
          }
        } else {
          navLinks.classList.remove('mobile-menu-open');
        }
        
        // Track del evento
        this.trackInteraction({
          type: 'mobile_menu_toggle',
          state: newState ? 'opened' : 'closed',
          timestamp: Date.now()
        });
        
        console.log(`📱 Mobile menu ${newState ? 'opened' : 'closed'}`);
      };
      
      // Event listener para el botón
      mobileToggle.addEventListener('click', toggleMobileMenu);
      
      // Cerrar menú con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('mobile-menu-open')) {
          toggleMobileMenu();
          mobileToggle.focus();
        }
      });
      
      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('mobile-menu-open') && 
            !mobileToggle.contains(e.target) && 
            !navLinks.contains(e.target)) {
          toggleMobileMenu();
        }
      });
      
      // Cerrar menú al redimensionar la ventana
      window.addEventListener('resize', this.debounce(() => {
        if (window.innerWidth > 768 && navLinks.classList.contains('mobile-menu-open')) {
          navLinks.classList.remove('mobile-menu-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }, 250));
      
      console.log('📱 Mobile navigation setup completed');
    } else {
      console.warn('📱 Mobile navigation elements not found');
    }
  }
}

// Inicialización automática
let adaptiveContextualManager;

document.addEventListener('DOMContentLoaded', () => {
  adaptiveContextualManager = new AdaptiveContextualManager();
  
  // Hacer disponible globalmente
  window.adaptiveContextualManager = adaptiveContextualManager;
  
  console.log('🧠 Adaptive & Contextual System Ready');
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdaptiveContextualManager;
} 