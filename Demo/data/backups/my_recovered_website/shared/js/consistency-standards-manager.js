/**
 * ================================================
 * CONSISTENCY AND STANDARDS MANAGER
 * Sistema de consistencia y estándares de diseño
 * ================================================ */

class ConsistencyStandardsManager {
    constructor() {
        this.designTokens = new Map();
        this.componentRegistry = new Map();
        this.validator = null;
        this.inconsistencies = [];
        this.standardsConfig = {
            colorPalette: {},
            typography: {},
            spacing: {},
            components: {},
            brandGuidelines: {}
        };
        this.validationRules = [];
        this.init();
    }

    init() {
        this.loadDesignTokens();
        this.registerStandardComponents();
        this.initConsistencyValidator();
        this.setupStandardsEnforcement();
        this.addEventListeners();
        console.log('✅ Consistency Standards Manager initialized');
    }

    // ================================================
    // DESIGN TOKENS MANAGEMENT
    // ================================================

    loadDesignTokens() {
        // Extract CSS custom properties
        const rootStyles = getComputedStyle(document.documentElement);
        
        // Color tokens
        this.designTokens.set('colors', {
            primary: this.extractColorScale(rootStyles, 'primary'),
            secondary: this.extractColorScale(rootStyles, 'secondary'),
            success: this.extractColorScale(rootStyles, 'success'),
            warning: this.extractColorScale(rootStyles, 'warning'),
            error: this.extractColorScale(rootStyles, 'error'),
            neutral: this.extractColorScale(rootStyles, 'neutral')
        });

        // Typography tokens
        this.designTokens.set('typography', {
            fontSizes: this.extractTokenScale(rootStyles, 'font-size'),
            fontWeights: this.extractTokenScale(rootStyles, 'font-weight'),
            lineHeights: this.extractTokenScale(rootStyles, 'line-height'),
            letterSpacing: this.extractTokenScale(rootStyles, 'letter-spacing')
        });

        // Spacing tokens
        this.designTokens.set('spacing', 
            this.extractTokenScale(rootStyles, 'space')
        );

        // Border radius tokens
        this.designTokens.set('borderRadius', 
            this.extractTokenScale(rootStyles, 'radius')
        );

        // Shadow tokens
        this.designTokens.set('shadows', 
            this.extractTokenScale(rootStyles, 'shadow')
        );

        // Z-index tokens
        this.designTokens.set('zIndex', 
            this.extractTokenScale(rootStyles, 'z-index')
        );

        // Transition tokens
        this.designTokens.set('transitions', {
            durations: this.extractTokenScale(rootStyles, 'duration'),
            easings: this.extractTokenScale(rootStyles, 'ease')
        });

        console.log('🎨 Design tokens loaded:', this.designTokens);
    }

    extractColorScale(styles, colorName) {
        const scale = {};
        for (let i = 50; i <= 900; i += (i === 50 ? 50 : 100)) {
            const value = styles.getPropertyValue(`--color-${colorName}-${i}`).trim();
            if (value) scale[i] = value;
        }
        return scale;
    }

