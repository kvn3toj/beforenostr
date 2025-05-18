import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserForm } from './UserForm';
import { useRolesQuery } from '../../../hooks/useRolesQuery';
import type { User, Role } from '../../../types/user.types';

// Mock the useRolesQuery hook
vi.mock('../../../hooks/useRolesQuery', () => ({
  useRolesQuery: vi.fn(),
}));

// Mock MUI components
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    DialogContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-content">{children}</div>
    ),
    DialogActions: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="dialog-actions">{children}</div>
    ),
    TextField: ({ label, error, helperText, ...props }: any) => (
      <div>
        <label>{label}</label>
        <input {...props} data-testid={`input-${label.toLowerCase()}`} />
        {error && <div data-testid={`error-${label.toLowerCase()}`}>{helperText}</div>}
      </div>
    ),
    Switch: ({ ...props }: any) => (
      <input type="checkbox" {...props} data-testid="switch-active" />
    ),
    Select: ({ children, value, onChange, ...props }: any) => (
      <select
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
        {...props}
        data-testid="select-role"
        aria-label="Rol"
      >
        {children}
      </select>
    ),
    MenuItem: ({ children, value }: any) => (
      <option value={value}>{children}</option>
    ),
    FormControl: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    InputLabel: ({ children }: { children: React.ReactNode }) => (
      <label>{children}</label>
    ),
    FormHelperText: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="helper-text">{children}</div>
    ),
    FormControlLabel: ({ control, label }: any) => (
      <div>
        <label>{label}</label>
        {control}
      </div>
    ),
  };
});

describe('UserForm', () => {
  const mockRoles: Role[] = [
    {
      id: '1',
      name: 'Admin',
      permissions: ['read', 'write'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'User',
      permissions: ['read'],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  const mockUser: Partial<User> = {
    email: 'test@example.com',
    role_id: '1',
    is_active: true,
  };

  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock useRolesQuery to return roles
    vi.mocked(useRolesQuery).mockReturnValue({
      data: mockRoles,
      isLoading: false,
      isError: false,
    } as any);
  });

  it('should render successfully in create mode (without defaultValues)', () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Verify form elements are present
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByTestId('select-role')).toBeInTheDocument();
    expect(screen.getByTestId('switch-active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear usuario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();

    // Verify default values
    expect(screen.getByTestId('input-email')).toHaveValue('');
    expect(screen.getByTestId('input-contraseña')).toHaveValue('');
    expect(screen.getByTestId('select-role')).toHaveValue('');
    expect(screen.getByTestId('switch-active')).toBeChecked();
  });

  it('should render successfully in edit mode (with defaultValues)', () => {
    render(
      <UserForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        defaultValues={mockUser}
        isEdit
      />
    );

    // Verify form is pre-filled with defaultValues
    expect(screen.getByTestId('input-email')).toHaveValue(mockUser.email);
    expect(screen.getByTestId('input-contraseña')).toHaveValue('');
    expect(screen.getByTestId('select-role')).toHaveValue(mockUser.role_id);
    expect(screen.getByTestId('switch-active')).toBeChecked();
    expect(screen.getByRole('button', { name: /actualizar usuario/i })).toBeInTheDocument();
  });

  it('should disable form elements when loading', () => {
    render(
      <UserForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={true}
      />
    );

    // Verify form elements are disabled
    expect(screen.getByTestId('input-email')).toBeDisabled();
    expect(screen.getByTestId('input-contraseña')).toBeDisabled();
    expect(screen.getByTestId('select-role')).toBeDisabled();
    expect(screen.getByTestId('switch-active')).toBeDisabled();
    expect(screen.getByRole('button', { name: /crear usuario/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
  });

  it('should show validation errors on invalid submit in create mode', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await userEvent.click(submitButton);

    // Verify validation errors are shown
    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
      expect(screen.getByText('El rol es requerido')).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle valid form submission in create mode', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in the form with valid data
    await userEvent.type(screen.getByTestId('input-email'), 'test@example.com');
    await userEvent.type(screen.getByTestId('input-contraseña'), 'password123');
    await userEvent.selectOptions(screen.getByTestId('select-role'), '1');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        role_id: '1',
        is_active: true,
      });
    });
  });

  it('should handle valid form submission in edit mode without password', async () => {
    render(
      <UserForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        defaultValues={mockUser}
        isEdit
      />
    );

    // Change email and role
    await userEvent.clear(screen.getByTestId('input-email'));
    await userEvent.type(screen.getByTestId('input-email'), 'updated@example.com');
    await userEvent.selectOptions(screen.getByTestId('select-role'), '2');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /actualizar usuario/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct data (without password)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'updated@example.com',
        role_id: '2',
        is_active: true,
      });
    });
  });

  it('should handle valid form submission in edit mode with new password', async () => {
    render(
      <UserForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        defaultValues={mockUser}
        isEdit
      />
    );

    // Change email, role and add new password
    await userEvent.clear(screen.getByTestId('input-email'));
    await userEvent.type(screen.getByTestId('input-email'), 'updated@example.com');
    await userEvent.selectOptions(screen.getByTestId('select-role'), '2');
    await userEvent.type(screen.getByTestId('input-contraseña'), 'newpassword123');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /actualizar usuario/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct data (including new password)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'updated@example.com',
        role_id: '2',
        is_active: true,
        password: 'newpassword123',
      });
    });
  });

  it('should handle is_active switch correctly', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in required fields
    await userEvent.type(screen.getByTestId('input-email'), 'test@example.com');
    await userEvent.type(screen.getByTestId('input-contraseña'), 'password123');
    await userEvent.selectOptions(screen.getByTestId('select-role'), '1');

    // Toggle is_active switch
    const activeSwitch = screen.getByTestId('switch-active');
    expect(activeSwitch).toBeChecked(); // Default value is true
    await userEvent.click(activeSwitch);
    expect(activeSwitch).not.toBeChecked();

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct is_active value
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        is_active: false,
      }));
    });
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not show cancel button when onClose is not provided', () => {
    render(<UserForm onSubmit={mockOnSubmit} />);

    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
  });

  it('should show loading state in role select when roles are loading', () => {
    vi.mocked(useRolesQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    expect(screen.getByText('Cargando roles...')).toBeInTheDocument();
    expect(screen.getByTestId('select-role')).toBeDisabled();
  });

  it('should show error state in role select when roles fail to load', () => {
    vi.mocked(useRolesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    expect(screen.getByText('Error al cargar roles')).toBeInTheDocument();
    expect(screen.getByTestId('select-role')).toBeDisabled();
  });

  it('should show empty state in role select when no roles are available', () => {
    vi.mocked(useRolesQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    expect(screen.getByText('No hay roles disponibles')).toBeInTheDocument();
    expect(screen.getByTestId('select-role')).toBeDisabled();
  });
}); 