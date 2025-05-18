import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDeletePlaylistMutation } from './useDeletePlaylistMutation';
import { deletePlaylist } from '../../../services/playlist.service';

// Mock the playlist service
vi.mock('../../../services/playlist.service', () => ({
  deletePlaylist: vi.fn(),
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

describe('useDeletePlaylistMutation', () => {
  const mockPlaylistId = 'playlist-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock useMutation to return initial state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useDeletePlaylistMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('should handle successful playlist deletion', async () => {
    // Mock deletePlaylist to resolve successfully
    vi.mocked(deletePlaylist).mockResolvedValue();

    // Mock useMutation to simulate successful mutation
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useDeletePlaylistMutation());

    // Call mutate with mock playlist ID
    result.current.mutate(mockPlaylistId);

    // Wait for async operations
    await waitFor(() => {
      expect(deletePlaylist).toHaveBeenCalledWith(mockPlaylistId);
      expect(toast.success).toHaveBeenCalledWith('Playlist eliminada exitosamente');
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['playlists'],
      });
    });
  });

  it('should handle error during playlist deletion', async () => {
    const mockError = new Error('Failed to delete playlist');

    // Mock deletePlaylist to throw error
    vi.mocked(deletePlaylist).mockRejectedValue(mockError);

    // Mock useMutation to simulate error state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useDeletePlaylistMutation());

    // Call mutate with mock playlist ID
    result.current.mutate(mockPlaylistId);

    // Wait for async operations
    await waitFor(() => {
      expect(deletePlaylist).toHaveBeenCalledWith(mockPlaylistId);
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar la playlist');
    });
  });

  it('should show loading state during mutation', async () => {
    // Mock useMutation to simulate loading state
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      error: null,
      isError: false,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useDeletePlaylistMutation());

    expect(result.current.isPending).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });
}); 