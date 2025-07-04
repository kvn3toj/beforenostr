import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useMundosQuery } from './useMundosQuery';
import { fetchMundos, FetchMundosParams } from '../services/mundo.service';
import type { Mundo } from '../types/mundo.types';

// Mock the mundo service
vi.mock('../services/mundo.service', () => ({
  fetchMundos: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useMundosQuery', () => {
  const mockParams: FetchMundosParams = {
    page: 0,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
    filters: {
      name: 'Test',
      is_active: true,
    },
  };

  const mockMundos: Mundo[] = [
    {
      id: 'mundo-1',
      name: 'Test Mundo 1',
      description: 'Test Description 1',
      thumbnail_url: 'https://example.com/thumb1.jpg',
      created_by: 'user-1',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      is_active: true,
      published_at: null,
      unpublished_at: null,
      version: 1,
    },
    {
      id: 'mundo-2',
      name: 'Test Mundo 2',
      description: 'Test Description 2',
      thumbnail_url: 'https://example.com/thumb2.jpg',
      created_by: 'user-1',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      is_active: true,
      published_at: null,
      unpublished_at: null,
      version: 1,
    },
  ];

  const mockResponse = {
    data: mockMundos,
    count: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock useQuery to return initial state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useMundosQuery(mockParams));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful mundos fetch', async () => {
    // Mock fetchMundos to return mock data
    vi.mocked(fetchMundos).mockResolvedValue(mockResponse);

    // Mock useQuery to simulate successful query
    vi.mocked(useQuery).mockReturnValue({
      data: mockResponse,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useMundosQuery(mockParams));

    // Wait for async operations
    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
      expect(fetchMundos).toHaveBeenCalledWith(mockParams);
    });
  });

  it('should handle error during mundos fetch', async () => {
    const mockError = new Error('Failed to fetch mundos');

    // Mock fetchMundos to throw error
    vi.mocked(fetchMundos).mockRejectedValue(mockError);

    // Mock useQuery to simulate error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any);

    const { result } = renderHook(() => useMundosQuery(mockParams));

    // Wait for async operations
    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(fetchMundos).toHaveBeenCalledWith(mockParams);
    });
  });

  it('should update query when params change', async () => {
    const newParams: FetchMundosParams = {
      ...mockParams,
      page: 1,
      filters: {
        name: 'New Test',
        is_active: false,
      },
    };

    const newMockMundos: Mundo[] = [
      {
        id: 'mundo-3',
        name: 'New Test Mundo',
        description: 'New Test Description',
        thumbnail_url: 'https://example.com/thumb3.jpg',
        created_by: 'user-1',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
        is_active: false,
        published_at: null,
        unpublished_at: null,
        version: 1,
      },
    ];

    const newMockResponse = {
      data: newMockMundos,
      count: 1,
    };

    // Mock fetchMundos to return different data for different params
    vi.mocked(fetchMundos)
      .mockResolvedValueOnce(mockResponse)
      .mockResolvedValueOnce(newMockResponse);

    // Mock useQuery to simulate successful queries
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        data: mockResponse,
        isLoading: false,
        isError: false,
        error: null,
      } as any)
      .mockReturnValueOnce({
        data: newMockResponse,
        isLoading: false,
        isError: false,
        error: null,
      } as any);

    const { result, rerender } = renderHook(
      ({ params }) => useMundosQuery(params),
      { initialProps: { params: mockParams } }
    );

    // Wait for first query
    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
      expect(fetchMundos).toHaveBeenCalledWith(mockParams);
    });

    // Change params
    rerender({ params: newParams });

    // Wait for second query
    await waitFor(() => {
      expect(result.current.data).toEqual(newMockResponse);
      expect(fetchMundos).toHaveBeenCalledWith(newParams);
    });
  });
}); 