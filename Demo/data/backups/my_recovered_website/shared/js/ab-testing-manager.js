/**
 * 🧪 A/B Testing Manager - CoomÜnity Platform
 * 
 * Gestiona la asignación de grupos, aplicación de variantes,
 * y tracking de eventos para A/B testing del lado del cliente.
 * 
 * Generado automáticamente por generate-ab-testing.ts
 */

class ABTestingManager {
  constructor() {
    this.currentTests = new Map();
    this.userGroups = new Map();
    this.conversionEvents = new Set();
    this.sessionId = this.getSessionId();
    this.userId = this.getUserId();
    
    this.init();
  }

  /**
   * Inicializa el sistema de A/B Testing
   */
  init() {
    this.loadUserGroups();
    this.registerTests();
    this.applyVariants();
    this.setupEventTracking();
    this.setupConversionTracking();
    
    console.log('🧪 A/B Testing Manager initialized');
  }

  /**
   * Asigna aleatoriamente a un usuario a un grupo A o B
   * con persistencia en localStorage
   */
  assignABGroup(testName, variants = ['A', 'B']) {
    // Verificar si ya existe asignación
    const existingGroup = this.getUserGroup(testName);
    if (existingGroup) {
      console.log(`🎯 Usuario ya asignado al grupo ${existingGroup} para test ${testName}`);
      return existingGroup;
    }

    // Asignación aleatoria con distribución 50/50
    const randomIndex = Math.floor(Math.random() * variants.length);
    const assignedGroup = variants[randomIndex];

    // Guardar asignación en localStorage
    this.saveUserGroup(testName, assignedGroup);

    // Enviar evento a GA4
    this.trackABAssignment(testName, assignedGroup);

    console.log(`🎲 Usuario asignado al grupo ${assignedGroup} para test ${testName}`);
    return assignedGroup;
  }