    extractTokenScale(styles, prefix) {
        const tokens = {};
        // Esta sería una implementación más completa para extraer todos los tokens
        // Por simplicidad, extraemos algunos conocidos
        const commonTokens = {
            'font-size': ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'],
            'font-weight': ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
            'line-height': ['tight', 'snug', 'normal', 'relaxed', 'loose'],
            'letter-spacing': ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
            'space': ['px', '0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
            'radius': ['none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
            'shadow': ['sm', 'base', 'md', 'lg', 'xl', '2xl', 'inner'],
            'z-index': ['hide', 'auto', 'base', 'docked', 'dropdown', 'sticky', 'banner', 'overlay', 'modal', 'popover', 'skipLink', 'toast', 'tooltip'],
            'duration': ['75', '100', '150', '200', '300', '500', '700', '1000'],
            'ease': ['linear', 'in', 'out', 'in-out']
        };

        if (commonTokens[prefix]) {
            commonTokens[prefix].forEach(token => {
                const value = styles.getPropertyValue(`--${prefix}-${token}`).trim();
                if (value) tokens[token] = value;
            });
        }

        return tokens;
    }

    getDesignToken(category, token) {
        const categoryTokens = this.designTokens.get(category);
        return categoryTokens ? categoryTokens[token] : null;
    }

    // ================================================
    // COMPONENT REGISTRY
    // ================================================

    registerStandardComponents() {
        // Button components
        this.componentRegistry.set('button', {
            baseClass: 'std-button',
            variants: ['primary', 'secondary', 'ghost'],
            sizes: ['sm', 'lg', 'xl'],
            states: ['default', 'hover', 'focus', 'active', 'disabled'],
            requiredProps: ['type', 'role'],
            validation: (element) => this.validateButtonComponent(element)
        });

        // Input components
        this.componentRegistry.set('input', {
            baseClass: 'std-input',
            variants: [],
            sizes: [],
            states: ['default', 'focus', 'invalid', 'disabled'],
            requiredProps: ['type', 'id'],
            validation: (element) => this.validateInputComponent(element)
        });

        // Card components
        this.componentRegistry.set('card', {
            baseClass: 'std-card',
            variants: [],
            sizes: [],
            states: ['default', 'hover'],
            requiredProps: [],
            validation: (element) => this.validateCardComponent(element)
        });

        // Badge components
        this.componentRegistry.set('badge', {
            baseClass: 'std-badge',
            variants: ['primary', 'success', 'warning', 'error', 'neutral'],
            sizes: [],
            states: ['default'],
            requiredProps: [],
            validation: (element) => this.validateBadgeComponent(element)
        });

        // Alert components
        this.componentRegistry.set('alert', {
            baseClass: 'std-alert',
            variants: ['info', 'success', 'warning', 'error'],
            sizes: [],
            states: ['default'],
            requiredProps: ['role'],
            validation: (element) => this.validateAlertComponent(element)
        });

        console.log('📦 Standard components registered:', Array.from(this.componentRegistry.keys()));
    }

    validateButtonComponent(element) {
        const issues = [];
        
        // Check base class
        if (!element.classList.contains('std-button')) {
            issues.push('Missing base class: std-button');
        }

        // Check accessibility
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            issues.push('Button needs accessible text or aria-label');
        }

        // Check focus state
        if (element.tabIndex < 0) {
            issues.push('Button should be focusable');
        }

        return issues;
    }

    validateInputComponent(element) {
        const issues = [];
        
        // Check base class
        if (!element.classList.contains('std-input')) {
            issues.push('Missing base class: std-input');
        }

        // Check label association
        const id = element.getAttribute('id');
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (!label) {
                issues.push('Input should have an associated label');
            }
        } else {
            issues.push('Input should have an id for label association');
        }

        return issues;
    }

    validateCardComponent(element) {
        const issues = [];
        
        // Check base class
        if (!element.classList.contains('std-card')) {
            issues.push('Missing base class: std-card');
        }

        // Check structure
        const header = element.querySelector('.std-card__header');
        const content = element.querySelector('.std-card__content');
        
        if (!header && !content) {
            issues.push('Card should have header or content section');
        }

        return issues;
    }

    validateBadgeComponent(element) {
        const issues = [];
        
        // Check base class
        if (!element.classList.contains('std-badge')) {
            issues.push('Missing base class: std-badge');
        }

        // Check variant
        const hasVariant = ['primary', 'success', 'warning', 'error', 'neutral']
            .some(variant => element.classList.contains(`std-badge--${variant}`));
        
        if (!hasVariant) {
            issues.push('Badge should have a variant class');
        }

        return issues;
    }

    validateAlertComponent(element) {
        const issues = [];
        
        // Check base class
        if (!element.classList.contains('std-alert')) {
            issues.push('Missing base class: std-alert');
        }

        // Check role
        if (!element.getAttribute('role')) {
            issues.push('Alert should have a role attribute');
        }

        // Check variant
        const hasVariant = ['info', 'success', 'warning', 'error']
            .some(variant => element.classList.contains(`std-alert--${variant}`));
        
        if (!hasVariant) {
            issues.push('Alert should have a variant class');
        }

        return issues;
    }

    // ================================================
    // CONSISTENCY VALIDATOR
    // ================================================

