import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStandardQuery } from './useSmartQuery';
import { authAPI, userAPI, gameAPI, apiService } from '../lib/api-service';
import { useAuth } from '../contexts/AuthContext';

// 🎯 Interfaces para el perfil de usuario completo
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin';
  created_at: string;
  // Campos extendidos del perfil
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  skills?: string[];
  preferences?: {
    language?: string;
    timezone?: string;
    currency?: string;
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    privacy?: {
      profileVisible: boolean;
      showEarnings: boolean;
      showLocation: boolean;
      showEmail: boolean;
    };
    theme?: 'light' | 'dark' | 'system';
  };
  stats?: {
    level?: number;
    points?: number;
    completedTasks?: number;
    memberSince?: string;
  };
}

export interface UpdateProfileData {
  full_name?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  skills?: string[];
  preferences?: UserProfile['preferences'];
  avatar_url?: string;
}

// 🎯 Interface para actividades del usuario
export interface UserActivity {
  id: string;
  type: 'challenge' | 'marketplace' | 'social' | 'uplay' | 'wallet';
  title: string;
  description: string;
  timestamp: string;
  points?: number;
  category?: string;
  metadata?: Record<string, any>;
}

// 🏆 Interface para logros
export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

// 🔍 Hook para obtener el perfil del usuario actual - CACHÉ ESTÁNDAR
export function useCurrentUserProfile() {
  const { user, isAuthenticated } = useAuth();

  return useStandardQuery(
    ['user-profile', 'current'],
    async () => {
      try {
        // Intentar obtener perfil completo del endpoint específico
        const profileData = await authAPI.getCurrentUser();

        return {
          id: profileData.id || user?.id,
          email: profileData.email || user?.email,
          full_name:
            profileData.full_name || profileData.name || user?.full_name,
          avatar_url:
            profileData.avatar_url || profileData.avatarUrl || user?.avatar_url,
          role: profileData.role || user?.role || 'user',
          created_at:
            profileData.created_at || profileData.createdAt || user?.created_at,
          bio: profileData.bio,
          location: profileData.location,
          phone: profileData.phone,
          website: profileData.website,
          skills: profileData.skills || [],
          preferences: {
            language: profileData.preferences?.language || 'es',
            timezone: profileData.preferences?.timezone || 'America/Bogota',
            currency: profileData.preferences?.currency || 'COP',
            notifications: {
              email: profileData.preferences?.notifications?.email ?? true,
              push: profileData.preferences?.notifications?.push ?? true,
              sms: profileData.preferences?.notifications?.sms ?? false,
              marketing:
                profileData.preferences?.notifications?.marketing ?? false,
            },
            privacy: {
              profileVisible:
                profileData.preferences?.privacy?.profileVisible ?? true,
              showEarnings:
                profileData.preferences?.privacy?.showEarnings ?? false,
              showLocation:
                profileData.preferences?.privacy?.showLocation ?? true,
              showEmail: profileData.preferences?.privacy?.showEmail ?? false,
            },
            theme: profileData.preferences?.theme || 'light',
          },
          stats: {
            level: profileData.stats?.level || 1,
            points: profileData.stats?.points || 0,
            completedTasks: profileData.stats?.completedTasks || 0,
            memberSince:
              profileData.created_at ||
              profileData.createdAt ||
              user?.created_at,
          },
        } as UserProfile;
      } catch (error) {
        console.warn('🔄 Fallback: Usando datos básicos del AuthContext');

        // Fallback: usar datos del contexto de autenticación
        if (!user) {
          throw new Error('No hay usuario autenticado');
        }

        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          role: user.role || 'user',
          created_at: user.created_at,
          bio: '',
          location: '',
          phone: '',
          website: '',
          skills: [],
          preferences: {
            language: 'es',
            timezone: 'America/Bogota',
            currency: 'COP',
            notifications: {
              email: true,
              push: true,
              sms: false,
              marketing: false,
            },
            privacy: {
              profileVisible: true,
              showEarnings: false,
              showLocation: true,
              showEmail: false,
            },
            theme: 'light',
          },
          stats: {
            level: 1,
            points: 0,
            completedTasks: 0,
            memberSince: user.created_at,
          },
        } as UserProfile;
      }
    },
    {
      enabled: isAuthenticated && !!user,
      retry: (failureCount, error: any) => {
        // No reintentar si es error de autenticación
        if (
          error?.message?.includes('401') ||
          error?.message?.includes('Unauthorized')
        ) {
          return false;
        }
        return failureCount < 2;
      },
    }
  );
}

