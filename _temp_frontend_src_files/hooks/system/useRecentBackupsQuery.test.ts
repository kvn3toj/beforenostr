import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useRecentBackupsQuery } from './useRecentBackupsQuery';
import { fetchRecentBackups } from '../../services/system.service';
import type { RecentBackupsMetric, BackupStatus } from '../../types/system.types';
import { useQuery } from '@tanstack/react-query';

type MockUseQueryResult<TData = unknown, TError = unknown> = {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  // Add other properties as needed for the specific mock
};

// Mock the system service
vi.mock('../../services/system.service', () => ({
  fetchRecentBackups: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useRecentBackupsQuery', () => {
  const mockBackups: RecentBackupsMetric = [
    {
      id: '1',
      timestamp: '2024-01-01T00:00:00Z',
      status: 'success',
      file_size: 1024,
      type: 'manual',
    },
    {
      id: '2',
      timestamp: '2024-01-02T00:00:00Z',
      status: 'success',
      file_size: 2048,
      type: 'automatic',
    },
  ];

  const mockError = new Error('Failed to fetch recent backups');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    // Mock useQuery to return initial loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as MockUseQueryResult);

    const { result } = renderHook(() => useRecentBackupsQuery());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful backups fetch', async () => {
    // Mock fetchRecentBackups to return success
    vi.mocked(fetchRecentBackups).mockResolvedValue(mockBackups);

    // Mock useQuery to return success state
    vi.mocked(useQuery).mockReturnValue({
      data: mockBackups,
      isLoading: false,
      isError: false,
      error: null,
    } as MockUseQueryResult<RecentBackupsMetric>);

    const { result } = renderHook(() => useRecentBackupsQuery());

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockBackups);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    // Verify that fetchRecentBackups was called
    expect(fetchRecentBackups).toHaveBeenCalled();
  });

  it('should handle error during backups fetch', async () => {
    // Mock fetchRecentBackups to throw error
    vi.mocked(fetchRecentBackups).mockRejectedValue(mockError);

    // Mock useQuery to return error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as MockUseQueryResult<undefined, Error>);

    const { result } = renderHook(() => useRecentBackupsQuery());

    // Wait for the error state
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
    });

    // Verify that fetchRecentBackups was called
    expect(fetchRecentBackups).toHaveBeenCalled();
  });

  it('should use correct query key', () => {
    // Mock useQuery to capture the options passed to it
    const mockUseQuery = vi.fn();
    vi.mocked(useQuery).mockImplementation(mockUseQuery);

    renderHook(() => useRecentBackupsQuery());

    // Verify that useQuery was called with the correct query key
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['system', 'recentBackups'],
      })
    );
  });

  it('should handle empty backups array', async () => {
    // Mock fetchRecentBackups to return empty array
    vi.mocked(fetchRecentBackups).mockResolvedValue([]);

    // Mock useQuery to return success state with empty data
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as MockUseQueryResult<RecentBackupsMetric>);

    const { result } = renderHook(() => useRecentBackupsQuery());

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    // Verify that fetchRecentBackups was called
    expect(fetchRecentBackups).toHaveBeenCalled();
  });
}); 