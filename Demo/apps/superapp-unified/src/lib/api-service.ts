/**
 * 🌐 API Service - Servicio centralizado para comunicación con el backend
 *
 * Maneja todas las llamadas HTTP al backend de CoomÜnity de manera consistente,
 * incluyendo autenticación JWT, manejo de errores, y configuración centralizada.
 */

import { ENV, EnvironmentHelpers } from './environment';

// 🔧 Configuración de la API - usando configuración inteligente de entorno
const API_BASE_URL = ENV.apiBaseUrl;
const API_TIMEOUT = EnvironmentHelpers.getApiTimeout();

// 🏷️ Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// 🔐 Interface para usuario del contexto de autenticación
interface AuthUser {
  id: string;
  email: string;
  access_token?: string;
  role?: string;
}

// 🔐 Headers de autenticación
interface RequestHeaders {
  'Content-Type': string;
  Authorization?: string;
  'X-Requested-With': string;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  /**
   * 🔑 Obtener token JWT actual
   */
  private getAuthToken(): string | null {
    try {
      // Si el mock auth está habilitado, devolver token mock
      if (EnvironmentHelpers.shouldUseMockAuth()) {
        return 'mock-jwt-token-for-testing-do-not-use-in-production';
      }

      // Primero intentar obtener el token directamente
      const token = localStorage.getItem('coomunity_token');
      if (token && token !== 'null' && token !== 'undefined') {
        return token;
      }

      // Si no hay token directo, intentar extraerlo del usuario
      const userStr = localStorage.getItem('coomunity_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.access_token || null;
      }

      return null;
    } catch (error) {
      console.warn('Error obteniendo token de autenticación:', error);
      return null;
    }
  }

  /**
   * 🎯 Crear headers para las peticiones
   */
  private createHeaders(includeAuth: boolean = true): RequestHeaders {
    const headers: RequestHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * 🚨 Manejar respuestas de error HTTP
   */
  private async handleErrorResponse(response: Response): Promise<Error> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCategory:
      | 'network'
      | 'auth'
      | 'validation'
      | 'business'
      | 'server'
      | 'unknown' = 'unknown';

    try {
      const errorBody = await response.json();
      if (errorBody.message) {
        errorMessage = errorBody.message;
      } else if (errorBody.error) {
        errorMessage = errorBody.error;
      } else if (errorBody.details) {
        errorMessage = errorBody.details;
      }
    } catch {
      // Si no se puede parsear el error como JSON, usar el status text
    }

    // Manejo específico por códigos de estado con categorización
    switch (response.status) {
      case 401:
        errorCategory = 'auth';
        // Token inválido o expirado - but in mock mode, be less aggressive
        if (!EnvironmentHelpers.shouldUseMockAuth()) {
          this.handleUnauthorized();
        }
        const authMessage = EnvironmentHelpers.shouldUseMockAuth()
          ? 'Autenticación mock - algunos endpoints pueden requerir implementación backend'
          : 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        return this.createCategorizedError(
          authMessage,
          errorCategory,
          response.status
        );

      case 403:
        errorCategory = 'auth';
        return this.createCategorizedError(
          'No tienes permisos para realizar esta acción.',
          errorCategory,
          response.status
        );

      case 404:
        errorCategory = 'business';
        // For development, be more specific about which endpoint wasn't found
        const endpoint = response.url
          ? new URL(response.url).pathname
          : 'unknown endpoint';
        const message = EnvironmentHelpers.shouldLogDebug()
          ? `Endpoint not available: ${endpoint}. This may be expected during development if the backend endpoint hasn't been implemented yet.`
          : 'Recurso no encontrado.';

        return this.createCategorizedError(
          message,
          errorCategory,
          response.status
        );

      case 422:
        errorCategory = 'validation';
        return this.createCategorizedError(
          errorMessage || 'Datos de entrada inválidos.',
          errorCategory,
          response.status
        );

      case 429:
        errorCategory = 'network';
        return this.createCategorizedError(
          'Demasiadas peticiones. Intenta más tarde.',
          errorCategory,
          response.status
        );

      case 500:
        errorCategory = 'server';
        return this.createCategorizedError(
          'Error interno del servidor. Intenta más tarde.',
          errorCategory,
          response.status
        );

      case 502:
      case 503:
      case 504:
        errorCategory = 'network';
        return this.createCategorizedError(
          'Servicio temporalmente no disponible. Intenta más tarde.',
          errorCategory,
          response.status
        );

      default:
        if (response.status >= 400 && response.status < 500) {
          errorCategory = 'business';
        } else if (response.status >= 500) {
          errorCategory = 'server';
        }
        return this.createCategorizedError(
          errorMessage,
          errorCategory,
          response.status
        );
    }
  }

