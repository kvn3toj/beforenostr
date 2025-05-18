import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UsersPage } from './UsersPage';
import { User } from '../types/user.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';

// Mock hooks
vi.mock('../hooks/useHasRole', () => ({
  useHasRole: vi.fn(() => true),
}));

vi.mock('../hooks/useUsersQuery', () => ({
  useUsersQuery: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: vi.fn(),
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
    })),
  };
});

// Mock components
vi.mock('../components/common/DataTable/DataTable', () => ({
  DataTable: vi.fn(({ data, isLoading, isError, totalCount, page, pageSize, sortBy, sortDirection, filters, onRowClick }) => (
    <div data-testid="data-table">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">Error loading data</div>}
      {!isLoading && !isError && data.length === 0 && (
        <div data-testid="empty">No data available</div>
      )}
      {!isLoading && !isError && data.length > 0 && (
        <div data-testid="table-content">
          <div data-testid="total-count">{totalCount}</div>
          <div data-testid="current-page">{page}</div>
          <div data-testid="page-size">{pageSize}</div>
          <div data-testid="sort-by">{sortBy}</div>
          <div data-testid="sort-direction">{sortDirection}</div>
          <div data-testid="filters">{JSON.stringify(filters)}</div>
          {data.map((item: User) => (
            <div key={item.id} data-testid={`user-${item.id}`} onClick={() => onRowClick?.(item)}>
              <div>{item.email}</div>
              <button data-testid={`delete-user-${item.id}`} onClick={(e) => {
                e.stopPropagation();
                const deleteButton = e.currentTarget;
                deleteButton.click();
              }}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )),
}));

vi.mock('../components/common/ConfirmDialog/ConfirmDialog', () => ({
  ConfirmDialog: vi.fn(({ open, onClose, onConfirm, title, message }) => (
    open ? (
      <div data-testid="confirm-dialog">
        <div data-testid="dialog-title">{title}</div>
        <div data-testid="dialog-message">{message}</div>
        <button data-testid="dialog-confirm" onClick={onConfirm}>Confirm</button>
        <button data-testid="dialog-cancel" onClick={onClose}>Cancel</button>
      </div>
    ) : null
  )),
}));

vi.mock('../components/features/users/components/UserForm/UserForm', () => ({
  UserForm: vi.fn(({ onSubmit, onClose, defaultValues, isLoading }) => (
    <div data-testid="user-form">
      {isLoading && <div data-testid="form-loading">Loading...</div>}
      {defaultValues && <div data-testid="form-default-values">{JSON.stringify(defaultValues)}</div>}
      <button data-testid="form-submit" onClick={() => onSubmit({ email: 'test@example.com', role_id: '1', password: 'password123' })}>Submit</button>
      <button data-testid="form-cancel" onClick={onClose}>Cancel</button>
    </div>
  )),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('UsersPage', () => {
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'test1@example.com',
      role_id: '1',
      role: {
        id: '1',
        name: 'Admin',
        permissions: ['read', 'write'],
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      last_login: null,
      is_active: true,
    },
    {
      id: '2',
      email: 'test2@example.com',
      role_id: '2',
      role: {
        id: '2',
        name: 'Editor',
        permissions: ['read'],
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      last_login: null,
      is_active: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(useUsersQuery).mockReturnValue({
      data: { data: mockUsers, count: mockUsers.length },
      isLoading: false,
      isError: false,
      error: null,
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    } as any);
  });

  it('should render successfully with data', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });

    // Verify DataTable is rendered with correct props
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('total-count')).toHaveTextContent('2');
    expect(screen.getByTestId('user-1')).toHaveTextContent('test1@example.com');
    expect(screen.getByTestId('user-2')).toHaveTextContent('test2@example.com');
  });

  it('should show loading state', async () => {
    vi.mocked(useUsersQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<UsersPage />, { wrapper: TestWrapper });

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should show error state', async () => {
    vi.mocked(useUsersQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch users'),
    });

    render(<UsersPage />, { wrapper: TestWrapper });

    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('should show empty state', async () => {
    vi.mocked(useUsersQuery).mockReturnValue({
      data: { data: [], count: 0 },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<UsersPage />, { wrapper: TestWrapper });

    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });

  // Create User Flow Tests
  it('should open create user dialog when clicking "Crear Nuevo Usuario"', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    const createButton = screen.getByRole('button', { name: /crear nuevo usuario/i });
    await userEvent.click(createButton);
    
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
  });

  it('should close create user dialog when clicking Cancel', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const createButton = screen.getByRole('button', { name: /crear nuevo usuario/i });
    await userEvent.click(createButton);
    
    // Verify dialog is open
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    
    // Close dialog
    const cancelButton = screen.getByTestId('form-cancel');
    await userEvent.click(cancelButton);
    
    // Verify dialog is closed
    expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
  });

  it('should call create mutation and handle success when submitting form', async () => {
    const mockCreateUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockCreateUser,
      isPending: false,
      error: null,
    } as any);

    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const createButton = screen.getByRole('button', { name: /crear nuevo usuario/i });
    await userEvent.click(createButton);
    
    // Submit form
    const submitButton = screen.getByTestId('form-submit');
    await userEvent.click(submitButton);
    
    // Verify mutation was called with correct data
    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      role_id: '1',
      password: 'password123'
    });
    
    // Simulate success
    const onSuccess = vi.mocked(useMutation).mock.calls[0][0].onSuccess;
    await onSuccess();
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuario creado exitosamente');
      expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
    });
  });

  it('should handle error when creating user', async () => {
    const mockError = new Error('Failed to create user');
    const mockCreateUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockCreateUser,
      isPending: false,
      error: mockError,
    } as any);

    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const createButton = screen.getByRole('button', { name: /crear nuevo usuario/i });
    await userEvent.click(createButton);
    
    // Submit form
    const submitButton = screen.getByTestId('form-submit');
    await userEvent.click(submitButton);
    
    // Simulate error
    const onError = vi.mocked(useMutation).mock.calls[0][0].onError;
    await onError(mockError);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al crear el usuario: Failed to create user');
      expect(screen.getByTestId('user-form')).toBeInTheDocument();
    });
  });

  // Delete User Flow Tests
  it('should open delete confirmation dialog when clicking delete button', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    const deleteButton = screen.getByTestId('delete-user-1');
    await userEvent.click(deleteButton);
    
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-message')).toHaveTextContent('test1@example.com');
  });

  it('should close delete dialog when clicking Cancel', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const deleteButton = screen.getByTestId('delete-user-1');
    await userEvent.click(deleteButton);
    
    // Verify dialog is open
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    
    // Close dialog
    const cancelButton = screen.getByTestId('dialog-cancel');
    await userEvent.click(cancelButton);
    
    // Verify dialog is closed
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });

  it('should call delete mutation and handle success when confirming deletion', async () => {
    const mockDeleteUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockDeleteUser,
      isPending: false,
      error: null,
    } as any);

    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const deleteButton = screen.getByTestId('delete-user-1');
    await userEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByTestId('dialog-confirm');
    await userEvent.click(confirmButton);
    
    // Verify mutation was called with correct ID
    expect(mockDeleteUser).toHaveBeenCalledWith('1');
    
    // Simulate success
    const onSuccess = vi.mocked(useMutation).mock.calls[0][0].onSuccess;
    await onSuccess();
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuario eliminado exitosamente');
      expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle error when deleting user', async () => {
    const mockError = new Error('Failed to delete user');
    const mockDeleteUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockDeleteUser,
      isPending: false,
      error: mockError,
    } as any);

    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const deleteButton = screen.getByTestId('delete-user-1');
    await userEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByTestId('dialog-confirm');
    await userEvent.click(confirmButton);
    
    // Simulate error
    const onError = vi.mocked(useMutation).mock.calls[0][0].onError;
    await onError(mockError);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar el usuario: Failed to delete user');
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    });
  });

  // Edit User Flow Tests
  it('should open edit dialog when clicking edit button', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    const editButton = screen.getAllByLabelText('Editar')[0];
    await userEvent.click(editButton);
    
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
  });

  it('should pre-fill form with user data when editing', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    const editButton = screen.getAllByLabelText('Editar')[0];
    await userEvent.click(editButton);
    
    const defaultValuesElement = screen.getByTestId('form-default-values');
    const defaultValues = JSON.parse(defaultValuesElement.textContent || '{}');
    
    expect(defaultValues).toEqual({
      id: mockUsers[0].id,
      email: mockUsers[0].email,
      role_id: mockUsers[0].role_id,
    });
  });

  it('should close edit dialog when clicking Cancel', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const editButton = screen.getAllByLabelText('Editar')[0];
    await userEvent.click(editButton);
    
    // Verify dialog is open
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    
    // Close dialog
    const cancelButton = screen.getByTestId('form-cancel');
    await userEvent.click(cancelButton);
    
    // Verify dialog is closed
    expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
    
    // Verify update mutation was not called
    const { mutate } = vi.mocked(useMutation).mock.results[0].value;
    expect(mutate).not.toHaveBeenCalled();
  });

  it('should call update mutation and handle success when submitting edit form', async () => {
    const mockUpdateUser = vi.fn();
    const mockOnSuccess = vi.fn();
    
    vi.mocked(useMutation).mockReturnValue({
      mutate: (data, options) => {
        mockUpdateUser(data);
        options?.onSuccess?.();
      },
      isPending: false,
      error: null,
    } as any);

    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open edit dialog
    const editButton = screen.getAllByLabelText('Editar')[0];
    await userEvent.click(editButton);
    
    // Submit form
    const submitButton = screen.getByTestId('form-submit');
    await userEvent.click(submitButton);
    
    // Verify update mutation was called with correct data
    expect(mockUpdateUser).toHaveBeenCalledWith({
      id: mockUsers[0].id,
      email: 'test@example.com',
      role_id: '1',
      password: 'password123',
    });
    
    // Verify success actions
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(vi.mocked(useQueryClient).mock.results[0].value.invalidateQueries).toHaveBeenCalledWith(['users']);
    });
    
    // Verify dialog is closed
    expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
  });

  it('should call update mutation and handle error when submitting edit form', async () => {
    const mockUpdateUser = vi.fn();
    const mockError = new Error('Failed to update user');
    
    vi.mocked(useMutation).mockReturnValue({
      mutate: (data, options) => {
        mockUpdateUser(data);
        options?.onError?.(mockError);
      },
      isPending: false,
      error: null,
    } as any);

    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open edit dialog
    const editButton = screen.getAllByLabelText('Editar')[0];
    await userEvent.click(editButton);
    
    // Submit form
    const submitButton = screen.getByTestId('form-submit');
    await userEvent.click(submitButton);
    
    // Verify update mutation was called with correct data
    expect(mockUpdateUser).toHaveBeenCalledWith({
      id: mockUsers[0].id,
      email: 'test@example.com',
      role_id: '1',
      password: 'password123',
    });
    
    // Verify error actions
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(mockError.message);
    });
    
    // Verify dialog remains open
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
  });
}); 