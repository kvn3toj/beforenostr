/**
 * ================================================
 * ERROR PREVENTION MANAGER
 * Sistema de prevención de errores y validación
 * ================================================ */

class ErrorPreventionManager {
    constructor() {
        this.forms = new Map();
        this.validators = new Map();
        this.autoSaveTimers = new Map();
        this.confirmationDialogs = [];
        this.unsavedChanges = new Set();
        this.validationRules = this.initValidationRules();
        this.init();
    }

    init() {
        this.initFormValidation();
        this.initConfirmationDialogs();
        this.initAutoSave();
        this.initNavigationWarning();
        this.initFileDropZones();
        this.bindGlobalEventListeners();
        
        // Restaurar estado de autoguardado si estaba habilitado previamente
        setTimeout(() => {
            this.restoreAutoSaveState();
        }, 1000); // Delay para asegurar que el DOM esté completamente cargado
    }

    initValidationRules() {
        return {
            required: (value) => ({
                valid: value && value.trim().length > 0,
                message: 'Este campo es obligatorio'
            }),
            email: (value) => ({
                valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Ingresa un email válido'
            }),
            minLength: (value, min) => ({
                valid: value && value.length >= min,
                message: `Mínimo ${min} caracteres`
            }),
            maxLength: (value, max) => ({
                valid: !value || value.length <= max,
                message: `Máximo ${max} caracteres`
            }),
            password: (value) => {
                const checks = this.checkPasswordStrength(value);
                return {
                    valid: checks.score >= 3,
                    message: 'La contraseña debe ser más segura',
                    strength: checks
                };
            },
            confirmPassword: (value, originalPassword) => ({
                valid: value === originalPassword,
                message: 'Las contraseñas no coinciden'
            }),
            number: (value) => ({
                valid: !isNaN(value) && !isNaN(parseFloat(value)),
                message: 'Debe ser un número válido'
            }),
            phone: (value) => ({
                valid: /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')),
                message: 'Ingresa un teléfono válido'
            }),
            url: (value) => ({
                valid: /^https?:\/\/.+\..+/.test(value),
                message: 'Ingresa una URL válida'
            })
        };
    }

    initFormValidation() {
        const forms = document.querySelectorAll('form, .form-validation');
        forms.forEach(form => this.setupFormValidation(form));
    }

    setupFormValidation(form) {
        const formId = form.id || `form-${Date.now()}`;
        if (!form.id) form.id = formId;

        const formData = {
            element: form,
            fields: new Map(),
            isValid: false,
            hasChanges: false
        };

        this.forms.set(formId, formData);

        // Configurar campos del formulario
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => this.setupFieldValidation(input, formId));

