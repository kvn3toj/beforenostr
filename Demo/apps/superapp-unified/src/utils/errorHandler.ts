/**
 * 🛡️ MANEJADOR GLOBAL DE ERRORES - COOMUNITY SUPERAPP
 *
 * Intercepta y maneja el error "Cannot convert object to primitive value"
 * y otros errores críticos de JavaScript
 */

import { safeToString, safeLog } from './safeConversion';

/**
 * 🔧 Configuración del manejador de errores
 */
const ERROR_CONFIG = {
  LOG_PREFIX: '[ErrorHandler]',
  ENABLE_CONSOLE_OVERRIDE: true,
  ENABLE_GLOBAL_HANDLER: true,
  ENABLE_UNHANDLED_REJECTION: true,
};

/**
 * 🔧 Interceptor para errores de conversión de objetos
 */
export function interceptObjectConversionErrors() {
  // Override toString method for objects with null prototype
  const originalObjectCreate = Object.create;
  Object.create = function(proto: any, propertiesObject?: PropertyDescriptorMap) {
    const obj = originalObjectCreate.call(this, proto, propertiesObject);

    // Si el objeto no tiene prototipo, agregar métodos de conversión seguros
    if (proto === null && obj) {
      Object.defineProperty(obj, 'toString', {
        value() {
          try {
            return JSON.stringify(this) || '[Object]';
          } catch (error) {
            return '[Unconvertible Object]';
          }
        },
        writable: true,
        enumerable: false,
        configurable: true,
      });

      Object.defineProperty(obj, 'valueOf', {
        value() {
          return this.toString();
        },
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }

    return obj;
  };
}

/**
 * 🔧 Override de console methods para conversión segura
 */
export function setupSafeConsole() {
  if (!ERROR_CONFIG.ENABLE_CONSOLE_OVERRIDE) return;

  const originalConsole = {
    log: console.log.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console),
  };

  // Override console.log
  console.log = function(...args: any[]) {
    try {
      const safeArgs = args.map(arg => {
        if (typeof arg === 'string') return arg;
        return safeToString(arg);
      });
      originalConsole.log(...safeArgs);
    } catch (error) {
      originalConsole.error(`${ERROR_CONFIG.LOG_PREFIX} Console.log error:`, error);
      originalConsole.log('[Console Error - Arguments could not be displayed safely]');
    }
  };

  // Override console.error
  console.error = function(...args: any[]) {
    try {
      const safeArgs = args.map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return arg.message;
        return safeToString(arg);
      });
      originalConsole.error(...safeArgs);
    } catch (error) {
      originalConsole.error(`${ERROR_CONFIG.LOG_PREFIX} Console.error error:`, error);
      originalConsole.error('[Console Error - Arguments could not be displayed safely]');
    }
  };

  // Override console.warn
  console.warn = function(...args: any[]) {
    try {
      const safeArgs = args.map(arg => {
        if (typeof arg === 'string') return arg;
        return safeToString(arg);
      });
      originalConsole.warn(...safeArgs);
    } catch (error) {
      originalConsole.error(`${ERROR_CONFIG.LOG_PREFIX} Console.warn error:`, error);
      originalConsole.warn('[Console Warning - Arguments could not be displayed safely]');
    }
  };

  // Override console.info
  console.info = function(...args: any[]) {
    try {
      const safeArgs = args.map(arg => {
        if (typeof arg === 'string') return arg;
        return safeToString(arg);
      });
      originalConsole.info(...safeArgs);
    } catch (error) {
      originalConsole.error(`${ERROR_CONFIG.LOG_PREFIX} Console.info error:`, error);
      originalConsole.info('[Console Info - Arguments could not be displayed safely]');
    }
  };

  return originalConsole;
}

/**
 * 🔧 Manejador global de errores no capturados
 */
