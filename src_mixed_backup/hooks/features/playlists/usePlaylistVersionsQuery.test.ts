import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { usePlaylistVersionsQuery } from './usePlaylistVersionsQuery';
import { fetchPlaylistVersions } from '../../../services/playlist.service';
import type { PlaylistVersion } from '../../../types/playlist.types';

// Mock the playlist service
vi.mock('../../../services/playlist.service', () => ({
  fetchPlaylistVersions: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('usePlaylistVersionsQuery', () => {
  const mockPlaylistId = 'playlist-123';

  const mockVersions: PlaylistVersion[] = [
    {
      id: 'version-1',
      playlist_id: mockPlaylistId,
      version: 2,
      timestamp: '2024-03-20T10:00:00Z',
      changed_by_user_id: 'user-123',
      name: 'Test Playlist v2',
      description: 'Updated description',
      mundo_id: 'mundo-123',
      order_index: 0,
      is_active: true,
      published_at: null,
      unpublished_at: null,
    },
    {
      id: 'version-2',
      playlist_id: mockPlaylistId,
      version: 1,
      timestamp: '2024-03-19T10:00:00Z',
      changed_by_user_id: 'user-123',
      name: 'Test Playlist v1',
      description: 'Initial description',
      mundo_id: 'mundo-123',
      order_index: 0,
      is_active: true,
      published_at: null,
      unpublished_at: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state when playlistId is undefined', () => {
    // Mock useQuery to return initial state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => usePlaylistVersionsQuery(undefined));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(fetchPlaylistVersions).not.toHaveBeenCalled();
  });

  it('should show loading state when playlistId is defined', () => {
    // Mock useQuery to return loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => usePlaylistVersionsQuery(mockPlaylistId));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful versions fetch', async () => {
    // Mock fetchPlaylistVersions to return mock data
    vi.mocked(fetchPlaylistVersions).mockResolvedValue(mockVersions);

    // Mock useQuery to simulate successful query
    vi.mocked(useQuery).mockReturnValue({
      data: mockVersions,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => usePlaylistVersionsQuery(mockPlaylistId));

    // Wait for async operations
    await waitFor(() => {
      expect(result.current.data).toEqual(mockVersions);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
      expect(fetchPlaylistVersions).toHaveBeenCalledWith(mockPlaylistId);
    });
  });

  it('should handle error during versions fetch', async () => {
    const mockError = new Error('Failed to fetch playlist versions');

    // Mock fetchPlaylistVersions to throw error
    vi.mocked(fetchPlaylistVersions).mockRejectedValue(mockError);

    // Mock useQuery to simulate error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any);

    const { result } = renderHook(() => usePlaylistVersionsQuery(mockPlaylistId));

    // Wait for async operations
    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(fetchPlaylistVersions).toHaveBeenCalledWith(mockPlaylistId);
    });
  });

  it('should update query when playlistId changes', async () => {
    const newPlaylistId = 'playlist-456';
    const newMockVersions: PlaylistVersion[] = [
      {
        id: 'version-3',
        playlist_id: newPlaylistId,
        version: 1,
        timestamp: '2024-03-21T10:00:00Z',
        changed_by_user_id: 'user-123',
        name: 'New Playlist v1',
        description: 'New description',
        mundo_id: 'mundo-456',
        order_index: 0,
        is_active: true,
        published_at: null,
        unpublished_at: null,
      },
    ];

    // Mock fetchPlaylistVersions to return different data for different IDs
    vi.mocked(fetchPlaylistVersions)
      .mockResolvedValueOnce(mockVersions)
      .mockResolvedValueOnce(newMockVersions);

    // Mock useQuery to simulate successful queries
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        data: mockVersions,
        isLoading: false,
        isError: false,
        error: null,
      } as any)
      .mockReturnValueOnce({
        data: newMockVersions,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

    const { result, rerender } = renderHook(
      ({ id }) => usePlaylistVersionsQuery(id),
      { initialProps: { id: mockPlaylistId } }
    );

    // Wait for first query
    await waitFor(() => {
      expect(result.current.data).toEqual(mockVersions);
      expect(fetchPlaylistVersions).toHaveBeenCalledWith(mockPlaylistId);
    });

    // Change playlistId
    rerender({ id: newPlaylistId });

    // Wait for second query
    await waitFor(() => {
      expect(result.current.data).toEqual(newMockVersions);
      expect(fetchPlaylistVersions).toHaveBeenCalledWith(newPlaylistId);
    });
  });
}); 