        // Configurar submit del formulario
        form.addEventListener('submit', (e) => this.handleFormSubmit(e, formId));
    }

    setupFieldValidation(input, formId) {
        const fieldId = input.id || input.name || `field-${Date.now()}`;
        const fieldData = {
            element: input,
            rules: this.parseValidationRules(input),
            isValid: false,
            originalValue: input.value,
            validationMessage: null
        };

        this.forms.get(formId).fields.set(fieldId, fieldData);

        // Crear elementos de validación
        this.createValidationElements(input);

        // Event listeners
        input.addEventListener('input', () => this.validateField(fieldId, formId));
        input.addEventListener('blur', () => this.validateField(fieldId, formId, true));
        input.addEventListener('change', () => this.markFormAsChanged(formId));

        // Validación especial para contraseñas
        if (input.type === 'password') {
            this.setupPasswordValidation(input, fieldId, formId);
        }

        // Contador de caracteres
        if (input.hasAttribute('maxlength')) {
            this.setupCharacterCounter(input);
        }
    }

    parseValidationRules(input) {
        const rules = [];
        
        if (input.required) {
            rules.push({ type: 'required' });
        }
        
        if (input.type === 'email') {
            rules.push({ type: 'email' });
        }
        
        if (input.type === 'password') {
            rules.push({ type: 'password' });
        }
        
        if (input.type === 'number') {
            rules.push({ type: 'number' });
        }
        
        if (input.type === 'tel') {
            rules.push({ type: 'phone' });
        }
        
        if (input.type === 'url') {
            rules.push({ type: 'url' });
        }
        
        if (input.hasAttribute('minlength')) {
            rules.push({ 
                type: 'minLength', 
                value: parseInt(input.getAttribute('minlength'))
            });
        }
        
        if (input.hasAttribute('maxlength')) {
            rules.push({ 
                type: 'maxLength', 
                value: parseInt(input.getAttribute('maxlength'))
            });
        }

        // Reglas personalizadas desde data attributes
        if (input.dataset.confirmPassword) {
            rules.push({ 
                type: 'confirmPassword',
                target: input.dataset.confirmPassword
            });
        }

        return rules;
    }

    createValidationElements(input) {
        const fieldContainer = this.getOrCreateFieldContainer(input);
        
        // Indicador de validación
        if (!fieldContainer.querySelector('.validation-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'validation-indicator';
            fieldContainer.appendChild(indicator);
        }

        // Mensaje de validación
        if (!fieldContainer.querySelector('.validation-message')) {
            const message = document.createElement('div');
            message.className = 'validation-message';
            fieldContainer.appendChild(message);
        }
    }

    getOrCreateFieldContainer(input) {
        let container = input.closest('.form-field');
        if (!container) {
            container = document.createElement('div');
            container.className = 'form-field';
            input.parentNode.insertBefore(container, input);
            container.appendChild(input);
        }
        return container;
    }

    validateField(fieldId, formId, showMessage = false) {
        const form = this.forms.get(formId);
        const field = form.fields.get(fieldId);
        
        if (!field) return;

        const input = field.element;
        const value = input.value;
        let isValid = true;
        let messages = [];
        let validationType = 'success';

        // Ejecutar todas las reglas de validación
        for (const rule of field.rules) {
            let result;
            
            switch (rule.type) {
                case 'confirmPassword':
                    const targetInput = document.getElementById(rule.target);
                    result = this.validationRules.confirmPassword(value, targetInput?.value);
                    break;
                case 'minLength':
                case 'maxLength':
                    result = this.validationRules[rule.type](value, rule.value);
                    break;
                default:
                    result = this.validationRules[rule.type]?.(value);
            }

            if (result && !result.valid) {
                isValid = false;
                messages.push(result.message);
                validationType = 'error';
            }

            // Manejo especial para contraseñas
            if (rule.type === 'password' && result?.strength) {
                this.updatePasswordStrength(input, result.strength);
            }
        }

        // Actualizar estado visual
        this.updateFieldVisualState(input, isValid, validationType);
        
        // Mostrar mensaje si es necesario
        if (showMessage || !isValid) {
            this.showValidationMessage(input, messages[0] || 'Campo válido', validationType);
        }

        // Actualizar estado del campo
        field.isValid = isValid;
        this.updateFormValidationState(formId);
        
        return isValid;
    }

    updateFieldVisualState(input, isValid, type) {
        // Remover clases anteriores
        input.classList.remove('valid', 'invalid', 'warning');
        
        // Añadir nueva clase
        if (type === 'error') {
            input.classList.add('invalid');
        } else if (type === 'warning') {
            input.classList.add('warning');
        } else if (isValid) {
            input.classList.add('valid');
        }
    }

    showValidationMessage(input, message, type) {
        const container = input.closest('.form-field');
        const messageElement = container?.querySelector('.validation-message');
        
        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.className = `validation-message ${type} show`;
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 3000);
        }
    }

    setupPasswordValidation(input, fieldId, formId) {
        const container = this.getOrCreateFieldContainer(input);
        
        // Crear medidor de fuerza de contraseña
        if (!container.querySelector('.password-strength')) {
            const strengthContainer = document.createElement('div');
            strengthContainer.className = 'password-strength';
            strengthContainer.innerHTML = `
                <div class="strength-meter">
                    <div class="strength-bar"></div>
                </div>
                <div class="strength-text">Muy débil</div>
                <div class="password-requirements">
                    <div class="requirement-item" data-requirement="length">
                        <span class="requirement-icon"></span>
                        <span class="requirement-text">Al menos 8 caracteres</span>
                    </div>
                    <div class="requirement-item" data-requirement="lowercase">
                        <span class="requirement-icon"></span>
                        <span class="requirement-text">Una letra minúscula</span>
                    </div>
                    <div class="requirement-item" data-requirement="uppercase">
                        <span class="requirement-icon"></span>
                        <span class="requirement-text">Una letra mayúscula</span>
                    </div>
                    <div class="requirement-item" data-requirement="number">
                        <span class="requirement-icon"></span>
                        <span class="requirement-text">Un número</span>
                    </div>
                    <div class="requirement-item" data-requirement="special">
                        <span class="requirement-icon"></span>
                        <span class="requirement-text">Un carácter especial</span>
                    </div>
                </div>
            `;
            container.appendChild(strengthContainer);
        }
    }

    checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const score = Object.values(checks).filter(Boolean).length;
        let strength = 'weak';
        
        if (score >= 5) strength = 'strong';
        else if (score >= 4) strength = 'good';
        else if (score >= 3) strength = 'fair';

        return { checks, score, strength };
    }

    updatePasswordStrength(input, strengthData) {
        const container = input.closest('.form-field');
        const strengthBar = container?.querySelector('.strength-bar');
        const strengthText = container?.querySelector('.strength-text');
        
        if (strengthBar && strengthText) {
            // Actualizar barra
            strengthBar.className = `strength-bar ${strengthData.strength}`;
            
            // Actualizar texto
            const strengthTexts = {
                weak: 'Muy débil',
                fair: 'Débil',
                good: 'Buena',
                strong: 'Muy fuerte'
            };
            strengthText.textContent = strengthTexts[strengthData.strength];
            strengthText.className = `strength-text ${strengthData.strength}`;

            // Actualizar checklist
            Object.keys(strengthData.checks).forEach(requirement => {
                const item = container.querySelector(`[data-requirement="${requirement}"]`);
                if (item) {
                    item.classList.toggle('met', strengthData.checks[requirement]);
                }
            });
        }
    }

    setupCharacterCounter(input) {
        const container = this.getOrCreateFieldContainer(input);
        const maxLength = parseInt(input.getAttribute('maxlength'));
        
        if (!container.querySelector('.field-character-count')) {
            const counter = document.createElement('div');
            counter.className = 'field-character-count';
            counter.innerHTML = `
                <span class="character-count">0/${maxLength}</span>
            `;
            container.appendChild(counter);
        }

        const updateCounter = () => {
            const current = input.value.length;
            const counterElement = container.querySelector('.character-count');
            
            if (counterElement) {
                counterElement.textContent = `${current}/${maxLength}`;
                counterElement.classList.remove('warning', 'error');
                
                if (current > maxLength * 0.9) {
                    counterElement.classList.add('warning');
                }
                if (current >= maxLength) {
                    counterElement.classList.add('error');
                }
            }
        };

        input.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    }

    markFormAsChanged(formId) {
        const form = this.forms.get(formId);
        if (form) {
            form.hasChanges = true;
            this.unsavedChanges.add(formId);
            this.updateUnsavedChangesWarning();
            this.startAutoSave(formId);
        }
    }

    updateFormValidationState(formId) {
        const form = this.forms.get(formId);
        if (!form) return;

        const allFieldsValid = Array.from(form.fields.values()).every(field => field.isValid);
        form.isValid = allFieldsValid;

        // Actualizar estado del botón de submit
        const submitButton = form.element.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = !allFieldsValid;
        }
    }

    handleFormSubmit(event, formId) {
        const form = this.forms.get(formId);
        if (!form) return;

        // Validar todos los campos
        let allValid = true;
        form.fields.forEach((field, fieldId) => {
            if (!this.validateField(fieldId, formId, true)) {
                allValid = false;
            }
        });

        if (!allValid) {
            event.preventDefault();
            this.showToast('Por favor, corrige los errores en el formulario', 'error');
            
            // Hacer scroll al primer campo con error
            const firstInvalidField = form.element.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
        } else {
            // Marcar como guardado
            this.unsavedChanges.delete(formId);
            this.updateUnsavedChangesWarning();
        }
    }

    // Sistema de confirmación
    initConfirmationDialogs() {
        // Configurar enlaces y botones que requieren confirmación
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-confirm]');
            if (element) {
                e.preventDefault();
                this.showConfirmationDialog({
                    title: element.dataset.confirmTitle || '¿Estás seguro?',
                    message: element.dataset.confirm || '¿Deseas continuar con esta acción?',
                    type: element.dataset.confirmType || 'warning',
                    onConfirm: () => {
                        if (element.tagName === 'A') {
                            window.location.href = element.href;
                        } else if (element.tagName === 'BUTTON' || element.type === 'submit') {
                            element.click();
                        }
                    }
                });
            }
        });
    }

    showConfirmationDialog({ title, message, type = 'warning', onConfirm, onCancel }) {
        const overlay = document.createElement('div');
        overlay.className = 'confirmation-overlay';
        
        const iconMap = {
            warning: '⚠️',
            danger: '🚨',
            info: 'ℹ️',
            question: '❓'
        };

        overlay.innerHTML = `
            <div class="confirmation-dialog">
                <div class="confirmation-header">
                    <div class="confirmation-icon ${type}">${iconMap[type] || iconMap.warning}</div>
                    <h3 class="confirmation-title">${title}</h3>
                </div>
                <div class="confirmation-message">${message}</div>
                <div class="confirmation-actions">
                    <button class="confirmation-btn secondary" data-action="cancel">Cancelar</button>
                    <button class="confirmation-btn ${type === 'danger' ? 'danger' : 'primary'}" data-action="confirm">
                        ${type === 'danger' ? 'Eliminar' : 'Confirmar'}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        
        // Activar overlay
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        // Event listeners
        overlay.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action === 'confirm') {
                onConfirm?.();
                this.closeConfirmationDialog(overlay);
            } else if (action === 'cancel' || !e.target.closest('.confirmation-dialog')) {
                onCancel?.();
                this.closeConfirmationDialog(overlay);
            }
        });

        // Tecla ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                onCancel?.();
                this.closeConfirmationDialog(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        this.confirmationDialogs.push(overlay);
        return overlay;
    }

    closeConfirmationDialog(overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            const index = this.confirmationDialogs.indexOf(overlay);
            if (index > -1) {
                this.confirmationDialogs.splice(index, 1);
            }
        }, 300);
    }

    // Sistema de autoguardado
    initAutoSave() {
        // Configurar autoguardado para formularios marcados
        document.querySelectorAll('[data-autosave]').forEach(form => {
            const formId = form.id;
            if (formId && this.forms.has(formId)) {
                this.setupAutoSave(formId, parseInt(form.dataset.autosave) || 30000);
            }
        });
    }

    setupAutoSave(formId, interval = 30000) {
        const form = this.forms.get(formId);
        if (!form) return;

        // Crear indicador de autoguardado
        this.createAutoSaveIndicator(form.element);

        // No iniciar timer inmediatamente
        form.autoSaveInterval = interval;
    }

    startAutoSave(formId) {
        if (this.autoSaveTimers.has(formId)) {
            clearTimeout(this.autoSaveTimers.get(formId));
        }

        const form = this.forms.get(formId);
        if (!form?.autoSaveInterval) return;

        const timer = setTimeout(() => {
            this.performAutoSave(formId);
        }, form.autoSaveInterval);

        this.autoSaveTimers.set(formId, timer);
    }

    createAutoSaveIndicator(formElement) {
        if (formElement.querySelector('.auto-save-indicator')) return;

        const indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator';
        indicator.innerHTML = `
            <span class="auto-save-icon">💾</span>
            <span class="auto-save-text">Cambios guardados</span>
        `;
        
        formElement.insertBefore(indicator, formElement.firstChild);
    }

    performAutoSave(formId) {
        const form = this.forms.get(formId);
        if (!form) return;

        const indicator = form.element.querySelector('.auto-save-indicator');
        
        // Mostrar estado de guardando
        if (indicator) {
            indicator.className = 'auto-save-indicator saving';
            indicator.querySelector('.auto-save-text').textContent = 'Guardando...';
        }

        // Simular guardado (en una aplicación real, esto sería una llamada AJAX)
        setTimeout(() => {
            // Marcar como guardado
            this.unsavedChanges.delete(formId);
            this.updateUnsavedChangesWarning();
            
            if (indicator) {
                indicator.className = 'auto-save-indicator saved';
                indicator.querySelector('.auto-save-text').textContent = 'Cambios guardados';
                
                // Volver al estado normal después de 3 segundos
                setTimeout(() => {
                    indicator.className = 'auto-save-indicator';
                }, 3000);
            }
        }, 1000);
    }

    // Sistema de advertencia de navegación
    initNavigationWarning() {
        window.addEventListener('beforeunload', (e) => {
            if (this.unsavedChanges.size > 0) {
                e.preventDefault();
                e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
                return e.returnValue;
            }
        });
    }

    updateUnsavedChangesWarning() {
        let warning = document.querySelector('.unsaved-changes-warning');
        
        if (this.unsavedChanges.size > 0) {
            if (!warning) {
                warning = document.createElement('div');
                warning.className = 'unsaved-changes-warning';
                warning.innerHTML = `
                    <div class="unsaved-changes-content">
                        <div class="unsaved-changes-icon">⚠️</div>
                        <div class="unsaved-changes-text">Tienes cambios sin guardar</div>
                    </div>
                `;
                document.body.appendChild(warning);
            }
            
            requestAnimationFrame(() => {
                warning.classList.add('show');
            });
        } else if (warning) {
            warning.classList.remove('show');
        }
    }

    // Sistema de drag and drop
    initFileDropZones() {
        document.querySelectorAll('.file-drop-zone').forEach(zone => {
            this.setupFileDropZone(zone);
        });
    }

    setupFileDropZone(zone) {
        const allowedTypes = zone.dataset.allowedTypes?.split(',') || [];
        const maxSize = parseInt(zone.dataset.maxSize) || 10 * 1024 * 1024; // 10MB default

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!zone.contains(e.relatedTarget)) {
                zone.classList.remove('dragover');
            }
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            this.handleFileUpload(zone, files, allowedTypes, maxSize);
        });

        // También manejar click para seleccionar archivos
        zone.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = zone.hasAttribute('multiple');
            if (allowedTypes.length > 0) {
                input.accept = allowedTypes.join(',');
            }
            
            input.addEventListener('change', () => {
                if (input.files.length > 0) {
                    this.handleFileUpload(zone, Array.from(input.files), allowedTypes, maxSize);
                }
            });
            
            input.click();
        });
    }

    handleFileUpload(zone, files, allowedTypes, maxSize) {
        const errors = [];
        
        files.forEach(file => {
            // Validar tipo
            if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
                errors.push(`${file.name}: Tipo de archivo no permitido`);
                return;
            }
            
            // Validar tamaño
            if (file.size > maxSize) {
                errors.push(`${file.name}: Archivo demasiado grande`);
                return;
            }
        });

        if (errors.length > 0) {
            zone.classList.add('error');
            this.showToast(errors.join('\n'), 'error');
            setTimeout(() => zone.classList.remove('error'), 3000);
        } else {
            // Procesar archivos válidos
            this.showToast(`${files.length} archivo(s) cargado(s) correctamente`, 'success');
            // Aquí se procesarían los archivos
        }
    }

    bindGlobalEventListeners() {
        // Cerrar tooltips al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.help-tooltip')) {
                document.querySelectorAll('.tooltip-content').forEach(tooltip => {
                    tooltip.style.opacity = '0';
                    tooltip.style.visibility = 'hidden';
                });
            }
        });
    }

    // Métodos de utilidad
    showToast(message, type = 'info') {
        if (window.systemStatusManager) {
            window.systemStatusManager.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // API pública
    validateForm(formId) {
        const form = this.forms.get(formId);
        if (!form) return false;

        let allValid = true;
        form.fields.forEach((field, fieldId) => {
            if (!this.validateField(fieldId, formId, true)) {
                allValid = false;
            }
        });

        return allValid;
    }

    addCustomValidator(name, validatorFn) {
        this.validationRules[name] = validatorFn;
    }

    markAsSaved(formId) {
        this.unsavedChanges.delete(formId);
        this.updateUnsavedChangesWarning();
    }

    hasUnsavedChanges() {
        return this.unsavedChanges.size > 0;
    }

    /**
     * Habilita el autoguardado global para formularios
     * Método que se estaba llamando pero no existía - CORREGIDO Y MEJORADO
     */
    enableAutoSave(options = {}) {
        console.log('💾 ErrorPreventionManager: enableAutoSave called', { options });
        
        // Configuración por defecto
        const config = {
            interval: options.interval || 30000, // 30 segundos por defecto
            includeAllForms: options.includeAllForms !== false, // true por defecto
            showIndicator: options.showIndicator !== false, // true por defecto
            persistChanges: options.persistChanges !== false, // true por defecto
            excludeSelectors: options.excludeSelectors || [], // formularios a excluir
            onAutoSave: options.onAutoSave || null, // callback personalizado
            debugMode: options.debugMode || false,
            ...options
        };
        
        try {
            let enabledForms = 0;
            
            // Habilitar autoguardado para todos los formularios registrados
            this.forms.forEach((form, formId) => {
                // Verificar si el formulario debe ser excluido
                const shouldExclude = config.excludeSelectors.some(selector => 
                    form.element.matches(selector)
                );
                
                if (!shouldExclude && !form.autoSaveInterval) {
                    // Configurar intervalo de autoguardado personalizado
                    this.setupAutoSave(formId, config.interval);
                    
                    // Configurar callback personalizado si se proporciona
                    if (config.onAutoSave) {
                        form.customAutoSaveCallback = config.onAutoSave;
                    }
                    
                    enabledForms++;
                    if (config.debugMode) {
                        console.log(`✅ Auto-save enabled for form: ${formId} (interval: ${config.interval}ms)`);
                    }
                }
            });
            
            // Buscar formularios existentes que no estén registrados aún
            if (config.includeAllForms) {
                const unregisteredForms = document.querySelectorAll('form:not([data-autosave-registered])');
                unregisteredForms.forEach(form => {
                    const shouldExclude = config.excludeSelectors.some(selector => 
                        form.matches(selector)
                    );
                    
                    if (!shouldExclude) {
                        // Asignar ID si no tiene
                        if (!form.id) {
                            form.id = `form-autosave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        }
                        
                        // Registrar y configurar autoguardado
                        this.setupFormValidation(form);
                        this.setupAutoSave(form.id, config.interval);
                        form.setAttribute('data-autosave-registered', 'true');
                        
                        enabledForms++;
                        if (config.debugMode) {
                            console.log(`✅ Auto-save enabled for unregistered form: ${form.id}`);
                        }
                    }
                });
            }
            
            // Configurar observer para formularios que se agreguen dinámicamente
            this.setupAutoSaveObserver(config);
            
            // Configurar indicador global de autoguardado si está habilitado
            if (config.showIndicator) {
                this.setupGlobalAutoSaveIndicator(enabledForms, config);
            }
            
            // Guardar configuración para uso futuro
            this.autoSaveConfig = config;
            
            // Guardar estado en localStorage si está habilitado
            if (config.persistChanges) {
                this.saveAutoSaveState({
                    enabled: true,
                    config: config,
                    enabledAt: Date.now()
                });
            }
            
            // Mostrar toast de confirmación
            this.showToast(
                `Autoguardado habilitado para ${enabledForms} formulario${enabledForms !== 1 ? 's' : ''}`, 
                'success'
            );
            
            console.log(`✅ Global auto-save enabled successfully for ${enabledForms} forms`);
            return { success: true, enabledForms, config };
            
        } catch (error) {
            console.warn('⚠️ Error enabling auto-save:', error);
            this.showToast('Error al habilitar autoguardado', 'error');
            return { success: false, error: error.message };
        }
    }

    /**
     * Guarda el estado del autoguardado en localStorage
     */
    saveAutoSaveState(state) {
        try {
            localStorage.setItem('errorPreventionManager_autoSaveState', JSON.stringify(state));
        } catch (error) {
            console.warn('No se pudo guardar el estado del autoguardado:', error);
        }
    }

    /**
     * Carga el estado del autoguardado desde localStorage
     */
    loadAutoSaveState() {
        try {
            const stored = localStorage.getItem('errorPreventionManager_autoSaveState');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.warn('No se pudo cargar el estado del autoguardado:', error);
            return null;
        }
    }

    /**
     * Restaura el autoguardado desde el estado guardado
     */
    restoreAutoSaveState() {
        const savedState = this.loadAutoSaveState();
        if (savedState && savedState.enabled) {
            console.log('🔄 Restoring auto-save from saved state');
            this.enableAutoSave(savedState.config);
        }
    }

    /**
     * Configura observador para formularios que se agreguen dinámicamente
     */
    setupAutoSaveObserver(config = {}) {
        // Evitar múltiples observers
        if (this.autoSaveObserver) {
            this.autoSaveObserver.disconnect();
        }
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Buscar formularios en el nodo agregado
                        const forms = node.tagName === 'FORM' ? [node] : 
                                     node.querySelectorAll ? Array.from(node.querySelectorAll('form')) : [];
                        
                        forms.forEach((form) => {
                            // Verificar si ya está registrado o debe ser excluido
                            const shouldExclude = config.excludeSelectors && config.excludeSelectors.some(selector => 
                                form.matches(selector)
                            );
                            
                            if (!shouldExclude && form.id && !this.forms.has(form.id) && !form.hasAttribute('data-autosave-registered')) {
                                this.setupFormValidation(form);
                                this.setupAutoSave(form.id, config.interval || 30000);
                                form.setAttribute('data-autosave-registered', 'true');
                                
                                if (config.debugMode) {
                                    console.log(`✅ Auto-save enabled for dynamic form: ${form.id}`);
                                }
                            }
                        });
                        
                        // También buscar inputs individuales que puedan necesitar autoguardado
                        const inputs = node.querySelectorAll ? Array.from(node.querySelectorAll('input[data-autosave], textarea[data-autosave], select[data-autosave]')) : [];
                        inputs.forEach((input) => {
                            const form = input.closest('form');
                            if (form && !form.hasAttribute('data-autosave-registered')) {
                                if (!form.id) {
                                    form.id = `form-autosave-dynamic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                                }
                                this.setupFormValidation(form);
                                this.setupAutoSave(form.id, config.interval || 30000);
                                form.setAttribute('data-autosave-registered', 'true');
                                
                                if (config.debugMode) {
                                    console.log(`✅ Auto-save enabled for form with autosave inputs: ${form.id}`);
                                }
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
        
        this.autoSaveObserver = observer;
        console.log('🔍 Auto-save observer configured for dynamic forms');
    }

    /**
     * Configura indicador global de estado de autoguardado
     */
    setupGlobalAutoSaveIndicator(enabledForms, config) {
        // Verificar si ya existe un indicador global
        if (document.querySelector('.global-autosave-status')) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'global-autosave-status';
        indicator.innerHTML = `
            <div class="autosave-status-content">
                <span class="autosave-icon">💾</span>
                <span class="autosave-text">Autoguardado activo para ${enabledForms} formulario${enabledForms !== 1 ? 's' : ''}</span>
            </div>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 128, 0, 0.1);
            border: 1px solid rgba(0, 128, 0, 0.3);
            color: #006400;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(indicator);
        
        // Mostrar brevemente para confirmar que está activo
        setTimeout(() => {
            indicator.style.opacity = '1';
            indicator.style.transform = 'translateY(0)';
        }, 100);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(10px)';
        }, 3000);
        
        this.globalAutoSaveIndicator = indicator;
    }

    /**
     * Desactiva el autoguardado global
     */
    disableAutoSave(options = {}) {
        console.log('💾 ErrorPreventionManager: disableAutoSave called', { options });
        
        const config = {
            clearSavedState: options.clearSavedState !== false, // true por defecto
            showConfirmation: options.showConfirmation || false,
            onDisabled: options.onDisabled || null,
            debugMode: options.debugMode || false,
            ...options
        };
        
        try {
            let disabledForms = 0;
            
            // Detener todos los timers de autoguardado
            this.autoSaveTimers.forEach((timer, formId) => {
                clearTimeout(timer);
                disabledForms++;
                if (config.debugMode) {
                    console.log(`🛑 Auto-save disabled for form: ${formId}`);
                }
            });
            this.autoSaveTimers.clear();
            
            // Limpiar callbacks personalizados
            this.forms.forEach((form) => {
                if (form.customAutoSaveCallback) {
                    delete form.customAutoSaveCallback;
                }
                if (form.element) {
                    form.element.removeAttribute('data-autosave-registered');
                }
            });
            
            // Desconectar el observer
            if (this.autoSaveObserver) {
                this.autoSaveObserver.disconnect();
                this.autoSaveObserver = null;
                console.log('🔍 Auto-save observer disconnected');
            }
            
            // Remover indicador global
            if (this.globalAutoSaveIndicator && this.globalAutoSaveIndicator.parentNode) {
                this.globalAutoSaveIndicator.style.opacity = '0';
                this.globalAutoSaveIndicator.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    if (this.globalAutoSaveIndicator && this.globalAutoSaveIndicator.parentNode) {
                        this.globalAutoSaveIndicator.parentNode.removeChild(this.globalAutoSaveIndicator);
                    }
                }, 300);
                this.globalAutoSaveIndicator = null;
            }
            
            // Limpiar configuración
            this.autoSaveConfig = null;
            
            // Limpiar estado guardado si se solicita
            if (config.clearSavedState) {
                try {
                    localStorage.removeItem('errorPreventionManager_autoSaveState');
                } catch (error) {
                    console.warn('No se pudo limpiar el estado guardado:', error);
                }
            }
            
            // Mostrar confirmación si se solicita
            if (config.showConfirmation) {
                this.showToast(
                    `Autoguardado deshabilitado para ${disabledForms} formulario${disabledForms !== 1 ? 's' : ''}`, 
                    'info'
                );
            }
            
            // Ejecutar callback personalizado
            if (config.onDisabled) {
                config.onDisabled({ disabledForms });
            }
            
            console.log(`🛑 Global auto-save disabled for ${disabledForms} forms`);
            return { success: true, disabledForms };
            
        } catch (error) {
            console.warn('⚠️ Error disabling auto-save:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.errorPreventionManager = new ErrorPreventionManager();
    });
} else {
    window.errorPreventionManager = new ErrorPreventionManager();
}

// Exportar para uso global
window.ErrorPreventionManager = ErrorPreventionManager; 