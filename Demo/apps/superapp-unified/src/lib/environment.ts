/**
 * 🌍 Environment Configuration
 *
 * Centralizes environment variable handling and provides smart defaults
 * for development, testing, and production environments.
 */

// Types for environment configuration
interface EnvironmentConfig {
  apiBaseUrl: string;
  baseUrl: string;
  enableMockAuth: boolean;
  enableAnalytics: boolean;
  betaTracking: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  isTesting: boolean;
  isBuilderIO: boolean;
  forceAdminMode: boolean;
  currentOrigin: string;
  backendHealthUrl: string;
}

/**
 * 🔧 Detect current environment
 */
const getEnvironmentType = (): 'development' | 'production' | 'testing' => {
  const nodeEnv = import.meta.env.NODE_ENV;
  const mode = import.meta.env.MODE;

  // Check if we're in a testing environment (unusual ports, test runners, etc.)
  const currentPort = window.location.port;
  const isUnusualPort =
    currentPort &&
    (parseInt(currentPort) > 40000 || // Very high ports often used by test runners
      parseInt(currentPort) < 1024); // System ports

  const isTestRunner =
    typeof window !== 'undefined' &&
    (window.navigator.userAgent.includes('HeadlessChrome') ||
      window.navigator.userAgent.includes('jsdom') ||
      window.location.hostname === '127.0.0.1' ||
      isUnusualPort);

  if (isTestRunner || mode === 'test') {
    return 'testing';
  }

  if (nodeEnv === 'production' || mode === 'production') {
    return 'production';
  }

  return 'development';
};

/**
 * 🏗️ Detect Builder.io environment - DESHABILITADO PARA FORZAR DATOS REALES
 */
const isBuilderIOEnvironment = (): boolean => {
  // ✅ DESHABILITADO: Siempre retornar false para forzar datos reales
  // ❌ NO detectar Builder.io - esto forzaba modo mock
  return false;
  
  // ❌ CÓDIGO ORIGINAL COMENTADO:
  // if (typeof window === 'undefined') return false;
  // 
  // const currentPort = parseInt(window.location.port);
  // const hostname = window.location.hostname;
  // 
  // // Builder.io typically uses ports in the 48000+ range
  // const isBuilderPort = currentPort >= 48000 && currentPort <= 49000;
  // 
  // // Check for Builder.io specific indicators
  // const hasBuilderIndicators = 
  //   hostname === 'localhost' && isBuilderPort ||
  //   window.location.search.includes('builder') ||
  //   window.location.search.includes('localEditUrl') ||
  //   document.querySelector('[data-builder-io]') !== null;
  // 
  // if (hasBuilderIndicators) {
  //   console.log('🏗️ Builder.io environment detected:', {
  //     port: currentPort,
  //     hostname,
  //     search: window.location.search,
  //     builderElement: !!document.querySelector('[data-builder-io]')
  //   });
  // }
  // 
  // return hasBuilderIndicators;
};

/**
 * 🎯 Smart API URL detection
 *
 * Handles different scenarios:
 * - Explicit environment variable
 * - Development default
 * - Testing environment with dynamic ports
 * - Production URLs
 * - Builder.io proxy detection
 */
const getApiBaseUrl = (): string => {
  // 1. DETECCIÓN SIMPLIFICADA - Si no estamos en puerto 3001, usar proxy
  if (typeof window !== 'undefined') {
    const currentPort = parseInt(window.location.port);
    const currentOrigin = window.location.origin;
    
    // Si NO estamos en puerto 3001 (puerto nativo de SuperApp), usar proxy
    if (currentPort !== 3001) {
      console.log('🔧 Non-native port detected, using proxy:', {
        port: currentPort,
        origin: currentOrigin,
        usingProxy: true
      });
      return '/api'; // USAR PROXY SIEMPRE que no sea puerto 3001
    }
    
    console.log('🏠 Native SuperApp port detected:', {
      port: currentPort,
      origin: currentOrigin,
      usingDirect: true
    });
  }

  // 2. Check for explicit environment variable (solo para puerto 3001)
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    console.log('🔧 Using explicit VITE_API_BASE_URL:', envApiUrl);
    return envApiUrl;
  }

  // 3. Development default (solo para puerto 3001)
  const defaultUrl = 'http://localhost:3002';
  console.log('🏠 Using development default:', defaultUrl);
  return defaultUrl;
};

/**
 * 🏠 Smart base URL detection
 */
const getBaseUrl = (): string => {
  // 1. Check for explicit environment variable
  const envBaseUrl = import.meta.env.VITE_BASE_URL;
  if (envBaseUrl && envBaseUrl !== 'undefined') {
    return envBaseUrl;
  }

  // 2. Use current origin in most cases
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 3. Fallback defaults
  const envType = getEnvironmentType();

  switch (envType) {
    case 'production':
      return 'https://app.coomunity.com';

    case 'testing':
    case 'development':
    default:
      return 'http://localhost:3001';
  }
};

