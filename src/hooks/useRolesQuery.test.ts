import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useRolesQuery } from './useRolesQuery';
import { fetchRoles, FetchRolesParams } from '../services/role.service';
import { Role } from '../types/user.types';

// Mock the role service
vi.mock('../services/role.service', () => ({
  fetchRoles: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useRolesQuery', () => {
  const mockParams: FetchRolesParams = {
    page: 0,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
    filters: {
      name: 'admin',
    },
  };

  const mockRoles: Role[] = [
    {
      id: '1',
      name: 'Admin',
      permissions: ['read', 'write'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'Editor',
      permissions: ['read'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  const mockResponse = {
    data: mockRoles,
    count: 2,
  };

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
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useRolesQuery(mockParams));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle successful data fetching', async () => {
    // Mock useQuery to return success state with data
    vi.mocked(useQuery).mockReturnValue({
      data: mockResponse,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useRolesQuery(mockParams));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.isError).toBe(false);
    });

    // Verify that fetchRoles was called with correct parameters
    expect(fetchRoles).toHaveBeenCalledWith(mockParams);
  });

  it('should handle error state', async () => {
    const mockError = new Error('Failed to fetch roles');

    // Mock useQuery to return error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useRolesQuery(mockParams));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeUndefined();
    });

    // Verify that fetchRoles was called with correct parameters
    expect(fetchRoles).toHaveBeenCalledWith(mockParams);
  });

  it('should update query when parameters change', () => {
    const newParams: FetchRolesParams = {
      ...mockParams,
      page: 1,
      pageSize: 20,
      filters: {
        name: 'editor',
      },
    };

    // Mock useQuery to return success state
    vi.mocked(useQuery).mockReturnValue({
      data: mockResponse,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as any);

    const { rerender } = renderHook((params) => useRolesQuery(params), {
      initialProps: mockParams,
    });

    // Rerender with new parameters
    rerender(newParams);

    // Verify that useQuery was called with updated queryKey
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['roles', newParams],
      })
    );

    // Verify that fetchRoles was called with new parameters
    expect(fetchRoles).toHaveBeenCalledWith(newParams);
  });
}); 