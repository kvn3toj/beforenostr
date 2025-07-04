import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useDeleteRoleMutation } from './useDeleteRoleMutation';
import { deleteRole } from '../../../services/role.service';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type MockUseMutationResult<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown> = {
  mutate: jest.Mock<TData, [TVariables]>;
  isPending: boolean;
  error: TError | null;
  // Add other properties as needed for the specific mock
};

// Mock the role service
vi.mock('../../../services/role.service', () => ({
  deleteRole: vi.fn(),
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

describe('useDeleteRoleMutation', () => {
  const mockRoleId = '1';
  const mockError = new Error('Failed to delete role');

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

    const { result } = renderHook(() => useDeleteRoleMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful role deletion', async () => {
    // Mock deleteRole to return success
    vi.mocked(deleteRole).mockResolvedValue();

    // Mock useMutation to return success state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as MockUseMutationResult<void, Error, string>);

    const { result } = renderHook(() => useDeleteRoleMutation());

    // Call mutate with the test data
    result.current.mutate(mockRoleId);

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(deleteRole).toHaveBeenCalledWith(mockRoleId);
      expect(toast.success).toHaveBeenCalledWith('Rol eliminado con éxito');
      expect(useQueryClient().invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['roles'],
      });
    });
  });

  it('should handle error during role deletion', async () => {
    // Mock deleteRole to throw error
    vi.mocked(deleteRole).mockRejectedValue(mockError);

    // Mock useMutation to simulate error
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
    } as MockUseMutationResult<void, Error, string>);

    const { result } = renderHook(() => useDeleteRoleMutation());

    // Call mutate with the test data
    result.current.mutate(mockRoleId);

    // Wait for the error handling
    await waitFor(() => {
      expect(deleteRole).toHaveBeenCalledWith(mockRoleId);
      expect(toast.error).toHaveBeenCalledWith(`Error al eliminar el rol: ${mockError.message}`);
    });
  });

  it('should show loading state during mutation', async () => {
    // Mock useMutation to simulate loading state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } as MockUseMutationResult);

    const { result } = renderHook(() => useDeleteRoleMutation());

    expect(result.current.isPending).toBe(true);
  });

  it('should handle multiple deletions in sequence', async () => {
    // Mock deleteRole to return success
    vi.mocked(deleteRole).mockResolvedValue();

    // Mock useMutation to return success state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as MockUseMutationResult<void, Error, string>);

    const { result } = renderHook(() => useDeleteRoleMutation());

    // First deletion
    result.current.mutate(mockRoleId);
    await waitFor(() => {
      expect(deleteRole).toHaveBeenCalledWith(mockRoleId);
    });

    // Second deletion with different ID
    const secondRoleId = '2';
    result.current.mutate(secondRoleId);
    await waitFor(() => {
      expect(deleteRole).toHaveBeenCalledWith(secondRoleId);
    });

    // Verify that both deletions were handled
    expect(deleteRole).toHaveBeenCalledTimes(2);
    expect(toast.success).toHaveBeenCalledTimes(2);
    expect(useQueryClient().invalidateQueries).toHaveBeenCalledTimes(2);
  });
}); 