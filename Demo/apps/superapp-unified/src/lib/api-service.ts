/**
 * 🌐 API Service - Servicio centralizado para comunicación con el backend
 *
 * Maneja todas las llamadas HTTP al backend de CoomÜnity de manera consistente,
 * incluyendo autenticación JWT, manejo de errores, y configuración centralizada.
 */

import { ENV, EnvironmentHelpers } from './environment';
import { AUTH_STORAGE_KEYS, AUTH_CONFIG } from '../config/constants';

// 🔧 Configuración de la API - usando configuración inteligente de entorno
const API_BASE_URL = ENV.apiBaseUrl;
const API_TIMEOUT = 30000; // 30 segundos

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
    
    console.log('🔧 ApiService initialized with baseURL:', this.baseURL);
  }

  /**
   * 🔑 Limpiar tokens de autenticación (método público para logout)
   */
  clearAuthTokens(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
      console.log(`${AUTH_CONFIG.LOG_PREFIX} 🧹 Auth tokens cleared from localStorage`);
    } catch (error) {
      console.warn(`${AUTH_CONFIG.LOG_PREFIX} ⚠️ Failed to clear auth tokens:`, error);
    }
  }

  /**
   * 🔑 Obtener token JWT actual
   */
  private getAuthToken(): string | null {
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      
      // 📊 Debug logging mejorado
      if (!token) {
        console.log(`${AUTH_CONFIG.LOG_PREFIX} 🔑 No token found in localStorage`);
        return null;
      }

      // Basic JWT validation - check if it's not expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp && payload.exp < now) {
          console.warn(`${AUTH_CONFIG.LOG_PREFIX} 🔒 Token expired, clearing auth tokens`);
          this.clearAuthTokens();
          return null;
        }
        
        console.log(`${AUTH_CONFIG.LOG_PREFIX} 🔑 Valid token found: ${token.substring(0, 20)}...`);
        return token;
      } catch (parseError) {
        console.warn(`${AUTH_CONFIG.LOG_PREFIX} 🔒 Invalid token format, clearing auth tokens`);
        this.clearAuthTokens();
        return null;
      }
    } catch (error) {
      console.warn(`${AUTH_CONFIG.LOG_PREFIX} ⚠️ Failed to get auth token:`, error);
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
        headers.Authorization = `Bearer ${token}`;
        console.log(`${AUTH_CONFIG.LOG_PREFIX} 🔑 Authorization header set with token: ${token.substring(0, 20)}...`);
      } else {
        console.warn(`${AUTH_CONFIG.LOG_PREFIX} ⚠️ No token available for authorization header`);
      }
    } else {
      console.log(`${AUTH_CONFIG.LOG_PREFIX} 🔓 Request without authentication`);
    }

    return headers;
  }

  /**
   * 🚨 Manejar respuestas de error HTTP
   */
  private async handleErrorResponse(response: Response): Promise<Error> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData: any = null;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
        
        // Handle different error response formats
        if (errorData.message) {
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(', ');
          } else {
            errorMessage = errorData.message;
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.details) {
          errorMessage = errorData.details;
        }
      } else {
        // Handle non-JSON error responses
        const textError = await response.text();
        if (textError) {
          errorMessage = textError;
        }
      }
    } catch (parseError) {
      console.warn('⚠️ Failed to parse error response:', parseError);
      // Keep the default HTTP error message
    }

    // Categorize errors for better handling
    const category = this.categorizeError(response.status, errorMessage);
    const error = this.createCategorizedError(errorMessage, category, response.status);

    // Log error details for debugging
    console.group(`❌ API Error: ${response.status} ${response.url}`);
    console.error('📄 Error Message:', errorMessage);
    console.error('🏷️ Category:', category);
    console.error('📊 Response Data:', errorData);
    console.groupEnd();

    // Handle specific error types
    if (response.status === 401) {
      this.handleUnauthorized();
    }

    // Send error metrics (in production)
    if (import.meta.env.PROD) {
      this.sendErrorMetrics({
        status: response.status,
        message: errorMessage,
        category,
        url: response.url,
        timestamp: new Date().toISOString(),
      });
    }

    return error;
  }

  private categorizeError(status: number, message: string): string {
    if (status >= 500) return 'server_error';
    if (status === 404) return 'not_found';
    if (status === 403) return 'forbidden';
    if (status === 401) return 'unauthorized';
    if (status === 400) {
      if (message.toLowerCase().includes('validation')) return 'validation_error';
      if (message.toLowerCase().includes('duplicate')) return 'duplicate_error';
      return 'bad_request';
    }
    if (status === 429) return 'rate_limit';
    if (status === 0 || status >= 400) return 'network_error';
    return 'unknown_error';
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
    (error as any).isRetriable = this.isRetriableError(category, statusCode);
    (error as any).isUserFriendly = this.isUserFriendlyError(category, statusCode);
    return error;
  }

  /**
   * 🔄 Determinar si un error es reintetable
   */
  private isRetriableError(category: string, statusCode: number): boolean {
    const retriableCategories = ['server_error', 'network_error', 'rate_limit'];
    const retriableStatusCodes = [408, 429, 500, 502, 503, 504];
    
    return retriableCategories.includes(category) || 
           retriableStatusCodes.includes(statusCode);
  }

  /**
   * 👤 Determinar si un error debe mostrarse al usuario
   */
  private isUserFriendlyError(category: string, statusCode: number): boolean {
    const userFriendlyCategories = [
      'validation_error', 
      'duplicate_error', 
      'not_found', 
      'forbidden'
    ];
    const userFriendlyStatusCodes = [400, 403, 404, 409];
    
    return userFriendlyCategories.includes(category) || 
           userFriendlyStatusCodes.includes(statusCode);
  }

  /**
   * 📢 Sistema de notificaciones de errores
   */
  private notifyError(error: Error, endpoint: string, method: string): void {
    const errorData = {
      message: error.message,
      category: (error as any).category,
      statusCode: (error as any).statusCode,
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      isUserFriendly: (error as any).isUserFriendly,
    };

    // Show user-friendly notifications for certain errors
    if ((error as any).isUserFriendly) {
      this.showUserNotification(errorData);
    }

    // Log all errors for debugging
    console.group(`🚨 API Error Notification: ${method} ${endpoint}`);
    console.error('💥 Error:', error.message);
    console.error('🏷️ Category:', (error as any).category);
    console.error('📊 Status Code:', (error as any).statusCode);
    console.error('🔄 Is Retriable:', (error as any).isRetriable);
    console.error('👤 Is User Friendly:', (error as any).isUserFriendly);
    console.groupEnd();
  }

  /**
   * 🔔 Mostrar notificación al usuario
   */
  private showUserNotification(errorData: any): void {
    // This would integrate with your notification system
    // For now, we'll use console.warn to avoid UI dependencies
    console.warn('🔔 User Notification:', {
      title: 'Oops! Algo salió mal',
      message: this.getUserFriendlyMessage(errorData),
      type: 'error',
      duration: 5000,
    });

    // In a real implementation, you might dispatch to a notification store:
    // notificationStore.dispatch({
    //   type: 'SHOW_NOTIFICATION',
    //   payload: {
    //     title: 'Error',
    //     message: this.getUserFriendlyMessage(errorData),
    //     type: 'error',
    //   }
    // });
  }

  private getUserFriendlyMessage(errorData: any): string {
    const { category, message, statusCode } = errorData;

    switch (category) {
      case 'validation_error':
        return 'Por favor, verifica que todos los campos estén correctamente completados.';
      case 'duplicate_error':
        return 'Ya existe un registro con esa información. Por favor, intenta con datos diferentes.';
      case 'not_found':
        return 'No pudimos encontrar lo que buscas. Por favor, verifica e intenta nuevamente.';
      case 'forbidden':
        return 'No tienes permisos para realizar esta acción.';
      case 'rate_limit':
        return 'Has realizado demasiadas solicitudes. Por favor, espera un momento e intenta nuevamente.';
      case 'server_error':
        return 'Estamos experimentando problemas técnicos. Por favor, intenta más tarde.';
      case 'network_error':
        return 'Problema de conexión. Por favor, verifica tu internet e intenta nuevamente.';
      default:
        return message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
    }
  }

  /**
   * 📊 Enviar métricas de error para monitoring
   */
  private sendErrorMetrics(errorData: any): void {
    // This would send error metrics to your analytics service
    // For now, we'll just log it
    console.log('📊 Error Metrics:', errorData);

    // In a real implementation:
    // analytics.track('api_error', errorData);
  }

  /**
   * 🔐 Manejar errores de autenticación
   */
  private handleUnauthorized(): void {
    console.warn('🔒 Unauthorized access detected, clearing auth tokens');
    this.clearAuthTokens();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/') {
        console.log('🔄 Redirecting to login page');
        window.location.href = '/login';
      }
    }
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
    const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff

    try {
      const url = `${this.baseURL}${endpoint}`;
      
      // 🔑 SIEMPRE incluir autenticación por defecto, a menos que se especifique lo contrario
      const includeAuth = (options as any).includeAuth !== false;
      const headers = this.createHeaders(includeAuth);

      // Merge custom headers if provided
      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      const config: RequestInit = {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.timeout),
      };

      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await this.handleErrorResponse(response);
        
        // Retry logic for retriable errors
        if ((error as any).isRetriable && retryCount < maxRetries) {
          console.log(`🔄 Retrying request (${retryCount + 1}/${maxRetries}) after ${retryDelay}ms`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        // Notify about the error
        this.notifyError(error, endpoint, options.method || 'GET');
        throw error;
      }

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`, data);
      return data;

    } catch (error: any) {
      // Handle network errors, timeouts, etc.
      if (error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout after ${this.timeout}ms`);
        (timeoutError as any).category = 'timeout';
        (timeoutError as any).isRetriable = true;
        
        if (retryCount < maxRetries) {
          console.log(`⏱️ Request timeout, retrying (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return this.request<T>(endpoint, options, retryCount + 1);
        }
        
        throw timeoutError;
      }

      // Handle CORS errors specifically
      if (error.message.includes('CORS') || error.message.includes('fetch')) {
        const corsError = new Error('Error de conexión con el servidor. Por favor, verifica tu conexión.');
        (corsError as any).category = 'cors_error';
        (corsError as any).isUserFriendly = true;
        throw corsError;
      }

      // If it's already a categorized error, just re-throw
      if ((error as any).category) {
        throw error;
      }

      // Handle other network errors
      const networkError = new Error('Error de red. Por favor, verifica tu conexión e intenta nuevamente.');
      (networkError as any).category = 'network_error';
      (networkError as any).isRetriable = true;
      (networkError as any).isUserFriendly = true;

      if (retryCount < maxRetries) {
        console.log(`🌐 Network error, retrying (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      this.notifyError(networkError, endpoint, options.method || 'GET');
      throw networkError;
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
    try {
      const response = await this.get<{ status: string; timestamp: string }>('/health');
      console.log('💚 Backend health check passed:', response);
      return response;
    } catch (error) {
      console.error('❤️‍🩹 Backend health check failed:', error);
      throw error;
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
    // 🔑 Usar el método request principal con autenticación deshabilitada
    return this.request<T>(endpoint, { 
      ...options, 
      includeAuth: false 
    } as any);
  }
}

// Create and export the singleton instance
export const apiService = new ApiService();

// Export the auth API methods for convenience
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiService.requestWithoutAuth<AuthUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (email: string, password: string, fullName?: string) =>
    apiService.requestWithoutAuth<AuthUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name: fullName }),
    }),
  
  logout: () => apiService.post('/auth/logout'),
  
  getCurrentUser: () => apiService.get<AuthUser>('/auth/me'),
  
  updateProfile: (updates: Partial<AuthUser>) =>
    apiService.patch<AuthUser>('/auth/profile', updates),
};

