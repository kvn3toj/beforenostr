import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLeastInteractedPlaylistsQuery } from './useLeastInteractedPlaylistsQuery';
import * as analyticsService from '../../services/analytics.service';
import { LeastInteractedPlaylistsMetric } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchLeastInteractedPlaylists: vi.fn(),
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

describe('useLeastInteractedPlaylistsQuery', () => {
  const mockLeastInteractedPlaylistsData: LeastInteractedPlaylistsMetric = [
    {
      id: 'playlist-1',
      name: 'Playlist Poco Interactiva 1',
      interaction_count: 5,
      content_type: 'playlist',
      thumbnail_url: 'https://example.com/least-interactive1.jpg',
    },
    {
      id: 'playlist-2',
      name: 'Playlist Poco Interactiva 2',
      interaction_count: 2,
      content_type: 'playlist',
      thumbnail_url: 'https://example.com/least-interactive2.jpg',
    },
    {
      id: 'playlist-3',
      name: 'Playlist Poco Interactiva 3',
      interaction_count: 0,
      content_type: 'playlist',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch least interacted playlists successfully', async () => {
    vi.mocked(analyticsService.fetchLeastInteractedPlaylists).mockResolvedValue(mockLeastInteractedPlaylistsData);

    const { result } = renderHook(() => useLeastInteractedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockLeastInteractedPlaylistsData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchLeastInteractedPlaylists).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchLeastInteractedPlaylists).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useLeastInteractedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch least interacted playlists';
    vi.mocked(analyticsService.fetchLeastInteractedPlaylists).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLeastInteractedPlaylistsQuery(), {
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
    vi.mocked(analyticsService.fetchLeastInteractedPlaylists).mockResolvedValue([]);

    const { result } = renderHook(() => useLeastInteractedPlaylistsQuery(), {
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
    vi.mocked(analyticsService.fetchLeastInteractedPlaylists).mockResolvedValue(mockLeastInteractedPlaylistsData);

    const { result } = renderHook(() => useLeastInteractedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    // The query key should be ['analytics', 'leastInteractedPlaylists']
    expect(analyticsService.fetchLeastInteractedPlaylists).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['analytics', 'leastInteractedPlaylists'],
      })
    );
  });

  it('should handle playlists with zero interactions', async () => {
    const zeroInteractionData: LeastInteractedPlaylistsMetric = [
      {
        id: 'playlist-1',
        name: 'Playlist sin Interacciones',
        interaction_count: 0,
        content_type: 'playlist',
      },
    ];

    vi.mocked(analyticsService.fetchLeastInteractedPlaylists).mockResolvedValue(zeroInteractionData);

    const { result } = renderHook(() => useLeastInteractedPlaylistsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(zeroInteractionData);
    expect(result.current.data?.[0].interaction_count).toBe(0);
    expect(result.current.data?.[0].content_type).toBe('playlist');
  });
}); 