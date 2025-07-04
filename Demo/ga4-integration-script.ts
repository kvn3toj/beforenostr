#!/usr/bin/env ts-node

/**
 * 🧪 Google Analytics 4 (GA4) Integration Script - CoomÜnity Platform
 * 
 * Este script automatiza la integración de GA4 en el proyecto web unificado
 * de CoomÜnity, añadiendo el tracking snippet y generando código para
 * eventos específicos de UX heuristics.
 * 
 * Autor: AI Assistant
 * Versión: 1.0.0
 * Fecha: 2024
 */

import * as fs from 'fs';
import * as path from 'path';
// import * as glob from 'glob';

interface GA4Config {
  measurementId: string;
  projectPath: string;
  generateEventTracking: boolean;
  createBackup: boolean;
}

interface EventDefinition {
  name: string;
  description: string;
  parameters: Record<string, string>;
  location: string;
  example: string;
}

// Simple glob implementation for finding files
function findFiles(dir: string, pattern: string): string[] {
  const files: string[] = [];
  
  function walkDir(currentDir: string) {
    try {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item.name);
        
        if (item.isDirectory()) {
          // Skip certain directories
          if (!item.name.includes('node_modules') && 
              !item.name.includes('backup') && 
              !item.name.includes('test')) {
            walkDir(fullPath);
          }
        } else if (item.isFile() && item.name.endsWith(pattern)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  walkDir(dir);
  return files;
}

class GA4Integrator {
  private config: GA4Config;
  private htmlFiles: string[] = [];
  private eventDefinitions: EventDefinition[] = [];

  constructor(config: GA4Config) {
    this.config = config;
    this.initializeEventDefinitions();
  }

  /**
   * Inicializa las definiciones de eventos para tracking UX
   */
  private initializeEventDefinitions(): void {
    this.eventDefinitions = [
      {
        name: 'page_view_enhanced',
        description: 'Vista de página mejorada con contexto UX',
        parameters: {
          'page_title': 'string',
          'page_location': 'string',
          'content_group1': 'string', // Sección (red-pill, merchant, pilgrim)
          'ux_heuristic_score': 'number'
        },
        location: 'JavaScript Manager - onPageLoad()',
        example: `gtag('event', 'page_view_enhanced', {
  page_title: document.title,
  page_location: window.location.href,
  content_group1: getCurrentSection(),
  ux_heuristic_score: getUXScore()
});`
      },
      {
        name: 'navigation_interaction',
        description: 'Interacciones con elementos de navegación',
        parameters: {
          'navigation_type': 'string', // 'main_nav', 'breadcrumb', 'footer'
          'link_text': 'string',
          'destination': 'string',
          'interaction_method': 'string' // 'click', 'keyboard'
        },
        location: 'Navigation handlers en JavaScript Manager',
        example: `gtag('event', 'navigation_interaction', {
  navigation_type: 'main_nav',
  link_text: linkElement.textContent,
  destination: linkElement.href,
  interaction_method: 'click'
});`
      },
      {
        name: 'loading_state_change',
        description: 'Cambios en indicadores de carga (Heurística: Visibilidad del Estado)',
        parameters: {
          'loading_state': 'string', // 'start', 'end'
          'loading_type': 'string', // 'page', 'component', 'api'
          'loading_duration': 'number',
          'component_name': 'string'
        },
        location: 'Loading Manager - showLoading()/hideLoading()',
        example: `gtag('event', 'loading_state_change', {
  loading_state: 'start',
  loading_type: 'component',
  component_name: 'red-pill-quiz',
  loading_duration: Date.now() - loadingStartTime
});`
      },
      {
        name: 'personalization_change',
        description: 'Interacciones con controles de personalización',
        parameters: {
          'setting_type': 'string', // 'theme', 'density', 'language'
          'old_value': 'string',
          'new_value': 'string',
          'personalization_level': 'string'
        },
        location: 'Personalization Manager - updateSetting()',
        example: `gtag('event', 'personalization_change', {
  setting_type: 'theme',
  old_value: oldTheme,
  new_value: newTheme,
  personalization_level: getCurrentPersonalizationLevel()
});`
      },
      {
        name: 'red_pill_journey_step',
        description: 'Progreso en el Red Pill Journey',
        parameters: {
          'step_number': 'number',
          'step_name': 'string',
          'choice_made': 'string', // 'left', 'right', 'skip'
          'journey_progress': 'number', // Porcentaje 0-100
          'time_spent': 'number'
        },
        location: 'Red Pill Manager - handleChoice()',
        example: `gtag('event', 'red_pill_journey_step', {
  step_number: currentStep,
  step_name: steps[currentStep].name,
  choice_made: choice,
  journey_progress: (currentStep / totalSteps) * 100,
  time_spent: Date.now() - stepStartTime
});`
      },
      {
        name: 'video_interaction',
        description: 'Interacciones con video principal',
        parameters: {
          'video_action': 'string', // 'play', 'pause', 'seek', 'complete'
          'video_position': 'number', // Segundos
          'video_duration': 'number',
          'interaction_type': 'string', // 'button', 'overlay', 'timeline'
        },
        location: 'Video Manager - onVideoEvent()',
        example: `gtag('event', 'video_interaction', {
  video_action: 'play',
  video_position: video.currentTime,
  video_duration: video.duration,
  interaction_type: 'button'
});`
      },
      {
        name: 'accessibility_feature_used',
        description: 'Uso de características de accesibilidad',
        parameters: {
          'feature_type': 'string', // 'keyboard_nav', 'screen_reader', 'high_contrast'
          'feature_action': 'string', // 'enabled', 'disabled', 'used'
          'user_preference': 'string'
        },
        location: 'Accessibility Manager - onFeatureToggle()',
        example: `gtag('event', 'accessibility_feature_used', {
  feature_type: 'keyboard_nav',
  feature_action: 'enabled',
  user_preference: 'auto'
});`
      },
      {
        name: 'ux_heuristic_interaction',
        description: 'Interacciones específicas con elementos UX',
        parameters: {
          'heuristic_name': 'string', // 'consistency', 'visibility', 'adaptive'
          'element_type': 'string', // 'button', 'form', 'navigation'
          'interaction_success': 'boolean',
          'user_satisfaction': 'number' // 1-5 si disponible
        },
        location: 'UX Managers específicos',
        example: `gtag('event', 'ux_heuristic_interaction', {
  heuristic_name: 'visibility',
  element_type: 'loading_indicator',
  interaction_success: true,
  user_satisfaction: 4
});`
      }
    ];
  }

  /**
   * Ejecuta la integración completa de GA4
   */
  public async integrate(): Promise<void> {
    console.log('🚀 Iniciando integración de Google Analytics 4...\n');

    try {
      // 1. Crear backup si es necesario
      if (this.config.createBackup) {
        await this.createBackup();
      }

      // 2. Encontrar archivos HTML
      await this.findHtmlFiles();

      // 3. Añadir snippet GA4 a archivos HTML
      await this.addGA4Snippet();

      // 4. Generar código de tracking de eventos
      if (this.config.generateEventTracking) {
        await this.generateEventTrackingCode();
      }

      // 5. Generar documentación
      await this.generateDocumentation();

      console.log('✅ Integración de GA4 completada exitosamente!');
      console.log(`📊 ${this.htmlFiles.length} archivos HTML actualizados`);
      console.log(`🎯 ${this.eventDefinitions.length} eventos definidos para tracking`);

    } catch (error) {
      console.error('❌ Error durante la integración:', error);
      throw error;
    }
  }

  /**
   * Crea backup del proyecto antes de realizar cambios
   */
  private async createBackup(): Promise<void> {
    const backupDir = path.join(this.config.projectPath, '../backup-ga4-integration');
    console.log('📦 Creando backup en:', backupDir);
    
    // Implementación simplificada - en producción usar herramientas más robustas
    console.log('⚠️  Backup manual recomendado antes de ejecutar este script');
  }

  /**
   * Encuentra todos los archivos HTML relevantes
   */
  private async findHtmlFiles(): Promise<void> {
    console.log('🔍 Buscando archivos HTML...');

    // Buscar archivos HTML en diferentes ubicaciones
    const searchPaths = [
      this.config.projectPath,
      path.join(this.config.projectPath, 'public'),
      path.join(this.config.projectPath, 'sections')
    ];

    for (const searchPath of searchPaths) {
      if (fs.existsSync(searchPath)) {
        const files = findFiles(searchPath, '.html');
        this.htmlFiles.push(...files);
      }
    }

    // Remover duplicados
    this.htmlFiles = [...new Set(this.htmlFiles)];

    console.log(`📁 Encontrados ${this.htmlFiles.length} archivos HTML:`);
    this.htmlFiles.forEach(file => {
      console.log(`   - ${path.relative(this.config.projectPath, file)}`);
    });
  }

  /**
   * Añade el snippet de GA4 al head de archivos HTML
   */
  private async addGA4Snippet(): Promise<void> {
    console.log('\n📝 Añadiendo snippet de GA4 a archivos HTML...');

    const ga4Snippet = this.generateGA4Snippet();

    for (const htmlFile of this.htmlFiles) {
      try {
        let content = fs.readFileSync(htmlFile, 'utf8');
        
        // Verificar si GA4 ya está presente
        if (content.includes('googletagmanager.com/gtag/js')) {
          console.log(`⏭️  GA4 ya presente en: ${path.basename(htmlFile)}`);
          continue;
        }

        // Buscar la etiqueta </head> e insertar antes
        const headEndIndex = content.indexOf('</head>');
        if (headEndIndex === -1) {
          console.log(`⚠️  No se encontró </head> en: ${path.basename(htmlFile)}`);
          continue;
        }

        // Insertar snippet
        const newContent = content.slice(0, headEndIndex) + 
                          ga4Snippet + '\n' + 
                          content.slice(headEndIndex);

        fs.writeFileSync(htmlFile, newContent, 'utf8');
        console.log(`✅ GA4 añadido a: ${path.basename(htmlFile)}`);

      } catch (error) {
        console.error(`❌ Error procesando ${htmlFile}:`, error);
      }
    }
  }

  /**
   * Genera el snippet de GA4
   */
  private generateGA4Snippet(): string {
    return `
  <!-- Google Analytics 4 (GA4) - CoomÜnity Platform -->
  <!-- 
    ⚠️  IMPORTANTE: Reemplaza '${this.config.measurementId}' con tu Measurement ID real de GA4
    Obtén tu ID en: https://analytics.google.com/
  -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    // Configuración básica de GA4
    gtag('config', '${this.config.measurementId}', {
      // Configuraciones UX específicas para CoomÜnity
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': 'section_name',
        'custom_parameter_2': 'ux_heuristic',
        'custom_parameter_3': 'user_journey_step'
      },
      // Configuraciones de privacidad
      anonymize_ip: true,
      allow_google_signals: false,
      cookie_expires: 63072000, // 2 años
      // Enhanced ecommerce para tracking de conversiones UX
      send_page_view: true
    });

    // Función helper para tracking de eventos UX
    window.trackUXEvent = function(eventName, parameters) {
      gtag('event', eventName, {
        event_category: 'UX_Heuristics',
        event_label: parameters.section || 'unknown',
        value: parameters.value || 1,
        ...parameters
      });
    };

    // Track página cargada inicialmente
    gtag('event', 'page_view_enhanced', {
      page_title: document.title,
      page_location: window.location.href,
      content_group1: window.location.pathname.split('/')[1] || 'home',
      timestamp: new Date().toISOString()
    });
  </script>
  <!-- Fin Google Analytics 4 -->`;
  }

  /**
   * Genera archivos con código de tracking de eventos
   */
  private async generateEventTrackingCode(): Promise<void> {
    console.log('\n🎯 Generando código de tracking de eventos...');

    // Generar archivo principal de eventos
    const eventTrackingCode = this.generateEventTrackingModule();
    const eventFilePath = path.join(this.config.projectPath, 'shared/js/ga4-events.js');
    
    // Crear directorio si no existe
    const eventDir = path.dirname(eventFilePath);
    if (!fs.existsSync(eventDir)) {
      fs.mkdirSync(eventDir, { recursive: true });
    }

    fs.writeFileSync(eventFilePath, eventTrackingCode, 'utf8');
    console.log(`✅ Archivo de eventos generado: ${eventFilePath}`);

    // Generar ejemplos específicos por sección
    await this.generateSectionSpecificExamples();
  }

  /**
   * Genera el módulo principal de tracking de eventos
   */
  private generateEventTrackingModule(): string {
    return `/**
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
      viewport_size: \`\${window.innerWidth}x\${window.innerHeight}\`
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
      console.log(\`📤 Procesando \${this.eventQueue.length} eventos en cola...\`);
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
 */`;
  }

  /**
   * Genera ejemplos específicos por sección
   */
  private async generateSectionSpecificExamples(): Promise<void> {
    const sections = ['red-pill', 'merchant', 'pilgrim'];

    for (const section of sections) {
      const exampleCode = this.generateSectionExample(section);
      const examplePath = path.join(this.config.projectPath, `shared/js/ga4-examples-${section}.js`);
      
      fs.writeFileSync(examplePath, exampleCode, 'utf8');
      console.log(`✅ Ejemplos de ${section} generados: ${path.basename(examplePath)}`);
    }
  }

  /**
   * Genera ejemplos específicos para una sección
   */
  private generateSectionExample(section: string): string {
    const examples: Record<string, string> = {
      'red-pill': `/**
 * 🔴 GA4 Events - Red Pill Section
 * 
 * Ejemplos específicos para la sección Red Pill
 */

// Red Pill Journey - Iniciar cuestionario
document.getElementById('start-journey')?.addEventListener('click', () => {
  window.GA4Tracker.trackRedPillStep(0, 'journey_start', 'start', 0);
});

// Red Pill - Elección izquierda/derecha
document.getElementById('left-option')?.addEventListener('click', () => {
  const currentStep = getCurrentJourneyStep(); // Función que debes implementar
  const stepName = getStepName(currentStep);   // Función que debes implementar
  const progress = (currentStep / getTotalSteps()) * 100;
  
  window.GA4Tracker.trackRedPillStep(currentStep, stepName, 'left', progress);
});

document.getElementById('right-option')?.addEventListener('click', () => {
  const currentStep = getCurrentJourneyStep();
  const stepName = getStepName(currentStep);
  const progress = (currentStep / getTotalSteps()) * 100;
  
  window.GA4Tracker.trackRedPillStep(currentStep, stepName, 'right', progress);
});

// Video principal - Eventos de reproducción
const mainVideo = document.querySelector('video');
if (mainVideo) {
  mainVideo.addEventListener('play', () => {
    window.GA4Tracker.trackVideoInteraction(
      'play', 
      mainVideo.currentTime, 
      mainVideo.duration, 
      'button'
    );
  });

  mainVideo.addEventListener('pause', () => {
    window.GA4Tracker.trackVideoInteraction(
      'pause', 
      mainVideo.currentTime, 
      mainVideo.duration, 
      'button'
    );
  });

  mainVideo.addEventListener('ended', () => {
    window.GA4Tracker.trackVideoInteraction(
      'complete', 
      mainVideo.currentTime, 
      mainVideo.duration, 
      'timeline'
    );
  });
}`,

      'merchant': `/**
 * 🏪 GA4 Events - Merchant Section
 * 
 * Ejemplos específicos para la sección Merchant
 */

// Tracking de interacciones de productos/servicios
document.querySelectorAll('.product-card, .service-item').forEach(item => {
  item.addEventListener('click', () => {
    window.GA4Tracker.trackEvent('merchant_product_view', {
      product_id: item.dataset.productId || 'unknown',
      product_name: item.querySelector('.product-name')?.textContent || 'unknown',
      product_category: item.dataset.category || 'general',
      interaction_type: 'click'
    });
  });
});

// Formularios de contacto o compra
document.querySelectorAll('form[data-merchant-form]').forEach(form => {
  form.addEventListener('submit', (e) => {
    window.GA4Tracker.trackEvent('merchant_form_submit', {
      form_type: form.dataset.formType || 'contact',
      form_id: form.id || 'unknown',
      fields_completed: form.querySelectorAll('input:not(:empty), textarea:not(:empty)').length
    });
  });
});`,

      'pilgrim': `/**
 * 🎒 GA4 Events - Pilgrim Section
 * 
 * Ejemplos específicos para la sección Pilgrim
 */

// Tracking de navegación por el journey del peregrino
document.querySelectorAll('.pilgrim-step, .journey-marker').forEach(step => {
  step.addEventListener('click', () => {
    window.GA4Tracker.trackEvent('pilgrim_journey_step', {
      step_id: step.dataset.stepId || 'unknown',
      step_name: step.dataset.stepName || 'unknown',
      step_type: step.dataset.stepType || 'checkpoint',
      progress_percentage: calculatePilgrimProgress() // Función a implementar
    });
  });
});

// Interacciones con mapa o elementos interactivos
document.querySelectorAll('.interactive-element').forEach(element => {
  element.addEventListener('click', () => {
    window.GA4Tracker.trackEvent('pilgrim_interactive_element', {
      element_type: element.dataset.elementType || 'unknown',
      element_id: element.id || 'unknown',
      interaction_method: 'click'
    });
  });
});`
    };

    return examples[section] || '// No hay ejemplos específicos para esta sección';
  }

  /**
   * Genera documentación completa
   */
  private async generateDocumentation(): Promise<void> {
    console.log('\n📚 Generando documentación...');

    const documentation = this.generateCompleteDocumentation();
    const docPath = path.join(this.config.projectPath, 'GA4-INTEGRATION-GUIDE.md');
    
    fs.writeFileSync(docPath, documentation, 'utf8');
    console.log(`✅ Documentación generada: ${docPath}`);
  }

  /**
   * Genera la documentación completa
   */
  private generateCompleteDocumentation(): string {
    return `# 📊 Google Analytics 4 (GA4) Integration Guide - CoomÜnity Platform

## 🎯 Resumen de la Integración

Este documento describe la integración completa de Google Analytics 4 en la plataforma CoomÜnity, incluyendo el tracking de eventos específicos para las heurísticas UX implementadas.

## 📁 Archivos Generados

- \`shared/js/ga4-events.js\` - Módulo principal de tracking
- \`shared/js/ga4-examples-red-pill.js\` - Ejemplos para sección Red Pill
- \`shared/js/ga4-examples-merchant.js\` - Ejemplos para sección Merchant
- \`shared/js/ga4-examples-pilgrim.js\` - Ejemplos para sección Pilgrim

## 🔧 Configuración Inicial

### 1. Reemplazar Measurement ID

⚠️ **IMPORTANTE**: Reemplaza \`${this.config.measurementId}\` en todos los archivos HTML con tu Measurement ID real de GA4.

Para obtener tu Measurement ID:
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad GA4
3. Copia el Measurement ID (formato: G-COOMUNITY123)

### 2. Incluir el Módulo de Eventos

Añade al final de tu JavaScript Manager principal:

\`\`\`javascript
// Cargar módulo de GA4 Events
const script = document.createElement('script');
script.src = 'shared/js/ga4-events.js';
document.head.appendChild(script);
\`\`\`

## 🎯 Eventos Definidos

${this.eventDefinitions.map(event => `
### ${event.name}
**Descripción**: ${event.description}
**Ubicación**: ${event.location}

**Parámetros**:
${Object.entries(event.parameters).map(([key, type]) => `- \`${key}\`: ${type}`).join('\n')}

**Ejemplo de uso**:
\`\`\`javascript
${event.example}
\`\`\`
`).join('\n')}

## 🔌 Integración en JavaScript Manager

### Loading Manager
\`\`\`javascript
class LoadingManager {
  showLoading(componentName) {
    this.loadingStartTime = Date.now();
    window.GA4Tracker?.trackLoadingState('start', 'component', componentName);
    // ... resto del código
  }
  
  hideLoading(componentName) {
    const duration = Date.now() - this.loadingStartTime;
    window.GA4Tracker?.trackLoadingState('end', 'component', componentName, duration);
    // ... resto del código
  }
}
\`\`\`

### Red Pill Manager
\`\`\`javascript
class RedPillManager {
  handleChoice(choice) {
    window.GA4Tracker?.trackRedPillStep(
      this.currentStep,
      this.steps[this.currentStep].name,
      choice,
      (this.currentStep / this.totalSteps) * 100
    );
    // ... resto del código
  }
}
\`\`\`

### Video Manager
\`\`\`javascript
class VideoManager {
  onVideoPlay() {
    window.GA4Tracker?.trackVideoInteraction(
      'play',
      this.video.currentTime,
      this.video.duration,
      'button'
    );
  }
}
\`\`\`

## 📈 Custom Dimensions Recomendadas

Configura estas dimensiones personalizadas en GA4:

1. **section_name** - Sección actual del sitio
2. **ux_heuristic** - Heurística UX específica
3. **user_journey_step** - Paso en el journey del usuario
4. **device_type** - Tipo de dispositivo (mobile/tablet/desktop)
5. **personalization_level** - Nivel de personalización del usuario

## 🔍 Reports Personalizados

### Report de UX Heuristics
- **Métrica**: Eventos por heurística
- **Dimensiones**: ux_heuristic, section_name
- **Filtros**: event_name contiene "heuristic"

### Report de Red Pill Journey
- **Métrica**: Progreso del journey
- **Dimensiones**: red_pill_journey_step, choice_made
- **Filtros**: event_name = "red_pill_journey_step"

### Report de Performance UX
- **Métrica**: Duración de loading
- **Dimensiones**: loading_type, component_name
- **Filtros**: event_name = "loading_state_change"

## 🚨 Troubleshooting

### GA4 no está cargando
1. Verifica que el Measurement ID sea correcto
2. Revisa la consola del navegador por errores
3. Confirma que no hay adblockers interfiriendo

### Eventos no se envían
1. Verifica que \`window.GA4Tracker\` esté disponible
2. Revisa la cola de eventos: \`window.GA4Tracker.eventQueue\`
3. Llama manualmente: \`window.GA4Tracker.processEventQueue()\`

### Datos inconsistentes
1. Verifica que los parámetros de eventos sean consistentes
2. Revisa la configuración de custom dimensions
3. Confirma que el timezone esté configurado correctamente

## 📝 Próximos Pasos

1. **Testing**: Probar en modo debug de GA4
2. **Validación**: Usar GA4 DebugView para verificar eventos
3. **Optimización**: Ajustar parámetros basado en datos reales
4. **Expansión**: Añadir más eventos específicos según necesidades

## 📞 Soporte

Para preguntas sobre esta integración:
- Revisa la documentación oficial de GA4
- Consulta los ejemplos en los archivos \`ga4-examples-*.js\`
- Revisa la consola del navegador para logs de debug

---

**Última actualización**: ${new Date().toISOString()}
**Versión**: 1.0.0
`;
  }
}

