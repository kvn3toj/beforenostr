/**
 * ========================================================================
 * 🎯 VISUAL HIERARCHY MANAGER - HEURÍSTICA UX 14
 * ========================================================================
 * 
 * Gestiona la jerarquía visual y arquitectura de información
 * 
 * Funcionalidades:
 * - Análisis automático de jerarquía visual
 * - Optimización de flujo de lectura
 * - Agrupación inteligente de contenido
 * - Ajuste dinámico de espaciado
 * - Validación de estructura de información
 * - Indicadores de progreso visual
 * - Navegación por secciones
 * 
 * ========================================================================
 */

class VisualHierarchyManager {
  constructor() {
    this.hierarchyMap = new Map();
    this.contentSections = [];
    this.readingFlow = [];
    this.focusPath = [];
    this.progressIndicators = [];
    this.isAnalyzing = false;
    this.observer = null;
    this.readingProgress = 0;
    this.currentSection = null;
    this.tableOfContents = null;
    
    this.init();
  }

  /**
   * Inicializa el sistema de jerarquía visual
   */
  init() {
    this.analyzePageStructure();
    this.createTableOfContents();
    this.setupReadingProgressTracker();
    this.setupScrollSpy();
    this.setupIntersectionObserver();
    this.enhanceVisualFlow();
    this.setupKeyboardNavigation();
    this.applyDynamicSpacing();
    
    console.log('🎯 Visual Hierarchy Manager initialized');
  }

  /**
   * =====================================
   * 📊 HIERARCHY ANALYSIS
   * =====================================
   */

  analyzePageStructure() {
    this.isAnalyzing = true;
    
    // Analizar estructura de headings
    this.analyzeHeadingStructure();
    
    // Identificar secciones de contenido
    this.identifyContentSections();
    
    // Analizar flujo de lectura
    this.analyzeReadingFlow();
    
    // Validar jerarquía visual
    this.validateHierarchy();
    
    this.isAnalyzing = false;
    this.updateHierarchyUI();
  }

  analyzeHeadingStructure() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;
    let hierarchy = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();
      const id = heading.id || this.generateHeadingId(text, index);
      
      // Asegurar que el heading tenga un ID
      if (!heading.id) {
        heading.id = id;
      }
      
      const hierarchyItem = {
        element: heading,
        level: level,
        text: text,
        id: id,
        index: index,
        children: [],
        parent: null,
        section: null
      };
      
      // Validar saltos de nivel
      if (level > currentLevel + 1) {
        this.logHierarchyWarning(`Salto de nivel detectado: de H${currentLevel} a H${level}`, heading);
      }
      
      // Establecer relaciones padre-hijo
      this.establishHierarchyRelationships(hierarchyItem, hierarchy);
      