// Export the wallet API methods
export const walletAPI = {
  // 🆕 NUEVO: Obtener mi wallet completo desde el backend
  getMyWallet: () =>
    apiService.get('/wallets/me'),
  
  getBalance: (userId: string) =>
    apiService.get(`/wallets/user/${userId}`),
  
  getTransactions: (userId: string) =>
    apiService.get(`/wallets/user/${userId}`), // Usa mismo endpoint que balance por ahora
  
  getMerits: (userId: string) =>
    apiService.get(`/wallets/user/${userId}`), // Usa mismo endpoint que balance por ahora
  
  getAllMerits: () =>
    apiService.get('/wallets/admin/all'), // Endpoint administrativo
  
  getMeritsLeaderboard: (limit = 10) =>
    apiService.get(`/wallets/admin/all?limit=${limit}`), // Endpoint administrativo con límite
  
  getMeritHistory: (userId: string, page = 0, limit = 20) =>
    apiService.get(`/wallets/user/${userId}?page=${page}&limit=${limit}`), // Agregar params
  
  awardMerit: (userId: string, meritType: string, amount: number, description?: string) =>
    apiService.post('/wallets/admin/award', { userId, meritType, amount, description }),
  
  transfer: (fromUserId: string, toUserId: string, amount: number, description?: string) =>
    apiService.post('/wallets/transfer', { fromUserId, toUserId, amount, description }),
};

