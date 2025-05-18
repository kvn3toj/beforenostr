import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useUpdatePlaylistMutation } from './useUpdatePlaylistMutation';
import { updatePlaylist } from '../../../services/playlist.service';
import type { UpdatePlaylistData, Playlist } from '../../../types/playlist.types';

// Mock the playlist service
vi.mock('../../../services/playlist.service', () => ({
  updatePlaylist: vi.fn(),
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

describe('useUpdatePlaylistMutation', () => {
  const mockUpdatePlaylistData: UpdatePlaylistData = {
    name: 'Updated Playlist',
    mundo_id: '123',
    published_at: null,
    unpublished_at: null,
  };

  const mockUpdatedPlaylist: Playlist = {
    id: '1',
    mundo_id: '123',
    name: 'Updated Playlist',
    description: 'Updated Description',
    order_index: 0,
    created_at: '2024-01-01',
    updated_at: '2024-01-02',
    is_active: true,
    published_at: null,
    unpublished_at: null,
    version: 2,
  };

  const mockUserId = 'user-123';

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

    const { result } = renderHook(() => useUpdatePlaylistMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('should handle successful playlist update', async () => {
    // Mock updatePlaylist to return mock data
    vi.mocked(updatePlaylist).mockResolvedValue(mockUpdatedPlaylist);

    // Mock useMutation to simulate successful mutation
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useUpdatePlaylistMutation());

    // Call mutate with mock data
    result.current.mutate({ id: '1', data: mockUpdatePlaylistData, userId: mockUserId });

    // Wait for async operations
    await waitFor(() => {
      expect(updatePlaylist).toHaveBeenCalledWith('1', mockUpdatePlaylistData, mockUserId);
      expect(toast.success).toHaveBeenCalledWith('Playlist actualizada exitosamente');
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['playlists'],
      });
    });
  });

  it('should handle error during playlist update', async () => {
    const mockError = new Error('Failed to update playlist');

    // Mock updatePlaylist to throw error
    vi.mocked(updatePlaylist).mockRejectedValue(mockError);

    // Mock useMutation to simulate error state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useUpdatePlaylistMutation());

    // Call mutate with mock data
    result.current.mutate({ id: '1', data: mockUpdatePlaylistData, userId: mockUserId });

    // Wait for async operations
    await waitFor(() => {
      expect(updatePlaylist).toHaveBeenCalledWith('1', mockUpdatePlaylistData, mockUserId);
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar la playlist');
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

    const { result } = renderHook(() => useUpdatePlaylistMutation());

    expect(result.current.isPending).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });
}); 