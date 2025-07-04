import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLeastInteractedMundosQuery } from './useLeastInteractedMundosQuery';
import * as analyticsService from '../../services/analytics.service';
import { LeastInteractedMundosMetric } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchLeastInteractedMundos: vi.fn(),
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

describe('useLeastInteractedMundosQuery', () => {
  const mockLeastInteractedMundosData: LeastInteractedMundosMetric = [
    {
      id: 'mundo-1',
      name: 'Mundo Poco Interactivo 1',
      interaction_count: 8,
      content_type: 'mundo',
      thumbnail_url: 'https://example.com/least-interactive-mundo1.jpg',
    },
    {
      id: 'mundo-2',
      name: 'Mundo Poco Interactivo 2',
      interaction_count: 3,
      content_type: 'mundo',
      thumbnail_url: 'https://example.com/least-interactive-mundo2.jpg',
    },
    {
      id: 'mundo-3',
      name: 'Mundo Poco Interactivo 3',
      interaction_count: 0,
      content_type: 'mundo',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch least interacted mundos successfully', async () => {
    vi.mocked(analyticsService.fetchLeastInteractedMundos).mockResolvedValue(mockLeastInteractedMundosData);

    const { result } = renderHook(() => useLeastInteractedMundosQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockLeastInteractedMundosData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchLeastInteractedMundos).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchLeastInteractedMundos).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useLeastInteractedMundosQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch least interacted mundos';
    vi.mocked(analyticsService.fetchLeastInteractedMundos).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLeastInteractedMundosQuery(), {
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
    vi.mocked(analyticsService.fetchLeastInteractedMundos).mockResolvedValue([]);

    const { result } = renderHook(() => useLeastInteractedMundosQuery(), {
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
    vi.mocked(analyticsService.fetchLeastInteractedMundos).mockResolvedValue(mockLeastInteractedMundosData);

    const { result } = renderHook(() => useLeastInteractedMundosQuery(), {
      wrapper: createWrapper(),
    });

    // The query key should be ['analytics', 'leastInteractedMundos']
    expect(analyticsService.fetchLeastInteractedMundos).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['analytics', 'leastInteractedMundos'],
      })
    );
  });

  it('should handle mundos with zero interactions', async () => {
    const zeroInteractionData: LeastInteractedMundosMetric = [
      {
        id: 'mundo-1',
        name: 'Mundo sin Interacciones',
        interaction_count: 0,
        content_type: 'mundo',
      },
    ];

    vi.mocked(analyticsService.fetchLeastInteractedMundos).mockResolvedValue(zeroInteractionData);

    const { result } = renderHook(() => useLeastInteractedMundosQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(zeroInteractionData);
    expect(result.current.data?.[0].interaction_count).toBe(0);
    expect(result.current.data?.[0].content_type).toBe('mundo');
  });

  it('should handle mundos with content_type validation', async () => {
    const validContentTypeData: LeastInteractedMundosMetric = [
      {
        id: 'mundo-1',
        name: 'Mundo Válido',
        interaction_count: 5,
        content_type: 'mundo',
      },
    ];

    vi.mocked(analyticsService.fetchLeastInteractedMundos).mockResolvedValue(validContentTypeData);

    const { result } = renderHook(() => useLeastInteractedMundosQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(validContentTypeData);
    expect(result.current.data?.[0].content_type).toBe('mundo');
  });
}); 