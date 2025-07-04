/**
 * 🛡️ UTILIDADES DE CONVERSIÓN SEGURA - COOMUNITY SUPERAPP
 *
 * Previene el error "Cannot convert object to primitive value"
 * proporcionando conversiones robustas para cualquier tipo de dato
 */

/**
 * 🔧 Convierte cualquier valor a string de forma segura
 */
export function safeToString(value: unknown): string {
  // Casos null/undefined
  if (value == null) {
    return String(value); // "null" o "undefined"
  }

  // Tipos primitivos
  if (typeof value !== 'object') {
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    return String(value);
  }

  // Objetos especiales
  if (value instanceof Error) {
    return value.message || 'Error';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return `[${value.length} items]`;
  }

  // Verificar si el objeto puede convertirse de forma nativa
  try {
    // Verificar si tiene métodos de conversión
    if (typeof (value as any).toString === 'function' &&
        Object.getPrototypeOf(value) !== null) {
      const result = (value as any).toString();
      if (result !== '[object Object]') {
        return result;
      }
    }
  } catch (error) {
    // Si falla la conversión nativa, continuar con JSON
  }

  // Fallback a JSON.stringify para objetos complejos
  try {
    return JSON.stringify(value);
  } catch (jsonError) {
    // Si JSON.stringify falla (referencias circulares, etc.)
    return '[Unconvertible Object]';
  }
}

/**
 * 🔧 Convierte errores de forma segura para logging
 */
export function safeErrorToString(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    // Buscar propiedades comunes de error
    const errorObj = error as any;

    if (errorObj.message) {
      return String(errorObj.message);
    }

    if (errorObj.error) {
      return String(errorObj.error);
    }

    if (errorObj.details) {
      return String(errorObj.details);
    }
  }

  return safeToString(error);
}

/**
 * 🔧 Concatenación segura de strings con cualquier valor
 */
export function safeConcatenate(prefix: string, value: unknown, suffix: string = ''): string {
  return prefix + safeToString(value) + suffix;
}

/**
 * 🔧 Logging seguro que previene errores de conversión
 */
export const safeLog = {
  log: (message: string, ...args: unknown[]) => {
    const safeArgs = args.map(arg => safeToString(arg));
    console.log(message, ...safeArgs);
  },

  error: (message: string, ...args: unknown[]) => {
    const safeArgs = args.map(arg => safeErrorToString(arg));
    console.error(message, ...safeArgs);
  },

  warn: (message: string, ...args: unknown[]) => {
    const safeArgs = args.map(arg => safeToString(arg));
    console.warn(message, ...safeArgs);
  },

  info: (message: string, ...args: unknown[]) => {
    const safeArgs = args.map(arg => safeToString(arg));
    console.info(message, ...safeArgs);
  }
};

/**
 * 🔧 Wrapper para template literals seguros
 */
export function safeTemplate(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = strings[0];

  for (let i = 0; i < values.length; i++) {
    result += safeToString(values[i]) + strings[i + 1];
  }

  return result;
}

/**
 * 🔧 Crear mensaje de error seguro
 */
export function createSafeErrorMessage(prefix: string, error: unknown): string {
  return safeConcatenate(prefix, error);
}

/**
 * 🔧 Validar si un objeto puede convertirse de forma segura
 */
export function canConvertSafely(value: unknown): boolean {
  if (value == null || typeof value !== 'object') {
    return true;
  }

  try {
    // Verificar si tiene métodos de conversión válidos
    if (typeof (value as any).toString === 'function') {
      (value as any).toString();
      return true;
    }

    // Verificar si JSON.stringify funciona
    JSON.stringify(value);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 🔧 Wrapper para operaciones que pueden fallar por conversión
 */
export function safeOperation<T>(
  operation: () => T,
  fallback: T,
  errorMessage: string = 'Safe operation failed'
): T {
  try {
    return operation();
  } catch (error) {
    safeLog.warn(errorMessage, error);
    return fallback;
  }
}

/**
 * 🔧 Asegurar que un valor es un array válido para usar con .map()
 */
export function safeArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  
  safeLog.warn('safeArray: Expected array but received:', typeof value, value);
  return fallback;
}

/**
 * 🔧 Mapeo seguro que maneja arrays undefined/null
 */
export function safeMap<T, R>(
  array: unknown,
  mapFunction: (item: T, index: number) => R,
  fallback: R[] = []
): R[] {
  const safeArrayValue = safeArray<T>(array);
  
  if (safeArrayValue.length === 0) {
    return fallback;
  }
  
  try {
    return safeArrayValue.map(mapFunction);
  } catch (error) {
    safeLog.error('safeMap operation failed:', error);
    return fallback;
  }
}

export default {
  safeToString,
  safeErrorToString,
  safeConcatenate,
  safeLog,
  safeTemplate,
  createSafeErrorMessage,
  canConvertSafely,
  safeOperation,
  safeArray,
  safeMap,
};
