import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCreatePlaylistMutation } from './useCreatePlaylistMutation';
import { createPlaylist } from '../../../services/playlist.service';
import type { CreatePlaylistData, Playlist } from '../../../types/playlist.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type MockUseMutationResult<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown> = {
  mutate: jest.Mock<TData, [TVariables]>;
  isPending: boolean;
  error: TError | null;
  data?: TData;
  variables?: TVariables;
  context?: TContext;
  failureCount?: number;
  failureReason?: TError | null;
  isError: boolean;
  isIdle?: boolean;
  isPaused?: boolean;
  isSuccess: boolean;
  mutateAsync?: jest.Mock<Promise<TData>, [TVariables]>;
  reset?: jest.Mock<void, []>;
  status?: 'idle' | 'pending' | 'success' | 'error';
  submittedAt?: number;
  onSuccess?: jest.Mock<void, [TData, TVariables, TContext | undefined]>;
  onError?: jest.Mock<void, [TError, TVariables, TContext | undefined]>;
  onSettled?: jest.Mock<void, [TData | undefined, TError | null, TVariables, TContext | undefined]>;
};

// Mock the playlist service
vi.mock('../../../services/playlist.service', () => ({
  createPlaylist: vi.fn(),
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

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key, options) => {
      if (options && options.message) {
        // Simulate translation with message interpolation
        // Adjust this logic based on how your keys are structured
        if (key === 'toast_error_creating_playlist') {
           return `Error al crear la playlist: ${options.message}`;
        } else if (key === 'toast_error_prefix') {
           return `¡Error!: ${options.message}`;
        }
      }
      // Simulate translation for other keys
      const translations: { [key: string]: string } = {
        'toast_playlist_created_success': 'Playlist creada exitosamente',
        'error_user_not_authenticated': 'Usuario no autenticado',
        'error_generic': 'Error desconocido',
        'toast_error_creating_playlist': 'Error al crear la playlist: {{ message }}',
      };
      return translations[key] || key;
    }),
  })),
}));

describe('useCreatePlaylistMutation', () => {
  const mockCreatePlaylistData: CreatePlaylistData = {
    name: 'Test Playlist',
    mundo_id: '123',
    published_at: null,
    unpublished_at: null,
  };

  const mockCreatedPlaylist: Playlist = {
    id: '1',
    mundo_id: '123',
    name: 'Test Playlist',
    description: 'Test Description',
    order_index: 0,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    is_active: true,
    published_at: null,
    unpublished_at: null,
    version: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock useMutation to return default state with onSuccess and onError callbacks
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
      onSuccess: vi.fn(), // Mock this to test the success toast
      onError: vi.fn(), // Mock this to test the error toasts
    } as MockUseMutationResult<Playlist, Error, CreatePlaylistData>);
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useCreatePlaylistMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('should handle successful playlist creation and show success toast', async () => {
    // Mock useMutation to simulate successful mutation and provide the onSuccess callback
    const mockOnSuccess = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
      data: mockCreatedPlaylist,
      isError: false,
      isSuccess: true,
      onSuccess: mockOnSuccess, // Use the mockOnsSuccess here
    } as MockUseMutationResult<Playlist, Error, CreatePlaylistData>);

    // Mock createPlaylist to return mock data (this mock is not strictly needed for testing the onSuccess callback call itself, but good practice)
    vi.mocked(createPlaylist).mockResolvedValue(mockCreatedPlaylist);

    const { result } = renderHook(() => useCreatePlaylistMutation());

    // Manually call the mocked onSuccess callback as it would be called by React Query
    act(() => {
      result.current.onSuccess();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Playlist creada exitosamente');
      // The invalidateQueries is called within the actual hook's onSuccess, which is not mocked here.
      // If you want to test that, you'd mock queryClient.invalidateQueries.
    });
  });

  it('should show a specific error message from API response when creating playlist fails', async () => {
    const apiError: any = {
      response: {
        data: {
          message: 'Nombre de playlist ya existe'
        }
      }
    };

    // Mock useMutation to simulate error state and provide the onError callback
    const mockOnError = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: apiError,
      isError: true,
      isSuccess: false,
      onError: mockOnError, // Use the mockOnError here
    } as MockUseMutationResult<Playlist, any, CreatePlaylistData>);

    // Mock createPlaylist to throw the API error (not strictly needed for testing onError callback call, but good practice)
    vi.mocked(createPlaylist).mockRejectedValue(apiError);

    const { result } = renderHook(() => useCreatePlaylistMutation());

    // Manually trigger the onError callback with the mock API error
    act(() => {
       result.current.onError(apiError);
    });

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the API error message
      expect(toast.error).toHaveBeenCalledWith('Error al crear la playlist: Nombre de playlist ya existe');
    });
  });

  it('should show a standard error message for a standard Error object', async () => {
    const standardError = new Error('Network error');

    // Mock useMutation to simulate error state and provide the onError callback
    const mockOnError = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: standardError,
      isError: true,
      isSuccess: false,
      onError: mockOnError, // Use the mockOnError here
    } as MockUseMutationResult<Playlist, Error, CreatePlaylistData>);

    // Mock createPlaylist to throw the standard error
    vi.mocked(createPlaylist).mockRejectedValue(standardError);

    const { result } = renderHook(() => useCreatePlaylistMutation());

    // Manually trigger the onError callback with the standard error
    act(() => {
      result.current.onError(standardError);
    });

    await waitFor(() => {
      // Expect toast.error to be called with the translated prefix and the standard error message
      expect(toast.error).toHaveBeenCalledWith('¡Error!: Network error');
    });
  });

  it('should show a generic error message for an unknown error type', async () => {
    const unknownError = 'Something went wrong'; // Simulate a non-Error, non-object error

    // Mock useMutation to simulate error state and provide the onError callback
    const mockOnError = vi.fn();
     vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: unknownError,
      isError: true,
      isSuccess: false,
      onError: mockOnError, // Use the mockOnError here
    } as MockUseMutationResult<Playlist, unknown, CreatePlaylistData>);

    // Mock createPlaylist to throw the unknown error type
    vi.mocked(createPlaylist).mockRejectedValue(unknownError);

    const { result } = renderHook(() => useCreatePlaylistMutation());

    // Manually trigger the onError callback with the unknown error type
    act(() => {
      result.current.onError(unknownError);
    });

    await waitFor(() => {
      // Expect toast.error to be called with the translated generic error message
      expect(toast.error).toHaveBeenCalledWith('¡Error!: Error desconocido');
    });
  });

  it('should show loading state during mutation', () => {
    // Mock useMutation to simulate loading state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
      isError: false,
      isSuccess: false,
    } as MockUseMutationResult);

    const { result } = renderHook(() => useCreatePlaylistMutation());

    expect(result.current.isPending).toBe(true);
  });
}); 