  /**
   * 🏷️ Crear error categorizado con metadata adicional
   */
  private createCategorizedError(
    message: string,
    category: string,
    statusCode: number
  ): Error {
    const error = new Error(message);
    (error as any).category = category;
    (error as any).statusCode = statusCode;
    (error as any).timestamp = new Date().toISOString();
    (error as any).isRetriable = this.isRetriableError(category, statusCode);
    (error as any).userFriendly = this.isUserFriendlyError(
      category,
      statusCode
    );

    // Improve error serialization for debugging
    (error as any).toJSON = () => ({
      name: error.name,
      message: error.message,
      category,
      statusCode,
      timestamp: (error as any).timestamp,
      isRetriable: (error as any).isRetriable,
      userFriendly: (error as any).userFriendly,
      stack: error.stack,
    });

    return error;
  }

  /**
   * 🔄 Determinar si un error es reintetable
   */
  private isRetriableError(category: string, statusCode: number): boolean {
    // Errores de red y servidor son generalmente reintetables
    if (category === 'network' || category === 'server') return true;

    // Algunos códigos específicos son reintetables
    if ([408, 429, 502, 503, 504].includes(statusCode)) return true;

    // Timeout errors son reintetables
    if (statusCode === 0) return true; // Network timeout

    // Errores de autenticación, validación y business logic no son reintetables
    return false;
  }

  /**
   * 👤 Determinar si un error debe mostrarse al usuario
   */
  private isUserFriendlyError(category: string, statusCode: number): boolean {
    // Errores de validación y business logic son relevantes para el usuario
    if (category === 'validation' || category === 'business') return true;

    // Errores de autenticación son relevantes
    if (category === 'auth') return true;

    // Errores de red persistentes son relevantes
    if (category === 'network' && [429, 502, 503, 504].includes(statusCode))
      return true;

    // Errores de servidor críticos son relevantes
    if (category === 'server' && statusCode === 500) return true;

    return false;
  }

  /**
   * 📢 Sistema de notificaciones de errores
   */
  private notifyError(error: Error, endpoint: string, method: string): void {
    const errorData = {
      message: error.message,
      category: (error as any).category || 'unknown',
      statusCode: (error as any).statusCode,
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      isRetriable: (error as any).isRetriable || false,
      userFriendly: (error as any).userFriendly || false,
    };

    // En desarrollo, log detallado
    if (import.meta.env.DEV) {
      console.group(`🚨 API Error: ${method} ${endpoint}`);
      console.error('Error Details:', JSON.stringify(errorData, null, 2));
      console.error('Original Error:', error.message || error);
      console.groupEnd();
    }

    // Disparar evento personalizado para que los componentes puedan escuchar
    window.dispatchEvent(
      new CustomEvent('api-error', {
        detail: errorData,
      })
    );

    // Mostrar notificación al usuario solo si es relevante
    if (errorData.userFriendly) {
      this.showUserNotification(errorData);
    }

    // Enviar métricas de error para monitoring
    this.sendErrorMetrics(errorData);
  }

  /**
   * 🔔 Mostrar notificación al usuario
   */
  private showUserNotification(errorData: any): void {
    // Personalizar mensaje según la categoría
    let userMessage = errorData.message;
    let notificationType: 'error' | 'warning' | 'info' = 'error';

    switch (errorData.category) {
      case 'validation':
        notificationType = 'warning';
        userMessage = `Datos inválidos: ${errorData.message}`;
        break;
      case 'auth':
        notificationType = 'error';
        userMessage =
          'Problema de autenticación. Por favor, verifica tu sesión.';
        break;
      case 'network':
        notificationType = 'warning';
        userMessage = 'Problema de conexión. Verificando...';
        break;
      case 'server':
        notificationType = 'error';
        userMessage = 'Error del servidor. Nuestro equipo ha sido notificado.';
        break;
      case 'business':
        notificationType = 'info';
        break;
    }

    // Disparar evento para el sistema de notificaciones
    window.dispatchEvent(
      new CustomEvent('user-notification', {
        detail: {
          type: notificationType,
          message: userMessage,
          category: errorData.category,
          duration: errorData.category === 'validation' ? 5000 : 8000,
          actions: errorData.isRetriable
            ? [{ label: 'Reintentar', action: 'retry' }]
            : undefined,
        },
      })
    );
  }

