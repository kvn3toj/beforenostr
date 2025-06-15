import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTotalMundosQuery } from './useTotalMundosQuery';
import * as analyticsService from '../../services/analytics.service';
import { TotalCountMetric } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchTotalMundos: vi.fn(),
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

describe('useTotalMundosQuery', () => {
  const mockTotalMundosData: TotalCountMetric = {
    count: 42,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch total mundos successfully', async () => {
    vi.mocked(analyticsService.fetchTotalMundos).mockResolvedValue(mockTotalMundosData);

    const { result } = renderHook(() => useTotalMundosQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTotalMundosData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchTotalMundos).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchTotalMundos).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useTotalMundosQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch total mundos';
    vi.mocked(analyticsService.fetchTotalMundos).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTotalMundosQuery(), {
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

  it('should use correct query key', () => {
    vi.mocked(analyticsService.fetchTotalMundos).mockResolvedValue(mockTotalMundosData);

    const { result } = renderHook(() => useTotalMundosQuery(), {
      wrapper: createWrapper(),
    });

    // The query key should be ['analytics', 'totalMundos']
    expect(analyticsService.fetchTotalMundos).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['analytics', 'totalMundos'],
      })
    );
  });
}); 