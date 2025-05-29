import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useUpdateRoleMutation } from './useUpdateRoleMutation';
import { updateRole, UpdateRoleData } from '../../../services/role.service';
import { Role } from '../../../types/user.types';
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
  updateRole: vi.fn(),
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

describe('useUpdateRoleMutation', () => {
  const mockRoleId = '1';
  const mockUpdateRoleData: UpdateRoleData = {
    name: 'Updated Role Name',
  };

  const mockUpdatedRole: Role = {
    id: mockRoleId,
    name: 'Updated Role Name',
    permissions: ['read', 'write'],
    created_at: '2024-01-01',
    updated_at: '2024-01-02',
  };

  const mockError = new Error('Failed to update role');

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

    const { result } = renderHook(() => useUpdateRoleMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful role update', async () => {
    // Mock updateRole to return success
    vi.mocked(updateRole).mockResolvedValue(mockUpdatedRole);

    // Mock useMutation to return success state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as MockUseMutationResult<Role, Error, { id: string, data: UpdateRoleData }>);

    const { result } = renderHook(() => useUpdateRoleMutation());

    // Call mutate with the test data
    result.current.mutate({ id: mockRoleId, data: mockUpdateRoleData });

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(updateRole).toHaveBeenCalledWith(mockRoleId, mockUpdateRoleData);
      expect(toast.success).toHaveBeenCalledWith('Rol actualizado con éxito');
      expect(useQueryClient().invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['roles'],
      });
    });
  });

  it('should handle error during role update', async () => {
    // Mock updateRole to throw error
    vi.mocked(updateRole).mockRejectedValue(mockError);

    // Mock useMutation to simulate error
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
    } as MockUseMutationResult<Role, Error, { id: string, data: UpdateRoleData }>);

    const { result } = renderHook(() => useUpdateRoleMutation());

    // Call mutate with the test data
    result.current.mutate({ id: mockRoleId, data: mockUpdateRoleData });

    // Wait for the error handling
    await waitFor(() => {
      expect(updateRole).toHaveBeenCalledWith(mockRoleId, mockUpdateRoleData);
      expect(toast.error).toHaveBeenCalledWith(`Error al actualizar el rol: ${mockError.message}`);
    });
  });

  it('should show loading state during mutation', async () => {
    // Mock useMutation to simulate loading state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } as MockUseMutationResult);

    const { result } = renderHook(() => useUpdateRoleMutation());

    expect(result.current.isPending).toBe(true);
  });

  it('should handle multiple updates in sequence', async () => {
    // Mock updateRole to return success
    vi.mocked(updateRole).mockResolvedValue(mockUpdatedRole);

    // Mock useMutation to return success state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as MockUseMutationResult<Role, Error, { id: string, data: UpdateRoleData }>);

    const { result } = renderHook(() => useUpdateRoleMutation());

    // First update
    result.current.mutate({ id: mockRoleId, data: mockUpdateRoleData });
    await waitFor(() => {
      expect(updateRole).toHaveBeenCalledWith(mockRoleId, mockUpdateRoleData);
    });

    // Second update with different data
    const secondUpdateData: UpdateRoleData = {
      name: 'Another Updated Name',
    };
    result.current.mutate({ id: mockRoleId, data: secondUpdateData });
    await waitFor(() => {
      expect(updateRole).toHaveBeenCalledWith(mockRoleId, secondUpdateData);
    });

    // Verify that both updates were handled
    expect(updateRole).toHaveBeenCalledTimes(2);
    expect(toast.success).toHaveBeenCalledTimes(2);
    expect(useQueryClient().invalidateQueries).toHaveBeenCalledTimes(2);
  });
}); 