  /**
   * 📊 Enviar métricas de error para monitoring
   */
  private sendErrorMetrics(errorData: any): void {
    // Disparar evento para el sistema de monitoring
    window.dispatchEvent(
      new CustomEvent('api-metrics', {
        detail: {
          type: 'error',
          endpoint: errorData.endpoint,
          method: errorData.method,
          statusCode: errorData.statusCode,
          category: errorData.category,
          timestamp: Date.now(),
          isRetriable: errorData.isRetriable,
        },
      })
    );
  }

  /**
   * 🔐 Manejar errores de autenticación
   */
  private handleUnauthorized(): void {
    // Limpiar tokens
    localStorage.removeItem('coomunity_token');
    localStorage.removeItem('coomunity_user');

    // Disparar evento para que la app maneje la redirección
    window.dispatchEvent(
      new CustomEvent('auth-expired', {
        detail: {
          message: 'Tu sesión ha expirado. Redirigiendo al login...',
          timestamp: Date.now(),
        },
      })
    );

    // Redireccionar después de un breve delay para mostrar el mensaje
    setTimeout(() => {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }, 2000);
  }

  /**
   * 🌐 Método principal para realizar peticiones HTTP con retry inteligente
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const maxRetries = 3;
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';

    // Configurar headers
    const headers = this.createHeaders();

    // Configurar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Disparar evento de inicio de request para métricas
      const requestStartTime = Date.now();
      window.dispatchEvent(
        new CustomEvent('api-request-start', {
          detail: { endpoint, method, timestamp: requestStartTime },
        })
      );

      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
        signal: controller.signal,
        credentials: 'include', // ✅ Incluir credenciales para CORS
        mode: 'cors', // ✅ Modo CORS explícito
      });

      clearTimeout(timeoutId);

      // Disparar evento de respuesta para métricas
      const requestDuration = Date.now() - requestStartTime;
      window.dispatchEvent(
        new CustomEvent('api-request-complete', {
          detail: {
            endpoint,
            method,
            statusCode: response.status,
            duration: requestDuration,
            success: response.ok,
            timestamp: Date.now(),
          },
        })
      );

      if (!response.ok) {
        const error = await this.handleErrorResponse(response);

        // Determinar si se debe reintentar
        const shouldRetry =
          retryCount < maxRetries && (error as any).isRetriable;

        if (shouldRetry) {
          // Calcular delay con backoff exponencial
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);

          console.warn(
            `🔄 Reintentando petición ${method} ${endpoint} en ${delay}ms (intento ${retryCount + 1}/${maxRetries})`
          );

          // Esperar antes del reintento
          await new Promise((resolve) => setTimeout(resolve, delay));

          // Reintentar recursivamente
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        // Si no se puede reintentar, notificar error y lanzar
        this.notifyError(error, endpoint, method);
        throw error;
      }

      // Parsear respuesta
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        // Verificar si la respuesta tiene formato de error del backend
        if (data.success === false) {
          const error = new Error(
            data.message || data.error || 'Error del servidor'
          );
          (error as any).category = 'business';
          (error as any).statusCode = response.status;
          this.notifyError(error, endpoint, method);
          throw error;
        }

        return data;
      } else {
        // Para respuestas no-JSON (ej. texto plano, archivos)
        return response.text() as unknown as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      // Manejar errores de red/timeout
      if (error instanceof Error) {
        let categorizedError: Error;

        if (error.name === 'AbortError') {
          // Timeout
          categorizedError = this.createCategorizedError(
            'La petición tardó demasiado en responder. Verifica tu conexión.',
            'network',
            0
          );
        } else if (error.message.includes('fetch')) {
          // Error de red
          categorizedError = this.createCategorizedError(
            'Error de conexión. Verifica tu conexión a internet.',
            'network',
            0
          );
        } else {
          // Error desconocido
          categorizedError = this.createCategorizedError(
            error.message,
            'unknown',
            0
          );
        }

        // Determinar si se debe reintentar para errores de red
        const shouldRetry =
          retryCount < maxRetries &&
          (categorizedError as any).isRetriable &&
          (error.name === 'AbortError' || error.message.includes('fetch'));

        if (shouldRetry) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);

          console.warn(
            `🔄 Reintentando petición ${method} ${endpoint} tras error de red en ${delay}ms (intento ${retryCount + 1}/${maxRetries})`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        this.notifyError(categorizedError, endpoint, method);
        throw categorizedError;
      }

      throw error;
    }
  }

  /**
   * 🟢 GET Request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * 🟠 POST Request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * 🟠 PUT Request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * 🔴 DELETE Request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * 🟣 PATCH Request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * 🔍 Health Check del backend
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    // 🧪 Si mock auth está habilitado, retornar estado mock sin consultar backend
    if ((import.meta as any).env.VITE_ENABLE_MOCK_AUTH === 'true') {
      return {
        status: 'ok-mock',
        timestamp: new Date().toISOString(),
      };
    }

    try {
      return await this.get('/health');
    } catch (error) {
      throw new Error('Backend no disponible');
    }
  }

  /**
   * 🔐 Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  }

  /**
   * 🎯 Realizar petición sin autenticación (para login, registro, etc.)
   */
  async requestWithoutAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();

