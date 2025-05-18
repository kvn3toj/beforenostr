import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCreateRoleMutation } from './useCreateRoleMutation';
import { createRole } from '../../../services/role.service';
import { Role } from '../../../types/user.types';
import { CreateRoleData } from '../../../components/features/roles/components/RoleForm';
import { toast } from 'sonner';

// Mock the role service
vi.mock('../../../services/role.service', () => ({
  createRole: vi.fn(),
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

describe('useCreateRoleMutation', () => {
  const mockCreateRoleData: CreateRoleData = {
    name: 'Test Role',
  };

  const mockCreatedRole: Role = {
    id: '1',
    name: 'Test Role',
    permissions: [],
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  const mockError = new Error('Failed to create role');

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

    const { result } = renderHook(() => useCreateRoleMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful role creation', async () => {
    // Mock createRole to return success
    vi.mocked(createRole).mockResolvedValue(mockCreatedRole);

    // Mock useMutation to return success state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useCreateRoleMutation());

    // Call mutate with the test data
    result.current.mutate(mockCreateRoleData);

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(createRole).toHaveBeenCalledWith(mockCreateRoleData);
      expect(toast.success).toHaveBeenCalledWith('Rol creado con éxito');
      expect(useQueryClient().invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['roles'],
      });
    });
  });

  it('should handle error during role creation', async () => {
    // Mock createRole to throw error
    vi.mocked(createRole).mockRejectedValue(mockError);

    // Mock useMutation to return error state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
    } as any);

    const { result } = renderHook(() => useCreateRoleMutation());

    // Call mutate with the test data
    result.current.mutate(mockCreateRoleData);

    // Wait for the error handling
    await waitFor(() => {
      expect(createRole).toHaveBeenCalledWith(mockCreateRoleData);
      expect(toast.error).toHaveBeenCalledWith(`Error al crear el rol: ${mockError.message}`);
    });
  });

  it('should show loading state during mutation', async () => {
    // Mock useMutation to return loading state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } as any);

    const { result } = renderHook(() => useCreateRoleMutation());

    expect(result.current.isPending).toBe(true);
  });

  it('should handle multiple mutations in sequence', async () => {
    // Mock createRole to return success
    vi.mocked(createRole).mockResolvedValue(mockCreatedRole);

    // Mock useMutation to return success state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useCreateRoleMutation());

    // First mutation
    result.current.mutate(mockCreateRoleData);
    await waitFor(() => {
      expect(createRole).toHaveBeenCalledWith(mockCreateRoleData);
    });

    // Second mutation with different data
    const secondRoleData: CreateRoleData = {
      name: 'Another Role',
    };
    result.current.mutate(secondRoleData);
    await waitFor(() => {
      expect(createRole).toHaveBeenCalledWith(secondRoleData);
    });

    // Verify that both mutations were handled
    expect(createRole).toHaveBeenCalledTimes(2);
    expect(toast.success).toHaveBeenCalledTimes(2);
    expect(useQueryClient().invalidateQueries).toHaveBeenCalledTimes(2);
  });
}); 