// 🔍 Hook para obtener el perfil de cualquier usuario por ID
export function useUserProfileById(userId: string) {
  return useStandardQuery(
    ['user-profile', userId],
    async () => {
      try {
        const profileData = await userAPI.getProfile(userId);
        return profileData as UserProfile;
      } catch (error) {
        console.error(`Error obteniendo perfil del usuario ${userId}:`, error);
        throw error;
      }
    },
    {
      enabled: !!userId,
      retry: (failureCount, error: any) => {
        // No reintentar si es 404 (usuario no encontrado)
        if (error?.message?.includes('404')) {
          return false;
        }
        return failureCount < 2;
      },
    }
  );
}

// ✏️ Hook para actualizar el perfil del usuario actual
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { updateProfile: updateAuthProfile } = useAuth();

  return useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      try {
        // Intentar actualizar con endpoint específico de perfil
        const updatedProfile = await authAPI.updateProfile(updates);

        // También actualizar en el AuthContext
        await updateAuthProfile(updates);

        return updatedProfile;
      } catch (error: any) {
        console.error('Error actualizando perfil:', error);

        // Intentar con el contexto de autenticación como fallback
        if (
          error?.message?.includes('404') ||
          error?.message?.includes('Cannot')
        ) {
          console.warn('🔄 Fallback: Usando updateProfile del AuthContext');
          await updateAuthProfile(updates);
          return updates;
        }

        throw error;
      }
    },
    onSuccess: (updatedProfile) => {
      // Invalidar caché del perfil para forzar refetch
      queryClient.invalidateQueries({ queryKey: ['user-profile', 'current'] });

      // Opcional: también invalidar otros datos relacionados
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      if (import.meta.env.DEV) {
        console.log('✅ Perfil actualizado exitosamente:', updatedProfile);
      }
    },
    onError: (error: any) => {
      console.error('❌ Error actualizando perfil:', error);

      // Disparar evento para notificaciones
      window.dispatchEvent(
        new CustomEvent('user-notification', {
          detail: {
            type: 'error',
            message: error.message || 'Error al actualizar el perfil',
            category: 'profile-update',
          },
        })
      );
    },
  });
}

// 📊 Hook para estadísticas del perfil
export function useProfileStats(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useStandardQuery(
    ['user-profile-stats', targetUserId],
    async () => {
      if (!targetUserId) throw new Error('No user ID provided');

      try {
        // Intentar obtener estadísticas del backend
        const stats = await userAPI.getProfile(targetUserId);
        return (
          stats.stats || {
            level: 1,
            points: 0,
            completedTasks: 0,
            memberSince: user?.created_at || new Date().toISOString(),
          }
        );
      } catch (error) {
        console.warn('🔄 Fallback: Estadísticas básicas');
        return {
          level: 1,
          points: 0,
          completedTasks: 0,
          memberSince: user?.created_at || new Date().toISOString(),
        };
      }
    },
    {
      enabled: !!targetUserId,
      retry: false, // No reintentar para estadísticas, usar fallback
    }
  );
}

// 🎨 Hook para preferencias de usuario
export function useUserPreferences() {
  const { user } = useAuth();

  return useStandardQuery(
    ['user-preferences', user?.id],
    async () => {
      if (!user?.id) throw new Error('No user authenticated');

      try {
        const profile = await authAPI.getCurrentUser();
        return profile.preferences || getDefaultPreferences();
      } catch (error) {
        console.warn('🔄 Fallback: Preferencias por defecto');
        return getDefaultPreferences();
      }
    },
    {
      enabled: !!user?.id,
      retry: false,
    }
  );
}

