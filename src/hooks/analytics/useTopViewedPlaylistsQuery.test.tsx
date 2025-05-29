import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopViewedPlaylistsQuery } from './useTopViewedPlaylistsQuery';
import * as analyticsService from '../../services/analytics.service';
import { TopViewedPlaylistsMetric } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchTopViewedPlaylists: vi.fn(),
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

describe('useTopViewedPlaylistsQuery', () => {
  const mockTopViewedPlaylistsData: TopViewedPlaylistsMetric = [
    {
      id: 'playlist-1',
      name: 'Álgebra Básica',
      view_count: 2150,
      thumbnail_url: 'https://example.com/algebra-playlist.jpg',
    },
    {
      id: 'playlist-2',
      name: 'Física Cuántica',
      view_count: 1890,
      thumbnail_url: 'https://example.com/physics-playlist.jpg',
    },
    {
      id: 'playlist-3',
      name: 'Historia Mundial',
      view_count: 1650,
      thumbnail_url: 'https://example.com/history-playlist.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch top viewed playlists successfully', async () => {
    vi.mocked(analyticsService.fetchTopViewedPlaylists).mockResolvedValue(mockTopViewedPlaylistsData);

    const { result } = renderHook(() => useTopViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTopViewedPlaylistsData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchTopViewedPlaylists).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchTopViewedPlaylists).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useTopViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch top viewed playlists';
    vi.mocked(analyticsService.fetchTopViewedPlaylists).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTopViewedPlaylistsQuery(), {
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
    vi.mocked(analyticsService.fetchTopViewedPlaylists).mockResolvedValue([]);

    const { result } = renderHook(() => useTopViewedPlaylistsQuery(), {
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
    vi.mocked(analyticsService.fetchTopViewedPlaylists).mockResolvedValue(mockTopViewedPlaylistsData);

    const { result } = renderHook(() => useTopViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    // The query key should be ['analytics', 'topViewedPlaylists']
    expect(analyticsService.fetchTopViewedPlaylists).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['analytics', 'topViewedPlaylists'],
      })
    );
  });

  it('should handle playlists without thumbnail_url', async () => {
    const mockDataWithoutThumbnails: TopViewedPlaylistsMetric = [
      {
        id: 'playlist-1',
        name: 'Playlist sin Thumbnail',
        view_count: 800,
      },
    ];

    vi.mocked(analyticsService.fetchTopViewedPlaylists).mockResolvedValue(mockDataWithoutThumbnails);

    const { result } = renderHook(() => useTopViewedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockDataWithoutThumbnails);
    expect(result.current.data?.[0].thumbnail_url).toBeUndefined();
  });
}); 