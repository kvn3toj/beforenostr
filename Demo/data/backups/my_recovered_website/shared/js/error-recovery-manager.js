/**
 * ========================================================================
 * 🚨 ERROR RECOVERY MANAGER - HEURÍSTICA UX 12
 * ========================================================================
 * 
 * Gestiona la recuperación de errores de manera inteligente y user-friendly
 * 
 * Funcionalidades:
 * - Captura automática de errores
 * - Mensajes de error contextuales
 * - Mecanismos de retry automático
 * - Auto-save para prevenir pérdida de datos
 * - Recovery UI components
 * - Network error handling
 * - Form validation recovery
 * 
 * ========================================================================
 */

class ErrorRecoveryManager {
  constructor() {
    this.errors = new Map();
    this.retryAttempts = new Map();
    this.autoSaveInterval = null;
    this.networkStatus = navigator.onLine;
    this.errorContainer = null;
    this.autoSaveIndicator = null;
    this.maxRetryAttempts = 3;
    this.retryDelay = 1000;
    this.autoSaveDelay = 30000; // 30 segundos
    this.errorQueue = [];
    this.isRecovering = false;
    
    this.init();
  }

  /**
   * Inicializa el sistema de recuperación de errores
   */
  init() {
    this.createErrorContainer();
    this.createAutoSaveIndicator();
    this.setupGlobalErrorHandlers();
    this.setupNetworkMonitoring();
    this.setupAutoSave();
    this.setupKeyboardShortcuts();
    
    console.log('🚨 Error Recovery Manager initialized');
  }

  /**
   * =====================================
   * 🏗️ SETUP METHODS
   * =====================================
   */