  /**
   * Obtiene el grupo asignado para un test específico
   */
  getUserGroup(testName) {
    const stored = localStorage.getItem(`ab_test_${testName}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Verificar que la asignación no haya expirado (opcional)
        const daysSinceAssignment = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
        if (daysSinceAssignment < 30) { // Expirar después de 30 días
          return data.group;
        }
      } catch (e) {
        console.warn('Error parsing stored AB test data:', e);
      }
    }
    return null;
  }

  /**
   * Guarda la asignación de grupo en localStorage
   */
  saveUserGroup(testName, group) {
    const data = {
      group: group,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };
    
    try {
      localStorage.setItem(`ab_test_${testName}`, JSON.stringify(data));
      this.userGroups.set(testName, group);
    } catch (e) {
      console.warn('Error saving AB test assignment:', e);
    }
  }

  /**
   * Carga todas las asignaciones de grupos desde localStorage
   */
  loadUserGroups() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('ab_test_')) {
        const testName = key.replace('ab_test_', '');
        const group = this.getUserGroup(testName);
        if (group) {
          this.userGroups.set(testName, group);
        }
      }
    });
  }

  /**
   * Registra y configura los tests A/B activos
   */
  registerTests() {
    // Test de Densidad de Interfaz
    this.registerTest('interface_density', {
      name: 'Test de impacto de la densidad de interfaz en la experiencia del usuario',
      variants: {
      "A": {
            "name": "Control - Densidad Normal",
            "description": "Interfaz con densidad normal (como está actualmente)",
            "modifications": [
                  "density-normal"
            ]
      },
      "B": {
            "name": "Variante - Densidad Compacta",
            "description": "Interfaz con densidad compacta para mayor eficiencia",
            "modifications": [
                  "density-compact",
                  "reduced-spacing",
                  "compact-elements"
            ]
      }
},
      targetElements: [
      ".adaptive-container",
      ".contextual-card",
      ".adaptive-grid",
      ".smart-suggestions",
      ".adaptive-navigation"
],
      conversionEvents: [
      "button_click",
      "navigation_use",
      "feature_discovery",
      "task_completion",
      "session_duration"
]
    });
  }

  /**
   * Registra un test A/B específico
   */
  registerTest(testName, testConfig) {
    this.currentTests.set(testName, testConfig);
    
    // Asignar grupo si no existe
    const userGroup = this.assignABGroup(testName, Object.keys(testConfig.variants));
    
    console.log(`📊 Test registrado: ${testName}, Grupo: ${userGroup}`);
  }

  /**
   * Aplica las variantes correspondientes según los grupos asignados
   */
  applyVariants() {
    this.currentTests.forEach((testConfig, testName) => {
      const userGroup = this.getUserGroup(testName);
      if (userGroup && testConfig.variants[userGroup]) {
        this.applyVariantModifications(testName, userGroup, testConfig.variants[userGroup]);
      }
    });
  }

  /**
   * Aplica las modificaciones específicas de una variante
   */
  applyVariantModifications(testName, group, variant) {
    const body = document.body;
    
    // Añadir clases de test y grupo
    body.classList.add(`ab-test-${testName}`);
    body.classList.add(`ab-group-${group.toLowerCase()}`);
    
    // Aplicar modificaciones específicas
    variant.modifications.forEach(modification => {
      body.classList.add(`ab-${modification}`);
    });

    // Trackear aplicación de variante
    this.trackVariantApplication(testName, group, variant.name);
    
    console.log(`🎨 Variante aplicada: ${testName} - ${variant.name}`);
  }

  /**
   * Configurar tracking de eventos para A/B testing
   */
  setupEventTracking() {
    // Interceptar clics en elementos objetivo
    document.addEventListener('click', (event) => {
      this.trackElementInteraction('click', event.target);
    });

    // Interceptar navegación
    document.addEventListener('DOMContentLoaded', () => {
      this.trackPageView();
    });

    // Interceptar interacciones específicas
    this.setupSpecificInteractionTracking();
  }

  /**
   * Configurar tracking de conversiones
   */
  setupConversionTracking() {
    // Trackear tiempo de sesión
    this.startSessionTracking();
    
    // Trackear completación de tareas
    this.setupTaskCompletionTracking();
    
    // Trackear descubrimiento de features
    this.setupFeatureDiscoveryTracking();
  }

  /**
   * Trackea interacciones específicas para A/B testing
   */
  setupSpecificInteractionTracking() {
    // Tracking de navegación adaptativa
    const navItems = document.querySelectorAll('.adaptive-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        this.trackConversion('navigation_use', {
          nav_item: item.textContent?.trim(),
          test_context: this.getActiveTestContext()
        });
      });
    });

    // Tracking de sugerencias inteligentes
    document.addEventListener('click', (event) => {
      if (event.target.closest('.suggestion-item')) {
        this.trackConversion('feature_discovery', {
          suggestion_type: 'smart_suggestion',
          test_context: this.getActiveTestContext()
        });
      }
    });

    // Tracking de controles adaptativos
    document.addEventListener('click', (event) => {
      if (event.target.closest('.adaptive-control')) {
        this.trackConversion('feature_discovery', {
          control_type: 'adaptive_control',
          test_context: this.getActiveTestContext()
        });
      }
    });
  }

  /**
   * Trackea interacción con elemento
   */
  trackElementInteraction(eventType, element) {
    if (!element) return;

    const testContext = this.getActiveTestContext();
    if (testContext.length === 0) return;

    // Identificar el elemento
    const elementInfo = this.getElementInfo(element);
    
    this.trackEvent('ab_element_interaction', {
      event_type: eventType,
      element_type: elementInfo.type,
      element_id: elementInfo.id,
      element_class: elementInfo.className,
      test_context: testContext
    });
  }

  /**
   * Trackea conversión específica
   */
  trackConversion(conversionType, additionalData = {}) {
    const testContext = this.getActiveTestContext();
    
    this.trackEvent('ab_conversion', {
      conversion_type: conversionType,
      test_context: testContext,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
      ...additionalData
    });

    console.log(`💰 Conversión trackeada: ${conversionType}`, testContext);
  }

  /**
   * Obtiene el contexto de tests activos para el usuario
   */
  getActiveTestContext() {
    const context = [];
    this.userGroups.forEach((group, testName) => {
      context.push({
        test_name: testName,
        group: group,
        variant_name: this.getVariantName(testName, group)
      });
    });
    return context;
  }

  /**
   * Obtiene el nombre de la variante
   */
  getVariantName(testName, group) {
    const test = this.currentTests.get(testName);
    return test?.variants[group]?.name || `Group ${group}`;
  }

  /**
   * Obtiene información del elemento
   */
  getElementInfo(element) {
    return {
      type: element.tagName?.toLowerCase() || 'unknown',
      id: element.id || '',
      className: element.className || '',
      selector: this.getElementSelector(element)
    };
  }

  /**
   * Genera selector CSS para un elemento
   */
  getElementSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.length > 0);
      if (classes.length > 0) return `.${classes.join('.')}`;
    }
    return element.tagName?.toLowerCase() || 'element';
  }

  /**
   * Tracking de tiempo de sesión
   */
  startSessionTracking() {
    this.sessionStartTime = Date.now();
    
    // Trackear duración de sesión cada 30 segundos
    setInterval(() => {
      const sessionDuration = Date.now() - this.sessionStartTime;
      this.trackConversion('session_duration', {
        duration_seconds: Math.floor(sessionDuration / 1000)
      });
    }, 30000);

    // Trackear al cerrar la página
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.sessionStartTime;
      this.trackConversion('session_complete', {
        total_duration_seconds: Math.floor(sessionDuration / 1000)
      });
    });
  }

  /**
   * Tracking de completación de tareas
   */
  setupTaskCompletionTracking() {
    // Detectar completación de formularios
    document.addEventListener('submit', (event) => {
      this.trackConversion('task_completion', {
        task_type: 'form_submission',
        form_id: event.target.id || 'unknown'
      });
    });

    // Detectar llegada a páginas objetivo
    const targetPages = ['/thank-you', '/success', '/complete'];
    const currentPath = window.location.pathname;
    if (targetPages.some(page => currentPath.includes(page))) {
      this.trackConversion('task_completion', {
        task_type: 'page_goal_reached',
        page_path: currentPath
      });
    }
  }

  /**
   * Tracking de descubrimiento de features
   */
  setupFeatureDiscoveryTracking() {
    // Observar elementos que se vuelven visibles
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (element.dataset.abFeature) {
            this.trackConversion('feature_discovery', {
              feature_name: element.dataset.abFeature,
              discovery_method: 'scroll_into_view'
            });
          }
        }
      });
    }, { threshold: 0.5 });

    // Observar elementos marcados como features
    const features = document.querySelectorAll('[data-ab-feature]');
    features.forEach(feature => observer.observe(feature));
  }

  /**
   * Trackea vista de página
   */
  trackPageView() {
    this.trackEvent('ab_page_view', {
      page_path: window.location.pathname,
      test_context: this.getActiveTestContext(),
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      device_type: this.getDeviceType()
    });
  }

  /**
   * Trackea asignación de grupo A/B
   */
  trackABAssignment(testName, group) {
    this.trackEvent('ab_test_assignment', {
      test_name: testName,
      group: group,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now()
    });
  }

  /**
   * Trackea aplicación de variante
   */
  trackVariantApplication(testName, group, variantName) {
    this.trackEvent('ab_variant_applied', {
      test_name: testName,
      group: group,
      variant_name: variantName,
      session_id: this.sessionId
    });
  }

  /**
   * Método base para tracking de eventos GA4
   */
  trackEvent(eventName, parameters = {}) {
    const eventData = {
      ...parameters,
      ab_testing: true,
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
      console.log('📊 AB Test Event:', eventName, eventData);
    } else if (window.GA4Tracker) {
      window.GA4Tracker.trackEvent(eventName, eventData);
    } else {
      console.log('📦 AB Test Event (no GA4):', eventName, eventData);
    }
  }

  /**
   * Genera ID de sesión
   */
  getSessionId() {
    if (!sessionStorage.getItem('ab_session_id')) {
      sessionStorage.setItem('ab_session_id', 
        'ab_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    }
    return sessionStorage.getItem('ab_session_id');
  }

  /**
   * Genera ID de usuario persistente
   */
  getUserId() {
    if (!localStorage.getItem('ab_user_id')) {
      localStorage.setItem('ab_user_id', 
        'ab_user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    }
    return localStorage.getItem('ab_user_id');
  }

  /**
   * Obtiene tipo de dispositivo
   */
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * Obtiene métricas del test actual
   */
  getTestMetrics(testName) {
    const group = this.getUserGroup(testName);
    const testConfig = this.currentTests.get(testName);
    
    return {
      testName,
      group,
      variantName: this.getVariantName(testName, group),
      sessionId: this.sessionId,
      userId: this.userId,
      testConfig
    };
  }

  /**
   * Finaliza un test manualmente
   */
  endTest(testName) {
    this.trackEvent('ab_test_ended', {
      test_name: testName,
      group: this.getUserGroup(testName),
      reason: 'manual_end'
    });
    
    localStorage.removeItem(`ab_test_${testName}`);
    this.userGroups.delete(testName);
    this.currentTests.delete(testName);
  }

  /**
   * API pública para integración externa
   */
  getPublicAPI() {
    return {
      assignGroup: (testName, variants) => this.assignABGroup(testName, variants),
      getUserGroup: (testName) => this.getUserGroup(testName),
      trackConversion: (type, data) => this.trackConversion(type, data),
      getTestMetrics: (testName) => this.getTestMetrics(testName),
      getActiveTests: () => Array.from(this.currentTests.keys())
    };
  }
}

// Crear instancia global
window.ABTestingManager = new ABTestingManager();

// Exponer API pública
window.ABTesting = window.ABTestingManager.getPublicAPI();

// Procesar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🧪 A/B Testing está activo. Tests disponibles:', window.ABTesting.getActiveTests());
});