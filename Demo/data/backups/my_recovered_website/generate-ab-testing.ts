#!/usr/bin/env npx tsx

/**
 * 🧪 A/B Testing Infrastructure Generator - CoomÜnity Platform
 * 
 * Este script genera código JavaScript para implementar A/B testing
 * del lado del cliente en el proyecto web unificado.
 * 
 * Funcionalidades:
 * - Asignación aleatoria de grupos A/B con persistencia
 * - Integración con GA4 para tracking
 * - Implementación de test de densidad de interfaz
 * - Medición de impacto y conversiones
 * 
 * Uso: npx tsx generate-ab-testing.ts
 */

import { promises as fs } from 'fs';
import path from 'path';

interface ABTestConfig {
  testName: string;
  description: string;
  variants: {
    [key: string]: {
      name: string;
      description: string;
      modifications: string[];
    };
  };
  targetElements?: string[];
  conversionEvents?: string[];
}

class ABTestingGenerator {
  private readonly jsOutputPath = './shared/js/ab-testing-manager.js';
  private readonly cssOutputPath = './shared/css/ab-testing-variations.css';
  private readonly docsOutputPath = './AB-TESTING-IMPLEMENTATION-GUIDE.md';

  constructor() {
    console.log('🧪 Iniciando generador de infraestructura A/B Testing...');
  }

  /**
   * Generar toda la infraestructura de A/B Testing
   */
  async generateABTestingInfrastructure(): Promise<void> {
    try {
      // Configuración del test de densidad de interfaz
      const densityTestConfig: ABTestConfig = {
        testName: 'interface_density',
        description: 'Test de impacto de la densidad de interfaz en la experiencia del usuario',
        variants: {
          A: {
            name: 'Control - Densidad Normal',
            description: 'Interfaz con densidad normal (como está actualmente)',
            modifications: ['density-normal']
          },
          B: {
            name: 'Variante - Densidad Compacta',
            description: 'Interfaz con densidad compacta para mayor eficiencia',
            modifications: ['density-compact', 'reduced-spacing', 'compact-elements']
          }
        },
        targetElements: [
          '.adaptive-container',
          '.contextual-card',
          '.adaptive-grid',
          '.smart-suggestions',
          '.adaptive-navigation'
        ],
        conversionEvents: [
          'button_click',
          'navigation_use',
          'feature_discovery',
          'task_completion',
          'session_duration'
        ]
      };

      // Generar archivos
      await this.generateJavaScriptManager(densityTestConfig);
      await this.generateCSSVariations(densityTestConfig);
      await this.generateImplementationGuide(densityTestConfig);

      console.log('✅ Infraestructura A/B Testing generada exitosamente');
      console.log(`📄 JavaScript Manager: ${this.jsOutputPath}`);
      console.log(`🎨 CSS Variations: ${this.cssOutputPath}`);
      console.log(`📖 Implementation Guide: ${this.docsOutputPath}`);

    } catch (error) {
      console.error('❌ Error generando infraestructura A/B Testing:', error);
      process.exit(1);
    }
  }

