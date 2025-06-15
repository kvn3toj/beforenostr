import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserForm } from './UserForm';
import type { User } from '../../../types/user.types';

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
        <input {...props} />
        {error && <div data-testid={`error-${label.toLowerCase()}`}>{helperText}</div>}
      </div>
    ),
    Switch: ({ checked, onChange, ...props }: any) => (
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        {...props} 
      />
    ),
    FormControlLabel: ({ control, label }: any) => (
      <div>
        <label>{label}</label>
        {control}
      </div>
    ),
  };
});

// Mock react-hook-form Controller
vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    Controller: ({ render, name }: any) => {
      const field = { value: name === 'isActive' ? true : '', onChange: vi.fn() };
      return render({ field });
    },
  };
});

describe('UserForm', () => {
  const mockUser: Partial<User> = {
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.jpg',
    isActive: true,
  };

  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully in create mode (without defaultValues)', () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Verify form elements are present
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('URL del Avatar')).toBeInTheDocument();
    expect(screen.getByLabelText(/usuario activo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear usuario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();

    // Verify default values
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
    expect(screen.getByLabelText(/url del avatar/i)).toHaveValue('');
    expect(screen.getByLabelText(/usuario activo/i)).toBeChecked();
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
    expect(screen.getByLabelText(/email/i)).toHaveValue(mockUser.email);
    expect(screen.getByLabelText(/nombre/i)).toHaveValue(mockUser.name);
    expect(screen.getByLabelText(/url del avatar/i)).toHaveValue(mockUser.avatarUrl);
    expect(screen.getByLabelText(/usuario activo/i)).toBeChecked();
    expect(screen.getByRole('button', { name: /actualizar usuario/i })).toBeInTheDocument();
  });

  it('should disable email field in edit mode', () => {
    render(
      <UserForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        defaultValues={mockUser}
        isEdit
      />
    );

    // Email should be disabled in edit mode
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    // Other fields should not be disabled
    expect(screen.getByLabelText(/nombre/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/url del avatar/i)).not.toBeDisabled();
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
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/nombre/i)).toBeDisabled();
    expect(screen.getByLabelText(/url del avatar/i)).toBeDisabled();
    expect(screen.getByLabelText(/usuario activo/i)).toBeDisabled();
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
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle valid form submission in create mode', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/url del avatar/i), 'https://example.com/avatar.jpg');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
        isActive: true,
      });
    });
  });

  it('should handle valid form submission in edit mode', async () => {
    render(
      <UserForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        defaultValues={mockUser}
        isEdit
      />
    );

    // Modify some fields
    const nameField = screen.getByLabelText(/nombre/i);
    await userEvent.clear(nameField);
    await userEvent.type(nameField, 'Updated User');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /actualizar usuario/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with updated data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: mockUser.email,
        name: 'Updated User',
        avatarUrl: mockUser.avatarUrl,
        isActive: true,
      });
    });
  });

  it('should handle close button click', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should clean up empty strings for optional fields', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in required field and leave optional fields empty
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    // Leave name and avatarUrl empty

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with undefined for empty optional fields
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: undefined,
        avatarUrl: undefined,
        isActive: true,
      });
    });
  });

  it('should validate avatar URL format', async () => {
    render(<UserForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in valid email and invalid URL
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/url del avatar/i), 'invalid-url');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear usuario/i });
    await userEvent.click(submitButton);

    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText('URL inválida')).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 