    initConsistencyValidator() {
        this.validator = document.createElement('div');
        this.validator.className = 'consistency-validator';
        this.validator.innerHTML = `
            <div class="consistency-validator__header">
                <div class="consistency-validator__icon">⚡</div>
                <h3 class="consistency-validator__title">Consistency Check</h3>
            </div>
            <ul class="consistency-validator__list" id="consistency-issues"></ul>
        `;
        document.body.appendChild(this.validator);

        // Auto-run validation periodically
        setInterval(() => this.runConsistencyCheck(), 5000);
    }

    runConsistencyCheck() {
        this.inconsistencies = [];
        
        // Check color consistency
        this.checkColorConsistency();
        
        // Check typography consistency
        this.checkTypographyConsistency();
        
        // Check spacing consistency
        this.checkSpacingConsistency();
        
        // Check component consistency
        this.checkComponentConsistency();
        
        // Check accessibility consistency
        this.checkAccessibilityConsistency();
        
        this.updateValidatorDisplay();
    }

    checkColorConsistency() {
        const elements = document.querySelectorAll('*');
        const colorTokens = this.designTokens.get('colors');
        
        elements.forEach(element => {
            const style = getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            // Check if colors are using design tokens
            if (color !== 'rgba(0, 0, 0, 0)' && color !== 'rgb(0, 0, 0)') {
                if (!this.isColorFromTokens(color, colorTokens)) {
                    this.inconsistencies.push({
                        type: 'color',
                        element: element.tagName.toLowerCase(),
                        issue: `Non-standard color: ${color}`,
                        severity: 'warning'
                    });
                }
            }
        });
    }

    checkTypographyConsistency() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const typography = this.designTokens.get('typography');
        
