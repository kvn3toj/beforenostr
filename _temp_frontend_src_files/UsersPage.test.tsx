import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UsersPage } from './UsersPage';
import { User } from '../types/user.types';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';

type MockUseMutationResult<TError = unknown> = {
  mutate: vi.Mock<void, [unknown]>;
  isPending: boolean;
  error: TError | null;
  data?: unknown;
  variables?: unknown;
  isError?: boolean;
  isIdle?: boolean;
  isPaused?: boolean;
  isSuccess?: boolean;
  reset?: () => void;
  status?: string;
  mutateAsync?: vi.Mock<Promise<void>, [unknown]>;
};

// Mock hooks
vi.mock('../hooks/useHasRole', () => ({
  useHasRole: vi.fn(() => true),
}));

// Declara mocks antes
const mockUseUsersQuery = vi.fn(() => ({
  data: [],
  isLoading: false,
}));

vi.mock('../hooks/useUsersQuery', () => ({
  useUsersQuery: () => mockUseUsersQuery(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

// Mock DataTable: render a real table with rows and cells for semantic queries
vi.mock('../components/common/DataTable/DataTable', () => ({
  DataTable: vi.fn(({ data = [], isLoading, isError, totalCount, onRowClick }) => {
    if (isLoading) {
      return <div role="progressbar">Cargando usuarios...</div>;
    }
    if (isError) {
      return <div role="alert">Error al cargar usuarios</div>;
    }
    if (data.length === 0) {
      return <div>No hay usuarios disponibles</div>;
    }
    return (
      <table>
        <caption>{`Total de usuarios: ${totalCount}`}</caption>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user: Partial<User>) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role?.name}</td>
              <td>
                <button aria-label="Editar" onClick={() => onRowClick?.(user)}>Editar</button>
                <button aria-label={`Eliminar usuario ${user.email}`} onClick={() => { user._onDelete?.(); }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }),
}));

// Mock ConfirmDialog: render a real dialog
vi.mock('../components/common/ConfirmDialog/ConfirmDialog', () => ({
  ConfirmDialog: vi.fn(({ open, onClose, onConfirm, title, message }) =>
    open ? (
      <dialog open role="dialog" aria-labelledby="confirm-dialog-title">
        <h2 id="confirm-dialog-title">{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={onConfirm}>Eliminar</button>
      </dialog>
    ) : null
  ),
}));

// Mock UserForm: render a real form
vi.mock('../components/features/users/components/UserForm/UserForm', () => ({
  UserForm: vi.fn(({ onSubmit, onClose, initialData }) => (
    <form aria-label="Formulario de usuario" onSubmit={e => { e.preventDefault(); onSubmit({ email: 'test@example.com', role_id: '1', password: 'password123' }); }}>
      <input name="email" defaultValue={initialData?.email || ''} aria-label="Correo electrónico" />
      <input name="password" type="password" aria-label="Contraseña" />
      <select name="role_id" aria-label="Rol" defaultValue={initialData?.role_id || ''}>
        <option value="1">Admin</option>
        <option value="2">Editor</option>
      </select>
      <button type="button" onClick={onClose}>Cancelar</button>
      <button type="submit">{initialData ? 'Actualizar Usuario' : 'Crear Usuario'}</button>
    </form>
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

// Utility to create a mock for useMutation result
function createMutationResultMock({ mutate = vi.fn(), isPending = false, error = null } = {}) {
  return {
    mutate,
    isPending,
    error,
    data: undefined,
    variables: undefined,
    isError: false,
    isIdle: false,
    isPaused: false,
    isSuccess: false,
    reset: vi.fn(),
    status: 'idle',
    mutateAsync: vi.fn(),
  };
}

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
    mockUseUsersQuery.mockReturnValue({
      data: { data: mockUsers, count: mockUsers.length },
      isLoading: false,
      isError: false,
      error: null,
    });

    vi.mocked(useMutation).mockReturnValue(createMutationResultMock());
  });

  it('should render successfully with data', () => {
    render(<UsersPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Total de usuarios: 2')).toBeInTheDocument();
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseUsersQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<UsersPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseUsersQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch users'),
    });

    render(<UsersPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/error al cargar usuarios/i)).toBeInTheDocument();
  });

  it('should show empty state', () => {
    mockUseUsersQuery.mockReturnValue({
      data: { data: [], count: 0 },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<UsersPage />, { wrapper: TestWrapper });

    expect(screen.getByText(/no hay usuarios disponibles/i)).toBeInTheDocument();
  });

  // Create User Flow Tests
  it('should open create user dialog when clicking "Crear Nuevo Usuario"', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    const createButton = screen.getByRole('button', { name: /crear nuevo usuario/i });
    await userEvent.click(createButton);
    
    expect(screen.getByRole('form', { name: /formulario de usuario/i })).toBeInTheDocument();
  });

  it('should close create user dialog when clicking Cancel', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const createButton = screen.getByRole('button', { name: /crear nuevo usuario/i });
    await userEvent.click(createButton);
    
    // Verify dialog is open
    expect(screen.getByRole('form', { name: /formulario de usuario/i })).toBeInTheDocument();
    
    // Close dialog
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);
    
    // Verify dialog is closed
    expect(screen.queryByRole('form', { name: /formulario de usuario/i })).not.toBeInTheDocument();
  });

  it('should call create mutation and handle success when submitting form', async () => {
    const mockCreateUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockCreateUser,
      isPending: false,
      error: null,
    } as MockUseMutationResult);

    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const createButton = screen.getByRole('button', { name: /crear nuevo usuario/i });
    await userEvent.click(createButton);
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await userEvent.click(submitButton);
    
    // Verify mutation was called with correct data
    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      role_id: '1',
      password: 'password123'
    });
    
    // Simulate success
    const onSuccess = vi.mocked(useMutation).mock.calls[0][0].onSuccess;
    if (onSuccess) await onSuccess();
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuario creado exitosamente');
      expect(screen.queryByRole('form', { name: /formulario de usuario/i })).not.toBeInTheDocument();
    });
  });

  it('should handle error when creating user', async () => {
    const mockError = new Error('Failed to create user');
    const mockCreateUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockCreateUser,
      isPending: false,
      error: mockError,
    } as MockUseMutationResult);

    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const createButton = screen.getByRole('button', { name: /crear nuevo usuario/i });
    await userEvent.click(createButton);
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await userEvent.click(submitButton);
    
    // Simulate error
    const onError = vi.mocked(useMutation).mock.calls[0][0].onError;
    if (onError) await onError(mockError);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al crear el usuario: Failed to create user');
      expect(screen.getByRole('form', { name: /formulario de usuario/i })).toBeInTheDocument();
    });
  });

  // Delete User Flow Tests
  it('should open delete confirmation dialog when clicking delete button', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Buscar la fila del usuario y el botón de eliminar
    const row = screen.getByText('test1@example.com').closest('tr');
    const deleteButton = within(row!).getByRole('button', { name: /eliminar usuario/i });
    await userEvent.click(deleteButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/test1@example.com/)).toBeInTheDocument();
  });

  it('should close delete dialog when clicking Cancel', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    // Open dialog
    const row = screen.getByText('test1@example.com').closest('tr');
    const deleteButton = within(row!).getByRole('button', { name: /eliminar usuario/i });
    await userEvent.click(deleteButton);
    
    // Verify dialog is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Close dialog
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);
    
    // Verify dialog is closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call delete mutation and handle success when confirming deletion', async () => {
    const mockDeleteUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue(
      createMutationResultMock({ mutate: mockDeleteUser })
    );

    render(<UsersPage />, { wrapper: TestWrapper });
    // Open dialog
    const row = screen.getByText('test1@example.com').closest('tr');
    const deleteButton = within(row!).getByRole('button', { name: /eliminar usuario/i });
    await userEvent.click(deleteButton);
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /eliminar/i });
    await userEvent.click(confirmButton);
    // Verify mutation was called with correct ID
    expect(mockDeleteUser).toHaveBeenCalledWith('1');
    // Simulate success
    const onSuccess = vi.mocked(useMutation).mock.calls[0][0].onSuccess;
    if (onSuccess) await onSuccess();
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuario eliminado exitosamente');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle error when deleting user', async () => {
    const mockError = new Error('Failed to delete user');
    const mockDeleteUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue(
      createMutationResultMock({ mutate: mockDeleteUser, error: mockError })
    );

    render(<UsersPage />, { wrapper: TestWrapper });
    // Open dialog
    const row = screen.getByText('test1@example.com').closest('tr');
    const deleteButton = within(row!).getByRole('button', { name: /eliminar usuario/i });
    await userEvent.click(deleteButton);
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /eliminar/i });
    await userEvent.click(confirmButton);
    // Simulate error
    const onError = vi.mocked(useMutation).mock.calls[0][0].onError;
    if (onError) await onError(mockError);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar el usuario: Failed to delete user');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // Edit User Flow Tests
  it('should open edit dialog when clicking edit button', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    const row = screen.getByText('test1@example.com').closest('tr');
    const editButton = within(row!).getByRole('button', { name: /editar/i });
    await userEvent.click(editButton);
    
    expect(screen.getByRole('form', { name: /formulario de usuario/i })).toBeInTheDocument();
  });

  it('should pre-fill form with user data when editing', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    const row = screen.getByText('test1@example.com').closest('tr');
    const editButton = within(row!).getByRole('button', { name: /editar/i });
    await userEvent.click(editButton);
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    expect(emailInput).toHaveValue('test1@example.com');
  });

  it('should close edit dialog when clicking Cancel', async () => {
    render(<UsersPage />, { wrapper: TestWrapper });
    
    const row = screen.getByText('test1@example.com').closest('tr');
    const editButton = within(row!).getByRole('button', { name: /editar/i });
    await userEvent.click(editButton);
    
    expect(screen.getByRole('form', { name: /formulario de usuario/i })).toBeInTheDocument();
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);
    
    expect(screen.queryByRole('form', { name: /formulario de usuario/i })).not.toBeInTheDocument();
  });

  it('should call update mutation and handle success when submitting edit form', async () => {
    const mockUpdateUser = vi.fn();
    vi.mocked(useMutation).mockReturnValue(
      createMutationResultMock({ mutate: mockUpdateUser })
    );

    render(<UsersPage />, { wrapper: TestWrapper });
    const row = screen.getByText('test1@example.com').closest('tr');
    const editButton = within(row!).getByRole('button', { name: /editar/i });
    await userEvent.click(editButton);
    const submitButton = screen.getByRole('button', { name: /actualizar usuario/i });
    await userEvent.click(submitButton);
    expect(mockUpdateUser).toHaveBeenCalled();
    // Simulate success
    const onSuccess = vi.mocked(useMutation).mock.calls[0][0].onSuccess;
    if (onSuccess) await onSuccess();
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Usuario actualizado exitosamente');
      expect(screen.queryByRole('form', { name: /formulario de usuario/i })).not.toBeInTheDocument();
    });
  });

  it('should call update mutation and handle error when submitting edit form', async () => {
    const mockUpdateUser = vi.fn();
    const mockError = new Error('Failed to update user');
    vi.mocked(useMutation).mockReturnValue(
      createMutationResultMock({ mutate: mockUpdateUser, error: mockError })
    );

    render(<UsersPage />, { wrapper: TestWrapper });
    const row = screen.getByText('test1@example.com').closest('tr');
    const editButton = within(row!).getByRole('button', { name: /editar/i });
    await userEvent.click(editButton);
    const submitButton = screen.getByRole('button', { name: /actualizar usuario/i });
    await userEvent.click(submitButton);
    // Simulate error
    const onError = vi.mocked(useMutation).mock.calls[0][0].onError;
    if (onError) await onError(mockError);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al actualizar el usuario: Failed to update user');
      expect(screen.getByRole('form', { name: /formulario de usuario/i })).toBeInTheDocument();
    });
  });
}); 