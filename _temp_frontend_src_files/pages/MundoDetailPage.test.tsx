import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MundoDetailPage } from './MundoDetailPage';
import type { Mundo, MundoVersion, UpdateMundoData } from '../types/mundo.types';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-id', role: { name: 'Super Admin' } },
    isLoading: false,
  }),
}));

vi.mock('../hooks/useHasRole', () => ({
  useHasRole: vi.fn(() => true),
}));

vi.mock('../hooks/features/mundos/useMundoQuery', () => ({
  useMundoQuery: vi.fn(() => ({
    data: mockMundo,
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

vi.mock('../hooks/useUpdateMundoMutation', () => ({
  useUpdateMundoMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('../hooks/features/mundos/useMundoVersionsQuery', () => ({
  useMundoVersionsQuery: vi.fn(() => ({
    data: mockVersions,
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

vi.mock('../hooks/features/mundos/useRestoreMundoVersionMutation', () => ({
  useRestoreMundoVersionMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('../components/features/mundos/components/MundoForm', () => ({
  MundoForm: ({ defaultValues, onSubmit, onClose, isLoading }: any) => (
    <div data-testid="mock-mundo-form">
      <div>Mock Mundo Form</div>
      <div>Default Values: {JSON.stringify(defaultValues)}</div>
      <button onClick={() => onSubmit({ ...defaultValues, name: 'Updated Name' })}>
        Submit
      </button>
      <button onClick={onClose}>Cancel</button>
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}));

vi.mock('../components/common/ConfirmDialog', () => ({
  ConfirmDialog: ({ title, message, open, onClose, onConfirm, isLoading }: any) => (
    open ? (
      <div data-testid="mock-confirm-dialog">
        <div>{title}</div>
        <div>{message}</div>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
        {isLoading && <div>Loading...</div>}
      </div>
    ) : null
  ),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock data
const mockMundo: Mundo = {
  id: 'mock-mundo-id',
  name: 'Test Mundo',
  description: 'Test Description',
  thumbnail_url: 'https://example.com/thumbnail.jpg',
  order_index: 0,
  is_active: true,
  version: 1,
  created_by: 'user-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  published_at: '2024-01-01T00:00:00Z',
  unpublished_at: null,
};

const mockVersions: MundoVersion[] = [
  {
    id: 'version-1',
    mundo_id: 'mock-mundo-id',
    version: 1,
    timestamp: '2024-01-01T00:00:00Z',
    changed_by_user_id: 'user-id',
    name: 'Test Mundo',
    description: 'Test Description',
    thumbnail_url: 'https://example.com/thumbnail.jpg',
    is_active: true,
    published_at: '2024-01-01T00:00:00Z',
    unpublished_at: null,
  },
  {
    id: 'version-2',
    mundo_id: 'mock-mundo-id',
    version: 2,
    timestamp: '2024-01-02T00:00:00Z',
    changed_by_user_id: 'user-id',
    name: 'Updated Mundo',
    description: 'Updated Description',
    thumbnail_url: 'https://example.com/thumbnail2.jpg',
    is_active: true,
    published_at: '2024-01-02T00:00:00Z',
    unpublished_at: null,
  },
];

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/mundos/${mockMundo.id}`]}>
        <Routes>
          <Route path="/mundos/:mundoId" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('MundoDetailPage', () => {
  const renderMundoDetailPage = () => {
    return render(<MundoDetailPage />, { wrapper: TestWrapper });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering States', () => {
    it('renders mundo details and versions for authorized users', () => {
      renderMundoDetailPage();
      
      expect(screen.getByText('Detalles del Mundo')).toBeInTheDocument();
      expect(screen.getByText(mockMundo.name)).toBeInTheDocument();
      expect(screen.getByText(mockMundo.description)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
      expect(screen.queryByTestId('mock-mundo-form')).not.toBeInTheDocument();

      // Check versions
      mockVersions.forEach(version => {
        expect(screen.getByText(`Versión ${version.version}`)).toBeInTheDocument();
        expect(screen.getByText(version.name)).toBeInTheDocument();
      });
    });

    it('shows loading state for mundo details', () => {
      vi.mocked(useMundoQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      renderMundoDetailPage();
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error state for mundo details', () => {
      const errorMessage = 'Failed to load mundo';
      vi.mocked(useMundoQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
      });

      renderMundoDetailPage();
      
      expect(screen.getByText(`Error al cargar el mundo: ${errorMessage}`)).toBeInTheDocument();
    });

    it('shows loading state for versions', () => {
      vi.mocked(useMundoVersionsQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      renderMundoDetailPage();
      
      expect(screen.getByText('Cargando versiones...')).toBeInTheDocument();
    });

    it('shows error state for versions', () => {
      const errorMessage = 'Failed to load versions';
      vi.mocked(useMundoVersionsQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
      });

      renderMundoDetailPage();
      
      expect(screen.getByText(`Error al cargar las versiones: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  describe('Edit Flow', () => {
    it('handles successful edit flow for authorized users', async () => {
      const mockMutate = vi.fn();
      vi.mocked(useUpdateMundoMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      renderMundoDetailPage();

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /editar/i });
      await userEvent.click(editButton);

      // Verify form is rendered with correct default values
      const mockForm = screen.getByTestId('mock-mundo-form');
      expect(mockForm).toBeInTheDocument();
      expect(mockForm).toHaveTextContent(JSON.stringify(mockMundo));

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          id: mockMundo.id,
          data: expect.objectContaining({
            name: 'Updated Name',
          }),
        });
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('mock-mundo-form')).not.toBeInTheDocument();
      });
    });

    it('disables edit button for unauthorized users', () => {
      vi.mocked(useHasRole).mockReturnValue(false);

      renderMundoDetailPage();

      const editButton = screen.getByRole('button', { name: /editar/i });
      expect(editButton).toBeDisabled();
    });

    it('handles edit cancellation', async () => {
      renderMundoDetailPage();

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /editar/i });
      await userEvent.click(editButton);

      // Verify form is rendered
      expect(screen.getByTestId('mock-mundo-form')).toBeInTheDocument();

      // Cancel edit
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      // Verify form is no longer rendered
      expect(screen.queryByTestId('mock-mundo-form')).not.toBeInTheDocument();
    });
  });

  describe('Version Restoration Flow', () => {
    it('handles successful version restoration for authorized users', async () => {
      const mockMutate = vi.fn();
      vi.mocked(useRestoreMundoVersionMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      renderMundoDetailPage();

      // Click restore button on a version
      const restoreButton = screen.getByRole('button', { name: /restaurar/i });
      await userEvent.click(restoreButton);

      // Verify confirm dialog is shown
      const confirmDialog = screen.getByTestId('mock-confirm-dialog');
      expect(confirmDialog).toBeInTheDocument();
      expect(confirmDialog).toHaveTextContent('¿Estás seguro de que deseas restaurar esta versión?');

      // Confirm restoration
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await userEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          mundoId: mockMundo.id,
          versionId: mockVersions[0].id,
        });
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('mock-confirm-dialog')).not.toBeInTheDocument();
      });
    });

    it('disables restore button for unauthorized users', () => {
      vi.mocked(useHasRole).mockReturnValue(false);

      renderMundoDetailPage();

      const restoreButton = screen.getByRole('button', { name: /restaurar/i });
      expect(restoreButton).toBeDisabled();
    });

    it('handles restoration cancellation', async () => {
      renderMundoDetailPage();

      // Click restore button
      const restoreButton = screen.getByRole('button', { name: /restaurar/i });
      await userEvent.click(restoreButton);

      // Verify confirm dialog is shown
      expect(screen.getByTestId('mock-confirm-dialog')).toBeInTheDocument();

      // Cancel restoration
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      // Verify dialog is no longer shown
      expect(screen.queryByTestId('mock-confirm-dialog')).not.toBeInTheDocument();
    });

    it('shows loading state during restoration', () => {
      vi.mocked(useRestoreMundoVersionMutation).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      renderMundoDetailPage();

      // Click restore button
      const restoreButton = screen.getByRole('button', { name: /restaurar/i });
      userEvent.click(restoreButton);

      // Confirm restoration
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      userEvent.click(confirmButton);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
}); 