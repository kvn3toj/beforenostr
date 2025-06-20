/**
 * 🎯 GA4 Event Tracking Module - CoomÜnity Platform
 * 
 * Este módulo proporciona funciones para trackear eventos específicos
 * de las heurísticas UX implementadas en CoomÜnity.
 * 
 * Uso: Importar este módulo en el JavaScript Manager principal
 */

class GA4EventTracker {
  constructor() {
    this.startTime = Date.now();
    this.currentSection = this.getCurrentSection();
    this.eventQueue = [];
    
    // Verificar que GA4 esté disponible
    if (typeof gtag === 'undefined') {
      console.warn('GA4 no está disponible. Los eventos se almacenarán en cola.');
    }
  }

  /**
   * Obtiene la sección actual basada en la URL
   */
  getCurrentSection() {
    const path = window.location.pathname;
    if (path.includes('red-pill')) return 'red-pill';
    if (path.includes('merchant')) return 'merchant';
    if (path.includes('pilgrim')) return 'pilgrim';
    return 'home';
  }

  /**
   * Método base para enviar eventos a GA4
   */
  trackEvent(eventName, parameters = {}) {
    const eventData = {
      ...parameters,
      section_name: this.currentSection,
      timestamp: new Date().toISOString(),
      session_id: this.getSessionId()
    };

    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventData);
      console.log('📊 GA4 Event:', eventName, eventData);
    } else {
      this.eventQueue.push({ eventName, eventData });
      console.log('📦 GA4 Event queued:', eventName);
    }
  }

  /**
   * Genera un ID de sesión simple
   */
  getSessionId() {
    if (!window.sessionStorage.getItem('ga4_session_id')) {
      window.sessionStorage.setItem('ga4_session_id', 
        'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    }
    return window.sessionStorage.getItem('ga4_session_id');
  }

  // ==================== EVENTOS ESPECÍFICOS UX ====================

  /**
   * 🔄 Heurística: Visibilidad del Estado del Sistema
   */
  trackLoadingState(state, type, componentName, duration = null) {
    this.trackEvent('loading_state_change', {
      loading_state: state, // 'start' | 'end'
      loading_type: type,   // 'page' | 'component' | 'api'
      component_name: componentName,
      loading_duration: duration
    });
  }

  /**
   * 🎨 Heurística: Consistencia y Estándares
   */
  trackConsistencyInteraction(elementType, action, success) {
    this.trackEvent('consistency_interaction', {
      element_type: elementType, // 'button' | 'form' | 'navigation'
      action: action,           // 'click' | 'hover' | 'focus'
      interaction_success: success,
      consistency_score: this.calculateConsistencyScore()
    });
  }

  /**
   * 📱 Heurística: Experiencia Adaptativa
   */
  trackAdaptiveChange(changeType, oldValue, newValue) {
    this.trackEvent('adaptive_experience_change', {
      change_type: changeType,  // 'viewport' | 'theme' | 'density'
      old_value: oldValue,
      new_value: newValue,
      device_type: this.getDeviceType(),
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    });
  }

  /**
   * 🔴 Red Pill Journey específico
   */
  trackRedPillStep(stepNumber, stepName, choice, progress) {
    this.trackEvent('red_pill_journey_step', {
      step_number: stepNumber,
      step_name: stepName,
      choice_made: choice,      // 'left' | 'right' | 'skip'
      journey_progress: progress, // 0-100
      time_spent: Date.now() - this.stepStartTime
    });
  }

  /**
   * 🎥 Interacciones de Video
   */
  trackVideoInteraction(action, position, duration, interactionType) {
    this.trackEvent('video_interaction', {
      video_action: action,        // 'play' | 'pause' | 'seek' | 'complete'
      video_position: position,    // segundos
      video_duration: duration,    // segundos totales
      interaction_type: interactionType, // 'button' | 'overlay' | 'timeline'
      engagement_rate: (position / duration) * 100
    });
  }

  /**
   * 🎛️ Personalización de Usuario
   */
  trackPersonalizationChange(settingType, oldValue, newValue, level) {
    this.trackEvent('personalization_change', {
      setting_type: settingType,     // 'theme' | 'density' | 'language'
      old_value: oldValue,
      new_value: newValue,
      personalization_level: level,  // 'basic' | 'intermediate' | 'advanced'
      total_customizations: this.getTotalCustomizations()
    });
  }

  /**
   * ♿ Accesibilidad y Control del Usuario
   */
  trackAccessibilityFeature(featureType, action, userPreference) {
    this.trackEvent('accessibility_feature_used', {
      feature_type: featureType,     // 'keyboard_nav' | 'screen_reader' | 'high_contrast'
      feature_action: action,        // 'enabled' | 'disabled' | 'used'
      user_preference: userPreference, // 'manual' | 'auto' | 'system'
      accessibility_score: this.getAccessibilityScore()
    });
  }

  // ==================== MÉTODOS HELPER ====================

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  calculateConsistencyScore() {
    // Lógica para calcular score de consistencia
    // Basado en elementos UI detectados
    return Math.floor(Math.random() * 100); // Placeholder
  }

  getTotalCustomizations() {
    // Contar customizaciones activas del usuario
    const customizations = JSON.parse(localStorage.getItem('user_customizations') || '{}');
    return Object.keys(customizations).length;
  }

  getAccessibilityScore() {
    // Calcular score de accesibilidad basado en features activas
    return Math.floor(Math.random() * 100); // Placeholder
  }

  /**
   * Procesar cola de eventos cuando GA4 esté disponible
   */
  processEventQueue() {
    if (typeof gtag !== 'undefined' && this.eventQueue.length > 0) {
      console.log(`📤 Procesando ${this.eventQueue.length} eventos en cola...`);
      this.eventQueue.forEach(({ eventName, eventData }) => {
        gtag('event', eventName, eventData);
      });
      this.eventQueue = [];
    }
  }
}

// Crear instancia global
window.GA4Tracker = new GA4EventTracker();

// Procesar cola de eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.GA4Tracker.processEventQueue();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GA4EventTracker;
}

/**
 * 📋 EJEMPLOS DE USO EN JAVASCRIPT MANAGER:
 * 
 * // En el Loading Manager
 * showLoading(componentName) {
 *   window.GA4Tracker.trackLoadingState('start', 'component', componentName);
 *   // ... resto del código
 * }
 * 
 * hideLoading(componentName, duration) {
 *   window.GA4Tracker.trackLoadingState('end', 'component', componentName, duration);
 *   // ... resto del código
 * }
 * 
 * // En el Red Pill Manager
 * handleChoice(choice) {
 *   window.GA4Tracker.trackRedPillStep(
 *     this.currentStep, 
 *     this.steps[this.currentStep].name, 
 *     choice, 
 *     (this.currentStep / this.totalSteps) * 100
 *   );
 *   // ... resto del código
 * }
 * 
 * // En el Video Manager
 * onVideoPlay() {
 *   window.GA4Tracker.trackVideoInteraction(
 *     'play', 
 *     this.video.currentTime, 
 *     this.video.duration, 
 *     'button'
 *   );
 * }
 */