import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useDeleteQuestionMutation } from './useDeleteQuestionMutation';
import * as questionService from '../../../services/question.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Utility functions for mocking
const createMutationResultMock = (overrides = {}) => ({
  mutate: vi.fn(),
  isPending: false,
  error: null,
  data: undefined,
  variables: undefined,
  context: undefined,
  failureCount: 0,
  failureReason: null,
  isError: false,
  isIdle: true,
  isPaused: false,
  isSuccess: false,
  mutateAsync: vi.fn(),
  reset: vi.fn(),
  status: 'idle' as const,
  submittedAt: 0,
  ...overrides
});

const createQueryResultMock = (overrides = {}) => ({
  invalidateQueries: vi.fn(),
  ...overrides
});

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => createQueryResultMock())
}));

// Mock the question service
vi.mock('../../../services/question.service', () => ({
  remove: vi.fn()
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock the error utils
vi.mock('../../../utils/errorUtils', () => ({
  extractErrorMessage: vi.fn((error, t) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return t('error_generic');
  })
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: vi.fn((key, options) => {
      if (options && options.message) {
        // Simulate translation with message interpolation
        return `${key.replace('toast_error_', 'Error al ').replace('_question', ' pregunta').replace('deleting','eliminar')}: ${options.message}`;
      }
      // Simulate translation for other keys
      const translations: { [key: string]: string } = {
        'toast_question_deleted_success': 'Pregunta eliminada exitosamente',
        'error_generic': 'Error desconocido',
      };
      return translations[key] || key;
    }),
  })),
}));

describe('useDeleteQuestionMutation', () => {
  const mockDeleteParams = {
    id: 1,
    videoItemId: 123
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock the mutation function with default state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock());
    
    const { result } = renderHook(() => useDeleteQuestionMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should delete question successfully and show success toast', async () => {
    const mockQueryClient = createQueryResultMock();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: null,
      data: undefined, // Delete returns void
      variables: mockDeleteParams,
      isError: false,
      isIdle: false,
      isSuccess: true,
      status: 'success'
    }));

    // Mock the service response (void)
    vi.mocked(questionService.remove).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteQuestionMutation());

    // Manually trigger the onSuccess callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onSuccess) {
      mutationConfig.onSuccess(undefined, mockDeleteParams, undefined);
    }

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pregunta eliminada exitosamente');
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['questions', { videoItemId: mockDeleteParams.videoItemId }]
      });
    });
  });

  it('should show a specific error message from API response when deleting question fails', async () => {
    const apiError = {
      response: {
        data: {
          message: 'No se puede eliminar la pregunta porque está siendo utilizada'
        }
      }
    };
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: apiError as any,
      data: undefined,
      variables: mockDeleteParams,
      failureCount: 1,
      failureReason: apiError as any,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(questionService.remove).mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useDeleteQuestionMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(apiError, mockDeleteParams, undefined);
    }

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the API error message
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar pregunta: No se puede eliminar la pregunta porque está siendo utilizada');
    });
  });

  it('should show a generic error message for a standard Error object', async () => {
    const standardError = new Error('Server is temporarily unavailable');
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: standardError,
      data: undefined,
      variables: mockDeleteParams,
      failureCount: 1,
      failureReason: standardError,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(questionService.remove).mockRejectedValueOnce(standardError);

    const { result } = renderHook(() => useDeleteQuestionMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(standardError, mockDeleteParams, undefined);
    }

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the standard error message
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar pregunta: Server is temporarily unavailable');
    });
  });

  it('should call the mutation function with correct parameters', async () => {
    const mockMutationFn = vi.fn().mockResolvedValue(undefined);
    
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      mutate: mockMutationFn
    }));

    // Mock the service response
    vi.mocked(questionService.remove).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteQuestionMutation());

    // Test that the mutation function is called with correct parameters
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.mutationFn) {
      await mutationConfig.mutationFn(mockDeleteParams);
    }

    expect(questionService.remove).toHaveBeenCalledWith(mockDeleteParams.id);
  });

  it('should handle deletion with different videoItemId correctly', async () => {
    const mockDeleteParamsOtherVideo = {
      id: 2,
      videoItemId: 456 // Different video
    };

    const mockQueryClient = createQueryResultMock();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: null,
      data: undefined,
      variables: mockDeleteParamsOtherVideo,
      isError: false,
      isIdle: false,
      isSuccess: true,
      status: 'success'
    }));

    // Mock the service response
    vi.mocked(questionService.remove).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteQuestionMutation());

    // Manually trigger the onSuccess callback
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onSuccess) {
      mutationConfig.onSuccess(undefined, mockDeleteParamsOtherVideo, undefined);
    }

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pregunta eliminada exitosamente');
      // Should invalidate queries for the correct videoItemId
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['questions', { videoItemId: mockDeleteParamsOtherVideo.videoItemId }]
      });
    });
  });

  it('should handle unauthorized deletion error', async () => {
    const unauthorizedError = {
      response: {
        status: 403,
        data: {
          message: 'No tienes permisos para eliminar esta pregunta'
        }
      }
    };
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: unauthorizedError as any,
      data: undefined,
      variables: mockDeleteParams,
      failureCount: 1,
      failureReason: unauthorizedError as any,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(questionService.remove).mockRejectedValueOnce(unauthorizedError);

    const { result } = renderHook(() => useDeleteQuestionMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(unauthorizedError, mockDeleteParams, undefined);
    }

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar pregunta: No tienes permisos para eliminar esta pregunta');
    });
  });

  it('should handle not found deletion error', async () => {
    const notFoundError = {
      response: {
        status: 404,
        data: {
          message: 'La pregunta no existe o ya fue eliminada'
        }
      }
    };
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: notFoundError as any,
      data: undefined,
      variables: mockDeleteParams,
      failureCount: 1,
      failureReason: notFoundError as any,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(questionService.remove).mockRejectedValueOnce(notFoundError);

    const { result } = renderHook(() => useDeleteQuestionMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(notFoundError, mockDeleteParams, undefined);
    }

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar pregunta: La pregunta no existe o ya fue eliminada');
    });
  });
}); 