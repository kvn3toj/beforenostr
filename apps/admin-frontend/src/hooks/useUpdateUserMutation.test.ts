import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useUpdateUserMutation } from './useUpdateUserMutation';
import { updateUser } from '../services/user.service';
import { UpdateUserData, User } from '../types/user.types';
import { toast } from 'sonner';

// Mock the user service
vi.mock('../services/user.service', () => ({
  updateUser: vi.fn(),
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

describe('useUpdateUserMutation', () => {
  const mockUserId = '1';
  const mockUpdateUserData: UpdateUserData = {
    email: 'updated@example.com',
    role_id: '2',
    is_active: false,
  };

  const mockUpdatedUser: User = {
    id: mockUserId,
    email: 'updated@example.com',
    role_id: '2',
    role: {
      id: '2',
      name: 'Editor',
      permissions: ['read'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    last_login: null,
    is_active: false,
  };

  const mockError = new Error('Failed to update user');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock useMutation to return initial state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useUpdateUserMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful user update', async () => {
    // Mock updateUser to return success
    vi.mocked(updateUser).mockResolvedValue(mockUpdatedUser);

    // Mock useMutation to simulate success
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useUpdateUserMutation());

    // Simulate mutation success
    await result.current.mutate({ id: mockUserId, data: mockUpdateUserData });

    await waitFor(() => {
      // Verify updateUser was called with correct data
      expect(updateUser).toHaveBeenCalledWith(mockUserId, mockUpdateUserData);
      
      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Usuario actualizado exitosamente');
      
      // Verify query invalidation
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['users'],
      });
    });
  });

  it('should handle error during user update', async () => {
    // Mock updateUser to throw error
    vi.mocked(updateUser).mockRejectedValue(mockError);

    // Mock useMutation to simulate error
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
    } as any);

    const { result } = renderHook(() => useUpdateUserMutation());

    // Simulate mutation error
    await result.current.mutate({ id: mockUserId, data: mockUpdateUserData });

    await waitFor(() => {
      // Verify updateUser was called with correct data
      expect(updateUser).toHaveBeenCalledWith(mockUserId, mockUpdateUserData);
      
      // Verify error toast was shown
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar usuario');
      
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
    } as any);

    const { result } = renderHook(() => useUpdateUserMutation());

    expect(result.current.isPending).toBe(true);
  });
}); 