import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { usePlaylistsQuery } from './usePlaylistsQuery';
import { fetchPlaylists } from '../services/playlist.service';
import type { Playlist } from '../types/playlist.types';
import type { FetchPlaylistsParams } from '../services/playlist.service';

// Mock the playlist service
vi.mock('../services/playlist.service', () => ({
  fetchPlaylists: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('usePlaylistsQuery', () => {
  const mockParams: FetchPlaylistsParams = {
    page: 0,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
    filters: {
      name: 'Test Playlist',
      mundo_id: '123',
      is_active: true,
    },
  };

  const mockPlaylists: Playlist[] = [
    {
      id: '1',
      mundo_id: '123',
      name: 'Test Playlist 1',
      description: 'Test Description 1',
      order_index: 0,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      is_active: true,
      published_at: null,
      unpublished_at: null,
      version: 1,
    },
    {
      id: '2',
      mundo_id: '123',
      name: 'Test Playlist 2',
      description: 'Test Description 2',
      order_index: 1,
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
      is_active: true,
      published_at: null,
      unpublished_at: null,
      version: 1,
    },
  ];

  const mockResponse = {
    data: mockPlaylists,
    count: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    // Mock useQuery to return initial loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => usePlaylistsQuery(mockParams));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle successful data fetching', async () => {
    // Mock fetchPlaylists to return mock data
    vi.mocked(fetchPlaylists).mockResolvedValue(mockResponse);

    // Mock useQuery to simulate successful query
    vi.mocked(useQuery).mockReturnValue({
      data: mockResponse,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => usePlaylistsQuery(mockParams));

    // Verify initial state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);

    // Verify fetchPlaylists was called with correct params
    expect(fetchPlaylists).toHaveBeenCalledWith(mockParams);
  });

  it('should handle error state', async () => {
    const mockError = new Error('Failed to fetch playlists');

    // Mock fetchPlaylists to throw error
    vi.mocked(fetchPlaylists).mockRejectedValue(mockError);

    // Mock useQuery to simulate error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
      isSuccess: false,
    } as any);

    const { result } = renderHook(() => usePlaylistsQuery(mockParams));

    // Verify error state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(result.current.isSuccess).toBe(false);

    // Verify fetchPlaylists was called with correct params
    expect(fetchPlaylists).toHaveBeenCalledWith(mockParams);
  });

  it('should update query when params change', () => {
    const newParams: FetchPlaylistsParams = {
      ...mockParams,
      page: 1,
      pageSize: 20,
      sortBy: 'created_at',
      sortDirection: 'desc',
      filters: {
        name: 'New Playlist',
        mundo_id: '456',
        is_active: false,
      },
    };

    // Mock useQuery to return initial state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      isSuccess: false,
    } as any);

    // First render with initial params
    const { rerender } = renderHook((params) => usePlaylistsQuery(params), {
      initialProps: mockParams,
    });

    // Verify initial query key
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['playlists', mockParams],
      })
    );

    // Rerender with new params
    rerender(newParams);

    // Verify query was updated with new params
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['playlists', newParams],
      })
    );

    // Verify fetchPlaylists was called with new params
    expect(fetchPlaylists).toHaveBeenCalledWith(newParams);
  });
}); 