    const requestOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        ...EnvironmentHelpers.getCorsHeaders(),
        ...options.headers,
      },
      mode: 'cors' as RequestMode,
      credentials: 'include' as RequestCredentials,
    };

    // Log detallado de la petición en desarrollo
    if (import.meta.env.DEV) {
      console.group(
        `🔄 API Request (No Auth): ${options.method || 'GET'} ${endpoint}`
      );
      console.log('🎯 URL:', url);
      console.log('⚙️ Base URL:', this.baseURL);
      console.log(
        '📦 Request Options:',
        JSON.stringify(requestOptions, null, 2)
      );
      console.log('🌍 Origin:', window.location.origin);
      console.log('⏱️ Timeout:', this.timeout);
      console.groupEnd();
    }

    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Enhanced pre-flight verification with better diagnostics
      if (import.meta.env.DEV) {
        console.log('🚀 Iniciando fetch request...');

        // Comprehensive backend connectivity check
        try {
          const healthCheckController = new AbortController();
          setTimeout(() => healthCheckController.abort(), 3000);

          const healthCheck = await fetch(`${this.baseURL}/health`, {
            method: 'GET',
            mode: 'cors',
            signal: healthCheckController.signal,
            headers: {
              Origin: window.location.origin,
            },
          });

          console.log('🏥 Backend health check:', {
            status: healthCheck.status,
            statusText: healthCheck.statusText,
            accessible: healthCheck.ok,
            headers: Object.fromEntries(healthCheck.headers.entries()),
            cors: healthCheck.headers.get('access-control-allow-origin'),
          });

          // Check for CORS headers specifically
          const corsOrigin = healthCheck.headers.get(
            'access-control-allow-origin'
          );
          if (
            !corsOrigin ||
            (corsOrigin !== '*' && corsOrigin !== window.location.origin)
          ) {
            console.warn(
              '⚠️ CORS Warning: Backend may not allow this origin:',
              {
                expectedOrigin: window.location.origin,
                receivedCorsOrigin: corsOrigin,
              }
            );
          }
        } catch (healthError: any) {
          console.warn('⚠️ Backend health check failed:', {
            message: healthError.message,
            name: healthError.name,
            stack: healthError.stack,
          });

          // Try OPTIONS request to diagnose CORS
          try {
            const optionsCheck = await fetch(`${this.baseURL}${endpoint}`, {
              method: 'OPTIONS',
              mode: 'cors',
              signal: AbortSignal.timeout(2000),
              headers: {
                Origin: window.location.origin,
                'Access-Control-Request-Method': options.method || 'GET',
                'Access-Control-Request-Headers': 'Content-Type,Authorization',
              },
            });

            console.log('🔍 CORS OPTIONS check:', {
              status: optionsCheck.status,
              headers: Object.fromEntries(optionsCheck.headers.entries()),
            });
          } catch (optionsError) {
            console.warn('⚠️ CORS OPTIONS check failed:', optionsError.message);
          }
        }
      }

      const response = await fetch(url, requestOptions);

      clearTimeout(timeoutId);

      if (import.meta.env.DEV) {
        console.log('📨 Response received:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          ok: response.ok,
        });
      }

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const data = await response.json();

      if (import.meta.env.DEV) {
        console.log(
          `✅ API Success (No Auth): ${options.method || 'GET'} ${endpoint}`,
          data
        );
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        const timeoutError = new Error(
          `Request timeout after ${this.timeout}ms. The backend at ${this.baseURL} may be slow or unreachable.`
        );
        (timeoutError as any).category = 'timeout';
        (timeoutError as any).troubleshooting = [
          'Check if the backend server is running',
          'Verify network connectivity',
          'Try again in a few seconds',
        ];
        console.error('⏰ Request Timeout:', timeoutError);
        throw timeoutError;
      }

      // Enhanced error handling for network connectivity issues
      if (
        error.message.includes('fetch') ||
        error.message.includes('Failed to fetch')
      ) {
        const networkError = new Error(
          `Cannot connect to backend at ${this.baseURL}. ` +
            `Please ensure the backend server is running and accessible from ${window.location.origin}. ` +
            `Original error: ${error.message}`
        );
        (networkError as any).category = 'network';
        (networkError as any).originalError = error;
        (networkError as any).troubleshooting = [
          'Start the backend server: npm run start:backend:dev',
          `Verify backend responds at: ${this.baseURL}/health`,
          `Check CORS configuration allows origin: ${window.location.origin}`,
          'Review browser network tab for detailed error information',
          'Ensure no firewall or antivirus is blocking the connection',
        ];

        // Enhanced debugging for network issues using environment helpers
        const troubleshootingInfo = EnvironmentHelpers.getTroubleshootingInfo();

        console.group(`🚨 NETWORK ERROR - Cannot connect to backend`);
        console.error('💥 Error Message:', error.message);
        console.error('🏷️ Error Type:', error.name);
        console.error('📄 Full Error:', error);
        console.error('🔗 Endpoint URL:', url);
        console.error('⚙️ Base URL:', this.baseURL);
        console.error('🌍 Environment Info:', troubleshootingInfo);

        console.error('🔧 Troubleshooting steps:');
        troubleshootingInfo.troubleshootingSteps.forEach((step, index) => {
          console.error(`   ${step}`);
        });

        // Display user-friendly error notification
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('api-connection-error', {
              detail: {
                type: 'network',
                message: 'Cannot connect to backend server',
                backendUrl: this.baseURL,
                troubleshooting: (networkError as any).troubleshooting,
                timestamp: Date.now(),
              },
            })
          );
        }

        console.groupEnd();
        throw networkError;
      }

      // Handle CORS-specific errors
      if (
        error.message.includes('CORS') ||
        error.message.includes('cross-origin')
      ) {
        const corsError = new Error(
          `CORS Error: Backend at ${this.baseURL} is not configured to allow requests from ${window.location.origin}. ` +
            `Please check the backend CORS configuration.`
        );
        (corsError as any).category = 'cors';
        (corsError as any).troubleshooting = [
          'Check backend CORS configuration',
          `Ensure ${window.location.origin} is in allowed origins`,
          'Verify Access-Control-Allow-Origin header',
          'Check that credentials are properly configured',
        ];
        throw corsError;
      }

      // Debugging exhaustivo para otros errores
      console.group(
        `❌ API Error (No Auth): ${options.method || 'GET'} ${endpoint}`
      );
      console.error('💥 Error Message:', error.message);
      console.error('🏷️ Error Type:', error.name || error.constructor.name);
      console.error('📄 Full Error:', error);
      console.error('🔗 Endpoint URL:', url);
      console.error('⚙️ Base URL:', this.baseURL);
      console.error(
        '📋 Request Options:',
        JSON.stringify(requestOptions, null, 2)
      );
      console.error('🌍 Current Origin:', window.location.origin);
      console.error('🔍 Navigator Online:', navigator.onLine);
      console.error('🌐 User Agent:', navigator.userAgent);
      console.groupEnd();

      // Add category if not already present
      if (!(error as any).category) {
        (error as any).category = 'unknown';
      }

      throw error;
    }
  }
}

