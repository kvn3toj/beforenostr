import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RolesPage } from './RolesPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import type { Role } from '../types/user.types';
import type { FetchRolesParams, CreateRoleData, UpdateRoleData } from '../services/role.service';

// Mock hooks
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user-id', role: { name: 'Super Admin' } },
    isLoading: false,
  })),
}));

vi.mock('../hooks/useHasRole', () => ({
  useHasRole: vi.fn(() => true),
}));

vi.mock('../hooks/useRolesQuery', () => ({
  useRolesQuery: vi.fn(),
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
vi.mock('../components/common/ConfirmDialog', () => ({
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

vi.mock('../components/features/roles/components/RoleForm', () => ({
  RoleForm: vi.fn(({ onSubmit, onClose, defaultValues, isLoading }) => (
    <div data-testid="role-form">
      {isLoading && <div data-testid="form-loading">Loading...</div>}
      {defaultValues && <div data-testid="form-default-values">{JSON.stringify(defaultValues)}</div>}
      <button data-testid="form-submit" onClick={() => onSubmit({ name: 'Test Role', permissions: ['test:permission'] })}>Submit</button>
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

// Mock permissions-related hooks
vi.mock('../hooks/useAvailablePermissionsQuery', () => ({
  useAvailablePermissionsQuery: vi.fn(),
}));

vi.mock('../hooks/useUpdateRolePermissionsMutation', () => ({
  useUpdateRolePermissionsMutation: vi.fn(),
}));

// Mock permissions dialog component
vi.mock('../components/features/roles/components/PermissionsDialog', () => ({
  PermissionsDialog: vi.fn(({ open, onClose, onSave, role, availablePermissions, selectedPermissions }) => (
    open ? (
      <div data-testid="permissions-dialog">
        <div data-testid="dialog-title">Gestionar Permisos para {role.name}</div>
        <div data-testid="available-permissions">
          {availablePermissions?.map((permission) => (
            <div key={permission.id} data-testid={`permission-${permission.id}`}>
              <label>
                <input
                  type="checkbox"
                  data-testid={`permission-checkbox-${permission.id}`}
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={() => {}}
                  aria-label={`Permiso ${permission.name}`}
                />
                {permission.name}
              </label>
            </div>
          ))}
        </div>
        <button data-testid="dialog-save" onClick={() => onSave(selectedPermissions)}>Guardar Cambios</button>
        <button data-testid="dialog-cancel" onClick={onClose}>Cancelar</button>
      </div>
    ) : null
  )),
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

describe('RolesPage', () => {
  const mockRoles: Role[] = [
    {
      id: '1',
      name: 'Admin',
      permissions: ['users:manage', 'roles:manage'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'User',
      permissions: ['users:view'],
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(useRolesQuery).mockReturnValue({
      data: { data: mockRoles, count: mockRoles.length },
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
    render(<RolesPage />, { wrapper: TestWrapper });

    // Verify page title and create button
    expect(screen.getByText('Roles')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear nuevo rol/i })).toBeInTheDocument();

    // Verify table data
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('users:manage')).toBeInTheDocument();
    expect(screen.getByText('users:view')).toBeInTheDocument();

    // Verify pagination controls
    expect(screen.getByText('1-2 de 2')).toBeInTheDocument();
  });

  it('should show loading state', async () => {
    vi.mocked(useRolesQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<RolesPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error state', async () => {
    vi.mocked(useRolesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch roles'),
    });

    render(<RolesPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Error al cargar los datos')).toBeInTheDocument();
  });

  it('should show empty state', async () => {
    vi.mocked(useRolesQuery).mockReturnValue({
      data: { data: [], count: 0 },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<RolesPage />, { wrapper: TestWrapper });

    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('should handle pagination', async () => {
    const mockQuery = vi.fn();
    vi.mocked(useRolesQuery).mockImplementation(mockQuery);

    render(<RolesPage />, { wrapper: TestWrapper });

    // Click next page
    const nextPageButton = screen.getByRole('button', { name: /siguiente/i });
    await userEvent.click(nextPageButton);

    // Verify query was called with updated page
    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      page: 1,
    }));
  });

  it('should handle sorting', async () => {
    const mockQuery = vi.fn();
    vi.mocked(useRolesQuery).mockImplementation(mockQuery);

    render(<RolesPage />, { wrapper: TestWrapper });

    // Click sortable header
    const nameHeader = screen.getByText('Nombre');
    await userEvent.click(nameHeader);

    // Verify query was called with updated sort parameters
    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      sortBy: 'name',
      sortDirection: 'asc',
    }));
  });

  it('should handle filtering', async () => {
    const mockQuery = vi.fn();
    vi.mocked(useRolesQuery).mockImplementation(mockQuery);

    render(<RolesPage />, { wrapper: TestWrapper });

    // Type in filter input
    const filterInput = screen.getByPlaceholderText(/buscar/i);
    await userEvent.type(filterInput, 'test');

    // Verify query was called with updated filter
    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      filters: expect.objectContaining({
        name: 'test',
      }),
    }));
  });

  describe('Create Role Flow', () => {
    it('should open create dialog when clicking create button', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo rol/i });
      await userEvent.click(createButton);
      
      expect(screen.getByTestId('role-form')).toBeInTheDocument();
    });

    it('should close create dialog when clicking cancel', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo rol/i });
      await userEvent.click(createButton);
      
      const cancelButton = screen.getByTestId('form-cancel');
      await userEvent.click(cancelButton);
      
      expect(screen.queryByTestId('role-form')).not.toBeInTheDocument();
    });

    it('should call create mutation and handle success', async () => {
      const mockMutate = vi.fn();
      const mockOnSuccess = vi.fn();
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as any);

      render(<RolesPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo rol/i });
      await userEvent.click(createButton);
      
      const submitButton = screen.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      expect(mockMutate).toHaveBeenCalledWith({
        name: 'Test Role',
        permissions: ['test:permission'],
      });
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('role-form')).not.toBeInTheDocument();
      });
    });

    it('should handle create mutation error', async () => {
      const mockError = new Error('Failed to create role');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as any);

      render(<RolesPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo rol/i });
      await userEvent.click(createButton);
      
      const submitButton = screen.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByTestId('role-form')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Role Flow', () => {
    it('should open edit dialog when clicking edit button', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      expect(screen.getByTestId('role-form')).toBeInTheDocument();
    });

    it('should pre-fill form with role data', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const defaultValues = JSON.parse(screen.getByTestId('form-default-values').textContent || '{}');
      expect(defaultValues).toEqual(mockRoles[0]);
    });

    it('should close edit dialog when clicking cancel', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const cancelButton = screen.getByTestId('form-cancel');
      await userEvent.click(cancelButton);
      
      expect(screen.queryByTestId('role-form')).not.toBeInTheDocument();
    });

    it('should call update mutation and handle success', async () => {
      const mockMutate = vi.fn();
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as any);

      render(<RolesPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const submitButton = screen.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      expect(mockMutate).toHaveBeenCalledWith({
        id: mockRoles[0].id,
        data: {
          name: 'Test Role',
          permissions: ['test:permission'],
        },
      });
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('role-form')).not.toBeInTheDocument();
      });
    });

    it('should handle update mutation error', async () => {
      const mockError = new Error('Failed to update role');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as any);

      render(<RolesPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const submitButton = screen.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByTestId('role-form')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Role Flow', () => {
    it('should open delete dialog when clicking delete button', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-message')).toHaveTextContent(mockRoles[0].name);
    });

    it('should close delete dialog when clicking cancel', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      const cancelButton = screen.getByTestId('dialog-cancel');
      await userEvent.click(cancelButton);
      
      expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
    });

    it('should call delete mutation and handle success', async () => {
      const mockMutate = vi.fn();
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as any);

      render(<RolesPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      const confirmButton = screen.getByTestId('dialog-confirm');
      await userEvent.click(confirmButton);
      
      expect(mockMutate).toHaveBeenCalledWith(mockRoles[0].id);
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
      });
    });

    it('should handle delete mutation error', async () => {
      const mockError = new Error('Failed to delete role');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as any);

      render(<RolesPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      const confirmButton = screen.getByTestId('dialog-confirm');
      await userEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Manage Permissions Flow', () => {
    const mockPermissions = [
      { id: 'users:manage', name: 'Manage Users' },
      { id: 'roles:manage', name: 'Manage Roles' },
      { id: 'users:view', name: 'View Users' },
    ];

    beforeEach(() => {
      // Mock available permissions query
      vi.mocked(useAvailablePermissionsQuery).mockReturnValue({
        data: mockPermissions,
        isLoading: false,
        isError: false,
        error: null,
      });

      // Mock update permissions mutation
      vi.mocked(useUpdateRolePermissionsMutation).mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
        error: null,
      } as any);
    });

    it('should open permissions dialog when clicking manage permissions button', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });

      const managePermissionsButton = screen.getAllByLabelText('Gestionar Permisos')[0];
      await userEvent.click(managePermissionsButton);

      expect(screen.getByTestId('permissions-dialog')).toBeInTheDocument();
      expect(screen.getByText('Gestionar Permisos para Admin')).toBeInTheDocument();
      expect(useAvailablePermissionsQuery).toHaveBeenCalled();
    });

    it('should display available permissions and selected permissions correctly', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });

      const managePermissionsButton = screen.getAllByLabelText('Gestionar Permisos')[0];
      await userEvent.click(managePermissionsButton);

      await waitFor(() => {
        expect(screen.getByTestId('available-permissions')).toBeInTheDocument();
      });

      // Verify all available permissions are displayed
      mockPermissions.forEach(permission => {
        expect(screen.getByTestId(`permission-${permission.id}`)).toBeInTheDocument();
      });

      // Verify checkboxes state based on role's permissions
      const adminRole = mockRoles[0]; // Admin role has ['users:manage', 'roles:manage']
      expect(screen.getByTestId('permission-checkbox-users:manage')).toBeChecked();
      expect(screen.getByTestId('permission-checkbox-roles:manage')).toBeChecked();
      expect(screen.getByTestId('permission-checkbox-users:view')).not.toBeChecked();
    });

    it('should allow selecting and deselecting permissions', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });

      const managePermissionsButton = screen.getAllByLabelText('Gestionar Permisos')[0];
      await userEvent.click(managePermissionsButton);

      await waitFor(() => {
        expect(screen.getByTestId('available-permissions')).toBeInTheDocument();
      });

      const usersViewCheckbox = screen.getByTestId('permission-checkbox-users:view');
      expect(usersViewCheckbox).not.toBeChecked();

      await userEvent.click(usersViewCheckbox);
      expect(usersViewCheckbox).toBeChecked();

      await userEvent.click(usersViewCheckbox);
      expect(usersViewCheckbox).not.toBeChecked();
    });

    it('should call update mutation and handle success when saving changes', async () => {
      const mockMutate = vi.fn();
      vi.mocked(useUpdateRolePermissionsMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as any);

      render(<RolesPage />, { wrapper: TestWrapper });

      const managePermissionsButton = screen.getAllByLabelText('Gestionar Permisos')[0];
      await userEvent.click(managePermissionsButton);

      await waitFor(() => {
        expect(screen.getByTestId('available-permissions')).toBeInTheDocument();
      });

      const usersViewCheckbox = screen.getByTestId('permission-checkbox-users:view');
      await userEvent.click(usersViewCheckbox);

      const saveButton = screen.getByTestId('dialog-save');
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          roleId: '1',
          permissions: ['users:manage', 'roles:manage', 'users:view'],
        });
        expect(toast.success).toHaveBeenCalled();
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['roles'] });
        expect(screen.queryByTestId('permissions-dialog')).not.toBeInTheDocument();
      });
    });

    it('should handle error when saving changes', async () => {
      const mockMutate = vi.fn().mockRejectedValue(new Error('Failed to update permissions'));
      vi.mocked(useUpdateRolePermissionsMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as any);

      render(<RolesPage />, { wrapper: TestWrapper });

      const managePermissionsButton = screen.getAllByLabelText('Gestionar Permisos')[0];
      await userEvent.click(managePermissionsButton);

      await waitFor(() => {
        expect(screen.getByTestId('available-permissions')).toBeInTheDocument();
      });

      const usersViewCheckbox = screen.getByTestId('permission-checkbox-users:view');
      await userEvent.click(usersViewCheckbox);

      const saveButton = screen.getByTestId('dialog-save');
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByTestId('permissions-dialog')).toBeInTheDocument();
      });
    });

    it('should disable manage permissions button for unauthorized users', async () => {
      vi.mocked(useHasRole).mockReturnValue(false);

      render(<RolesPage />, { wrapper: TestWrapper });

      const managePermissionsButton = screen.getAllByLabelText('Gestionar Permisos')[0];
      expect(managePermissionsButton).toBeDisabled();
    });

    it('should close dialog when clicking cancel', async () => {
      render(<RolesPage />, { wrapper: TestWrapper });

      const managePermissionsButton = screen.getAllByLabelText('Gestionar Permisos')[0];
      await userEvent.click(managePermissionsButton);

      await waitFor(() => {
        expect(screen.getByTestId('permissions-dialog')).toBeInTheDocument();
      });

      const cancelButton = screen.getByTestId('dialog-cancel');
      await userEvent.click(cancelButton);

      expect(screen.queryByTestId('permissions-dialog')).not.toBeInTheDocument();
      expect(useUpdateRolePermissionsMutation().mutate).not.toHaveBeenCalled();
    });
  });
}); 