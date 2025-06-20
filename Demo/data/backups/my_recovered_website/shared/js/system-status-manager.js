/**
 * ================================================
 * SYSTEM STATUS MANAGER
 * Manejo inteligente de estados del sistema
 * ================================================
 */

class SystemStatusManager {
    constructor() {
        this.connectionStatus = 'online';
        this.pageStatus = 'ready';
        this.loadingStates = new Map();
        this.toastQueue = [];
        this.init();
    }

    init() {
        this.createStatusElements();
        this.initConnectionMonitoring();
        this.initPageStatusMonitoring();
        this.initFormStatusHandling();
        this.bindEventListeners();
    }

    createStatusElements() {
        // Crear indicador de conexión
        this.connectionElement = document.createElement('div');
        this.connectionElement.className = 'connection-status';
        this.connectionElement.innerHTML = `
            <span class="realtime-indicator">
                <span class="dot"></span>
                <span class="text">En línea</span>
            </span>
        `;
        document.body.appendChild(this.connectionElement);

        // Crear indicador de estado de página
        this.pageStatusElement = document.createElement('div');
        this.pageStatusElement.className = 'page-status';
        this.pageStatusElement.innerHTML = `
            <span class="status-indicator"></span>
            <span class="status-text">Página lista</span>
        `;
        document.body.appendChild(this.pageStatusElement);

        // Mostrar elementos después de un breve delay
        setTimeout(() => {
            this.updateConnectionStatus('online');
            this.updatePageStatus('ready');
        }, 500);
    }

    initConnectionMonitoring() {
        // Monitorear estado de conexión
        window.addEventListener('online', () => {
            this.updateConnectionStatus('online');
            this.showToast('Conexión restaurada', 'success');
        });

        window.addEventListener('offline', () => {
            this.updateConnectionStatus('offline');
            this.showToast('Conexión perdida', 'error');
        });

        // Verificar conexión periódicamente
        setInterval(() => {
            this.checkConnectionQuality();
        }, 30000); // Cada 30 segundos
    }

