/**
 * ========================================================================
 * 🔄 USER CONTROL AND FREEDOM MANAGER - HEURÍSTICA UX 13
 * ========================================================================
 * 
 * Gestiona el control total del usuario sobre su experiencia
 * 
 * Funcionalidades:
 * - Sistema Undo/Redo para acciones del usuario
 * - Controles de navegación avanzados
 * - Panel de control personalizable
 * - Opciones de escape y salida
 * - Shortcuts de teclado
 * - Personalización de la interfaz
 * - Historial de acciones
 * 
 * ========================================================================
 */

class UserControlFreedomManager {
  constructor() {
    this.actionHistory = [];
    this.currentActionIndex = -1;
    this.maxHistorySize = 50;
    this.controlPanel = null;
    this.isPanelVisible = false;
    this.customSettings = {};
    this.shortcuts = new Map();
    this.floatingControls = null;
    this.breadcrumbHistory = [];
    this.userPreferences = {};
    
    this.init();
  }

  /**
   * Inicializa el sistema de control y libertad del usuario
   */
  init() {
    this.loadUserPreferences();
    this.createControlPanel();
    this.createFloatingControls();
    this.setupKeyboardShortcuts();
    this.setupNavigationHistory();
    this.setupPageUnloadHandler();
    this.setupControlPanelToggle();
    this.setupCustomizationOptions();
    
    console.log('🔄 User Control and Freedom Manager initialized');
  }

  /**
   * =====================================
   * 🔄 UNDO/REDO SYSTEM
   * =====================================
   */

  /**
   * Registra una acción en el historial
   */
  registerAction(action) {
    const actionData = {
      id: this.generateActionId(),
      type: action.type,
      timestamp: new Date(),
      data: action.data,
      undo: action.undo,
      redo: action.redo,
      description: action.description || `Acción ${action.type}`
    };

    // Limpiar el historial después del índice actual si hay acciones futuras
    if (this.currentActionIndex < this.actionHistory.length - 1) {
      this.actionHistory = this.actionHistory.slice(0, this.currentActionIndex + 1);
    }

    // Añadir nueva acción
    this.actionHistory.push(actionData);
    this.currentActionIndex++;

    // Mantener el límite del historial
    if (this.actionHistory.length > this.maxHistorySize) {
      this.actionHistory.shift();
      this.currentActionIndex--;
    }

    this.updateUndoRedoButtons();
    this.trackUserAction(actionData);

    return actionData.id;
  }

  /**
   * Deshace la última acción
   */
  async undo() {
    if (!this.canUndo()) {
      this.showFeedback('No hay acciones para deshacer', 'warning');
      return false;
    }

    const action = this.actionHistory[this.currentActionIndex];
    
    try {
      if (typeof action.undo === 'function') {
        await action.undo(action.data);
      }
      
      this.currentActionIndex--;
      this.updateUndoRedoButtons();
      this.showFeedback(`Deshecho: ${action.description}`, 'success');
      
      return true;
    } catch (error) {
      console.error('Error al deshacer acción:', error);
      this.showFeedback('Error al deshacer la acción', 'error');
      return false;
    }
  }

  /**
   * Rehace la siguiente acción
   */
  async redo() {
    if (!this.canRedo()) {
      this.showFeedback('No hay acciones para rehacer', 'warning');
      return false;
    }

    this.currentActionIndex++;
    const action = this.actionHistory[this.currentActionIndex];
    
    try {
      if (typeof action.redo === 'function') {
        await action.redo(action.data);
      }
      
      this.updateUndoRedoButtons();
      this.showFeedback(`Rehecho: ${action.description}`, 'success');
      
      return true;
    } catch (error) {
      console.error('Error al rehacer acción:', error);
      this.currentActionIndex--;
      this.showFeedback('Error al rehacer la acción', 'error');
      return false;
    }
  }

  canUndo() {
    return this.currentActionIndex >= 0;
  }

  canRedo() {
    return this.currentActionIndex < this.actionHistory.length - 1;
  }

  /**
   * =====================================
   * 🎛️ CONTROL PANEL
   * =====================================
   */

  createControlPanel() {
    this.controlPanel = document.createElement('div');
    this.controlPanel.className = 'user-control-panel';
    this.controlPanel.innerHTML = this.getControlPanelHTML();
    
    document.body.appendChild(this.controlPanel);
    this.setupControlPanelEvents();
  }

