/**
 * ================================================
 * USER CONTROL MANAGER
 * Sistema de control y libertad del usuario
 * ================================================
 */

class UserControlManager {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.preferences = this.loadPreferences();
        this.shortcuts = new Map();
        this.customizations = this.loadCustomizations();
        this.init();
    }

    init() {
        this.createControlPanel();
        this.initKeyboardShortcuts();
        this.initNavigationHistory();
        this.initPreferencesPanel();
        this.initQuickActions();
        this.applyUserPreferences();
        this.bindEventListeners();
    }

    createControlPanel() {
        // Crear panel de control flotante
        const controlPanel = document.createElement('div');
        controlPanel.id = 'user-control-panel';
        controlPanel.className = 'user-control-panel';
        controlPanel.innerHTML = `
            <button class="control-toggle" title="Panel de Control (Ctrl+K)">
                <span class="control-icon">⚙️</span>
            </button>
            <div class="control-content">
                <div class="control-header">
                    <h3>Control de Usuario</h3>
                    <button class="control-close">✕</button>
                </div>
                <div class="control-body">
                    <!-- Navegación -->
                    <div class="control-section">
                        <h4>📍 Navegación</h4>
                        <div class="navigation-controls">
                            <button class="btn btn-sm btn-outline-secondary" id="goBack" title="Atrás (Alt+←)">
                                ← Atrás
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" id="goForward" title="Adelante (Alt+→)">
                                Adelante →
                            </button>
                            <button class="btn btn-sm btn-outline-primary" id="goHome" title="Inicio (Alt+H)">
                                🏠 Inicio
                            </button>
                        </div>
                        <div class="breadcrumb-quick-nav">
                            <label>Ir rápido a:</label>
                            <select id="quickNavigation">
                                <option value="">Seleccionar sección...</option>
                                <option value="/public/">🏠 Inicio</option>
                                <option value="/public/sections/pilgrim/">🚀 Pilgrim</option>
                                <option value="/public/sections/merchant/">🏪 Merchant</option>
                                <option value="/public/sections/red-pill/">💊 Red Pill</option>
                                <option value="/public/docs/">📚 Documentación</option>
                            </select>
                        </div>
                    </div>

                    <!-- Preferencias de Visualización -->
                    <div class="control-section">
                        <h4>👁️ Visualización</h4>
                        <div class="preference-group">
                            <label>
                                <input type="checkbox" id="darkMode"> Modo Oscuro
                            </label>
                            <label>
                                <input type="checkbox" id="reduceMotion"> Reducir Animaciones
                            </label>
                            <label>
                                <input type="checkbox" id="highContrast"> Alto Contraste
                            </label>
                            <label>
                                <input type="checkbox" id="largeText"> Texto Grande
                            </label>
                        </div>
                        <div class="font-size-control">
                            <label for="fontSize">Tamaño de Fuente:</label>
                            <input type="range" id="fontSize" min="12" max="24" value="16">
                            <span id="fontSizeValue">16px</span>
                        </div>
                    </div>

                    <!-- Acciones Rápidas -->
                    <div class="control-section">
                        <h4>⚡ Acciones Rápidas</h4>
                        <div class="quick-actions">
                            <button class="btn btn-sm btn-outline-primary" id="printPage" title="Imprimir (Ctrl+P)">
                                🖨️ Imprimir
                            </button>
                            <button class="btn btn-sm btn-outline-primary" id="shareCurrentPage" title="Compartir">
                                📤 Compartir
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" id="refreshPage" title="Actualizar (F5)">
                                🔄 Actualizar
                            </button>
                            <button class="btn btn-sm btn-outline-warning" id="reportIssue" title="Reportar Problema">
                                🐛 Reportar
                            </button>
                        </div>
                    </div>

                    <!-- Atajos de Teclado -->
                    <div class="control-section">
                        <h4>⌨️ Atajos de Teclado</h4>
                        <div class="shortcuts-list">
                            <div class="shortcut-item">
                                <span class="shortcut-key">Ctrl + K</span>
                                <span class="shortcut-desc">Panel de Control</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + ←/→</span>
                                <span class="shortcut-desc">Navegar Atrás/Adelante</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Alt + H</span>
                                <span class="shortcut-desc">Ir al Inicio</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-key">Esc</span>
                                <span class="shortcut-desc">Cerrar Paneles</span>
                            </div>
                        </div>
                    </div>

                    <!-- Configuración Avanzada -->
                    <div class="control-section">
                        <h4>🔧 Configuración</h4>
                        <div class="advanced-settings">
                            <button class="btn btn-sm btn-outline-secondary" id="resetPreferences">
                                🔄 Restaurar Configuración
                            </button>
                            <button class="btn btn-sm btn-outline-primary" id="exportSettings">
                                📥 Exportar Ajustes
                            </button>
                            <button class="btn btn-sm btn-outline-success" id="importSettings">
                                📤 Importar Ajustes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(controlPanel);
        this.controlPanel = controlPanel;
    }

    initKeyboardShortcuts() {
        // Atajos de teclado globales
        this.shortcuts.set('ctrl+k', () => this.toggleControlPanel());
        this.shortcuts.set('alt+arrowleft', () => this.navigateBack());
        this.shortcuts.set('alt+arrowright', () => this.navigateForward());
        this.shortcuts.set('alt+h', () => this.navigateHome());
        this.shortcuts.set('escape', () => this.closeAllPanels());
        this.shortcuts.set('ctrl+p', (e) => { e.preventDefault(); this.printPage(); });
        this.shortcuts.set('f5', (e) => { e.preventDefault(); this.refreshPage(); });

        document.addEventListener('keydown', (e) => {
            const key = this.getShortcutKey(e);
            if (this.shortcuts.has(key)) {
                this.shortcuts.get(key)(e);
            }
        });
    }

    getShortcutKey(event) {
        const modifiers = [];
        if (event.ctrlKey) modifiers.push('ctrl');
        if (event.altKey) modifiers.push('alt');
        if (event.shiftKey) modifiers.push('shift');
        if (event.metaKey) modifiers.push('meta');
        
        const key = event.key.toLowerCase();
        return modifiers.concat(key).join('+');
    }

    initNavigationHistory() {
        // Guardar estado inicial
        this.saveToHistory(window.location.href, document.title);

        // Interceptar navegación
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = (state, title, url) => {
            originalPushState.call(history, state, title, url);
            this.saveToHistory(url, title);
        };

        history.replaceState = (state, title, url) => {
            originalReplaceState.call(history, state, title, url);
            this.updateCurrentHistory(url, title);
        };

        // Manejar popstate
        window.addEventListener('popstate', (e) => {
            this.updateNavigationButtons();
        });
    }

    initPreferencesPanel() {
        // Inicializar controles de preferencias
        const darkModeToggle = this.controlPanel.querySelector('#darkMode');
        const reduceMotionToggle = this.controlPanel.querySelector('#reduceMotion');
        const highContrastToggle = this.controlPanel.querySelector('#highContrast');
        const largeTextToggle = this.controlPanel.querySelector('#largeText');
        const fontSizeSlider = this.controlPanel.querySelector('#fontSize');
        const fontSizeValue = this.controlPanel.querySelector('#fontSizeValue');

        // Cargar estado actual
        darkModeToggle.checked = this.preferences.darkMode;
        reduceMotionToggle.checked = this.preferences.reduceMotion;
        highContrastToggle.checked = this.preferences.highContrast;
        largeTextToggle.checked = this.preferences.largeText;
        fontSizeSlider.value = this.preferences.fontSize;
        fontSizeValue.textContent = `${this.preferences.fontSize}px`;

        // Eventos de cambio
        darkModeToggle.addEventListener('change', (e) => {
            this.setPreference('darkMode', e.target.checked);
        });

        reduceMotionToggle.addEventListener('change', (e) => {
            this.setPreference('reduceMotion', e.target.checked);
        });

        highContrastToggle.addEventListener('change', (e) => {
            this.setPreference('highContrast', e.target.checked);
        });

        largeTextToggle.addEventListener('change', (e) => {
            this.setPreference('largeText', e.target.checked);
        });

        fontSizeSlider.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            this.setPreference('fontSize', size);
            fontSizeValue.textContent = `${size}px`;
        });
    }

    initQuickActions() {
        // Configurar acciones rápidas
        const quickNav = this.controlPanel.querySelector('#quickNavigation');
        quickNav.addEventListener('change', (e) => {
            if (e.target.value) {
                this.navigateToSection(e.target.value);
                e.target.value = '';
            }
        });

        // Botones de navegación
        this.controlPanel.querySelector('#goBack').addEventListener('click', () => this.navigateBack());
        this.controlPanel.querySelector('#goForward').addEventListener('click', () => this.navigateForward());
        this.controlPanel.querySelector('#goHome').addEventListener('click', () => this.navigateHome());

        // Acciones de página
        this.controlPanel.querySelector('#printPage').addEventListener('click', () => this.printPage());
        this.controlPanel.querySelector('#shareCurrentPage').addEventListener('click', () => this.shareCurrentPage());
        this.controlPanel.querySelector('#refreshPage').addEventListener('click', () => this.refreshPage());
        this.controlPanel.querySelector('#reportIssue').addEventListener('click', () => this.reportIssue());

        // Configuración
        this.controlPanel.querySelector('#resetPreferences').addEventListener('click', () => this.resetPreferences());
        this.controlPanel.querySelector('#exportSettings').addEventListener('click', () => this.exportSettings());
        this.controlPanel.querySelector('#importSettings').addEventListener('click', () => this.importSettings());
    }

    bindEventListeners() {
        const toggle = this.controlPanel.querySelector('.control-toggle');
        const close = this.controlPanel.querySelector('.control-close');

        toggle.addEventListener('click', () => this.toggleControlPanel());
        close.addEventListener('click', () => this.closeControlPanel());

        // Cerrar panel al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.controlPanel.contains(e.target) && 
                this.controlPanel.classList.contains('active')) {
                this.closeControlPanel();
            }
        });
    }

    // Gestión de Navegación
    saveToHistory(url, title) {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push({ url, title, timestamp: Date.now() });
        this.historyIndex = this.history.length - 1;
        this.updateNavigationButtons();
    }

    updateCurrentHistory(url, title) {
        if (this.history[this.historyIndex]) {
            this.history[this.historyIndex] = { url, title, timestamp: Date.now() };
        }
    }

    navigateBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const historyItem = this.history[this.historyIndex];
            window.location.href = historyItem.url;
        }
    }

    navigateForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const historyItem = this.history[this.historyIndex];
            window.location.href = historyItem.url;
        }
    }

    navigateHome() {
        window.location.href = '/public/';
    }

    navigateToSection(url) {
        window.location.href = url;
    }

    updateNavigationButtons() {
        const backBtn = this.controlPanel.querySelector('#goBack');
        const forwardBtn = this.controlPanel.querySelector('#goForward');
        
        backBtn.disabled = this.historyIndex <= 0;
        forwardBtn.disabled = this.historyIndex >= this.history.length - 1;
    }

    // Gestión de Preferencias
    loadPreferences() {
        const defaultPreferences = {
            darkMode: false,
            reduceMotion: false,
            highContrast: false,
            largeText: false,
            fontSize: 16
        };

        try {
            const saved = localStorage.getItem('coomunity-user-preferences');
            return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
        } catch {
            return defaultPreferences;
        }
    }

    setPreference(key, value) {
        this.preferences[key] = value;
        this.savePreferences();
        this.applyUserPreferences();
    }

    savePreferences() {
        try {
            localStorage.setItem('coomunity-user-preferences', JSON.stringify(this.preferences));
        } catch (error) {
            console.warn('No se pudieron guardar las preferencias:', error);
        }
    }

    applyUserPreferences() {
        const root = document.documentElement;
        
        // Modo oscuro
        root.classList.toggle('dark-mode', this.preferences.darkMode);
        
        // Reducir movimiento
        root.classList.toggle('reduce-motion', this.preferences.reduceMotion);
        
        // Alto contraste
        root.classList.toggle('high-contrast', this.preferences.highContrast);
        
        // Texto grande
        root.classList.toggle('large-text', this.preferences.largeText);
        
        // Tamaño de fuente
        root.style.setProperty('--base-font-size', `${this.preferences.fontSize}px`);

        // Notificar cambios
        if (window.systemStatusManager) {
            window.systemStatusManager.showToast('Preferencias aplicadas', 'success', 2000);
        }
    }

    // Gestión de Customizaciones
    loadCustomizations() {
        try {
            const saved = localStorage.getItem('coomunity-customizations');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }

    saveCustomizations() {
        try {
            localStorage.setItem('coomunity-customizations', JSON.stringify(this.customizations));
        } catch (error) {
            console.warn('No se pudieron guardar las customizaciones:', error);
        }
    }

    // Panel de Control
    toggleControlPanel() {
        this.controlPanel.classList.toggle('active');
        
        if (this.controlPanel.classList.contains('active')) {
            this.updateNavigationButtons();
        }
    }

    closeControlPanel() {
        this.controlPanel.classList.remove('active');
    }

    closeAllPanels() {
        this.closeControlPanel();
        // Cerrar otros paneles si existen
        document.querySelectorAll('.modal, .overlay, .popup').forEach(panel => {
            panel.classList.remove('active', 'visible', 'open');
        });
    }

    // Acciones Rápidas
    printPage() {
        window.print();
    }

    shareCurrentPage() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                if (window.systemStatusManager) {
                    window.systemStatusManager.showToast('URL copiada al portapapeles', 'success');
                }
            });
        }
    }

    refreshPage() {
        window.location.reload();
    }

    reportIssue() {
        const issueData = {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            preferences: this.preferences
        };

        console.log('Datos del reporte de problema:', issueData);
        
        if (window.systemStatusManager) {
            window.systemStatusManager.showToast(
                'Reporte enviado. Gracias por tu feedback!', 
                'success'
            );
        }
    }

    // Configuración Avanzada
    resetPreferences() {
        if (confirm('¿Estás seguro de que quieres restaurar toda la configuración?')) {
            this.preferences = this.loadPreferences.call({ constructor: this.constructor });
            this.savePreferences();
            this.applyUserPreferences();
            this.initPreferencesPanel();
            
            if (window.systemStatusManager) {
                window.systemStatusManager.showToast('Configuración restaurada', 'info');
            }
        }
    }

    exportSettings() {
        const settings = {
            preferences: this.preferences,
            customizations: this.customizations,
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(settings, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'coomunity-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const settings = JSON.parse(event.target.result);
                        if (settings.preferences) {
                            this.preferences = { ...this.preferences, ...settings.preferences };
                            this.savePreferences();
                            this.applyUserPreferences();
                            this.initPreferencesPanel();
                        }
                        if (settings.customizations) {
                            this.customizations = { ...this.customizations, ...settings.customizations };
                            this.saveCustomizations();
                        }
                        
                        if (window.systemStatusManager) {
                            window.systemStatusManager.showToast('Configuración importada correctamente', 'success');
                        }
                    } catch (error) {
                        if (window.systemStatusManager) {
                            window.systemStatusManager.showToast('Error al importar configuración', 'error');
                        }
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.userControlManager = new UserControlManager();
    });
} else {
    window.userControlManager = new UserControlManager();
}

// Exportar para uso global
window.UserControlManager = UserControlManager; 