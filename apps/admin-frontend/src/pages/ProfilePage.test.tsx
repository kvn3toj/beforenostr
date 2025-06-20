import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProfilePage } from './ProfilePage';
import { useCurrentUserQuery } from '../hooks/useCurrentUserQuery';
import { updateUser } from '../services/user.service';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../hooks/useCurrentUserQuery');
vi.mock('../services/user.service');
vi.mock('sonner');
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock UserForm component
vi.mock('../components/features/users/components/UserForm', () => ({
  UserForm: ({ onSubmit, onClose, defaultValues, isLoading }: any) => (
    <div data-testid="user-form">
      <button 
        onClick={() => onSubmit(defaultValues)} 
        disabled={isLoading}
        data-testid="submit-form"
      >
        Submit
      </button>
      <button onClick={onClose} data-testid="close-form">
        Close
      </button>
    </div>
  ),
}));

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: null,
  isActive: true,
  role: {
    id: '1',
    name: 'Admin',
  },
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
  lastLogin: '2023-01-03T00:00:00Z',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Failed to load profile');
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
  });

  it('renders user profile information', () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText('my_profile')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('displays user avatar with first letter of email', () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText('T')).toBeInTheDocument(); // First letter of email
  });

  it('shows edit form when edit button is clicked', async () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    const editButton = screen.getByText('edit_profile');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
    });

    expect(screen.getByText('cancel')).toBeInTheDocument();
  });

  it('cancels edit mode when cancel button is clicked', async () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    // Enter edit mode
    const editButton = screen.getByText('edit_profile');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
    });

    // Cancel edit mode
    const cancelButton = screen.getByText('cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
    });

    expect(screen.getByText('edit_profile')).toBeInTheDocument();
  });

  it('submits form and shows success message', async () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(updateUser).mockResolvedValue(mockUser);

    render(<ProfilePage />, { wrapper: createWrapper() });

    // Enter edit mode
    const editButton = screen.getByText('edit_profile');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
    });

    // Submit form
    const submitButton = screen.getByTestId('submit-form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith('1', {
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: null,
        isActive: true,
      });
    });
  });

  it('shows error message when update fails', async () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const error = new Error('Update failed');
    vi.mocked(updateUser).mockRejectedValue(error);

    render(<ProfilePage />, { wrapper: createWrapper() });

    // Enter edit mode
    const editButton = screen.getByText('edit_profile');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
    });

    // Submit form
    const submitButton = screen.getByTestId('submit-form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('profile_update_error');
    });
  });

  it('displays account information correctly', () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText('account_information')).toBeInTheDocument();
    expect(screen.getByText('member_since')).toBeInTheDocument();
    expect(screen.getByText('last_updated')).toBeInTheDocument();
    expect(screen.getByText('last_login')).toBeInTheDocument();
  });

  it('shows account actions section', () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText('account_actions')).toBeInTheDocument();
    expect(screen.getByText('change_password')).toBeInTheDocument();
    expect(screen.getByText('export_data')).toBeInTheDocument();
  });

  it('shows coming soon message for account actions', async () => {
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: mockUser,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    const changePasswordButton = screen.getByText('change_password');
    fireEvent.click(changePasswordButton);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith('feature_coming_soon');
    });
  });

  it('handles user without name gracefully', () => {
    const userWithoutName = { ...mockUser, name: null };
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: userWithoutName,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText('not_specified')).toBeInTheDocument();
  });

  it('handles user without role gracefully', () => {
    const userWithoutRole = { ...mockUser, role: null };
    vi.mocked(useCurrentUserQuery).mockReturnValue({
      data: userWithoutRole,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<ProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByText('no_role_assigned')).toBeInTheDocument();
  });
}); 