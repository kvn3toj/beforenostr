const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;
import { AUTH_STORAGE_KEYS } from '../config/constants';

import { EnvironmentHelpers } from '../lib/environment'; // Import EnvironmentHelpers
import { apiService } from '../../lib/api-service'; // Updated import path

// Use the new centralized mock detection.
// The specific logic `!IS_REAL_API_CONFIGURED` for auth mock is not directly
// transferable to a generic function without more context or making the helper more complex.
// For now, we rely on explicit mock flags for auth.
// If `VITE_API_BASE_URL` is not set, services using `apiService` would fail,
// and mocks should be enabled explicitly via `VITE_MOCK_AUTH_ENABLED` or global mock flags.
const IS_MOCK_AUTH_ENABLED = EnvironmentHelpers.isMockEnabled('AUTH');


// Log the effective authentication mode
if (IS_MOCK_AUTH_ENABLED) {
  console.log('🔶 [AuthService] Running in MOCK authentication mode (detected by EnvironmentHelpers).');
} else {
  console.log('🌍 [AuthService] Running in REAL authentication mode (detected by EnvironmentHelpers).');
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

import { User } from '../types/domain/user.model'; // Import the consolidated User type

// Interfaz flexible para la respuesta de autenticación, que puede variar.
export interface AuthResponse {
  access_token?: string; // This can be the main token
  token?: string; // Alternative name for the token
  accessToken?: string; // Another alternative name
  user: User; // Use the consolidated User type
  data?: any; // Para estructuras anidadas como { data: { user: ... } }
}

// Mock users for testing
// Ensure MOCK_USERS align with the consolidated User interface
const MOCK_USERS: { [key: string]: User } = {
  'admin@gamifier.com': {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@gamifier.com',
    fullName: 'Administrator',
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
    ],
    createdAt: new Date().toISOString(),
  },
  'test@coomunity.com': {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'test@coomunity.com',
    fullName: 'Test User',
    avatarUrl: null,
    roles: ['user'],
    permissions: [
      'content:read',
      'groups:read',
      'wallet:read'
    ],
    createdAt: new Date().toISOString(),
  }
};

const MOCK_PASSWORDS = {
  'admin@gamifier.com': 'admin123',
  'test@coomunity.com': 'test123'
};

class AuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Use mock authentication if enabled
    if (IS_MOCK_AUTH_ENABLED) {
      console.log('🔶 [AuthService] Using mock authentication for:', credentials.email);
      return this.mockLogin(credentials);
    }

    try {
      // Use apiService for the actual API call
      const responseData = await apiService.post<AuthResponse>(`${AUTH_ENDPOINT}/login`, credentials);
      console.log('[AuthService] Login exitoso con backend real para:', credentials.email);
      return responseData;
    } catch (error: any) {
      // apiService.handleResponse ya debería haber lanzado un ApiError estandarizado.
      // Aquí podemos re-lanzarlo o manejarlo específicamente si es necesario.
      console.error('[AuthService] Error en login (manejado por apiService):', error);
      // Si queremos mantener la estructura de error anterior para este servicio específico:
      // if (error.statusCode && error.message) {
      //   throw new Error(error.message || `Error ${error.statusCode}`);
      // }
      console.error('🔍 [AuthService] COMPLETE ERROR DETAILS (re-thrown):', {
        error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      throw error;
    }
  }

  /**
   * Mock login for development/testing
   */
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = MOCK_USERS[credentials.email as keyof typeof MOCK_USERS];
    const expectedPassword = MOCK_PASSWORDS[credentials.email as keyof typeof MOCK_PASSWORDS];

    if (!mockUser || credentials.password !== expectedPassword) {
      throw new Error('Credenciales incorrectas');
    }

    const mockToken = `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('✅ [AuthService] Mock login successful for:', credentials.email);

    return {
      access_token: mockToken,
      user: mockUser
    };
  }

  /**
   * Registra un nuevo usuario
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (IS_MOCK_AUTH_ENABLED) {
      console.log('🔶 [AuthService] Using mock registration for:', credentials.email);
      return this.mockRegister(credentials);
    }

    try {
      // Use apiService for the actual API call
      const responseData = await apiService.post<AuthResponse>(`${AUTH_ENDPOINT}/register`, credentials);
      console.log('[AuthService] Registro exitoso con backend real para:', credentials.email);
      return responseData;
    } catch (error) {
      // apiService.handleResponse ya debería haber lanzado un ApiError estandarizado.
      console.error('[AuthService] Error en register (manejado por apiService):', error);
      throw error;
    }
  }

  /**
   * Mock register for development/testing
   */
  private async mockRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user already exists
    if (MOCK_USERS[credentials.email as keyof typeof MOCK_USERS]) {
      throw new Error('El usuario ya existe');
    }

    const mockUser: User = {
      id: `mock-user-${Date.now()}`,
      email: credentials.email,
      fullName: credentials.name || 'New User',
      avatarUrl: null,
      roles: ['user'],
      permissions: ['content:read', 'groups:read', 'wallet:read']
    };

    const mockToken = `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('✅ [AuthService] Mock registration successful for:', credentials.email);

    return {
      access_token: mockToken,
      user: mockUser
    };
  }

  /**
   * Obtiene el usuario autenticado actual
   */
  async getCurrentUser(token: string): Promise<User> {
    if (IS_MOCK_AUTH_ENABLED) {
      console.log('🔶 [AuthService] Using mock getCurrentUser');
      return this.mockGetCurrentUser(token);
    }

    try {
      // Use apiService for the actual API call.
      // apiService.get already includes Authorization header if token is in localStorage.
      // If this specific call needs the token passed explicitly, apiService might need adjustment,
      // or we pass headers explicitly here. Assuming apiService.get handles auth.
      const user = await apiService.get<User>(`/users/me`); // Endpoint adjusted if AUTH_ENDPOINT is /auth
      // If /users/me is the correct absolute path from API_BASE_URL, then it's fine.
      // The original fetch was `${API_BASE_URL}/users/me`.
      // The current apiService prepends API_BASE_URL, so `/users/me` is correct.
      return user;
    } catch (error) {
      console.error('[AuthService] Error en getCurrentUser (manejado por apiService):', error);
      throw error;
    }
  }

  /**
   * Mock getCurrentUser for development/testing
   */
  private async mockGetCurrentUser(token: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Extract email from stored user data or use default
    const storedUser = this.getStoredUser();
    if (storedUser) {
      return storedUser;
    }

    // Default to admin user if no stored data
    return MOCK_USERS['admin@gamifier.com'];
  }

  /**
   * Valida si un token JWT es válido
   */
  async validateToken(token: string): Promise<boolean> {
    if (IS_MOCK_AUTH_ENABLED) {
      console.log('🔶 [AuthService] Using mock token validation');
      // Mock tokens are always valid if they start with 'mock-token-'
      return token.startsWith('mock-token-');
    }

    try {
      await this.getCurrentUser(token);
      return true;
    } catch (error) {
      console.error('[AuthService] Token inválido:', error);
      return false;
    }
  }

  /**
   * Cierra sesión (limpia el token del almacenamiento local)
   */
  logout(): void {
    // Usar las claves estándar de CoomÜnity
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);

    // También limpiar las claves anteriores por compatibilidad
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');

    console.log('[AuthService] Sesión cerrada, tokens eliminados');
  }

  /**
   * Guarda el token y usuario en localStorage
   */
  saveAuthData(authResponse: AuthResponse): void {
    // Usar las claves estándar de CoomÜnity
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, authResponse.access_token || authResponse.token || authResponse.accessToken || '');
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(authResponse.user));
    console.log('[AuthService] Datos de autenticación guardados');
  }

  /**
   * Obtiene el token guardado en localStorage
   */
  getStoredToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  }

  /**
   * Obtiene el usuario guardado en localStorage
   */
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('[AuthService] Error al parsear usuario guardado:', error);
      return null;
    }
  }

  /**
   * Verifica si hay una sesión activa válida
   */
  async hasValidSession(): Promise<boolean> {
    const token = this.getStoredToken();
    if (!token) return false;

    return await this.validateToken(token);
  }

  /**
   * Update profile method for mock auth
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    if (IS_MOCK_AUTH_ENABLED) {
      console.log('🔶 [AuthService] Using mock updateProfile');
      const currentUser = this.getStoredUser();
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      return updatedUser;
    }

    // Real implementation would go here
    throw new Error('Profile update not implemented for real backend');
  }
}

// Exportar una instancia singleton del servicio
export const authService = new AuthService();
