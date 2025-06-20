/**
 * ========================================================================
 * 🎪 ENHANCED RECOMMENDATION MANAGER - DEMO & INTEGRATION
 * ========================================================================
 * 
 * Demostración completa del sistema de recomendaciones avanzado
 * Incluye ejemplos de integración, casos de uso y mejores prácticas
 * 
 * ========================================================================
 */

class RecommendationDemo {
  constructor() {
    this.demoConfig = {
      autoStart: true,
      showLogs: true,
      simulateUserBehavior: true,
      demoScenarios: ['new_user', 'returning_user', 'power_user']
    };
    
    this.currentScenario = 'new_user';
    this.demoData = new Map();
    this.behaviorSimulator = null;
    
    this.init();
  }

  init() {
    console.log('🎪 Starting Enhanced Recommendation Manager Demo');
    
    // Esperar a que el manager esté listo
    this.waitForManager(() => {
      this.setupDemoEnvironment();
      this.startDemoScenarios();
      this.setupDemoControls();
    });
  }

  waitForManager(callback) {
    if (window.enhancedRecommendationManager) {
      callback();
    } else {
      setTimeout(() => this.waitForManager(callback), 100);
    }
  }

  setupDemoEnvironment() {
    // Crear contenedor para la demo
    this.createDemoUI();
    
    // Configurar eventos de demostración
    this.setupDemoEventListeners();
    
    // Inicializar simulador de comportamiento
    this.initializeBehaviorSimulator();
  }

  createDemoUI() {
    const demoContainer = document.createElement('div');
    demoContainer.id = 'recommendation-demo-container';
    demoContainer.innerHTML = `
      <div class="demo-header">
        <h1>🤖 Enhanced Recommendation System Demo</h1>
        <div class="demo-controls">
          <select id="scenario-selector">
            <option value="new_user">Nuevo Usuario</option>
            <option value="returning_user">Usuario Recurrente</option>
            <option value="power_user">Usuario Avanzado</option>
          </select>
          <button id="simulate-behavior">Simular Comportamiento</button>
          <button id="reset-profile">Resetear Perfil</button>
          <button id="export-data">Exportar Datos ML</button>
        </div>
      </div>
      
      <div class="demo-sections">
        <div class="demo-section">
          <h2>📊 Métricas en Tiempo Real</h2>
          <div id="live-metrics"></div>
        </div>
        
        <div class="demo-section">
          <h2>🎯 Recomendaciones Personalizadas</h2>
          <div id="recommendations-container"></div>
        </div>
        
        <div class="demo-section">
          <h2>👤 Perfil de Usuario</h2>
          <div id="user-profile-display"></div>
        </div>
        
        <div class="demo-section">
          <h2>🧪 A/B Testing</h2>
          <div id="ab-test-results"></div>
        </div>
        
        <div class="demo-section">
          <h2>📈 Analytics & Insights</h2>
          <div id="analytics-dashboard"></div>
        </div>
      </div>
      
      <div class="demo-logs">
        <h3>🔍 System Logs</h3>
        <div id="demo-logs"></div>
      </div>
    `;

    // Insertar en el DOM
    document.body.appendChild(demoContainer);
    
    // Aplicar estilos
    this.applyDemoStyles();
  }

