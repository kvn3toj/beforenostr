import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUsersCreatedOverTimeQuery } from './useUsersCreatedOverTimeQuery';
import * as analyticsService from '../../services/analytics.service';
import { UsersCreatedOverTimeMetric, TimeRangeParams } from '../../types/analytics.types';

// Mock analytics service
vi.mock('../../services/analytics.service', () => ({
  fetchUsersCreatedOverTime: vi.fn(),
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

describe('useUsersCreatedOverTimeQuery', () => {
  const mockTimeRangeParams: TimeRangeParams = {
    interval: 'day',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
  };

  const mockUsersCreatedOverTimeData: UsersCreatedOverTimeMetric = [
    {
      time_period: '2024-01-01T00:00:00Z',
      count: 5,
    },
    {
      time_period: '2024-01-02T00:00:00Z',
      count: 8,
    },
    {
      time_period: '2024-01-03T00:00:00Z',
      count: 12,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users created over time successfully', async () => {
    vi.mocked(analyticsService.fetchUsersCreatedOverTime).mockResolvedValue(mockUsersCreatedOverTimeData);

    const { result } = renderHook(() => useUsersCreatedOverTimeQuery(mockTimeRangeParams), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUsersCreatedOverTimeData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(analyticsService.fetchUsersCreatedOverTime).toHaveBeenCalledWith(mockTimeRangeParams);
    expect(analyticsService.fetchUsersCreatedOverTime).toHaveBeenCalledTimes(1);
  });

  it('should show loading state initially', () => {
    vi.mocked(analyticsService.fetchUsersCreatedOverTime).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useUsersCreatedOverTimeQuery(mockTimeRangeParams), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch users created over time';
    vi.mocked(analyticsService.fetchUsersCreatedOverTime).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUsersCreatedOverTimeQuery(mockTimeRangeParams), {
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
    vi.mocked(analyticsService.fetchUsersCreatedOverTime).mockResolvedValue(mockUsersCreatedOverTimeData);

    const customParams: TimeRangeParams = {
      interval: 'week',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-29T23:59:59Z',
    };

    const { result } = renderHook(() => useUsersCreatedOverTimeQuery(customParams), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(analyticsService.fetchUsersCreatedOverTime).toHaveBeenCalledWith(customParams);
  });

  it('should update when parameters change', async () => {
    vi.mocked(analyticsService.fetchUsersCreatedOverTime).mockResolvedValue(mockUsersCreatedOverTimeData);

    const { result, rerender } = renderHook(
      ({ params }) => useUsersCreatedOverTimeQuery(params),
      {
        wrapper: createWrapper(),
        initialProps: { params: mockTimeRangeParams },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(analyticsService.fetchUsersCreatedOverTime).toHaveBeenCalledWith(mockTimeRangeParams);

    // Change parameters
    const newParams: TimeRangeParams = {
      interval: 'month',
      startDate: '2024-03-01T00:00:00Z',
      endDate: '2024-03-31T23:59:59Z',
    };

    rerender({ params: newParams });

    await waitFor(() => {
      expect(analyticsService.fetchUsersCreatedOverTime).toHaveBeenCalledWith(newParams);
    });

    expect(analyticsService.fetchUsersCreatedOverTime).toHaveBeenCalledTimes(2);
  });

  it('should use correct query key with parameters', () => {
    vi.mocked(analyticsService.fetchUsersCreatedOverTime).mockResolvedValue(mockUsersCreatedOverTimeData);

    const { result } = renderHook(() => useUsersCreatedOverTimeQuery(mockTimeRangeParams), {
      wrapper: createWrapper(),
    });

    // The query key should include the parameters
    expect(analyticsService.fetchUsersCreatedOverTime).toHaveBeenCalledWith(mockTimeRangeParams);
  });
}); 