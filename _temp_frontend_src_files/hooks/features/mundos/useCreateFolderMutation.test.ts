import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCreateFolderMutation } from './useCreateFolderMutation';
import { CreateFolderData } from '../../../services/folder.service';
import { PlaylistFolder } from '../../../types/folder.types';
import * as folderService from '../../../services/folder.service';
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

// Mock the react-query hooks
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => createQueryResultMock())
}));

// Mock the folder service
vi.mock('../../../services/folder.service', () => ({
  createFolder: vi.fn()
}));

// Mock the auth hook
vi.mock('../../useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id' }
  }))
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
        return `${key.replace('toast_error_', 'Error al ').replace('_folder', ' carpeta').replace('creating','crear')}: ${options.message}`;
      }
      // Simulate translation for other keys
      const translations: { [key: string]: string } = {
        'toast_folder_created_success': 'Carpeta creada exitosamente',
        'error_user_not_authenticated': 'Usuario no autenticado',
        'error_generic': 'Error desconocido',
        'toast_error_prefix': '¡Error!: {{ message }}',
      };
      return translations[key] || key;
    }),
  })),
}));

describe('useCreateFolderMutation', () => {
  const mockCreateFolderData: CreateFolderData = {
    name: 'Test Folder',
    mundo_id: 'mundo-123'
  };

  const mockCreatedFolder: PlaylistFolder = {
    id: 'folder-123',
    name: 'Test Folder',
    mundo_id: 'mundo-123',
    order_index: 0,
    is_pinned: false,
    is_deleted: false,
    created_by: 'test-user-id',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null
  };

  const mockMutationData = {
    data: mockCreateFolderData,
    userId: 'test-user-id'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    // Mock the mutation function with default state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock());
    
    const { result } = renderHook(() => useCreateFolderMutation());

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should create folder successfully and show success toast', async () => {
    const mockQueryClient = createQueryResultMock();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    
    // Mock the mutation function success state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: null,
      data: mockCreatedFolder,
      variables: mockMutationData,
      isError: false,
      isIdle: false,
      isSuccess: true,
      status: 'success'
    }));

    // Mock the service response
    vi.mocked(folderService.createFolder).mockResolvedValueOnce(mockCreatedFolder);

    const { result } = renderHook(() => useCreateFolderMutation());

    // Manually trigger the onSuccess callback for testing the toast
    // In a real scenario, useMutation handles calling this after the async operation
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onSuccess) {
      mutationConfig.onSuccess(mockCreatedFolder, mockMutationData, undefined);
    }

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Carpeta creada exitosamente');
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['folders', 'mundo-123']
      });
    });
  });

  it('should show a specific error message from API response when creating folder fails', async () => {
    const apiError = {
      response: {
        data: {
          message: 'Nombre de carpeta ya existe'
        }
      }
    };
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: apiError as any,
      data: undefined,
      variables: mockMutationData,
      failureCount: 1,
      failureReason: apiError as any,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(folderService.createFolder).mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useCreateFolderMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(apiError, mockMutationData, undefined);
    }

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the API error message
      expect(toast.error).toHaveBeenCalledWith('Error al crear carpeta: Nombre de carpeta ya existe');
    });
  });

  it('should show a generic error message for a standard Error object', async () => {
    const standardError = new Error('Network error');
    
    // Mock the mutation function error state
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      isPending: false,
      error: standardError,
      data: undefined,
      variables: mockMutationData,
      failureCount: 1,
      failureReason: standardError,
      isError: true,
      isIdle: false,
      isSuccess: false,
      status: 'error'
    }));

    // Mock the service to throw an error
    vi.mocked(folderService.createFolder).mockRejectedValueOnce(standardError);

    const { result } = renderHook(() => useCreateFolderMutation());

    // Manually trigger the onError callback for testing the toast
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.onError) {
      mutationConfig.onError(standardError, mockMutationData, undefined);
    }

    await waitFor(() => {
      // Expect toast.error to be called with the translated message including the standard error message
      expect(toast.error).toHaveBeenCalledWith('Error al crear carpeta: Network error');
    });
  });

  it('should call the mutation function with correct parameters', async () => {
    const mockMutationFn = vi.fn().mockResolvedValue(mockCreatedFolder);
    
    vi.mocked(useMutation).mockReturnValue(createMutationResultMock({
      mutate: mockMutationFn
    }));

    // Mock the service response
    vi.mocked(folderService.createFolder).mockResolvedValueOnce(mockCreatedFolder);

    const { result } = renderHook(() => useCreateFolderMutation());

    // Test that the mutation function is called with correct parameters
    const mutationConfig = vi.mocked(useMutation).mock.calls[0][0];
    if (mutationConfig.mutationFn) {
      await mutationConfig.mutationFn(mockMutationData);
    }

    expect(folderService.createFolder).toHaveBeenCalledWith(
      mockCreateFolderData,
      'test-user-id'
    );
  });
}); 