  applyDemoStyles() {
    const styles = `
      <style>
        #recommendation-demo-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          background: #f8f9fa;
          min-height: 100vh;
        }
        
        .demo-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        
        .demo-header h1 {
          margin: 0 0 1rem 0;
          font-size: 2rem;
          font-weight: 600;
        }
        
        .demo-controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .demo-controls select,
        .demo-controls button {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .demo-controls select {
          background: white;
          color: #2d3748;
        }
        
        .demo-controls button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .demo-controls button:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .demo-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .demo-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }
        
        .demo-section h2 {
          margin: 0 0 1rem 0;
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 600;
          border-bottom: 2px solid #edf2f7;
          padding-bottom: 0.5rem;
        }
        
        .demo-logs {
          background: #1a202c;
          color: #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.85rem;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .demo-logs h3 {
          margin: 0 0 1rem 0;
          color: #a0aec0;
        }
        
        .metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #edf2f7;
        }
        
        .metric-value {
          font-weight: 600;
          color: #667eea;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #edf2f7;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .demo-sections {
            grid-template-columns: 1fr;
          }
          
          .demo-controls {
            flex-direction: column;
          }
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }

  setupDemoEventListeners() {
    // Selector de escenarios
    document.getElementById('scenario-selector').addEventListener('change', (e) => {
      this.switchScenario(e.target.value);
    });

    // Simular comportamiento
    document.getElementById('simulate-behavior').addEventListener('click', () => {
      this.simulateUserBehavior();
    });

    // Resetear perfil
    document.getElementById('reset-profile').addEventListener('click', () => {
      this.resetUserProfile();
    });

    // Exportar datos ML
    document.getElementById('export-data').addEventListener('click', () => {
      this.exportMLData();
    });
  }

  startDemoScenarios() {
    // Actualizar métricas cada 2 segundos
    setInterval(() => {
      this.updateLiveMetrics();
      this.updateUserProfileDisplay();
      this.updateABTestResults();
      this.updateAnalyticsDashboard();
    }, 2000);

    // Mostrar recomendaciones iniciales
    this.displayRecommendations();
  }

  switchScenario(scenario) {
    this.currentScenario = scenario;
    this.log(`🔄 Switching to scenario: ${scenario}`);
    
    // Configurar perfil según el escenario
    this.configureScenarioProfile(scenario);
    
    // Actualizar recomendaciones
    this.displayRecommendations();
  }

  configureScenarioProfile(scenario) {
    const manager = window.enhancedRecommendationManager;
    
    switch (scenario) {
      case 'new_user':
        // Perfil de usuario nuevo
        manager.userProfile.behaviorMetrics.engagementScore = 0.1;
        manager.userProfile.preferences.categories.clear();
        this.log('📱 Configured new user profile');
        break;
        
      case 'returning_user':
        // Usuario que regresa
        manager.userProfile.behaviorMetrics.engagementScore = 0.6;
        manager.userProfile.preferences.categories.set('pilgrim', 3);
        manager.userProfile.preferences.categories.set('community', 2);
        this.log('🔄 Configured returning user profile');
        break;
        
      case 'power_user':
        // Usuario avanzado
        manager.userProfile.behaviorMetrics.engagementScore = 0.9;
        manager.userProfile.preferences.categories.set('pilgrim', 5);
        manager.userProfile.preferences.categories.set('red-pill', 4);
        manager.userProfile.preferences.categories.set('merchant', 3);
        this.log('⚡ Configured power user profile');
        break;
    }
  }

  initializeBehaviorSimulator() {
    this.behaviorSimulator = {
      patterns: {
        new_user: {
          clickRate: 0.1,
          timeSpent: 30000,
          categories: ['community', 'education']
        },
        returning_user: {
          clickRate: 0.4,
          timeSpent: 120000,
          categories: ['pilgrim', 'community', 'merchant']
        },
        power_user: {
          clickRate: 0.7,
          timeSpent: 300000,
          categories: ['pilgrim', 'red-pill', 'merchant', 'challenges']
        }
      }
    };
  }

  simulateUserBehavior() {
    const pattern = this.behaviorSimulator.patterns[this.currentScenario];
    const manager = window.enhancedRecommendationManager;
    
    this.log(`🎭 Simulating ${this.currentScenario} behavior...`);
    
    // Simular clicks en recomendaciones
    const recommendations = document.querySelectorAll('.recommendation-card');
    recommendations.forEach((card, index) => {
      if (Math.random() < pattern.clickRate) {
        setTimeout(() => {
          card.click();
          this.log(`👆 Simulated click on recommendation ${index + 1}`);
        }, index * 500);
      }
    });

    // Simular tiempo gastado
    pattern.categories.forEach(category => {
      const currentTime = manager.userProfile.behaviorMetrics.timeSpent.get(category) || 0;
      manager.userProfile.behaviorMetrics.timeSpent.set(category, currentTime + pattern.timeSpent);
    });

    // Simular feedback implícito
    setTimeout(() => {
      manager.trackMLInteraction('simulated_engagement', {
        scenario: this.currentScenario,
        pattern: pattern,
        timestamp: Date.now()
      });
      this.log('📊 Simulated implicit feedback recorded');
    }, 2000);
  }

  resetUserProfile() {
    const manager = window.enhancedRecommendationManager;
    
    // Resetear perfil
    manager.userProfile.preferences.categories.clear();
    manager.userProfile.behaviorMetrics.clickFrequency.clear();
    manager.userProfile.behaviorMetrics.timeSpent.clear();
    manager.userProfile.behaviorMetrics.engagementScore = 0;
    manager.mlMetrics.interactions = [];
    
    // Limpiar localStorage
    localStorage.removeItem('coomunity_enhanced_profile');
    
    this.log('🔄 User profile reset successfully');
    
    // Actualizar displays
    this.updateLiveMetrics();
    this.updateUserProfileDisplay();
    this.displayRecommendations();
  }

  exportMLData() {
    const manager = window.enhancedRecommendationManager;
    const mlData = manager.exportMLData();
    
    // Crear y descargar archivo JSON
    const dataStr = JSON.stringify(mlData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `ml-data-${Date.now()}.json`;
    downloadLink.click();
    
    URL.revokeObjectURL(url);
    
    this.log(`📁 ML data exported (${mlData.interactions.length} interactions)`);
  }

  updateLiveMetrics() {
    const manager = window.enhancedRecommendationManager;
    const container = document.getElementById('live-metrics');
    
    if (!container) return;
    
    const metrics = {
      'Engagement Score': (manager.userProfile.behaviorMetrics.engagementScore * 100).toFixed(1) + '%',
      'Total Interactions': manager.mlMetrics.interactions.length,
      'Categories Explored': manager.userProfile.preferences.categories.size,
      'Session Time': this.formatDuration(Date.now() - manager.sessionStartTime),
      'A/B Test Variant': manager.abTestConfig?.currentVariant || 'N/A',
      'Cache Size': manager.recommendationCache.size
    };
    
    container.innerHTML = Object.entries(metrics)
      .map(([key, value]) => `
        <div class="metric-item">
          <span>${key}</span>
          <span class="metric-value">${value}</span>
        </div>
      `).join('');
  }

  updateUserProfileDisplay() {
    const manager = window.enhancedRecommendationManager;
    const container = document.getElementById('user-profile-display');
    
    if (!container) return;
    
    const topCategories = Array.from(manager.userProfile.preferences.categories.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    const featureVector = manager.extractFeatureVector();
    
    container.innerHTML = `
      <div>
        <h4>🏷️ Top Categories</h4>
        ${topCategories.map(([category, score]) => `
          <div class="metric-item">
            <span>${category}</span>
            <span class="metric-value">${score.toFixed(1)}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(score * 20, 100)}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 1rem;">
        <h4>🧠 ML Feature Vector</h4>
        <div style="font-family: monospace; font-size: 0.8rem; background: #f7fafc; padding: 0.5rem; border-radius: 4px;">
          [${featureVector.map(f => f.toFixed(3)).join(', ')}]
        </div>
      </div>
    `;
  }

  updateABTestResults() {
    const manager = window.enhancedRecommendationManager;
    const container = document.getElementById('ab-test-results');
    
    if (!container || !manager.abTestConfig) return;
    
    const experiments = Array.from(manager.abTestConfig.experiments.entries());
    
    container.innerHTML = `
      <div>
        <div class="metric-item">
          <span>Current Variant</span>
          <span class="metric-value">${manager.abTestConfig.currentVariant}</span>
        </div>
        
        ${experiments.map(([name, data]) => `
          <div style="margin-top: 1rem;">
            <h4>${name}</h4>
            <div class="metric-item">
              <span>Variant</span>
              <span class="metric-value">${data.variant}</span>
            </div>
            <div class="metric-item">
              <span>Conversions</span>
              <span class="metric-value">${data.conversions}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  updateAnalyticsDashboard() {
    const manager = window.enhancedRecommendationManager;
    const container = document.getElementById('analytics-dashboard');
    
    if (!container) return;
    
    const analytics = this.calculateAnalytics(manager);
    
    container.innerHTML = `
      <div class="metric-item">
        <span>Recommendation CTR</span>
        <span class="metric-value">${(analytics.ctr * 100).toFixed(2)}%</span>
      </div>
      <div class="metric-item">
        <span>Avg Session Duration</span>
        <span class="metric-value">${this.formatDuration(analytics.avgSessionDuration)}</span>
      </div>
      <div class="metric-item">
        <span>User Retention</span>
        <span class="metric-value">${(analytics.retention * 100).toFixed(1)}%</span>
      </div>
      <div class="metric-item">
        <span>Personalization Level</span>
        <span class="metric-value">${manager.userProfile.personalizationLevel}/4</span>
      </div>
    `;
  }

  calculateAnalytics(manager) {
    const interactions = manager.mlMetrics.interactions;
    const impressions = interactions.filter(i => i.type === 'recommendation_impression').length;
    const clicks = interactions.filter(i => i.type === 'recommendation_engagement').length;
    
    const sessionData = manager.mlMetrics.sessionData;
    const avgSessionDuration = sessionData.length > 0 
      ? sessionData.reduce((sum, s) => sum + (s.endTime - s.startTime), 0) / sessionData.length
      : Date.now() - manager.sessionStartTime;
    
    return {
      ctr: impressions > 0 ? clicks / impressions : 0,
      avgSessionDuration: avgSessionDuration,
      retention: manager.userProfile.behaviorMetrics.engagementScore
    };
  }

  displayRecommendations() {
    const manager = window.enhancedRecommendationManager;
    manager.displayRecommendations('recommendations-container');
    this.log('🎯 Recommendations updated');
  }

  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  log(message) {
    if (!this.demoConfig.showLogs) return;
    
    const logsContainer = document.getElementById('demo-logs');
    if (!logsContainer) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.innerHTML = `<span style="color: #a0aec0;">[${timestamp}]</span> ${message}`;
    
    logsContainer.appendChild(logEntry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
    
    // Limitar a 100 logs
    while (logsContainer.children.length > 100) {
      logsContainer.removeChild(logsContainer.firstChild);
    }
  }
}

// Función para crear página de demostración completa
function createRecommendationDemoPage() {
  // Crear estructura HTML básica
  document.body.innerHTML = `
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enhanced Recommendation System Demo</title>
      <link rel="stylesheet" href="./shared/css/enhanced-recommendations.css">
    </head>
    <body>
      <!-- El contenido será generado por RecommendationDemo -->
    </body>
  `;
  
  // Cargar scripts necesarios
  const scripts = [
    './shared/js/enhanced-recommendation-manager.js',
    './shared/js/enhanced-recommendation-manager-helpers.js',
    './shared/js/enhanced-recommendation-manager-optimizations.js'
  ];
  
  let loadedScripts = 0;
  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      loadedScripts++;
      if (loadedScripts === scripts.length) {
        // Todos los scripts cargados, iniciar demo
        setTimeout(() => {
          new RecommendationDemo();
        }, 500);
      }
    };
    document.head.appendChild(script);
  });
}

// Casos de uso específicos para diferentes tipos de sitios web
const integrationExamples = {
  
  // E-commerce
  ecommerce: {
    setup: function() {
      const manager = window.enhancedRecommendationManager;
      
      // Configurar tracking de productos
      manager.trackProductView = function(productId, category, price) {
        this.trackMLInteraction('product_view', {
          productId,
          category,
          price,
          timestamp: Date.now()
        });
        
        // Actualizar preferencias de categoría
        const currentPref = this.userProfile.preferences.categories.get(category) || 0;
        this.userProfile.preferences.categories.set(category, currentPref + 0.5);
      };
      
      // Configurar tracking de compras
      manager.trackPurchase = function(productId, category, price) {
        this.trackMLConversion(productId, 'purchase');
        this.trackMLInteraction('purchase', {
          productId,
          category,
          price,
          value: price,
          timestamp: Date.now()
        });
      };
    },
    
    usage: `
      // Ejemplo de uso en e-commerce
      const manager = window.enhancedRecommendationManager;
      
      // En página de producto
      manager.trackProductView('prod_123', 'electronics', 299.99);
      
      // En carrito/checkout
      manager.trackPurchase('prod_123', 'electronics', 299.99);
      
      // Obtener recomendaciones de productos
      manager.getRecommendations({ 
        category: 'electronics',
        priceRange: [200, 500]
      });
    `
  },
  
  // Blog/Contenido
  blog: {
    setup: function() {
      const manager = window.enhancedRecommendationManager;
      
      // Tracking de lectura de artículos
      manager.trackArticleRead = function(articleId, category, readTime) {
        this.trackMLInteraction('article_read', {
          articleId,
          category,
          readTime,
          timestamp: Date.now()
        });
        
        // Marcar como conversión si leyó más del 70%
        if (readTime > 0.7) {
          this.trackMLConversion(articleId, 'read_completion');
        }
      };
    },
    
    usage: `
      // Ejemplo de uso en blog
      const manager = window.enhancedRecommendationManager;
      
      // Tracking de scroll para medir tiempo de lectura
      let startTime = Date.now();
      window.addEventListener('beforeunload', () => {
        const readTime = (Date.now() - startTime) / 1000;
        manager.trackArticleRead('article_456', 'technology', readTime);
      });
    `
  },
  
  // Plataforma educativa
  education: {
    setup: function() {
      const manager = window.enhancedRecommendationManager;
      
      // Tracking de cursos
      manager.trackCourseProgress = function(courseId, category, progress) {
        this.trackMLInteraction('course_progress', {
          courseId,
          category,
          progress,
          timestamp: Date.now()
        });
        
        // Actualizar nivel de expertise
        const currentLevel = this.userProfile.behaviorMetrics.expertiseLevel.get(category) || 0;
        this.userProfile.behaviorMetrics.expertiseLevel.set(category, Math.max(currentLevel, progress));
      };
    },
    
    usage: `
      // Ejemplo de uso en plataforma educativa
      const manager = window.enhancedRecommendationManager;
      
      // Tracking de progreso de curso
      manager.trackCourseProgress('course_789', 'javascript', 0.85);
      
      // Recomendaciones basadas en nivel
      const userLevel = manager.userProfile.behaviorMetrics.expertiseLevel.get('javascript') || 0;
      manager.getRecommendations({ 
        category: 'javascript',
        difficulty: userLevel > 0.7 ? 'advanced' : 'intermediate'
      });
    `
  }
};

// Export para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    RecommendationDemo, 
    createRecommendationDemoPage,
    integrationExamples 
  };
}

// Auto-inicialización si la URL contiene parámetro demo
if (typeof window !== 'undefined' && window.location.search.includes('demo=recommendations')) {
  document.addEventListener('DOMContentLoaded', () => {
    createRecommendationDemoPage();
  });
}

console.log('🎪 Enhanced Recommendation Demo utilities loaded'); 