/**
 * 🔍 Parse boolean environment variables safely
 */
const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean = false
): boolean => {
  if (!value || value === 'undefined') return defaultValue;
  return value.toLowerCase() === 'true';
};

/**
 * ⚙️ Create environment configuration
 */
const createEnvironmentConfig = (): EnvironmentConfig => {
  const envType = getEnvironmentType();
  const apiBaseUrl = getApiBaseUrl();
  const baseUrl = getBaseUrl();
  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : baseUrl;
  const isBuilderIO = isBuilderIOEnvironment();

  return {
    apiBaseUrl,
    baseUrl,
    enableMockAuth: parseBoolean(import.meta.env.VITE_ENABLE_MOCK_AUTH),
    enableAnalytics: parseBoolean(import.meta.env.VITE_ENABLE_ANALYTICS, true),
    betaTracking: parseBoolean(import.meta.env.VITE_BETA_TRACKING, true),
    isDevelopment: envType === 'development',
    isProduction: envType === 'production',
    isTesting: envType === 'testing',
    isBuilderIO,
    forceAdminMode: false, // ✅ DESHABILITADO: Nunca forzar modo admin - usar autenticación real
    currentOrigin,
    backendHealthUrl: `${apiBaseUrl}/health`,
  };
};

// Export the configuration
export const ENV = createEnvironmentConfig();

/**
 * 🧪 Environment helpers
 */
export const EnvironmentHelpers = {
  /**
   * Check if we're in a testing environment
   */
  isTesting: () => ENV.isTesting,

  /**
   * Check if we're in development
   */
  isDevelopment: () => ENV.isDevelopment,

  /**
   * Check if we're in production
   */
  isProduction: () => ENV.isProduction,

  /**
   * Check if we're in Builder.io
   */
  isBuilderIO: () => ENV.isBuilderIO,

  /**
   * Check if admin mode should be forced
   */
  shouldForceAdminMode: () => ENV.forceAdminMode,

  /**
   * Get current environment type
   */
  getEnvironmentType,

  /**
   * Check if mock auth should be enabled
   */
  shouldUseMockAuth: () => ENV.enableMockAuth,

  /**
   * Get appropriate timeout for API requests based on environment
   */
  getApiTimeout: () => {
    if (ENV.isTesting) return 5000; // 5s for tests
    if (ENV.isBuilderIO) return 10000; // 10s for Builder.io (puede ser más lento)
    return 8000; // 8s for normal development
  },

  /**
   * Get debug level based on environment
   */
  getDebugLevel: () => {
    if (ENV.isProduction) return 'error';
    if (ENV.isTesting) return 'warn';
    return 'debug';
  },

  /**
   * Check if we should show debug information
   */
  shouldShowDebugInfo: () => !ENV.isProduction,

  /**
   * Get environment-specific configuration
   */
  getConfig: () => ENV,
};

// 🏗️ Builder.io specific helpers
export const BuilderIOHelpers = {
  /**
   * Get mock admin user for Builder.io
   */
  getMockAdminUser: () => ({
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@gamifier.com',
    name: 'Administrator',
    avatarUrl: null,
    roles: ['admin'],
    permissions: [
      'users:read',
      'users:write',
      'analytics:read',
      'content:write',
      'content:read',
      'admin:view_all',
      'groups:manage',
      'roles:read',
      'invitations:send',
      'wallet:manage',
      'gamification:manage',
      'roles:write'
    ]
  }),

  /**
   * Get mock admin token for Builder.io
   */
  getMockAdminToken: () => 'mock-admin-token-for-builder-io',

  /**
   * Check if we should bypass authentication
   */
  shouldBypassAuth: () => false, // ✅ DESHABILITADO: Nunca saltar autenticación - usar siempre datos reales
};

/**
 * 🚀 Initialize environment
 */
export const initializeEnvironment = () => {
  if (ENV.isBuilderIO) {
    console.log('🏗️ Builder.io environment detected - Admin mode activated');
    console.log('🔧 Configuration:', {
      apiBaseUrl: ENV.apiBaseUrl,
      baseUrl: ENV.baseUrl,
      forceAdminMode: ENV.forceAdminMode,
      currentOrigin: ENV.currentOrigin
    });
  }
};

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  initializeEnvironment();
}

/**
 * 🔧 Debug environment information
 */
if (EnvironmentHelpers.shouldShowDebugInfo()) {
  console.group('🌍 Environment Configuration');
  console.log('📊 Environment Type:', getEnvironmentType());
  console.log('🎯 API Base URL:', ENV.apiBaseUrl);
  console.log('🏠 Base URL:', ENV.baseUrl);
  console.log('🌍 Current Origin:', ENV.currentOrigin);
  console.log('🧪 Mock Auth Enabled:', ENV.enableMockAuth);
  console.log('📈 Analytics Enabled:', ENV.enableAnalytics);
  console.log('🏥 Backend Health URL:', ENV.backendHealthUrl);
  console.groupEnd();
}

export default ENV;
