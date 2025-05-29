import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUser } from "../../../services/user.service";
import { useCreateUserMutation } from "./useCreateUserMutation";
import { useTranslation } from "react-i18next";
import { extractErrorMessage } from "../../../utils/errorUtils";
import { CreateUserData } from "../../../types/user.types";

// Mock the services, utilities, and react-i18next
vi.mock("../../../services/user.service");
vi.mock("sonner");
vi.mock("react-i18next");
vi.mock("../../../utils/errorUtils");

describe("useCreateUserMutation", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.clearAllMocks();

    // Configurar mocks por defecto
    vi.mocked(useTranslation).mockReturnValue({
      t: vi.fn((key, options) => {
        if (key === 'toast_user_created_success') return 'Usuario creado exitosamente';
        if (key === 'error_generic') return 'Error desconocido';
        if (key === 'toast_error_creating_user') return `Error al crear usuario: ${options?.message}`;
        return key;
      }),
    } as any);

    vi.mocked(extractErrorMessage).mockImplementation((error, t) => {
      if (error?.response?.data?.message) return error.response.data.message;
      if (error instanceof Error) return error.message;
      return t('error_generic');
    });

    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();
    vi.mocked(createUser).mockClear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should handle successful user creation", async () => {
    const mockUserData: CreateUserData = { 
      email: "test@example.com", 
      name: "Test User",
      avatarUrl: "https://example.com/avatar.jpg",
      isActive: true 
    };
    const mockSuccessResponse = { 
      id: 'user-1', 
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      lastLogin: null,
      ...mockUserData 
    };
    vi.mocked(createUser).mockResolvedValueOnce(mockSuccessResponse);

    const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

    act(() => {
      result.current.mutate(mockUserData);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(createUser).toHaveBeenCalledWith(mockUserData);
    expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Usuario creado exitosamente');
    expect(vi.mocked(toast.error)).not.toHaveBeenCalled();
  });

  it("should show specific error toast on mutation error with response message", async () => {
    const mockUserData: CreateUserData = { 
      email: "test@example.com", 
      name: "Test User",
      isActive: true 
    };
    const apiErrorMessage = "User with this email already exists.";
    const mockApiError = { response: { data: { message: apiErrorMessage } }, message: "Network Error" };
    vi.mocked(createUser).mockRejectedValueOnce(mockApiError);

    const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

    act(() => {
      result.current.mutate(mockUserData);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(createUser).toHaveBeenCalledWith(mockUserData);
    expect(vi.mocked(extractErrorMessage)).toHaveBeenCalledWith(mockApiError, vi.mocked(useTranslation)().t);
    expect(vi.mocked(useTranslation)().t).toHaveBeenCalledWith('toast_error_creating_user', { message: apiErrorMessage });
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(`Error al crear usuario: ${apiErrorMessage}`);
    expect(vi.mocked(toast.success)).not.toHaveBeenCalled();
  });

  it("should show standard error toast on mutation error with standard Error object", async () => {
    const mockUserData: CreateUserData = { 
      email: "test@example.com", 
      name: "Test User",
      isActive: true 
    };
    const standardErrorMessage = "Failed to connect";
    const mockStandardError = new Error(standardErrorMessage);
    vi.mocked(createUser).mockRejectedValueOnce(mockStandardError);

    const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

    act(() => {
      result.current.mutate(mockUserData);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(createUser).toHaveBeenCalledWith(mockUserData);
    expect(vi.mocked(extractErrorMessage)).toHaveBeenCalledWith(mockStandardError, vi.mocked(useTranslation)().t);
    expect(vi.mocked(useTranslation)().t).toHaveBeenCalledWith('toast_error_creating_user', { message: standardErrorMessage });
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(`Error al crear usuario: ${standardErrorMessage}`);
    expect(vi.mocked(toast.success)).not.toHaveBeenCalled();
  });

  it("should show generic error toast on mutation error with unknown type", async () => {
    const mockUserData: CreateUserData = { 
      email: "test@example.com", 
      name: "Test User",
      isActive: true 
    };
    const mockUnknownError = "Something unexpected happened";
    vi.mocked(createUser).mockRejectedValueOnce(mockUnknownError);

    const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

    act(() => {
      result.current.mutate(mockUserData);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(createUser).toHaveBeenCalledWith(mockUserData);
    expect(vi.mocked(extractErrorMessage)).toHaveBeenCalledWith(mockUnknownError, vi.mocked(useTranslation)().t);
    expect(vi.mocked(useTranslation)().t).toHaveBeenCalledWith('toast_error_creating_user', { message: 'Error desconocido' });
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(`Error al crear usuario: Error desconocido`);
    expect(vi.mocked(toast.success)).not.toHaveBeenCalled();
  });

  it("should set isPending to true during mutation", async () => {
    const mockUserData: CreateUserData = { 
      email: "test@example.com", 
      name: "Test User",
      isActive: true 
    };
    
    // Create a promise that we can control
    let resolvePromise: (value: any) => void;
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    vi.mocked(createUser).mockReturnValueOnce(controlledPromise as any);

    const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

    // Start the mutation
    act(() => {
      result.current.mutate(mockUserData);
    });

    // Check that isPending is true immediately after mutation starts
    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Resolve the promise to complete the mutation
    act(() => {
      resolvePromise!({});
    });

    // Wait for the mutation to complete
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('should invalidate users query on successful mutation', async () => {
    const userData: CreateUserData = { 
      email: 'test@example.com', 
      name: 'Test User',
      isActive: true 
    };
    vi.mocked(createUser).mockResolvedValue({});
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

    act(() => {
      result.current.mutate(userData);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['users'] });
    invalidateQueriesSpy.mockRestore();
  });
}); 