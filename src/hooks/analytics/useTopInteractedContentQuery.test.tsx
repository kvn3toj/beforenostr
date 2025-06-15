import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopInteractedContentQuery } from './useTopInteractedContentQuery';
import * as analyticsService from '../../services/analytics.service';
import { TopInteractedContentMetric } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchTopInteractedContent: vi.fn(),
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

describe('useTopInteractedContentQuery', () => {
  const mockTopInteractedContentData: TopInteractedContentMetric = [
    {
      id: 'content-1',
      name: 'Matemáticas Avanzadas',
      interaction_count: 450,
      content_type: 'playlist',
      thumbnail_url: 'https://example.com/math-content.jpg',
    },
    {
      id: 'content-2',
      name: 'Mundo de Ciencias',
      interaction_count: 380,
      content_type: 'mundo',
      thumbnail_url: 'https://example.com/science-content.jpg',
    },
    {
      id: 'content-3',
      name: 'Historia Contemporánea',
      interaction_count: 320,
      content_type: 'playlist',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch top interacted content successfully', async () => {
    vi.mocked(analyticsService.fetchTopInteractedContent).mockResolvedValue(mockTopInteractedContentData);

    const { result } = renderHook(() => useTopInteractedContentQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTopInteractedContentData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchTopInteractedContent).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchTopInteractedContent).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useTopInteractedContentQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch top interacted content';
    vi.mocked(analyticsService.fetchTopInteractedContent).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTopInteractedContentQuery(), {
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
    vi.mocked(analyticsService.fetchTopInteractedContent).mockResolvedValue([]);

    const { result } = renderHook(() => useTopInteractedContentQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle mixed content types', async () => {
    const mixedContentData: TopInteractedContentMetric = [
      {
        id: 'playlist-1',
        name: 'Playlist Interactiva',
        interaction_count: 200,
        content_type: 'playlist',
      },
      {
        id: 'mundo-1',
        name: 'Mundo Interactivo',
        interaction_count: 150,
        content_type: 'mundo',
      },
    ];

    vi.mocked(analyticsService.fetchTopInteractedContent).mockResolvedValue(mixedContentData);

    const { result } = renderHook(() => useTopInteractedContentQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mixedContentData);
    expect(result.current.data?.[0].content_type).toBe('playlist');
    expect(result.current.data?.[1].content_type).toBe('mundo');
  });

  it('should use correct query key', () => {
    vi.mocked(analyticsService.fetchTopInteractedContent).mockResolvedValue(mockTopInteractedContentData);

    const { result } = renderHook(() => useTopInteractedContentQuery(), {
      wrapper: createWrapper(),
    });

    // The query key should be ['analytics', 'topInteractedContent']
    expect(analyticsService.fetchTopInteractedContent).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['analytics', 'topInteractedContent'],
      })
    );
  });
}); 