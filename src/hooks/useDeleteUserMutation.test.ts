import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDeleteUserMutation } from './useDeleteUserMutation';
import { deleteUser } from '../services/user.service';
import { toast } from 'sonner';

// Mock the user service
vi.mock('../services/user.service', () => ({
  deleteUser: vi.fn(),
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

describe('useDeleteUserMutation', () => {
  const mockUserId = '1';
  const mockError = new Error('Failed to delete user');

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

    const { result } = renderHook(() => useDeleteUserMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful user deletion', async () => {
    // Mock deleteUser to return success (void)
    vi.mocked(deleteUser).mockResolvedValue();

    // Mock useMutation to simulate success
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDeleteUserMutation());

    // Simulate mutation success
    await result.current.mutate(mockUserId);

    await waitFor(() => {
      // Verify deleteUser was called with correct ID
      expect(deleteUser).toHaveBeenCalledWith(mockUserId);
      
      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Usuario eliminado exitosamente');
      
      // Verify query invalidation
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['users'],
      });
    });
  });

  it('should handle error during user deletion', async () => {
    // Mock deleteUser to throw error
    vi.mocked(deleteUser).mockRejectedValue(mockError);

    // Mock useMutation to simulate error
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
    } as any);

    const { result } = renderHook(() => useDeleteUserMutation());

    // Simulate mutation error
    await result.current.mutate(mockUserId);

    await waitFor(() => {
      // Verify deleteUser was called with correct ID
      expect(deleteUser).toHaveBeenCalledWith(mockUserId);
      
      // Verify error toast was shown
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar usuario');
      
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

    const { result } = renderHook(() => useDeleteUserMutation());

    expect(result.current.isPending).toBe(true);
  });
}); 