  getControlPanelHTML() {
    return `
      <div class="control-panel-header">
        <h4 class="control-panel-title">Control de Usuario</h4>
        <button class="control-panel-toggle" aria-label="Colapsar panel">
          <span>−</span>
        </button>
      </div>
      
      <!-- Undo/Redo Controls -->
      <div class="undo-redo-controls">
        <button class="control-btn undo" id="undo-btn" disabled title="Deshacer (Ctrl+Z)">
          <span class="control-btn-icon">↶</span>
        </button>
        <button class="control-btn redo" id="redo-btn" disabled title="Rehacer (Ctrl+Y)">
          <span class="control-btn-icon">↷</span>
        </button>
      </div>
      
      <!-- Exit Controls -->
      <div class="exit-controls">
        <button class="control-btn control-btn-text exit-btn" id="exit-btn">
          <span class="control-btn-icon">🚪</span>
          <span>Salir</span>
        </button>
        <button class="control-btn control-btn-text cancel-btn" id="cancel-btn">
          <span class="control-btn-icon">✕</span>
          <span>Cancelar</span>
        </button>
        <button class="control-btn control-btn-text reset-btn" id="reset-btn">
          <span class="control-btn-icon">↻</span>
          <span>Reiniciar</span>
        </button>
      </div>
      
      <!-- Navigation Controls -->
      <div class="navigation-controls">
        <div class="nav-control-group">
          <button class="control-btn back-control" id="back-btn" title="Atrás">
            <span class="control-btn-icon">←</span>
          </button>
          <button class="control-btn forward-control" id="forward-btn" title="Adelante">
            <span class="control-btn-icon">→</span>
          </button>
          <button class="control-btn control-btn-text home-control" id="home-btn">
            <span class="control-btn-icon">🏠</span>
            <span>Inicio</span>
          </button>
        </div>
      </div>
      
      <!-- Customization Controls -->
      <div class="customization-controls">
        <div class="control-group">
          <h5 class="control-group-title">Personalización</h5>
          
          <div class="control-toggle-group">
            <label class="control-toggle">
              <input type="checkbox" id="dark-mode-toggle"> Modo Oscuro
            </label>
            <label class="control-toggle">
              <input type="checkbox" id="high-contrast-toggle"> Alto Contraste
            </label>
            <label class="control-toggle">
              <input type="checkbox" id="large-text-toggle"> Texto Grande
            </label>
            <label class="control-toggle">
              <input type="checkbox" id="reduce-motion-toggle"> Reducir Animaciones
            </label>
          </div>
        </div>
        
        <div class="control-group">
          <h5 class="control-group-title">Configuración</h5>
          <input type="range" class="control-slider" id="font-size-slider" 
                 min="12" max="24" value="16" title="Tamaño de fuente">
          <input type="range" class="control-slider" id="animation-speed-slider" 
                 min="0.5" max="2" value="1" step="0.1" title="Velocidad de animaciones">
        </div>
      </div>
    `;
  }

  setupControlPanelEvents() {
    // Undo/Redo buttons
    document.getElementById('undo-btn').addEventListener('click', () => this.undo());
    document.getElementById('redo-btn').addEventListener('click', () => this.redo());
    
    // Exit controls
    document.getElementById('exit-btn').addEventListener('click', () => this.handleExit());
    document.getElementById('cancel-btn').addEventListener('click', () => this.handleCancel());
    document.getElementById('reset-btn').addEventListener('click', () => this.handleReset());
    
    // Navigation controls
    document.getElementById('back-btn').addEventListener('click', () => this.goBack());
    document.getElementById('forward-btn').addEventListener('click', () => this.goForward());
    document.getElementById('home-btn').addEventListener('click', () => this.goHome());
    
    // Customization toggles
    document.getElementById('dark-mode-toggle').addEventListener('change', (e) => 
      this.toggleDarkMode(e.target.checked));
    document.getElementById('high-contrast-toggle').addEventListener('change', (e) => 
      this.toggleHighContrast(e.target.checked));
    document.getElementById('large-text-toggle').addEventListener('change', (e) => 
      this.toggleLargeText(e.target.checked));
    document.getElementById('reduce-motion-toggle').addEventListener('change', (e) => 
      this.toggleReduceMotion(e.target.checked));
    
    // Sliders
    document.getElementById('font-size-slider').addEventListener('input', (e) => 
      this.adjustFontSize(e.target.value));
    document.getElementById('animation-speed-slider').addEventListener('input', (e) => 
      this.adjustAnimationSpeed(e.target.value));
    
    // Panel toggle
    this.controlPanel.querySelector('.control-panel-toggle').addEventListener('click', () => 
      this.togglePanelCollapse());
  }

