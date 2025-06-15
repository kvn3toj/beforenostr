import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useUsersQuery } from './useUsersQuery';
import { fetchUsers, FetchUsersParams } from '../services/user.service';
import { User } from '../types/user.types';
import { useQuery } from '@tanstack/react-query';

type MockUseQueryResult<TData = unknown, TError = unknown> = {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  isSuccess: boolean;
  // Add other properties as needed for the specific mock
};

// Mock the user service
vi.mock('../services/user.service', () => ({
  fetchUsers: vi.fn(),
}));

// Mock useQuery
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
      name: 'Test User',
      avatarUrl: null,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      lastLogin: null,
      role: {
        id: '1',
        name: 'Admin',
        permissions: ['read', 'write'],
      },
    },
  ];

  const mockResponse = {
    data: mockUsers,
    count: 1,
    total: 1,
    page: 0,
    pageSize: 10,
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
    } as MockUseQueryResult);

    const { result } = renderHook(() => useUsersQuery(mockParams));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should return success state with data', () => {
    // Mock useQuery to return success state
    vi.mocked(useQuery).mockReturnValue({
      data: mockResponse,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as MockUseQueryResult);

    const { result } = renderHook(() => useUsersQuery(mockParams));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isSuccess).toBe(true);
  });

  it('should return error state', () => {
    const mockError = new Error('Failed to fetch users');
    
    // Mock useQuery to return error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      isSuccess: false,
    } as MockUseQueryResult);

    const { result } = renderHook(() => useUsersQuery(mockParams));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
  });

  it('should call useQuery with correct parameters', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    } as MockUseQueryResult);

    renderHook(() => useUsersQuery(mockParams));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['users', mockParams],
      queryFn: expect.any(Function),
    });
  });
}); 