// 🛠️ Función helper para preferencias por defecto
function getDefaultPreferences(): UserProfile['preferences'] {
  return {
    language: 'es',
    timezone: 'America/Bogota',
    currency: 'COP',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      showEarnings: false,
      showLocation: true,
      showEmail: false,
    },
    theme: 'light',
  };
}

// 🔄 Hook para invalidar caché del perfil (útil después de actualizaciones)
export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return {
    invalidateCurrentUser: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', 'current'] });
    },
    invalidateUserById: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
    },
    invalidateAllProfiles: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  };
}

// 🎮 Hook para actividades del usuario
export function useUserActivities(userId?: string, limit: number = 20) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useStandardQuery(
    ['user-activities', targetUserId, limit],
    async () => {
      if (!targetUserId) throw new Error('No user ID provided');

      try {
        // Intentar obtener actividades del backend
        const response = await userAPI.getProfile(targetUserId);
        return response.activities || [];
      } catch (error) {
        console.warn('🔄 Error obteniendo actividades - retornando array vacío');
//         // ✅ ELIMINADO: Fallback a mock - retornar array vacío en lugar de datos mock
        return [];
      }
    },
    {
      enabled: !!targetUserId,
      retry: false,
    }
  );
}

// 🏆 Hook para logros del usuario
export function useUserAchievements(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useStandardQuery(
    ['user-achievements', targetUserId],
    async () => {
      if (!targetUserId) throw new Error('No user ID provided');

      try {
        // Intentar obtener logros del backend
        const response = await userAPI.getProfile(targetUserId);
        return response.achievements || [];
      } catch (error) {
        console.warn('🔄 Error obteniendo logros - retornando array vacío');
//         // ✅ ELIMINADO: Fallback a mock - retornar array vacío en lugar de datos mock
        return [];
      }
    },
    {
      enabled: !!targetUserId,
      retry: false,
    }
  );
}

// 📸 Hook para actualizar avatar
export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (imageFile: File) => {
      try {
        // Crear FormData para subir imagen
        const formData = new FormData();
        formData.append('avatar', imageFile);

        // Intentar subir al endpoint específico de avatar
        const response = await fetch('/api/auth/avatar', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('coomunity_token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al subir avatar');
        }

        const result = await response.json();
        return result.avatar_url;
      } catch (error: any) {
        console.error('Error uploading avatar:', error);

        // Fallback: convertir a base64 y almacenar localmente (desarrollo)
        if (import.meta.env.DEV) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(imageFile);
          });
        }

        throw error;
      }
    },
    onSuccess: (avatarUrl) => {
      // Invalidar caché del perfil para refrescar avatar
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      if (import.meta.env.DEV) {
        console.log('✅ Avatar actualizado exitosamente:', avatarUrl);
      }
    },
    onError: (error: any) => {
      console.error('❌ Error actualizando avatar:', error);

      // Disparar evento para notificaciones
      window.dispatchEvent(
        new CustomEvent('user-notification', {
          detail: {
            type: 'error',
            message: error.message || 'Error al actualizar avatar',
            category: 'avatar-update',
          },
        })
      );
    },
  });
}

// 📊 Hook para métricas de gamificación extendidas
export function useGamificationMetrics(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useStandardQuery(
    ['gamification-metrics', targetUserId],
    async () => {
      if (!targetUserId) throw new Error('No user ID provided');

      try {
        // Intentar obtener métricas del backend
        const response = await gameAPI.getUserStats(targetUserId);
        return response;
      } catch (error) {
        console.warn('🔄 Error obteniendo métricas - retornando datos básicos');
//         // ✅ ELIMINADO: Fallback a mock - retornar datos básicos
        return {
          level: 1,
          meritos: 0,
          ondas: 0,
          reciprocidadLevel: 0,
          completedChallenges: 0,
          socialConnections: 0,
          marketplaceRating: 0,
          pilgrimProgress: 0,
        };
      }
    },
    {
      enabled: !!targetUserId,
      retry: false,
    }
  );
}

