/**
 * ================================================
 * HELP AND DOCUMENTATION MANAGER
 * Sistema de ayuda y documentación contextual
 * ================================================ */

class HelpDocumentationManager {
    constructor() {
        this.helpPanel = null;
        this.helpWidget = null;
        this.currentTutorial = null;
        this.tutorialSteps = [];
        this.currentStep = 0;
        this.helpData = new Map();
        this.searchIndex = [];
        this.contextualHelp = new Map();
        this.userProgress = this.loadUserProgress();
        this.init();
    }

    init() {
        this.loadHelpData();
        this.initHelpWidget();
        this.initContextualHelp();
        this.initHelpSearch();
        this.initTutorialSystem();
        this.bindGlobalEventListeners();
        this.initHelpTriggers();
        this.showOnboardingIfNeeded();
    }

    // ================================================
    // HELP DATA MANAGEMENT
    // ================================================

    loadHelpData() {
        // Estructura de datos de ayuda
        this.helpData.set('getting-started', {
            title: 'Comenzando',
            icon: '🚀',
            items: [
                {
                    id: 'welcome',
                    title: 'Bienvenido a CoomÜnity',
                    description: 'Introducción básica a la plataforma',
                    content: `
                        <h3>¡Bienvenido a CoomÜnity!</h3>
                        <p>CoomÜnity es una plataforma innovadora que conecta a personas y comunidades a través de experiencias compartidas.</p>
                        <h4>Características principales:</h4>
                        <ul>
                            <li><strong>Pilgrim:</strong> Descubre experiencias únicas</li>
                            <li><strong>Merchant:</strong> Conecta con comerciantes locales</li>
                            <li><strong>Red Pill:</strong> Explora contenido interactivo</li>
                        </ul>
                        <p>Para comenzar, explora las diferentes secciones usando la navegación principal.</p>
                    `,
                    keywords: ['bienvenido', 'introducción', 'comenzar']
                },
                {
                    id: 'navigation',
                    title: 'Navegación básica',
                    description: 'Cómo moverse por la plataforma',
                    content: `
                        <h3>Navegación básica</h3>
                        <p>Usar CoomÜnity es fácil e intuitivo:</p>
                        <h4>Navegación principal:</h4>
                        <ul>
                            <li>Usa el menú superior para acceder a las secciones principales</li>
                            <li>El breadcrumb te ayuda a saber dónde estás</li>
                            <li>Usa el botón "Atrás" para regresar</li>
                        </ul>
                        <h4>Atajos de teclado útiles:</h4>
                        <ul>
                            <li><code>?</code> - Mostrar ayuda de atajos</li>
                            <li><code>Ctrl+K</code> - Abrir paleta de comandos</li>
                            <li><code>/</code> - Enfocar búsqueda</li>
                        </ul>
                    `,
                    keywords: ['navegación', 'menú', 'atajos', 'teclado']
                }
            ]
        });

        this.helpData.set('features', {
            title: 'Características',
            icon: '⚡',
            items: [
                {
                    id: 'pilgrim-demo',
                    title: 'Demo Pilgrim',
                    description: 'Explora experiencias de viaje únicas',
                    content: `
                        <h3>Demo Pilgrim</h3>
                        <p>La sección Pilgrim te permite descubrir experiencias de viaje auténticas y conectar con otros viajeros.</p>
                        <h4>Funcionalidades:</h4>
                        <ul>
                            <li>Explora destinos únicos</li>
                            <li>Lee historias de otros viajeros</li>
                            <li>Planifica tu próxima aventura</li>
                            <li>Comparte tus propias experiencias</li>
                        </ul>
                        <p><strong>Tip:</strong> Usa los filtros para encontrar experiencias que se adapten a tus intereses.</p>
                    `,
                    keywords: ['pilgrim', 'viaje', 'experiencias', 'destinos']
                },
                {
                    id: 'merchant-demo',
                    title: 'Demo Merchant',
                    description: 'Conecta con comerciantes locales',
                    content: `
                        <h3>Demo Merchant</h3>
                        <p>La plataforma Merchant conecta a viajeros con comerciantes locales auténticos.</p>
                        <h4>Beneficios:</h4>
                        <ul>
                            <li>Descubre productos locales únicos</li>
                            <li>Apoya a pequeños comerciantes</li>
                            <li>Obtén recomendaciones personalizadas</li>
                            <li>Encuentra tesoros ocultos</li>
                        </ul>
                        <p><strong>Nota:</strong> Todos los comerciantes son verificados para garantizar calidad y autenticidad.</p>
                    `,
                    keywords: ['merchant', 'comerciantes', 'productos', 'local']
                }
            ]
        });

        this.helpData.set('troubleshooting', {
            title: 'Solución de problemas',
            icon: '🔧',
            items: [
                {
                    id: 'common-issues',
                    title: 'Problemas comunes',
                    description: 'Soluciones a problemas frecuentes',
                    content: `
                        <h3>Problemas comunes y soluciones</h3>
                        <h4>La página no carga correctamente:</h4>
                        <ul>
                            <li>Actualiza la página (Ctrl+F5)</li>
                            <li>Verifica tu conexión a internet</li>
                            <li>Limpia la caché del navegador</li>
                            <li>Intenta en modo incógnito</li>
                        </ul>
                        <h4>Los videos no se reproducen:</h4>
                        <ul>
                            <li>Verifica que JavaScript esté habilitado</li>
                            <li>Actualiza tu navegador</li>
                            <li>Desactiva extensiones que bloqueen contenido</li>
                        </ul>
                        <h4>Problemas de rendimiento:</h4>
                        <ul>
                            <li>Cierra pestañas innecesarias</li>
                            <li>Desactiva extensiones no esenciales</li>
                            <li>Considera usar un navegador más moderno</li>
                        </ul>
                    `,
                    keywords: ['problemas', 'errores', 'solución', 'rendimiento']
                }
            ]
        });

        this.helpData.set('accessibility', {
            title: 'Accesibilidad',
            icon: '♿',
            items: [
                {
                    id: 'accessibility-features',
                    title: 'Características de accesibilidad',
                    description: 'Herramientas para mejorar la accesibilidad',
                    content: `
                        <h3>Características de accesibilidad</h3>
                        <p>CoomÜnity está diseñado para ser accesible para todos los usuarios.</p>
                        <h4>Controles disponibles:</h4>
                        <ul>
                            <li><strong>Alto contraste:</strong> Mejora la legibilidad</li>
                            <li><strong>Texto grande:</strong> Aumenta el tamaño de fuente</li>
                            <li><strong>Reducir animaciones:</strong> Minimiza el movimiento</li>
                            <li><strong>Atajos de teclado:</strong> Navegación sin ratón</li>
                        </ul>
                        <p>Accede a estos controles desde el panel de accesibilidad (Ctrl+Shift+A).</p>
                        <h4>Navegación con teclado:</h4>
                        <ul>
                            <li><code>Tab</code> - Siguiente elemento</li>
                            <li><code>Shift+Tab</code> - Elemento anterior</li>
                            <li><code>Enter</code> - Activar elemento</li>
                            <li><code>Esc</code> - Cerrar diálogos</li>
                        </ul>
                    `,
                    keywords: ['accesibilidad', 'contraste', 'teclado', 'navegación']
                }
            ]
        });

        // Construir índice de búsqueda
        this.buildSearchIndex();
    }

