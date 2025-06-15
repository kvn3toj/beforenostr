import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMundosCreatedOverTimeQuery } from './useMundosCreatedOverTimeQuery';
import * as analyticsService from '../../services/analytics.service';
import { TimeSeriesDataPoint, TimeRangeParams } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchMundosCreatedOverTime: vi.fn(),
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

describe('useMundosCreatedOverTimeQuery', () => {
  const mockTimeRangeParams: TimeRangeParams = {
    interval: 'day',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
  };

  const mockMundosCreatedOverTimeData: TimeSeriesDataPoint[] = [
    {
      time_period: '2024-01-01T00:00:00Z',
      count: 2,
    },
    {
      time_period: '2024-01-02T00:00:00Z',
      count: 1,
    },
    {
      time_period: '2024-01-03T00:00:00Z',
      count: 3,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch mundos created over time successfully', async () => {
    vi.mocked(analyticsService.fetchMundosCreatedOverTime).mockResolvedValue(mockMundosCreatedOverTimeData);

    const { result } = renderHook(() => useMundosCreatedOverTimeQuery(mockTimeRangeParams), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMundosCreatedOverTimeData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchMundosCreatedOverTime).toHaveBeenCalledWith(mockTimeRangeParams);
    expect(analyticsService.fetchMundosCreatedOverTime).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchMundosCreatedOverTime).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useMundosCreatedOverTimeQuery(mockTimeRangeParams), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch mundos created over time';
    vi.mocked(analyticsService.fetchMundosCreatedOverTime).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useMundosCreatedOverTimeQuery(mockTimeRangeParams), {
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

  it('should call service with correct parameters', async () => {
    vi.mocked(analyticsService.fetchMundosCreatedOverTime).mockResolvedValue(mockMundosCreatedOverTimeData);

    const customParams: TimeRangeParams = {
      interval: 'week',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-29T23:59:59Z',
    };

    const { result } = renderHook(() => useMundosCreatedOverTimeQuery(customParams), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(analyticsService.fetchMundosCreatedOverTime).toHaveBeenCalledWith(customParams);
  });

  it('should update when parameters change', async () => {
    vi.mocked(analyticsService.fetchMundosCreatedOverTime).mockResolvedValue(mockMundosCreatedOverTimeData);

    const { result, rerender } = renderHook(
      ({ params }) => useMundosCreatedOverTimeQuery(params),
      {
        wrapper: createWrapper(),
        initialProps: { params: mockTimeRangeParams },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(analyticsService.fetchMundosCreatedOverTime).toHaveBeenCalledWith(mockTimeRangeParams);

    // Change parameters
    const newParams: TimeRangeParams = {
      interval: 'month',
      startDate: '2024-03-01T00:00:00Z',
      endDate: '2024-03-31T23:59:59Z',
    };

    rerender({ params: newParams });

    await waitFor(() => {
      expect(analyticsService.fetchMundosCreatedOverTime).toHaveBeenCalledWith(newParams);
    });

    expect(analyticsService.fetchMundosCreatedOverTime).toHaveBeenCalledTimes(2);
  });
}); 