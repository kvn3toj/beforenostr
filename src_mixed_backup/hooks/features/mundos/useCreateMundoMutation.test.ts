import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCreateMundoMutation } from './useCreateMundoMutation';
import { CreateMundoData, Mundo } from '../../../types/mundo.types';
import * as mundoService from '../../../services/mundo.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

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

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key, options) => {
      if (options && options.message) {
        // Simulate translation with message interpolation
        return `${key.replace('toast_error_', 'Error al ').replace('_mundo', ' el mundo').replace('creating','crear')}: ${options.message}`;
      }
      // Simulate translation for other keys
      const translations: { [key: string]: string } = {
        'toast_mundo_created_success': 'Mundo creado exitosamente',
        'error_user_not_authenticated': 'Usuario no autenticado',
        'error_generic': 'Error desconocido',
        'toast_error_prefix': '¡Error!: {{ message }}',
      };
      return translations[key] || key;
    }),
  })),
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock the mutation function with default state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
      data: undefined,
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isError: false,
      isIdle: true,
      isPaused: false,
      isSuccess: false,
      mutateAsync: vi.fn(),
      reset: vi.fn(),
      status: 'idle',
      submittedAt: 0,
    });
    const { result } = renderHook(() => useCreateMundoMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should create mundo successfully and show success toast', async () => {
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
      data: mockCreatedMundo,
      variables: mockCreateMundoData,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isError: false,
      isIdle: false,
      isPaused: false,
      isSuccess: true,
      mutateAsync: vi.fn(),
      reset: vi.fn(),
      status: 'success',
      submittedAt: 0,
    });

    // Mock the service response
    vi.mocked(mundoService.createMundo).mockResolvedValueOnce(mockCreatedMundo);

    const { result } = renderHook(() => useCreateMundoMutation());

    // Manually trigger the onSuccess callback for testing the toast
    // In a real scenario, useMutation handles calling this after the async operation
    result.current.onSuccess();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Mundo creado exitosamente');
    });
  });

  it('should show a specific error message from API response when creating mundo fails', async () => {
    const apiError = {
      response: {
        data: {
          message: 'Nombre de mundo ya existe'
        }
      }
    };
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: apiError as any, // Cast to any for mocking purposes
      data: undefined,
      variables: mockCreateMundoData,
      context: undefined,
      failureCount: 1,
      failureReason: apiError as any,
      isError: true,
      isIdle: false,
      isPaused: false,
      isSuccess: false,
      mutateAsync: vi.fn(),
      reset: vi.fn(),
      status: 'error',
      submittedAt: 0,
    });

    // Mock the service to throw an error
    vi.mocked(mundoService.createMundo).mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useCreateMundoMutation());

    // Manually trigger the onError callback for testing the toast
    result.current.onError(apiError);

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the API error message
      expect(toast.error).toHaveBeenCalledWith('Error al crear el mundo: Nombre de mundo ya existe');
    });
  });

  it('should show a generic error message for a standard Error object', async () => {
    const standardError = new Error('Network error');
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: standardError,
      data: undefined,
      variables: mockCreateMundoData,
      context: undefined,
      failureCount: 1,
      failureReason: standardError,
      isError: true,
      isIdle: false,
      isPaused: false,
      isSuccess: false,
      mutateAsync: vi.fn(),
      reset: vi.fn(),
      status: 'error',
      submittedAt: 0,
    });

    // Mock the service to throw an error
    vi.mocked(mundoService.createMundo).mockRejectedValueOnce(standardError);

    const { result } = renderHook(() => useCreateMundoMutation());

    // Manually trigger the onError callback
    result.current.onError(standardError);

    await waitFor(() => {
      // Expect toast.error to be called with the translated prefix and the standard error message
      expect(toast.error).toHaveBeenCalledWith('¡Error!: Network error');
    });
  });

  it('should show a generic error message for an unknown error type', async () => {
    const unknownError = 'Something went wrong'; // Simulate a non-Error, non-object error
    // Mock the mutation function error state
     vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: unknownError as any, // Cast to any for mocking purposes
      data: undefined,
      variables: mockCreateMundoData,
      context: undefined,
      failureCount: 1,
      failureReason: unknownError as any,
      isError: true,
      isIdle: false,
      isPaused: false,
      isSuccess: false,
      mutateAsync: vi.fn(),
      reset: vi.fn(),
      status: 'error',
      submittedAt: 0,
    });

    // Mock the service to throw an error
    vi.mocked(mundoService.createMundo).mockRejectedValueOnce(unknownError);

    const { result } = renderHook(() => useCreateMundoMutation());

    // Manually trigger the onError callback
    result.current.onError(unknownError);

    await waitFor(() => {
      // Expect toast.error to be called with the translated generic error message
      expect(toast.error).toHaveBeenCalledWith('¡Error!: Error desconocido');
    });
  });

}); 