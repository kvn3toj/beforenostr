import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCreateUserMutation } from './useCreateUserMutation';
import { createUser } from '../services/user.service';
import { CreateUserData, User } from '../types/user.types';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

type MockUseMutationResult<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown> = {
  mutate: jest.Mock<TData, [TVariables]>;
  isPending: boolean;
  error: TError | null;
  // Add other properties as needed for the specific mock
};

// Mock the user service
vi.mock('../services/user.service', () => ({
  createUser: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCreateUserMutation', () => {
  const mockCreateUserData: CreateUserData = {
    email: 'test@example.com',
    role_id: '1',
    password: 'password123',
    is_active: true,
  };

  const mockCreatedUser: User = {
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
  };

  const mockError = new Error('Failed to create user');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock useMutation to return initial state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    } as MockUseMutationResult);

    const { result } = renderHook(() => useCreateUserMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful user creation', async () => {
    // Mock createUser to return success
    vi.mocked(createUser).mockResolvedValue(mockCreatedUser);

    // Mock useMutation to simulate success
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as MockUseMutationResult<User, Error, CreateUserData>);

    const { result } = renderHook(() => useCreateUserMutation());

    // Simulate mutation success
    await result.current.mutate(mockCreateUserData);

    await waitFor(() => {
      // Verify createUser was called with correct data
      expect(createUser).toHaveBeenCalledWith(mockCreateUserData);
      
      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Usuario creado exitosamente');
      
      // Verify query invalidation
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['users'],
      });
    });
  });

  it('should handle error during user creation', async () => {
    // Mock createUser to throw error
    vi.mocked(createUser).mockRejectedValue(mockError);

    // Mock useMutation to simulate error
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
    } as MockUseMutationResult<User, Error, CreateUserData>);

    const { result } = renderHook(() => useCreateUserMutation());

    // Simulate mutation error
    await result.current.mutate(mockCreateUserData);

    await waitFor(() => {
      // Verify createUser was called with correct data
      expect(createUser).toHaveBeenCalledWith(mockCreateUserData);
      
      // Verify error toast was shown
      expect(toast.error).toHaveBeenCalledWith('Error al crear usuario');
      
      // Verify query was not invalidated
      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });

  it('should show loading state during mutation', async () => {
    // Mock useMutation to simulate loading state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } as MockUseMutationResult);

    const { result } = renderHook(() => useCreateUserMutation());

    expect(result.current.isPending).toBe(true);
  });
}); 