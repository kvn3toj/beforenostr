import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { RoleForm } from './RoleForm';
import type { Role } from '../../../types/user.types';

// Mock MUI components if needed
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
  };
});

describe('RoleForm', () => {
  const mockRole: Partial<Role> = {
    name: 'Test Role',
  };

  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully in create mode (without defaultValues)', () => {
    render(<RoleForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Verify form elements are present
    expect(screen.getByLabelText('Nombre del Rol')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear rol/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();

    // Verify form is empty by default
    expect(screen.getByLabelText('Nombre del Rol')).toHaveValue('');
  });

  it('should render successfully in edit mode (with defaultValues)', () => {
    render(
      <RoleForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        defaultValues={mockRole}
      />
    );

    // Verify form is pre-filled with defaultValues
    expect(screen.getByLabelText('Nombre del Rol')).toHaveValue(mockRole.name);
  });

  it('should disable form elements when loading', () => {
    render(
      <RoleForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={true}
      />
    );

    // Verify form elements are disabled
    expect(screen.getByLabelText('Nombre del Rol')).toBeDisabled();
    expect(screen.getByRole('button', { name: /crear rol/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
  });

  it('should show validation errors on invalid submit', async () => {
    render(<RoleForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /crear rol/i });
    await userEvent.click(submitButton);

    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 3 caracteres')).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle valid form submission', async () => {
    render(<RoleForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in the form with valid data
    const nameInput = screen.getByLabelText('Nombre del Rol');
    await userEvent.type(nameInput, 'Valid Role Name');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear rol/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Valid Role Name',
      });
    });

    // Verify no validation errors are shown
    expect(screen.queryByText(/el nombre debe tener al menos 3 caracteres/i)).not.toBeInTheDocument();
  });

  it('should validate name format', async () => {
    render(<RoleForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Try invalid characters
    const nameInput = screen.getByLabelText('Nombre del Rol');
    await userEvent.type(nameInput, 'Invalid@Name');
    await userEvent.tab(); // Trigger blur

    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText('El nombre solo puede contener letras, números, espacios, guiones y guiones bajos')).toBeInTheDocument();
    });

    // Try valid characters
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Valid-Name_123');
    await userEvent.tab(); // Trigger blur

    // Verify no validation error is shown
    await waitFor(() => {
      expect(screen.queryByText(/el nombre solo puede contener/i)).not.toBeInTheDocument();
    });
  });

  it('should validate name length', async () => {
    render(<RoleForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Try too short name
    const nameInput = screen.getByLabelText('Nombre del Rol');
    await userEvent.type(nameInput, 'Ab');
    await userEvent.tab(); // Trigger blur

    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 3 caracteres')).toBeInTheDocument();
    });

    // Try too long name
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'A'.repeat(51));
    await userEvent.tab(); // Trigger blur

    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText('El nombre no puede tener más de 50 caracteres')).toBeInTheDocument();
    });
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(<RoleForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not show cancel button when onClose is not provided', () => {
    render(<RoleForm onSubmit={mockOnSubmit} />);

    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
  });
}); 