  /**
   * Generar el JavaScript Manager para A/B Testing
   */
  private async generateJavaScriptManager(config: ABTestConfig): Promise<void> {
    const jsContent = `/**
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
      console.log(\`🎯 Usuario ya asignado al grupo \${existingGroup} para test \${testName}\`);
      return existingGroup;
    }

    // Asignación aleatoria con distribución 50/50
    const randomIndex = Math.floor(Math.random() * variants.length);
    const assignedGroup = variants[randomIndex];

    // Guardar asignación en localStorage
    this.saveUserGroup(testName, assignedGroup);

    // Enviar evento a GA4
    this.trackABAssignment(testName, assignedGroup);

    console.log(\`🎲 Usuario asignado al grupo \${assignedGroup} para test \${testName}\`);
    return assignedGroup;
  }

  /**
   * Obtiene el grupo asignado para un test específico
   */
  getUserGroup(testName) {
    const stored = localStorage.getItem(\`ab_test_\${testName}\`);
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
      localStorage.setItem(\`ab_test_\${testName}\`, JSON.stringify(data));
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
    this.registerTest('${config.testName}', {
      name: '${config.description}',
      variants: ${JSON.stringify(config.variants, null, 6)},
      targetElements: ${JSON.stringify(config.targetElements, null, 6)},
      conversionEvents: ${JSON.stringify(config.conversionEvents, null, 6)}
    });
  }

  /**
   * Registra un test A/B específico
   */
  registerTest(testName, testConfig) {
    this.currentTests.set(testName, testConfig);
    
    // Asignar grupo si no existe
    const userGroup = this.assignABGroup(testName, Object.keys(testConfig.variants));
    
    console.log(\`📊 Test registrado: \${testName}, Grupo: \${userGroup}\`);
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
    body.classList.add(\`ab-test-\${testName}\`);
    body.classList.add(\`ab-group-\${group.toLowerCase()}\`);
    
    // Aplicar modificaciones específicas
    variant.modifications.forEach(modification => {
      body.classList.add(\`ab-\${modification}\`);
    });

    // Trackear aplicación de variante
    this.trackVariantApplication(testName, group, variant.name);
    
    console.log(\`🎨 Variante aplicada: \${testName} - \${variant.name}\`);
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

    console.log(\`💰 Conversión trackeada: \${conversionType}\`, testContext);
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
    return test?.variants[group]?.name || \`Group \${group}\`;
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
    if (element.id) return \`#\${element.id}\`;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.length > 0);
      if (classes.length > 0) return \`.\${classes.join('.')}\`;
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
      viewport_size: \`\${window.innerWidth}x\${window.innerHeight}\`,
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
    
    localStorage.removeItem(\`ab_test_\${testName}\`);
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
});`;

    await fs.writeFile(this.jsOutputPath, jsContent, 'utf8');
  }

