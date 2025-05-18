import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useCreatePlaylistMutation } from './useCreatePlaylistMutation';
import { createPlaylist } from '../../../services/playlist.service';
import type { CreatePlaylistData, Playlist } from '../../../types/playlist.types';

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

    const { result } = renderHook(() => useCreatePlaylistMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('should handle successful playlist creation', async () => {
    // Mock createPlaylist to return mock data
    vi.mocked(createPlaylist).mockResolvedValue(mockCreatedPlaylist);

    // Mock useMutation to simulate successful mutation
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useCreatePlaylistMutation());

    // Call mutate with mock data
    result.current.mutate(mockCreatePlaylistData);

    // Wait for async operations
    await waitFor(() => {
      expect(createPlaylist).toHaveBeenCalledWith(mockCreatePlaylistData);
      expect(toast.success).toHaveBeenCalledWith('Playlist creada exitosamente');
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['playlists'],
      });
    });
  });

  it('should handle error during playlist creation', async () => {
    const mockError = new Error('Failed to create playlist');

    // Mock createPlaylist to throw error
    vi.mocked(createPlaylist).mockRejectedValue(mockError);

    // Mock useMutation to simulate error state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useCreatePlaylistMutation());

    // Call mutate with mock data
    result.current.mutate(mockCreatePlaylistData);

    // Wait for async operations
    await waitFor(() => {
      expect(createPlaylist).toHaveBeenCalledWith(mockCreatePlaylistData);
      expect(toast.error).toHaveBeenCalledWith('Error al crear la playlist');
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

    const { result } = renderHook(() => useCreatePlaylistMutation());

    expect(result.current.isPending).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });
}); 