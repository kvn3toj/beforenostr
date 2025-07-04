import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';
import type { SystemSettings, UpdateSystemSettingsData } from '../types/system.types';
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

vi.mock('../hooks/system/useSystemSettingsQuery', () => ({
  useSystemSettingsQuery: vi.fn(() => ({
    data: mockSettings,
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

vi.mock('../hooks/system/useUpdateSystemSettingsMutation', () => ({
  useUpdateSystemSettingsMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock data
const mockSettings: SystemSettings = {
  id: 'settings-1',
  app_name: 'Test App',
  default_role_id: 'role-1',
  maintenance_mode: false,
  max_upload_size_mb: 10,
  allowed_file_types: ['.jpg', '.png'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

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
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('SettingsPage', () => {
  const renderSettingsPage = () => {
    return render(<SettingsPage />, { wrapper: TestWrapper });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Access Control', () => {
    it('renders the page for authorized users', () => {
      renderSettingsPage();
      
      expect(screen.getByText('Configuración del Sistema')).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre de la Aplicación')).toBeInTheDocument();
    });

    it('redirects unauthorized users', async () => {
      const mockNavigate = vi.fn();
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);
      vi.mocked(useHasRole).mockReturnValue(false);

      renderSettingsPage();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
      expect(screen.queryByText('Configuración del Sistema')).not.toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading state', () => {
      vi.mocked(useSystemSettingsQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      renderSettingsPage();
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error state', () => {
      const errorMessage = 'Failed to load settings';
      vi.mocked(useSystemSettingsQuery).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
      });

      renderSettingsPage();
      
      expect(screen.getByText(`Error al cargar la configuración: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  describe('Form Behavior', () => {
    it('pre-fills form with settings data', async () => {
      renderSettingsPage();

      await waitFor(() => {
        expect(screen.getByLabelText('Nombre de la Aplicación')).toHaveValue(mockSettings.app_name);
        expect(screen.getByLabelText('ID del Rol por Defecto')).toHaveValue(mockSettings.default_role_id);
        expect(screen.getByLabelText('Tamaño Máximo de Subida (MB)')).toHaveValue(mockSettings.max_upload_size_mb.toString());
      });
    });

    it('handles successful form submission', async () => {
      const mockMutate = vi.fn();
      vi.mocked(useUpdateSystemSettingsMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      renderSettingsPage();

      const newAppName = 'New App Name';
      const appNameInput = screen.getByLabelText('Nombre de la Aplicación');
      await userEvent.clear(appNameInput);
      await userEvent.type(appNameInput, newAppName);

      const submitButton = screen.getByRole('button', { name: /guardar cambios/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          id: mockSettings.id,
          data: expect.objectContaining({
            app_name: newAppName,
          }),
        });
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('handles form submission error', async () => {
      const mockMutate = vi.fn().mockImplementation((_, { onError }) => {
        onError(new Error('Update failed'));
      });
      vi.mocked(useUpdateSystemSettingsMutation).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      });

      renderSettingsPage();

      const newAppName = 'New App Name';
      const appNameInput = screen.getByLabelText('Nombre de la Aplicación');
      await userEvent.clear(appNameInput);
      await userEvent.type(appNameInput, newAppName);

      const submitButton = screen.getByRole('button', { name: /guardar cambios/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('disables submit button during submission', () => {
      vi.mocked(useUpdateSystemSettingsMutation).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      });

      renderSettingsPage();

      const submitButton = screen.getByRole('button', { name: /guardando/i });
      expect(submitButton).toBeDisabled();
    });
  });
}); 