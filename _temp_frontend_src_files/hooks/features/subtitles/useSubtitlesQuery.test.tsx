import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSubtitlesQuery } from './useSubtitlesQuery';
import * as subtitleService from '../../../services/subtitle.service';
import { Subtitle } from '@prisma/client';
import { FindAllSubtitlesDto } from '../../../subtitle/dto/find-all-subtitles.dto';

// Mock subtitle service
vi.mock('../../../services/subtitle.service', () => ({
  findAll: vi.fn(),
}));

// Utility to create a mock for useQuery result
function createQueryResultMock<T>({ data = undefined, isLoading = false, isError = false, error = null } = {}) {
  return {
    data,
    isLoading,
    isError,
    error,
    isSuccess: !isLoading && !isError && data !== undefined,
    isFetching: isLoading,
    refetch: vi.fn(),
    remove: vi.fn(),
    status: isLoading ? 'pending' : isError ? 'error' : 'success',
  };
}

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useSubtitlesQuery', () => {
  const mockSubtitles: Subtitle[] = [
    {
      id: 1,
      videoItemId: 123,
      language: 'es',
      filename: 'subtitle-es.vtt',
      fileUrl: 'https://example.com/subtitle-es.vtt',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      videoItemId: 123,
      language: 'en',
      filename: 'subtitle-en.vtt',
      fileUrl: 'https://example.com/subtitle-en.vtt',
      isActive: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  const validFindAllDto: FindAllSubtitlesDto = {
    videoItemId: 123,
  };

  const invalidFindAllDto: FindAllSubtitlesDto = {
    videoItemId: 0, // Invalid ID
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch subtitles successfully when videoItemId is valid', async () => {
    vi.mocked(subtitleService.findAll).mockResolvedValue(mockSubtitles);

    const { result } = renderHook(() => useSubtitlesQuery(validFindAllDto), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSubtitles);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(subtitleService.findAll).toHaveBeenCalledWith(validFindAllDto);
  });

  it('should show loading state initially when videoItemId is valid', () => {
    vi.mocked(subtitleService.findAll).mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useSubtitlesQuery(validFindAllDto), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state when service fails', async () => {
    const errorMessage = 'Failed to fetch subtitles';
    vi.mocked(subtitleService.findAll).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useSubtitlesQuery(validFindAllDto), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should not fetch when videoItemId is invalid (enabled = false)', () => {
    vi.mocked(subtitleService.findAll).mockResolvedValue(mockSubtitles);

    const { result } = renderHook(() => useSubtitlesQuery(invalidFindAllDto), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(subtitleService.findAll).not.toHaveBeenCalled();
  });

  it('should not fetch when videoItemId is not a number', () => {
    vi.mocked(subtitleService.findAll).mockResolvedValue(mockSubtitles);

    const invalidDto = { videoItemId: 'invalid' as any };
    const { result } = renderHook(() => useSubtitlesQuery(invalidDto), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(subtitleService.findAll).not.toHaveBeenCalled();
  });

  it('should not fetch when videoItemId is negative', () => {
    vi.mocked(subtitleService.findAll).mockResolvedValue(mockSubtitles);

    const negativeDto = { videoItemId: -1 };
    const { result } = renderHook(() => useSubtitlesQuery(negativeDto), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(subtitleService.findAll).not.toHaveBeenCalled();
  });
}); 