// Export the user API methods
export const userAPI = {
  getProfile: (userId: string) =>
    apiService.get(`/users/${userId}`),
  
  updateProfile: (userId: string, updates: any) =>
    apiService.patch(`/users/${userId}`, updates),
  
  getUsers: () =>
    apiService.get('/users'),
};

// Export the game API methods
export const gameAPI = {
  getGameData: (userId: string) =>
    apiService.get(`/game/data/${userId}`),
  
  updateProgress: (userId: string, progress: any) =>
    apiService.post(`/game/progress/${userId}`, progress),
  
  getQuests: () =>
    apiService.get('/game/quests'),
};

// Export the marketplace API methods
export const marketplaceAPI = {
  getItems: (filters?: any) =>
    apiService.get('/marketplace/items', { params: filters }),
  
  createItem: (itemData: any) =>
    apiService.post('/marketplace/items', itemData),
  
  updateItem: (itemId: string, updates: any) =>
    apiService.patch(`/marketplace/items/${itemId}`, updates),
  
  deleteItem: (itemId: string) =>
    apiService.delete(`/marketplace/items/${itemId}`),
  
  searchItems: (searchTerm: string, filters?: any) =>
    apiService.get(`/marketplace/search?q=${encodeURIComponent(searchTerm)}`, { params: filters }),
  
  getCategories: () =>
    apiService.get('/marketplace/categories'),
  
  getTrending: (limit = 6) =>
    apiService.get(`/marketplace/trending?limit=${limit}`),
};

