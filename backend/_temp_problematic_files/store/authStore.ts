import { create } from 'zustand'
import { authService, User, AuthResponse, LoginCredentials, RegisterCredentials } from '../services/auth.service'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
  getCurrentUser: () => Promise<User | null>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),

  setToken: (token) => set({ token }),

  setLoading: (isLoading) => set({ isLoading }),

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true });
      
      const authResponse = await authService.login(credentials);
      
      // Guardar datos en localStorage
      authService.saveAuthData(authResponse);
      
      // Actualizar store
      set({
        user: authResponse.user,
        token: authResponse.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('[AuthStore] Login exitoso:', authResponse.user.id);
      return authResponse;
    } catch (error) {
      set({ isLoading: false });
      console.error('[AuthStore] Error en login:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      set({ isLoading: true });
      
      const authResponse = await authService.register(credentials);
      
      // Guardar datos en localStorage
      authService.saveAuthData(authResponse);
      
      // Actualizar store
      set({
        user: authResponse.user,
        token: authResponse.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('[AuthStore] Registro exitoso:', authResponse.user.id);
      return authResponse;
    } catch (error) {
      set({ isLoading: false });
      console.error('[AuthStore] Error en registro:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Limpiar localStorage
      authService.logout();
      
      // Limpiar store
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log('[AuthStore] Logout exitoso');
    } catch (error) {
      console.error('[AuthStore] Error durante logout:', error);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Intentar recuperar datos del localStorage
      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();
      
      if (storedToken && storedUser) {
        // Validar que el token siga siendo válido
        const isValid = await authService.validateToken(storedToken);
        
        if (isValid) {
          // Token válido, restaurar sesión
          set({
            user: storedUser,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log('[AuthStore] Sesión restaurada desde localStorage');
          return;
        } else {
          // Token inválido, limpiar datos
          authService.logout();
          console.log('[AuthStore] Token inválido, sesión limpiada');
        }
      }
      
      // No hay sesión válida
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log('[AuthStore] No hay sesión activa');
      
    } catch (error) {
      console.error('[AuthStore] Error inicializando auth:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  getCurrentUser: async () => {
    try {
      const { token } = get();
      if (!token) {
        console.log('[AuthStore] No hay token para obtener usuario actual');
        return null;
      }

      const user = await authService.getCurrentUser(token);
      
      // Actualizar usuario en el store
      set({ user });
      
      return user;
    } catch (error) {
      console.error('[AuthStore] Error obteniendo usuario actual:', error);
      // Si hay error, probablemente el token expiró
      await get().logout();
      return null;
    }
  },
})); 