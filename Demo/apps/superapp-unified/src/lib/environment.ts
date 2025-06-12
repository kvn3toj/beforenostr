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
 * 🎯 Smart API URL detection
 *
 * Handles different scenarios:
 * - Explicit environment variable
 * - Development default
 * - Testing environment with dynamic ports
 * - Production URLs
 */
const getApiBaseUrl = (): string => {
  // 1. Check for explicit environment variable
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl && envApiUrl !== 'undefined') {
    return envApiUrl;
  }

  // 2. Environment-specific defaults
  const envType = getEnvironmentType();

  switch (envType) {
    case 'production':
      return 'https://api.coomunity.com'; // Production API

    case 'testing':
      // For testing, always use localhost with standard backend port
      return 'http://localhost:3002';

    case 'development':
    default:
      return 'http://localhost:3002';
  }
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

  return {
    apiBaseUrl,
    baseUrl,
    enableMockAuth: parseBoolean(import.meta.env.VITE_ENABLE_MOCK_AUTH),
    enableAnalytics: parseBoolean(import.meta.env.VITE_ENABLE_ANALYTICS, true),
    betaTracking: parseBoolean(import.meta.env.VITE_BETA_TRACKING, true),
    isDevelopment: envType === 'development',
    isProduction: envType === 'production',
    isTesting: envType === 'testing',
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
    if (ENV.isDevelopment) return 10000; // 10s for dev
    return 15000; // 15s for production
  },

  /**
   * Check if we should log debug information
   */
  shouldLogDebug: () => ENV.isDevelopment || ENV.isTesting,

  /**
   * Get CORS-friendly headers for requests
   */
  getCorsHeaders: () => ({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Origin: ENV.currentOrigin,
  }),

  /**
   * Generate troubleshooting info for connection issues
   */
  getTroubleshootingInfo: () => ({
    environment: getEnvironmentType(),
    currentOrigin: ENV.currentOrigin,
    apiBaseUrl: ENV.apiBaseUrl,
    backendHealthUrl: ENV.backendHealthUrl,
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    timestamp: new Date().toISOString(),
    troubleshootingSteps: [
      `1. Check backend is running: npm run start:backend:dev`,
      `2. Test backend health: ${ENV.backendHealthUrl}`,
      `3. Verify CORS allows origin: ${ENV.currentOrigin}`,
      `4. Check browser network tab for details`,
      `5. Try manual test: curl -X POST ${ENV.apiBaseUrl}/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'`,
    ],
  }),
};

/**
 * 🔧 Debug environment information
 */
if (EnvironmentHelpers.shouldLogDebug()) {
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