// 🏭 Instancia singleton del servicio
export const apiService = new ApiService();

// 🎯 Métodos de conveniencia específicos para la aplicación

/**
 * 🔐 Servicios de Autenticación
 */
export const authAPI = {
  login: (email: string, password: string) =>
    apiService.requestWithoutAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, fullName?: string) =>
    apiService.requestWithoutAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        name: fullName,
      }),
    }),

  getCurrentUser: () => apiService.get('/auth/me'),

  updateProfile: (updates: any) => apiService.put('/auth/profile', updates),

  logout: () => apiService.post('/auth/logout'),
};

/**
 * 🎮 Servicios de Gamificación
 */
export const gameAPI = {
  getUserStats: (userId: string) => apiService.get(`/game/user/${userId}`),
  getLeaderboard: () => apiService.get('/game/leaderboard'),
  updateUserStats: (userId: string, stats: any) =>
    apiService.put(`/game/user/${userId}`, stats),
};

/**
 * 👤 Servicios de Usuario
 */
export const userAPI = {
  getProfile: (userId: string) => apiService.get(`/users/${userId}`),
  updateProfile: (userId: string, updates: any) =>
    apiService.put(`/users/${userId}`, updates),
  getUsers: () => apiService.get('/users'),
};

/**
 * 🏪 Servicios de Marketplace
 * Migrado para conectar con el backend NestJS real - Endpoint: /marketplace/items
 */
