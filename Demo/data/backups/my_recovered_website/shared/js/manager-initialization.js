/**
 * ================================================
 * MANAGER INITIALIZATION SYSTEM
 * Sistema de inicialización segura para managers globales
 * ================================================ */

class ManagerInitializationSystem {
    constructor() {
        this.managers = new Map();
        this.pendingCalls = new Map();
        this.initPromises = new Map();
        this.readyCallbacks = [];
        this.isReady = false;
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        
        console.log('🚀 ManagerInitializationSystem initialized');
        this.init();
    }

    init() {
        // Configurar managers esperados
        this.registerExpectedManagers();
        
        // Iniciar verificación de managers
        this.startManagerDetection();
        
        // Configurar evento de DOM listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }
    }

    registerExpectedManagers() {
        const expectedManagers = [
            {
                name: 'errorPreventionManager',
                className: 'ErrorPreventionManager',
                scriptPath: '/shared/js/error-prevention-manager.js',
                priority: 1,
                methods: ['enableAutoSave', 'validateForm', 'markAsSaved', 'hasUnsavedChanges']
            },
            {
                name: 'visualHierarchyManager',
                className: 'VisualHierarchyManager',
                scriptPath: '/shared/js/visual-hierarchy-manager.js',
                priority: 2,
                methods: ['updateHierarchyUI', 'setupIntersectionObserver', 'highlightElement']
            },
            {
                name: 'helpDocumentationManager',
                className: 'HelpDocumentationManager',
                scriptPath: '/shared/js/help-documentation-manager.js',
                priority: 3,
                methods: ['showBasicHints', 'openHelpPanel', 'startMainTutorial']
            },
            {
                name: 'systemStatusManager',
                className: 'SystemStatusManager',
                scriptPath: '/shared/js/system-status-manager.js',
                priority: 4,
                methods: ['showToast', 'updateSystemStatus', 'checkConnectivity']
            },
            {
                name: 'flexibilityManager',
                className: 'FlexibilityManager',
                scriptPath: '/shared/js/flexibility-manager.js',
                priority: 5,
                methods: ['showShortcutsHelp', 'enableAccessibilityMode']
            }
        ];

        expectedManagers.forEach(manager => {
            this.managers.set(manager.name, {
                ...manager,
                isReady: false,
                instance: null,
                loadStartTime: null
            });
            this.pendingCalls.set(manager.name, []);
            this.retryAttempts.set(manager.name, 0);
        });
    }

