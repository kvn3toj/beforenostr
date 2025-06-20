/**
 * ================================================
 * FLEXIBILITY AND SHORTCUTS MANAGER
 * Sistema de flexibilidad y atajos para usuarios expertos
 * ================================================ */

class FlexibilityManager {
    constructor() {
        this.shortcuts = new Map();
        this.commands = new Map();
        this.quickActions = [];
        this.customizations = new Map();
        this.selectedItems = new Set();
        this.searchHistory = [];
        this.preferences = this.loadPreferences();
        this.init();
    }

    init() {
        this.initKeyboardShortcuts();
        this.initCommandPalette();
        this.initQuickActions();
        this.initCustomizableInterface();
        this.initAdvancedSearch();
        this.initBulkActions();
        this.initAccessibilityControls();
        this.bindGlobalEventListeners();
        this.restoreCustomizations();
    }

    // ================================================
    // KEYBOARD SHORTCUTS SYSTEM
    // ================================================

    initKeyboardShortcuts() {
        // Definir shortcuts por defecto
        this.registerShortcut('?', () => this.showShortcutsHelp(), 'Mostrar ayuda de atajos');
        this.registerShortcut('Ctrl+K', () => this.openCommandPalette(), 'Abrir paleta de comandos');
        this.registerShortcut('Ctrl+/', () => this.toggleQuickActions(), 'Mostrar/ocultar acciones rápidas');
        this.registerShortcut('Escape', () => this.handleEscape(), 'Cerrar overlays');
        this.registerShortcut('Ctrl+H', () => this.goHome(), 'Ir al inicio');
        this.registerShortcut('Ctrl+B', () => this.goBack(), 'Ir atrás');
        this.registerShortcut('Ctrl+Shift+D', () => this.toggleDarkMode(), 'Alternar modo oscuro');
        this.registerShortcut('Ctrl+Shift+A', () => this.toggleAccessibilityControls(), 'Controles de accesibilidad');
        this.registerShortcut('Ctrl+A', () => this.selectAll(), 'Seleccionar todo');
        this.registerShortcut('Delete', () => this.deleteSelected(), 'Eliminar seleccionados');

        // Shortcuts de navegación
        this.registerShortcut('G H', () => this.goToSection('home'), 'Ir a inicio');
        this.registerShortcut('G P', () => this.goToSection('pilgrim'), 'Ir a Pilgrim');
        this.registerShortcut('G M', () => this.goToSection('merchant'), 'Ir a Merchant');
        this.registerShortcut('G R', () => this.goToSection('red-pill'), 'Ir a Red Pill');
        this.registerShortcut('G D', () => this.goToSection('docs'), 'Ir a documentación');

        // Shortcuts de búsqueda
        this.registerShortcut('/', () => this.focusSearch(), 'Enfocar búsqueda');
        this.registerShortcut('Ctrl+F', () => this.focusSearch(), 'Buscar en página');

        // Añadir indicadores visuales a elementos con shortcuts
        this.addShortcutIndicators();
    }

    registerShortcut(keys, callback, description, category = 'General') {
        const normalizedKeys = this.normalizeKeys(keys);
        this.shortcuts.set(normalizedKeys, {
            callback,
            description,
            category,
            keys: keys
        });
    }

    normalizeKeys(keys) {
        return keys.toLowerCase()
            .replace(/\s+/g, ' ')
            .replace('ctrl', 'control')
            .replace('cmd', 'meta');
    }

