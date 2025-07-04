import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLeastViewedMundosQuery } from './useLeastViewedMundosQuery';
import * as analyticsService from '../../services/analytics.service';
import { LeastViewedMundosMetric } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchLeastViewedMundos: vi.fn(),
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

describe('useLeastViewedMundosQuery', () => {
  const mockLeastViewedMundosData: LeastViewedMundosMetric = [
    {
      id: 'mundo-1',
      name: 'Mundo Poco Visto 1',
      view_count: 12,
      thumbnail_url: 'https://example.com/least-mundo1.jpg',
    },
    {
      id: 'mundo-2',
      name: 'Mundo Poco Visto 2',
      view_count: 6,
      thumbnail_url: 'https://example.com/least-mundo2.jpg',
    },
    {
      id: 'mundo-3',
      name: 'Mundo Poco Visto 3',
      view_count: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch least viewed mundos successfully', async () => {
    vi.mocked(analyticsService.fetchLeastViewedMundos).mockResolvedValue(mockLeastViewedMundosData);

    const { result } = renderHook(() => useLeastViewedMundosQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockLeastViewedMundosData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchLeastViewedMundos).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchLeastViewedMundos).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useLeastViewedMundosQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch least viewed mundos';
    vi.mocked(analyticsService.fetchLeastViewedMundos).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLeastViewedMundosQuery(), {
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
    vi.mocked(analyticsService.fetchLeastViewedMundos).mockResolvedValue([]);

    const { result } = renderHook(() => useLeastViewedMundosQuery(), {
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
    vi.mocked(analyticsService.fetchLeastViewedMundos).mockResolvedValue(mockLeastViewedMundosData);

    const { result } = renderHook(() => useLeastViewedMundosQuery(), {
      wrapper: createWrapper(),
    });

    // The query key should be ['analytics', 'leastViewedMundos']
    expect(analyticsService.fetchLeastViewedMundos).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['analytics', 'leastViewedMundos'],
      })
    );
  });

  it('should handle mundos with very low view counts', async () => {
    const veryLowViewCountData: LeastViewedMundosMetric = [
      {
        id: 'mundo-1',
        name: 'Mundo con 0 vistas',
        view_count: 0,
      },
      {
        id: 'mundo-2',
        name: 'Mundo con 1 vista',
        view_count: 1,
      },
    ];

    vi.mocked(analyticsService.fetchLeastViewedMundos).mockResolvedValue(veryLowViewCountData);

    const { result } = renderHook(() => useLeastViewedMundosQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(veryLowViewCountData);
    expect(result.current.data?.[0].view_count).toBe(0);
    expect(result.current.data?.[1].view_count).toBe(1);
  });
}); 