// Export the videos API methods
export const videosAPI = {
  getCategories: () =>
    apiService.get('/video-items/categories'),
  
  getVideos: (category?: string) =>
    apiService.get(`/video-items${category ? `?category=${category}` : ''}`),
  
  getPlaylists: () =>
    apiService.get('/video-items/playlists'),
};

// Export the stats API methods
export const statsAPI = {
  getGeneral: () =>
    apiService.get('/stats/general'),
  
  getSearch: () =>
    apiService.get('/stats/search'),
  
  getUser: (userId: string) =>
    apiService.get(`/stats/user/${userId}`),
};

// Export the forms API methods
export const formsAPI = {
  submit: (formData: any) =>
    apiService.post('/forms/submit', formData),
};

// Export the mundos API methods
export const mundosAPI = {
  getMundos: () =>
    apiService.get('/mundos'),
  
  getMundo: (mundoId: string) =>
    apiService.get(`/mundos/${mundoId}`),
  
  getMundoBySlug: (slug: string) =>
    apiService.get(`/mundos/slug/${slug}`),
  
  getMundoPlaylists: (mundoId: string) =>
    apiService.get(`/mundos/${mundoId}/playlists`),
};

// Export the social API methods
export const socialAPI = {
  // ❌ ENDPOINTS NO IMPLEMENTADOS EN EL BACKEND - Comentados temporalmente
  // getMatches: () =>
  //   apiService.get('/social/matches'),
  
  // getMatch: (matchId: string) =>
  //   apiService.get(`/social/matches/${matchId}`),
  
  // getMessages: (matchId: string, page = 0, limit = 50) =>
  //   apiService.get(`/social/matches/${matchId}/messages?page=${page}&limit=${limit}`),
  
  // sendMessage: (matchId: string, message: string) =>
  //   apiService.post(`/social/matches/${matchId}/messages`, { message }),
  
  // updateUserStatus: (status: string) =>
  //   apiService.patch('/social/status', { status }),
  
  // ✅ ENDPOINTS CORREGIDOS - Usar las rutas correctas del backend
  
  // Notificaciones - usar el endpoint correcto
  getNotifications: (userId: string) =>
    apiService.get(`/notifications/user/${userId}`),
  
  markNotificationAsRead: (notificationId: string, userId: string) =>
    apiService.patch(`/notifications/${notificationId}/read?userId=${userId}`),
  
  markAllNotificationsAsRead: (userId: string) =>
    apiService.patch(`/notifications/user/${userId}/mark-all-read`),
  
  getUnreadNotificationsCount: (userId: string) =>
    apiService.get(`/notifications/user/${userId}/unread-count`),
  
  // Estadísticas sociales - usar endpoint disponible
  getSocialStats: () =>
    apiService.get('/social/stats'),
  
  getRecentActivity: () =>
    apiService.get('/social/activity/recent'),
  
  // Posts/Publicaciones - usar endpoints disponibles
  getPosts: (page = 0, limit = 20) =>
    apiService.get(`/social/publications?page=${page}&limit=${limit}`),
  
  getPost: (postId: string) =>
    apiService.get(`/social/publications/${postId}`),
  
  createPost: (postData: any) =>
    apiService.post('/social/publications', postData),
  
  deletePost: (postId: string) =>
    apiService.delete(`/social/publications/${postId}`),
  
  likePost: (postId: string) =>
    apiService.post(`/social/publications/${postId}/like`),
  
  unlikePost: (postId: string) =>
    apiService.delete(`/social/publications/${postId}/like`),
  
  getPostLikes: (postId: string) =>
    apiService.get(`/social/publications/${postId}/likes`),
  
  getPostComments: (postId: string, page = 0, limit = 10) =>
    apiService.get(`/social/publications/${postId}/comments?page=${page}&limit=${limit}`),
  
  createComment: (postId: string, commentData: any) =>
    apiService.post(`/social/publications/${postId}/comments`, commentData),
  
  deleteComment: (commentId: string) =>
    apiService.delete(`/social/comments/${commentId}`),
  
  likeComment: (commentId: string) =>
    apiService.post(`/social/comments/${commentId}/like`),
  
  unlikeComment: (commentId: string) =>
    apiService.delete(`/social/comments/${commentId}/like`),
  
  // 🚧 FUNCIONALIDADES FUTURAS - Endpoints que se implementarán más adelante
  // Matches/Coincidencias - Funcionalidad futura
  getMatches: () => {
    console.warn('🚧 Matches functionality not yet implemented in backend');
    return Promise.resolve([]);
  },
  
  getMatch: (matchId: string) => {
    console.warn('🚧 Match details functionality not yet implemented in backend');
    return Promise.resolve(null);
  },
  
  getMessages: (matchId: string, page = 0, limit = 50) => {
    console.warn('🚧 Messages functionality not yet implemented in backend');
    return Promise.resolve([]);
  },
  
  sendMessage: (matchId: string, message: string) => {
    console.warn('🚧 Send message functionality not yet implemented in backend');
    return Promise.resolve({ success: false, message: 'Not implemented yet' });
  },
  
  updateUserStatus: (status: string) => {
    console.warn('🚧 User status functionality not yet implemented in backend');
    return Promise.resolve({ success: false, message: 'Not implemented yet' });
  },
};

export default apiService;