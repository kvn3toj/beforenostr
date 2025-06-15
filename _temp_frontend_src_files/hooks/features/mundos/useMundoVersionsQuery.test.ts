import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useMundoVersionsQuery } from './useMundoVersionsQuery';
import { MundoVersion } from '../../../types/mundo.types';
import * as mundoService from '../../../services/mundo.service';

// Mock the react-query useQuery hook
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn()
}));

// Mock the mundo service
vi.mock('../../../services/mundo.service', () => ({
  fetchMundoVersions: vi.fn()
}));

describe('useMundoVersionsQuery', () => {
  const mockMundoId = '123';
  const mockVersions: MundoVersion[] = [
    {
      id: 'v1',
      mundo_id: mockMundoId,
      version: 1,
      timestamp: '2024-01-01T00:00:00Z',
      changed_by_user_id: 'user1',
      name: 'Version 1',
      description: 'First version',
      thumbnail_url: 'https://example.com/v1.jpg',
      is_active: true,
      published_at: '2024-01-01T00:00:00Z',
      unpublished_at: null
    },
    {
      id: 'v2',
      mundo_id: mockMundoId,
      version: 2,
      timestamp: '2024-01-02T00:00:00Z',
      changed_by_user_id: 'user1',
      name: 'Version 2',
      description: 'Second version',
      thumbnail_url: 'https://example.com/v2.jpg',
      is_active: false,
      published_at: '2024-01-02T00:00:00Z',
      unpublished_at: '2024-01-03T00:00:00Z'
    }
  ];

  const mockError = new Error('Failed to fetch mundo versions');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not execute query when mundoId is undefined', () => {
    const { result } = renderHook(() => useMundoVersionsQuery(undefined));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(mundoService.fetchMundoVersions).not.toHaveBeenCalled();
  });

  it('should not execute query when mundoId is null', () => {
    const { result } = renderHook(() => useMundoVersionsQuery(null as unknown as string));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(mundoService.fetchMundoVersions).not.toHaveBeenCalled();
  });

  it('should show loading state when mundoId is defined', () => {
    const { result } = renderHook(() => useMundoVersionsQuery(mockMundoId));

    expect(result.current.isLoading).toBe(true);
    expect(mundoService.fetchMundoVersions).toHaveBeenCalledWith(mockMundoId);
  });

  it('should fetch mundo versions successfully', async () => {
    vi.mocked(mundoService.fetchMundoVersions).mockResolvedValueOnce(mockVersions);

    const { result } = renderHook(() => useMundoVersionsQuery(mockMundoId));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockVersions);
    });

    expect(mundoService.fetchMundoVersions).toHaveBeenCalledWith(mockMundoId);
  });

  it('should handle error when fetching mundo versions fails', async () => {
    vi.mocked(mundoService.fetchMundoVersions).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useMundoVersionsQuery(mockMundoId));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(mockError);
    });

    expect(mundoService.fetchMundoVersions).toHaveBeenCalledWith(mockMundoId);
  });

  it('should refetch when mundoId changes', async () => {
    const { rerender } = renderHook(({ id }) => useMundoVersionsQuery(id), {
      initialProps: { id: '123' }
    });

    expect(mundoService.fetchMundoVersions).toHaveBeenCalledWith('123');

    rerender({ id: '456' });

    expect(mundoService.fetchMundoVersions).toHaveBeenCalledWith('456');
  });
}); 