    initPageStatusMonitoring() {
        // Monitorear carga de página
        document.addEventListener('DOMContentLoaded', () => {
            this.updatePageStatus('ready');
        });

        // Monitorear navegación
        window.addEventListener('beforeunload', () => {
            this.updatePageStatus('loading');
        });

        // Monitorear performance
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        if (entry.loadEventEnd > 3000) {
                            this.showToast('Página cargada lentamente', 'warning');
                        }
                    }
                });
            });
            observer.observe({ entryTypes: ['navigation'] });
        }
    }

    initFormStatusHandling() {
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.handleFieldValidation(e.target);
            }
        });

        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.handleFormSubmission(e.target);
            }
        });
    }

    bindEventListeners() {
        // Manejar clics en enlaces
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.target) {
                this.handleLinkClick(link);
            }
        });

        // Manejar errores de JavaScript
        window.addEventListener('error', (e) => {
            this.updatePageStatus('error');
            this.showToast('Se ha producido un error', 'error');
            console.error('Error capturado por SystemStatusManager:', e);
        });
    }

    updateConnectionStatus(status) {
        this.connectionStatus = status;
        this.connectionElement.className = `connection-status visible ${status}`;
        
        const textElement = this.connectionElement.querySelector('.text');
        switch (status) {
            case 'online':
                textElement.textContent = 'En línea';
                break;
            case 'offline':
                textElement.textContent = 'Sin conexión';
                break;
            case 'reconnecting':
                textElement.textContent = 'Reconectando...';
                break;
        }
    }

    updatePageStatus(status) {
        this.pageStatus = status;
        this.pageStatusElement.className = `page-status visible ${status}`;
        
        const textElement = this.pageStatusElement.querySelector('.status-text');
        switch (status) {
            case 'ready':
                textElement.textContent = 'Página lista';
                break;
            case 'loading':
                textElement.textContent = 'Cargando...';
                break;
            case 'error':
                textElement.textContent = 'Error detectado';
                break;
        }
    }

    handleFieldValidation(field) {
        const wrapper = field.closest('.form-field-status') || this.wrapFieldWithStatus(field);
        
        // Simular validación en tiempo real
        wrapper.classList.add('validating');
        
        setTimeout(() => {
            wrapper.classList.remove('validating');
            
            const isValid = this.validateField(field);
            wrapper.classList.toggle('valid', isValid);
            wrapper.classList.toggle('invalid', !isValid);
        }, 800);
    }

    wrapFieldWithStatus(field) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-field-status';
        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);
        return wrapper;
    }

    validateField(field) {
        // Lógica de validación básica
        if (field.type === 'email') {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        }
        if (field.required) {
            return field.value.trim().length > 0;
        }
        return true;
    }

    handleFormSubmission(form) {
        this.updatePageStatus('loading');
        this.showLoadingState('Enviando formulario...', 'form-submit');
        
        // Simular envío de formulario
        setTimeout(() => {
            this.hideLoadingState('form-submit');
            this.updatePageStatus('ready');
            this.showToast('Formulario enviado correctamente', 'success');
        }, 2000);
    }

    handleLinkClick(link) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
            this.updatePageStatus('loading');
            this.showLoadingState('Navegando...', 'navigation');
        }
    }

    showLoadingState(message, id) {
        this.loadingStates.set(id, {
            message,
            startTime: Date.now()
        });
        this.updateGlobalLoadingIndicator();
    }

    hideLoadingState(id) {
        this.loadingStates.delete(id);
        this.updateGlobalLoadingIndicator();
    }

    updateGlobalLoadingIndicator() {
        const hasActiveLoading = this.loadingStates.size > 0;
        if (hasActiveLoading) {
            this.updatePageStatus('loading');
        } else {
            this.updatePageStatus('ready');
        }
    }

    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `status-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-header">
                <span>${this.getToastIcon(type)} ${this.getToastTitle(type)}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        
        document.body.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => toast.classList.add('visible'), 100);
        
        // Auto-remover toast
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    getToastTitle(type) {
        switch (type) {
            case 'success': return 'Éxito';
            case 'error': return 'Error';
            case 'warning': return 'Advertencia';
            default: return 'Información';
        }
    }

    async checkConnectionQuality() {
        if (!navigator.onLine) {
            this.updateConnectionStatus('offline');
            return;
        }

        try {
            const startTime = Date.now();
            const response = await fetch('/favicon.ico', { 
                method: 'HEAD',
                cache: 'no-cache'
            });
            const endTime = Date.now();
            const latency = endTime - startTime;

            if (latency > 3000) {
                this.updateConnectionStatus('reconnecting');
                this.showToast('Conexión lenta detectada', 'warning');
            } else {
                this.updateConnectionStatus('online');
            }
        } catch (error) {
            this.updateConnectionStatus('reconnecting');
        }
    }

    // Métodos públicos para usar desde otras partes del código
    showProgress(progress, message) {
        let progressContainer = document.querySelector('.global-progress');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'global-progress';
            progressContainer.innerHTML = `
                <div class="progress-container">
                    <div class="progress-bar" style="width: 0%"></div>
                </div>
                <div class="progress-text"></div>
            `;
            document.body.appendChild(progressContainer);
        }

        const progressBar = progressContainer.querySelector('.progress-bar');
        const progressText = progressContainer.querySelector('.progress-text');
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = message || `${progress}% completado`;
        
        progressContainer.style.display = 'block';
        
        if (progress >= 100) {
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 1000);
        }
    }

    markButtonAsLoading(button, loadingText = 'Cargando...') {
        if (!button.classList.contains('btn-with-status')) {
            button.classList.add('btn-with-status');
            const originalText = button.innerHTML;
            button.innerHTML = `
                <span class="btn-text">${originalText}</span>
                <span class="btn-status">
                    <div class="spinner"></div>
                </span>
            `;
            button.dataset.originalText = originalText;
        }
        
        button.classList.add('loading');
        button.disabled = true;
        
        const btnText = button.querySelector('.btn-text');
        if (btnText && loadingText !== btnText.textContent) {
            btnText.textContent = loadingText;
        }
    }

    unmarkButtonAsLoading(button, successText = null) {
        button.classList.remove('loading');
        button.disabled = false;
        
        if (successText) {
            const btnText = button.querySelector('.btn-text');
            if (btnText) btnText.textContent = successText;
            
            setTimeout(() => {
                if (button.dataset.originalText) {
                    const btnTextReset = button.querySelector('.btn-text');
                    if (btnTextReset) btnTextReset.textContent = button.dataset.originalText;
                }
            }, 2000);
        }
    }
}

// Inicializar el sistema cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.systemStatusManager = new SystemStatusManager();
    });
} else {
    window.systemStatusManager = new SystemStatusManager();
}

// Exportar para uso global
window.SystemStatusManager = SystemStatusManager; 