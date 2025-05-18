import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserDetailPage } from './UserDetailPage';
import type { User, UpdateUserData } from '../types/user.types';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-id', role: { name: 'Super Admin' } },
    isLoading: false,
  }),
}));

vi.mock('../hooks/useHasRole', () => ({
  useHasRole: vi.fn(() => true),
}));

vi.mock('../hooks/useUserQuery', () => ({
  useUserQuery: vi.fn(() => ({
    data: mockUser,
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

vi.mock('../hooks/useUpdateUserMutation', () => ({
  useUpdateUserMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('../components/features/users/components/UserForm/UserForm', () => ({
  UserForm: ({ defaultValues, onSubmit, onClose, isLoading }: any) => (
    <div data-testid="mock-user-form">
      <div>Mock User Form</div>
      <div>Default Values: {JSON.stringify(defaultValues)}</div>
      <button onClick={() => onSubmit({ ...defaultValues, name: 'Updated Name' })}>
        Submit
      </button>
      <button onClick={onClose}>Cancel</button>
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock data
const mockUser: User = {
  id: 'mock-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role_id: 'role-1',
  role: {
    id: 'role-1',
    name: 'User',
    description: 'Regular user role',
  },
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/users/${mockUser.id}`]}>
        <Routes>
          <Route path="/users/:userId" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('UserDetailPage', () => {
  const renderUserDetailPage = () => {
    return render(<UserDetailPage />, { wrapper: TestWrapper });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering States', () => {
    it('renders user details in view mode for authorized users', () => {
      renderUserDetailPage();
      
      expect(screen.getByText('Detalles del Usuario')).toBeInTheDocument();
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getByText(mockUser.role.name)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
      expect(screen.queryByTestId('mock-user-form')).not.toBeInTheDocument();
    });

    it('shows loading state', () => {
      vi.mocked(useUserQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      renderUserDetailPage();
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error state', () => {
      const errorMessage = 'Failed to load user';
      vi.mocked(useUserQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
      });

      renderUserDetailPage();
      
      expect(screen.getByText(`Error al cargar el usuario: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  describe('Edit Flow', () => {
    it('handles successful edit flow for authorized users', async () => {
      const mockMutate = vi.fn();
      vi.mocked(useUpdateUserMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      renderUserDetailPage();

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /editar/i });
      await userEvent.click(editButton);

      // Verify form is rendered with correct default values
      const mockForm = screen.getByTestId('mock-user-form');
      expect(mockForm).toBeInTheDocument();
      expect(mockForm).toHaveTextContent(JSON.stringify(mockUser));

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          id: mockUser.id,
          data: expect.objectContaining({
            name: 'Updated Name',
          }),
        });
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('mock-user-form')).not.toBeInTheDocument();
      });
    });

    it('handles edit cancellation', async () => {
      renderUserDetailPage();

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /editar/i });
      await userEvent.click(editButton);

      // Verify form is rendered
      expect(screen.getByTestId('mock-user-form')).toBeInTheDocument();

      // Cancel edit
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      // Verify form is no longer rendered
      expect(screen.queryByTestId('mock-user-form')).not.toBeInTheDocument();
    });

    it('disables edit button for unauthorized users', () => {
      vi.mocked(useHasRole).mockReturnValue(false);

      renderUserDetailPage();

      const editButton = screen.getByRole('button', { name: /editar/i });
      expect(editButton).toBeDisabled();
    });

    it('handles edit error', async () => {
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => {
        onError(new Error('Update failed'));
      });
      vi.mocked(useUpdateUserMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      renderUserDetailPage();

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /editar/i });
      await userEvent.click(editButton);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByTestId('mock-user-form')).toBeInTheDocument(); // Form should still be visible
      });
    });

    it('shows loading state during edit submission', () => {
      vi.mocked(useUpdateUserMutation).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      renderUserDetailPage();

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /editar/i });
      userEvent.click(editButton);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
}); 