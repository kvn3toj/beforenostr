/**
 * 🔐 Authentication Service - Real Backend Integration
 * 
 * Reemplaza toda la lógica de mock auth con llamadas reales al backend NestJS
 * Elimina dependencias de VITE_ENABLE_MOCK_AUTH y datos hardcodeados
 */

import { apiService } from '../lib/api-service';

// 🏷️ Tipos para el servicio de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    full_name?: string;
    avatar_url?: string;
    roles?: string[];
    created_at?: string;
  };
  access_token: string;
  refresh_token?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin' | 'Super Admin' | 'Content Admin';
  created_at: string;
  access_token?: string;
  refresh_token?: string;
}

/**
 * 🔐 Servicio de Autenticación - Solo Backend Real
 * 
 * Todas las funciones se conectan directamente al backend NestJS.
 * No hay lógica de mock ni datos hardcodeados.
 */
class AuthService {
  /**
   * 🔑 Login con backend NestJS
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 [AuthService] Logging in with backend:', credentials.email);
      
      const response = await apiService.post<AuthResponse>('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });

      console.log('✅ [AuthService] Login successful:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [AuthService] Login failed:', error);
      
      // Mejorar mensajes de error para el usuario
      if (error.statusCode === 401) {
        throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (error.statusCode === 400) {
        throw new Error('Datos de login inválidos. Verifica el formato de tu email.');
      } else if (error.category === 'network_error') {
        throw new Error('Error de conexión. Verifica que el servidor esté disponible.');
      }
      
      throw new Error(error.message || 'Error inesperado durante el login');
    }
  }

  /**
   * 📝 Registro con backend NestJS
   */
  async register(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    try {
      console.log('📝 [AuthService] Registering with backend:', email);
      
      const response = await apiService.post<AuthResponse>('/auth/register', {
        email,
        password,
        name: fullName,
      });

      console.log('✅ [AuthService] Registration successful:', response);
      return response;
    } catch (error: any) {
      console.error('❌ [AuthService] Registration failed:', error);
      
      // Mejorar mensajes de error para el usuario
      if (error.statusCode === 409) {
        throw new Error('Este email ya está registrado. Intenta iniciar sesión.');
      } else if (error.statusCode === 400) {
        throw new Error('Datos de registro inválidos. Verifica el formato de los campos.');
      } else if (error.category === 'network_error') {
        throw new Error('Error de conexión. Verifica que el servidor esté disponible.');
      }
      
      throw new Error(error.message || 'Error inesperado durante el registro');
    }
  }

  /**
   * 🔍 Verificar token JWT con backend
   */
  async verifyToken(): Promise<User | null> {
    try {
      console.log('🔍 [AuthService] Verifying token with backend');
      
      const response = await apiService.get<{ user: any }>('/auth/me');
      
      const user: User = this.mapBackendUserToFrontend(response.user || response);
      console.log('✅ [AuthService] Token verification successful:', user);
      
      return user;
    } catch (error: any) {
      console.error('❌ [AuthService] Token verification failed:', error);
      
      // Si el token es inválido, no es un error crítico
      if (error.statusCode === 401) {
        console.log('🔒 [AuthService] Token expired or invalid');
        return null;
      }
      
      throw error;
    }
  }

  /**
   * 🚪 Logout con backend NestJS
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 [AuthService] Logging out with backend');
      
      await apiService.post('/auth/logout');
      
      console.log('✅ [AuthService] Logout successful');
    } catch (error: any) {
      console.warn('⚠️ [AuthService] Logout failed (not critical):', error);
      // No lanzar error, el logout local debe continuar
    }
  }

  /**
   * 🔄 Refrescar token JWT
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      console.log('🔄 [AuthService] Refreshing token with backend');
      
      const response = await apiService.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      console.log('✅ [AuthService] Token refresh successful');
      return response;
    } catch (error: any) {
      console.error('❌ [AuthService] Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * 👤 Actualizar perfil de usuario
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      console.log('👤 [AuthService] Updating profile with backend:', updates);
      
      const response = await apiService.put<{ user: any }>('/auth/profile', updates);
      
      const user: User = this.mapBackendUserToFrontend(response.user || response);
      console.log('✅ [AuthService] Profile update successful:', user);
      
      return user;
    } catch (error: any) {
      console.error('❌ [AuthService] Profile update failed:', error);
      throw new Error(error.message || 'Error al actualizar el perfil');
    }
  }

  /**
   * 🔄 Mapear usuario del backend al formato del frontend
   */
  private mapBackendUserToFrontend(backendUser: any): User {
    return {
      id: backendUser.id || backendUser.userId,
      email: backendUser.email,
      full_name: backendUser.name || backendUser.full_name || backendUser.displayName,
      avatar_url: backendUser.avatarUrl || backendUser.avatar_url || backendUser.picture,
      role: backendUser.roles?.includes('admin') ? 'admin' : 'user',
      created_at: backendUser.created_at || backendUser.createdAt || new Date().toISOString(),
      access_token: backendUser.access_token,
      refresh_token: backendUser.refresh_token,
    };
  }
}

// 🔗 Exportar instancia única del servicio
export const authService = new AuthService();
export default authService; 