  /**
   * =====================================
   * 🎯 FLOATING CONTROLS
   * =====================================
   */

  createFloatingControls() {
    this.floatingControls = document.createElement('div');
    this.floatingControls.className = 'floating-controls';
    this.floatingControls.innerHTML = `
      <button class="floating-control-btn" id="control-panel-toggle" title="Panel de Control (Ctrl+P)">
        🎛️
        <span class="floating-control-tooltip">Panel de Control</span>
      </button>
      <button class="floating-control-btn" id="quick-undo" title="Deshacer Rápido (Ctrl+Z)">
        ↶
        <span class="floating-control-tooltip">Deshacer</span>
      </button>
      <button class="floating-control-btn" id="emergency-exit" title="Salida de Emergencia (Esc)">
        🚪
        <span class="floating-control-tooltip">Salida de Emergencia</span>
      </button>
    `;
    
    document.body.appendChild(this.floatingControls);
    this.setupFloatingControlsEvents();
  }

  setupFloatingControlsEvents() {
    document.getElementById('control-panel-toggle').addEventListener('click', () => 
      this.toggleControlPanel());
    document.getElementById('quick-undo').addEventListener('click', () => this.undo());
    document.getElementById('emergency-exit').addEventListener('click', () => 
      this.emergencyExit());
  }

  /**
   * =====================================
   * ⌨️ KEYBOARD SHORTCUTS
   * =====================================
   */