// ==================== EJECUCIÓN DEL SCRIPT ====================

async function main() {
  console.log('🧪 GA4 Integration Script - CoomÜnity Platform\n');

  // Configuración por defecto
  const config: GA4Config = {
    measurementId: 'G-COOMUNITY123', // ⚠️ REEMPLAZAR con ID real
    projectPath: 'data/backups/my_recovered_website',
    generateEventTracking: true,
    createBackup: false // Cambiar a true en producción
  };

  // Verificar que el directorio del proyecto existe
  if (!fs.existsSync(config.projectPath)) {
    console.error(`❌ Error: Directorio del proyecto no encontrado: ${config.projectPath}`);
    console.log('💡 Ajusta la ruta en la configuración del script');
    process.exit(1);
  }

  try {
    const integrator = new GA4Integrator(config);
    await integrator.integrate();
    
    console.log('\n🎉 ¡Integración de GA4 completada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Reemplaza G-COOMUNITY123 con tu Measurement ID real');
    console.log('2. Incluye ga4-events.js en tu JavaScript Manager');
    console.log('3. Implementa los ejemplos de tracking en cada sección');
    console.log('4. Prueba los eventos en GA4 DebugView');
    console.log('5. Revisa GA4-INTEGRATION-GUIDE.md para más detalles');
    
  } catch (error) {
    console.error('❌ Error durante la ejecución:', error);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

export { GA4Integrator, GA4Config }; 