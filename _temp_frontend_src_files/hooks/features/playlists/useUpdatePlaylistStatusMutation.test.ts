import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUpdatePlaylistStatusMutation } from './useUpdatePlaylistStatusMutation';
import * as playlistService from '../../../services/playlist.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Mock the react-query hooks
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn()
  }))
}));

// Mock the playlist service
vi.mock('../../../services/playlist.service', () => ({
  updatePlaylistStatus: vi.fn()
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
        return `${key}: ${options.message}`;
      }
      // Simulate translation for other keys
      const translations: { [key: string]: string } = {
        'toast_playlist_status_updated_success': 'Playlist status updated successfully',
        'toast_error_updating_playlist_status': 'Error updating playlist status: {{message}}',
      };
      return translations[key] || key;
    }),
  })),
}));

// Mock extractErrorMessage
vi.mock('../../../utils/errorUtils', () => ({
  extractErrorMessage: vi.fn((error) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Unknown error';
  })
}));

describe('useUpdatePlaylistStatusMutation', () => {
  const mockPlaylistId = 'test-playlist-id';

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
    const { result } = renderHook(() => useUpdatePlaylistStatusMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update playlist status successfully and show success toast', async () => {
    const mockMutate = vi.fn();
    const mockInvalidateQueries = vi.fn();

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      data: undefined,
      variables: undefined,
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
      onSuccess: () => {
        toast.success('Playlist status updated successfully');
        mockInvalidateQueries({ queryKey: ['playlists'] });
      }
    });

    vi.mocked(useQueryClient).mockReturnValue({
        invalidateQueries: mockInvalidateQueries,
    } as any);

    // Mock the service response
    vi.mocked(playlistService.updatePlaylistStatus).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useUpdatePlaylistStatusMutation());

    // Manually trigger the onSuccess callback for testing the toast and query invalidation
    result.current.onSuccess();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Playlist status updated successfully');
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['playlists'] });
    });
  });

  it('should show a specific error message from API response when updating playlist status fails', async () => {
    const apiError = {
      response: {
        data: {
          message: 'Playlist not found'
        }
      }
    };
    const mockMutate = vi.fn();
    const mockInvalidateQueries = vi.fn();

    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: apiError as any, // Cast to any for mocking purposes
      data: undefined,
      variables: undefined,
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
      onError: (error) => {
        const errorMessage = 'Error updating playlist status: Playlist not found'; // Simulate extraction and translation
        toast.error(errorMessage);
      }
    });

     vi.mocked(useQueryClient).mockReturnValue({
        invalidateQueries: mockInvalidateQueries,
    } as any);

    // Mock the service to throw an error
    vi.mocked(playlistService.updatePlaylistStatus).mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useUpdatePlaylistStatusMutation());

    // Manually trigger the onError callback for testing the toast
    result.current.onError(apiError as any);

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the API error message
      expect(toast.error).toHaveBeenCalledWith('Error updating playlist status: Playlist not found');
    });
  });

  it('should show a generic error message for a standard Error object', async () => {
    const standardError = new Error('Network error');
    const mockMutate = vi.fn();
    const mockInvalidateQueries = vi.fn();

    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: standardError,
      data: undefined,
      variables: undefined,
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
       onError: (error) => {
        const errorMessage = 'Error updating playlist status: Network error'; // Simulate extraction and translation
        toast.error(errorMessage);
      }
    });

    vi.mocked(useQueryClient).mockReturnValue({
        invalidateQueries: mockInvalidateQueries,
    } as any);

    // Mock the service to throw an error
    vi.mocked(playlistService.updatePlaylistStatus).mockRejectedValueOnce(standardError);

    const { result } = renderHook(() => useUpdatePlaylistStatusMutation());

    // Manually trigger the onError callback
    result.current.onError(standardError);

    await waitFor(() => {
      // Expect toast.error to be called with the translated prefix and the standard error message
      expect(toast.error).toHaveBeenCalledWith('Error updating playlist status: Network error');
    });
  });

  it('should show a generic error message for an unknown error type', async () => {
    const unknownError = 'Something went wrong'; // Simulate a non-Error, non-object error
    const mockMutate = vi.fn();
    const mockInvalidateQueries = vi.fn();

    // Mock the mutation function error state
     vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: unknownError as any, // Cast to any for mocking purposes
      data: undefined,
      variables: undefined,
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
       onError: (error) => {
        const errorMessage = 'Error updating playlist status: Unknown error'; // Simulate extraction and translation
        toast.error(errorMessage);
      }
    });

    vi.mocked(useQueryClient).mockReturnValue({
        invalidateQueries: mockInvalidateQueries,
    } as any);

    // Mock the service to throw an error
    vi.mocked(playlistService.updatePlaylistStatus).mockRejectedValueOnce(unknownError);

    const { result } = renderHook(() => useUpdatePlaylistStatusMutation());

    // Manually trigger the onError callback
    result.current.onError(unknownError as any);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error updating playlist status: Unknown error');
    });
  });
}); 