    buildSearchIndex() {
        this.searchIndex = [];
        this.helpData.forEach((category, categoryId) => {
            category.items.forEach(item => {
                this.searchIndex.push({
                    id: item.id,
                    categoryId: categoryId,
                    title: item.title,
                    description: item.description,
                    content: item.content.replace(/<[^>]*>/g, ''), // Strip HTML
                    keywords: item.keywords || []
                });
            });
        });
    }

    // ================================================
    // HELP WIDGET
    // ================================================

    initHelpWidget() {
        if (document.querySelector('.help-widget')) return;

        const widget = document.createElement('div');
        widget.className = 'help-widget';
        widget.innerHTML = `
            <div class="help-widget-menu">
                <div class="help-widget-header">
                    <h3 class="help-widget-title">¿Necesitas ayuda?</h3>
                </div>
                <div class="help-widget-options">
                    <button class="help-widget-option" data-action="open-help">
                        <span class="help-widget-option-icon">📚</span>
                        <span class="help-widget-option-text">Centro de ayuda</span>
                        <span class="help-widget-option-shortcut">F1</span>
                    </button>
                    <button class="help-widget-option" data-action="start-tutorial">
                        <span class="help-widget-option-icon">🎓</span>
                        <span class="help-widget-option-text">Tutorial interactivo</span>
                        <span class="help-widget-option-shortcut">Ctrl+T</span>
                    </button>
                    <button class="help-widget-option" data-action="shortcuts">
                        <span class="help-widget-option-icon">⌨️</span>
                        <span class="help-widget-option-text">Atajos de teclado</span>
                        <span class="help-widget-option-shortcut">?</span>
                    </button>
                    <button class="help-widget-option" data-action="contact">
                        <span class="help-widget-option-icon">💬</span>
                        <span class="help-widget-option-text">Contactar soporte</span>
                    </button>
                </div>
            </div>
            <button class="help-widget-trigger" aria-label="Abrir ayuda">
                <span>?</span>
            </button>
        `;

        document.body.appendChild(widget);
        this.helpWidget = widget;

        // Event listeners
        const trigger = widget.querySelector('.help-widget-trigger');
        const menu = widget.querySelector('.help-widget-menu');

        trigger.addEventListener('click', () => {
            menu.classList.toggle('active');
            if (menu.classList.contains('active')) {
                this.trackHelpUsage('widget_opened');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!widget.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        // Handle menu options
        widget.addEventListener('click', (e) => {
            const option = e.target.closest('.help-widget-option');
            if (option) {
                const action = option.dataset.action;
                this.handleWidgetAction(action);
                menu.classList.remove('active');
            }
        });

        // Show notification for new users
        if (!this.userProgress.hasSeenHelp) {
            setTimeout(() => {
                trigger.classList.add('has-notification');
                this.showTooltip(trigger, 'Haz clic aquí si necesitas ayuda', 'bottom');
            }, 3000);
        }
    }

    handleWidgetAction(action) {
        switch (action) {
            case 'open-help':
                this.openHelpPanel();
                break;
            case 'start-tutorial':
                this.startMainTutorial();
                break;
            case 'shortcuts':
                if (window.flexibilityManager) {
                    window.flexibilityManager.showShortcutsHelp();
                }
                break;
            case 'contact':
                this.openContactSupport();
                break;
        }
        this.trackHelpUsage(`widget_${action}`);
    }

    // ================================================
    // HELP PANEL
    // ================================================

    openHelpPanel() {
        if (this.helpPanel) {
            this.helpPanel.classList.add('active');
            return;
        }

        this.createHelpPanel();
        this.helpPanel.classList.add('active');
        this.userProgress.hasSeenHelp = true;
        this.saveUserProgress();
    }

    createHelpPanel() {
        const panel = document.createElement('div');
        panel.className = 'help-panel';
        panel.innerHTML = `
            <div class="help-panel-header">
                <h2 class="help-panel-title">
                    <span>📚</span>
                    Centro de Ayuda
                </h2>
                <button class="help-panel-close" aria-label="Cerrar ayuda">✕</button>
            </div>
            <div class="help-panel-content">
                <div class="help-search">
                    <input type="text" class="help-search-input" placeholder="Buscar en la ayuda...">
                    <span class="help-search-icon">🔍</span>
                </div>
                <div class="help-search-results" style="display: none;"></div>
                <div class="help-categories"></div>
            </div>
            <div class="help-panel-footer">
                <button class="tutorial-btn primary" data-action="start-tutorial">
                    🎓 Iniciar tutorial
                </button>
            </div>
        `;

        document.body.appendChild(panel);
        this.helpPanel = panel;

        // Populate categories
        this.populateHelpCategories();

        // Event listeners
        panel.querySelector('.help-panel-close').addEventListener('click', () => {
            this.closeHelpPanel();
        });

        panel.querySelector('[data-action="start-tutorial"]').addEventListener('click', () => {
            this.startMainTutorial();
            this.closeHelpPanel();
        });

        // Search functionality
        const searchInput = panel.querySelector('.help-search-input');
        const searchResults = panel.querySelector('.help-search-results');
        
        searchInput.addEventListener('input', (e) => {
            this.handleHelpSearch(e.target.value, searchResults);
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim()) {
                searchResults.style.display = 'block';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    populateHelpCategories() {
        const container = this.helpPanel.querySelector('.help-categories');
        const categoriesHTML = Array.from(this.helpData.entries()).map(([categoryId, category]) => `
            <div class="help-category" data-category="${categoryId}">
                <button class="help-category-header">
                    <div class="help-category-title">
                        <span class="help-category-icon">${category.icon}</span>
                        ${category.title}
                    </div>
                    <span class="help-category-toggle">▼</span>
                </button>
                <div class="help-category-content">
                    <ul class="help-items">
                        ${category.items.map(item => `
                            <li class="help-item">
                                <a href="#" class="help-item-link" data-item="${item.id}" data-category="${categoryId}">
                                    <span class="help-item-icon">📄</span>
                                    <div class="help-item-text">
                                        <div class="help-item-title">${item.title}</div>
                                        <div class="help-item-description">${item.description}</div>
                                    </div>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        container.innerHTML = categoriesHTML;

        // Event listeners for categories
        container.addEventListener('click', (e) => {
            const categoryHeader = e.target.closest('.help-category-header');
            const itemLink = e.target.closest('.help-item-link');

            if (categoryHeader) {
                e.preventDefault();
                const category = categoryHeader.closest('.help-category');
                category.classList.toggle('expanded');
            }

            if (itemLink) {
                e.preventDefault();
                const categoryId = itemLink.dataset.category;
                const itemId = itemLink.dataset.item;
                this.showHelpContent(categoryId, itemId);
            }
        });

        // Expand first category by default
        container.querySelector('.help-category').classList.add('expanded');
    }

    showHelpContent(categoryId, itemId) {
        const category = this.helpData.get(categoryId);
        const item = category.items.find(i => i.id === itemId);

        if (!item) return;

        // Create documentation viewer
        const viewer = document.createElement('div');
        viewer.className = 'documentation-viewer';
        viewer.innerHTML = `
            <div class="documentation-header">
                <h3 class="documentation-title">${item.title}</h3>
                <div class="documentation-meta">
                    <span>📂 ${category.title}</span>
                    <span>📅 Actualizado recientemente</span>
                </div>
            </div>
            <div class="documentation-content">
                ${item.content}
            </div>
        `;

        // Replace content or open in modal
        const content = this.helpPanel.querySelector('.help-panel-content');
        const existingViewer = content.querySelector('.documentation-viewer');
        
        if (existingViewer) {
            existingViewer.replaceWith(viewer);
        } else {
            content.appendChild(viewer);
        }

        // Scroll to viewer
        viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        this.trackHelpUsage('content_viewed', { categoryId, itemId });
    }

    closeHelpPanel() {
        if (this.helpPanel) {
            this.helpPanel.classList.remove('active');
        }
    }

    // ================================================
    // SEARCH FUNCTIONALITY
    // ================================================

    handleHelpSearch(query, resultsContainer) {
        if (query.trim().length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        const results = this.searchHelpContent(query);
        this.displaySearchResults(results, resultsContainer);
        resultsContainer.style.display = 'block';
    }

    searchHelpContent(query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
        
        return this.searchIndex.filter(item => {
            const searchText = `${item.title} ${item.description} ${item.content} ${item.keywords.join(' ')}`.toLowerCase();
            return searchTerms.some(term => searchText.includes(term));
        }).slice(0, 10); // Limit results
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="help-search-result">No se encontraron resultados</div>';
            return;
        }

        container.innerHTML = results.map(result => {
            const category = this.helpData.get(result.categoryId);
            return `
                <div class="help-search-result" data-category="${result.categoryId}" data-item="${result.id}">
                    <div class="help-search-result-category">${category.title}</div>
                    <div class="help-search-result-title">${result.title}</div>
                    <div class="help-search-result-snippet">${result.description}</div>
                </div>
            `;
        }).join('');

        // Event listeners for results
        container.addEventListener('click', (e) => {
            const result = e.target.closest('.help-search-result');
            if (result) {
                const categoryId = result.dataset.category;
                const itemId = result.dataset.item;
                this.showHelpContent(categoryId, itemId);
                container.style.display = 'none';
                this.trackHelpUsage('search_result_clicked', { query: container.previousElementSibling.value, categoryId, itemId });
            }
        });
    }

    // ================================================
    // CONTEXTUAL HELP
    // ================================================

    initContextualHelp() {
        // Register contextual help for various elements
        this.registerContextualHelp('.demo-card', 'Haz clic para explorar esta demo. Usa las teclas de flecha para navegar entre demos.');
        this.registerContextualHelp('.nav-link', 'Navega a diferentes secciones de CoomÜnity. Usa atajos de teclado G+H, G+P, G+M, G+R para navegación rápida.');
        this.registerContextualHelp('.search-input', 'Busca contenido en CoomÜnity. Usa "/" para enfocar rápidamente la búsqueda.');
        this.registerContextualHelp('.btn-primary', 'Botón de acción principal. Presiona Enter para activar cuando esté enfocado.');
        
        // Mostrar hints básicos para usuarios nuevos
        this.showBasicHints();
    }

    registerContextualHelp(selector, helpText) {
        document.querySelectorAll(selector).forEach(element => {
            this.addContextualHelp(element, helpText);
        });
    }

    addContextualHelp(element, helpText) {
        // Check if help already exists
        if (element.querySelector('.help-trigger')) return;

        const helpTrigger = document.createElement('button');
        helpTrigger.className = 'help-trigger';
        helpTrigger.innerHTML = '?';
        helpTrigger.setAttribute('aria-label', 'Mostrar ayuda');

        const helpTooltip = document.createElement('div');
        helpTooltip.className = 'help-tooltip';
        helpTooltip.textContent = helpText;

        const contextualHelp = document.createElement('div');
        contextualHelp.className = 'contextual-help';
        contextualHelp.appendChild(helpTrigger);
        contextualHelp.appendChild(helpTooltip);

        // Position the help trigger
        if (element.style.position !== 'relative' && element.style.position !== 'absolute') {
            element.style.position = 'relative';
        }

        element.appendChild(contextualHelp);

        // Store reference
        this.contextualHelp.set(element, { trigger: helpTrigger, tooltip: helpTooltip, text: helpText });
    }

    initHelpTriggers() {
        // Add help triggers to form fields
        document.querySelectorAll('input, textarea, select').forEach(field => {
            if (field.dataset.help) {
                this.addContextualHelp(field, field.dataset.help);
            }
        });

        // Add help triggers to complex UI elements
        document.querySelectorAll('[data-help]').forEach(element => {
            this.addContextualHelp(element, element.dataset.help);
        });
    }

    // ================================================
    // TUTORIAL SYSTEM
    // ================================================

    startMainTutorial() {
        this.tutorialSteps = [
            {
                target: '.unified-navbar',
                title: 'Navegación principal',
                content: 'Esta es la barra de navegación principal. Te permite acceder a todas las secciones de CoomÜnity.',
                position: 'bottom'
            },
            {
                target: '.demo-card:first-child',
                title: 'Demos interactivas',
                content: 'Estas son las demos interactivas. Haz clic en cualquiera para explorar las diferentes características de CoomÜnity.',
                position: 'top'
            },
            {
                target: '.help-widget-trigger',
                title: 'Widget de ayuda',
                content: 'Este es tu widget de ayuda. Siempre puedes hacer clic aquí cuando necesites asistencia.',
                position: 'left'
            }
        ];

        this.currentStep = 0;
        this.showTutorialStep();
        this.trackHelpUsage('tutorial_started');
    }

    showTutorialStep() {
        if (this.currentStep >= this.tutorialSteps.length) {
            this.completeTutorial();
            return;
        }

        const step = this.tutorialSteps[this.currentStep];
        const targetElement = document.querySelector(step.target);

        if (!targetElement) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextTutorialStep();
            return;
        }

        this.createTutorialOverlay(targetElement, step);
    }

    createTutorialOverlay(targetElement, step) {
        // Remove existing tutorial
        this.removeTutorialOverlay();

        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay active';

        const targetRect = targetElement.getBoundingClientRect();
        const spotlight = document.createElement('div');
        spotlight.className = 'tutorial-spotlight';
        spotlight.style.cssText = `
            top: ${targetRect.top - 10}px;
            left: ${targetRect.left - 10}px;
            width: ${targetRect.width + 20}px;
            height: ${targetRect.height + 20}px;
        `;

        const popup = document.createElement('div');
        popup.className = `tutorial-popup ${step.position}`;
        
        // Position popup relative to target
        const popupPosition = this.calculatePopupPosition(targetRect, step.position);
        popup.style.cssText = `
            top: ${popupPosition.top}px;
            left: ${popupPosition.left}px;
        `;

        popup.innerHTML = `
            <div class="tutorial-header">
                <div class="tutorial-step-number">${this.currentStep + 1}</div>
                <h3 class="tutorial-title">${step.title}</h3>
            </div>
            <div class="tutorial-content">${step.content}</div>
            <div class="tutorial-actions">
                <div class="tutorial-progress">
                    ${this.tutorialSteps.map((_, index) => `
                        <div class="tutorial-dot ${index < this.currentStep ? 'completed' : index === this.currentStep ? 'active' : ''}"></div>
                    `).join('')}
                </div>
                <div class="tutorial-buttons">
                    ${this.currentStep > 0 ? '<button class="tutorial-btn" data-action="prev">Anterior</button>' : ''}
                    <button class="tutorial-btn" data-action="skip">Omitir</button>
                    <button class="tutorial-btn primary" data-action="next">
                        ${this.currentStep === this.tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
                    </button>
                </div>
            </div>
        `;

        overlay.appendChild(spotlight);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        this.currentTutorial = overlay;

        // Event listeners
        popup.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handleTutorialAction(action);
            }
        });

        // Keyboard navigation
        this.addTutorialKeyboardListeners();
    }

    calculatePopupPosition(targetRect, position) {
        const popup = { width: 350, height: 200 }; // Approximate popup size
        const margin = 20;

        switch (position) {
            case 'top':
                return {
                    top: targetRect.top - popup.height - margin,
                    left: Math.max(margin, targetRect.left + (targetRect.width - popup.width) / 2)
                };
            case 'bottom':
                return {
                    top: targetRect.bottom + margin,
                    left: Math.max(margin, targetRect.left + (targetRect.width - popup.width) / 2)
                };
            case 'left':
                return {
                    top: targetRect.top + (targetRect.height - popup.height) / 2,
                    left: Math.max(margin, targetRect.left - popup.width - margin)
                };
            case 'right':
                return {
                    top: targetRect.top + (targetRect.height - popup.height) / 2,
                    left: targetRect.right + margin
                };
            default:
                return {
                    top: targetRect.bottom + margin,
                    left: Math.max(margin, targetRect.left + (targetRect.width - popup.width) / 2)
                };
        }
    }

    handleTutorialAction(action) {
        switch (action) {
            case 'next':
                this.nextTutorialStep();
                break;
            case 'prev':
                this.prevTutorialStep();
                break;
            case 'skip':
                this.completeTutorial();
                break;
        }
    }

    nextTutorialStep() {
        this.currentStep++;
        this.showTutorialStep();
    }

    prevTutorialStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showTutorialStep();
        }
    }

    completeTutorial() {
        this.removeTutorialOverlay();
        this.userProgress.completedTutorial = true;
        this.saveUserProgress();
        this.showToast('¡Tutorial completado! Ya puedes explorar CoomÜnity libremente.', 'success');
        this.trackHelpUsage('tutorial_completed');
    }

    removeTutorialOverlay() {
        if (this.currentTutorial) {
            this.currentTutorial.remove();
            this.currentTutorial = null;
        }
        this.removeTutorialKeyboardListeners();
    }

    addTutorialKeyboardListeners() {
        this.tutorialKeyHandler = (e) => {
            switch (e.key) {
                case 'Escape':
                    this.completeTutorial();
                    break;
                case 'ArrowRight':
                case 'Enter':
                    this.nextTutorialStep();
                    break;
                case 'ArrowLeft':
                    this.prevTutorialStep();
                    break;
            }
        };
        document.addEventListener('keydown', this.tutorialKeyHandler);
    }

    removeTutorialKeyboardListeners() {
        if (this.tutorialKeyHandler) {
            document.removeEventListener('keydown', this.tutorialKeyHandler);
            this.tutorialKeyHandler = null;
        }
    }

    // ================================================
    // USER PROGRESS AND ONBOARDING
    // ================================================

    showOnboardingIfNeeded() {
        if (!this.userProgress.hasVisited) {
            setTimeout(() => {
                this.showWelcomeMessage();
                this.userProgress.hasVisited = true;
                this.saveUserProgress();
            }, 2000);
        }
    }

    showWelcomeMessage() {
        const message = document.createElement('div');
        message.className = 'welcome-message';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-500);
            color: var(--white);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--border-radius);
            box-shadow: var(--elevation-3);
            z-index: 9999;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100px);
            transition: all var(--duration-normal) var(--ease-out);
        `;

        message.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: var(--spacing-sm);">
                <span style="font-size: 1.5rem;">👋</span>
                <div>
                    <h4 style="margin: 0 0 var(--spacing-xs) 0; font-size: var(--font-size-base);">¡Bienvenido a CoomÜnity!</h4>
                    <p style="margin: 0 0 var(--spacing-sm) 0; font-size: var(--font-size-sm); opacity: 0.9;">
                        ¿Es tu primera vez aquí? Te ayudamos a comenzar.
                    </p>
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <button style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;" data-action="tutorial">
                            Iniciar tutorial
                        </button>
                        <button style="background: none; border: none; color: white; font-size: 12px; cursor: pointer; text-decoration: underline;" data-action="dismiss">
                            No, gracias
                        </button>
                    </div>
                </div>
                <button style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 0; margin-left: auto;" data-action="close">✕</button>
            </div>
        `;

        document.body.appendChild(message);

        // Animate in
        requestAnimationFrame(() => {
            message.style.opacity = '1';
            message.style.transform = 'translateX(0)';
        });

        // Event listeners
        message.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            switch (action) {
                case 'tutorial':
                    this.startMainTutorial();
                    this.removeWelcomeMessage(message);
                    break;
                case 'dismiss':
                case 'close':
                    this.removeWelcomeMessage(message);
                    break;
            }
        });

        // Auto remove after 10 seconds
        setTimeout(() => {
            this.removeWelcomeMessage(message);
        }, 10000);
    }

    removeWelcomeMessage(message) {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }

    // ================================================
    // UTILITY METHODS
    // ================================================

    bindGlobalEventListeners() {
        // F1 for help
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.openHelpPanel();
            }
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.startMainTutorial();
            }
        });

        // Escape to close help
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.helpPanel && this.helpPanel.classList.contains('active')) {
                    this.closeHelpPanel();
                }
                if (this.currentTutorial) {
                    this.completeTutorial();
                }
            }
        });
    }

    showTooltip(element, text, position = 'top') {
        const tooltip = document.createElement('div');
        tooltip.className = `help-tooltip ${position}`;
        tooltip.textContent = text;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });

        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 3000);
    }

    openContactSupport() {
        // This would typically open a contact form or chat widget
        this.showToast('Función de contacto en desarrollo. Por ahora, usa el centro de ayuda.', 'info');
    }

    loadUserProgress() {
        try {
            const stored = localStorage.getItem('coomunity-help-progress');
            return stored ? JSON.parse(stored) : {
                hasVisited: false,
                hasSeenHelp: false,
                completedTutorial: false,
                helpUsage: [],
                hasSeenBasicHints: false
            };
        } catch {
            return {
                hasVisited: false,
                hasSeenHelp: false,
                completedTutorial: false,
                helpUsage: [],
                hasSeenBasicHints: false
            };
        }
    }

    saveUserProgress() {
        try {
            localStorage.setItem('coomunity-help-progress', JSON.stringify(this.userProgress));
        } catch (error) {
            console.warn('No se pudo guardar el progreso de ayuda:', error);
        }
    }

    trackHelpUsage(action, data = {}) {
        this.userProgress.helpUsage.push({
            action,
            data,
            timestamp: Date.now()
        });
        this.saveUserProgress();
    }

    showToast(message, type = 'info') {
        if (window.systemStatusManager) {
            window.systemStatusManager.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // ================================================
    // PUBLIC API
    // ================================================

    addHelpContent(categoryId, item) {
        if (this.helpData.has(categoryId)) {
            this.helpData.get(categoryId).items.push(item);
            this.buildSearchIndex();
        }
    }

    addContextualHelpToElement(element, helpText) {
        this.addContextualHelp(element, helpText);
    }

    startCustomTutorial(steps) {
        this.tutorialSteps = steps;
        this.currentStep = 0;
        this.showTutorialStep();
    }

    highlightElement(selector, message, duration = 5000) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.position = 'relative';
        element.style.zIndex = '1001';
        element.style.outline = '3px solid var(--primary-500)';
        element.style.outlineOffset = '2px';

        if (message) {
            this.showTooltip(element, message);
        }

        setTimeout(() => {
            element.style.position = '';
            element.style.zIndex = '';
            element.style.outline = '';
            element.style.outlineOffset = '';
        }, duration);
    }

    /**
     * Muestra hints básicos de navegación y uso
     * Método que se estaba llamando pero no existía - CORREGIDO
     */
    showBasicHints(force = false) {
        console.log('📚 HelpDocumentationManager: showBasicHints called', { force });
        
        // Solo mostrar hints si es un usuario nuevo o si no ha visto hints recientemente, a menos que se force
        if (!force && this.userProgress.hasSeenBasicHints) {
            console.log('ℹ️ Basic hints already shown, skipping...');
            return;
        }
        
        try {
            const basicHints = [
                {
                    selector: '.search-input, [data-search], input[type="search"]',
                    message: '💡 Presiona "/" para buscar rápidamente',
                    delay: 2000,
                    duration: 6000,
                    priority: 'high'
                },
                {
                    selector: '.help-widget-trigger, [data-help], .help-button',
                    message: '❓ Haz clic aquí si necesitas ayuda',
                    delay: 8000,
                    duration: 5000,
                    priority: 'medium'
                },
                {
                    selector: '.demo-card, .card-demo, [data-demo]',
                    message: '🚀 Explora nuestras demos interactivas',
                    delay: 15000,
                    duration: 5000,
                    priority: 'low'
                },
                {
                    selector: '.navigation, .main-nav, nav',
                    message: '🧭 Usa la navegación para explorar diferentes secciones',
                    delay: 22000,
                    duration: 4000,
                    priority: 'low'
                }
            ];
            
            // Filtrar hints para elementos que existen en la página
            const availableHints = basicHints.filter(hint => {
                const element = document.querySelector(hint.selector);
                if (!element) {
                    console.log(`Hint target not found: ${hint.selector}`);
                    return false;
                }
                return true;
            });
            
            if (availableHints.length === 0) {
                console.warn('⚠️ No hint targets found on current page');
                return;
            }
            
            console.log(`✅ Found ${availableHints.length} hint targets, scheduling hints...`);
            
            // Mostrar hints secuencialmente
            availableHints.forEach((hint, index) => {
                setTimeout(() => {
                    this.showHint(hint);
                }, hint.delay);
            });
            
            // Marcar como visto después del último hint
            const lastHintDelay = Math.max(...availableHints.map(h => h.delay + h.duration));
            setTimeout(() => {
                this.userProgress.hasSeenBasicHints = true;
                this.userProgress.lastBasicHintsShown = Date.now();
                this.saveUserProgress();
                this.trackHelpUsage('basic_hints_completed', { hintsShown: availableHints.length });
            }, lastHintDelay);
            
            console.log('✅ Basic hints scheduled successfully');
        } catch (error) {
            console.warn('⚠️ Error showing basic hints:', error);
            this.trackHelpUsage('basic_hints_error', { error: error.message });
        }
    }

    /**
     * Muestra un hint individual
     */
    showHint(hintConfig) {
        // Validar configuración
        if (!hintConfig || !hintConfig.selector || !hintConfig.message) {
            console.warn('Invalid hint configuration:', hintConfig);
            return;
        }
        
        const element = document.querySelector(hintConfig.selector);
        if (!element) {
            console.warn(`Hint target not found: ${hintConfig.selector}`);
            return;
        }
        
        // Evitar duplicar hints en el mismo elemento
        const existingHint = document.querySelector(`.help-hint-tooltip[data-target="${hintConfig.selector}"]`);
        if (existingHint) {
            console.log('Hint already exists for target, skipping');
            return;
        }
        
        try {
            // Crear hint tooltip
            const hint = document.createElement('div');
            hint.className = 'help-hint-tooltip';
            hint.setAttribute('role', 'tooltip');
            hint.setAttribute('aria-live', 'polite');
            hint.setAttribute('data-target', hintConfig.selector);
            hint.innerHTML = `
                <div class="hint-content">
                    <span class="hint-message">${hintConfig.message}</span>
                    <button class="hint-close" aria-label="Cerrar hint" title="Cerrar">×</button>
                </div>
                <div class="hint-arrow"></div>
            `;
            
            // Posicionar el hint
            this.positionHint(hint, element);
            
            // Agregar al DOM
            document.body.appendChild(hint);
            
            // Animar entrada
            requestAnimationFrame(() => {
                hint.classList.add('show');
            });
            
            // Event listeners
            const closeBtn = hint.querySelector('.hint-close');
            const closeHandler = () => {
                this.closeHint(hint);
                this.trackHelpUsage('hint_closed_manually', { selector: hintConfig.selector });
            };
            
            closeBtn.addEventListener('click', closeHandler);
            
            // Auto-cerrar después del tiempo especificado
            const autoCloseTimer = setTimeout(() => {
                this.closeHint(hint);
                this.trackHelpUsage('hint_auto_closed', { selector: hintConfig.selector });
            }, hintConfig.duration || 5000);
            
            // Cerrar al hacer clic fuera (con delay para evitar cierre inmediato)
            const outsideClickHandler = (e) => {
                if (!hint.contains(e.target) && !element.contains(e.target)) {
                    this.closeHint(hint);
                    this.trackHelpUsage('hint_closed_outside_click', { selector: hintConfig.selector });
                    document.removeEventListener('click', outsideClickHandler);
                    clearTimeout(autoCloseTimer);
                }
            };
            
            setTimeout(() => {
                document.addEventListener('click', outsideClickHandler);
            }, 500); // Delay más largo para evitar cierre accidental
            
            // Cerrar con tecla Escape
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    this.closeHint(hint);
                    this.trackHelpUsage('hint_closed_escape', { selector: hintConfig.selector });
                    document.removeEventListener('keydown', escapeHandler);
                    clearTimeout(autoCloseTimer);
                }
            };
            
            document.addEventListener('keydown', escapeHandler);
            
            // Limpiar event listeners cuando se cierre el hint
            hint.addEventListener('beforeremove', () => {
                document.removeEventListener('click', outsideClickHandler);
                document.removeEventListener('keydown', escapeHandler);
                clearTimeout(autoCloseTimer);
            });
            
            this.trackHelpUsage('hint_shown', { 
                selector: hintConfig.selector, 
                message: hintConfig.message,
                priority: hintConfig.priority 
            });
            
        } catch (error) {
            console.warn('Error showing hint:', error);
            this.trackHelpUsage('hint_error', { 
                selector: hintConfig.selector, 
                error: error.message 
            });
        }
    }

    /**
     * Posiciona un hint relativo a un elemento
     */
    positionHint(hint, targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // Configuración adaptativa basada en el tamaño de pantalla
        const isMobile = viewport.width <= 768;
        const hintWidth = isMobile ? Math.min(280, viewport.width - 40) : 300;
        const hintHeight = isMobile ? 80 : 70;
        const margin = isMobile ? 15 : 10;
        
        // Determinar la mejor posición
        let top, left, position;
        
        // Calcular espacio disponible en cada dirección
        const spaceTop = rect.top;
        const spaceBottom = viewport.height - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = viewport.width - rect.right;
        
        // Elegir posición óptima basada en espacio disponible
        if (spaceTop >= hintHeight + margin && spaceTop > spaceBottom) {
            // Posición superior
            top = rect.top - hintHeight - margin;
            position = 'top';
        } else if (spaceBottom >= hintHeight + margin) {
            // Posición inferior
            top = rect.bottom + margin;
            position = 'bottom';
        } else if (spaceRight >= hintWidth + margin) {
            // Posición derecha
            top = rect.top + (rect.height - hintHeight) / 2;
            left = rect.right + margin;
            position = 'right';
        } else if (spaceLeft >= hintWidth + margin) {
            // Posición izquierda
            top = rect.top + (rect.height - hintHeight) / 2;
            left = rect.left - hintWidth - margin;
            position = 'left';
        } else {
            // Fallback: centrar en pantalla si no hay espacio suficiente
            top = (viewport.height - hintHeight) / 2;
            left = (viewport.width - hintWidth) / 2;
            position = 'center';
        }
        
        // Centrar horizontalmente para posiciones top/bottom
        if (position === 'top' || position === 'bottom') {
            left = rect.left + (rect.width - hintWidth) / 2;
            
            // Ajustar si se sale de la pantalla horizontalmente
            if (left < margin) {
                left = margin;
            } else if (left + hintWidth > viewport.width - margin) {
                left = viewport.width - hintWidth - margin;
            }
        }
        
        // Ajustar verticalmente para posiciones left/right
        if (position === 'left' || position === 'right') {
            if (top < margin) {
                top = margin;
            } else if (top + hintHeight > viewport.height - margin) {
                top = viewport.height - hintHeight - margin;
            }
        }
        
        // Estilos CSS responsivos
        hint.style.cssText = `
            position: fixed;
            top: ${top}px;
            left: ${left}px;
            width: ${hintWidth}px;
            max-width: calc(100vw - 40px);
            z-index: 10000;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: ${isMobile ? '10px 14px' : '8px 12px'};
            border-radius: ${isMobile ? '8px' : '6px'};
            font-size: ${isMobile ? '15px' : '14px'};
            line-height: 1.4;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
            opacity: 0;
            transform: translateY(${position === 'top' ? '10px' : position === 'bottom' ? '-10px' : '0'}) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            pointer-events: auto;
            backdrop-filter: blur(10px);
        `;
        
        // Agregar clase de posición para estilos específicos
        hint.classList.add(`hint-${position}`);
        
        // Hacer visible con transición suave
        hint.addEventListener('transitionend', () => {
            hint.style.pointerEvents = 'auto';
        }, { once: true });
        
        // Agregar estilos para la flecha según la posición
        const arrow = hint.querySelector('.hint-arrow');
        if (arrow && position !== 'center') {
            this.styleHintArrow(arrow, position, rect, left, hintWidth);
        }
    }
    
    /**
     * Estiliza la flecha del hint según su posición
     */
    styleHintArrow(arrow, position, targetRect, hintLeft, hintWidth) {
        const arrowSize = 8;
        let arrowStyles = `
            position: absolute;
            width: 0;
            height: 0;
            border: ${arrowSize}px solid transparent;
        `;
        
        switch (position) {
            case 'top':
                const arrowLeftOffset = Math.min(Math.max(targetRect.left + targetRect.width/2 - hintLeft, arrowSize + 5), hintWidth - arrowSize - 5);
                arrowStyles += `
                    bottom: -${arrowSize * 2}px;
                    left: ${arrowLeftOffset}px;
                    border-top-color: #2c3e50;
                    border-bottom: none;
                `;
                break;
            case 'bottom':
                const arrowLeftOffsetBottom = Math.min(Math.max(targetRect.left + targetRect.width/2 - hintLeft, arrowSize + 5), hintWidth - arrowSize - 5);
                arrowStyles += `
                    top: -${arrowSize * 2}px;
                    left: ${arrowLeftOffsetBottom}px;
                    border-bottom-color: #2c3e50;
                    border-top: none;
                `;
                break;
            case 'left':
                arrowStyles += `
                    top: 50%;
                    right: -${arrowSize * 2}px;
                    transform: translateY(-50%);
                    border-left-color: #2c3e50;
                    border-right: none;
                `;
                break;
            case 'right':
                arrowStyles += `
                    top: 50%;
                    left: -${arrowSize * 2}px;
                    transform: translateY(-50%);
                    border-right-color: #2c3e50;
                    border-left: none;
                `;
                break;
        }
        
        arrow.style.cssText = arrowStyles;
    }

    /**
     * Cierra un hint con animación
     */
    closeHint(hint) {
        if (!hint || !hint.parentNode) return;
        
        hint.style.opacity = '0';
        hint.style.transform = 'translateY(-10px) scale(0.95)';
        
        setTimeout(() => {
            if (hint.parentNode) {
                hint.parentNode.removeChild(hint);
            }
        }, 300);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.helpDocumentationManager = new HelpDocumentationManager();
    });
} else {
    window.helpDocumentationManager = new HelpDocumentationManager();
}

// Exportar para uso global
window.HelpDocumentationManager = HelpDocumentationManager; 