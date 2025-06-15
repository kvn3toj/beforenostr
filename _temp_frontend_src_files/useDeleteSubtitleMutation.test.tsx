import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteSubtitleMutation } from './useDeleteSubtitleMutation';
import * as subtitleService from '../../../services/subtitle.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { extractErrorMessage } from '../../../utils/errorUtils';

// Mock dependencies
vi.mock('../../../services/subtitle.service', () => ({
  remove: vi.fn(),
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

describe('useDeleteSubtitleMutation', () => {
  const mockT = vi.fn((key: string, options?: any) => {
    const translations: Record<string, string> = {
      'toast_subtitle_deleted_success': 'Subtítulo eliminado exitosamente',
      'toast_error_deleting_subtitle': `Error al eliminar subtítulo: ${options?.message}`,
    };
    return translations[key] || key;
  });

  const subtitleId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTranslation).mockReturnValue({
      t: mockT,
      i18n: {} as any,
      ready: true,
    });
  });

  it('should delete subtitle successfully and show success toast', async () => {
    vi.mocked(subtitleService.remove).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(subtitleId);

    await waitFor(() => {
      expect(subtitleService.remove).toHaveBeenCalledWith(subtitleId);
    });

    // Simulate successful mutation
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Subtítulo eliminado exitosamente');
    });
  });

  it('should invalidate all subtitle queries on successful deletion', async () => {
    vi.mocked(subtitleService.remove).mockResolvedValue(undefined);

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

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper,
    });

    result.current.mutate(subtitleId);

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['subtitles'],
      });
    });
  });

  it('should handle API error with extractErrorMessage and show error toast', async () => {
    const apiError = new Error('Subtitle is referenced by other entities');
    const extractedMessage = 'No se puede eliminar el subtítulo porque está siendo utilizado';
    
    vi.mocked(subtitleService.remove).mockRejectedValue(apiError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(subtitleId);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(apiError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar subtítulo: No se puede eliminar el subtítulo porque está siendo utilizado');
    });
  });

  it('should handle generic error and show error toast', async () => {
    const genericError = new Error('Network error');
    const extractedMessage = 'Error de conexión';
    
    vi.mocked(subtitleService.remove).mockRejectedValue(genericError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(subtitleId);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(genericError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar subtítulo: Error de conexión');
    });
  });

  it('should handle permission error and show error toast', async () => {
    const permissionError = new Error('Forbidden');
    const extractedMessage = 'No tienes permisos para eliminar este subtítulo';
    
    vi.mocked(subtitleService.remove).mockRejectedValue(permissionError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(subtitleId);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(permissionError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar subtítulo: No tienes permisos para eliminar este subtítulo');
    });
  });

  it('should handle not found error and show error toast', async () => {
    const notFoundError = new Error('Subtitle not found');
    const extractedMessage = 'Subtítulo no encontrado';
    
    vi.mocked(subtitleService.remove).mockRejectedValue(notFoundError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    const nonExistentId = 999;
    result.current.mutate(nonExistentId);

    await waitFor(() => {
      expect(subtitleService.remove).toHaveBeenCalledWith(nonExistentId);
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar subtítulo: Subtítulo no encontrado');
    });
  });

  it('should handle unknown error when extractErrorMessage returns undefined', async () => {
    const unknownError = new Error('Unknown error');
    
    vi.mocked(subtitleService.remove).mockRejectedValue(unknownError);
    vi.mocked(extractErrorMessage).mockReturnValue(undefined);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(subtitleId);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(unknownError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar subtítulo: undefined');
    });
  });

  it('should return correct mutation state during pending', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    vi.mocked(subtitleService.remove).mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(subtitleId);

    // Wait for the mutation to start
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Clean up
    resolvePromise!(undefined);
  });

  it('should handle server error and show error toast', async () => {
    const serverError = new Error('Internal server error');
    const extractedMessage = 'Error interno del servidor';
    
    vi.mocked(subtitleService.remove).mockRejectedValue(serverError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(subtitleId);

    await waitFor(() => {
      expect(extractErrorMessage).toHaveBeenCalledWith(serverError, mockT);
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar subtítulo: Error interno del servidor');
    });
  });

  it('should handle multiple deletion attempts correctly', async () => {
    vi.mocked(subtitleService.remove).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    // First deletion
    result.current.mutate(1);
    await waitFor(() => {
      expect(subtitleService.remove).toHaveBeenCalledWith(1);
    });

    // Second deletion
    result.current.mutate(2);
    await waitFor(() => {
      expect(subtitleService.remove).toHaveBeenCalledWith(2);
    });

    expect(subtitleService.remove).toHaveBeenCalledTimes(2);
    expect(toast.success).toHaveBeenCalledTimes(2);
  });

  it('should handle deletion with invalid ID type', async () => {
    const invalidIdError = new Error('Invalid ID format');
    const extractedMessage = 'ID de subtítulo inválido';
    
    vi.mocked(subtitleService.remove).mockRejectedValue(invalidIdError);
    vi.mocked(extractErrorMessage).mockReturnValue(extractedMessage);

    const { result } = renderHook(() => useDeleteSubtitleMutation(), {
      wrapper: createWrapper(),
    });

    const invalidId = 'invalid' as any;
    result.current.mutate(invalidId);

    await waitFor(() => {
      expect(subtitleService.remove).toHaveBeenCalledWith(invalidId);
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar subtítulo: ID de subtítulo inválido');
    });
  });
}); 