    addShortcutIndicators() {
        // Añadir indicadores a navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            const shortcuts = ['G H', 'G P', 'G M', 'G R', 'G D'];
            if (shortcuts[index]) {
                this.addShortcutToElement(link, shortcuts[index]);
            }
        });

        // Añadir a botones principales
        this.addShortcutToElement(document.querySelector('[data-command="search"]'), '/');
        this.addShortcutToElement(document.querySelector('[data-command="help"]'), '?');
    }

    addShortcutToElement(element, shortcut) {
        if (!element) return;

        const indicator = document.createElement('span');
        indicator.className = 'shortcut-indicator';
        indicator.innerHTML = this.formatShortcutKeys(shortcut);
        
        element.appendChild(indicator);
    }

    formatShortcutKeys(keys) {
        return keys.split(' ').map(key => {
            if (key.includes('+')) {
                return key.split('+').map(k => `<span class="shortcut-key">${k}</span>`).join('<span class="shortcut-plus">+</span>');
            }
            return `<span class="shortcut-key">${key}</span>`;
        }).join(' ');
    }

    handleKeyDown(event) {
        const keys = this.getEventKeys(event);
        const normalizedKeys = this.normalizeKeys(keys);
        
        const shortcut = this.shortcuts.get(normalizedKeys);
        if (shortcut) {
            event.preventDefault();
            shortcut.callback();
            this.showShortcutFeedback(keys);
        }
    }

    getEventKeys(event) {
        const keys = [];
        
        if (event.ctrlKey) keys.push('Ctrl');
        if (event.shiftKey) keys.push('Shift');
        if (event.altKey) keys.push('Alt');
        if (event.metaKey) keys.push('Cmd');
        
        // Teclas especiales
        const specialKeys = {
            'Escape': 'Escape',
            'Delete': 'Delete',
            'Backspace': 'Backspace',
            'Enter': 'Enter',
            'Tab': 'Tab',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→'
        };
        
        if (specialKeys[event.key]) {
            keys.push(specialKeys[event.key]);
        } else if (event.key.length === 1) {
            keys.push(event.key.toUpperCase());
        }
        
        return keys.join('+');
    }

    showShortcutFeedback(keys) {
        const feedback = document.createElement('div');
        feedback.className = 'shortcut-feedback';
        feedback.textContent = keys;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gray-900);
            color: var(--white);
            padding: 8px 12px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        document.body.appendChild(feedback);
        
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
        });
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 200);
        }, 1500);
    }

    showShortcutsHelp() {
        if (document.querySelector('.shortcuts-help-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'shortcuts-help-overlay';
        
        const categories = this.groupShortcutsByCategory();
        const sectionsHTML = Object.entries(categories).map(([category, shortcuts]) => `
            <div class="shortcuts-section">
                <h3 class="shortcuts-section-title">
                    <span class="shortcuts-section-icon">${this.getCategoryIcon(category)}</span>
                    ${category}
                </h3>
                <ul class="shortcuts-list">
                    ${shortcuts.map(shortcut => `
                        <li class="shortcut-item">
                            <span class="shortcut-description">${shortcut.description}</span>
                            <div class="shortcut-keys">${this.formatShortcutKeys(shortcut.keys)}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');

        overlay.innerHTML = `
            <div class="shortcuts-help-panel">
                <div class="shortcuts-help-header">
                    <h2 class="shortcuts-help-title">⌨️ Atajos de Teclado</h2>
                    <button class="shortcuts-help-close" aria-label="Cerrar ayuda">✕</button>
                </div>
                <div class="shortcuts-grid">
                    ${sectionsHTML}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        // Event listeners
        overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('shortcuts-help-close') || 
                !e.target.closest('.shortcuts-help-panel')) {
                this.closeShortcutsHelp();
            }
        });
    }

    groupShortcutsByCategory() {
        const categories = {};
        this.shortcuts.forEach(shortcut => {
            if (!categories[shortcut.category]) {
                categories[shortcut.category] = [];
            }
            categories[shortcut.category].push(shortcut);
        });
        return categories;
    }

    getCategoryIcon(category) {
        const icons = {
            'General': '⚡',
            'Navegación': '🧭',
            'Búsqueda': '🔍',
            'Selección': '✅',
            'Edición': '✏️'
        };
        return icons[category] || '📂';
    }

    closeShortcutsHelp() {
        const overlay = document.querySelector('.shortcuts-help-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    // ================================================
    // COMMAND PALETTE
    // ================================================

    initCommandPalette() {
        // Registrar comandos
        this.registerCommand('home', 'Ir al Inicio', '🏠', () => this.goToSection('home'));
        this.registerCommand('pilgrim', 'Demo Pilgrim', '🚀', () => this.goToSection('pilgrim'));
        this.registerCommand('merchant', 'Demo Merchant', '🏪', () => this.goToSection('merchant'));
        this.registerCommand('red-pill', 'Red Pill Interactive', '💊', () => this.goToSection('red-pill'));
        this.registerCommand('docs', 'Documentación', '📚', () => this.goToSection('docs'));
        this.registerCommand('toggle-dark', 'Alternar Modo Oscuro', '🌙', () => this.toggleDarkMode());
        this.registerCommand('help', 'Mostrar Ayuda', '❓', () => this.showShortcutsHelp());
        this.registerCommand('settings', 'Configuraciones', '⚙️', () => this.openSettings());
        this.registerCommand('clear-cache', 'Limpiar Caché', '🗑️', () => this.clearCache());
        this.registerCommand('export-data', 'Exportar Datos', '📤', () => this.exportData());
    }

    registerCommand(id, title, icon, callback, description = '') {
        this.commands.set(id, {
            id,
            title,
            icon,
            callback,
            description: description || title
        });
    }

    openCommandPalette() {
        if (document.querySelector('.command-palette-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'command-palette-overlay';
        overlay.innerHTML = `
            <div class="command-palette">
                <input type="text" class="command-input" placeholder="Buscar comandos..." autocomplete="off">
                <div class="command-results"></div>
            </div>
        `;

        document.body.appendChild(overlay);
        
        const input = overlay.querySelector('.command-input');
        const results = overlay.querySelector('.command-results');
        
        // Mostrar todos los comandos inicialmente
        this.updateCommandResults(results, '');
        
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            input.focus();
        });

        // Event listeners
        input.addEventListener('input', (e) => {
            this.updateCommandResults(results, e.target.value);
        });

        input.addEventListener('keydown', (e) => {
            this.handleCommandPaletteKeydown(e, results);
        });

        overlay.addEventListener('click', (e) => {
            if (!e.target.closest('.command-palette')) {
                this.closeCommandPalette();
            }
        });
    }

    updateCommandResults(container, query) {
        const filteredCommands = Array.from(this.commands.values())
            .filter(cmd => 
                cmd.title.toLowerCase().includes(query.toLowerCase()) ||
                cmd.description.toLowerCase().includes(query.toLowerCase())
            );

        container.innerHTML = filteredCommands.map((cmd, index) => `
            <div class="command-item ${index === 0 ? 'selected' : ''}" data-command-id="${cmd.id}">
                <div class="command-icon">${cmd.icon}</div>
                <div class="command-content">
                    <div class="command-title">${cmd.title}</div>
                    <div class="command-description">${cmd.description}</div>
                </div>
                <div class="command-shortcut">Enter</div>
            </div>
        `).join('');

        // Event listeners para los comandos
        container.querySelectorAll('.command-item').forEach(item => {
            item.addEventListener('click', () => {
                const commandId = item.dataset.commandId;
                this.executeCommand(commandId);
                this.closeCommandPalette();
            });
        });
    }

    handleCommandPaletteKeydown(event, results) {
        const items = results.querySelectorAll('.command-item');
        const selected = results.querySelector('.command-item.selected');
        let newIndex = 0;

        if (selected) {
            const currentIndex = Array.from(items).indexOf(selected);
            
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    newIndex = (currentIndex + 1) % items.length;
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    newIndex = (currentIndex - 1 + items.length) % items.length;
                    break;
                case 'Enter':
                    event.preventDefault();
                    const commandId = selected.dataset.commandId;
                    this.executeCommand(commandId);
                    this.closeCommandPalette();
                    return;
                case 'Escape':
                    event.preventDefault();
                    this.closeCommandPalette();
                    return;
            }
        }

        // Actualizar selección
        items.forEach(item => item.classList.remove('selected'));
        if (items[newIndex]) {
            items[newIndex].classList.add('selected');
        }
    }

    executeCommand(commandId) {
        const command = this.commands.get(commandId);
        if (command) {
            command.callback();
        }
    }

    closeCommandPalette() {
        const overlay = document.querySelector('.command-palette-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    // ================================================
    // QUICK ACTIONS TOOLBAR
    // ================================================

    initQuickActions() {
        this.quickActions = [
            { icon: '🏠', text: 'Inicio', action: () => this.goToSection('home'), shortcut: 'G H' },
            { icon: '🔍', text: 'Buscar', action: () => this.focusSearch(), shortcut: '/' },
            { icon: '⌨️', text: 'Atajos', action: () => this.showShortcutsHelp(), shortcut: '?' },
            { icon: '⚙️', text: 'Configurar', action: () => this.openSettings(), shortcut: 'Ctrl+,' },
            { icon: '🌙', text: 'Modo Oscuro', action: () => this.toggleDarkMode(), shortcut: 'Ctrl+Shift+D' },
            { icon: '♿', text: 'Accesibilidad', action: () => this.toggleAccessibilityControls(), shortcut: 'Ctrl+Shift+A' }
        ];

        this.createQuickActionsToolbar();
    }

    createQuickActionsToolbar() {
        if (document.querySelector('.quick-actions-toolbar')) return;

        const toolbar = document.createElement('div');
        toolbar.className = 'quick-actions-toolbar';
        toolbar.innerHTML = `
            <div class="quick-actions-list">
                ${this.quickActions.map(action => `
                    <button class="quick-action-item" data-action="${action.text.toLowerCase()}">
                        <span class="quick-action-icon">${action.icon}</span>
                        <span class="quick-action-text">${action.text}</span>
                        <span class="quick-action-shortcut">${action.shortcut}</span>
                    </button>
                `).join('')}
            </div>
        `;

        document.body.appendChild(toolbar);

        // Event listeners
        toolbar.querySelectorAll('.quick-action-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.quickActions[index].action();
            });
        });
    }

    toggleQuickActions() {
        const toolbar = document.querySelector('.quick-actions-toolbar');
        if (toolbar) {
            toolbar.classList.toggle('active');
        }
    }

    // ================================================
    // CUSTOMIZABLE INTERFACE
    // ================================================

    initCustomizableInterface() {
        // Marcar elementos como personalizables
        document.querySelectorAll('.demo-card, .widget, .panel').forEach(element => {
            this.makeElementCustomizable(element);
        });
    }

    makeElementCustomizable(element) {
        element.classList.add('customizable-panel');
        
        const handle = document.createElement('button');
        handle.className = 'customization-handle';
        handle.innerHTML = '⚙️';
        handle.setAttribute('aria-label', 'Personalizar elemento');
        
        const menu = document.createElement('div');
        menu.className = 'customization-menu';
        menu.innerHTML = `
            <button class="customization-option" data-action="hide">Ocultar elemento</button>
            <button class="customization-option" data-action="move">Mover elemento</button>
            <button class="customization-option" data-action="resize">Redimensionar</button>
            <button class="customization-option" data-action="reset">Restaurar original</button>
        `;

        element.appendChild(handle);
        element.appendChild(menu);

        // Event listeners
        handle.addEventListener('click', (e) => {
            e.stopPropagation();
            handle.classList.toggle('active');
        });

        menu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handleCustomizationAction(element, action);
                handle.classList.remove('active');
            }
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', () => {
            handle.classList.remove('active');
        });
    }

    handleCustomizationAction(element, action) {
        const elementId = element.id || `element-${Date.now()}`;
        if (!element.id) element.id = elementId;

        switch (action) {
            case 'hide':
                element.style.display = 'none';
                this.saveCustomization(elementId, 'hidden', true);
                break;
            case 'move':
                this.enableDragAndDrop(element);
                break;
            case 'resize':
                this.enableResize(element);
                break;
            case 'reset':
                this.resetElementCustomization(element);
                break;
        }
    }

    enableDragAndDrop(element) {
        element.draggable = true;
        element.style.cursor = 'move';
        
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', element.id);
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            element.style.cursor = '';
            element.draggable = false;
        });

        // Hacer que otros elementos sean drop targets
        document.querySelectorAll('.customizable-panel').forEach(target => {
            if (target !== element) {
                this.makeDropTarget(target);
            }
        });
    }

    makeDropTarget(element) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('drop-target');
        });

        element.addEventListener('dragleave', () => {
            element.classList.remove('drop-target');
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggedId);
            
            if (draggedElement) {
                element.parentNode.insertBefore(draggedElement, element.nextSibling);
                this.saveCustomization(draggedId, 'position', this.getElementPosition(draggedElement));
            }
            
            element.classList.remove('drop-target');
        });
    }

    // ================================================
    // ADVANCED SEARCH
    // ================================================

    initAdvancedSearch() {
        const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
        searchInputs.forEach(input => this.enhanceSearchInput(input));
    }

    enhanceSearchInput(input) {
        const container = this.createSearchContainer(input);
        const suggestions = this.createSearchSuggestions(container);
        
        input.addEventListener('input', (e) => {
            this.handleSearchInput(e.target, suggestions);
        });

        input.addEventListener('keydown', (e) => {
            this.handleSearchKeydown(e, suggestions);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim()) {
                suggestions.classList.add('active');
            }
        });

        input.addEventListener('blur', () => {
            setTimeout(() => suggestions.classList.remove('active'), 200);
        });
    }

    createSearchContainer(input) {
        const container = document.createElement('div');
        container.className = 'advanced-search';
        
        input.parentNode.insertBefore(container, input);
        container.appendChild(input);
        
        return container;
    }

    createSearchSuggestions(container) {
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        container.appendChild(suggestions);
        return suggestions;
    }

    handleSearchInput(input, suggestions) {
        const query = input.value.trim();
        
        if (query.length < 2) {
            suggestions.classList.remove('active');
            return;
        }

        const results = this.getSearchSuggestions(query);
        this.updateSearchSuggestions(suggestions, results);
        suggestions.classList.add('active');
    }

    getSearchSuggestions(query) {
        const suggestions = [
            { text: 'Pilgrim Demo', icon: '🚀', action: () => this.goToSection('pilgrim') },
            { text: 'Merchant Demo', icon: '🏪', action: () => this.goToSection('merchant') },
            { text: 'Red Pill Interactive', icon: '💊', action: () => this.goToSection('red-pill') },
            { text: 'Documentación', icon: '📚', action: () => this.goToSection('docs') },
            { text: 'Configuraciones', icon: '⚙️', action: () => this.openSettings() },
            { text: 'Atajos de teclado', icon: '⌨️', action: () => this.showShortcutsHelp() }
        ];

        return suggestions.filter(item => 
            item.text.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    updateSearchSuggestions(container, results) {
        container.innerHTML = results.map((item, index) => `
            <div class="search-suggestion ${index === 0 ? 'highlighted' : ''}" data-index="${index}">
                <span class="suggestion-icon">${item.icon}</span>
                <span class="suggestion-text">${item.text}</span>
                <span class="suggestion-shortcut">Enter</span>
            </div>
        `).join('');

        // Event listeners
        container.querySelectorAll('.search-suggestion').forEach((item, index) => {
            item.addEventListener('click', () => {
                results[index].action();
                container.classList.remove('active');
            });
        });
    }

    // ================================================
    // BULK ACTIONS
    // ================================================

    initBulkActions() {
        // Añadir checkboxes a elementos seleccionables
        document.querySelectorAll('.demo-card, .list-item, .grid-item').forEach(element => {
            this.makeElementSelectable(element);
        });
    }

    makeElementSelectable(element) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'bulk-select-checkbox';
        checkbox.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        element.style.position = 'relative';
        element.appendChild(checkbox);

        // Mostrar checkbox al hover
        element.addEventListener('mouseenter', () => {
            checkbox.style.opacity = '1';
        });

        element.addEventListener('mouseleave', () => {
            if (!checkbox.checked) {
                checkbox.style.opacity = '0';
            }
        });

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                this.selectedItems.add(element);
                element.classList.add('selected');
                checkbox.style.opacity = '1';
            } else {
                this.selectedItems.delete(element);
                element.classList.remove('selected');
            }
            this.updateBulkActionsBar();
        });
    }

    updateBulkActionsBar() {
        let bar = document.querySelector('.bulk-actions-bar');
        
        if (this.selectedItems.size === 0) {
            if (bar) {
                bar.classList.remove('active');
            }
            return;
        }

        if (!bar) {
            bar = this.createBulkActionsBar();
        }

        const count = bar.querySelector('.selection-count');
        count.textContent = this.selectedItems.size;

        bar.classList.add('active');
    }

    createBulkActionsBar() {
        const bar = document.createElement('div');
        bar.className = 'bulk-actions-bar';
        bar.innerHTML = `
            <div class="bulk-actions-content">
                <div class="bulk-selection-info">
                    <span class="selection-count">0</span>
                    <span class="selection-text">elementos seleccionados</span>
                </div>
                <div class="bulk-actions-list">
                    <button class="bulk-action-btn" data-action="export">Exportar</button>
                    <button class="bulk-action-btn" data-action="hide">Ocultar</button>
                    <button class="bulk-action-btn danger" data-action="delete">Eliminar</button>
                    <button class="bulk-action-btn" data-action="clear">Cancelar</button>
                </div>
            </div>
        `;

        document.body.appendChild(bar);

        // Event listeners
        bar.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handleBulkAction(action);
            }
        });

        return bar;
    }

    handleBulkAction(action) {
        switch (action) {
            case 'delete':
                this.deleteBulkSelection();
                break;
            case 'hide':
                this.hideBulkSelection();
                break;
            case 'export':
                this.exportBulkSelection();
                break;
            case 'clear':
                this.clearBulkSelection();
                break;
        }
    }

    clearBulkSelection() {
        this.selectedItems.forEach(element => {
            element.classList.remove('selected');
            const checkbox = element.querySelector('.bulk-select-checkbox');
            if (checkbox) {
                checkbox.checked = false;
                checkbox.style.opacity = '0';
            }
        });
        this.selectedItems.clear();
        this.updateBulkActionsBar();
    }

    // ================================================
    // ACCESSIBILITY CONTROLS
    // ================================================

    initAccessibilityControls() {
        const controls = document.createElement('div');
        controls.className = 'accessibility-controls';
        controls.innerHTML = `
            <button class="accessibility-toggle">Accesibilidad</button>
            <div class="accessibility-options">
                <div class="accessibility-option">
                    <span class="accessibility-label">Alto contraste</span>
                    <div class="accessibility-switch" data-feature="high-contrast"></div>
                </div>
                <div class="accessibility-option">
                    <span class="accessibility-label">Texto grande</span>
                    <div class="accessibility-switch" data-feature="large-text"></div>
                </div>
                <div class="accessibility-option">
                    <span class="accessibility-label">Reducir animaciones</span>
                    <div class="accessibility-switch" data-feature="reduce-motion"></div>
                </div>
                <div class="accessibility-option">
                    <span class="accessibility-label">Atajos de teclado</span>
                    <div class="accessibility-switch active" data-feature="keyboard-shortcuts"></div>
                </div>
            </div>
        `;

        document.body.appendChild(controls);

        // Event listeners
        controls.querySelector('.accessibility-toggle').addEventListener('click', () => {
            controls.classList.toggle('active');
        });

        controls.querySelectorAll('.accessibility-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const feature = toggle.dataset.feature;
                this.toggleAccessibilityFeature(feature, toggle.classList.contains('active'));
            });
        });
    }

    toggleAccessibilityFeature(feature, enabled) {
        switch (feature) {
            case 'high-contrast':
                document.documentElement.classList.toggle('high-contrast', enabled);
                break;
            case 'large-text':
                document.documentElement.classList.toggle('large-text', enabled);
                break;
            case 'reduce-motion':
                document.documentElement.classList.toggle('reduce-motion', enabled);
                break;
            case 'keyboard-shortcuts':
                this.preferences.keyboardShortcuts = enabled;
                break;
        }
        this.savePreferences();
    }

    // ================================================
    // UTILITY METHODS
    // ================================================

    bindGlobalEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.preferences.keyboardShortcuts) {
                this.handleKeyDown(e);
            }
        });

        // Prevenir atajos en campos de entrada
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.stopPropagation();
            }
        }, true);
    }

    handleEscape() {
        // Cerrar overlays en orden de prioridad
        if (document.querySelector('.command-palette-overlay')) {
            this.closeCommandPalette();
        } else if (document.querySelector('.shortcuts-help-overlay')) {
            this.closeShortcutsHelp();
        } else if (document.querySelector('.confirmation-overlay')) {
            document.querySelector('.confirmation-overlay').click();
        }
    }

    goToSection(section) {
        const routes = {
            'home': '/public/',
            'pilgrim': '/public/sections/pilgrim/',
            'merchant': '/public/sections/merchant/',
            'red-pill': '/public/sections/red-pill/',
            'docs': '/public/docs/'
        };

        if (routes[section]) {
            window.location.href = routes[section];
        }
    }

    goHome() {
        window.location.href = '/public/';
    }

    goBack() {
        window.history.back();
    }

    focusSearch() {
        const searchInput = document.querySelector('input[type="search"], .search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    toggleDarkMode() {
        document.documentElement.classList.toggle('dark-mode');
        this.preferences.darkMode = document.documentElement.classList.contains('dark-mode');
        this.savePreferences();
    }

    toggleAccessibilityControls() {
        const controls = document.querySelector('.accessibility-controls');
        if (controls) {
            controls.classList.toggle('active');
        }
    }

    selectAll() {
        document.querySelectorAll('.bulk-select-checkbox').forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.click();
            }
        });
    }

    deleteSelected() {
        if (this.selectedItems.size > 0) {
            if (window.errorPreventionManager) {
                window.errorPreventionManager.showConfirmationDialog({
                    title: 'Eliminar elementos',
                    message: `¿Estás seguro de que quieres eliminar ${this.selectedItems.size} elemento(s)?`,
                    type: 'danger',
                    onConfirm: () => this.deleteBulkSelection()
                });
            }
        }
    }

    deleteBulkSelection() {
        this.selectedItems.forEach(element => {
            element.remove();
        });
        this.selectedItems.clear();
        this.updateBulkActionsBar();
    }

    // ================================================
    // PREFERENCES AND STORAGE
    // ================================================

    loadPreferences() {
        try {
            const stored = localStorage.getItem('coomunity-preferences');
            return stored ? JSON.parse(stored) : {
                keyboardShortcuts: true,
                darkMode: false,
                customizations: {}
            };
        } catch {
            return {
                keyboardShortcuts: true,
                darkMode: false,
                customizations: {}
            };
        }
    }

    savePreferences() {
        try {
            localStorage.setItem('coomunity-preferences', JSON.stringify(this.preferences));
        } catch (error) {
            console.warn('No se pudieron guardar las preferencias:', error);
        }
    }

    saveCustomization(elementId, property, value) {
        if (!this.preferences.customizations[elementId]) {
            this.preferences.customizations[elementId] = {};
        }
        this.preferences.customizations[elementId][property] = value;
        this.savePreferences();
    }

    restoreCustomizations() {
        Object.entries(this.preferences.customizations).forEach(([elementId, customizations]) => {
            const element = document.getElementById(elementId);
            if (element) {
                Object.entries(customizations).forEach(([property, value]) => {
                    this.applyCustomization(element, property, value);
                });
            }
        });
    }

    applyCustomization(element, property, value) {
        switch (property) {
            case 'hidden':
                if (value) element.style.display = 'none';
                break;
            case 'position':
                // Implementar lógica de posicionamiento
                break;
        }
    }

    // ================================================
    // PUBLIC API
    // ================================================

    addCustomShortcut(keys, callback, description) {
        this.registerShortcut(keys, callback, description, 'Personalizado');
    }

    addCustomCommand(id, title, icon, callback, description) {
        this.registerCommand(id, title, icon, callback, description);
    }

    exportConfiguration() {
        return {
            shortcuts: Array.from(this.shortcuts.entries()),
            commands: Array.from(this.commands.entries()),
            preferences: this.preferences
        };
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.flexibilityManager = new FlexibilityManager();
    });
} else {
    window.flexibilityManager = new FlexibilityManager();
}

// Exportar para uso global
window.FlexibilityManager = FlexibilityManager; 