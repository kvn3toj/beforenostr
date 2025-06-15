import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LoginPage } from './LoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';

// Mock auth service
vi.mock('../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}));

// Mock hooks
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
  })),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

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

describe('LoginPage', () => {
  const mockNavigate = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(authService.login).mockImplementation(mockLogin);
  });

  it('should render login form with all required fields', () => {
    render(<LoginPage />, { wrapper: TestWrapper });

    // Check for form elements
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const mockAuthResponse = { 
      access_token: 'token123',
      user: { id: 'user-123', email: 'test@example.com', name: 'Test User', avatarUrl: null }
    };
    mockLogin.mockResolvedValueOnce(mockAuthResponse);

    render(<LoginPage />, { wrapper: TestWrapper });

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify the API call
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    // Verify success feedback
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
    });
  });

  it('should handle invalid credentials error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid login credentials'));

    render(<LoginPage />, { wrapper: TestWrapper });

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrongpassword');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(
        'Credenciales inválidas. Por favor verifica tu email y contraseña.'
      );
    });
  });

  it('should handle unconfirmed email error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Email not confirmed'));

    render(<LoginPage />, { wrapper: TestWrapper });

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/email no confirmado/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(
        'Email no confirmado. Por favor verifica tu bandeja de entrada.'
      );
    });
  });

  it('should handle unexpected error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />, { wrapper: TestWrapper });

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/ocurrió un error inesperado/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(
        'Ocurrió un error inesperado al iniciar sesión'
      );
    });
  });

  it('should disable form during loading state', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginPage />, { wrapper: TestWrapper });

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify loading state
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeDisabled();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeDisabled();
    expect(screen.getByLabelText(/contraseña/i)).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should clear error state when submitting form again', async () => {
    // First attempt: error
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    render(<LoginPage />, { wrapper: TestWrapper });

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrongpassword');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });

    // Second attempt: success
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    // Submit the form again
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify error is cleared
    await waitFor(() => {
      expect(screen.queryByText(/credenciales inválidas/i)).not.toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
    });
  });
}); 