  setupKeyboardShortcuts() {
    // Registrar shortcuts principales
    this.registerShortcut('ctrl+z', () => this.undo(), 'Deshacer');
    this.registerShortcut('ctrl+y', () => this.redo(), 'Rehacer');
    this.registerShortcut('ctrl+shift+z', () => this.redo(), 'Rehacer (Alt)');
    this.registerShortcut('ctrl+p', () => this.toggleControlPanel(), 'Panel de Control');
    this.registerShortcut('escape', () => this.handleEscape(), 'Salida de Emergencia');
    this.registerShortcut('ctrl+home', () => this.goHome(), 'Ir al Inicio');
    this.registerShortcut('alt+left', () => this.goBack(), 'Atrás');
    this.registerShortcut('alt+right', () => this.goForward(), 'Adelante');
    this.registerShortcut('ctrl+,', () => this.showPreferences(), 'Preferencias');
    this.registerShortcut('f1', () => this.showHelp(), 'Ayuda');
    this.registerShortcut('ctrl+shift+k', () => this.showKeyboardShortcuts(), 'Mostrar Atajos');

    // Listener global de teclado
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  registerShortcut(keyCombo, action, description) {
    this.shortcuts.set(keyCombo, { action, description });
  }

  handleKeyDown(event) {
    const keyCombo = this.getKeyCombo(event);
    const shortcut = this.shortcuts.get(keyCombo);
    
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  getKeyCombo(event) {
    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    
    parts.push(event.key.toLowerCase());
    return parts.join('+');
  }

  showKeyboardShortcuts() {
    const indicator = document.createElement('div');
    indicator.className = 'keyboard-shortcut-indicator visible';
    indicator.innerHTML = `
      <h4>Atajos de Teclado</h4>
      ${Array.from(this.shortcuts.entries()).map(([combo, shortcut]) => `
        <div class="shortcut-item">
          <span class="shortcut-description">${shortcut.description}</span>
          <div class="shortcut-keys">
            ${combo.split('+').map(key => `<span class="shortcut-key">${key}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    `;
    
    document.body.appendChild(indicator);
    
    // Auto-hide después de 10 segundos
    setTimeout(() => {
      indicator.classList.remove('visible');
      setTimeout(() => indicator.remove(), 300);
    }, 10000);
  }

  /**
   * =====================================
   * 🧭 NAVIGATION MANAGEMENT
   * =====================================
   */

  setupNavigationHistory() {
    // Interceptar navegación del browser
    window.addEventListener('popstate', (e) => this.handlePopState(e));
    
    // Registrar página actual
    this.addToBreadcrumb({
      url: window.location.href,
      title: document.title,
      timestamp: new Date()
    });
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.showFeedback('No hay páginas anteriores', 'info');
    }
  }

  goForward() {
    window.history.forward();
  }

  goHome() {
    const homeUrl = window.location.origin;
    this.navigateWithConfirmation(homeUrl, 'Ir al inicio');
  }

  navigateWithConfirmation(url, action) {
    const hasUnsavedChanges = this.checkUnsavedChanges();
    
    if (hasUnsavedChanges) {
      this.showConfirmationDialog({
        title: 'Confirmar navegación',
        message: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres continuar?',
        onConfirm: () => window.location.href = url,
        onCancel: () => this.showFeedback('Navegación cancelada', 'info')
      });
    } else {
      window.location.href = url;
    }
  }

  addToBreadcrumb(pageData) {
    this.breadcrumbHistory.push(pageData);
    if (this.breadcrumbHistory.length > 20) {
      this.breadcrumbHistory.shift();
    }
    this.updateBreadcrumbs();
  }

  updateBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.enhanced-breadcrumbs');
    if (breadcrumbContainer) {
      const recent = this.breadcrumbHistory.slice(-5);
      breadcrumbContainer.innerHTML = recent.map((page, index) => `
        <a href="${page.url}" class="breadcrumb-control ${index === recent.length - 1 ? 'current' : ''}">
          ${page.title}
        </a>
        ${index < recent.length - 1 ? '<span class="breadcrumb-separator">›</span>' : ''}
      `).join('');
    }
  }

  /**
   * =====================================
   * 🚪 EXIT & ESCAPE HANDLERS
   * =====================================
   */

  handleExit() {
    this.showConfirmationDialog({
      title: 'Confirmar salida',
      message: '¿Estás seguro de que quieres salir?',
      onConfirm: () => this.performExit(),
      onCancel: () => this.showFeedback('Salida cancelada', 'info')
    });
  }

  handleCancel() {
    const activeModal = document.querySelector('.modal, .dialog, .overlay');
    if (activeModal) {
      this.closeModal(activeModal);
    } else {
      this.showFeedback('No hay acciones que cancelar', 'info');
    }
  }

  handleReset() {
    this.showConfirmationDialog({
      title: 'Confirmar reinicio',
      message: 'Esto restaurará todas las configuraciones a sus valores por defecto.',
      onConfirm: () => this.performReset(),
      onCancel: () => this.showFeedback('Reinicio cancelado', 'info')
    });
  }

  handleEscape() {
    // Prioridad de escape:
    // 1. Cerrar modales/dialogs
    // 2. Salir de modo fullscreen
    // 3. Limpiar selecciones
    // 4. Cancelar acciones en progreso
    
    const modal = document.querySelector('.modal:not(.hidden), .dialog:not(.hidden)');
    if (modal) {
      this.closeModal(modal);
      return;
    }
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    
    this.clearSelections();
    this.cancelActiveOperations();
  }

  emergencyExit() {
    // Salida inmediata sin confirmaciones para casos de emergencia
    this.saveEmergencyState();
    window.close() || (window.location.href = '/');
  }

  performExit() {
    this.saveUserState();
    window.close() || (window.location.href = '/');
  }

  performReset() {
    // Reiniciar configuraciones
    this.resetUserPreferences();
    this.clearActionHistory();
    this.resetCustomizations();
    window.location.reload();
  }

  /**
   * =====================================
   * ⚙️ CUSTOMIZATION & PREFERENCES
   * =====================================
   */

  toggleDarkMode(enabled) {
    document.documentElement.classList.toggle('dark-mode', enabled);
    this.userPreferences.darkMode = enabled;
    this.saveUserPreferences();
  }

  toggleHighContrast(enabled) {
    document.documentElement.classList.toggle('high-contrast', enabled);
    this.userPreferences.highContrast = enabled;
    this.saveUserPreferences();
  }

  toggleLargeText(enabled) {
    document.documentElement.classList.toggle('large-text', enabled);
    this.userPreferences.largeText = enabled;
    this.saveUserPreferences();
  }

  toggleReduceMotion(enabled) {
    document.documentElement.classList.toggle('reduce-motion', enabled);
    this.userPreferences.reduceMotion = enabled;
    this.saveUserPreferences();
  }

  adjustFontSize(size) {
    document.documentElement.style.fontSize = `${size}px`;
    this.userPreferences.fontSize = size;
    this.saveUserPreferences();
  }

  adjustAnimationSpeed(speed) {
    document.documentElement.style.setProperty('--animation-speed-multiplier', speed);
    this.userPreferences.animationSpeed = speed;
    this.saveUserPreferences();
  }

  /**
   * =====================================
   * 💾 STATE MANAGEMENT
   * =====================================
   */

  saveUserState() {
    const state = {
      preferences: this.userPreferences,
      actionHistory: this.actionHistory.slice(-10), // Solo las últimas 10 acciones
      breadcrumbHistory: this.breadcrumbHistory.slice(-5),
      currentUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('userControlState', JSON.stringify(state));
  }

  loadUserPreferences() {
    try {
      const stored = localStorage.getItem('userControlState');
      if (stored) {
        const state = JSON.parse(stored);
        this.userPreferences = state.preferences || {};
        this.breadcrumbHistory = state.breadcrumbHistory || [];
        
        // Aplicar preferencias guardadas
        this.applyUserPreferences();
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  }

  applyUserPreferences() {
    const prefs = this.userPreferences;
    
    if (prefs.darkMode) this.toggleDarkMode(true);
    if (prefs.highContrast) this.toggleHighContrast(true);
    if (prefs.largeText) this.toggleLargeText(true);
    if (prefs.reduceMotion) this.toggleReduceMotion(true);
    if (prefs.fontSize) this.adjustFontSize(prefs.fontSize);
    if (prefs.animationSpeed) this.adjustAnimationSpeed(prefs.animationSpeed);
    
    // Actualizar UI controls
    setTimeout(() => this.updateControlsFromPreferences(), 100);
  }

  updateControlsFromPreferences() {
    const prefs = this.userPreferences;
    
    if (document.getElementById('dark-mode-toggle')) {
      document.getElementById('dark-mode-toggle').checked = prefs.darkMode || false;
    }
    if (document.getElementById('high-contrast-toggle')) {
      document.getElementById('high-contrast-toggle').checked = prefs.highContrast || false;
    }
    if (document.getElementById('large-text-toggle')) {
      document.getElementById('large-text-toggle').checked = prefs.largeText || false;
    }
    if (document.getElementById('reduce-motion-toggle')) {
      document.getElementById('reduce-motion-toggle').checked = prefs.reduceMotion || false;
    }
    if (document.getElementById('font-size-slider')) {
      document.getElementById('font-size-slider').value = prefs.fontSize || 16;
    }
    if (document.getElementById('animation-speed-slider')) {
      document.getElementById('animation-speed-slider').value = prefs.animationSpeed || 1;
    }
  }

  /**
   * =====================================
   * 🎛️ CONTROL PANEL MANAGEMENT
   * =====================================
   */

  toggleControlPanel() {
    this.isPanelVisible = !this.isPanelVisible;
    this.controlPanel.classList.toggle('visible', this.isPanelVisible);
    
    if (this.isPanelVisible) {
      this.updateUndoRedoButtons();
    }
  }

  togglePanelCollapse() {
    this.controlPanel.classList.toggle('collapsed');
    const toggle = this.controlPanel.querySelector('.control-panel-toggle span');
    toggle.textContent = this.controlPanel.classList.contains('collapsed') ? '+' : '−';
  }

  updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    
    if (undoBtn) undoBtn.disabled = !this.canUndo();
    if (redoBtn) redoBtn.disabled = !this.canRedo();
  }

  /**
   * =====================================
   * 🔧 UTILITY METHODS
   * =====================================
   */

  generateActionId() {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  showFeedback(message, type = 'info') {
    // Usar el sistema de notificaciones si está disponible
    if (window.errorRecovery) {
      window.errorRecovery.showErrorMessage({
        id: this.generateActionId(),
        type: 'user-action',
        severity: type,
        message: message,
        timestamp: new Date(),
        recoveryActions: []
      });
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  showConfirmationDialog({ title, message, onConfirm, onCancel }) {
    // Usar el sistema de confirmación si está disponible
    if (window.errorPreventionManager) {
      window.errorPreventionManager.showConfirmationDialog({
        title,
        message,
        type: 'warning',
        onConfirm,
        onCancel
      });
    } else {
      if (confirm(`${title}\n\n${message}`)) {
        onConfirm();
      } else {
        onCancel();
      }
    }
  }

  checkUnsavedChanges() {
    // Verificar formularios con cambios
    const forms = document.querySelectorAll('form');
    let hasChanges = false;
    
    forms.forEach(form => {
      const formData = new FormData(form);
      if (Array.from(formData.entries()).length > 0) {
        hasChanges = true;
      }
    });
    
    return hasChanges;
  }

  trackUserAction(action) {
    // Analytics para seguimiento de acciones del usuario
    if (window.analytics) {
      window.analytics.track('User Action', {
        actionType: action.type,
        description: action.description,
        timestamp: action.timestamp
      });
    }
  }

  clearActionHistory() {
    this.actionHistory = [];
    this.currentActionIndex = -1;
    this.updateUndoRedoButtons();
  }

  clearSelections() {
    // Limpiar selecciones de texto
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    
    // Limpiar elementos seleccionados visualmente
    document.querySelectorAll('.selected, .highlighted').forEach(el => {
      el.classList.remove('selected', 'highlighted');
    });
  }

  cancelActiveOperations() {
    // Cancelar operaciones en progreso
    const loadingElements = document.querySelectorAll('.loading, .processing');
    loadingElements.forEach(el => {
      el.classList.remove('loading', 'processing');
    });
  }

  closeModal(modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    this.showFeedback('Modal cerrado', 'info');
  }

  setupPageUnloadHandler() {
    window.addEventListener('beforeunload', (e) => {
      if (this.checkUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = ''; // Para compatibilidad con browsers más antiguos
        return 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
      }
    });
  }

  resetUserPreferences() {
    this.userPreferences = {};
    localStorage.removeItem('userControlState');
    
    // Remover clases aplicadas
    document.documentElement.classList.remove('dark-mode', 'high-contrast', 'large-text', 'reduce-motion');
    document.documentElement.style.fontSize = '';
    document.documentElement.style.removeProperty('--animation-speed-multiplier');
  }

  resetCustomizations() {
    this.customSettings = {};
    // Aplicar reset visual aquí si es necesario
  }

  saveEmergencyState() {
    const emergencyState = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      lastActions: this.actionHistory.slice(-5)
    };
    
    localStorage.setItem('emergencyState', JSON.stringify(emergencyState));
  }

  setupControlPanelToggle() {
    // Mostrar panel después de 5 segundos si no hay interacción
    setTimeout(() => {
      if (!this.isPanelVisible) {
        this.showFeedback('Panel de control disponible - Ctrl+P para abrir', 'info');
      }
    }, 5000);
  }

  setupCustomizationOptions() {
    // Detectar preferencias del sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches && !this.userPreferences.darkMode) {
      this.userPreferences.darkMode = true;
      this.applyUserPreferences();
    }
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !this.userPreferences.reduceMotion) {
      this.userPreferences.reduceMotion = true;
      this.applyUserPreferences();
    }
  }

  showPreferences() {
    this.toggleControlPanel();
    if (this.isPanelVisible) {
      this.showFeedback('Panel de preferencias abierto', 'info');
    }
  }

  showHelp() {
    if (window.helpDocumentationManager) {
      window.helpDocumentationManager.showHelpWidget();
    } else {
      this.showFeedback('Sistema de ayuda no disponible', 'warning');
    }
  }

  /**
   * =====================================
   * 🌐 PUBLIC API
   * =====================================
   */

  // API pública para registrar acciones desde otros componentes
  addUserAction(actionConfig) {
    return this.registerAction(actionConfig);
  }

  // API para obtener estado del control de usuario
  getUserControlState() {
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      actionsCount: this.actionHistory.length,
      currentIndex: this.currentActionIndex,
      isPanelVisible: this.isPanelVisible,
      preferences: this.userPreferences
    };
  }

  // API para controles externos
  triggerUndo() { return this.undo(); }
  triggerRedo() { return this.redo(); }
  triggerExit() { this.handleExit(); }
  triggerReset() { this.handleReset(); }

  // Cleanup al destruir
  destroy() {
    this.saveUserState();
    
    if (this.controlPanel) {
      this.controlPanel.remove();
    }
    
    if (this.floatingControls) {
      this.floatingControls.remove();
    }
    
    this.shortcuts.clear();
    this.actionHistory = [];
  }
}

// Inicialización automática
let userControlManager;

document.addEventListener('DOMContentLoaded', () => {
  userControlManager = new UserControlFreedomManager();
  
  // Hacer disponible globalmente
  window.userControlManager = userControlManager;
  
  console.log('🔄 User Control and Freedom System Ready');
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserControlFreedomManager;
} 