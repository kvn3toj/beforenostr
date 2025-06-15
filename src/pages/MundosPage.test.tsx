import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MundosPage } from './MundosPage';
import { QueryClient, QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import type { Mundo } from '../types/mundo.types';
import { useMundosQuery } from '../hooks/useMundosQuery';
import { useMutation } from '@tanstack/react-query';

// Define a type for the mocked useMutation result
type MockUseMutationResult<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown> = Pick<
  UseMutationResult<TData, TError, TVariables, TContext>,
  'mutate' | 'isPending' | 'error'
>;

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

// Mock ConfirmDialog: render a real dialog
vi.mock('../components/common/ConfirmDialog', () => ({
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

// Mock MundoForm: render a real form
vi.mock('../components/features/mundos/components/MundoForm', () => ({
  MundoForm: vi.fn(({ onSubmit, onClose, defaultValues, isLoading }) => (
    <form aria-label="Formulario de mundo" onSubmit={e => { e.preventDefault(); onSubmit({ name: 'Test Mundo', description: 'Test Description' }); }}>
      <input name="name" defaultValue={defaultValues?.name || ''} aria-label="Nombre" />
      <input name="description" defaultValue={defaultValues?.description || ''} aria-label="Descripción" />
      <button type="button" onClick={onClose}>Cancelar</button>
      <button type="submit">Guardar</button>
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

describe('MundosPage', () => {
  const mockMundos: Mundo[] = [
    {
      id: '1',
      name: 'Mundo 1',
      description: 'Descripción del Mundo 1',
      thumbnail_url: null,
      created_by: 'user-id',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      is_active: true,
      published_at: null,
      unpublished_at: null,
      version: 1,
    },
    {
      id: '2',
      name: 'Mundo 2',
      description: 'Descripción del Mundo 2',
      thumbnail_url: null,
      created_by: 'user-id',
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
      is_active: false,
      published_at: null,
      unpublished_at: null,
      version: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations for useMundosQuery
    vi.mocked(useMundosQuery).mockReturnValue({
      data: { data: mockMundos, count: mockMundos.length },
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isSuccess: true,
      isIdle: false,
      isFetching: false,
      isRefetching: false,
      isPlaceholderData: false,
      isFetched: true,
      isFetchedAfterMount: true,
      isLoadingError: false,
      isRefetchError: false,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'success',
      fetchStatus: 'idle',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isStale: false,
      variables: undefined,
    });

    // Default mock implementations for useMutation
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isSuccess: false,
      isIdle: true,
      isError: false,
      error: null,
      data: undefined,
      variables: undefined,
      reset: vi.fn(),
      status: 'idle',
    });
  });

  it('should render successfully with data', () => {
    render(<MundosPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Mundos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear nuevo mundo/i })).toBeInTheDocument();
    expect(screen.getByText('Mundo 1')).toBeInTheDocument();
    expect(screen.getByText('Mundo 2')).toBeInTheDocument();
    expect(screen.getByText('Descripción del Mundo 1')).toBeInTheDocument();
    expect(screen.getByText('Descripción del Mundo 2')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
    expect(screen.getByText('1-2 de 2')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    vi.mocked(useMundosQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<MundosPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error state', () => {
    vi.mocked(useMundosQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch mundos'),
    });

    render(<MundosPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Error al cargar los datos')).toBeInTheDocument();
  });

  it('should show empty state', () => {
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
      
      expect(screen.getByRole('form', { name: /formulario de mundo/i })).toBeInTheDocument();
    });

    it('should close create dialog when clicking cancel', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo mundo/i });
      await userEvent.click(createButton);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await userEvent.click(cancelButton);
      
      expect(screen.queryByRole('form', { name: /formulario de mundo/i })).not.toBeInTheDocument();
    });

    it('should call create mutation and handle success', async () => {
      const mockMutate = vi.fn();
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as MockUseMutationResult);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo mundo/i });
      await userEvent.click(createButton);
      
      const submitButton = screen.getByRole('button', { name: /guardar/i });
      await userEvent.click(submitButton);
      
      expect(mockMutate).toHaveBeenCalledWith({
        name: 'Test Mundo',
        description: 'Test Description',
      });
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByRole('form', { name: /formulario de mundo/i })).not.toBeInTheDocument();
      });
    });

    it('should handle create mutation error', async () => {
      const mockError = new Error('Failed to create mundo');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as MockUseMutationResult);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const createButton = screen.getByRole('button', { name: /crear nuevo mundo/i });
      await userEvent.click(createButton);
      
      const submitButton = screen.getByRole('button', { name: /guardar/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByRole('form', { name: /formulario de mundo/i })).toBeInTheDocument();
      });
    });
  });

  describe('Edit Mundo Flow', () => {
    it('should open edit dialog when clicking edit button', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      expect(screen.getByRole('form', { name: /formulario de mundo/i })).toBeInTheDocument();
    });

    it('should pre-fill form with mundo data', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const nameInput = screen.getByLabelText('Nombre');
      expect(nameInput).toHaveValue(mockMundos[0].name);
      const descInput = screen.getByLabelText('Descripción');
      expect(descInput).toHaveValue(mockMundos[0].description);
    });

    it('should close edit dialog when clicking cancel', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await userEvent.click(cancelButton);
      
      expect(screen.queryByRole('form', { name: /formulario de mundo/i })).not.toBeInTheDocument();
    });

    it('should call update mutation and handle success', async () => {
      const mockMutate = vi.fn();
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as MockUseMutationResult);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const submitButton = screen.getByRole('button', { name: /guardar/i });
      await userEvent.click(submitButton);
      
      expect(mockMutate).toHaveBeenCalledWith({
        id: mockMundos[0].id,
        name: 'Test Mundo',
        description: 'Test Description',
      });
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByRole('form', { name: /formulario de mundo/i })).not.toBeInTheDocument();
      });
    });

    it('should handle update mutation error', async () => {
      const mockError = new Error('Failed to update mundo');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as MockUseMutationResult);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const editButton = screen.getAllByLabelText('Editar')[0];
      await userEvent.click(editButton);
      
      const submitButton = screen.getByRole('button', { name: /guardar/i });
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByRole('form', { name: /formulario de mundo/i })).toBeInTheDocument();
      });
    });
  });

  describe('Delete Mundo Flow', () => {
    it('should open delete dialog when clicking delete button', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(mockMundos[0].name)).toBeInTheDocument();
    });

    it('should close delete dialog when clicking cancel', async () => {
      render(<MundosPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await userEvent.click(cancelButton);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should call delete mutation and handle success', async () => {
      const mockMutate = vi.fn();
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as MockUseMutationResult);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      const confirmButton = screen.getByRole('button', { name: /eliminar/i });
      await userEvent.click(confirmButton);
      
      expect(mockMutate).toHaveBeenCalledWith(mockMundos[0].id);
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should handle delete mutation error', async () => {
      const mockError = new Error('Failed to delete mundo');
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => onError(mockError));
      
      vi.mocked(useMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: mockError,
      } as MockUseMutationResult);

      render(<MundosPage />, { wrapper: TestWrapper });
      
      const deleteButton = screen.getAllByLabelText('Eliminar')[0];
      await userEvent.click(deleteButton);
      
      const confirmButton = screen.getByRole('button', { name: /eliminar/i });
      await userEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });
}); 