  createErrorContainer() {
    this.errorContainer = document.createElement('div');
    this.errorContainer.className = 'error-recovery-container';
    this.errorContainer.setAttribute('role', 'alert');
    this.errorContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.errorContainer);
  }

  createAutoSaveIndicator() {
    this.autoSaveIndicator = document.createElement('div');
    this.autoSaveIndicator.className = 'auto-save-indicator';
    this.autoSaveIndicator.textContent = 'Guardado automático';
    document.body.appendChild(this.autoSaveIndicator);
  }

  setupGlobalErrorHandlers() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleJavaScriptError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseRejection({
        reason: event.reason,
        promise: event.promise
      });
    });

    // Network errors
    window.addEventListener('offline', () => this.handleNetworkError('offline'));
    window.addEventListener('online', () => this.handleNetworkError('online'));
  }

  setupNetworkMonitoring() {
    // Monitor network status
    setInterval(() => {
      const isOnline = navigator.onLine;
      if (isOnline !== this.networkStatus) {
        this.networkStatus = isOnline;
        this.updateNetworkStatus(isOnline);
      }
    }, 1000);
  }

  setupAutoSave() {
    // Auto-save para formularios
    this.autoSaveInterval = setInterval(() => {
      this.performAutoSave();
    }, this.autoSaveDelay);
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Shift + R para retry manual
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        this.retryLastAction();
      }
      
      // Ctrl/Cmd + Shift + S para guardar manualmente
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        this.performManualSave();
      }
    });
  }

  /**
   * =====================================
   * 🚨 ERROR HANDLING METHODS
   * =====================================
   */

  handleJavaScriptError(errorInfo) {
    const errorId = this.generateErrorId();
    const error = {
      id: errorId,
      type: 'javascript',
      severity: 'critical',
      message: errorInfo.message || 'Error de JavaScript inesperado',
      details: errorInfo,
      timestamp: new Date(),
      recoveryActions: [
        { type: 'retry', label: 'Reintentar', primary: true },
        { type: 'reload', label: 'Recargar página' },
        { type: 'report', label: 'Reportar problema' }
      ]
    };

    this.errors.set(errorId, error);
    this.showErrorMessage(error);
    this.trackError(error);
  }

  handlePromiseRejection(rejectionInfo) {
    const errorId = this.generateErrorId();
    const error = {
      id: errorId,
      type: 'promise',
      severity: 'warning',
      message: 'Operación fallida, reintentando automáticamente...',
      details: rejectionInfo,
      timestamp: new Date(),
      recoveryActions: [
        { type: 'retry', label: 'Reintentar ahora', primary: true },
        { type: 'cancel', label: 'Cancelar' }
      ]
    };

    this.errors.set(errorId, error);
    this.autoRetry(errorId);
  }

  handleNetworkError(status) {
    if (status === 'offline') {
      this.showNetworkErrorMessage({
        type: 'offline',
        title: 'Sin conexión a internet',
        message: 'No se puede conectar a internet. Los cambios se guardarán localmente.',
        actions: [
          { type: 'retry', label: 'Verificar conexión' },
          { type: 'offline-mode', label: 'Trabajar sin conexión' }
        ]
      });
    } else {
      this.showNetworkErrorMessage({
        type: 'online',
        title: 'Conexión restablecida',
        message: 'La conexión a internet se ha restablecido. Sincronizando cambios...',
        actions: [
          { type: 'sync', label: 'Sincronizar ahora', primary: true }
        ]
      });
      this.syncOfflineData();
    }
    
    this.updateNetworkStatusIndicator(status);
  }

  handleFormError(formElement, validationErrors) {
    const errorId = this.generateErrorId();
    
    // Marcar campos con errores
    validationErrors.forEach(fieldError => {
      this.markFieldAsError(formElement, fieldError);
    });

    // Mostrar mensaje de error general
    const error = {
      id: errorId,
      type: 'validation',
      severity: 'warning',
      message: 'Hay errores en el formulario',
      details: validationErrors,
      timestamp: new Date(),
      recoveryActions: [
        { type: 'focus-first-error', label: 'Ir al primer error', primary: true },
        { type: 'auto-fix', label: 'Corregir automáticamente' },
        { type: 'clear-form', label: 'Limpiar formulario' }
      ]
    };

    this.showErrorMessage(error);
    this.focusFirstError(formElement);
  }

  /**
   * =====================================
   * 🔄 RETRY MECHANISMS
   * =====================================
   */

  async autoRetry(errorId, action = null) {
    const error = this.errors.get(errorId);
    if (!error) return;

    const currentAttempts = this.retryAttempts.get(errorId) || 0;
    
    if (currentAttempts >= this.maxRetryAttempts) {
      this.showMaxRetriesError(error);
      return;
    }

    this.retryAttempts.set(errorId, currentAttempts + 1);
    this.showRetryIndicator(errorId, currentAttempts + 1);

    // Delay exponencial
    const delay = this.retryDelay * Math.pow(2, currentAttempts);
    
    try {
      await this.sleep(delay);
      
      if (action) {
        await action();
      } else {
        await this.executeDefaultRetry(error);
      }
      
      // Si el retry fue exitoso
      this.hideRetryIndicator(errorId);
      this.showSuccessMessage(`Operación completada exitosamente`);
      this.errors.delete(errorId);
      this.retryAttempts.delete(errorId);
      
    } catch (retryError) {
      console.warn(`Retry attempt ${currentAttempts + 1} failed:`, retryError);
      this.autoRetry(errorId, action);
    }
  }

  async executeDefaultRetry(error) {
    switch (error.type) {
      case 'network':
        return this.retryNetworkRequest(error.details);
      case 'api':
        return this.retryApiCall(error.details);
      case 'form':
        return this.retryFormSubmission(error.details);
      default:
        throw new Error('No default retry action available');
    }
  }

  retryLastAction() {
    const lastError = Array.from(this.errors.values()).pop();
    if (lastError) {
      this.autoRetry(lastError.id);
    }
  }

  /**
   * =====================================
   * 💾 AUTO-SAVE FUNCTIONALITY
   * =====================================
   */

  async performAutoSave() {
    const formsData = this.collectFormsData();
    const draftsData = this.collectDraftsData();
    
    if (Object.keys(formsData).length === 0 && Object.keys(draftsData).length === 0) {
      return;
    }

    this.showAutoSaveIndicator('saving');
    
    try {
      await this.saveToLocalStorage({ forms: formsData, drafts: draftsData });
      this.showAutoSaveIndicator('saved');
      
      // Si hay conexión, intentar sincronizar
      if (this.networkStatus) {
        await this.syncToServer({ forms: formsData, drafts: draftsData });
      }
      
    } catch (error) {
      this.showAutoSaveIndicator('error');
      console.error('Auto-save failed:', error);
    }

    // Ocultar indicador después de 3 segundos
    setTimeout(() => {
      this.hideAutoSaveIndicator();
    }, 3000);
  }

  async performManualSave() {
    this.showAutoSaveIndicator('saving');
    await this.performAutoSave();
    this.showSuccessMessage('Guardado manual completado');
  }

  collectFormsData() {
    const forms = {};
    document.querySelectorAll('form[data-auto-save]').forEach((form, index) => {
      const formData = new FormData(form);
      const formObject = {};
      
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }
      
      if (Object.keys(formObject).length > 0) {
        forms[`form_${index}_${form.id || 'unnamed'}`] = {
          data: formObject,
          timestamp: new Date().toISOString(),
          url: window.location.href
        };
      }
    });
    
    return forms;
  }

  collectDraftsData() {
    const drafts = {};
    document.querySelectorAll('[data-draft-save]').forEach((element, index) => {
      const draftId = element.dataset.draftSave || `draft_${index}`;
      const value = element.value || element.textContent;
      
      if (value && value.trim().length > 0) {
        drafts[draftId] = {
          value: value,
          timestamp: new Date().toISOString(),
          url: window.location.href
        };
      }
    });
    
    return drafts;
  }

  async saveToLocalStorage(data) {
    const savedData = JSON.parse(localStorage.getItem('errorRecoveryData') || '{}');
    savedData[window.location.href] = {
      ...data,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('errorRecoveryData', JSON.stringify(savedData));
  }

  async loadFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem('errorRecoveryData') || '{}');
    const currentPageData = savedData[window.location.href];
    
    if (currentPageData) {
      this.showDataRecoveryDialog(currentPageData);
    }
  }

  /**
   * =====================================
   * 🎨 UI COMPONENTS
   * =====================================
   */

  showErrorMessage(error) {
    const messageElement = this.createErrorMessageElement(error);
    this.errorContainer.appendChild(messageElement);
    
    // Auto-dismiss para errores no críticos
    if (error.severity !== 'critical') {
      setTimeout(() => {
        this.hideErrorMessage(messageElement);
      }, 10000);
    }
  }

  createErrorMessageElement(error) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `error-recovery-message ${error.severity}`;
    messageDiv.setAttribute('data-error-id', error.id);
    messageDiv.setAttribute('role', 'alert');
    
    const iconSvg = this.getErrorIcon(error.type, error.severity);
    
    messageDiv.innerHTML = `
      <div class="error-message-header">
        <div class="error-message-icon">${iconSvg}</div>
        <h4 class="error-message-title">${this.getErrorTitle(error)}</h4>
      </div>
      <div class="error-message-description">${error.message}</div>
      ${error.details && error.details.code ? `<div class="error-message-code">Código: ${error.details.code}</div>` : ''}
      <div class="error-recovery-actions">
        ${error.recoveryActions.map(action => this.createActionButton(action, error.id)).join('')}
        <button class="error-recovery-btn cancel" onclick="errorRecovery.dismissError('${error.id}')">
          Cerrar
        </button>
      </div>
    `;
    
    return messageDiv;
  }

  createActionButton(action, errorId) {
    const isPrimary = action.primary ? 'primary' : action.type;
    return `
      <button class="error-recovery-btn ${isPrimary}" 
              onclick="errorRecovery.executeRecoveryAction('${errorId}', '${action.type}')">
        ${action.label}
      </button>
    `;
  }

  showNetworkErrorMessage(networkError) {
    // Crear modal para errores de red
    const modal = document.createElement('div');
    modal.className = 'network-error-overlay';
    modal.innerHTML = `
      <div class="network-error-modal">
        <div class="error-message-header">
          <div class="error-message-icon">${this.getNetworkIcon(networkError.type)}</div>
          <h3 class="error-message-title">${networkError.title}</h3>
        </div>
        <p class="error-message-description">${networkError.message}</p>
        <div class="error-recovery-actions">
          ${networkError.actions.map(action => this.createActionButton(action, 'network')).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-dismiss para conexión restablecida
    if (networkError.type === 'online') {
      setTimeout(() => {
        modal.remove();
      }, 5000);
    }
  }

  showDataRecoveryDialog(recoveredData) {
    const modal = document.createElement('div');
    modal.className = 'network-error-overlay';
    modal.innerHTML = `
      <div class="data-recovery-panel">
        <div class="data-recovery-header">
          <div class="data-recovery-icon">💾</div>
          <h3 class="data-recovery-title">Datos recuperados</h3>
          <p class="data-recovery-description">
            Se encontraron datos guardados automáticamente de una sesión anterior. 
            ¿Deseas restaurarlos?
          </p>
        </div>
        <div class="error-recovery-actions">
          <button class="error-recovery-btn primary" onclick="errorRecovery.restoreData()">
            Restaurar datos
          </button>
          <button class="error-recovery-btn secondary" onclick="errorRecovery.discardRecoveredData()">
            Descartar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.recoveredDataModal = modal;
  }

  showRetryIndicator(errorId, attempt) {
    const indicator = document.createElement('div');
    indicator.className = 'retry-container';
    indicator.innerHTML = `
      <div class="retry-spinner"></div>
      <p>Reintentando operación...</p>
      <div class="retry-counter ${attempt >= this.maxRetryAttempts - 1 ? 'warning' : ''}">
        Intento ${attempt} de ${this.maxRetryAttempts}
      </div>
    `;
    
    const existingError = document.querySelector(`[data-error-id="${errorId}"]`);
    if (existingError) {
      existingError.appendChild(indicator);
    }
  }

  showAutoSaveIndicator(status) {
    this.autoSaveIndicator.className = `auto-save-indicator visible ${status}`;
    
    switch (status) {
      case 'saving':
        this.autoSaveIndicator.textContent = 'Guardando...';
        break;
      case 'saved':
        this.autoSaveIndicator.textContent = 'Guardado ✓';
        break;
      case 'error':
        this.autoSaveIndicator.textContent = 'Error al guardar';
        break;
    }
  }

  updateNetworkStatusIndicator(status) {
    let indicator = document.querySelector('.network-status-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'network-status-indicator';
      document.body.appendChild(indicator);
    }
    
    indicator.className = `network-status-indicator ${status}`;
    indicator.textContent = status === 'online' ? 'En línea' : 'Sin conexión';
  }

  /**
   * =====================================
   * 🎯 RECOVERY ACTIONS
   * =====================================
   */

  async executeRecoveryAction(errorId, actionType) {
    const error = this.errors.get(errorId);
    if (!error) return;

    this.isRecovering = true;

    try {
      switch (actionType) {
        case 'retry':
          await this.autoRetry(errorId);
          break;
        case 'reload':
          await this.performPageReload();
          break;
        case 'report':
          this.openErrorReportDialog(error);
          break;
        case 'focus-first-error':
          this.focusFirstError();
          break;
        case 'auto-fix':
          await this.attemptAutoFix(error);
          break;
        case 'sync':
          await this.syncOfflineData();
          break;
        case 'offline-mode':
          this.enableOfflineMode();
          break;
        default:
          console.warn('Unknown recovery action:', actionType);
      }
    } catch (actionError) {
      console.error('Recovery action failed:', actionError);
      this.showErrorMessage({
        id: this.generateErrorId(),
        type: 'recovery',
        severity: 'warning',
        message: 'La acción de recuperación falló',
        details: actionError,
        timestamp: new Date(),
        recoveryActions: [{ type: 'retry', label: 'Reintentar', primary: true }]
      });
    } finally {
      this.isRecovering = false;
    }
  }

  dismissError(errorId) {
    const errorElement = document.querySelector(`[data-error-id="${errorId}"]`);
    if (errorElement) {
      this.hideErrorMessage(errorElement);
    }
    this.errors.delete(errorId);
    this.retryAttempts.delete(errorId);
  }

  restoreData() {
    const savedData = JSON.parse(localStorage.getItem('errorRecoveryData') || '{}');
    const currentPageData = savedData[window.location.href];
    
    if (currentPageData && currentPageData.forms) {
      Object.entries(currentPageData.forms).forEach(([formKey, formData]) => {
        this.restoreFormData(formData);
      });
    }
    
    if (currentPageData && currentPageData.drafts) {
      Object.entries(currentPageData.drafts).forEach(([draftId, draftData]) => {
        this.restoreDraftData(draftId, draftData);
      });
    }
    
    this.recoveredDataModal.remove();
    this.showSuccessMessage('Datos restaurados exitosamente');
  }

  discardRecoveredData() {
    const savedData = JSON.parse(localStorage.getItem('errorRecoveryData') || '{}');
    delete savedData[window.location.href];
    localStorage.setItem('errorRecoveryData', JSON.stringify(savedData));
    
    this.recoveredDataModal.remove();
  }

  /**
   * =====================================
   * 🔧 UTILITY METHODS
   * =====================================
   */

  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getErrorTitle(error) {
    const titles = {
      javascript: 'Error de aplicación',
      promise: 'Operación fallida',
      network: 'Error de conexión',
      validation: 'Error de validación',
      api: 'Error del servidor'
    };
    return titles[error.type] || 'Error inesperado';
  }

  getErrorIcon(type, severity) {
    const icons = {
      critical: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅'
    };
    return icons[severity] || '❓';
  }

  getNetworkIcon(type) {
    return type === 'online' ? '🌐' : '📡';
  }

  hideErrorMessage(messageElement) {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.parentNode.removeChild(messageElement);
      }
    }, 300);
  }

  hideAutoSaveIndicator() {
    this.autoSaveIndicator.classList.remove('visible');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  trackError(error) {
    // Analytics/tracking de errores
    if (window.analytics) {
      window.analytics.track('Error Occurred', {
        errorType: error.type,
        severity: error.severity,
        message: error.message,
        timestamp: error.timestamp
      });
    }
  }

  showSuccessMessage(message) {
    this.showErrorMessage({
      id: this.generateErrorId(),
      type: 'success',
      severity: 'success',
      message: message,
      timestamp: new Date(),
      recoveryActions: []
    });
  }

  /**
   * =====================================
   * 🌐 PUBLIC API
   * =====================================
   */

  // API pública para que otros componentes puedan reportar errores
  reportError(errorConfig) {
    const error = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      ...errorConfig
    };
    
    this.errors.set(error.id, error);
    this.showErrorMessage(error);
    this.trackError(error);
    
    return error.id;
  }

  // API para retry manual
  retry(errorId, customAction = null) {
    return this.autoRetry(errorId, customAction);
  }

  // API para guardar manualmente
  save() {
    return this.performManualSave();
  }

  // API para obtener estadísticas de errores
  getErrorStats() {
    return {
      totalErrors: this.errors.size,
      errorsByType: this.getErrorsByType(),
      retryAttempts: this.retryAttempts.size,
      isRecovering: this.isRecovering,
      networkStatus: this.networkStatus
    };
  }

  getErrorsByType() {
    const stats = {};
    this.errors.forEach(error => {
      stats[error.type] = (stats[error.type] || 0) + 1;
    });
    return stats;
  }

  // Cleanup al destruir
  destroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    if (this.errorContainer) {
      this.errorContainer.remove();
    }
    
    if (this.autoSaveIndicator) {
      this.autoSaveIndicator.remove();
    }
    
    this.errors.clear();
    this.retryAttempts.clear();
  }
}

// Inicialización automática
let errorRecovery;

document.addEventListener('DOMContentLoaded', () => {
  errorRecovery = new ErrorRecoveryManager();
  
  // Hacer disponible globalmente
  window.errorRecovery = errorRecovery;
  
  // Cargar datos recuperados si existen
  errorRecovery.loadFromLocalStorage();
  
  console.log('🚨 Error Recovery System Ready');
});

// Export para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorRecoveryManager;
} 