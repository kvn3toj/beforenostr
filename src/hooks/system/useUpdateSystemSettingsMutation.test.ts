import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useUpdateSystemSettingsMutation } from './useUpdateSystemSettingsMutation';
import { updateSystemSettings } from '../../services/system.service';
import type { SystemSettings, UpdateSystemSettingsData } from '../../types/system.types';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type MockUseMutationResult<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown> = {
  mutate: jest.Mock<TData, [TVariables]>;
  isPending: boolean;
  error: TError | null;
  // Add other properties as needed for the specific mock
};

// Mock the system service
vi.mock('../../services/system.service', () => ({
  updateSystemSettings: vi.fn(),
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

describe('useUpdateSystemSettingsMutation', () => {
  const mockSettings: SystemSettings = {
    id: '1',
    app_name: 'Test App',
    default_role_id: 'role-1',
    maintenance_mode: false,
    max_upload_size_mb: 10,
    allowed_file_types: ['jpg', 'png', 'pdf'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockUpdateData: UpdateSystemSettingsData = {
    app_name: 'Updated App Name',
    maintenance_mode: true,
  };

  const mockError = new Error('Failed to update system settings');

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

    const { result } = renderHook(() => useUpdateSystemSettingsMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful settings update', async () => {
    // Mock updateSystemSettings to return success
    vi.mocked(updateSystemSettings).mockResolvedValue(mockSettings);

    // Mock useMutation to return success state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as MockUseMutationResult<SystemSettings, Error, { id: string, data: UpdateSystemSettingsData }>);

    const { result } = renderHook(() => useUpdateSystemSettingsMutation());

    // Call mutate with test data
    result.current.mutate({ id: '1', data: mockUpdateData });

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(updateSystemSettings).toHaveBeenCalledWith('1', mockUpdateData);
      expect(toast.success).toHaveBeenCalledWith('Configuración actualizada correctamente');
    });
  });

  it('should handle error during settings update', async () => {
    // Mock updateSystemSettings to throw error
    vi.mocked(updateSystemSettings).mockRejectedValue(mockError);

    // Mock useMutation to return error state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
    } as MockUseMutationResult<SystemSettings, Error, { id: string, data: UpdateSystemSettingsData }>);

    const { result } = renderHook(() => useUpdateSystemSettingsMutation());

    // Call mutate with test data
    result.current.mutate({ id: '1', data: mockUpdateData });

    // Wait for the error handling
    await waitFor(() => {
      expect(updateSystemSettings).toHaveBeenCalledWith('1', mockUpdateData);
      expect(toast.error).toHaveBeenCalledWith(`Error al actualizar la configuración: ${mockError.message}`);
    });
  });

  it('should show loading state during mutation', () => {
    // Mock useMutation to return loading state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
    } as MockUseMutationResult);

    const { result } = renderHook(() => useUpdateSystemSettingsMutation());

    expect(result.current.isPending).toBe(true);
  });

  it('should invalidate settings query cache on success', async () => {
    // Mock updateSystemSettings to return success
    vi.mocked(updateSystemSettings).mockResolvedValue(mockSettings);

    // Mock useMutation to return success state
    const mockMutate = vi.fn();
    const mockInvalidateQueries = vi.fn();
    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as MockUseMutationResult<SystemSettings, Error, { id: string, data: UpdateSystemSettingsData }>);

    const { result } = renderHook(() => useUpdateSystemSettingsMutation());

    // Call mutate with test data
    result.current.mutate({ id: '1', data: mockUpdateData });

    // Wait for the cache invalidation
    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['system', 'settings'] });
    });
  });
}); 