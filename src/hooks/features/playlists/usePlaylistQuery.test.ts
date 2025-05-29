import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { usePlaylistQuery } from './usePlaylistQuery';
import { fetchPlaylistById } from '../../../services/playlist.service';
import type { Playlist } from '../../../types/playlist.types';
import { useQuery } from '@tanstack/react-query';

type MockUseQueryResult<TData = unknown, TError = unknown> = {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  // Add other properties as needed for the specific mock
};

// Mock the playlist service
vi.mock('../../../services/playlist.service', () => ({
  fetchPlaylistById: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('usePlaylistQuery', () => {
  const mockPlaylistId = 'playlist-123';

  const mockPlaylist: Playlist = {
    id: mockPlaylistId,
    mundo_id: 'mundo-123',
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

  it('should return initial state when playlistId is undefined', () => {
    // Mock useQuery to return initial state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as MockUseQueryResult<Playlist | undefined, Error>);

    const { result } = renderHook(() => usePlaylistQuery(undefined));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    expect(fetchPlaylistById).not.toHaveBeenCalled();
  });

  it('should show loading state when playlistId is defined', () => {
    // Mock useQuery to return loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as MockUseQueryResult<Playlist | undefined, Error>);

    const { result } = renderHook(() => usePlaylistQuery(mockPlaylistId));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful playlist fetch', async () => {
    // Mock fetchPlaylistById to return mock data
    vi.mocked(fetchPlaylistById).mockResolvedValue(mockPlaylist);

    // Mock useQuery to simulate successful query
    vi.mocked(useQuery).mockReturnValue({
      data: mockPlaylist,
      isLoading: false,
      isError: false,
      error: null,
    } as MockUseQueryResult<Playlist, Error>);

    const { result } = renderHook(() => usePlaylistQuery(mockPlaylistId));

    // Wait for async operations
    await waitFor(() => {
      expect(result.current.data).toEqual(mockPlaylist);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
      expect(fetchPlaylistById).toHaveBeenCalledWith(mockPlaylistId);
    });
  });

  it('should handle error during playlist fetch', async () => {
    const mockError = new Error('Failed to fetch playlist');

    // Mock fetchPlaylistById to throw error
    vi.mocked(fetchPlaylistById).mockRejectedValue(mockError);

    // Mock useQuery to simulate error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as MockUseQueryResult<Playlist | undefined, Error>);

    const { result } = renderHook(() => usePlaylistQuery(mockPlaylistId));

    // Wait for async operations
    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(fetchPlaylistById).toHaveBeenCalledWith(mockPlaylistId);
    });
  });

  it('should update query when playlistId changes', async () => {
    const newPlaylistId = 'playlist-456';
    const newMockPlaylist: Playlist = {
      ...mockPlaylist,
      id: newPlaylistId,
      name: 'New Test Playlist',
    };

    // Mock fetchPlaylistById to return different data for different IDs
    vi.mocked(fetchPlaylistById)
      .mockResolvedValueOnce(mockPlaylist)
      .mockResolvedValueOnce(newMockPlaylist);

    // Mock useQuery to simulate successful queries
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        data: mockPlaylist,
        isLoading: false,
        isError: false,
        error: null,
      } as MockUseQueryResult<Playlist, Error>)
      .mockReturnValueOnce({
        data: newMockPlaylist,
        isLoading: false,
        isError: false,
        error: null,
      } as MockUseQueryResult<Playlist, Error>);

    const { result, rerender } = renderHook(
      ({ id }) => usePlaylistQuery(id),
      { initialProps: { id: mockPlaylistId } }
    );

    // Wait for first query
    await waitFor(() => {
      expect(result.current.data).toEqual(mockPlaylist);
      expect(fetchPlaylistById).toHaveBeenCalledWith(mockPlaylistId);
    });

    // Change playlistId
    rerender({ id: newPlaylistId });

    // Wait for second query
    await waitFor(() => {
      expect(result.current.data).toEqual(newMockPlaylist);
      expect(fetchPlaylistById).toHaveBeenCalledWith(newPlaylistId);
    });
  });
}); 