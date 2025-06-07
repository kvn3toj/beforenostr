/**
 * ========================================================================
 * ⚡ PERFORMANCE & LOADING MANAGER - HEURÍSTICA UX 15
 * ========================================================================
 * 
 * Gestiona la experiencia de carga y performance
 * 
 * Funcionalidades:
 * - Gestión de estados de carga múltiples
 * - Monitoreo de performance en tiempo real
 * - Lazy loading inteligente
 * - Skeleton screens dinámicos
 * - Indicadores de progreso contextuales
 * - Optimización de performance percibido
 * - Gestión de conexión de red
 * - Métricas de Core Web Vitals
 * 
 * ========================================================================
 */

class PerformanceLoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.performanceMetrics = {};
    this.connectionInfo = {};
    this.lazyElements = new Set();
    this.skeletonObserver = null;
    this.performanceObserver = null;
    this.intersectionObserver = null;
    this.loadingOverlay = null;
    this.progressIndicators = new Map();
    this.resourceLoadTimes = new Map();
    this.criticalResourcesLoaded = false;
    this.pageLoadStart = performance.now();
    
    this.init();
  }

  /**
   * Inicializa el sistema de performance y loading
   */
  init() {
    this.setupPerformanceMonitoring();
    this.setupNetworkMonitoring();
    this.setupLazyLoading();
    this.createLoadingOverlay();
    this.setupIntersectionObserver();
    this.monitorCoreWebVitals();
    this.setupResourceLoadTracking();
    this.optimizeInitialRender();
    
    console.log('⚡ Performance & Loading Manager initialized');
  }

  /**
   * =====================================
   * 📊 PERFORMANCE MONITORING
   * =====================================
   */

  setupPerformanceMonitoring() {
    // Monitor performance API
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      // Observar diferentes tipos de métricas
      try {
        this.performanceObserver.observe({ entryTypes: ['navigation', 'resource', 'measure', 'paint'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported:', e);
      }
    }

    // Monitor FPS
    this.startFPSMonitoring();
    
    // Monitor Memory (si está disponible)
    this.monitorMemoryUsage();
  }

  processPerformanceEntry(entry) {
    switch (entry.entryType) {
      case 'navigation':
        this.processNavigationEntry(entry);
        break;
      case 'resource':
        this.processResourceEntry(entry);
        break;
      case 'paint':
        this.processPaintEntry(entry);
        break;
      case 'measure':
        this.processMeasureEntry(entry);
        break;
    }
  }

  processNavigationEntry(entry) {
    this.performanceMetrics.navigationTiming = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      domInteractive: entry.domInteractive - entry.fetchStart,
      firstByte: entry.responseStart - entry.fetchStart,
      dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcpConnection: entry.connectEnd - entry.connectStart,
      serverResponse: entry.responseEnd - entry.responseStart,
      domParsing: entry.domComplete - entry.domLoading,
      resourceLoad: entry.loadEventStart - entry.domContentLoadedEventEnd
    };

    this.updatePerformanceUI();
  }

  processResourceEntry(entry) {
    const resourceType = this.getResourceType(entry.name);
    const loadTime = entry.responseEnd - entry.fetchStart;
    
    this.resourceLoadTimes.set(entry.name, {
      type: resourceType,
      loadTime: loadTime,
      size: entry.transferSize || entry.decodedBodySize,
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0
    });

    // Track slow resources
    if (loadTime > 1000) { // > 1 second
      this.reportSlowResource(entry.name, loadTime, resourceType);
    }
  }

  processPaintEntry(entry) {
    this.performanceMetrics[entry.name.replace('-', '')] = entry.startTime;
    
    if (entry.name === 'first-contentful-paint') {
      this.showPerformanceIndicator('FCP', entry.startTime);
    }
  }

  getResourceType(url) {
    const extension = url.split('.').pop()?.toLowerCase();
    const typeMap = {
      'js': 'script',
      'css': 'stylesheet',
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'webp': 'image',
      'svg': 'image',
      'woff': 'font',
      'woff2': 'font',
      'ttf': 'font'
    };
    
    return typeMap[extension] || 'other';
  }

  startFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime >= lastTime + 1000) {
        this.performanceMetrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        this.updateFPSIndicator();
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        this.performanceMetrics.memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
        };
        
        this.updateMemoryIndicator();
      }, 5000);
    }
  }

  /**
   * =====================================
   * 🌐 NETWORK MONITORING
   * =====================================
   */

  setupNetworkMonitoring() {
    // Network Information API
    if ('connection' in navigator) {
      this.updateConnectionInfo();
      
      navigator.connection.addEventListener('change', () => {
        this.updateConnectionInfo();
        this.adaptToConnectionSpeed();
      });
    }

    // Online/Offline status
    window.addEventListener('online', () => this.handleConnectionChange('online'));
    window.addEventListener('offline', () => this.handleConnectionChange('offline'));
    
    // Initial status
    this.handleConnectionChange(navigator.onLine ? 'online' : 'offline');
  }

  updateConnectionInfo() {
    if ('connection' in navigator) {
      this.connectionInfo = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
      
      this.showConnectionIndicator();
    }
  }

  handleConnectionChange(status) {
    this.connectionInfo.status = status;
    this.showConnectionIndicator();
    
    if (status === 'offline') {
      this.showOfflineMessage();
    } else {
      this.hideOfflineMessage();
    }
  }

  showConnectionIndicator() {
    let indicator = document.querySelector('.connection-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'connection-indicator';
      document.body.appendChild(indicator);
    }
    
    const { status, effectiveType } = this.connectionInfo;
    
    if (status === 'offline') {
      indicator.textContent = 'Sin conexión';
      indicator.className = 'connection-indicator connection-offline visible';
    } else if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      indicator.textContent = 'Conexión lenta';
      indicator.className = 'connection-indicator connection-slow visible';
    } else {
      indicator.textContent = 'Conectado';
      indicator.className = 'connection-indicator connection-online visible';
      
      // Auto-hide after 3 seconds if connection is good
      setTimeout(() => {
        indicator.classList.remove('visible');
      }, 3000);
    }
  }

  adaptToConnectionSpeed() {
    const { effectiveType, saveData } = this.connectionInfo;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g' || saveData) {
      // Reducir calidad de imágenes
      this.enableDataSaver();
    } else {
      this.disableDataSaver();
    }
  }

  enableDataSaver() {
    document.documentElement.classList.add('data-saver-mode');
    
    // Pausar animaciones no esenciales
    const animations = document.querySelectorAll('.loading-spinner, .skeleton');
    animations.forEach(el => el.style.animationPlayState = 'paused');
    
    this.showMessage('Modo de ahorro de datos activado', 'info');
  }

  disableDataSaver() {
    document.documentElement.classList.remove('data-saver-mode');
    
    // Reanudar animaciones
    const animations = document.querySelectorAll('.loading-spinner, .skeleton');
    animations.forEach(el => el.style.animationPlayState = 'running');
  }

  /**
   * =====================================
   * 🎯 LOADING STATES MANAGEMENT
   * ===================================== 
   */

  showLoading(elementOrId, options = {}) {
    const element = typeof elementOrId === 'string' 
      ? document.getElementById(elementOrId) 
      : elementOrId;
    
    if (!element) return null;
    
    const loadingId = this.generateLoadingId();
    const config = {
      type: options.type || 'spinner',
      message: options.message || 'Cargando...',
      overlay: options.overlay !== false,
      skeleton: options.skeleton || false,
      progress: options.progress || false,
      ...options
    };
    
    this.loadingStates.set(loadingId, {
      element,
      config,
      startTime: performance.now()
    });
    
    this.renderLoadingState(element, config);
    
    return loadingId;
  }

  renderLoadingState(element, config) {
    // Limpiar estados anteriores
    this.clearElementLoading(element);
    
    if (config.skeleton) {
      this.renderSkeleton(element, config);
    } else if (config.overlay) {
      this.renderOverlayLoading(element, config);
    } else {
      this.renderInlineLoading(element, config);
    }
  }

  renderSkeleton(element, config) {
    const skeletonType = config.skeletonType || this.detectSkeletonType(element);
    const skeleton = this.createSkeleton(skeletonType);
    
    element.style.position = 'relative';
    element.appendChild(skeleton);
    element.classList.add('element-loading');
  }

  createSkeleton(type) {
    const skeleton = document.createElement('div');
    skeleton.className = 'loading-skeleton-overlay';
    
    let content = '';
    
    switch (type) {
      case 'card':
        content = `
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton-paragraph">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
          </div>
          <div class="skeleton skeleton-button"></div>
        `;
        break;
      case 'list':
        content = Array(3).fill().map(() => `
          <div class="list-item-loading">
            <div class="skeleton skeleton-avatar"></div>
            <div class="skeleton-content">
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text"></div>
            </div>
          </div>
        `).join('');
        break;
      case 'text':
        content = `
          <div class="skeleton-paragraph">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
          </div>
        `;
        break;
      default:
        content = '<div class="skeleton skeleton-image"></div>';
    }
    
    skeleton.innerHTML = content;
    return skeleton;
  }

  detectSkeletonType(element) {
    if (element.querySelector('img')) return 'image';
    if (element.classList.contains('card')) return 'card';
    if (element.tagName === 'UL' || element.tagName === 'OL') return 'list';
    return 'text';
  }

  renderOverlayLoading(element, config) {
    const overlay = document.createElement('div');
    overlay.className = 'element-loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        ${this.getLoadingSpinner(config.type)}
        ${config.message ? `<div class="loading-message">${config.message}</div>` : ''}
        ${config.progress ? this.createProgressBar() : ''}
      </div>
    `;
    
    element.style.position = 'relative';
    element.appendChild(overlay);
    element.classList.add('element-loading');
  }

  renderInlineLoading(element, config) {
    const loading = document.createElement('div');
    loading.className = 'loading-inline';
    loading.innerHTML = `
      ${this.getLoadingSpinner(config.type)}
      <span>${config.message}</span>
    `;
    
    element.appendChild(loading);
    element.classList.add('element-loading');
  }

  getLoadingSpinner(type) {
    switch (type) {
      case 'dots':
        return '<div class="loading-dots"><span></span><span></span><span></span></div>';
      case 'pulse':
        return '<div class="loading-pulse"></div>';
      case 'wave':
        return '<div class="loading-wave"><span></span><span></span><span></span><span></span><span></span></div>';
      case 'typing':
        return '<div class="loading-typing"><span></span><span></span><span></span></div>';
      default:
        return '<div class="loading-spinner"></div>';
    }
  }

  updateProgress(loadingId, progress, message) {
    const loadingState = this.loadingStates.get(loadingId);
    if (!loadingState) return;
    
    const progressBar = loadingState.element.querySelector('.progress-bar');
    const progressText = loadingState.element.querySelector('.progress-text');
    const progressPercentage = loadingState.element.querySelector('.progress-percentage');
    
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
    
    if (progressText && message) {
      progressText.textContent = message;
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${Math.round(progress)}%`;
    }
  }

  hideLoading(loadingId) {
    const loadingState = this.loadingStates.get(loadingId);
    if (!loadingState) return;
    
    const { element } = loadingState;
    const loadTime = performance.now() - loadingState.startTime;
    
    this.clearElementLoading(element);
    this.loadingStates.delete(loadingId);
    
    // Track loading performance
    this.trackLoadingPerformance(loadingId, loadTime);
  }

  clearElementLoading(element) {
    element.classList.remove('element-loading');
    
    // Remover overlays y skeletons
    const overlays = element.querySelectorAll('.element-loading-overlay, .loading-skeleton-overlay, .loading-inline');
    overlays.forEach(overlay => overlay.remove());
  }

  /**
   * =====================================
   * 🖼️ LAZY LOADING SYSTEM
   * ===================================== 
   */

  setupLazyLoading() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadLazyElement(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Buscar elementos lazy iniciales
    this.scanForLazyElements();
    
    // Observer para nuevos elementos
    this.setupMutationObserver();
  }

  scanForLazyElements() {
    const lazyElements = document.querySelectorAll('[data-lazy], [loading="lazy"]');
    lazyElements.forEach(element => this.registerLazyElement(element));
  }

  registerLazyElement(element) {
    if (this.lazyElements.has(element)) return;
    
    this.lazyElements.add(element);
    this.intersectionObserver.observe(element);
    
    // Añadir placeholder si no tiene
    if (!element.querySelector('.lazy-placeholder')) {
      this.addLazyPlaceholder(element);
    }
  }

  addLazyPlaceholder(element) {
    const placeholder = document.createElement('div');
    placeholder.className = 'lazy-placeholder';
    
    if (element.tagName === 'IMG') {
      // Para imágenes, usar las dimensiones si están disponibles
      const width = element.getAttribute('width') || 'auto';
      const height = element.getAttribute('height') || '200px';
      
      placeholder.style.width = width;
      placeholder.style.height = height;
      placeholder.innerHTML = '🖼️ Cargando imagen...';
      
      element.style.display = 'none';
      element.parentNode.insertBefore(placeholder, element);
    } else {
      placeholder.textContent = 'Cargando contenido...';
      element.appendChild(placeholder);
    }
    
    element.classList.add('lazy-container');
  }

  async loadLazyElement(element) {
    if (!this.lazyElements.has(element)) return;
    
    this.lazyElements.delete(element);
    this.intersectionObserver.unobserve(element);
    
    // Mostrar loading
    const loadingIndicator = this.addLoadingIndicator(element);
    
    try {
      await this.performLazyLoad(element);
      this.onLazyLoadSuccess(element);
    } catch (error) {
      this.onLazyLoadError(element, error);
    } finally {
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
    }
  }

  async performLazyLoad(element) {
    if (element.tagName === 'IMG') {
      return this.loadLazyImage(element);
    } else if (element.hasAttribute('data-lazy-src')) {
      return this.loadLazyContent(element);
    } else if (element.hasAttribute('data-lazy-component')) {
      return this.loadLazyComponent(element);
    }
  }

  loadLazyImage(img) {
    return new Promise((resolve, reject) => {
      const src = img.getAttribute('data-lazy') || img.getAttribute('data-src');
      if (!src) {
        reject(new Error('No lazy source specified'));
        return;
      }
      
      const tempImg = new Image();
      tempImg.onload = () => {
        img.src = src;
        img.style.display = '';
        resolve();
      };
      tempImg.onerror = () => reject(new Error('Failed to load image'));
      tempImg.src = src;
    });
  }

  async loadLazyContent(element) {
    const src = element.getAttribute('data-lazy-src');
    if (!src) throw new Error('No lazy source specified');
    
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
    
    const content = await response.text();
    element.innerHTML = content;
  }

  async loadLazyComponent(element) {
    const componentName = element.getAttribute('data-lazy-component');
    if (!componentName) throw new Error('No component specified');
    
    // Simulación de carga de componente dinámico
    await new Promise(resolve => setTimeout(resolve, 500));
    
    element.innerHTML = `<div class="lazy-loaded-component">${componentName} loaded!</div>`;
  }

  addLoadingIndicator(element) {
    const loading = document.createElement('div');
    loading.className = 'lazy-loading';
    loading.innerHTML = '<div class="loading-spinner-small"></div>';
    
    element.appendChild(loading);
    return loading;
  }

  onLazyLoadSuccess(element) {
    // Remover placeholder
    const placeholder = element.querySelector('.lazy-placeholder');
    if (placeholder) {
      placeholder.remove();
    }
    
    // Añadir clase de cargado
    element.classList.add('lazy-loaded');
    element.classList.remove('lazy-container');
    
    // Trigger event
    element.dispatchEvent(new CustomEvent('lazyloaded', {
      detail: { element }
    }));
  }

  onLazyLoadError(element, error) {
    console.error('Lazy load failed:', error);
    
    // Mostrar mensaje de error
    const placeholder = element.querySelector('.lazy-placeholder');
    if (placeholder) {
      placeholder.className = 'lazy-placeholder lazy-error';
      placeholder.textContent = 'Error al cargar contenido';
    }
    
    // Trigger error event
    element.dispatchEvent(new CustomEvent('lazyloaderror', {
      detail: { element, error }
    }));
  }

  /**
   * =====================================
   * 📊 CORE WEB VITALS
   * ===================================== 
   */

  monitorCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
  }

  observeLCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.performanceMetrics.lcp = lastEntry.startTime;
          this.updateWebVitalsUI();
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }
    }
  }

  observeFID() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.performanceMetrics.fid = entry.processingStart - entry.startTime;
            this.updateWebVitalsUI();
          });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID monitoring not supported');
      }
    }
  }

  observeCLS() {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.performanceMetrics.cls = clsValue;
          this.updateWebVitalsUI();
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }
    }
  }

  /**
   * =====================================
   * 🎨 UI UPDATES & INDICATORS
   * ===================================== 
   */

  createLoadingOverlay() {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.className = 'loading-overlay hidden';
    this.loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner-large"></div>
        <div class="loading-message">Cargando...</div>
        <div class="loading-submessage">Por favor espere</div>
      </div>
    `;
    
    document.body.appendChild(this.loadingOverlay);
  }

  showGlobalLoading(message = 'Cargando...', submessage = '') {
    if (this.loadingOverlay) {
      this.loadingOverlay.querySelector('.loading-message').textContent = message;
      this.loadingOverlay.querySelector('.loading-submessage').textContent = submessage;
      this.loadingOverlay.classList.remove('hidden');
    }
  }

  hideGlobalLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden');
    }
  }

  updatePerformanceUI() {
    // Actualizar métricas en UI si existe un panel
    const metricsPanel = document.querySelector('.performance-metrics');
    if (metricsPanel) {
      this.renderPerformanceMetrics(metricsPanel);
    }
  }

  renderPerformanceMetrics(container) {
    const metrics = this.performanceMetrics;
    
    container.innerHTML = `
      <div class="performance-metric">
        <div class="performance-metric-value">${this.formatMetric(metrics.firstcontentfulpaint)}</div>
        <div class="performance-metric-label">FCP</div>
      </div>
      <div class="performance-metric">
        <div class="performance-metric-value">${this.formatMetric(metrics.lcp)}</div>
        <div class="performance-metric-label">LCP</div>
      </div>
      <div class="performance-metric">
        <div class="performance-metric-value">${this.formatMetric(metrics.fid)}</div>
        <div class="performance-metric-label">FID</div>
      </div>
      <div class="performance-metric">
        <div class="performance-metric-value">${this.formatMetric(metrics.cls, 'score')}</div>
        <div class="performance-metric-label">CLS</div>
      </div>
      <div class="performance-metric">
        <div class="performance-metric-value">${metrics.fps || '--'}</div>
        <div class="performance-metric-label">FPS</div>
      </div>
    `;
  }

  formatMetric(value, type = 'time') {
    if (value === undefined || value === null) return '--';
    
    if (type === 'time') {
      return value < 1000 ? `${Math.round(value)}ms` : `${(value / 1000).toFixed(1)}s`;
    } else if (type === 'score') {
      return value.toFixed(3);
    }
    
    return value.toString();
  }

  showPerformanceIndicator(metric, value) {
    const indicator = document.createElement('div');
    indicator.className = `performance-indicator ${this.getPerformanceClass(metric, value)}`;
    indicator.textContent = `${metric}: ${this.formatMetric(value)}`;
    
    // Posicionar en esquina
    indicator.style.position = 'fixed';
    indicator.style.top = '20px';
    indicator.style.left = '20px';
    indicator.style.zIndex = '9999';
    
    document.body.appendChild(indicator);
    
    // Auto-remove después de 3 segundos
    setTimeout(() => indicator.remove(), 3000);
  }

  getPerformanceClass(metric, value) {
    const thresholds = {
      'FCP': { good: 1800, poor: 3000 },
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 }
    };
    
    const threshold = thresholds[metric];
    if (!threshold) return 'performance-moderate';
    
    if (value <= threshold.good) return 'performance-good';
    if (value <= threshold.poor) return 'performance-moderate';
    return 'performance-poor';
  }

  /**
   * =====================================
   * 🔧 UTILITY METHODS
   * ===================================== 
   */

  generateLoadingId() {
    return `loading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createProgressBar() {
    return `
      <div class="progress-with-text">
        <div class="progress-container">
          <div class="progress-bar" style="width: 0%"></div>
        </div>
        <div class="progress-text">Iniciando...</div>
        <div class="progress-percentage">0%</div>
      </div>
    `;
  }

  optimizeInitialRender() {
    // Priorizar recursos críticos
    this.prioritizeCriticalResources();
    
    // Precargar recursos importantes
    this.preloadCriticalResources();
    
    // Optimizar fuentes
    this.optimizeFontLoading();
  }

  prioritizeCriticalResources() {
    // Añadir fetchpriority a recursos críticos
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
      img.setAttribute('fetchpriority', 'high');
    });
    
    const criticalStyles = document.querySelectorAll('link[rel="stylesheet"][data-critical]');
    criticalStyles.forEach(link => {
      link.setAttribute('fetchpriority', 'high');
    });
  }

  preloadCriticalResources() {
    const criticalResources = [
      { href: '/shared/css/unified-styles.css', as: 'style' },
      // Añadir más recursos críticos según sea necesario
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  }

  optimizeFontLoading() {
    // Precargar fuentes críticas
    const criticalFonts = [
      '/shared/fonts/primary-font.woff2',
      // Añadir fuentes según el diseño
    ];
    
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = fontUrl;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Buscar nuevos elementos lazy
            if (node.hasAttribute && (node.hasAttribute('data-lazy') || node.hasAttribute('loading'))) {
              this.registerLazyElement(node);
            }
            
            // Buscar elementos lazy en hijos
            const lazyChildren = node.querySelectorAll && node.querySelectorAll('[data-lazy], [loading="lazy"]');
            if (lazyChildren) {
              lazyChildren.forEach(child => this.registerLazyElement(child));
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupResourceLoadTracking() {
    // Track cuando todos los recursos críticos han cargado
    window.addEventListener('load', () => {
      this.criticalResourcesLoaded = true;
      const totalLoadTime = performance.now() - this.pageLoadStart;
      
      this.performanceMetrics.totalLoadTime = totalLoadTime;
      console.log(`⚡ Page fully loaded in ${totalLoadTime.toFixed(2)}ms`);
    });
  }

  trackLoadingPerformance(loadingId, loadTime) {
    // Analytics para performance de loading
    if (window.analytics) {
      window.analytics.track('Loading Performance', {
        loadingId,
        loadTime,
        timestamp: new Date()
      });
    }
  }

  reportSlowResource(url, loadTime, type) {
    console.warn(`⚡ Slow ${type} resource detected:`, {
      url: url.substring(url.lastIndexOf('/') + 1),
      loadTime: `${loadTime.toFixed(2)}ms`,
      type
    });
  }

  showMessage(message, type = 'info') {
    if (window.errorRecovery) {
      window.errorRecovery.showErrorMessage({
        id: this.generateLoadingId(),
        type: 'performance',
        severity: type,
        message,
        timestamp: new Date(),
        recoveryActions: []
      });
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  showOfflineMessage() {
    this.showMessage('Sin conexión a internet. Algunas funciones pueden no estar disponibles.', 'warning');
  }

  hideOfflineMessage() {
    // Ocultar mensaje de offline si existe un sistema de notificaciones
    if (window.errorRecovery) {
      // Implementar lógica para ocultar notificaciones específicas
    }
  }

  updateFPSIndicator() {
    // Actualizar indicador FPS si existe
    const fpsIndicator = document.querySelector('.fps-indicator');
    if (fpsIndicator) {
      fpsIndicator.textContent = `${this.performanceMetrics.fps} FPS`;
      
      // Colorear según performance
      if (this.performanceMetrics.fps >= 55) {
        fpsIndicator.className = 'fps-indicator performance-good';
      } else if (this.performanceMetrics.fps >= 30) {
        fpsIndicator.className = 'fps-indicator performance-moderate';
      } else {
        fpsIndicator.className = 'fps-indicator performance-poor';
      }
    }
  }

  updateMemoryIndicator() {
    // Actualizar indicador de memoria si existe
    const memoryIndicator = document.querySelector('.memory-indicator');
    if (memoryIndicator && this.performanceMetrics.memory) {
      const { used, total } = this.performanceMetrics.memory;
      const percentage = (used / total) * 100;
      
      memoryIndicator.textContent = `${used}MB (${percentage.toFixed(1)}%)`;
      
      if (percentage < 70) {
        memoryIndicator.className = 'memory-indicator performance-good';
      } else if (percentage < 85) {
        memoryIndicator.className = 'memory-indicator performance-moderate';
      } else {
        memoryIndicator.className = 'memory-indicator performance-poor';
      }
    }
  }

  updateWebVitalsUI() {
    // Actualizar panel de Core Web Vitals si existe
    const vitalsPanel = document.querySelector('.web-vitals-panel');
    if (vitalsPanel) {
      const { lcp, fid, cls } = this.performanceMetrics;
      
      vitalsPanel.innerHTML = `
        <div class="vital-metric ${this.getPerformanceClass('LCP', lcp)}">
          <span class="vital-label">LCP</span>
          <span class="vital-value">${this.formatMetric(lcp)}</span>
        </div>
        <div class="vital-metric ${this.getPerformanceClass('FID', fid)}">
          <span class="vital-label">FID</span>
          <span class="vital-value">${this.formatMetric(fid)}</span>
        </div>
        <div class="vital-metric ${this.getPerformanceClass('CLS', cls)}">
          <span class="vital-label">CLS</span>
          <span class="vital-value">${this.formatMetric(cls, 'score')}</span>
        </div>
      `;
    }
  }

  /**
   * =====================================
   * 🌐 PUBLIC API
   * ===================================== 
   */

  // API para mostrar loading
  loading(element, options) {
    return this.showLoading(element, options);
  }

  // API para ocultar loading
  loaded(loadingId) {
    this.hideLoading(loadingId);
  }

  // API para actualizar progreso
  progress(loadingId, value, message) {
    this.updateProgress(loadingId, value, message);
  }

  // API para obtener métricas
  getMetrics() {
    return { ...this.performanceMetrics };
  }

  // API para obtener info de conexión
  getConnectionInfo() {
    return { ...this.connectionInfo };
  }

  // Cleanup al destruir
  destroy() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    if (this.loadingOverlay) {
      this.loadingOverlay.remove();
    }
    
    this.loadingStates.clear();
    this.lazyElements.clear();
    this.progressIndicators.clear();
  }
}

// Inicialización automática
let performanceLoadingManager;

document.addEventListener('DOMContentLoaded', () => {
  performanceLoadingManager = new PerformanceLoadingManager();
  
  // Hacer disponible globalmente
  window.performanceLoadingManager = performanceLoadingManager;
  
  console.log('⚡ Performance & Loading System Ready');
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceLoadingManager;
} 