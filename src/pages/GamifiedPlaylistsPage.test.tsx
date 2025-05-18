import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GamifiedPlaylistsPage } from './GamifiedPlaylistsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import type { Playlist } from '../types/playlist.types';

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

vi.mock('../hooks/usePlaylistsQuery', () => ({
  usePlaylistsQuery: vi.fn(),
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

vi.mock('../components/playlists/CreatePlaylistForm', () => ({
  CreatePlaylistForm: vi.fn(({ onSubmit, onClose, defaultValues, isLoading }) => (
    <div data-testid="playlist-form">
      {isLoading && <div data-testid="form-loading">Loading...</div>}
      {defaultValues && <div data-testid="form-default-values">{JSON.stringify(defaultValues)}</div>}
      <button data-testid="form-submit" onClick={() => onSubmit({ name: 'Test Playlist', mundo_id: 'mundo-1' })}>Submit</button>
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

describe('GamifiedPlaylistsPage', () => {
  const mockPlaylists: Playlist[] = [
    {
      id: '1',
      name: 'Playlist 1',
      mundo_id: 'mundo-1',
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'Playlist 2',
      mundo_id: 'mundo-1',
      is_active: false,
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(usePlaylistsQuery).mockReturnValue({
      data: { data: mockPlaylists, count: mockPlaylists.length },
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
    render(<GamifiedPlaylistsPage />, { wrapper: TestWrapper });

    // Verify page title and create button
    expect(screen.getByText('Playlists Gamificadas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear nueva playlist/i })).toBeInTheDocument();

    // Verify table data
    expect(screen.getByText('Playlist 1')).toBeInTheDocument();
    expect(screen.getByText('Playlist 2')).toBeInTheDocument();
    expect(screen.getByText('Activa')).toBeInTheDocument();
    expect(screen.getByText('Inactiva')).toBeInTheDocument();

    // Verify pagination controls
    expect(screen.getByText('1-2 de 2')).toBeInTheDocument();
  });

  it('should show loading state', async () => {
    vi.mocked(usePlaylistsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<GamifiedPlaylistsPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error state', async () => {
    vi.mocked(usePlaylistsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch playlists'),
    });

    render(<GamifiedPlaylistsPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Error al cargar los datos')).toBeInTheDocument();
  });

  it('should show empty state', async () => {
    vi.mocked(usePlaylistsQuery).mockReturnValue({
      data: { data: [], count: 0 },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<GamifiedPlaylistsPage />, { wrapper: TestWrapper });

    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
  });

  it('should handle pagination', async () => {
    const mockQuery = vi.fn();
    vi.mocked(usePlaylistsQuery).mockImplementation(mockQuery);

    render(<GamifiedPlaylistsPage />, { wrapper: TestWrapper });

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
    vi.mocked(usePlaylistsQuery).mockImplementation(mockQuery);

    render(<GamifiedPlaylistsPage />, { wrapper: TestWrapper });

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
    vi.mocked(usePlaylistsQuery).mockImplementation(mockQuery);

    render(<GamifiedPlaylistsPage />, { wrapper: TestWrapper });

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
}); 