export const marketplaceAPI = {
  getItems: (filters?: any) => {
    const params = filters ? new URLSearchParams(filters).toString() : '';
    const endpoint = params ? `/marketplace/items?${params}` : '/marketplace/items';
    return apiService.get(endpoint);
  },
  getItem: (itemId: string) =>
    apiService.get(`/marketplace/items/${itemId}`),
  createItem: (item: any) =>
    apiService.post('/marketplace/items', item),
  updateItem: (itemId: string, updateData: any) =>
    apiService.put(`/marketplace/items/${itemId}`, updateData),
  deleteItem: (itemId: string) =>
    apiService.delete(`/marketplace/items/${itemId}`),
  // Mantener métodos legacy para compatibilidad durante la transición
  getProducts: (filters?: any) => marketplaceAPI.getItems(filters),
  getProduct: (productId: string) => marketplaceAPI.getItem(productId),
  createProduct: (product: any) => marketplaceAPI.createItem(product),
  updateProduct: (productId: string, updateData: any) => marketplaceAPI.updateItem(productId, updateData),
  deleteProduct: (productId: string) => marketplaceAPI.deleteItem(productId),
};

/**
 * 💰 Servicios de Wallet
 */
export const walletAPI = {
  getBalance: (userId: string) => apiService.get(`/wallets/user/${userId}`),
  getTransactions: (userId: string) =>
    apiService.get(`/wallets/user/${userId}/transactions`), // This endpoint might not exist yet
  transfer: (fromUserId: string, toUserId: string, amount: number) =>
    apiService.post('/wallets/transfer', { fromUserId, toUserId, amount }), // This endpoint might not exist yet

  // 🏆 Servicios de Méritos
  getMerits: (userId: string) => apiService.get(`/merits/user/${userId}`),
  getAllMerits: () => apiService.get('/merits'),
  getMeritsLeaderboard: (limit = 10) =>
    apiService.get(`/merits/leaderboard?limit=${limit}`),
  awardMerit: (
    userId: string,
    meritType: string,
    amount: number,
    description?: string
  ) =>
    apiService.post('/merits/award', {
      userId,
      meritType,
      amount,
      description,
    }),
  getMeritHistory: (userId: string, page = 0, limit = 20) =>
    apiService.get(
      `/merits/user/${userId}/history?page=${page}&limit=${limit}`
    ),
};

/**
 * 🤝 Servicios de Red Social/Chat
 * Migrado para conectar con el backend NestJS real
 */
