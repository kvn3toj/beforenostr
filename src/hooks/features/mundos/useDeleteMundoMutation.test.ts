import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useDeleteMundoMutation } from './useDeleteMundoMutation';
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
  deleteMundo: vi.fn()
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useDeleteMundoMutation', () => {
  const mockMundoId = '123';
  const mockError = new Error('Failed to delete mundo');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useDeleteMundoMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should delete mundo successfully', async () => {
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
    vi.mocked(mundoService.deleteMundo).mockResolvedValueOnce();

    const { result } = renderHook(() => useDeleteMundoMutation());

    // Call mutate
    result.current.mutate(mockMundoId);

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(mundoService.deleteMundo).toHaveBeenCalledWith(mockMundoId);
      expect(toast.success).toHaveBeenCalledWith('Mundo eliminado con éxito');
      expect(result.current.isPending).toBe(false);
    });
  });

  it('should handle error when deleting mundo fails', async () => {
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
    vi.mocked(mundoService.deleteMundo).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useDeleteMundoMutation());

    // Call mutate
    result.current.mutate(mockMundoId);

    // Wait for the error to be handled
    await waitFor(() => {
      expect(mundoService.deleteMundo).toHaveBeenCalledWith(mockMundoId);
      expect(toast.error).toHaveBeenCalledWith(
        `Error al eliminar el mundo: ${mockError.message}`
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

    const { result } = renderHook(() => useDeleteMundoMutation());

    expect(result.current.isPending).toBe(true);
  });
}); 