/**
 * ================================================
 * RECOGNITION MANAGER
 * Sistema de reconocimiento visual y navegación intuitiva
 * ================================================
 */

class RecognitionManager {
    constructor() {
        this.currentPath = [];
        this.pageContext = {};
        this.navigationHistory = [];
        this.sectionData = new Map();
        this.init();
    }

    init() {
        this.detectPageContext();
        this.createEnhancedBreadcrumbs();
        this.initContextualNavigation();
        this.initRecognitionHelpers();
        this.setupIconSystem();
        this.bindEventListeners();
        this.trackPageChanges();
    }

    detectPageContext() {
        const path = window.location.pathname;
        const url = new URL(window.location.href);
        
        // Detectar sección actual
        if (path.includes('/pilgrim/')) {
            this.pageContext = {
                section: 'pilgrim',
                icon: '🚀',
                title: 'Pilgrim Demo',
                description: 'Experiencia interactiva del usuario Pilgrim'
            };
        } else if (path.includes('/merchant/')) {
            this.pageContext = {
                section: 'merchant',
                icon: '🏪',
                title: 'Merchant Demo',
                description: 'Interfaz del usuario comerciante'
            };
        } else if (path.includes('/red-pill/')) {
            this.pageContext = {
                section: 'red-pill',
                icon: '💊',
                title: 'Red Pill Interactive',
                description: 'Experiencia inmersiva de decisiones'
            };
        } else if (path.includes('/docs/')) {
            this.pageContext = {
                section: 'docs',
                icon: '📚',
                title: 'Documentación',
                description: 'Guías y documentación técnica'
            };
        } else {
            this.pageContext = {
                section: 'home',
                icon: '🏠',
                title: 'CoomÜnity',
                description: 'Plataforma web unificada'
            };
        }

        // Construir ruta de navegación
        this.buildBreadcrumbPath(path);
    }

    buildBreadcrumbPath(path) {
        this.currentPath = [
            {
                name: 'Inicio',
                url: '/public/',
                icon: '🏠',
                description: 'Página principal'
            }
        ];

        const segments = path.split('/').filter(segment => segment && segment !== 'public');
        
        segments.forEach((segment, index) => {
            const isLast = index === segments.length - 1;
            const segmentPath = '/public/' + segments.slice(0, index + 1).join('/') + '/';
            
            let segmentInfo = this.getSegmentInfo(segment, isLast);
            segmentInfo.url = segmentPath;
            
            this.currentPath.push(segmentInfo);
        });
    }

    getSegmentInfo(segment, isLast = false) {
        const segmentMap = {
            'sections': {
                name: 'Secciones',
                icon: '📂',
                description: 'Demos y secciones principales'
            },
            'pilgrim': {
                name: 'Pilgrim',
                icon: '🚀',
                description: 'Demo del usuario Pilgrim'
            },
            'merchant': {
                name: 'Merchant',
                icon: '🏪',
                description: 'Demo del usuario Merchant'
            },
            'red-pill': {
                name: 'Red Pill',
                icon: '💊',
                description: 'Experiencia Red Pill'
            },
            'docs': {
                name: 'Documentación',
                icon: '📚',
                description: 'Documentación y guías'
            },
            'journey': {
                name: 'Journey',
                icon: '🛤️',
                description: 'Flujo de experiencia'
            },
            'variations': {
                name: 'Variaciones',
                icon: '🔄',
                description: 'Diferentes estados'
            }
        };

        return segmentMap[segment] || {
            name: this.capitalizeWord(segment.replace(/[-_]/g, ' ')),
            icon: isLast ? '📄' : '📁',
            description: `Sección: ${segment}`
        };
    }

