const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;

// Check if a real backend is configured. If not, default to mock authentication.
const IS_REAL_API_CONFIGURED = import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim() !== '';
const IS_MOCK_AUTH_ENABLED = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true' || !IS_REAL_API_CONFIGURED;

// Log the effective authentication mode
if (IS_MOCK_AUTH_ENABLED) {
  console.log('🔶 [AuthService] Running in MOCK authentication mode. No real API calls will be made for auth.');
} else {
  console.log('🌍 [AuthService] Running in REAL authentication mode.');
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

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    roles?: string[];
    permissions?: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  roles?: string[];
  permissions?: string[];
}

// Mock users for testing
const MOCK_USERS = {
  'admin@gamifier.com': {
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
  },
  'test@coomunity.com': {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'test@coomunity.com',
    name: 'Test User',
    avatarUrl: null,
    roles: ['user'],
    permissions: [
      'content:read',
      'groups:read',
      'wallet:read'
    ]
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

    // 🔍 DEBUGGING: Log exact request details
    const requestPayload = JSON.stringify(credentials);
    const requestUrl = `${AUTH_ENDPOINT}/login`;

    console.log('🔍 [AuthService] DEBUGGING REQUEST:', {
      url: requestUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: requestPayload,
      payloadParsed: credentials
    });

    try {
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestPayload,
      });

      // 🔍 DEBUGGING: Log exact response details
      console.log('🔍 [AuthService] RESPONSE DETAILS:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });

      if (!response.ok) {
        // 🔍 DEBUGGING: Capture raw response text first
        const responseText = await response.text();
        console.log('🔍 [AuthService] RAW ERROR RESPONSE:', responseText);

        // Try to parse as JSON if possible
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.log('🔍 [AuthService] ERROR RESPONSE NOT JSON:', parseError);
          errorData = { message: responseText };
        }

        const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // 🔍 DEBUGGING: Capture raw success response text first
      const responseText = await response.text();
      console.log('🔍 [AuthService] RAW SUCCESS RESPONSE:', responseText);

      // Parse as JSON
      const data: AuthResponse = JSON.parse(responseText);
      console.log('[AuthService] Login exitoso con backend real para:', credentials.email);
      return data;
    } catch (error: any) {
      console.error('🔍 [AuthService] COMPLETE ERROR DETAILS:', {
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
      user: {
        ...mockUser
      }
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
      const response = await fetch(`${AUTH_ENDPOINT}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('[AuthService] Error en register:', error);
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

    const mockUser = {
      id: `mock-user-${Date.now()}`,
      email: credentials.email,
      name: credentials.name || 'New User',
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

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const user: User = await response.json();
    return user;
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
    localStorage.removeItem('COOMUNITY_AUTH_TOKEN');
    localStorage.removeItem('COOMUNITY_USER_DATA');

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
    localStorage.setItem('COOMUNITY_AUTH_TOKEN', authResponse.access_token);
    localStorage.setItem('COOMUNITY_USER_DATA', JSON.stringify(authResponse.user));
    console.log('[AuthService] Datos de autenticación guardados');
  }

  /**
   * Obtiene el token guardado en localStorage
   */
  getStoredToken(): string | null {
    return localStorage.getItem('COOMUNITY_AUTH_TOKEN');
  }

  /**
   * Obtiene el usuario guardado en localStorage
   */
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('COOMUNITY_USER_DATA');
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
      localStorage.setItem('COOMUNITY_USER_DATA', JSON.stringify(updatedUser));
      return updatedUser;
    }

    // Real implementation would go here
    throw new Error('Profile update not implemented for real backend');
  }
}

// Exportar una instancia singleton del servicio
export const authService = new AuthService();
