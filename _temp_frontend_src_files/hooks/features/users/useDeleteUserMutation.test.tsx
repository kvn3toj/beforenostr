import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteUser } from '../../../services/user.service';
import { useDeleteUserMutation } from './useDeleteUserMutation';

// Mock the toast library
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the user service
vi.mock('../../../services/user.service', () => ({
  deleteUser: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'toast_user_deleted_success') return 'User deleted successfully!';
      if (key === 'error_generic') return 'An unexpected error occurred.';
      if (key === 'toast_error_deleting_user') return `Error deleting user: ${options?.message}`;
      return key;
    },
  }),
}));

describe('useDeleteUserMutation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    // Clear mocks before each test
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
    vi.mocked(deleteUser).mockClear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should call deleteUser and show success toast on successful mutation', async () => {
    const userId = 'user-id-123';
    vi.mocked(deleteUser).mockResolvedValue({});

    const { result } = renderHook(() => useDeleteUserMutation(), { wrapper });

    result.current.mutate(userId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(deleteUser).toHaveBeenCalledWith(userId);
    expect(toast.success).toHaveBeenCalledWith('User deleted successfully!');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should show specific error toast on mutation error with response message', async () => {
    const userId = 'user-id-123';
    const errorMessage = 'User deletion failed.';
    const errorResponse = { response: { data: { message: errorMessage } }, message: 'Network Error' };
    vi.mocked(deleteUser).mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useDeleteUserMutation(), { wrapper });

    result.current.mutate(userId);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(deleteUser).toHaveBeenCalledWith(userId);
    expect(toast.error).toHaveBeenCalledWith(`Error deleting user: ${errorMessage}`);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should show generic error toast on mutation error without response message', async () => {
    const userId = 'user-id-123';
    const errorMessage = 'Network Error';
    const errorResponse = new Error(errorMessage);
    vi.mocked(deleteUser).mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useDeleteUserMutation(), { wrapper });

    result.current.mutate(userId);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(deleteUser).toHaveBeenCalledWith(userId);
    expect(toast.error).toHaveBeenCalledWith(`Error deleting user: Network Error`);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should invalidate users query on successful mutation', async () => {
    const userId = 'user-id-123';
    vi.mocked(deleteUser).mockResolvedValue({});
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteUserMutation(), { wrapper });

    result.current.mutate(userId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['users'] });
  });
}); 