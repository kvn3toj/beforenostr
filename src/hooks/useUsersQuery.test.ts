import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useUsersQuery } from './useUsersQuery';
import { fetchUsers, FetchUsersParams } from '../services/user.service';
import { User } from '../types/user.types';

// Mock the user service
vi.mock('../services/user.service', () => ({
  fetchUsers: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useUsersQuery', () => {
  const mockParams: FetchUsersParams = {
    page: 0,
    pageSize: 10,
    sortBy: 'email',
    sortDirection: 'asc',
    filters: {
      email: 'test@example.com',
      role_id: '1',
      is_active: true,
    },
  };

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'test@example.com',
      role_id: '1',
      role: {
        id: '1',
        name: 'Admin',
        permissions: ['read', 'write'],
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      last_login: null,
      is_active: true,
    },
  ];

  const mockResponse = {
    data: mockUsers,
    count: 1,
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

    const { result } = renderHook(() => useUsersQuery(mockParams));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle successful data fetching', async () => {
    // Mock fetchUsers to return mock data
    vi.mocked(fetchUsers).mockResolvedValue(mockResponse);

    // Mock useQuery to simulate loading and success states
    vi.mocked(useQuery).mockReturnValue({
      data: mockResponse,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useUsersQuery(mockParams));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockResponse);
    });

    // Verify fetchUsers was called with correct params
    expect(fetchUsers).toHaveBeenCalledWith(mockParams);
  });

  it('should handle error state', async () => {
    const mockError = new Error('Failed to fetch users');

    // Mock fetchUsers to throw error
    vi.mocked(fetchUsers).mockRejectedValue(mockError);

    // Mock useQuery to simulate error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useUsersQuery(mockParams));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
    });

    // Verify fetchUsers was called with correct params
    expect(fetchUsers).toHaveBeenCalledWith(mockParams);
  });

  it('should update query when params change', () => {
    const newParams: FetchUsersParams = {
      ...mockParams,
      page: 1,
      pageSize: 20,
      sortBy: 'created_at',
      sortDirection: 'desc',
      filters: {
        email: 'new@example.com',
      },
    };

    // Mock useQuery to verify it's called with correct queryKey
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    } as any);

    renderHook(() => useUsersQuery(newParams));

    // Verify useQuery was called with correct queryKey
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['users', newParams],
      queryFn: expect.any(Function),
    });

    // Verify fetchUsers would be called with new params
    expect(fetchUsers).toHaveBeenCalledWith(newParams);
  });
}); 