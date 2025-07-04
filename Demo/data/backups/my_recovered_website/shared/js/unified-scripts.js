/**
 * COOMUNITY UNIFIED SCRIPTS
 * Sistema de JavaScript unificado para comportamientos consistentes
 */

(function() {
    'use strict';

    // ================================================
    // CONFIGURACIÓN GLOBAL
    // ================================================
    const CONFIG = {
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        },
        animations: {
            duration: 250,
            easing: 'ease-in-out'
        },
        accessibility: {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        }
    };

    // ================================================
    // UTILIDADES GLOBALES
    // ================================================
    const Utils = {
        // Debounce function para optimizar eventos
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Detectar dispositivo móvil
        isMobile: function() {
            return window.innerWidth <= CONFIG.breakpoints.mobile;
        },

        // Obtener sección actual
        getCurrentSection: function() {
            const path = window.location.pathname;
            if (path.includes('/red-pill/')) return 'red-pill';
            if (path.includes('/merchant/')) return 'merchant';
            if (path.includes('/pilgrim/')) return 'pilgrim';
            return 'home';
        },

        // Logging consistente
        log: function(message, type = 'info') {
            if (window.console) {
                const timestamp = new Date().toISOString();
                const section = this.getCurrentSection();
                console[type](`[${timestamp}] [${section}] ${message}`);
            }
        },

        // Tracking de eventos UX
        trackEvent: function(eventName, parameters = {}) {
            if (window.trackUXEvent) {
                const section = this.getCurrentSection();
                window.trackUXEvent(eventName, {
                    section: section,
                    timestamp: new Date().toISOString(),
                    ...parameters
                });
            }
        }
    };

    // ================================================
    // NAVEGACIÓN UNIFICADA
    // ================================================
    const Navigation = {
        init: function() {
            this.setupMobileMenu();
            this.setupActiveStates();
            this.setupKeyboardNavigation();
            Utils.log('Navigation initialized');
        },

        setupMobileMenu: function() {
            const toggleButton = document.querySelector('.navbar-toggle');
            const navMenu = document.querySelector('.navbar-nav');

            if (toggleButton && navMenu) {
                toggleButton.addEventListener('click', () => {
                    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                    
                    toggleButton.setAttribute('aria-expanded', !isExpanded);
                    navMenu.classList.toggle('active');
                    
                    // Cambiar icono
                    const icon = toggleButton.querySelector('i');
                    if (icon) {
                        icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
                    }

                    Utils.trackEvent('mobile_menu_toggle', { expanded: !isExpanded });
                });

                // Cerrar menú al hacer clic fuera
                document.addEventListener('click', (e) => {
                    if (!toggleButton.contains(e.target) && !navMenu.contains(e.target)) {
                        toggleButton.setAttribute('aria-expanded', 'false');
                        navMenu.classList.remove('active');
                        
                        const icon = toggleButton.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-bars';
                        }
                    }
                });
            }
        },

        setupActiveStates: function() {
            const currentSection = Utils.getCurrentSection();
            const navLinks = document.querySelectorAll('.nav-link');

            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes(currentSection)) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        },

        setupKeyboardNavigation: function() {
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach((link, index) => {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextIndex = (index + 1) % navLinks.length;
                        navLinks[nextIndex].focus();
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                        navLinks[prevIndex].focus();
                    }
                });
            });
        }
    };

    // ================================================
    // FORMULARIOS UNIFICADOS
    // ================================================
    const Forms = {
        init: function() {
            this.setupValidation();
            this.setupAccessibility();
            Utils.log('Forms initialized');
        },

        setupValidation: function() {
            const forms = document.querySelectorAll('.form-unified');
            
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!this.validateForm(form)) {
                        e.preventDefault();
                        Utils.trackEvent('form_validation_failed', {
                            formId: form.id || 'unknown'
                        });
                    } else {
                        Utils.trackEvent('form_submitted', {
                            formId: form.id || 'unknown'
                        });
                    }
                });

                // Validación en tiempo real
                const inputs = form.querySelectorAll('.form-control');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        this.validateField(input);
                    });
                });
            });
        },

        validateForm: function(form) {
            const inputs = form.querySelectorAll('.form-control[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        },

        validateField: function(field) {
            const value = field.value.trim();
            const isRequired = field.hasAttribute('required');
            const type = field.type;
            
            let isValid = true;
            let errorMessage = '';

            // Validación de campo requerido
            if (isRequired && !value) {
                isValid = false;
                errorMessage = 'Este campo es obligatorio';
            }

            // Validación de email
            if (type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido';
                }
            }

            this.showFieldValidation(field, isValid, errorMessage);
            return isValid;
        },

        showFieldValidation: function(field, isValid, message) {
            // Remover clases anteriores
            field.classList.remove('is-valid', 'is-invalid');
            
            // Remover mensaje anterior
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }

            if (!isValid) {
                field.classList.add('is-invalid');
                field.setAttribute('aria-invalid', 'true');
                
                // Agregar mensaje de error
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = message;
                errorDiv.setAttribute('role', 'alert');
                field.parentNode.appendChild(errorDiv);
            } else {
                field.classList.add('is-valid');
                field.setAttribute('aria-invalid', 'false');
            }
        },

        setupAccessibility: function() {
            const labels = document.querySelectorAll('.form-label');
            
            labels.forEach(label => {
                const forAttr = label.getAttribute('for');
                if (forAttr) {
                    const input = document.getElementById(forAttr);
                    if (input && !input.getAttribute('aria-labelledby')) {
                        input.setAttribute('aria-labelledby', label.id || `label-${forAttr}`);
                        if (!label.id) {
                            label.id = `label-${forAttr}`;
                        }
                    }
                }
            });
        }
    };

    // ================================================
    // BOTONES UNIFICADOS
    // ================================================
    const Buttons = {
        init: function() {
            this.setupRippleEffect();
            this.setupLoadingStates();
            Utils.log('Buttons initialized');
        },

        setupRippleEffect: function() {
            if (CONFIG.accessibility.reducedMotion) return;

            const buttons = document.querySelectorAll('.btn-unified');
            
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    this.createRipple(e, button);
                });
            });
        },

        createRipple: function(event, button) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        },

        setupLoadingStates: function() {
            const buttons = document.querySelectorAll('[data-loading]');
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    this.setLoadingState(button, true);
                    
                    // Simular carga (en implementación real, esto sería manejado por el evento específico)
                    setTimeout(() => {
                        this.setLoadingState(button, false);
                    }, 2000);
                });
            });
        },

        setLoadingState: function(button, isLoading) {
            if (isLoading) {
                button.disabled = true;
                button.setAttribute('aria-busy', 'true');
                
                const originalText = button.textContent;
                button.dataset.originalText = originalText;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            } else {
                button.disabled = false;
                button.setAttribute('aria-busy', 'false');
                button.textContent = button.dataset.originalText || 'Enviar';
            }
        }
    };

    // ================================================
    // ACCESIBILIDAD GLOBAL
    // ================================================
    const Accessibility = {
        init: function() {
            this.setupSkipLinks();
            this.setupFocusManagement();
            this.setupKeyboardShortcuts();
            Utils.log('Accessibility initialized');
        },

        setupSkipLinks: function() {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.textContent = 'Saltar al contenido principal';
            skipLink.className = 'skip-link sr-only';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-color);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 1000;
                transition: top 0.3s;
            `;

            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
                skipLink.classList.remove('sr-only');
            });

            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
                skipLink.classList.add('sr-only');
            });

            document.body.insertBefore(skipLink, document.body.firstChild);
        },

        setupFocusManagement: function() {
            // Asegurar que elementos interactivos sean focusables
            const interactiveElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            interactiveElements.forEach(element => {
                if (!element.hasAttribute('tabindex') && element.tabIndex === -1) {
                    element.tabIndex = 0;
                }
            });
        },

        setupKeyboardShortcuts: function() {
            document.addEventListener('keydown', (e) => {
                // Alt + H: Ir a inicio
                if (e.altKey && e.key === 'h') {
                    e.preventDefault();
                    window.location.href = '/';
                    Utils.trackEvent('keyboard_shortcut_used', { shortcut: 'alt+h' });
                }

                // Alt + M: Abrir/cerrar menú móvil
                if (e.altKey && e.key === 'm') {
                    e.preventDefault();
                    const toggleButton = document.querySelector('.navbar-toggle');
                    if (toggleButton && Utils.isMobile()) {
                        toggleButton.click();
                        Utils.trackEvent('keyboard_shortcut_used', { shortcut: 'alt+m' });
                    }
                }

                // Escape: Cerrar modales/menús
                if (e.key === 'Escape') {
                    const activeMenu = document.querySelector('.navbar-nav.active');
                    if (activeMenu) {
                        const toggleButton = document.querySelector('.navbar-toggle');
                        if (toggleButton) {
                            toggleButton.click();
                        }
                    }
                }
            });
        }
    };

    // ================================================
    // PERFORMANCE Y OPTIMIZACIÓN
    // ================================================
    const Performance = {
        init: function() {
            this.setupLazyLoading();
            this.setupImageOptimization();
            Utils.log('Performance optimizations initialized');
        },

        setupLazyLoading: function() {
            if ('IntersectionObserver' in window) {
                const images = document.querySelectorAll('img[data-src]');
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        },

        setupImageOptimization: function() {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });

                img.addEventListener('error', () => {
                    img.classList.add('error');
                    // Fallback image
                    if (!img.dataset.fallbackSet) {
                        img.src = '/shared/images/placeholder.png';
                        img.dataset.fallbackSet = 'true';
                    }
                });
            });
        }
    };

    // ================================================
    // INICIALIZACIÓN
    // ================================================
    const App = {
        init: function() {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initializeModules();
                });
            } else {
                this.initializeModules();
            }
        },

        initializeModules: function() {
            try {
                Navigation.init();
                Forms.init();
                Buttons.init();
                Accessibility.init();
                Performance.init();

                // Marcar la aplicación como inicializada
                document.body.classList.add('app-initialized');
                
                Utils.log('CoomÜnity Unified Scripts initialized successfully');
                Utils.trackEvent('app_initialized', {
                    section: Utils.getCurrentSection(),
                    userAgent: navigator.userAgent,
                    viewport: `${window.innerWidth}x${window.innerHeight}`
                });

            } catch (error) {
                Utils.log(`Initialization error: ${error.message}`, 'error');
            }
        }
    };

    // ================================================
    // ESTILOS CSS DINÁMICOS
    // ================================================
    const dynamicStyles = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .skip-link:focus {
            clip: auto !important;
            height: auto !important;
            margin: 0 !important;
            overflow: visible !important;
            position: absolute !important;
            width: auto !important;
        }

        .field-error {
            color: var(--error-color);
            font-size: var(--font-size-sm);
            margin-top: var(--spacing-xs);
        }

        .form-control.is-invalid {
            border-color: var(--error-color);
        }

        .form-control.is-valid {
            border-color: var(--success-color);
        }

        img.loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        img.error {
            opacity: 0.5;
            filter: grayscale(100%);
        }
    `;

    // Inyectar estilos dinámicos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);

    // Exponer utilidades globalmente para uso en secciones específicas
    window.CoomUnityUtils = Utils;
    window.CoomUnityNavigation = Navigation;
    window.CoomUnityForms = Forms;
    window.CoomUnityButtons = Buttons;

    // Inicializar la aplicación
    App.init();

})(); 