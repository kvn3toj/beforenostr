import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCreateMundoMutation } from './useCreateMundoMutation';
import { CreateMundoData, Mundo } from '../../../types/mundo.types';
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
  createMundo: vi.fn()
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

describe('useCreateMundoMutation', () => {
  const mockCreateMundoData: CreateMundoData = {
    name: 'Test Mundo',
    description: 'Test Description',
    thumbnail_url: 'https://example.com/thumbnail.jpg',
    is_active: true,
    published_at: '2024-01-01T00:00:00Z',
    unpublished_at: null
  };

  const mockCreatedMundo: Mundo = {
    id: '123',
    name: 'Test Mundo',
    description: 'Test Description',
    thumbnail_url: 'https://example.com/thumbnail.jpg',
    created_by: 'test-user-id',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_active: true,
    published_at: '2024-01-01T00:00:00Z',
    unpublished_at: null,
    version: 1
  };

  const mockError = new Error('Failed to create mundo');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useCreateMundoMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should create mundo successfully', async () => {
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
    vi.mocked(mundoService.createMundo).mockResolvedValueOnce(mockCreatedMundo);

    const { result } = renderHook(() => useCreateMundoMutation());

    // Call mutate
    result.current.mutate(mockCreateMundoData);

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(mundoService.createMundo).toHaveBeenCalledWith(
        mockCreateMundoData,
        'test-user-id'
      );
      expect(toast.success).toHaveBeenCalledWith('Mundo creado con éxito');
      expect(result.current.isPending).toBe(false);
    });
  });

  it('should handle error when creating mundo fails', async () => {
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
    vi.mocked(mundoService.createMundo).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useCreateMundoMutation());

    // Call mutate
    result.current.mutate(mockCreateMundoData);

    // Wait for the error to be handled
    await waitFor(() => {
      expect(mundoService.createMundo).toHaveBeenCalledWith(
        mockCreateMundoData,
        'test-user-id'
      );
      expect(toast.error).toHaveBeenCalledWith(
        `Error al crear el mundo: ${mockError.message}`
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

    const { result } = renderHook(() => useCreateMundoMutation());

    expect(result.current.isPending).toBe(true);
  });
}); 