        headings.forEach(heading => {
            const style = getComputedStyle(heading);
            const fontSize = style.fontSize;
            const fontWeight = style.fontWeight;
            
            // Check if using standard classes
            const hasStandardClass = heading.classList.contains('std-heading--1') ||
                                   heading.classList.contains('std-heading--2') ||
                                   heading.classList.contains('std-heading--3') ||
                                   heading.classList.contains('std-heading--4');
            
            if (!hasStandardClass) {
                this.inconsistencies.push({
                    type: 'typography',
                    element: heading.tagName.toLowerCase(),
                    issue: 'Heading not using standard typography classes',
                    severity: 'warning'
                });
            }
        });
    }

    checkSpacingConsistency() {
        const elements = document.querySelectorAll('[style*="margin"], [style*="padding"]');
        
        elements.forEach(element => {
            const style = element.getAttribute('style');
            if (style && style.includes('px')) {
                // Check if using inline styles instead of spacing tokens
                this.inconsistencies.push({
                    type: 'spacing',
                    element: element.tagName.toLowerCase(),
                    issue: 'Using inline spacing instead of design tokens',
                    severity: 'info'
                });
            }
        });
    }

    checkComponentConsistency() {
        this.componentRegistry.forEach((config, componentType) => {
            const elements = document.querySelectorAll(`.${config.baseClass}`);
            
            elements.forEach(element => {
                const issues = config.validation(element);
                issues.forEach(issue => {
                    this.inconsistencies.push({
                        type: 'component',
                        element: componentType,
                        issue: issue,
                        severity: 'error'
                    });
                });
            });
        });
    }

    checkAccessibilityConsistency() {
        // Check for missing alt text
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            this.inconsistencies.push({
                type: 'accessibility',
                element: 'img',
                issue: 'Missing alt attribute',
                severity: 'error'
            });
        });

        // Check for missing labels
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        inputs.forEach(input => {
            if (!input.id || !document.querySelector(`label[for="${input.id}"]`)) {
                this.inconsistencies.push({
                    type: 'accessibility',
                    element: 'input',
                    issue: 'Missing label or aria-label',
                    severity: 'error'
                });
            }
        });
    }

    isColorFromTokens(color, colorTokens) {
        // Simplified check - in real implementation would be more sophisticated
        const allColors = Object.values(colorTokens).flat();
        return allColors.some(tokenColor => {
            // Convert and compare colors
            return false; // Simplified for demo
        });
    }

    updateValidatorDisplay() {
        const issuesList = document.getElementById('consistency-issues');
        if (!issuesList) return;

        issuesList.innerHTML = '';
        
        if (this.inconsistencies.length === 0) {
            issuesList.innerHTML = `
                <li class="consistency-validator__item">
                    <div class="consistency-validator__status consistency-validator__status--pass"></div>
                    <span>All standards compliant</span>
                </li>
            `;
            this.validator.classList.remove('active');
            return;
        }

        // Group by severity
        const grouped = this.inconsistencies.reduce((acc, issue) => {
            if (!acc[issue.severity]) acc[issue.severity] = [];
            acc[issue.severity].push(issue);
            return acc;
        }, {});

        // Show top issues
        const topIssues = this.inconsistencies.slice(0, 5);
        topIssues.forEach(issue => {
            const item = document.createElement('li');
            item.className = 'consistency-validator__item';
            item.innerHTML = `
                <div class="consistency-validator__status consistency-validator__status--${issue.severity === 'error' ? 'fail' : 'warning'}"></div>
                <span>${issue.issue}</span>
            `;
            issuesList.appendChild(item);
        });

        if (this.inconsistencies.length > 5) {
            const moreItem = document.createElement('li');
            moreItem.className = 'consistency-validator__item';
            moreItem.innerHTML = `
                <div class="consistency-validator__status consistency-validator__status--warning"></div>
                <span>+${this.inconsistencies.length - 5} more issues</span>
            `;
            issuesList.appendChild(moreItem);
        }

        this.validator.classList.add('active');
    }

    // ================================================
    // STANDARDS ENFORCEMENT
    // ================================================

    setupStandardsEnforcement() {
        // Observe DOM changes to validate new elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.validateNewElement(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    validateNewElement(element) {
        // Quick validation for new elements
        setTimeout(() => {
            this.runConsistencyCheck();
        }, 100);
    }

    // ================================================
    // UTILITY METHODS
    // ================================================

    convertToStandardComponent(element, componentType) {
        const config = this.componentRegistry.get(componentType);
        if (!config) return false;

        // Add base class
        element.classList.add(config.baseClass);

        // Apply standard structure
        switch (componentType) {
            case 'button':
                this.standardizeButton(element);
                break;
            case 'input':
                this.standardizeInput(element);
                break;
            case 'card':
                this.standardizeCard(element);
                break;
        }

        return true;
    }

    standardizeButton(button) {
        // Ensure accessibility
        if (!button.getAttribute('type')) {
            button.setAttribute('type', 'button');
        }
        
        // Add transition class
        button.classList.add('std-transition');
    }

    standardizeInput(input) {
        // Ensure proper structure
        if (!input.id) {
            input.id = `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        
        // Add transition class
        input.classList.add('std-transition');
    }

    standardizeCard(card) {
        // Ensure proper structure
        if (!card.querySelector('.std-card__header') && !card.querySelector('.std-card__content')) {
            const content = document.createElement('div');
            content.className = 'std-card__content';
            content.innerHTML = card.innerHTML;
            card.innerHTML = '';
            card.appendChild(content);
        }
    }

    // ================================================
    // PUBLIC API
    // ================================================

    getInconsistencies() {
        return this.inconsistencies;
    }

    getDesignTokens() {
        return this.designTokens;
    }

    forceConsistencyCheck() {
        this.runConsistencyCheck();
    }

    hideValidator() {
        this.validator.classList.remove('active');
    }

    showValidator() {
        this.validator.classList.add('active');
    }

    // ================================================
    // EVENT LISTENERS
    // ================================================

    addEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + C - Toggle consistency validator
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.validator.classList.toggle('active');
            }
        });

        // Click to hide validator
        document.addEventListener('click', (e) => {
            if (!this.validator.contains(e.target)) {
                this.hideValidator();
            }
        });
    }
}

// ================================================
// INITIALIZATION AND GLOBAL ACCESS
// ================================================

// Initialize manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.consistencyStandardsManager = new ConsistencyStandardsManager();
    });
} else {
    window.consistencyStandardsManager = new ConsistencyStandardsManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsistencyStandardsManager;
} 