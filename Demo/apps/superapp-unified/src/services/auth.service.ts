const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;

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

class AuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
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
        error: error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      throw error;
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
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
   * Obtiene el usuario autenticado actual
   */
  async getCurrentUser(token: string): Promise<User> {
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
   * Valida si un token JWT es válido
   */
  async validateToken(token: string): Promise<boolean> {
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
}

// Exportar una instancia singleton del servicio
export const authService = new AuthService();