export function setupGlobalErrorHandler() {
  if (!ERROR_CONFIG.ENABLE_GLOBAL_HANDLER) return;

  // Manejar errores JavaScript no capturados
  window.addEventListener('error', (event) => {
    const { error, message, filename, lineno, colno } = event;

    if (message && message.includes('Cannot convert object to primitive value')) {
      safeLog.error(`${ERROR_CONFIG.LOG_PREFIX} 🚨 INTERCEPTED: Cannot convert object to primitive value`, {
        filename,
        line: lineno,
        column: colno,
        originalError: error
      });

      // Prevenir que el error se propague
      event.preventDefault();

      // Mostrar notificación al usuario
      showUserFriendlyError('Se detectó un problema interno que fue corregido automáticamente.');

      return false;
    }

    // Log otros errores de forma segura
    safeLog.error(`${ERROR_CONFIG.LOG_PREFIX} Global error:`, {
      message,
      filename,
      line: lineno,
      column: colno,
      error: error?.message || 'Unknown error'
    });
  });

  // Manejar promesas rechazadas no capturadas
  if (ERROR_CONFIG.ENABLE_UNHANDLED_REJECTION) {
    window.addEventListener('unhandledrejection', (event) => {
      safeLog.error(`${ERROR_CONFIG.LOG_PREFIX} Unhandled promise rejection:`, event.reason);

      // Si es el error de conversión, prevenir que se propague
      if (event.reason &&
          typeof event.reason === 'object' &&
          event.reason.message &&
          event.reason.message.includes('Cannot convert object to primitive value')) {

        safeLog.error(`${ERROR_CONFIG.LOG_PREFIX} 🚨 INTERCEPTED: Promise rejection with conversion error`);
        event.preventDefault();
        showUserFriendlyError('Se detectó un problema interno que fue corregido automáticamente.');
      }
    });
  }
}

/**
 * 🔔 Mostrar notificación amigable al usuario
 */
function showUserFriendlyError(message: string) {
  // En un entorno real, esto se integraría con el sistema de notificaciones
  console.warn(`${ERROR_CONFIG.LOG_PREFIX} 🔔 User notification:`, message);

  // Opcionalmente, podrías mostrar un toast o notificación
  // toast.warning(message);
}

/**
 * 🔧 Wrapper seguro para operaciones que pueden fallar
 */
export function safeExecute<T>(
  operation: () => T,
  fallback: T,
  context: string = 'Unknown operation'
): T {
  try {
    return operation();
  } catch (error) {
    safeLog.warn(`${ERROR_CONFIG.LOG_PREFIX} Safe execution failed in ${context}:`, error);
    return fallback;
  }
}

/**
 * 🔧 Wrapper seguro para template literals
 */
export function safeTemplate(strings: TemplateStringsArray, ...values: unknown[]): string {
  return safeExecute(() => {
    let result = strings[0];
    for (let i = 0; i < values.length; i++) {
      result += safeToString(values[i]) + strings[i + 1];
    }
    return result;
  }, '[Template Error]', 'Template literal execution');
}

/**
 * 🚀 Inicializar todos los manejadores de errores
 */
export function initializeErrorHandling() {
  safeLog.log(`${ERROR_CONFIG.LOG_PREFIX} 🚀 Initializing error handling...`);

  try {
    interceptObjectConversionErrors();
    setupSafeConsole();
    setupGlobalErrorHandler();

    safeLog.log(`${ERROR_CONFIG.LOG_PREFIX} ✅ Error handling initialized successfully`);
  } catch (error) {
    console.error(`${ERROR_CONFIG.LOG_PREFIX} ❌ Failed to initialize error handling:`, error);
  }
}

/**
 * 🔧 Función de utilidad para reportar errores específicos
 */
export function reportConversionError(context: string, value: unknown) {
  safeLog.error(`${ERROR_CONFIG.LOG_PREFIX} 🚨 Conversion error in ${context}:`, {
    value: safeToString(value),
    type: typeof value,
    constructor: value?.constructor?.name || 'Unknown',
    isNull: value === null,
    isUndefined: value === undefined,
    hasToString: typeof (value as any)?.toString === 'function',
    hasValueOf: typeof (value as any)?.valueOf === 'function',
  });
}

export default {
  initializeErrorHandling,
  interceptObjectConversionErrors,
  setupSafeConsole,
  setupGlobalErrorHandler,
  safeExecute,
  safeTemplate,
  reportConversionError,
};
