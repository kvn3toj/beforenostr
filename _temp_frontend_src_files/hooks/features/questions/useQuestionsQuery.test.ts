import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useQuestionsQuery } from './useQuestionsQuery';
import { FindAllQuestionsDto } from '../../../questions/dto/find-all-questions.dto';
import type { Question } from '@prisma/client';
import * as questionService from '../../../services/question.service';
import { useQuery } from '@tanstack/react-query';

// Utility to create a mock for useQuery result
function createQueryResultMock<T>({ data = undefined, isPending = false, isError = false, error = null, isSuccess = false } = {}) {
  return {
    data,
    isPending,
    isError,
    error,
    isSuccess: !isPending && !isError && data !== undefined,
    isLoading: isPending,
    status: isPending ? 'pending' : isError ? 'error' : 'success',
    refetch: vi.fn(),
    fetchStatus: 'idle',
  };
}

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn()
}));

// Mock the question service
vi.mock('../../../services/question.service', () => ({
  findAll: vi.fn()
}));

describe('useQuestionsQuery', () => {
  const mockQuestions: Question[] = [
    {
      id: 1,
      videoItemId: 123,
      timestamp: 30,
      type: 'multiple-choice',
      text: '¿Cuál es la respuesta correcta?',
      languageCode: 'es-ES',
      isActive: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: 2,
      videoItemId: 123,
      timestamp: 60,
      type: 'true-false',
      text: '¿Esta afirmación es verdadera?',
      languageCode: 'es-ES',
      isActive: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    }
  ];

  const validFindAllDto: FindAllQuestionsDto = {
    videoItemId: 123,
    languageCode: 'es-ES'
  };

  const invalidFindAllDto: FindAllQuestionsDto = {
    videoItemId: 0, // Invalid ID
    languageCode: 'es-ES'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    vi.mocked(useQuery).mockReturnValue(createQueryResultMock({
      isPending: true
    }));

    const { result } = renderHook(() => useQuestionsQuery(validFindAllDto));

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should fetch questions successfully with valid videoItemId', () => {
    vi.mocked(useQuery).mockReturnValue(createQueryResultMock({
      data: mockQuestions,
      isSuccess: true
    }));

    const { result } = renderHook(() => useQuestionsQuery(validFindAllDto));

    expect(result.current.data).toEqual(mockQuestions);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();

    // Verify that useQuery was called with correct parameters
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['questions', validFindAllDto],
      queryFn: expect.any(Function),
      enabled: true, // Valid videoItemId should enable the query
    });
  });

  it('should handle error state', () => {
    const error = new Error('Failed to fetch questions');
    
    vi.mocked(useQuery).mockReturnValue(createQueryResultMock({
      isError: true,
      error: error
    }));

    const { result } = renderHook(() => useQuestionsQuery(validFindAllDto));

    expect(result.current.error).toEqual(error);
    expect(result.current.isError).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should disable query when videoItemId is invalid (0)', () => {
    vi.mocked(useQuery).mockReturnValue(createQueryResultMock());

    renderHook(() => useQuestionsQuery(invalidFindAllDto));

    // Verify that useQuery was called with enabled: false
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['questions', invalidFindAllDto],
      queryFn: expect.any(Function),
      enabled: false, // Invalid videoItemId (0) should disable the query
    });
  });

  it('should disable query when videoItemId is negative', () => {
    const negativeIdDto: FindAllQuestionsDto = {
      videoItemId: -1,
      languageCode: 'es-ES'
    };

    vi.mocked(useQuery).mockReturnValue(createQueryResultMock());

    renderHook(() => useQuestionsQuery(negativeIdDto));

    // Verify that useQuery was called with enabled: false
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['questions', negativeIdDto],
      queryFn: expect.any(Function),
      enabled: false, // Negative videoItemId should disable the query
    });
  });

  it('should call questionService.findAll when queryFn is executed', async () => {
    vi.mocked(questionService.findAll).mockResolvedValueOnce(mockQuestions);
    
    vi.mocked(useQuery).mockReturnValue(createQueryResultMock({
      data: mockQuestions
    }));

    renderHook(() => useQuestionsQuery(validFindAllDto));

    // Get the queryFn that was passed to useQuery
    const queryConfig = vi.mocked(useQuery).mock.calls[0][0];
    const queryFn = queryConfig.queryFn;

    // Execute the queryFn and verify it calls the service correctly
    if (queryFn) {
      await queryFn();
      expect(questionService.findAll).toHaveBeenCalledWith(validFindAllDto);
    }
  });

  it('should return empty array when no questions are found', () => {
    vi.mocked(useQuery).mockReturnValue(createQueryResultMock({
      data: [],
      isSuccess: true
    }));

    const { result } = renderHook(() => useQuestionsQuery(validFindAllDto));

    expect(result.current.data).toEqual([]);
    expect(result.current.isSuccess).toBe(true);
  });
}); 