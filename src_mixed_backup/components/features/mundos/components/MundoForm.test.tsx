import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MundoForm } from './MundoForm';
import type { CreateMundoData } from '../../../../types/mundo.types';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

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
  };
});

// Mock MUI X Date Pickers
vi.mock('@mui/x-date-pickers', () => ({
  DateTimePicker: ({ label, value, onChange, slotProps }: any) => (
    <div>
      <label>{label}</label>
      <input
        type="datetime-local"
        value={value ? format(value, "yyyy-MM-dd'T'HH:mm") : ''}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          onChange(date);
        }}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
        {...slotProps?.textField}
      />
      {slotProps?.textField?.error && (
        <div data-testid={`error-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          {slotProps.textField.helperText}
        </div>
      )}
    </div>
  ),
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MundoForm', () => {
  const mockMundo: Partial<CreateMundoData> = {
    name: 'Test Mundo',
    description: 'Test Description',
    thumbnail_url: 'https://example.com/thumbnail.jpg',
    is_active: true,
    published_at: new Date().toISOString(),
    unpublished_at: addDays(new Date(), 7).toISOString(),
  };

  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully in create mode (without defaultValues)', async () => {
    render(<MundoForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Verify form elements are present
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL de Thumbnail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Activo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Publicación/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de Despublicación/i)).toBeInTheDocument();

    // Verify buttons are present
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
  });

  it('should render successfully in edit mode (with defaultValues)', async () => {
    render(
      <MundoForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        defaultValues={mockMundo}
      />
    );

    // Verify form is pre-filled with defaultValues
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue(mockMundo.name);
    expect(screen.getByLabelText(/Descripción/i)).toHaveValue(mockMundo.description);
    expect(screen.getByLabelText(/URL de Thumbnail/i)).toHaveValue(mockMundo.thumbnail_url);
    expect(screen.getByLabelText(/Activo/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Fecha de Publicación/i)).toHaveValue(
      format(new Date(mockMundo.published_at!), "yyyy-MM-dd'T'HH:mm")
    );
    expect(screen.getByLabelText(/Fecha de Despublicación/i)).toHaveValue(
      format(new Date(mockMundo.unpublished_at!), "yyyy-MM-dd'T'HH:mm")
    );

    // Verify buttons are present
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
  });

  it('should disable form elements when loading', async () => {
    render(
      <MundoForm
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={true}
      />
    );

    // Verify form elements are disabled
    expect(screen.getByLabelText(/Nombre/i)).toBeDisabled();
    expect(screen.getByLabelText(/Descripción/i)).toBeDisabled();
    expect(screen.getByLabelText(/URL de Thumbnail/i)).toBeDisabled();
    expect(screen.getByLabelText(/Activo/i)).toBeDisabled();
    expect(screen.getByLabelText(/Fecha de Publicación/i)).toBeDisabled();
    expect(screen.getByLabelText(/Fecha de Despublicación/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Guardar/i })).toBeDisabled();
  });

  it('should show validation errors on invalid submit', async () => {
    render(<MundoForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /Guardar/i });
    await userEvent.click(submitButton);

    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 3 caracteres')).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle valid form submission', async () => {
    render(<MundoForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/Nombre/i), 'Valid Mundo Name');
    await userEvent.type(screen.getByLabelText(/Descripción/i), 'Valid Description');
    await userEvent.type(screen.getByLabelText(/URL de Thumbnail/i), 'https://example.com/valid.jpg');
    await userEvent.click(screen.getByLabelText(/Activo/i));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Guardar/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Valid Mundo Name',
        description: 'Valid Description',
        thumbnail_url: 'https://example.com/valid.jpg',
        is_active: false,
      }));
    });

    // Verify no validation errors are shown
    expect(screen.queryByText(/el nombre debe tener al menos 3 caracteres/i)).not.toBeInTheDocument();
  });

  it('should handle scheduling dates correctly', async () => {
    render(<MundoForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const publishedAt = new Date();
    const unpublishedAt = addDays(publishedAt, 7);

    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/Nombre/i), 'Valid Mundo Name');
    
    // Set publication date
    const publishedAtInput = screen.getByLabelText(/Fecha de Publicación/i);
    await userEvent.type(publishedAtInput, format(publishedAt, "yyyy-MM-dd'T'HH:mm"));

    // Set unpublication date
    const unpublishedAtInput = screen.getByLabelText(/Fecha de Despublicación/i);
    await userEvent.type(unpublishedAtInput, format(unpublishedAt, "yyyy-MM-dd'T'HH:mm"));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Guardar/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct dates
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Valid Mundo Name',
        published_at: publishedAt.toISOString(),
        unpublished_at: unpublishedAt.toISOString(),
      }));
    });
  });

  it('should validate scheduling dates', async () => {
    render(<MundoForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const publishedAt = new Date();
    const invalidUnpublishedAt = addDays(publishedAt, -1); // Before published_at

    // Fill in the form with valid data
    await userEvent.type(screen.getByLabelText(/Nombre/i), 'Valid Mundo Name');
    
    // Set publication date
    const publishedAtInput = screen.getByLabelText(/Fecha de Publicación/i);
    await userEvent.type(publishedAtInput, format(publishedAt, "yyyy-MM-dd'T'HH:mm"));

    // Set invalid unpublication date
    const unpublishedAtInput = screen.getByLabelText(/Fecha de Despublicación/i);
    await userEvent.type(unpublishedAtInput, format(invalidUnpublishedAt, "yyyy-MM-dd'T'HH:mm"));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Guardar/i });
    await userEvent.click(submitButton);

    // Verify validation error is shown
    await waitFor(() => {
      expect(screen.getByText('La fecha de despublicación debe ser posterior a la fecha de publicación')).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should handle is_active switch correctly', async () => {
    render(<MundoForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    // Fill in required field
    await userEvent.type(screen.getByLabelText(/Nombre/i), 'Valid Mundo Name');

    // Toggle is_active switch
    const activeSwitch = screen.getByLabelText(/Activo/i);
    expect(activeSwitch).not.toBeChecked(); // Default value is false
    await userEvent.click(activeSwitch);
    expect(activeSwitch).toBeChecked();

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Guardar/i });
    await userEvent.click(submitButton);

    // Verify onSubmit was called with correct is_active value
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Valid Mundo Name',
        is_active: true,
      }));
    });
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(<MundoForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not show cancel button when onClose is not provided', () => {
    render(<MundoForm onSubmit={mockOnSubmit} />);

    expect(screen.queryByRole('button', { name: /Cancelar/i })).not.toBeInTheDocument();
  });
}); 