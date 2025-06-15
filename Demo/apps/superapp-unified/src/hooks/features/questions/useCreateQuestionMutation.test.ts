import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCreateQuestionMutation } from './useCreateQuestionMutation';
import { CreateQuestionDto } from '../../../questions/dto/create-question.dto';
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
  create: vi.fn()
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
        return `${key.replace('toast_error_', 'Error al ').replace('_question', ' pregunta').replace('creating','crear')}: ${options.message}`;
      }
      // Simulate translation for other keys
      const translations: { [key: string]: string } = {
        'toast_question_created_success': 'Pregunta creada exitosamente',
        'error_generic': 'Error desconocido',
      };
      return translations[key] || key;
    }),
  })),
}));

describe('useCreateQuestionMutation', () => {
  const mockCreateQuestionData: CreateQuestionDto = {
    videoItemId: 123,
    timestamp: 30,
    type: 'multiple-choice',
    text: '¿Cuál es la respuesta correcta?',
    languageCode: 'es-ES',
    isActive: true,
    answerOptions: [
      { text: 'Opción A', isCorrect: true, order: 0 },
      { text: 'Opción B', isCorrect: false, order: 1 }
    ]
  };

  const mockCreatedQuestion: Question = {
    id: 1,
    videoItemId: 123,
    timestamp: 30,
    type: 'multiple-choice',
    text: '¿Cuál es la respuesta correcta?',
    languageCode: 'es-ES',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock the mutation function with default state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock());
    
    const { result } = renderHook(() => useCreateQuestionMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should create question successfully and show success toast', async () => {
    const mockQueryClient = createQueryResultMock();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: null,
      data: mockCreatedQuestion,
      variables: mockCreateQuestionData,
      isError: false,
      isIdle: false,
      isSuccess: true,
      status: 'success'
    }));

    // Mock the service response
    vi.mocked(questionService.create).mockResolvedValueOnce(mockCreatedQuestion);

    const { result } = renderHook(() => useCreateQuestionMutation());

    // Manually trigger the onSuccess callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onSuccess) {
      mutationConfig.onSuccess(mockCreatedQuestion, mockCreateQuestionData, undefined);
    }

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pregunta creada exitosamente');
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['questions', { videoItemId: mockCreatedQuestion.videoItemId }]
      });
    });
  });

  it('should show a specific error message from API response when creating question fails', async () => {
    const apiError = {
      response: {
        data: {
          message: 'El timestamp ya tiene una pregunta asignada'
        }
      }
    };
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: apiError as any,
      data: undefined,
      variables: mockCreateQuestionData,
      failureCount: 1,
      failureReason: apiError as any,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(questionService.create).mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useCreateQuestionMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(apiError, mockCreateQuestionData, undefined);
    }

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the API error message
      expect(toast.error).toHaveBeenCalledWith('Error al crear pregunta: El timestamp ya tiene una pregunta asignada');
    });
  });

  it('should show a generic error message for a standard Error object', async () => {
    const standardError = new Error('Network error');
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: standardError,
      data: undefined,
      variables: mockCreateQuestionData,
      failureCount: 1,
      failureReason: standardError,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(questionService.create).mockRejectedValueOnce(standardError);

    const { result } = renderHook(() => useCreateQuestionMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(standardError, mockCreateQuestionData, undefined);
    }

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the standard error message
      expect(toast.error).toHaveBeenCalledWith('Error al crear pregunta: Network error');
    });
  });

  it('should call the mutation function with correct parameters', async () => {
    const mockMutationFn = vi.fn().mockResolvedValue(mockCreatedQuestion);
    
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      mutate: mockMutationFn
    }));

    // Mock the service response
    vi.mocked(questionService.create).mockResolvedValueOnce(mockCreatedQuestion);

    const { result } = renderHook(() => useCreateQuestionMutation());

    // Test that the mutation function is called with correct parameters
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.mutationFn) {
      await mutationConfig.mutationFn(mockCreateQuestionData);
    }

    expect(questionService.create).toHaveBeenCalledWith(mockCreateQuestionData);
  });

  it('should handle true-false question type without answerOptions', async () => {
    const trueFalseQuestionData: CreateQuestionDto = {
      videoItemId: 123,
      timestamp: 45,
      type: 'true-false',
      text: '¿Esta afirmación es verdadera?',
      languageCode: 'es-ES',
      isActive: true
      // No answerOptions for true-false type
    };

    const mockTrueFalseQuestion: Question = {
      id: 2,
      videoItemId: 123,
      timestamp: 45,
      type: 'true-false',
      text: '¿Esta afirmación es verdadera?',
      languageCode: 'es-ES',
      isActive: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    };

    const mockQueryClient = createQueryResultMock();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: null,
      data: mockTrueFalseQuestion,
      variables: trueFalseQuestionData,
      isError: false,
      isIdle: false,
      isSuccess: true,
      status: 'success'
    }));

    // Mock the service response
    vi.mocked(questionService.create).mockResolvedValueOnce(mockTrueFalseQuestion);

    const { result } = renderHook(() => useCreateQuestionMutation());

    // Manually trigger the onSuccess callback
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onSuccess) {
      mutationConfig.onSuccess(mockTrueFalseQuestion, trueFalseQuestionData, undefined);
    }

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pregunta creada exitosamente');
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['questions', { videoItemId: mockTrueFalseQuestion.videoItemId }]
      });
    });
  });
}); 