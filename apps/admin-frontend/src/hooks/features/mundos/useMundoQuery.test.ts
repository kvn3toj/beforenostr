import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useMundoQuery } from './useMundoQuery';
import { Mundo } from '../../../types/mundo.types';
import * as mundoService from '../../../services/mundo.service';

// Mock the react-query useQuery hook
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn()
}));

// Mock the mundo service
vi.mock('../../../services/mundo.service', () => ({
  fetchMundoById: vi.fn()
}));

describe('useMundoQuery', () => {
  const mockMundo: Mundo = {
    id: '123',
    name: 'Test Mundo',
    description: 'Test Description',
    thumbnail_url: 'https://example.com/thumbnail.jpg',
    created_by: 'user123',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_active: true,
    published_at: '2024-01-01T00:00:00Z',
    unpublished_at: null,
    version: 1
  };

  const mockError = new Error('Failed to fetch mundo');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not execute query when mundoId is undefined', () => {
    const { result } = renderHook(() => useMundoQuery(undefined));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(mundoService.fetchMundoById).not.toHaveBeenCalled();
  });

  it('should not execute query when mundoId is null', () => {
    const { result } = renderHook(() => useMundoQuery(null as unknown as string));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(mundoService.fetchMundoById).not.toHaveBeenCalled();
  });

  it('should show loading state when mundoId is defined', () => {
    const { result } = renderHook(() => useMundoQuery('123'));

    expect(result.current.isLoading).toBe(true);
    expect(mundoService.fetchMundoById).toHaveBeenCalledWith('123');
  });

  it('should fetch mundo successfully', async () => {
    vi.mocked(mundoService.fetchMundoById).mockResolvedValueOnce(mockMundo);

    const { result } = renderHook(() => useMundoQuery('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockMundo);
    });

    expect(mundoService.fetchMundoById).toHaveBeenCalledWith('123');
  });

  it('should handle error when fetching mundo fails', async () => {
    vi.mocked(mundoService.fetchMundoById).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useMundoQuery('123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
    });

    expect(mundoService.fetchMundoById).toHaveBeenCalledWith('123');
  });

  it('should refetch when mundoId changes', async () => {
    const { rerender } = renderHook(({ id }) => useMundoQuery(id), {
      initialProps: { id: '123' }
    });

    expect(mundoService.fetchMundoById).toHaveBeenCalledWith('123');

    rerender({ id: '456' });

    expect(mundoService.fetchMundoById).toHaveBeenCalledWith('456');
  });
}); 