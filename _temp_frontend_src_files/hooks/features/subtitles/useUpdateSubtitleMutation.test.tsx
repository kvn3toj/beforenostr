import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateSubtitleMutation } from './useUpdateSubtitleMutation';
import * as subtitleService from '../../../services/subtitle.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { Subtitle } from '@prisma/client';
import { UpdateSubtitleDto } from '../../../subtitle/dto/update-subtitle.dto';

// Mock dependencies
vi.mock('../../../services/subtitle.service', () => ({
  update: vi.fn(),
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

describe('useUpdateSubtitleMutation', () => {
  const mockT = vi.fn((key: string, options?: any) => {
    const translations: Record<string, string> = {
      'toast_subtitle_updated_success': 'Subtítulo actualizado exitosamente',
      'toast_error_updating_subtitle': `Error al actualizar subtítulo: ${options?.message}`,
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
    updatedAt: new Date('2024-01-02'),
  };

  const mockUpdateDto: UpdateSubtitleDto = {
    isActive: false,
    language: 'en',
  };

  const mockUpdateParams = {
    id: 1,
    data: mockUpdateDto,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTranslation).mockReturnValue({
      t: mockT,
      i18n: {} as any,
      ready: true,
    });
  });

  it('should update subtitle successfully and show success toast', async () => {
    const updatedSubtitle = { ...mockSubtitle, ...mockUpdateDto };
    vi.mocked(subtitleService.update).mockResolvedValue(updatedSubtitle);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockUpdateParams);

    await waitFor(() => {
      expect(subtitleService.update).toHaveBeenCalledWith(mockUpdateParams.id, mockUpdateParams.data);
    });

    // Simulate successful mutation
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Subtítulo actualizado exitosamente');
    });
  });

  it('should invalidate queries on successful update', async () => {
    const updatedSubtitle = { ...mockSubtitle, ...mockUpdateDto };
    vi.mocked(subtitleService.update).mockResolvedValue(updatedSubtitle);

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

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper,
    });

    result.current.mutate(mockUpdateParams);

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['subtitles', { videoItemId: updatedSubtitle.videoItemId }],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['subtitle', updatedSubtitle.id],
      });
    });
  });

  it('should handle API error with extractErrorMessage and show error toast', async () => {
    const apiError = new Error('Validation failed');
    const extractedMessage = 'El idioma especificado no es válido';
    
    vi.mocked(subtitleService.update).mockRejectedValue(apiError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockUpdateParams);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(apiError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar subtítulo: El idioma especificado no es válido');
    });
  });

  it('should handle generic error and show error toast', async () => {
    const genericError = new Error('Network error');
    const extractedMessage = 'Error de conexión';
    
    vi.mocked(subtitleService.update).mockRejectedValue(genericError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockUpdateParams);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(genericError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar subtítulo: Error de conexión');
    });
  });

  it('should handle permission error and show error toast', async () => {
    const permissionError = new Error('Forbidden');
    const extractedMessage = 'No tienes permisos para actualizar este subtítulo';
    
    vi.mocked(subtitleService.update).mockRejectedValue(permissionError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockUpdateParams);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(permissionError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar subtítulo: No tienes permisos para actualizar este subtítulo');
    });
  });

  it('should handle unknown error when extractErrorMessage returns undefined', async () => {
    const unknownError = new Error('Unknown error');
    
    vi.mocked(subtitleService.update).mockRejectedValue(unknownError);
    vi.mocked(extractErrorMessage).mockReturnValue(undefined);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockUpdateParams);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(unknownError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar subtítulo: undefined');
    });
  });

  it('should return correct mutation state during pending', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    vi.mocked(subtitleService.update).mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockUpdateParams);

    // Wait for the mutation to start
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Clean up
    resolvePromise!({ ...mockSubtitle, ...mockUpdateDto });
  });

  it('should handle activation/deactivation updates', async () => {
    const activationDto: UpdateSubtitleDto = { isActive: true };
    const activationParams = { id: 1, data: activationDto };
    const activatedSubtitle = { ...mockSubtitle, isActive: true };
    
    vi.mocked(subtitleService.update).mockResolvedValue(activatedSubtitle);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(activationParams);

    await waitFor(() => {
      expect(subtitleService.update).toHaveBeenCalledWith(1, activationDto);
      expect(toast.success).toHaveBeenCalledWith('Subtítulo actualizado exitosamente');
    });
  });

  it('should handle language change updates', async () => {
    const languageDto: UpdateSubtitleDto = { language: 'fr' };
    const languageParams = { id: 1, data: languageDto };
    const updatedSubtitle = { ...mockSubtitle, language: 'fr' };
    
    vi.mocked(subtitleService.update).mockResolvedValue(updatedSubtitle);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(languageParams);

    await waitFor(() => {
      expect(subtitleService.update).toHaveBeenCalledWith(1, languageDto);
      expect(toast.success).toHaveBeenCalledWith('Subtítulo actualizado exitosamente');
    });
  });

  it('should handle not found error', async () => {
    const notFoundError = new Error('Subtitle not found');
    const extractedMessage = 'Subtítulo no encontrado';
    
    vi.mocked(subtitleService.update).mockRejectedValue(notFoundError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useUpdateSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    const notFoundParams = { id: 999, data: mockUpdateDto };
    result.current.mutate(notFoundParams);

    await waitFor(() => {
      expect(subtitleService.update).toHaveBeenCalledWith(999, mockUpdateDto);
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar subtítulo: Subtítulo no encontrado');
    });
  });
}); 