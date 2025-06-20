/**
 * 🔑 CONSTANTES DE AUTENTICACIÓN - COOMUNITY SUPERAPP
 * 
 * Estas constantes definen las claves canónicas para el almacenamiento
 * de tokens y datos de usuario en localStorage, asegurando consistencia
 * en toda la aplicación.
 */

// 🎯 Claves principales de localStorage
export const AUTH_STORAGE_KEYS = {
  /** Token JWT principal de autenticación */
  TOKEN: 'COOMUNITY_AUTH_TOKEN',
  
  /** Datos del usuario autenticado */
  USER: 'COOMUNITY_USER_DATA',
  
  /** Token de refresh (si se implementa en el futuro) */
  REFRESH_TOKEN: 'COOMUNITY_REFRESH_TOKEN',
} as const;

// 🔒 Configuración de seguridad
export const AUTH_CONFIG = {
  /** Tiempo de expiración del token en milisegundos (24 horas) */
  TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000,
  
  /** Prefijo para logs de autenticación */
  LOG_PREFIX: '[CoomÜnity Auth]',
  
  /** Nombre del evento personalizado para expiración de sesión */
  SESSION_EXPIRED_EVENT: 'coomunity-auth-expired',
} as const;

// 🧪 Configuración para testing
export const TEST_CONFIG = {
  /** Token mock para testing */
  MOCK_TOKEN: 'mock-jwt-token-for-coomunity-testing',
  
  /** Usuario mock para testing */
  MOCK_USER_ID: 'mock-coomunity-user-id',
} as const;

// 📱 Configuración de la aplicación
export const APP_CONFIG = {
  /** Nombre de la aplicación */
  APP_NAME: 'CoomÜnity SuperApp',
  
  /** Versión de la API de autenticación */
  AUTH_API_VERSION: 'v1',
} as const; 