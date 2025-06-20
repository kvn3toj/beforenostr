import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopViewedMundosQuery } from './useTopViewedMundosQuery';
import * as analyticsService from '../../services/analytics.service';
import { TopViewedMundosMetric } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchTopViewedMundos: vi.fn(),
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

describe('useTopViewedMundosQuery', () => {
  const mockTopViewedMundosData: TopViewedMundosMetric = [
    {
      id: 'mundo-1',
      name: 'Mundo de Matemáticas',
      view_count: 1250,
      thumbnail_url: 'https://example.com/math-mundo.jpg',
    },
    {
      id: 'mundo-2',
      name: 'Mundo de Ciencias',
      view_count: 980,
      thumbnail_url: 'https://example.com/science-mundo.jpg',
    },
    {
      id: 'mundo-3',
      name: 'Mundo de Historia',
      view_count: 750,
      thumbnail_url: 'https://example.com/history-mundo.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch top viewed mundos successfully', async () => {
    vi.mocked(analyticsService.fetchTopViewedMundos).mockResolvedValue(mockTopViewedMundosData);

    const { result } = renderHook(() => useTopViewedMundosQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTopViewedMundosData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchTopViewedMundos).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchTopViewedMundos).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useTopViewedMundosQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch top viewed mundos';
    vi.mocked(analyticsService.fetchTopViewedMundos).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTopViewedMundosQuery(), {
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
    vi.mocked(analyticsService.fetchTopViewedMundos).mockResolvedValue([]);

    const { result } = renderHook(() => useTopViewedMundosQuery(), {
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
    vi.mocked(analyticsService.fetchTopViewedMundos).mockResolvedValue(mockTopViewedMundosData);

    const { result } = renderHook(() => useTopViewedMundosQuery(), {
      wrapper: createWrapper(),
    });

    // The query key should be ['analytics', 'topViewedMundos']
    expect(analyticsService.fetchTopViewedMundos).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['analytics', 'topViewedMundos'],
      })
    );
  });

  it('should handle mundos without thumbnail_url', async () => {
    const mockDataWithoutThumbnails: TopViewedMundosMetric = [
      {
        id: 'mundo-1',
        name: 'Mundo sin Thumbnail',
        view_count: 500,
      },
    ];

    vi.mocked(analyticsService.fetchTopViewedMundos).mockResolvedValue(mockDataWithoutThumbnails);

    const { result } = renderHook(() => useTopViewedMundosQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockDataWithoutThumbnails);
    expect(result.current.data?.[0].thumbnail_url).toBeUndefined();
  });
}); 