import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PlaylistDetailPage } from './PlaylistDetailPage';
import type { Playlist, PlaylistVersion, UpdatePlaylistData } from '../types/playlist.types';
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

vi.mock('../hooks/usePlaylistQuery', () => ({
  usePlaylistQuery: vi.fn(() => ({
    data: mockPlaylist,
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

vi.mock('../hooks/useUpdatePlaylistMutation', () => ({
  useUpdatePlaylistMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('../hooks/features/playlists/usePlaylistVersionsQuery', () => ({
  usePlaylistVersionsQuery: vi.fn(() => ({
    data: mockVersions,
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

vi.mock('../hooks/features/playlists/useRestorePlaylistVersionMutation', () => ({
  useRestorePlaylistVersionMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('../components/features/playlists/components/CreatePlaylistForm', () => ({
  CreatePlaylistForm: ({ defaultValues, onSubmit, onClose, isLoading }: any) => (
    <div data-testid="mock-playlist-form">
      <div>Mock Playlist Form</div>
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
const mockPlaylist: Playlist = {
  id: 'mock-playlist-id',
  name: 'Test Playlist',
  description: 'Test Description',
  mundo_id: 'mundo-1',
  mundo: {
    id: 'mundo-1',
    name: 'Test Mundo',
    description: 'Test Mundo Description',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  order_index: 0,
  is_active: true,
  version: 1,
  created_by: 'user-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  published_at: '2024-01-01T00:00:00Z',
  unpublished_at: null,
};

const mockVersions: PlaylistVersion[] = [
  {
    id: 'version-1',
    playlist_id: 'mock-playlist-id',
    version: 1,
    timestamp: '2024-01-01T00:00:00Z',
    changed_by_user_id: 'user-id',
    name: 'Test Playlist',
    description: 'Test Description',
    mundo_id: 'mundo-1',
    order_index: 0,
    is_active: true,
    published_at: '2024-01-01T00:00:00Z',
    unpublished_at: null,
  },
  {
    id: 'version-2',
    playlist_id: 'mock-playlist-id',
    version: 2,
    timestamp: '2024-01-02T00:00:00Z',
    changed_by_user_id: 'user-id',
    name: 'Updated Playlist',
    description: 'Updated Description',
    mundo_id: 'mundo-1',
    order_index: 0,
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
      <MemoryRouter initialEntries={[`/playlists/${mockPlaylist.id}`]}>
        <Routes>
          <Route path="/playlists/:playlistId" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('PlaylistDetailPage', () => {
  const renderPlaylistDetailPage = () => {
    return render(<PlaylistDetailPage />, { wrapper: TestWrapper });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering States', () => {
    it('renders playlist details and versions for authorized users', () => {
      renderPlaylistDetailPage();
      
      expect(screen.getByText('Detalles de la Playlist')).toBeInTheDocument();
      expect(screen.getByText(mockPlaylist.name)).toBeInTheDocument();
      expect(screen.getByText(mockPlaylist.description)).toBeInTheDocument();
      expect(screen.getByText(mockPlaylist.mundo.name)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
      expect(screen.queryByTestId('mock-playlist-form')).not.toBeInTheDocument();

      // Check versions
      mockVersions.forEach(version => {
        expect(screen.getByText(`Versión ${version.version}`)).toBeInTheDocument();
        expect(screen.getByText(version.name)).toBeInTheDocument();
      });
    });

    it('shows loading state for playlist details', () => {
      vi.mocked(usePlaylistQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      renderPlaylistDetailPage();
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error state for playlist details', () => {
      const errorMessage = 'Failed to load playlist';
      vi.mocked(usePlaylistQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
      });

      renderPlaylistDetailPage();
      
      expect(screen.getByText(`Error al cargar la playlist: ${errorMessage}`)).toBeInTheDocument();
    });

    it('shows loading state for versions', () => {
      vi.mocked(usePlaylistVersionsQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      renderPlaylistDetailPage();
      
      expect(screen.getByText('Cargando versiones...')).toBeInTheDocument();
    });

    it('shows error state for versions', () => {
      const errorMessage = 'Failed to load versions';
      vi.mocked(usePlaylistVersionsQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
      });

      renderPlaylistDetailPage();
      
      expect(screen.getByText(`Error al cargar las versiones: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  describe('Edit Flow', () => {
    it('handles successful edit flow for authorized users', async () => {
      const mockMutate = vi.fn();
      vi.mocked(useUpdatePlaylistMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      renderPlaylistDetailPage();

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /editar/i });
      await userEvent.click(editButton);

      // Verify form is rendered with correct default values
      const mockForm = screen.getByTestId('mock-playlist-form');
      expect(mockForm).toBeInTheDocument();
      expect(mockForm).toHaveTextContent(JSON.stringify(mockPlaylist));

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          id: mockPlaylist.id,
          data: expect.objectContaining({
            name: 'Updated Name',
          }),
        });
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('mock-playlist-form')).not.toBeInTheDocument();
      });
    });

    it('disables edit button for unauthorized users', () => {
      vi.mocked(useHasRole).mockReturnValue(false);

      renderPlaylistDetailPage();

      const editButton = screen.getByRole('button', { name: /editar/i });
      expect(editButton).toBeDisabled();
    });

    it('handles edit cancellation', async () => {
      renderPlaylistDetailPage();

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /editar/i });
      await userEvent.click(editButton);

      // Verify form is rendered
      expect(screen.getByTestId('mock-playlist-form')).toBeInTheDocument();

      // Cancel edit
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await userEvent.click(cancelButton);

      // Verify form is no longer rendered
      expect(screen.queryByTestId('mock-playlist-form')).not.toBeInTheDocument();
    });
  });

  describe('Version Restoration Flow', () => {
    it('handles successful version restoration for authorized users', async () => {
      const mockMutate = vi.fn();
      vi.mocked(useRestorePlaylistVersionMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      renderPlaylistDetailPage();

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
          playlistId: mockPlaylist.id,
          versionId: mockVersions[0].id,
        });
        expect(toast.success).toHaveBeenCalled();
        expect(screen.queryByTestId('mock-confirm-dialog')).not.toBeInTheDocument();
      });
    });

    it('disables restore button for unauthorized users', () => {
      vi.mocked(useHasRole).mockReturnValue(false);

      renderPlaylistDetailPage();

      const restoreButton = screen.getByRole('button', { name: /restaurar/i });
      expect(restoreButton).toBeDisabled();
    });

    it('handles restoration cancellation', async () => {
      renderPlaylistDetailPage();

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
      vi.mocked(useRestorePlaylistVersionMutation).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      renderPlaylistDetailPage();

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