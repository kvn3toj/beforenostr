import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAvailablePermissionsQuery } from './useAvailablePermissionsQuery';
import { fetchAvailablePermissions } from '../../../services/role.service';
import { AvailablePermissionsList } from '../../../types/user.types';
import { useQuery } from '@tanstack/react-query';

type MockUseQueryResult<TData = unknown, TError = unknown> = {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  // Add other properties as needed for the specific mock
};

// Mock the role service
vi.mock('../../../services/role.service', () => ({
  fetchAvailablePermissions: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useAvailablePermissionsQuery', () => {
  const mockPermissions: AvailablePermissionsList = [
    'read:users',
    'write:users',
    'delete:users',
    'read:roles',
    'write:roles',
    'delete:roles',
  ];

  const mockError = new Error('Failed to fetch available permissions');

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

    const { result } = renderHook(() => useAvailablePermissionsQuery());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful permissions fetch', async () => {
    // Mock fetchAvailablePermissions to return success
    vi.mocked(fetchAvailablePermissions).mockResolvedValue(mockPermissions);

    // Mock useQuery to return success state
    vi.mocked(useQuery).mockReturnValue({
      data: mockPermissions,
      isLoading: false,
      isError: false,
      error: null,
    } as MockUseQueryResult<AvailablePermissionsList, Error>);

    const { result } = renderHook(() => useAvailablePermissionsQuery());

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockPermissions);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    // Verify that fetchAvailablePermissions was called
    expect(fetchAvailablePermissions).toHaveBeenCalled();
  });

  it('should handle error during permissions fetch', async () => {
    // Mock fetchAvailablePermissions to throw error
    vi.mocked(fetchAvailablePermissions).mockRejectedValue(mockError);

    // Mock useQuery to return error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as MockUseQueryResult<undefined, Error>);

    const { result } = renderHook(() => useAvailablePermissionsQuery());

    // Wait for the error state
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
    });

    // Verify that fetchAvailablePermissions was called
    expect(fetchAvailablePermissions).toHaveBeenCalled();
  });

  it('should use correct query key', () => {
    // Mock useQuery to capture the options passed to it
    const mockUseQuery = vi.fn();
    vi.mocked(useQuery).mockImplementation(mockUseQuery);

    renderHook(() => useAvailablePermissionsQuery());

    // Verify that useQuery was called with the correct query key
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['roles', 'availablePermissions'],
      })
    );
  });

  it('should handle empty permissions list', async () => {
    // Mock fetchAvailablePermissions to return empty array
    vi.mocked(fetchAvailablePermissions).mockResolvedValue([]);

    // Mock useQuery to return success state with empty data
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as MockUseQueryResult<AvailablePermissionsList, Error>);

    const { result } = renderHook(() => useAvailablePermissionsQuery());

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual([]);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    // Verify that fetchAvailablePermissions was called
    expect(fetchAvailablePermissions).toHaveBeenCalled();
  });
}); 