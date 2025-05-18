import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useUpdateMundoMutation } from './useUpdateMundoMutation';
import { UpdateMundoData, Mundo } from '../../../types/mundo.types';
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
  updateMundo: vi.fn()
}));

// Mock the auth store
vi.mock('../../../store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useUpdateMundoMutation', () => {
  const mockUpdateMundoData: UpdateMundoData = {
    name: 'Updated Mundo',
    description: 'Updated Description',
    thumbnail_url: 'https://example.com/updated-thumbnail.jpg',
    is_active: false,
    published_at: '2024-01-02T00:00:00Z',
    unpublished_at: '2024-01-03T00:00:00Z'
  };

  const mockUpdatedMundo: Mundo = {
    id: '123',
    name: 'Updated Mundo',
    description: 'Updated Description',
    thumbnail_url: 'https://example.com/updated-thumbnail.jpg',
    created_by: 'original-user-id',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    is_active: false,
    published_at: '2024-01-02T00:00:00Z',
    unpublished_at: '2024-01-03T00:00:00Z',
    version: 2
  };

  const mockError = new Error('Failed to update mundo');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useUpdateMundoMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update mundo successfully', async () => {
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
    vi.mocked(mundoService.updateMundo).mockResolvedValueOnce(mockUpdatedMundo);

    const { result } = renderHook(() => useUpdateMundoMutation());

    // Call mutate
    result.current.mutate({ id: '123', data: mockUpdateMundoData });

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(mundoService.updateMundo).toHaveBeenCalledWith(
        '123',
        mockUpdateMundoData,
        'test-user-id'
      );
      expect(toast.success).toHaveBeenCalledWith('Mundo actualizado con éxito');
      expect(result.current.isPending).toBe(false);
    });
  });

  it('should handle error when updating mundo fails', async () => {
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
    vi.mocked(mundoService.updateMundo).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateMundoMutation());

    // Call mutate
    result.current.mutate({ id: '123', data: mockUpdateMundoData });

    // Wait for the error to be handled
    await waitFor(() => {
      expect(mundoService.updateMundo).toHaveBeenCalledWith(
        '123',
        mockUpdateMundoData,
        'test-user-id'
      );
      expect(toast.error).toHaveBeenCalledWith(
        `Error al actualizar el mundo: ${mockError.message}`
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

    const { result } = renderHook(() => useUpdateMundoMutation());

    expect(result.current.isPending).toBe(true);
  });
}); 