export const socialAPI = {
  // Gestión de matches
  getMatches: () => {
    return apiService.get('/social/matches');
  },

  getMatch: (matchId: string) => {
    return apiService.get(`/social/matches/${matchId}`);
  },

  // Gestión de mensajes
  getMessages: (matchId: string, page = 0, limit = 50) => {
    return apiService.get(
      `/social/matches/${matchId}/messages?page=${page}&limit=${limit}`
    );
  },

  sendMessage: (
    matchId: string,
    content: string,
    type: 'text' | 'emoji' | 'audio' = 'text'
  ) => {
    return apiService.post(`/social/matches/${matchId}/messages`, {
      content,
      type,
      timestamp: new Date().toISOString(),
    });
  },

  // Estados de usuario
  updateUserStatus: (status: 'online' | 'away' | 'offline') => {
    return apiService.patch('/social/status', { status });
  },

  // Notificaciones
  getNotifications: () => {
    return apiService.get('/social/notifications');
  },

  markNotificationAsRead: (notificationId: string) => {
    return apiService.patch(`/social/notifications/${notificationId}/read`);
  },

  // 📝 Feed Social - Gestión de publicaciones
  getPosts: (page = 0, limit = 20) => {
    return apiService.get(`/social/publications?page=${page}&limit=${limit}`);
  },

  getPost: (postId: string) => {
    return apiService.get(`/social/publications/${postId}`);
  },

  createPost: (
    content: string,
    type: 'TEXT' | 'IMAGE' | 'VIDEO' = 'TEXT',
    media?: File
  ) => {
    // Para el nuevo endpoint del backend, usar JSON en lugar de FormData
    const payload: any = {
      content,
      type,
    };

    // Si hay media, por ahora solo enviamos la referencia
    // TODO: Implementar upload de media cuando el backend lo soporte
    if (media) {
      payload.mediaUrl = 'placeholder-for-media-upload';
    }

    return apiService.post('/social/publications', payload);
  },

  deletePost: (postId: string) => {
    return apiService.delete(`/social/publications/${postId}`);
  },

  // 👍 Likes en publicaciones - NUEVO: endpoint unificado para toggle
  toggleLike: (postId: string) => {
    return apiService.post(`/social/publications/${postId}/like`);
  },

  // Mantenemos estos métodos para compatibilidad, pero ahora usan el mismo endpoint
  likePost: (postId: string) => {
    return apiService.post(`/social/publications/${postId}/like`);
  },

  unlikePost: (postId: string) => {
    return apiService.post(`/social/publications/${postId}/like`);
  },

  getPostLikes: (postId: string) => {
    return apiService.get(`/social/publications/${postId}/likes`);
  },

  // 💬 Comentarios en publicaciones
  getPostComments: (postId: string, page = 0, limit = 10) => {
    return apiService.get(
      `/social/publications/${postId}/comments?page=${page}&limit=${limit}`
    );
  },

  createComment: (postId: string, content: string) => {
    // Validar inputs
    if (!postId || !content?.trim()) {
      return Promise.reject(new Error('PostId y contenido son requeridos'));
    }
    
    // Payload simplificado - solo enviar el texto requerido
    return apiService.post(`/social/publications/${postId}/comments`, {
      text: content.trim(), // El backend espera 'text' no 'content'
    });
  },

  deleteComment: (commentId: string) => {
    // NUEVO: Endpoint directo para eliminar comentario sin necesidad de postId
    return apiService.delete(`/social/comments/${commentId}`);
  },

  likeComment: (postId: string, commentId: string) => {
    return apiService.post(
      `/social/publications/${postId}/comments/${commentId}/like`
    );
  },
};

/**
 * 🔗 Servicio de WebSocket para chat en tiempo real
 */
class ChatWebSocketService {
  private socket: WebSocket | null = null;
  private matchId: string | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onMessageCallback: ((message: any) => void) | null = null;
  private onStatusCallback: ((status: string) => void) | null = null;

