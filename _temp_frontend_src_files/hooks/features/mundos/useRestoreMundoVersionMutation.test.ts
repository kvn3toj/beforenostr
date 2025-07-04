import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useRestoreMundoVersionMutation } from './useRestoreMundoVersionMutation';
import { Mundo } from '../../../types/mundo.types';
import * as mundoService from '../../../services/mundo.service';
import { toast } from 'sonner';

// Mock the react-query hooks
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn()
  }))
}));

// Mock the mundo service
vi.mock('../../../services/mundo.service', () => ({
  restoreMundoVersion: vi.fn()
}));

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useRestoreMundoVersionMutation', () => {
  const mockMundoId = '123';
  const mockVersionId = 'v1';
  const mockRestoredMundo: Mundo = {
    id: mockMundoId,
    name: 'Restored Mundo',
    description: 'Restored Description',
    thumbnail_url: 'https://example.com/restored-thumbnail.jpg',
    created_by: 'user123',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    is_active: true,
    published_at: '2024-01-02T00:00:00Z',
    unpublished_at: null,
    version: 2
  };

  const mockError = new Error('Failed to restore mundo version');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useRestoreMundoVersionMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should restore mundo version successfully', async () => {
    // Mock the mutation function
    const mockMutate = vi.fn();
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      onSuccess: mockOnSuccess,
      onError: mockOnError
    });

    // Mock the service response
    vi.mocked(mundoService.restoreMundoVersion).mockResolvedValueOnce(mockRestoredMundo);

    const { result } = renderHook(() => useRestoreMundoVersionMutation());

    // Call mutate
    result.current.mutate({ mundoId: mockMundoId, versionId: mockVersionId });

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(mundoService.restoreMundoVersion).toHaveBeenCalledWith(
        mockMundoId,
        mockVersionId
      );
      expect(toast.success).toHaveBeenCalledWith('Versión restaurada con éxito');
      expect(result.current.isPending).toBe(false);
    });

    // Verify that queryClient.invalidateQueries was called twice with correct queryKeys
    const queryClient = vi.mocked(useQueryClient)();
    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2);
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['mundos', mockMundoId]
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['mundos', mockMundoId, 'versions']
    });
  });

  it('should handle error when restoring mundo version fails', async () => {
    // Mock the mutation function
    const mockMutate = vi.fn();
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
      onSuccess: mockOnSuccess,
      onError: mockOnError
    });

    // Mock the service to throw an error
    vi.mocked(mundoService.restoreMundoVersion).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useRestoreMundoVersionMutation());

    // Call mutate
    result.current.mutate({ mundoId: mockMundoId, versionId: mockVersionId });

    // Wait for the error to be handled
    await waitFor(() => {
      expect(mundoService.restoreMundoVersion).toHaveBeenCalledWith(
        mockMundoId,
        mockVersionId
      );
      expect(toast.error).toHaveBeenCalledWith(
        `Error al restaurar la versión: ${mockError.message}`
      );
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('should show loading state while mutation is in progress', async () => {
    // Mock the mutation function with isPending true
    const mockMutate = vi.fn();
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
      onSuccess: mockOnSuccess,
      onError: mockOnError
    });

    const { result } = renderHook(() => useRestoreMundoVersionMutation());

    expect(result.current.isPending).toBe(true);
  });
}); 