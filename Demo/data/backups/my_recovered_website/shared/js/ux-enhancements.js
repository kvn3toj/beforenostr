/**
 * ================================================
 * COOMUNITY - UX ENHANCEMENTS
 * Sistema de mejoras de usabilidad y navegación
 * ================================================
 */

// Clase principal para manejar estados de carga
class LoadingStateManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        this.createLoadingOverlay();
        this.bindFormHandlers();
        this.bindLinkHandlers();
    }

    createLoadingOverlay() {
        // Crear overlay de carga si no existe
        if (document.querySelector('.loading-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p class="loading-text">Cargando...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;

        // Agregar estilos si no existen
        this.addLoadingStyles();
    }

    addLoadingStyles() {
        if (document.querySelector('#loading-styles')) return;

        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .loading-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .loading-content {
                text-align: center;
                color: white;
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top: 3px solid #DC1A5B;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-text {
                font-size: 1.1rem;
                font-weight: 500;
                margin: 0;
            }
        `;
        document.head.appendChild(style);
    }

    show(message = 'Cargando...') {
        if (!this.overlay) return;
        
        const textElement = this.overlay.querySelector('.loading-text');
        if (textElement) {
            textElement.textContent = message;
        }
        
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hide() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    bindFormHandlers() {
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.show('Enviando formulario...');
                
                // Simular procesamiento para demo
                setTimeout(() => {
                    this.hide();
                }, 2000);
            }
        });
    }

    bindLinkHandlers() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.target && !link.download) {
                const url = new URL(link.href);
                
                // Solo mostrar loading para enlaces internos
                if (url.origin === window.location.origin) {
                    this.show('Navegando...');
                    
                    // Ocultar loading después de un tiempo
                    setTimeout(() => {
                        this.hide();
                    }, 1000);
                }
            }
        });
    }
}

// Clase para manejo de navegación mejorada
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.initActiveStates();
        this.initMobileMenu();
        this.initBreadcrumbs();
        this.initBackButtons();
        this.initSmoothScrolling();
    }

    initActiveStates() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const section = link.getAttribute('data-section');
            if (section) {
                if (currentPath.includes(section) || 
                    (section === 'home' && (currentPath === '/public/' || currentPath === '/'))) {
                    link.classList.add('active');
                }
            }
        });
    }

    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                mobileToggle.classList.toggle('active');
                
                // Cambiar icono del hamburger
                if (navLinks.classList.contains('active')) {
                    mobileToggle.innerHTML = '✕';
                } else {
                    mobileToggle.innerHTML = '☰';
                }
            });

            // Cerrar menú móvil al hacer clic en un enlace
            navLinks.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    navLinks.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    mobileToggle.innerHTML = '☰';
                }
            });

            // Cerrar menú móvil al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.unified-navbar')) {
                    navLinks.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    mobileToggle.innerHTML = '☰';
                }
            });
        }
    }

    initBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('#breadcrumbs');
        if (!breadcrumbContainer) return;

        const breadcrumbs = this.generateBreadcrumbs();
        breadcrumbContainer.innerHTML = this.renderBreadcrumbs(breadcrumbs);
    }

    generateBreadcrumbs() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment);
        const breadcrumbs = [{ name: 'Inicio', url: '/public/', icon: '🏠' }];

        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            currentPath += '/' + segment;
            
            const segmentData = this.getSegmentData(segment);
            breadcrumbs.push({
                name: segmentData.name,
                url: currentPath,
                icon: segmentData.icon,
                isLast: index === pathSegments.length - 1
            });
        });

        return breadcrumbs;
    }

    getSegmentData(segment) {
        const segmentMap = {
            'public': { name: 'Inicio', icon: '🏠' },
            'sections': { name: 'Secciones', icon: '📁' },
            'pilgrim': { name: 'Pilgrim Demo', icon: '🚀' },
            'merchant': { name: 'Merchant Demo', icon: '🏪' },
            'red-pill': { name: 'Red Pill Interactive', icon: '💊' },
            'journey': { name: 'Journey', icon: '🛤️' },
            'docs': { name: 'Documentación', icon: '📚' },
            'variations': { name: 'Variaciones', icon: '🔄' },
            'analytics': { name: 'Analytics', icon: '📊' }
        };
        
        return segmentMap[segment] || { 
            name: segment.charAt(0).toUpperCase() + segment.slice(1), 
            icon: '📄' 
        };
    }

    renderBreadcrumbs(breadcrumbs) {
        return `
            <div class="container">
                <ul class="breadcrumb-list">
                    ${breadcrumbs.map((breadcrumb, index) => `
                        <li class="breadcrumb-item">
                            ${breadcrumb.isLast ? 
                                `<span class="breadcrumb-current">
                                    <span class="breadcrumb-icon">${breadcrumb.icon}</span>
                                    ${breadcrumb.name}
                                </span>` :
                                `<a href="${breadcrumb.url}" class="breadcrumb-link">
                                    <span class="breadcrumb-icon">${breadcrumb.icon}</span>
                                    ${breadcrumb.name}
                                </a>`
                            }
                            ${index < breadcrumbs.length - 1 ? '<span class="breadcrumb-separator">/</span>' : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    initBackButtons() {
        const backButtons = document.querySelectorAll('.back-button');
        
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/public/';
                }
            });
        });

        // Auto-crear botón de regreso si no existe
        this.autoCreateBackButton();
    }

    autoCreateBackButton() {
        const path = window.location.pathname;
        const isSubpage = path.split('/').filter(s => s).length > 2;
        
        if (isSubpage && !document.querySelector('.back-button')) {
            const mainContent = document.querySelector('main, .main, .container, body > div');
            if (mainContent) {
                const backButton = document.createElement('a');
                backButton.href = '#';
                backButton.className = 'back-button';
                backButton.textContent = 'Volver';
                
                mainContent.insertBefore(backButton, mainContent.firstChild);
            }
        }
    }

    initSmoothScrolling() {
        // Smooth scrolling para enlaces de ancla
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// Clase para validación de formularios mejorada
class FormValidator {
    constructor() {
        this.init();
    }

    init() {
        this.bindValidationHandlers();
        this.addValidationStyles();
    }

    addValidationStyles() {
        if (document.querySelector('#validation-styles')) return;

        const style = document.createElement('style');
        style.id = 'validation-styles';
        style.textContent = `
            .form-field {
                position: relative;
                margin-bottom: 1.5rem;
            }

            .form-field input,
            .form-field textarea,
            .form-field select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
            }

            .form-field input:focus,
            .form-field textarea:focus,
            .form-field select:focus {
                outline: none;
                border-color: #DC1A5B;
                box-shadow: 0 0 0 3px rgba(220, 26, 91, 0.1);
            }

            .form-field.success input,
            .form-field.success textarea,
            .form-field.success select {
                border-color: #28a745;
                background-color: #f8fff9;
            }

            .form-field.error input,
            .form-field.error textarea,
            .form-field.error select {
                border-color: #dc3545;
                background-color: #fff8f8;
            }

            .form-feedback {
                display: none;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
            }

            .form-field.success .form-feedback.success,
            .form-field.error .form-feedback.error {
                display: block;
            }

            .form-feedback.success {
                color: #28a745;
                background: #f8fff9;
                border-left: 3px solid #28a745;
            }

            .form-feedback.error {
                color: #dc3545;
                background: #fff8f8;
                border-left: 3px solid #dc3545;
            }

            .form-feedback::before {
                margin-right: 0.5rem;
            }

            .form-feedback.success::before {
                content: "✓";
            }

            .form-feedback.error::before {
                content: "⚠";
            }
        `;
        document.head.appendChild(style);
    }

    bindValidationHandlers() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.validateField(e.target);
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.validateField(e.target);
            }
        });
    }

    validateField(input) {
        const field = input.closest('.form-field') || this.wrapInput(input);
        let feedback = field.querySelector('.form-feedback');
        
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'form-feedback';
            field.appendChild(feedback);
        }

        const rules = this.getValidationRules(input);
        const validation = this.performValidation(input, rules);

        // Limpiar estados anteriores
        field.classList.remove('success', 'error');
        feedback.classList.remove('success', 'error');

        // Aplicar nuevo estado
        field.classList.add(validation.isValid ? 'success' : 'error');
        feedback.classList.add(validation.isValid ? 'success' : 'error');
        feedback.textContent = validation.message;

        return validation.isValid;
    }

    wrapInput(input) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-field';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        return wrapper;
    }

    getValidationRules(input) {
        const rules = {};
        
        if (input.hasAttribute('required')) {
            rules.required = true;
        }
        
        if (input.type === 'email') {
            rules.email = true;
        }
        
        if (input.type === 'url') {
            rules.url = true;
        }
        
        if (input.hasAttribute('minlength')) {
            rules.minLength = parseInt(input.getAttribute('minlength'));
        }
        
        if (input.hasAttribute('maxlength')) {
            rules.maxLength = parseInt(input.getAttribute('maxlength'));
        }
        
        if (input.hasAttribute('pattern')) {
            rules.pattern = new RegExp(input.getAttribute('pattern'));
        }

        return rules;
    }

    performValidation(input, rules) {
        const value = input.value.trim();
        
        // Required validation
        if (rules.required && !value) {
            return { isValid: false, message: 'Este campo es obligatorio' };
        }
        
        // Si está vacío y no es requerido, es válido
        if (!value) {
            return { isValid: true, message: '' };
        }
        
        // Email validation
        if (rules.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return { isValid: false, message: 'Formato de email inválido' };
            }
        }
        
        // URL validation
        if (rules.url) {
            try {
                new URL(value);
            } catch {
                return { isValid: false, message: 'URL inválida' };
            }
        }
        
        // Length validations
        if (rules.minLength && value.length < rules.minLength) {
            return { isValid: false, message: `Mínimo ${rules.minLength} caracteres` };
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            return { isValid: false, message: `Máximo ${rules.maxLength} caracteres` };
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            return { isValid: false, message: 'Formato inválido' };
        }
        
        return { isValid: true, message: 'Válido' };
    }
}

// Clase para mejoras responsivas
class ResponsiveEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.initResponsiveImages();
        this.initResponsiveVideos();
        this.initTouchOptimizations();
        this.monitorViewportChanges();
    }

    initResponsiveImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.classList.contains('responsive-media')) {
                img.classList.add('responsive-media');
            }
        });
    }

    initResponsiveVideos() {
        const videos = document.querySelectorAll('iframe[src*="vimeo"], iframe[src*="youtube"]');
        videos.forEach(video => {
            if (!video.closest('.video-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'video-container';
                video.parentNode.insertBefore(wrapper, video);
                wrapper.appendChild(video);
            }
        });
    }

    initTouchOptimizations() {
        // Mejorar área de toque para botones pequeños en móvil
        if ('ontouchstart' in window) {
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .btn, .nav-link, .breadcrumb-link {
                        min-height: 44px;
                        min-width: 44px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .floating-buttons .btn-hexa {
                        min-width: 60px;
                        min-height: 60px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    monitorViewportChanges() {
        let viewportWidth = window.innerWidth;
        
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            
            // Solo reaccionar a cambios significativos
            if (Math.abs(newWidth - viewportWidth) > 100) {
                viewportWidth = newWidth;
                this.handleViewportChange();
            }
        });
    }

    handleViewportChange() {
        // Re-inicializar componentes que pueden necesitar ajustes
        const navManager = window.navigationManager;
        if (navManager) {
            navManager.initMobileMenu();
        }
    }
}

// Clase para notificaciones del sistema
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.addNotificationStyles();
    }

    createNotificationContainer() {
        if (document.querySelector('.notification-container')) return;

        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        this.container = container;
    }

    addNotificationStyles() {
        if (document.querySelector('#notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }

            .notification {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 1rem 1.5rem;
                margin-bottom: 0.5rem;
                max-width: 350px;
                transform: translateX(100%);
                transition: all 0.3s ease;
                pointer-events: all;
                border-left: 4px solid #DC1A5B;
            }

            .notification.show {
                transform: translateX(0);
            }

            .notification.success {
                border-left-color: #28a745;
            }

            .notification.error {
                border-left-color: #dc3545;
            }

            .notification.warning {
                border-left-color: #ffc107;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .notification-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }

            .notification-message {
                flex: 1;
                font-weight: 500;
            }

            .notification-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                flex-shrink: 0;
            }

            .notification-close:hover {
                opacity: 1;
            }

            @media (max-width: 480px) {
                .notification-container {
                    left: 20px;
                    right: 20px;
                    top: 10px;
                }

                .notification {
                    max-width: none;
                    transform: translateY(-100%);
                }

                .notification.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);

        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-ocultar después del tiempo especificado
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.closest('.notification').remove()">×</button>
            </div>
        `;

        return notification;
    }

    hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los managers
    window.loadingManager = new LoadingStateManager();
    window.navigationManager = new NavigationManager();
    window.formValidator = new FormValidator();
    window.responsiveEnhancements = new ResponsiveEnhancements();
    window.notificationSystem = new NotificationSystem();

    // Mensaje de bienvenida (opcional)
    setTimeout(() => {
        if (window.notificationSystem && window.location.pathname.includes('/public/')) {
            window.notificationSystem.success('¡Bienvenido a CoomÜnity! Navegación mejorada activada.', 3000);
        }
    }, 1000);

    console.log('🚀 CoomÜnity UX Enhancements cargadas exitosamente');
});

// Exportar para uso global
window.CoomUnityUX = {
    LoadingStateManager,
    NavigationManager,
    FormValidator,
    ResponsiveEnhancements,
    NotificationSystem
}; 