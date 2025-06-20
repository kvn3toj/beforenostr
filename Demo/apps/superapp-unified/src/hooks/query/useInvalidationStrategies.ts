import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// 🔄 ESTRATEGIAS DE INVALIDACIÓN INTELIGENTE
// Hooks especializados para invalidación de cache sin dependencias circulares

/**
 * Hook para invalidaciones básicas
 */
export const useBasicInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateUserData = useCallback(async (userId?: string) => {
    if (userId) {
      await queryClient.invalidateQueries({ queryKey: ['user', userId] });
    } else {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  }, [queryClient]);

  const invalidateModule = useCallback(async (moduleName: string) => {
    await queryClient.invalidateQueries({ queryKey: ['module', moduleName] });
  }, [queryClient]);

  return {
    invalidateUserData,
    invalidateModule,
  };
};

/**
 * Hook para invalidaciones de gamificación
 */
export const useGamificationInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateGamification = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['gamification'] });
    await queryClient.invalidateQueries({ queryKey: ['achievements'] });
    await queryClient.invalidateQueries({ queryKey: ['progress'] });
  }, [queryClient]);

  const invalidateUserProgress = useCallback(async (userId: string) => {
    await queryClient.invalidateQueries({ queryKey: ['game', 'data', userId] });
    await queryClient.invalidateQueries({ queryKey: ['user', userId, 'daily-stats'] });
  }, [queryClient]);

  return {
    invalidateGamification,
    invalidateUserProgress,
  };
};

/**
 * Hook para invalidaciones de contenido
 */
export const useContentInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateVideoContent = useCallback(async (videoId?: string) => {
    if (videoId) {
      await queryClient.invalidateQueries({ queryKey: ['video', videoId] });
    } else {
      await queryClient.invalidateQueries({ queryKey: ['videos'] });
    }
  }, [queryClient]);

  const invalidatePlaylistContent = useCallback(async (playlistId?: string) => {
    if (playlistId) {
      await queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    } else {
      await queryClient.invalidateQueries({ queryKey: ['playlists'] });
    }
  }, [queryClient]);

  return {
    invalidateVideoContent,
    invalidatePlaylistContent,
  };
};

/**
 * Hook para invalidaciones sociales
 */
export const useSocialInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateSocialFeed = useCallback(async (userId?: string) => {
    if (userId) {
      await queryClient.invalidateQueries({ queryKey: ['social', 'feed', userId] });
    } else {
      await queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
    }
  }, [queryClient]);

  const invalidatePostData = useCallback(async (postId: string) => {
    await queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    await queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });
    await queryClient.invalidateQueries({ queryKey: ['posts', postId, 'likes'] });
  }, [queryClient]);

  return {
    invalidateSocialFeed,
    invalidatePostData,
  };
}; 