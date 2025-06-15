import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useUpdateQuestionMutation } from './useUpdateQuestionMutation';
import { UpdateQuestionDto } from '../../../questions/dto/update-question.dto';
import type { Question } from '@prisma/client';
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
  update: vi.fn()
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
        return `${key.replace('toast_error_', 'Error al ').replace('_question', ' pregunta').replace('updating','actualizar')}: ${options.message}`;
      }
      // Simulate translation for other keys
      const translations: { [key: string]: string } = {
        'toast_question_updated_success': 'Pregunta actualizada exitosamente',
        'error_generic': 'Error desconocido',
      };
      return translations[key] || key;
    }),
  })),
}));

describe('useUpdateQuestionMutation', () => {
  const mockUpdateQuestionData: UpdateQuestionDto = {
    timestamp: 35,
    type: 'true-false',
    text: '¿Esta afirmación actualizada es verdadera?',
    languageCode: 'es-ES',
    isActive: true
  };

  const mockMutationParams = {
    id: 1,
    data: mockUpdateQuestionData
  };

  const mockUpdatedQuestion: Question = {
    id: 1,
    videoItemId: 123,
    timestamp: 35,
    type: 'true-false',
    text: '¿Esta afirmación actualizada es verdadera?',
    languageCode: 'es-ES',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T12:00:00Z')
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock the mutation function with default state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock());
    
    const { result } = renderHook(() => useUpdateQuestionMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update question successfully and show success toast', async () => {
    const mockQueryClient = createQueryResultMock();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: null,
      data: mockUpdatedQuestion,
      variables: mockMutationParams,
      isError: false,
      isIdle: false,
      isSuccess: true,
      status: 'success'
    }));

    // Mock the service response
    vi.mocked(questionService.update).mockResolvedValueOnce(mockUpdatedQuestion);

    const { result } = renderHook(() => useUpdateQuestionMutation());

    // Manually trigger the onSuccess callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onSuccess) {
      mutationConfig.onSuccess(mockUpdatedQuestion, mockMutationParams, undefined);
    }

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pregunta actualizada exitosamente');
      
      // Should invalidate both queries (questions list and individual question)
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['questions', { videoItemId: mockUpdatedQuestion.videoItemId }]
      });
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['question', mockUpdatedQuestion.id]
      });
    });
  });

  it('should show a specific error message from API response when updating question fails', async () => {
    const apiError = {
      response: {
        data: {
          message: 'El timestamp ya está ocupado por otra pregunta'
        }
      }
    };
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: apiError as any,
      data: undefined,
      variables: mockMutationParams,
      failureCount: 1,
      failureReason: apiError as any,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(questionService.update).mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useUpdateQuestionMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(apiError, mockMutationParams, undefined);
    }

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the API error message
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar pregunta: El timestamp ya está ocupado por otra pregunta');
    });
  });

  it('should show a generic error message for a standard Error object', async () => {
    const standardError = new Error('Database connection failed');
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: standardError,
      data: undefined,
      variables: mockMutationParams,
      failureCount: 1,
      failureReason: standardError,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(questionService.update).mockRejectedValueOnce(standardError);

    const { result } = renderHook(() => useUpdateQuestionMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(standardError, mockMutationParams, undefined);
    }

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the standard error message
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar pregunta: Database connection failed');
    });
  });

  it('should call the mutation function with correct parameters', async () => {
    const mockMutationFn = vi.fn().mockResolvedValue(mockUpdatedQuestion);
    
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      mutate: mockMutationFn
    }));

    // Mock the service response
    vi.mocked(questionService.update).mockResolvedValueOnce(mockUpdatedQuestion);

    const { result } = renderHook(() => useUpdateQuestionMutation());

    // Test that the mutation function is called with correct parameters
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.mutationFn) {
      await mutationConfig.mutationFn(mockMutationParams);
    }

    expect(questionService.update).toHaveBeenCalledWith(
      mockMutationParams.id,
      mockMutationParams.data
    );
  });

  it('should handle partial updates correctly', async () => {
    // Test updating only specific fields
    const partialUpdateData: UpdateQuestionDto = {
      text: 'Pregunta parcialmente actualizada'
      // Only updating the text field
    };

    const partialMutationParams = {
      id: 1,
      data: partialUpdateData
    };

    const mockPartiallyUpdatedQuestion: Question = {
      ...mockUpdatedQuestion,
      text: 'Pregunta parcialmente actualizada',
      updatedAt: new Date('2024-01-01T15:00:00Z')
    };

    const mockQueryClient = createQueryResultMock();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: null,
      data: mockPartiallyUpdatedQuestion,
      variables: partialMutationParams,
      isError: false,
      isIdle: false,
      isSuccess: true,
      status: 'success'
    }));

    // Mock the service response
    vi.mocked(questionService.update).mockResolvedValueOnce(mockPartiallyUpdatedQuestion);

    const { result } = renderHook(() => useUpdateQuestionMutation());

    // Manually trigger the onSuccess callback
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onSuccess) {
      mutationConfig.onSuccess(mockPartiallyUpdatedQuestion, partialMutationParams, undefined);
    }

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pregunta actualizada exitosamente');
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['questions', { videoItemId: mockPartiallyUpdatedQuestion.videoItemId }]
      });
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['question', mockPartiallyUpdatedQuestion.id]
      });
    });
  });

  it('should handle isActive toggle correctly', async () => {
    const toggleActiveData: UpdateQuestionDto = {
      isActive: false // Toggling from true to false
    };

    const toggleMutationParams = {
      id: 1,
      data: toggleActiveData
    };

    const mockToggledQuestion: Question = {
      ...mockUpdatedQuestion,
      isActive: false,
      updatedAt: new Date('2024-01-01T16:00:00Z')
    };

    const mockQueryClient = createQueryResultMock();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: null,
      data: mockToggledQuestion,
      variables: toggleMutationParams,
      isError: false,
      isIdle: false,
      isSuccess: true,
      status: 'success'
    }));

    // Mock the service response
    vi.mocked(questionService.update).mockResolvedValueOnce(mockToggledQuestion);

    const { result } = renderHook(() => useUpdateQuestionMutation());

    // Test that the mutation function is called with correct parameters
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.mutationFn) {
      await mutationConfig.mutationFn(toggleMutationParams);
    }

    expect(questionService.update).toHaveBeenCalledWith(
      toggleMutationParams.id,
      toggleMutationParams.data
    );
  });
}); 