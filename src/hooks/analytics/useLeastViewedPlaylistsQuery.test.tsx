import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLeastViewedPlaylistsQuery } from './useLeastViewedPlaylistsQuery';
import * as analyticsService from '../../services/analytics.service';
import { LeastViewedPlaylistsMetric } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchLeastViewedPlaylists: vi.fn(),
}));

// Utility to create a mock for useQuery result
function createQueryResultMock<T>({ data = undefined, isLoading = false, isError = false, error = null } = {}) {
  return {
    data,
    isLoading,
    isError,
    error,
    isSuccess: !isLoading && !isError && data !== undefined,
    isFetching: isLoading,
    refetch: vi.fn(),
    remove: vi.fn(),
    status: isLoading ? 'pending' : isError ? 'error' : 'success',
  };
}

// Utility to create a mock for useMutation result
function createMutationResultMock<T>({ data = undefined, isPending = false, isError = false, error = null } = {}) {
  return {
    data,
    isPending,
    isError,
    error,
    isSuccess: !isPending && !isError && data !== undefined,
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    status: isPending ? 'pending' : isError ? 'error' : 'success',
  };
}

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useLeastViewedPlaylistsQuery', () => {
  const mockLeastViewedPlaylistsData: LeastViewedPlaylistsMetric = [
    {
      id: 'playlist-1',
      name: 'Playlist Poco Vista 1',
      view_count: 15,
      thumbnail_url: 'https://example.com/least-playlist1.jpg',
    },
    {
      id: 'playlist-2',
      name: 'Playlist Poco Vista 2',
      view_count: 8,
      thumbnail_url: 'https://example.com/least-playlist2.jpg',
    },
    {
      id: 'playlist-3',
      name: 'Playlist Poco Vista 3',
      view_count: 3,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch least viewed playlists successfully', async () => {
    vi.mocked(analyticsService.fetchLeastViewedPlaylists).mockResolvedValue(mockLeastViewedPlaylistsData);

    const { result } = renderHook(() => useLeastViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockLeastViewedPlaylistsData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchLeastViewedPlaylists).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchLeastViewedPlaylists).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useLeastViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch least viewed playlists';
    vi.mocked(analyticsService.fetchLeastViewedPlaylists).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLeastViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle empty results', async () => {
    vi.mocked(analyticsService.fetchLeastViewedPlaylists).mockResolvedValue([]);

    const { result } = renderHook(() => useLeastViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should use correct query key', () => {
    vi.mocked(analyticsService.fetchLeastViewedPlaylists).mockResolvedValue(mockLeastViewedPlaylistsData);

    const { result } = renderHook(() => useLeastViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    // The query key should be ['analytics', 'leastViewedPlaylists']
    expect(analyticsService.fetchLeastViewedPlaylists).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['analytics', 'leastViewedPlaylists'],
      })
    );
  });

  it('should handle playlists with low view counts', async () => {
    const lowViewCountData: LeastViewedPlaylistsMetric = [
      {
        id: 'playlist-1',
        name: 'Playlist con 0 vistas',
        view_count: 0,
      },
      {
        id: 'playlist-2',
        name: 'Playlist con 1 vista',
        view_count: 1,
      },
    ];

    vi.mocked(analyticsService.fetchLeastViewedPlaylists).mockResolvedValue(lowViewCountData);

    const { result } = renderHook(() => useLeastViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(lowViewCountData);
    expect(result.current.data?.[0].view_count).toBe(0);
    expect(result.current.data?.[1].view_count).toBe(1);
  });
}); 