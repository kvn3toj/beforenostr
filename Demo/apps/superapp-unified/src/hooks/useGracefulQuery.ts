import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { EnvironmentHelpers } from '../lib/environment';

/**
 * 🔄 Graceful Query Hook
 *
 * Wraps useQuery with better error handling for development scenarios
 * where backend endpoints might not exist yet.
 */

interface GracefulQueryOptions<TData = unknown, TError = Error>
  extends Omit<UseQueryOptions<TData, TError>, 'queryFn'> {
  queryFn: () => Promise<TData>;
  fallbackData?: TData;
  silentFail?: boolean; // Don't log errors for expected missing endpoints
  retryOnMissingEndpoint?: boolean; // Whether to retry on 404 errors
}

export function useGracefulQuery<TData = unknown, TError = Error>(
  options: GracefulQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  const {
    queryFn,
    fallbackData,
    silentFail = false,
    retryOnMissingEndpoint = false,
    ...queryOptions
  } = options;

  return useQuery({
    ...queryOptions,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error: any) {
        const isNotFound =
          error.statusCode === 404 ||
          error.message?.includes('Recurso no encontrado');
        const isAuth = error.statusCode === 401 || error.category === 'auth';

        // In development, handle missing endpoints gracefully
        if (isNotFound && EnvironmentHelpers.isDevelopment()) {
          if (!silentFail) {
            console.warn(`🔄 Endpoint not implemented yet:`, {
              queryKey: queryOptions.queryKey,
              error: error.message,
              fallbackUsed: !!fallbackData,
            });
          }

          // Return fallback data if available
          if (fallbackData !== undefined) {
            return fallbackData;
          }

          // For missing endpoints, return empty arrays/objects based on query key
          return getDefaultFallbackData(queryOptions.queryKey as string[]);
        }

        // For auth errors in development with mock auth, return fallback silently
        if (isAuth && EnvironmentHelpers.shouldUseMockAuth()) {
          if (!silentFail && EnvironmentHelpers.shouldLogDebug()) {
            console.warn(
              `🧪 Auth error in mock mode, using fallback for:`,
              queryOptions.queryKey
            );
          }

          if (fallbackData !== undefined) {
            return fallbackData;
          }

          return getDefaultFallbackData(queryOptions.queryKey as string[]);
        }

        // Re-throw other errors
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      const isNotFound = error?.statusCode === 404;
      const isAuth = error?.statusCode === 401;

      // Don't retry 404s unless specifically requested
      if (isNotFound && !retryOnMissingEndpoint) {
        return false;
      }

      // Don't retry auth errors
      if (isAuth) {
        return false;
      }

      // Use default retry logic for other errors
      return failureCount < 3;
    },
    // Reduce error noise in development
    onError: silentFail ? undefined : queryOptions.onError,
  });
}

/**
 * 🎯 Generate sensible fallback data based on query key patterns
 */
function getDefaultFallbackData(queryKey: string[]): any {
  if (!queryKey || queryKey.length === 0) {
    return null;
  }

  const key = queryKey[0].toLowerCase();
  const isListQuery =
    queryKey.includes('list') ||
    key.endsWith('s') ||
    queryKey.includes('leaderboard');

  // Return empty arrays for list-like queries
  if (isListQuery) {
    return [];
  }

  // Return null for single item queries
  if (queryKey.includes('detail') || queryKey.includes('profile')) {
    return null;
  }

  // Return empty objects for stats/data queries
  if (
    key.includes('stats') ||
    key.includes('data') ||
    key.includes('profile')
  ) {
    return {};
  }

  // Default fallback
  return null;
}

/**
 * 🧪 Development helper to create mock data for missing endpoints
 */
export function createMockDataForQuery(queryKey: string[]): any {
  if (!queryKey || queryKey.length === 0) return null;

  const key = queryKey[0].toLowerCase();

  // Mock different types of data based on query key
  switch (key) {
    case 'merits':
      if (queryKey.includes('leaderboard')) {
        return [
          { id: '1', name: 'Usuario Demo 1', merits: 1500, rank: 1 },
          { id: '2', name: 'Usuario Demo 2', merits: 1200, rank: 2 },
          { id: '3', name: 'Usuario Demo 3', merits: 900, rank: 3 },
        ];
      }
      if (queryKey.includes('user')) {
        return { total: 750, earned_this_month: 150, rank: 5 };
      }
      return [];

    case 'wallet':
      return {
        balance: 1250,
        lukas: 1250,
        ondas: 85,
        pending_transactions: 2,
      };

    case 'notifications':
      return [
        {
          id: '1',
          title: 'Bienvenido a CoomÜnity',
          message: 'Tu cuenta ha sido creada exitosamente',
          type: 'info',
          read: false,
          created_at: new Date().toISOString(),
        },
      ];

    case 'stats':
      return {
        total_users: 1250,
        active_today: 45,
        challenges_completed: 234,
        videos_watched: 1420,
      };

    case 'videos':
    case 'playlists':
      return [];

    case 'mundos':
      return [
        {
          id: '1',
          name: 'Mundo Demo',
          description: 'Mundo de demostración',
          active: true,
          participants: 25,
        },
      ];

    case 'social':
      if (queryKey.includes('posts')) {
        return [];
      }
      if (queryKey.includes('matches')) {
        return [];
      }
      return [];

    default:
      return queryKey.includes('list') || key.endsWith('s') ? [] : null;
  }
}

/**
 * 🎭 Hook specifically for optional/experimental features
 */
export function useOptionalQuery<TData = unknown, TError = Error>(
  options: GracefulQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  return useGracefulQuery({
    ...options,
    silentFail: true, // Don't log errors for optional features
    fallbackData:
      options.fallbackData ??
      getDefaultFallbackData(options.queryKey as string[]),
  });
}

export default useGracefulQuery;
