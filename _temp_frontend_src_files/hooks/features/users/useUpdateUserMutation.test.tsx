import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUser } from '../../../services/user.service';
import { useUpdateUserMutation } from './useUpdateUserMutation';

// Mock the toast library
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the user service
vi.mock('../../../services/user.service', () => ({
  updateUser: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'toast_user_updated_success') return 'User updated successfully!';
      if (key === 'error_generic') return 'An unexpected error occurred.';
      if (key === 'toast_error_updating_user') return `Error updating user: ${options?.message}`;
      return key;
    },
  }),
}));

describe('useUpdateUserMutation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    // Clear mocks before each test
    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
    vi.mocked(updateUser).mockClear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should call updateUser and show success toast on successful mutation', async () => {
    const userId = 'user-id-123';
    const userData = { email: 'updated@example.com', roleId: 'admin' };
    vi.mocked(updateUser).mockResolvedValue({});

    const { result } = renderHook(() => useUpdateUserMutation(), { wrapper });

    result.current.mutate({ id: userId, data: userData });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateUser).toHaveBeenCalledWith(userId, userData);
    expect(toast.success).toHaveBeenCalledWith('User updated successfully!');
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should show specific error toast on mutation error with response message', async () => {
    const userId = 'user-id-123';
    const userData = { email: 'updated@example.com', roleId: 'admin' };
    const errorMessage = 'User update failed.';
    const errorResponse = { response: { data: { message: errorMessage } }, message: 'Network Error' };
    vi.mocked(updateUser).mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useUpdateUserMutation(), { wrapper });

    result.current.mutate({ id: userId, data: userData });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(updateUser).toHaveBeenCalledWith(userId, userData);
    expect(toast.error).toHaveBeenCalledWith(`Error updating user: ${errorMessage}`);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should show generic error toast on mutation error without response message', async () => {
    const userId = 'user-id-123';
    const userData = { email: 'updated@example.com', roleId: 'admin' };
    const errorMessage = 'Network Error';
    const errorResponse = new Error(errorMessage);
    vi.mocked(updateUser).mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useUpdateUserMutation(), { wrapper });

    result.current.mutate({ id: userId, data: userData });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(updateUser).toHaveBeenCalledWith(userId, userData);
    expect(toast.error).toHaveBeenCalledWith(`Error updating user: Network Error`);
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('should invalidate users query on successful mutation', async () => {
    const userId = 'user-id-123';
    const userData = { email: 'updated@example.com', roleId: 'admin' };
    vi.mocked(updateUser).mockResolvedValue({});
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateUserMutation(), { wrapper });

    result.current.mutate({ id: userId, data: userData });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['users'] });
  });
}); 