  /**
   * Generar CSS para las variaciones de A/B Testing
   */
  private async generateCSSVariations(config: ABTestConfig): Promise<void> {
    const cssContent = `/* ========================================================================
   🧪 A/B TESTING VARIATIONS - CoomÜnity Platform
   ========================================================================
   
   Estilos específicos para las variantes de A/B testing.
   Generado automáticamente por generate-ab-testing.ts
   
   Test Activo: ${config.description}
   
   ======================================================================== */

/* =====================================
   🎯 TEST: DENSIDAD DE INTERFAZ
   ===================================== */

/* Grupo A: Control (Densidad Normal) */
.ab-test-interface_density.ab-group-a {
  --current-density: var(--adaptive-density-normal, 1);
  --current-spacing: var(--spacing-md, 16px);
  --current-padding: var(--spacing-lg, 24px);
}

/* Grupo B: Variante (Densidad Compacta) */
.ab-test-interface_density.ab-group-b {
  --current-density: var(--adaptive-density-compact, 0.75);
  --current-spacing: calc(var(--spacing-md, 16px) * 0.75);
  --current-padding: calc(var(--spacing-lg, 24px) * 0.75);
}

/* =====================================
   🔧 MODIFICACIONES ESPECÍFICAS - GRUPO B
   ===================================== */

/* Densidad Compacta */
.ab-density-compact .adaptive-container {
  padding: calc(var(--current-padding) * 0.75);
  margin: calc(var(--spacing-sm, 8px) * 0.75) 0;
}

.ab-density-compact .contextual-card {
  padding: calc(var(--spacing-md, 16px) * 0.75);
  margin-bottom: calc(var(--spacing-sm, 8px) * 0.75);
  border-radius: calc(var(--border-radius-lg, 12px) * 0.85);
}

.ab-density-compact .adaptive-grid {
  gap: calc(var(--current-spacing) * 0.75);
}

/* Espaciado Reducido */
.ab-reduced-spacing .smart-suggestions {
  padding: calc(var(--spacing-sm, 8px) * 0.75);
  margin: calc(var(--spacing-md, 16px) * 0.75) 0;
}

.ab-reduced-spacing .suggestion-item {
  padding: calc(var(--spacing-xs, 4px) * 0.75) calc(var(--spacing-sm, 8px) * 0.75);
  margin-bottom: calc(var(--spacing-xs, 4px) * 0.75);
}

.ab-reduced-spacing .adaptive-navigation {
  padding: calc(var(--spacing-sm, 8px) * 0.75) calc(var(--spacing-md, 16px) * 0.75);
}

.ab-reduced-spacing .adaptive-nav-item {
  padding: calc(var(--spacing-xs, 4px) * 0.75) calc(var(--spacing-sm, 8px) * 0.75);
  margin: 0 calc(var(--spacing-xs, 4px) * 0.75);
}

/* Elementos Compactos */
.ab-compact-elements .contextual-card h3 {
  font-size: calc(var(--font-size-lg, 1.125rem) * 0.9);
  margin-bottom: calc(var(--spacing-xs, 4px) * 0.75);
}

.ab-compact-elements .contextual-card p {
  font-size: calc(var(--font-size-base, 1rem) * 0.9);
  line-height: calc(var(--line-height-relaxed, 1.625) * 0.95);
}

.ab-compact-elements .adaptive-control {
  padding: calc(var(--spacing-xs, 4px) * 0.75) calc(var(--spacing-sm, 8px) * 0.75);
  font-size: calc(var(--font-size-sm, 0.875rem) * 0.95);
}

.ab-compact-elements .learning-badge {
  padding: calc(var(--spacing-xs, 4px) * 0.5) calc(var(--spacing-sm, 8px) * 0.75);
  font-size: calc(var(--font-size-xs, 0.75rem) * 0.9);
}

/* =====================================
   📱 RESPONSIVE ADAPTATIONS
   ===================================== */

/* Mobile - Densidad Compacta */
@media (max-width: 768px) {
  .ab-test-interface_density.ab-group-b .adaptive-container {
    padding: calc(var(--spacing-sm, 8px) * 0.75);
  }
  
  .ab-test-interface_density.ab-group-b .contextual-card {
    padding: calc(var(--spacing-sm, 8px) * 0.75);
    margin-bottom: calc(var(--spacing-xs, 4px) * 0.75);
  }
  
  .ab-test-interface_density.ab-group-b .adaptive-grid {
    gap: calc(var(--spacing-xs, 4px) * 0.75);
  }
}

/* Tablet - Densidad Compacta */
@media (min-width: 768px) and (max-width: 1024px) {
  .ab-test-interface_density.ab-group-b .adaptive-container {
    padding: calc(var(--spacing-md, 16px) * 0.75);
  }
  
  .ab-test-interface_density.ab-group-b .adaptive-grid {
    gap: calc(var(--spacing-sm, 8px) * 0.75);
  }
}

/* =====================================
   🎨 VISUAL INDICATORS
   ===================================== */

/* Indicador visual para desarrollo/debug */
.ab-test-interface_density::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 4px;
  height: 4px;
  background: var(--adaptive-accent, #10b981);
  z-index: 9999;
  opacity: 0.8;
  border-radius: 50%;
}

.ab-test-interface_density.ab-group-a::before {
  background: #3b82f6; /* Azul para Grupo A */
}

.ab-test-interface_density.ab-group-b::before {
  background: #f59e0b; /* Naranja para Grupo B */
}

/* =====================================
   🔍 HOVER STATES & INTERACTIONS
   ===================================== */

/* Grupo B: Estados hover más sutiles para densidad compacta */
.ab-test-interface_density.ab-group-b .contextual-card:hover {
  transform: translateY(-2px); /* Reducido de -4px */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Reducido */
}

.ab-test-interface_density.ab-group-b .adaptive-nav-item:hover {
  padding: calc(var(--spacing-xs, 4px) * 0.75) calc(var(--spacing-sm, 8px) * 0.85);
  transition: padding 0.2s ease;
}

.ab-test-interface_density.ab-group-b .suggestion-item:hover {
  padding-left: calc(var(--spacing-sm, 8px) * 0.85);
  transition: padding-left 0.2s ease;
}

/* =====================================
   ♿ ACCESSIBILITY CONSIDERATIONS
   ===================================== */

/* Mantener tamaños mínimos para accesibilidad */
.ab-test-interface_density .adaptive-control {
  min-height: 44px; /* Tamaño mínimo táctil WCAG */
  min-width: 44px;
}

.ab-test-interface_density .contextual-card {
  min-height: 60px; /* Área mínima para interacción */
}

/* Contraste mejorado para elementos compactos */
.ab-test-interface_density.ab-group-b .contextual-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* =====================================
   🎯 CONVERSION TRACKING HELPERS
   ===================================== */

/* Elementos marcados para tracking de conversiones */
[data-ab-feature] {
  position: relative;
}

[data-ab-feature]:hover::after {
  content: '📊';
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 12px;
  opacity: 0.6;
  pointer-events: none;
}

/* Indicadores de elementos trackeados */
.ab-test-interface_density [data-ab-feature="navigation"] {
  border-left: 2px solid var(--adaptive-accent, #10b981);
}

.ab-test-interface_density [data-ab-feature="suggestions"] {
  border-top: 2px solid var(--adaptive-accent, #10b981);
}

.ab-test-interface_density [data-ab-feature="controls"] {
  border-right: 2px solid var(--adaptive-accent, #10b981);
}

/* =====================================
   🌙 DARK MODE SUPPORT
   ===================================== */

@media (prefers-color-scheme: dark) {
  .ab-test-interface_density.ab-group-b .contextual-card {
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.02);
  }
  
  .ab-test-interface_density::before {
    filter: brightness(1.3);
  }
}

/* =====================================
   🎛️ REDUCED MOTION SUPPORT
   ===================================== */

@media (prefers-reduced-motion: reduce) {
  .ab-test-interface_density .contextual-card:hover {
    transform: none;
  }
  
  .ab-test-interface_density .adaptive-nav-item:hover,
  .ab-test-interface_density .suggestion-item:hover {
    transition: none;
  }
}`;

    await fs.writeFile(this.cssOutputPath, cssContent, 'utf8');
  }