    createEnhancedBreadcrumbs() {
        // Buscar contenedor de breadcrumbs existente o crear uno nuevo
        let breadcrumbContainer = document.querySelector('#breadcrumbs');
        
        if (!breadcrumbContainer) {
            breadcrumbContainer = document.createElement('div');
            breadcrumbContainer.id = 'breadcrumbs';
            
            // Insertar después de la navegación principal
            const navbar = document.querySelector('.unified-navbar');
            if (navbar) {
                navbar.insertAdjacentElement('afterend', breadcrumbContainer);
            } else {
                document.body.insertBefore(breadcrumbContainer, document.body.firstChild);
            }
        }

        breadcrumbContainer.className = 'enhanced-breadcrumbs';
        breadcrumbContainer.innerHTML = `
            <div class="container">
                <div class="breadcrumb-container">
                    <nav class="breadcrumb-nav" aria-label="Navegación de ubicación">
                        <ol class="breadcrumb-trail">
                            ${this.currentPath.map((item, index) => {
                                const isLast = index === this.currentPath.length - 1;
                                
                                if (isLast) {
                                    return `
                                        <li class="breadcrumb-item">
                                            <span class="breadcrumb-current">
                                                <span class="icon">${item.icon}</span>
                                                <span class="text">${item.name}</span>
                                            </span>
                                        </li>
                                    `;
                                } else {
                                    return `
                                        <li class="breadcrumb-item">
                                            <a href="${item.url}" class="breadcrumb-link" title="${item.description}">
                                                <span class="icon">${item.icon}</span>
                                                <span class="text">${item.name}</span>
                                            </a>
                                        </li>
                                        <li class="breadcrumb-separator" aria-hidden="true">▶</li>
                                    `;
                                }
                            }).join('')}
                        </ol>
                    </nav>
                    <div class="breadcrumb-actions">
                        <div class="breadcrumb-dropdown">
                            <button class="breadcrumb-menu-toggle" aria-expanded="false">
                                <span class="icon icon-menu"></span>
                                <span class="text">Opciones</span>
                            </button>
                            <div class="breadcrumb-menu">
                                <a href="/public/" class="breadcrumb-menu-item icon-text">
                                    <span class="icon icon-home"></span>
                                    <span class="text">Ir al Inicio</span>
                                </a>
                                <a href="/public/sections/pilgrim/" class="breadcrumb-menu-item icon-text">
                                    <span class="icon icon-pilgrim"></span>
                                    <span class="text">Demo Pilgrim</span>
                                </a>
                                <a href="/public/sections/merchant/" class="breadcrumb-menu-item icon-text">
                                    <span class="icon icon-merchant"></span>
                                    <span class="text">Demo Merchant</span>
                                </a>
                                <a href="/public/sections/red-pill/" class="breadcrumb-menu-item icon-text">
                                    <span class="icon icon-red-pill"></span>
                                    <span class="text">Red Pill Interactive</span>
                                </a>
                                <a href="/public/docs/" class="breadcrumb-menu-item icon-text">
                                    <span class="icon icon-docs"></span>
                                    <span class="text">Documentación</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.breadcrumbContainer = breadcrumbContainer;
    }

    initContextualNavigation() {
        // Crear navegación contextual para la sección actual
        if (this.pageContext.section === 'home') return;

        const contextualNav = this.createContextualNav();
        if (contextualNav) {
            this.insertContextualNav(contextualNav);
        }
    }

    createContextualNav() {
        const section = this.pageContext.section;
        let navItems = [];

        switch (section) {
            case 'pilgrim':
                navItems = [
                    { name: 'Demo Principal', url: '/public/sections/pilgrim/', icon: '🚀', active: true },
                    { name: 'Versión Mejorada', url: '/public/sections/pilgrim/index-mejorado.html', icon: '✨' }
                ];
                break;
            case 'merchant':
                navItems = [
                    { name: 'Demo Principal', url: '/public/sections/merchant/', icon: '🏪', active: true },
                    { name: 'Estado Inicial', url: '/public/sections/merchant/variations/initial_load.html', icon: '🌱' },
                    { name: 'Después de Scroll', url: '/public/sections/merchant/variations/after_scroll.html', icon: '📜' },
                    { name: 'Botón Clickeado', url: '/public/sections/merchant/variations/button_clicked.html', icon: '👆' }
                ];
                break;
            case 'red-pill':
                navItems = [
                    { name: 'Experiencia Principal', url: '/public/sections/red-pill/', icon: '💊', active: true },
                    { name: 'Estado Inicial', url: '/public/sections/red-pill/journey/initial.html', icon: '🌅' },
                    { name: 'Camino Izquierdo', url: '/public/sections/red-pill/journey/left_path.html', icon: '←' },
                    { name: 'Camino Derecho', url: '/public/sections/red-pill/journey/right_path.html', icon: '→' },
                    { name: 'Final', url: '/public/sections/red-pill/journey/final.html', icon: '🎯' }
                ];
                break;
            case 'docs':
                navItems = [
                    { name: 'Documentación', url: '/public/docs/', icon: '📚', active: true },
                    { name: 'Mejoras UX', url: '/public/ux-improvements.md', icon: '✨' },
                    { name: 'Guía Implementación', url: '/public/UX-IMPLEMENTATION-GUIDE.md', icon: '📋' }
                ];
                break;
        }

        if (navItems.length === 0) return null;

        return `
            <nav class="contextual-nav" aria-label="Navegación de sección">
                <ul class="contextual-nav-list">
                    ${navItems.map(item => `
                        <li class="contextual-nav-item">
                            <a href="${item.url}" class="contextual-nav-link ${item.active ? 'active' : ''}" title="${item.name}">
                                <span class="icon">${item.icon}</span>
                                <span class="text">${item.name}</span>
                                ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
        `;
    }

    insertContextualNav(navHtml) {
        // Insertar navegación contextual después de breadcrumbs
        const breadcrumbs = document.querySelector('.enhanced-breadcrumbs');
        if (breadcrumbs) {
            breadcrumbs.insertAdjacentHTML('afterend', navHtml);
        }
    }

    initRecognitionHelpers() {
        // Añadir tooltips de reconocimiento a elementos importantes
        this.addRecognitionTooltips();
        this.enhanceFormLabels();
        this.addStatusIndicators();
    }

    addRecognitionTooltips() {
        // Añadir tooltips a botones sin texto claro
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            if (!button.textContent.trim() || button.textContent.trim().length < 3) {
                this.wrapWithRecognitionHelper(button);
            }
        });

        // Añadir tooltips a enlaces externos
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.classList.add('icon-text');
                link.innerHTML += ' <span class="icon icon-external"></span>';
                this.wrapWithRecognitionHelper(link, 'Enlace externo - se abre en nueva ventana');
            }
        });
    }

    wrapWithRecognitionHelper(element, tooltipText = null) {
        if (element.closest('.recognition-helper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'recognition-helper';
        
        const tooltip = document.createElement('div');
        tooltip.className = 'recognition-tooltip';
        tooltip.textContent = tooltipText || this.generateTooltipText(element);
        
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        wrapper.appendChild(tooltip);
    }

    generateTooltipText(element) {
        const tagName = element.tagName.toLowerCase();
        const className = element.className;
        const id = element.id;

        if (className.includes('close')) return 'Cerrar';
        if (className.includes('menu')) return 'Menú';
        if (className.includes('search')) return 'Buscar';
        if (className.includes('settings')) return 'Configuración';
        if (className.includes('help')) return 'Ayuda';
        if (className.includes('print')) return 'Imprimir';
        if (className.includes('share')) return 'Compartir';
        if (className.includes('save')) return 'Guardar';
        if (className.includes('edit')) return 'Editar';
        if (className.includes('delete')) return 'Eliminar';
        if (className.includes('add')) return 'Añadir';

        if (tagName === 'button') return 'Botón interactivo';
        if (tagName === 'a') return 'Enlace';
        
        return 'Elemento interactivo';
    }

    enhanceFormLabels() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`) || 
                         input.closest('label') || 
                         input.previousElementSibling?.tagName === 'LABEL' ? input.previousElementSibling : null;

            if (label && !label.classList.contains('descriptive-label')) {
                this.enhanceLabel(label, input);
            } else if (!label) {
                this.createMissingLabel(input);
            }
        });
    }

    enhanceLabel(label, input) {
        const originalText = label.textContent;
        const description = this.generateFieldDescription(input);

        if (description) {
            label.classList.add('descriptive-label');
            label.innerHTML = `
                <span class="label-text">${originalText}</span>
                <span class="label-description">${description}</span>
            `;
        }
    }

    createMissingLabel(input) {
        const labelText = this.generateLabelText(input);
        const description = this.generateFieldDescription(input);

        const label = document.createElement('label');
        label.className = 'descriptive-label';
        label.setAttribute('for', input.id || `field-${Date.now()}`);
        label.innerHTML = `
            <span class="label-text">${labelText}</span>
            ${description ? `<span class="label-description">${description}</span>` : ''}
        `;

        if (!input.id) {
            input.id = label.getAttribute('for');
        }

        input.parentNode.insertBefore(label, input);
    }

    generateLabelText(input) {
        const type = input.type || 'text';
        const name = input.name || '';
        const placeholder = input.placeholder || '';

        if (placeholder) return placeholder;
        if (name) return this.capitalizeWord(name.replace(/[-_]/g, ' '));

        const typeLabels = {
            'email': 'Correo Electrónico',
            'password': 'Contraseña',
            'search': 'Buscar',
            'tel': 'Teléfono',
            'url': 'URL',
            'number': 'Número',
            'date': 'Fecha',
            'time': 'Hora'
        };

        return typeLabels[type] || 'Campo de Texto';
    }

    generateFieldDescription(input) {
        const type = input.type || 'text';
        const required = input.required;

        const descriptions = {
            'email': 'Ingresa tu dirección de correo electrónico',
            'password': 'Ingresa tu contraseña',
            'search': 'Escribe para buscar',
            'tel': 'Ingresa tu número de teléfono',
            'url': 'Ingresa una URL válida',
            'number': 'Ingresa un número',
            'date': 'Selecciona una fecha',
            'time': 'Selecciona una hora'
        };

        let description = descriptions[type] || '';
        if (required) {
            description += (description ? ' (obligatorio)' : 'Campo obligatorio');
        }

        return description;
    }

    addStatusIndicators() {
        // Añadir indicadores de estado a elementos relevantes
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (!button.querySelector('.status-indicator')) {
                this.addButtonStatusIndicator(button);
            }
        });
    }

    addButtonStatusIndicator(button) {
        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'status-indicator status-active';
        statusIndicator.innerHTML = '<span class="status-icon"></span>';
        
        button.insertBefore(statusIndicator, button.firstChild);
    }

    setupIconSystem() {
        // Aplicar iconos automáticamente basados en clases y contenido
        document.querySelectorAll('[class*="icon-"]').forEach(element => {
            if (!element.querySelector('.icon') && !element.classList.contains('icon')) {
                this.applyIcon(element);
            }
        });
    }

    applyIcon(element) {
        const classes = Array.from(element.classList);
        const iconClass = classes.find(cls => cls.startsWith('icon-'));
        
        if (iconClass) {
            const icon = document.createElement('span');
            icon.className = `icon ${iconClass}`;
            element.insertBefore(icon, element.firstChild);
        }
    }

    bindEventListeners() {
        // Menú desplegable de breadcrumbs
        document.addEventListener('click', (e) => {
            const menuToggle = e.target.closest('.breadcrumb-menu-toggle');
            if (menuToggle) {
                e.preventDefault();
                const dropdown = menuToggle.closest('.breadcrumb-dropdown');
                dropdown.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', dropdown.classList.contains('active'));
            }

            // Cerrar menús desplegables al hacer clic fuera
            if (!e.target.closest('.breadcrumb-dropdown')) {
                document.querySelectorAll('.breadcrumb-dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const toggle = dropdown.querySelector('.breadcrumb-menu-toggle');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                });
            }
        });

        // Navegación contextual
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.contextual-nav-link');
            if (navLink && !e.defaultPrevented) {
                this.handleNavigation(navLink.href);
            }
        });
    }

    trackPageChanges() {
        // Observar cambios en la URL para actualizar breadcrumbs
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                this.detectPageContext();
                this.createEnhancedBreadcrumbs();
                this.initContextualNavigation();
            }
        }).observe(document, { subtree: true, childList: true });
    }

    handleNavigation(url) {
        // Añadir a historial de navegación personalizado
        this.navigationHistory.push({
            url: window.location.href,
            title: document.title,
            timestamp: Date.now()
        });

        // Limitar historial a últimas 50 entradas
        if (this.navigationHistory.length > 50) {
            this.navigationHistory = this.navigationHistory.slice(-50);
        }
    }

    // Métodos de utilidad
    capitalizeWord(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Métodos públicos para uso externo
    updateBreadcrumbs() {
        this.detectPageContext();
        this.createEnhancedBreadcrumbs();
    }

    addCustomBreadcrumb(name, url, icon = '📄') {
        this.currentPath.push({ name, url, icon });
        this.createEnhancedBreadcrumbs();
    }

    showRecognitionToast(message, type = 'info') {
        if (window.systemStatusManager) {
            window.systemStatusManager.showToast(message, type);
        }
    }

    // API pública
    getPageContext() {
        return this.pageContext;
    }

    getCurrentPath() {
        return this.currentPath;
    }

    getNavigationHistory() {
        return this.navigationHistory;
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.recognitionManager = new RecognitionManager();
    });
} else {
    window.recognitionManager = new RecognitionManager();
}

// Exportar para uso global
window.RecognitionManager = RecognitionManager; 