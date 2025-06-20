import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateSubtitleMutation } from './useCreateSubtitleMutation';
import * as subtitleService from '../../../services/subtitle.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { Subtitle } from '@prisma/client';
import { CreateSubtitleDto } from '../../../subtitle/dto/create-subtitle.dto';

// Mock dependencies
vi.mock('../../../services/subtitle.service', () => ({
  create: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('../../../utils/errorUtils', () => ({
  extractErrorMessage: vi.fn(),
}));

// Utility to create a mock for useMutation result
function createMutationResultMock({ mutate = vi.fn(), isPending = false, error = null } = {}) {
  return {
    mutate,
    isPending,
    error,
    data: undefined,
    variables: undefined,
    isError: false,
    isIdle: false,
    isPaused: false,
    isSuccess: false,
    reset: vi.fn(),
    status: 'idle',
    mutateAsync: vi.fn(),
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

describe('useCreateSubtitleMutation', () => {
  const mockT = vi.fn((key: string, options?: any) => {
    const translations: Record<string, string> = {
      'toast_subtitle_created_success': 'Subtítulo creado exitosamente',
      'toast_error_creating_subtitle': `Error al crear subtítulo: ${options?.message}`,
    };
    return translations[key] || key;
  });

  const mockSubtitle: Subtitle = {
    id: 1,
    videoItemId: 123,
    language: 'es',
    filename: 'subtitle-es.vtt',
    fileUrl: 'https://example.com/subtitle-es.vtt',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockCreateDto: CreateSubtitleDto = {
    videoItemId: 123,
    language: 'es',
    filename: 'subtitle-es.vtt',
    fileUrl: 'https://example.com/subtitle-es.vtt',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTranslation).mockReturnValue({
      t: mockT,
      i18n: {} as any,
      ready: true,
    });
  });

  it('should create subtitle successfully and show success toast', async () => {
    vi.mocked(subtitleService.create).mockResolvedValue(mockSubtitle);

    const { result } = renderHook(() => useCreateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCreateDto);

    await waitFor(() => {
      expect(subtitleService.create).toHaveBeenCalledWith(mockCreateDto);
    });

    // Simulate successful mutation
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Subtítulo creado exitosamente');
    });
  });

  it('should invalidate queries on successful creation', async () => {
    vi.mocked(subtitleService.create).mockResolvedValue(mockSubtitle);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useCreateSubtitleMutation(), {
      wrapper,
    });

    result.current.mutate(mockCreateDto);

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['subtitles', { videoItemId: mockSubtitle.videoItemId }],
      });
    });
  });

  it('should handle API error with extractErrorMessage and show error toast', async () => {
    const apiError = new Error('Validation failed');
    const extractedMessage = 'El archivo de subtítulo no es válido';
    
    vi.mocked(subtitleService.create).mockRejectedValue(apiError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useCreateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCreateDto);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(apiError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al crear subtítulo: El archivo de subtítulo no es válido');
    });
  });

  it('should handle generic error and show error toast', async () => {
    const genericError = new Error('Network error');
    const extractedMessage = 'Error de conexión';
    
    vi.mocked(subtitleService.create).mockRejectedValue(genericError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useCreateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCreateDto);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(genericError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al crear subtítulo: Error de conexión');
    });
  });

  it('should handle unknown error when extractErrorMessage returns undefined', async () => {
    const unknownError = new Error('Unknown error');
    
    vi.mocked(subtitleService.create).mockRejectedValue(unknownError);
    vi.mocked(extractErrorMessage).mockReturnValue(undefined);

    const { result } = renderHook(() => useCreateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCreateDto);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(unknownError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al crear subtítulo: undefined');
    });
  });

  it('should return correct mutation state during pending', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    vi.mocked(subtitleService.create).mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useCreateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCreateDto);

    // Wait for the mutation to start
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Clean up
    resolvePromise!(mockSubtitle);
  });

  it('should handle file upload specific errors', async () => {
    const fileError = new Error('File too large');
    const extractedMessage = 'El archivo es demasiado grande';
    
    vi.mocked(subtitleService.create).mockRejectedValue(fileError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useCreateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    const fileUploadDto: CreateSubtitleDto = {
      ...mockCreateDto,
      filename: 'large-subtitle.vtt',
    };

    result.current.mutate(fileUploadDto);

    await waitFor(() => {
      expect(subtitleService.create).toHaveBeenCalledWith(fileUploadDto);
      expect(toast.error).toHaveBeenCalledWith('Error al crear subtítulo: El archivo es demasiado grande');
    });
  });
}); 