  /**
   * Generar guía de implementación
   */
  private async generateImplementationGuide(config: ABTestConfig): Promise<void> {
    const guideContent = `# 🧪 Guía de Implementación A/B Testing - CoomÜnity Platform

## 📋 Resumen del Test Implementado

**Test:** ${config.description}
**Fecha de Generación:** ${new Date().toISOString()}
**Variantes:**
${Object.entries(config.variants).map(([key, variant]) => 
  `- **Grupo ${key}:** ${variant.name} - ${variant.description}`
).join('\n')}

## 🚀 Instrucciones de Implementación

### 1. Integración en el JavaScript Manager

Añade la siguiente línea al final de \`shared/js/adaptive-contextual-manager.js\`:

\`\`\`javascript
// Cargar A/B Testing Manager
if (typeof window !== 'undefined') {
  import('./ab-testing-manager.js')
    .then(() => {
      console.log('🧪 A/B Testing Manager cargado exitosamente');
    })
    .catch(err => {
      console.warn('Error cargando A/B Testing Manager:', err);
    });
}
\`\`\`

### 2. Inclusión de CSS

Añade la referencia al CSS de variaciones en todas las páginas HTML:

\`\`\`html
<link rel="stylesheet" href="shared/css/ab-testing-variations.css">
\`\`\`

### 3. Marcado HTML para Tracking

Marca los elementos importantes con atributos de tracking:

\`\`\`html
<!-- Navegación -->
<nav class="adaptive-navigation" data-ab-feature="navigation">
  <a href="#" class="adaptive-nav-item">Inicio</a>
  <a href="#" class="adaptive-nav-item">Explorar</a>
</nav>

<!-- Sugerencias -->
<div class="smart-suggestions" data-ab-feature="suggestions">
  <div class="suggestion-item">Sugerencia personalizada</div>
</div>

<!-- Controles -->
<div class="adaptive-controls" data-ab-feature="controls">
  <button class="adaptive-control">Configuración</button>
</div>
\`\`\`

## 📊 Eventos de Tracking Configurados

### Eventos Automáticos
- \`ab_test_assignment\`: Asignación inicial de grupo
- \`ab_variant_applied\`: Aplicación de variante
- \`ab_page_view\`: Vista de página con contexto A/B
- \`ab_element_interaction\`: Interacciones con elementos
- \`ab_conversion\`: Eventos de conversión

### Conversiones Medidas
${config.conversionEvents?.map(event => `- \`${event}\`: Métricas de ${event.replace('_', ' ')}`).join('\n')}

## 🎯 Uso de la API Pública