  connect(
    matchId: string,
    userId: string,
    onMessage?: (message: any) => void,
    onStatus?: (status: string) => void
  ) {
    this.matchId = matchId;
    this.userId = userId;
    this.onMessageCallback = onMessage || null;
    this.onStatusCallback = onStatus || null;

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/chat`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('🔗 WebSocket chat conectado');
        this.reconnectAttempts = 0;

        // Enviar información de conexión
        this.send({
          type: 'join',
          matchId: this.matchId,
          userId: this.userId,
        });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'message':
              this.onMessageCallback?.(data.message);
              break;
            case 'status':
              this.onStatusCallback?.(data.status);
              break;
            case 'user_status':
              this.onStatusCallback?.(data);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('🔌 WebSocket chat desconectado');
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('❌ Error en WebSocket chat:', error);
      };
    } catch (error) {
      console.error('Error conectando WebSocket:', error);
    }
  }

  private attemptReconnect() {
    if (
      this.reconnectAttempts < this.maxReconnectAttempts &&
      this.matchId &&
      this.userId
    ) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Reintentando conexión WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect(
          this.matchId!,
          this.userId!,
          this.onMessageCallback!,
          this.onStatusCallback!
        );
      }, 2000 * this.reconnectAttempts);
    }
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  sendMessage(content: string, type: 'text' | 'emoji' | 'audio' = 'text') {
    this.send({
      type: 'message',
      matchId: this.matchId,
      userId: this.userId,
      content,
      messageType: type,
      timestamp: new Date().toISOString(),
    });
  }

  updateStatus(status: 'online' | 'away' | 'offline') {
    this.send({
      type: 'status_update',
      matchId: this.matchId,
      userId: this.userId,
      status,
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.matchId = null;
    this.userId = null;
    this.onMessageCallback = null;
    this.onStatusCallback = null;
    this.reconnectAttempts = 0;
  }
}

export const chatWebSocketService = new ChatWebSocketService();

/**
 * 🎥 Servicios de Videos
 */
export const videosAPI = {
  getCategories: () => {
    // Intentar endpoint específico primero, pero lanzar error para fallback
    return apiService.get('/videos/categories');
  },
  getVideos: (category?: string) => {
    // Usar endpoint real que funciona
    const endpoint =
      category && category !== 'all'
        ? `/video-items?category=${encodeURIComponent(category)}`
        : '/video-items';
    return apiService.get(endpoint);
  },
  getPlaylists: () => apiService.get('/videos/playlists'),
};

/**
 * 🌍 Servicios de Mundos/Worlds
 */
export const mundosAPI = {
  // Obtener todos los mundos (endpoint simple para la SuperApp)
  getMundos: () => apiService.get('/mundos'),

  // Obtener mundo específico por ID
  getMundo: (mundoId: string) => apiService.get(`/mundos/${mundoId}`),

  // Obtener mundo por slug
  getMundoBySlug: (slug: string) => apiService.get(`/mundos/slug/${slug}`),

  // Obtener playlists de un mundo específico
  getMundoPlaylists: (mundoId: string) =>
    apiService.get(`/mundos/${mundoId}/playlists`),

  // Endpoint de test/conectividad
  testMundos: () => apiService.get('/mundos/test'),
};

/**
 * 📊 Servicios de Estadísticas y Analytics
 */
export const statsAPI = {
  getGeneralStats: () => apiService.get('/stats/general'),
  getSearchStats: () => apiService.get('/stats/search'),
  getUserStats: (userId: string) => apiService.get(`/stats/user/${userId}`),
};

/**
 * 📝 Servicios de Formularios
 */
export const formsAPI = {
  submit: (formType: string, data: any) =>
    apiService.post(`/forms/${formType}`, data),
};

/**
 * 🎫 Servicios de Invitaciones y Registro Beta
 */
export const invitationAPI = {
  // Validar código de invitación
  validateCode: (code: string) =>
    apiService.requestWithoutAuth('/invitations/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Registrar usuario con código de invitación
  registerWithInvitation: (registrationData: {
    invitationCode: string;
    email: string;
    fullName: string;
    country: string;
    experience?: string;
    motivation?: string;
    philosophyAnswers: {
      ayni: string;
      bienComun: string;
      cooperacion: string;
    };
    acceptTerms: boolean;
    joinDiscord: boolean;
  }) =>
    apiService.requestWithoutAuth('/auth/register-beta', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    }),

  // Obtener información del código de invitación
  getInvitationInfo: (code: string) =>
    apiService.requestWithoutAuth(`/invitations/info/${code}`, {
      method: 'GET',
    }),

  // Verificar disponibilidad de email para registro beta
  checkEmailAvailability: (email: string) =>
    apiService.requestWithoutAuth('/auth/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

export default apiService;