      hierarchy.push(hierarchyItem);
      this.hierarchyMap.set(id, hierarchyItem);
      currentLevel = level;
    });
    
    this.headingHierarchy = hierarchy;
    return hierarchy;
  }

  establishHierarchyRelationships(item, hierarchy) {
    // Encontrar el padre más cercano
    for (let i = hierarchy.length - 1; i >= 0; i--) {
      const potential = hierarchy[i];
      if (potential.level < item.level) {
        item.parent = potential;
        potential.children.push(item);
        break;
      }
    }
  }

  identifyContentSections() {
    const sections = document.querySelectorAll('section, article, main, .section, .hierarchy-section');
    
    sections.forEach((section, index) => {
      const sectionData = {
        element: section,
        id: section.id || `section-${index}`,
        headings: [],
        content: [],
        importance: this.calculateSectionImportance(section),
        readingTime: this.estimateReadingTime(section)
      };
      
      // Encontrar headings en esta sección
      const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
      sectionData.headings = Array.from(headings);
      
      // Identificar tipos de contenido
      sectionData.content = this.categorizeContent(section);
      
      this.contentSections.push(sectionData);
    });
    
    return this.contentSections;
  }

  calculateSectionImportance(section) {
    let importance = 0;
    
    // Importancia basada en headings
    const h1s = section.querySelectorAll('h1').length;
    const h2s = section.querySelectorAll('h2').length;
    const h3s = section.querySelectorAll('h3').length;
    
    importance += h1s * 10 + h2s * 5 + h3s * 2;
    
    // Importancia basada en contenido
    const paragraphs = section.querySelectorAll('p').length;
    const images = section.querySelectorAll('img').length;
    const lists = section.querySelectorAll('ul, ol').length;
    
    importance += paragraphs * 1 + images * 2 + lists * 1.5;
    
    // Importancia basada en posición
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const pageHeight = document.body.scrollHeight;
    const positionFactor = 1 - (sectionTop / pageHeight);
    
    importance *= (0.5 + positionFactor);
    
    return Math.round(importance);
  }

  categorizeContent(section) {
    const content = {
      text: section.querySelectorAll('p').length,
      images: section.querySelectorAll('img').length,
      lists: section.querySelectorAll('ul, ol').length,
      tables: section.querySelectorAll('table').length,
      forms: section.querySelectorAll('form').length,
      buttons: section.querySelectorAll('button, .btn').length,
      links: section.querySelectorAll('a').length
    };
    
    return content;
  }

  analyzeReadingFlow() {
    const readableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, td, caption');
    
    this.readingFlow = Array.from(readableElements).map((element, index) => {
      const rect = element.getBoundingClientRect();
      const styles = window.getComputedStyle(element);
      
      return {
        element: element,
        index: index,
        type: element.tagName.toLowerCase(),
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        styles: {
          fontSize: parseFloat(styles.fontSize),
          fontWeight: styles.fontWeight,
          color: styles.color,
          lineHeight: parseFloat(styles.lineHeight)
        },
        readingOrder: this.calculateReadingOrder(element, rect)
      };
    });
    
    // Ordenar por flujo de lectura natural
    this.readingFlow.sort((a, b) => a.readingOrder - b.readingOrder);
    
    return this.readingFlow;
  }

  calculateReadingOrder(element, rect) {
    // Orden de lectura basado en posición vertical principalmente
    const verticalWeight = rect.top * 1000;
    const horizontalWeight = rect.left;
    
    return verticalWeight + horizontalWeight;
  }

  /**
   * =====================================
   * 📚 TABLE OF CONTENTS
   * =====================================
   */

  createTableOfContents() {
    if (this.headingHierarchy.length === 0) return;
    
    this.tableOfContents = document.createElement('nav');
    this.tableOfContents.className = 'hierarchy-table-of-contents';
    this.tableOfContents.setAttribute('aria-label', 'Tabla de contenidos');
    
    const tocTitle = document.createElement('h3');
    tocTitle.textContent = 'Contenidos';
    tocTitle.className = 'hierarchy-toc-title';
    this.tableOfContents.appendChild(tocTitle);
    
    const tocList = this.createTOCList(this.headingHierarchy);
    this.tableOfContents.appendChild(tocList);
    
    // Insertar TOC después del primer heading principal
    const firstMainHeading = document.querySelector('h1, h2');
    if (firstMainHeading) {
      firstMainHeading.parentNode.insertBefore(this.tableOfContents, firstMainHeading.nextSibling);
    }
    
    // Añadir estilos específicos
    this.addTOCStyles();
  }

  createTOCList(headings) {
    const list = document.createElement('ol');
    list.className = 'hierarchy-toc-list';
    
    headings.forEach(heading => {
      if (heading.level <= 3) { // Solo mostrar hasta H3
        const listItem = document.createElement('li');
        listItem.className = `hierarchy-toc-item hierarchy-toc-level-${heading.level}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.text;
        link.className = 'hierarchy-toc-link';
        link.addEventListener('click', (e) => this.handleTOCClick(e, heading));
        
        listItem.appendChild(link);
        
        // Agregar indicador de progreso
        const progress = document.createElement('span');
        progress.className = 'hierarchy-toc-progress';
        listItem.appendChild(progress);
        
        list.appendChild(listItem);
      }
    });
    
    return list;
  }

  handleTOCClick(event, heading) {
    event.preventDefault();
    
    // Scroll suave al heading
    heading.element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Actualizar estado activo
    this.updateActiveSection(heading.id);
    
    // Registrar navegación
    this.trackSectionNavigation(heading);
  }

  addTOCStyles() {
    if (document.getElementById('hierarchy-toc-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'hierarchy-toc-styles';
    styles.textContent = `
      .hierarchy-table-of-contents {
        background: var(--hierarchy-highlight-bg);
        border: 1px solid var(--hierarchy-highlight-border);
        border-radius: var(--radius-md);
        padding: var(--hierarchy-space-lg);
        margin: var(--hierarchy-space-xl) 0;
        max-width: 300px;
        float: right;
        margin-left: var(--hierarchy-space-lg);
      }
      
      .hierarchy-toc-title {
        margin: 0 0 var(--hierarchy-space-md) 0;
        font-size: var(--hierarchy-h5);
        color: var(--hierarchy-accent-text);
      }
      
      .hierarchy-toc-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      
      .hierarchy-toc-item {
        margin-bottom: var(--hierarchy-space-xs);
        position: relative;
      }
      
      .hierarchy-toc-level-1 { padding-left: 0; }
      .hierarchy-toc-level-2 { padding-left: var(--hierarchy-space-md); }
      .hierarchy-toc-level-3 { padding-left: var(--hierarchy-space-lg); }
      
      .hierarchy-toc-link {
        color: var(--hierarchy-secondary-text);
        text-decoration: none;
        font-size: var(--hierarchy-caption);
        display: block;
        padding: var(--hierarchy-space-xs) 0;
        transition: color 0.2s ease;
      }
      
      .hierarchy-toc-link:hover {
        color: var(--hierarchy-accent-text);
      }
      
      .hierarchy-toc-item.active .hierarchy-toc-link {
        color: var(--hierarchy-accent-text);
        font-weight: var(--hierarchy-weight-secondary);
      }
      
      .hierarchy-toc-progress {
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        background: transparent;
        border-radius: 50%;
        transition: all 0.2s ease;
      }
      
      .hierarchy-toc-item.active .hierarchy-toc-progress {
        background: var(--hierarchy-accent-text);
      }
      
      @media (max-width: 768px) {
        .hierarchy-table-of-contents {
          float: none;
          margin: var(--hierarchy-space-lg) 0;
          max-width: 100%;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * =====================================
   * 📊 READING PROGRESS TRACKING
   * =====================================
   */

  setupReadingProgressTracker() {
    // Crear indicador de progreso
    this.createProgressIndicator();
    
    // Configurar tracking de scroll
    window.addEventListener('scroll', () => this.updateReadingProgress());
    
    // Tracking inicial
    this.updateReadingProgress();
  }

  createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'hierarchy-reading-progress';
    progressContainer.innerHTML = `
      <div class="hierarchy-progress-bar" id="reading-progress-bar"></div>
      <div class="hierarchy-progress-sections" id="progress-sections"></div>
    `;
    
    document.body.appendChild(progressContainer);
    
    // Añadir estilos
    this.addProgressStyles();
    
    // Crear marcadores de sección
    this.createSectionMarkers();
  }

  createSectionMarkers() {
    const sectionsContainer = document.getElementById('progress-sections');
    if (!sectionsContainer) return;
    
    this.contentSections.forEach((section, index) => {
      const marker = document.createElement('div');
      marker.className = 'hierarchy-section-marker';
      marker.style.left = `${(index / this.contentSections.length) * 100}%`;
      marker.title = section.headings[0]?.textContent || `Sección ${index + 1}`;
      marker.addEventListener('click', () => this.scrollToSection(section));
      
      sectionsContainer.appendChild(marker);
    });
  }

  updateReadingProgress() {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / documentHeight, 0), 1);
    
    this.readingProgress = progress;
    
    // Actualizar barra de progreso
    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
    
    // Actualizar sección actual
    this.updateCurrentSection();
  }

  updateCurrentSection() {
    const scrollTop = window.scrollY + window.innerHeight / 3; // Offset para mejor UX
    
    let newCurrentSection = null;
    
    for (const section of this.contentSections) {
      const sectionTop = section.element.getBoundingClientRect().top + window.scrollY;
      const sectionBottom = sectionTop + section.element.offsetHeight;
      
      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        newCurrentSection = section;
        break;
      }
    }
    
    if (newCurrentSection !== this.currentSection) {
      this.currentSection = newCurrentSection;
      this.updateActiveSection(newCurrentSection?.id);
      this.trackSectionEntry(newCurrentSection);
    }
  }

  updateActiveSection(sectionId) {
    // Actualizar TOC
    const tocItems = document.querySelectorAll('.hierarchy-toc-item');
    tocItems.forEach(item => item.classList.remove('active'));
    
    if (sectionId) {
      const activeLink = document.querySelector(`.hierarchy-toc-link[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.closest('.hierarchy-toc-item').classList.add('active');
      }
    }
  }

  addProgressStyles() {
    if (document.getElementById('hierarchy-progress-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'hierarchy-progress-styles';
    styles.textContent = `
      .hierarchy-reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: rgba(0, 0, 0, 0.1);
        z-index: var(--z-index-fixed);
      }
      
      .hierarchy-progress-bar {
        height: 100%;
        background: var(--hierarchy-accent-text);
        transition: width 0.1s ease;
        border-radius: 0 2px 2px 0;
      }
      
      .hierarchy-progress-sections {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
      }
      
      .hierarchy-section-marker {
        position: absolute;
        top: 0;
        width: 2px;
        height: 100%;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .hierarchy-section-marker:hover {
        background: white;
        transform: scaleX(2);
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * =====================================
   * 👁️ INTERSECTION OBSERVER
   * =====================================
   */

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleElementInView(entry);
        }
      });
    }, options);
    
    // Observar elementos importantes
    const importantElements = document.querySelectorAll('h1, h2, h3, .hierarchy-emphasis, .hierarchy-callout');
    importantElements.forEach(el => this.observer.observe(el));
  }

  handleElementInView(entry) {
    const element = entry.target;
    
    // Añadir clase para animaciones
    element.classList.add('hierarchy-in-view');
    
    // Tracking de visualización
    this.trackElementView(element, entry.intersectionRatio);
  }

  /**
   * =====================================
   * 🎨 VISUAL ENHANCEMENTS
   * =====================================
   */

  enhanceVisualFlow() {
    // Añadir indicadores de flujo visual
    this.addFlowIndicators();
    
    // Mejorar contraste automáticamente
    this.enhanceContrast();
    
    // Aplicar espaciado rítmico
    this.applyRhythmicSpacing();
    
    // Destacar elementos importantes
    this.highlightImportantElements();
  }

  addFlowIndicators() {
    const flowSteps = document.querySelectorAll('.hierarchy-flow-step');
    
    flowSteps.forEach((step, index) => {
      if (!step.querySelector('.flow-number')) {
        const number = document.createElement('span');
        number.className = 'flow-number';
        number.textContent = index + 1;
        step.insertBefore(number, step.firstChild);
      }
    });
  }

  enhanceContrast() {
    // Analizar contraste de texto
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td');
    
    textElements.forEach(element => {
      const contrast = this.calculateContrast(element);
      if (contrast < 4.5) { // WCAG AA standard
        this.improveElementContrast(element);
      }
    });
  }

  calculateContrast(element) {
    const styles = window.getComputedStyle(element);
    const color = this.parseColor(styles.color);
    const bgColor = this.parseColor(styles.backgroundColor);
    
    // Simplificado: calculación básica de contraste
    const colorLuminance = this.getLuminance(color);
    const bgLuminance = this.getLuminance(bgColor);
    
    const lighter = Math.max(colorLuminance, bgLuminance);
    const darker = Math.min(colorLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  parseColor(colorString) {
    // Simplificado: solo maneja rgb() y hex básicos
    if (colorString.startsWith('rgb')) {
      const matches = colorString.match(/\d+/g);
      return {
        r: parseInt(matches[0]),
        g: parseInt(matches[1]),
        b: parseInt(matches[2])
      };
    }
    
    // Default fallback
    return { r: 0, g: 0, b: 0 };
  }

  getLuminance({ r, g, b }) {
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;
    
    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  improveElementContrast(element) {
    element.classList.add('hierarchy-contrast-enhanced');
  }

  applyRhythmicSpacing() {
    const contentElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote');
    
    contentElements.forEach((element, index) => {
      const tagName = element.tagName.toLowerCase();
      const spacing = this.calculateOptimalSpacing(element, tagName);
      
      element.style.marginBottom = spacing;
    });
  }

  calculateOptimalSpacing(element, tagName) {
    const baseSpacing = 16; // 1rem
    const spacingMap = {
      h1: baseSpacing * 2,
      h2: baseSpacing * 1.5,
      h3: baseSpacing * 1.25,
      h4: baseSpacing * 1,
      h5: baseSpacing * 0.75,
      h6: baseSpacing * 0.5,
      p: baseSpacing,
      ul: baseSpacing,
      ol: baseSpacing,
      blockquote: baseSpacing * 1.5
    };
    
    return `${spacingMap[tagName] || baseSpacing}px`;
  }

  highlightImportantElements() {
    // Destacar elementos críticos
    const criticalElements = document.querySelectorAll('[data-critical], .hierarchy-emphasis, .hierarchy-callout');
    
    criticalElements.forEach(element => {
      if (!element.classList.contains('hierarchy-highlighted')) {
        element.classList.add('hierarchy-highlighted');
        this.addImportanceIndicator(element);
      }
    });
  }

  addImportanceIndicator(element) {
    const indicator = document.createElement('div');
    indicator.className = 'hierarchy-importance-indicator';
    indicator.title = 'Contenido importante';
    element.style.position = 'relative';
    element.appendChild(indicator);
  }

  /**
   * =====================================
   * ⌨️ KEYBOARD NAVIGATION
   * =====================================
   */

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            this.navigateToPreviousSection();
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.navigateToNextSection();
            break;
          case 'Home':
            e.preventDefault();
            this.navigateToTop();
            break;
          case 'End':
            e.preventDefault();
            this.navigateToBottom();
            break;
        }
      }
    });
  }

  navigateToPreviousSection() {
    const currentIndex = this.contentSections.findIndex(s => s === this.currentSection);
    const previousIndex = Math.max(0, currentIndex - 1);
    this.scrollToSection(this.contentSections[previousIndex]);
  }

  navigateToNextSection() {
    const currentIndex = this.contentSections.findIndex(s => s === this.currentSection);
    const nextIndex = Math.min(this.contentSections.length - 1, currentIndex + 1);
    this.scrollToSection(this.contentSections[nextIndex]);
  }

  navigateToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  scrollToSection(section) {
    if (section && section.element) {
      section.element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * =====================================
   * 🔧 UTILITY METHODS
   * =====================================
   */

  generateHeadingId(text, index) {
    const baseId = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substr(0, 50);
    
    return `${baseId}-${index}`;
  }

  estimateReadingTime(element) {
    const text = element.textContent || '';
    const words = text.trim().split(/\s+/).length;
    const wordsPerMinute = 200; // Average reading speed
    const minutes = Math.ceil(words / wordsPerMinute);
    
    return minutes;
  }

  applyDynamicSpacing() {
    // Aplicar espaciado basado en el contenido
    const sections = document.querySelectorAll('section, article, .hierarchy-section');
    
    sections.forEach(section => {
      const importance = this.calculateSectionImportance(section);
      const spacing = Math.max(16, importance * 2);
      section.style.marginBottom = `${spacing}px`;
    });
  }

  validateHierarchy() {
    const issues = [];
    
    // Verificar saltos de nivel en headings
    this.headingHierarchy.forEach((heading, index) => {
      if (index > 0) {
        const prev = this.headingHierarchy[index - 1];
        if (heading.level > prev.level + 1) {
          issues.push({
            type: 'level-skip',
            element: heading.element,
            message: `Salto de nivel: de H${prev.level} a H${heading.level}`
          });
        }
      }
    });
    
    // Verificar falta de contenido entre headings
    this.headingHierarchy.forEach(heading => {
      const nextHeading = heading.element.nextElementSibling;
      if (nextHeading && nextHeading.matches('h1, h2, h3, h4, h5, h6')) {
        issues.push({
          type: 'empty-section',
          element: heading.element,
          message: 'Sección vacía entre headings'
        });
      }
    });
    
    this.hierarchyIssues = issues;
    
    if (issues.length > 0) {
      console.warn('🎯 Hierarchy issues found:', issues);
    }
    
    return issues;
  }

  logHierarchyWarning(message, element) {
    console.warn(`🎯 Hierarchy Warning: ${message}`, element);
  }

  trackElementView(element, ratio) {
    // Analytics tracking
    if (window.analytics) {
      window.analytics.track('Element Viewed', {
        element: element.tagName,
        text: element.textContent?.substr(0, 50),
        visibility: ratio,
        timestamp: new Date()
      });
    }
  }

  trackSectionNavigation(heading) {
    if (window.analytics) {
      window.analytics.track('Section Navigation', {
        section: heading.text,
        level: heading.level,
        method: 'toc-click',
        timestamp: new Date()
      });
    }
  }

  trackSectionEntry(section) {
    if (section && window.analytics) {
      window.analytics.track('Section Entry', {
        sectionId: section.id,
        importance: section.importance,
        readingTime: section.readingTime,
        timestamp: new Date()
      });
    }
  }

  /**
   * =====================================
   * 🌐 PUBLIC API
   * =====================================
   */

  // API para obtener información de jerarquía
  getHierarchyInfo() {
    return {
      headings: this.headingHierarchy.length,
      sections: this.contentSections.length,
      readingProgress: this.readingProgress,
      currentSection: this.currentSection?.id,
      issues: this.hierarchyIssues?.length || 0
    };
  }

  // API para navegación programática
  goToSection(sectionId) {
    const section = this.contentSections.find(s => s.id === sectionId);
    if (section) {
      this.scrollToSection(section);
    }
  }

  // API para obtener tabla de contenidos
  getTOCData() {
    return this.headingHierarchy.map(h => ({
      id: h.id,
      text: h.text,
      level: h.level
    }));
  }

  // Cleanup al destruir
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.tableOfContents) {
      this.tableOfContents.remove();
    }
    
    // Remover estilos añadidos
    const addedStyles = document.querySelectorAll('#hierarchy-toc-styles, #hierarchy-progress-styles');
    addedStyles.forEach(style => style.remove());
    
    this.hierarchyMap.clear();
    this.contentSections = [];
    this.readingFlow = [];
  }

  /**
   * Actualiza la UI de la jerarquía visual
   * Método que se estaba llamando pero no existía - CORREGIDO
   */
  updateHierarchyUI() {
    console.log('🎯 VisualHierarchyManager: updateHierarchyUI called');
    
    if (this.isAnalyzing) return;
    
    try {
      // Actualizar tabla de contenidos si existe
      if (this.tableOfContents) {
        this.refreshTableOfContents();
      }
      
      // Actualizar indicadores de progreso
      this.updateProgressIndicators();
      
      // Actualizar navegación activa
      this.updateActiveNavigation();
      
      // Aplicar mejoras visuales
      this.applyVisualEnhancements();
      
      console.log('✅ Hierarchy UI updated successfully');
    } catch (error) {
      console.warn('⚠️ Error updating hierarchy UI:', error);
    }
  }

  /**
   * Refresca la tabla de contenidos
   */
  refreshTableOfContents() {
    if (!this.tableOfContents) return;
    
    const tocList = this.tableOfContents.querySelector('.hierarchy-toc-list');
    if (tocList && this.headingHierarchy.length > 0) {
      const newList = this.createTOCList(this.headingHierarchy);
      tocList.parentNode.replaceChild(newList, tocList);
    }
  }

  /**
   * Actualiza los indicadores de progreso de lectura
   */
  updateProgressIndicators() {
    // Actualizar barra de progreso si existe
    const progressBar = document.querySelector('.hierarchy-progress-bar');
    if (progressBar) {
      this.updateReadingProgress();
    }
    
    // Actualizar marcadores de sección
    const sectionMarkers = document.querySelector('.hierarchy-progress-sections');
    if (sectionMarkers && this.contentSections.length > 0) {
      this.createSectionMarkers();
    }
  }

  /**
   * Actualiza la navegación activa basada en la posición actual
   */
  updateActiveNavigation() {
    const currentScrollY = window.scrollY;
    let activeSection = null;
    
    // Encontrar la sección actual
    for (let i = this.contentSections.length - 1; i >= 0; i--) {
      const section = this.contentSections[i];
      const sectionTop = section.element.getBoundingClientRect().top + currentScrollY;
      
      if (currentScrollY >= sectionTop - 100) {
        activeSection = section;
        break;
      }
    }
    
    if (activeSection) {
      this.updateActiveSection(activeSection.id);
    }
  }

  /**
   * Aplica mejoras visuales dinámicas
   */
  applyVisualEnhancements() {
    // Aplicar espaciado rítmico si no se ha hecho
    if (!document.body.hasAttribute('data-hierarchy-enhanced')) {
      this.applyRhythmicSpacing();
      this.highlightImportantElements();
      document.body.setAttribute('data-hierarchy-enhanced', 'true');
    }
    
    // Actualizar contraste si es necesario
    this.enhanceContrast();
  }
}

// Inicialización automática
let visualHierarchyManager;

document.addEventListener('DOMContentLoaded', () => {
  visualHierarchyManager = new VisualHierarchyManager();
  
  // Hacer disponible globalmente
  window.visualHierarchyManager = visualHierarchyManager;
  
  console.log('🎯 Visual Hierarchy System Ready');
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisualHierarchyManager;
} 