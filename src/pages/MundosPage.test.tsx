import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MundosPage } from './MundosPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import type { Mundo } from '../types/mundo.types';

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

vi.mock('../hooks/useMundosQuery', () => ({
  useMundosQuery: vi.fn(),
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

vi.mock('../components/features/mundos/components/MundoForm', () => ({
  MundoForm: vi.fn(({ onSubmit, onClose, defaultValues, isLoading }) => (
    <div data-testid="mundo-form">
      {isLoading && <div data-testid="form-loading">Loading...</div>}
      {defaultValues && <div data-testid="form-default-values">{JSON.stringify(defaultValues)}</div>}
      <button data-testid="form-submit" onClick={() => onSubmit({ name: 'Test Mundo', description: 'Test Description' })}>Submit</button>
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

describe('MundosPage', () => {
  const mockMundos: Mundo[] = [
    {
      id: '1',
      name: 'Mundo 1',
      description: 'Descripción del Mundo 1',
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'Mundo 2',
      description: 'Descripción del Mundo 2',
      is_active: false,
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(useMundosQuery).mockReturnValue({
      data: { data: mockMundos, count: mockMundos.length },
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
    render(<MundosPage />, { wrapper: TestWrapper });

    // Verify page title and create button
    expect(screen.getByText('Mundos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear nuevo mundo/i })).toBeInTheDocument();

    // Verify table data
    expect(screen.getByText('Mundo 1')).toBeInTheDocument();
    expect(screen.getByText('Mundo 2')).toBeInTheDocument();
    expect(screen.getByText('Descripción del Mundo 1')).toBeInTheDocument();
    expect(screen.getByText('Descripción del Mundo 2')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Inactivo')).toBeInTheDocument();

    // Verify pagination controls
    expect(screen.getByText('1-2 de 2')).toBeInTheDocument();
  });

  it('should show loading state', async () => {
    vi.mocked(useMundosQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<MundosPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error state', async () => {
    vi.mocked(useMundosQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch mundos'),
    });

    render(<MundosPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Error al cargar los datos')).toBeInTheDocument();
  });

  it('should show empty state', async () => {
    vi.mocked(useMundosQuery).mockReturnValue({
      data: { data: [], count: 0 },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<MundosPage />, { wrapper: TestWrapper });

    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('should handle pagination', async () => {
    const mockQuery = vi.fn();
    vi.mocked(useMundosQuery).mockImplementation(mockQuery);

    render(<MundosPage />, { wrapper: TestWrapper });

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
    vi.mocked(useMundosQuery).mockImplementation(mockQuery);

    render(<MundosPage />, { wrapper: TestWrapper });

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
    vi.mocked(useMundosQuery).mockImplementation(mockQuery);

    render(<MundosPage />, { wrapper: TestWrapper });

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

  describe('Create Mundo Flow', () => {
    it('should open create dialog when clicking create button', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo mundo/i });
      await userEvent.click(createButton);
      
      expect(screen.getByTestId('mundo-form')).toBeInTheDocument();
    });

    it('should close create dialog when clicking cancel', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo mundo/i });
      await userEvent.click(createButton);
      
      const cancelButton = screen.getByTestId('form-cancel');
      await userEvent.click(cancelButton);
      
      expect(screen.queryByTestId('mundo-form')).not.toBeInTheDocument();
    });

    it('should call create mutation and handle success', async () => {
      const mockMutate = vi.fn();
      const mockOnSuccess = vi.fn();
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as any);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo mundo/i });
      await userEvent.click(createButton);
      
      const submitButton = screen.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      expect(mockMutate).toHaveBeenCalledWith({
        name: 'Test Mundo',
        description: 'Test Description',
      });
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('mundo-form')).not.toBeInTheDocument();
      });
    });

    it('should handle create mutation error', async () => {
      const mockError = new Error('Failed to create mundo');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as any);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo mundo/i });
      await userEvent.click(createButton);
      
      const submitButton = screen.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByTestId('mundo-form')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Mundo Flow', () => {
    it('should open edit dialog when clicking edit button', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      expect(screen.getByTestId('mundo-form')).toBeInTheDocument();
    });

    it('should pre-fill form with mundo data', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const defaultValues = JSON.parse(screen.getByTestId('form-default-values').textContent || '{}');
      expect(defaultValues).toEqual(mockMundos[0]);
    });

    it('should close edit dialog when clicking cancel', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const cancelButton = screen.getByTestId('form-cancel');
      await userEvent.click(cancelButton);
      
      expect(screen.queryByTestId('mundo-form')).not.toBeInTheDocument();
    });

    it('should call update mutation and handle success', async () => {
      const mockMutate = vi.fn();
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as any);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const submitButton = screen.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      expect(mockMutate).toHaveBeenCalledWith({
        id: mockMundos[0].id,
        name: 'Test Mundo',
        description: 'Test Description',
      });
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('mundo-form')).not.toBeInTheDocument();
      });
    });

    it('should handle update mutation error', async () => {
      const mockError = new Error('Failed to update mundo');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as any);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const submitButton = screen.getByTestId('form-submit');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByTestId('mundo-form')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Mundo Flow', () => {
    it('should open delete dialog when clicking delete button', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-message')).toHaveTextContent(mockMundos[0].name);
    });

    it('should close delete dialog when clicking cancel', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
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

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      const confirmButton = screen.getByTestId('dialog-confirm');
      await userEvent.click(confirmButton);
      
      expect(mockMutate).toHaveBeenCalledWith(mockMundos[0].id);
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
      });
    });

    it('should handle delete mutation error', async () => {
      const mockError = new Error('Failed to delete mundo');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as any);

      render(<MundosPage />, { wrapper: TestWrapper });
      
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
}); 