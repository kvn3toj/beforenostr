import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useActiveUsersOverTimeQuery } from './useActiveUsersOverTimeQuery';
import * as analyticsService from '../../services/analytics.service';
import { ActiveUsersOverTimeMetric, TimeRangeParams } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchActiveUsersOverTime: vi.fn(),
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

describe('useActiveUsersOverTimeQuery', () => {
  const mockTimeRangeParams: TimeRangeParams = {
    interval: 'day',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
  };

  const mockActiveUsersOverTimeData: ActiveUsersOverTimeMetric = [
    {
      time_period: '2024-01-01T00:00:00Z',
      count: 25,
    },
    {
      time_period: '2024-01-02T00:00:00Z',
      count: 32,
    },
    {
      time_period: '2024-01-03T00:00:00Z',
      count: 28,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch active users over time successfully', async () => {
    vi.mocked(analyticsService.fetchActiveUsersOverTime).mockResolvedValue(mockActiveUsersOverTimeData);

    const { result } = renderHook(() => useActiveUsersOverTimeQuery(mockTimeRangeParams), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockActiveUsersOverTimeData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchActiveUsersOverTime).toHaveBeenCalledWith(mockTimeRangeParams);
    expect(analyticsService.fetchActiveUsersOverTime).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchActiveUsersOverTime).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useActiveUsersOverTimeQuery(mockTimeRangeParams), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch active users over time';
    vi.mocked(analyticsService.fetchActiveUsersOverTime).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useActiveUsersOverTimeQuery(mockTimeRangeParams), {
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
    vi.mocked(analyticsService.fetchActiveUsersOverTime).mockResolvedValue(mockActiveUsersOverTimeData);

    const customParams: TimeRangeParams = {
      interval: 'week',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-29T23:59:59Z',
    };

    const { result } = renderHook(() => useActiveUsersOverTimeQuery(customParams), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(analyticsService.fetchActiveUsersOverTime).toHaveBeenCalledWith(customParams);
  });

  it('should update when parameters change', async () => {
    vi.mocked(analyticsService.fetchActiveUsersOverTime).mockResolvedValue(mockActiveUsersOverTimeData);

    const { result, rerender } = renderHook(
      ({ params }) => useActiveUsersOverTimeQuery(params),
      {
        wrapper: createWrapper(),
        initialProps: { params: mockTimeRangeParams },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(analyticsService.fetchActiveUsersOverTime).toHaveBeenCalledWith(mockTimeRangeParams);

    // Change parameters
    const newParams: TimeRangeParams = {
      interval: 'month',
      startDate: '2024-03-01T00:00:00Z',
      endDate: '2024-03-31T23:59:59Z',
    };

    rerender({ params: newParams });

    await waitFor(() => {
      expect(analyticsService.fetchActiveUsersOverTime).toHaveBeenCalledWith(newParams);
    });

    expect(analyticsService.fetchActiveUsersOverTime).toHaveBeenCalledTimes(2);
  });
}); 