// 🔗 Hook para conexiones sociales
export function useSocialConnections(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useStandardQuery(
    ['social-connections', targetUserId],
    async () => {
      if (!targetUserId) throw new Error('No user ID provided');

      try {
        // Intentar obtener conexiones del backend social
        const response = await apiService.get(
          `/social/connections/${targetUserId}`
        );
        return response.data || [];
      } catch (error) {
        console.warn('🔄 Error obteniendo conexiones - retornando array vacío');
//         // ✅ ELIMINADO: Fallback a mock - retornar array vacío
        return [];
      }
    },
    {
      enabled: !!targetUserId,
      retry: false,
    }
  );
}

// 📝 Utilidades de validación para actualización de perfil
export const profileValidation = {
  validateName: (name: string): boolean => {
    return name.length >= 2 && name.length <= 50;
  },

  validateBio: (bio: string): boolean => {
    return bio.length <= 500;
  },

  validatePhone: (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    return !phone || phoneRegex.test(phone);
  },

  validateWebsite: (website: string): boolean => {
    if (!website) return true;
    try {
      new URL(website);
      return true;
    } catch {
      return false;
    }
  },

  validateProfileData: (
    data: UpdateProfileData
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (data.full_name && !profileValidation.validateName(data.full_name)) {
      errors.push('El nombre debe tener entre 2 y 50 caracteres');
    }

    if (data.bio && !profileValidation.validateBio(data.bio)) {
      errors.push('La biografía no puede exceder 500 caracteres');
    }

    if (data.phone && !profileValidation.validatePhone(data.phone)) {
      errors.push('El formato del teléfono no es válido');
    }

    if (data.website && !profileValidation.validateWebsite(data.website)) {
      errors.push('La URL del sitio web no es válida');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// // 📊 Datos mock para desarrollo (remover cuando el backend esté listo)
// const mockUserActivities: UserActivity[] = [
//   {
//     id: '1',
//     type: 'challenge',
//     title: 'Completaste "Desafío Reciprocidad Diario"',
//     description: 'Ayudaste a 3 miembros de la CoomÜnidad',
//     timestamp: '2024-12-18T10:30:00Z',
//     points: 150,
//     category: 'Reciprocidad',
//   },
//   {
//     id: '2',
//     type: 'marketplace',
//     title: 'Nueva reseña recibida',
//     description: 'María valoró tu servicio con 5 estrellas',
//     timestamp: '2024-12-18T09:15:00Z',
//     category: 'Confianza',
//   },
//   {
//     id: '3',
//     type: 'social',
//     title: 'Te conectaste con Juan Carlos',
//     description: 'Nueva colaboración iniciada',
//     timestamp: '2024-12-17T16:45:00Z',
//     category: 'Red Social',
//   },
// ];

// const mockUserAchievements: UserAchievement[] = [
//   {
//     id: '1',
//     name: 'Maestro del Reciprocidad',
//     description: 'Mantuviste equilibrio perfecto por 30 días',
//     unlockedAt: '2024-12-15T12:00:00Z',
//     rarity: 'legendary',
//     category: 'Reciprocidad',
//   },
//   {
//     id: '2',
//     name: 'Colaborador Confiable',
//     description: 'Recibiste 50+ reseñas positivas',
//     unlockedAt: '2024-12-10T15:30:00Z',
//     rarity: 'epic',
//     category: 'Marketplace',
//   },
//   {
//     id: '3',
//     name: 'Explorador Social',
//     description: 'Conectaste con 100+ miembros',
//     unlockedAt: '2024-12-05T09:45:00Z',
//     rarity: 'rare',
//     category: 'Social',
//   },
// ];