\`\`\`javascript
// Obtener grupo asignado
const userGroup = window.ABTesting.getUserGroup('interface_density');

// Trackear conversión manual
window.ABTesting.trackConversion('custom_goal', {
  goal_type: 'newsletter_signup',
  source: 'header_cta'
});

// Obtener métricas del test
const metrics = window.ABTesting.getTestMetrics('interface_density');

// Ver tests activos
const activeTests = window.ABTesting.getActiveTests();
\`\`\`

## 📈 Análisis en GA4

### Configuración de Eventos Personalizados en GA4

1. **ab_test_assignment**
   - Parámetros: \`test_name\`, \`group\`, \`session_id\`
   - Usar para segmentación de audiencias

2. **ab_conversion**
   - Parámetros: \`conversion_type\`, \`test_context\`
   - Configurar como evento de conversión

### Métricas Clave a Monitorear

\`\`\`sql
-- Tasa de conversión por grupo
SELECT 
  test_name,
  group,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_conversions,
  COUNT(*) / COUNT(DISTINCT user_id) as conversion_rate
FROM ab_conversion_events
WHERE test_name = 'interface_density'
GROUP BY test_name, group;

-- Tiempo de sesión promedio por grupo
SELECT 
  test_name,
  group,
  AVG(duration_seconds) as avg_session_duration
FROM ab_session_duration_events
WHERE test_name = 'interface_density'
GROUP BY test_name, group;
\`\`\`

## 🔧 Configuraciones Avanzadas

### Personalizar Duración del Test

\`\`\`javascript
// Modificar en ab-testing-manager.js
const TEST_DURATION_DAYS = 30; // Cambiar según necesidad

// En la función getUserGroup, cambiar:
if (daysSinceAssignment < TEST_DURATION_DAYS) {
  return data.group;
}
\`\`\`

### Añadir Nuevos Tests

\`\`\`javascript
// En registerTests(), añadir:
this.registerTest('nuevo_test', {
  name: 'Descripción del nuevo test',
  variants: {
    A: { name: 'Control', modifications: ['control-class'] },
    B: { name: 'Variante', modifications: ['variant-class'] }
  },
  targetElements: ['.target-selector'],
  conversionEvents: ['conversion_type']
});
\`\`\`

## 🛡️ Consideraciones de Seguridad y Privacidad

- Los datos se almacenan localmente (localStorage/sessionStorage)
- Los IDs de usuario son generados aleatoriamente
- No se recopila información personal identificable
- Cumple con principios de minimización de datos

## 🧪 Validación y Testing

### Verificar Implementación

\`\`\`javascript
// En la consola del navegador:
console.log('Grupo asignado:', window.ABTesting.getUserGroup('interface_density'));
console.log('Tests activos:', window.ABTesting.getActiveTests());
\`\`\`

### Testing Manual

1. Abrir DevTools → Application → Local Storage
2. Verificar entradas \`ab_test_interface_density\`
3. Inspeccionar clases CSS aplicadas al \`<body>\`
4. Comprobar eventos en Network tab (GA4)

## 📋 Checklist de Implementación

- [ ] Archivo \`ab-testing-manager.js\` copiado a \`shared/js/\`
- [ ] Archivo \`ab-testing-variations.css\` copiado a \`shared/css/\`
- [ ] CSS incluido en todas las páginas
- [ ] JavaScript integrado en el manager principal
- [ ] Elementos marcados con \`data-ab-feature\`
- [ ] GA4 configurado para recibir eventos personalizados
- [ ] Tests de validación ejecutados
- [ ] Documentación del equipo actualizada

## 🎉 ¡Listo para Comenzar!

Tu infraestructura de A/B testing está configurada y lista para usar. El test de densidad de interfaz comenzará automáticamente cuando los usuarios visiten el sitio.

**Próximos Pasos:**
1. Monitorear eventos en GA4
2. Recopilar datos durante al menos 2 semanas
3. Analizar resultados estadísticamente
4. Implementar la variante ganadora

---

*Generado automáticamente por generate-ab-testing.ts*
*Fecha: ${new Date().toLocaleString()}*`;

    await fs.writeFile(this.docsOutputPath, guideContent, 'utf8');
  }
}

// Ejecutar el generador
const generator = new ABTestingGenerator();
generator.generateABTestingInfrastructure(); 