import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRestorePlaylistVersionMutation } from './useRestorePlaylistVersionMutation';
import { restorePlaylistVersion } from '../../../services/playlist.service';
import type { Playlist } from '../../../types/playlist.types';

// Mock the playlist service
vi.mock('../../../services/playlist.service', () => ({
  restorePlaylistVersion: vi.fn(),
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

describe('useRestorePlaylistVersionMutation', () => {
  const mockPlaylistId = 'playlist-123';
  const mockVersionId = 'version-456';

  const mockRestoredPlaylist: Playlist = {
    id: mockPlaylistId,
    mundo_id: 'mundo-123',
    name: 'Restored Playlist',
    description: 'Restored Description',
    order_index: 0,
    created_at: '2024-01-01',
    updated_at: '2024-03-20T10:00:00Z',
    is_active: true,
    published_at: null,
    unpublished_at: null,
    version: 3,
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

    const { result } = renderHook(() => useRestorePlaylistVersionMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('should handle successful version restoration', async () => {
    // Mock restorePlaylistVersion to return mock data
    vi.mocked(restorePlaylistVersion).mockResolvedValue(mockRestoredPlaylist);

    // Mock useMutation to simulate successful mutation
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useRestorePlaylistVersionMutation());

    // Call mutate with mock data
    result.current.mutate({ playlistId: mockPlaylistId, versionId: mockVersionId });

    // Wait for async operations
    await waitFor(() => {
      expect(restorePlaylistVersion).toHaveBeenCalledWith(mockPlaylistId, mockVersionId);
      expect(toast.success).toHaveBeenCalledWith('Versión restaurada con éxito');
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['playlists', mockPlaylistId],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['playlists', mockPlaylistId, 'versions'],
      });
    });
  });

  it('should handle error during version restoration', async () => {
    const mockError = new Error('Failed to restore version');

    // Mock restorePlaylistVersion to throw error
    vi.mocked(restorePlaylistVersion).mockRejectedValue(mockError);

    // Mock useMutation to simulate error state
    const mockMutate = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => useRestorePlaylistVersionMutation());

    // Call mutate with mock data
    result.current.mutate({ playlistId: mockPlaylistId, versionId: mockVersionId });

    // Wait for async operations
    await waitFor(() => {
      expect(restorePlaylistVersion).toHaveBeenCalledWith(mockPlaylistId, mockVersionId);
      expect(toast.error).toHaveBeenCalledWith('Error al restaurar la versión: Failed to restore version');
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

    const { result } = renderHook(() => useRestorePlaylistVersionMutation());

    expect(result.current.isPending).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });
}); 