    startManagerDetection() {
        // Verificar cada 100ms si los managers están disponibles
        const checkInterval = setInterval(() => {
            let allReady = true;
            
            this.managers.forEach((manager, managerName) => {
                if (!manager.isReady && window[managerName]) {
                    this.markManagerAsReady(managerName, window[managerName]);
                } else if (!manager.isReady) {
                    allReady = false;
                }
            });

            if (allReady) {
                clearInterval(checkInterval);
                this.onAllManagersReady();
            }
        }, 100);

        // Timeout de seguridad - después de 10 segundos, proceder con los managers disponibles
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!this.isReady) {
                console.warn('⚠️ Some managers may not be ready, proceeding with available ones');
                this.onAllManagersReady();
            }
        }, 10000);
    }

    markManagerAsReady(managerName, instance) {
        const manager = this.managers.get(managerName);
        if (manager) {
            manager.isReady = true;
            manager.instance = instance;
            
            console.log(`✅ Manager ready: ${managerName}`);
            
            // Ejecutar llamadas pendientes
            this.executePendingCalls(managerName);
        }
    }

    executePendingCalls(managerName) {
        const pendingCalls = this.pendingCalls.get(managerName) || [];
        const manager = this.managers.get(managerName);
        
        if (manager && manager.instance && pendingCalls.length > 0) {
            console.log(`🔄 Executing ${pendingCalls.length} pending calls for ${managerName}`);
            
            pendingCalls.forEach(call => {
                try {
                    if (typeof manager.instance[call.method] === 'function') {
                        const result = manager.instance[call.method](...call.args);
                        if (call.resolve) call.resolve(result);
                    } else {
                        console.warn(`⚠️ Method ${call.method} not found in ${managerName}`);
                        if (call.reject) call.reject(new Error(`Method ${call.method} not found`));
                    }
                } catch (error) {
                    console.error(`❌ Error executing ${managerName}.${call.method}:`, error);
                    if (call.reject) call.reject(error);
                }
            });
            
            // Limpiar llamadas pendientes
            this.pendingCalls.set(managerName, []);
        }
    }

    onAllManagersReady() {
        this.isReady = true;
        console.log('🎉 All managers are ready!');
        
        // Ejecutar callbacks de ready
        this.readyCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('❌ Error in ready callback:', error);
            }
        });
        
        // Limpiar callbacks
        this.readyCallbacks = [];
        
        // Disparar evento global
        window.dispatchEvent(new CustomEvent('managersReady', {
            detail: { managers: Array.from(this.managers.keys()) }
        }));
    }

    onDOMReady() {
        console.log('📄 DOM is ready, initializing critical managers...');
        
        // Intentar cargar scripts críticos si no están disponibles
        this.loadMissingScripts();
    }

    loadMissingScripts() {
        this.managers.forEach((manager, managerName) => {
            if (!window[managerName] && !document.querySelector(`script[src*="${manager.scriptPath}"]`)) {
                console.log(`📥 Loading missing script for ${managerName}`);
                this.loadScript(manager.scriptPath, managerName);
            }
        });
    }

    loadScript(src, managerName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => {
                console.log(`✅ Script loaded: ${src}`);
                // Verificar si el manager está disponible después de cargar
                setTimeout(() => {
                    if (window[managerName]) {
                        this.markManagerAsReady(managerName, window[managerName]);
                    }
                    resolve();
                }, 100);
            };
            
            script.onerror = () => {
                console.error(`❌ Failed to load script: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }

    // API pública para llamadas seguras a managers
    call(managerName, methodName, ...args) {
        return new Promise((resolve, reject) => {
            const manager = this.managers.get(managerName);
            
            if (!manager) {
                const error = new Error(`Unknown manager: ${managerName}`);
                console.warn('⚠️', error.message);
                reject(error);
                return;
            }

            if (manager.isReady && manager.instance) {
                // Manager está listo, ejecutar inmediatamente
                try {
                    if (typeof manager.instance[methodName] === 'function') {
                        const result = manager.instance[methodName](...args);
                        resolve(result);
                    } else {
                        const error = new Error(`Method ${methodName} not found in ${managerName}`);
                        console.warn('⚠️', error.message);
                        reject(error);
                    }
                } catch (error) {
                    console.error(`❌ Error calling ${managerName}.${methodName}:`, error);
                    reject(error);
                }
            } else {
                // Manager no está listo, agregar a llamadas pendientes
                console.log(`⏳ Queueing call to ${managerName}.${methodName} (manager not ready)`);
                this.pendingCalls.get(managerName).push({
                    method: methodName,
                    args: args,
                    resolve: resolve,
                    reject: reject,
                    timestamp: Date.now()
                });
            }
        });
    }

    // Método directo que intenta la llamada inmediatamente o silenciosamente falla
    tryCall(managerName, methodName, ...args) {
        const manager = this.managers.get(managerName);
        
        if (manager && manager.isReady && manager.instance) {
            try {
                if (typeof manager.instance[methodName] === 'function') {
                    return manager.instance[methodName](...args);
                } else {
                    console.warn(`⚠️ Method ${methodName} not found in ${managerName}`);
                }
            } catch (error) {
                console.error(`❌ Error calling ${managerName}.${methodName}:`, error);
            }
        } else {
            console.log(`ℹ️ ${managerName} not ready for ${methodName} call, skipping...`);
        }
        return null;
    }

    // Registrar callback para cuando todos los managers estén listos
    onReady(callback) {
        if (this.isReady) {
            callback();
        } else {
            this.readyCallbacks.push(callback);
        }
    }

    // Verificar si un manager específico está listo
    isManagerReady(managerName) {
        const manager = this.managers.get(managerName);
        return manager ? manager.isReady : false;
    }

    // Obtener instancia de un manager si está listo
    getManager(managerName) {
        const manager = this.managers.get(managerName);
        return manager && manager.isReady ? manager.instance : null;
    }

    // Método de diagnóstico
    getStatus() {
        const status = {
            isReady: this.isReady,
            managers: {},
            pendingCalls: 0
        };

        this.managers.forEach((manager, name) => {
            status.managers[name] = {
                isReady: manager.isReady,
                hasInstance: !!manager.instance,
                priority: manager.priority
            };
        });

        this.pendingCalls.forEach((calls) => {
            status.pendingCalls += calls.length;
        });

        return status;
    }
}

// Funciones globales de conveniencia
window.safeCall = function(managerName, methodName, ...args) {
    if (window.managerInit) {
        return window.managerInit.call(managerName, methodName, ...args);
    } else {
        console.warn('⚠️ Manager initialization system not available');
        return Promise.reject(new Error('Manager initialization system not available'));
    }
};

window.safeTryCall = function(managerName, methodName, ...args) {
    if (window.managerInit) {
        return window.managerInit.tryCall(managerName, methodName, ...args);
    } else {
        console.warn('⚠️ Manager initialization system not available');
        return null;
    }
};

// Inicializar el sistema
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.managerInit = new ManagerInitializationSystem();
    });
} else {
    window.managerInit = new ManagerInitializationSystem();
}

// Exportar para uso global
window.ManagerInitializationSystem = ManagerInitializationSystem; 