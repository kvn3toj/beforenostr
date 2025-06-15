import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuditLogsPage } from './AuditLogsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import type { AuditLog } from '../types/system.types';
import type { FetchAuditLogsParams } from '../services/system.service';

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

vi.mock('../hooks/system/useAuditLogsQuery', () => ({
  useAuditLogsQuery: vi.fn(),
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

describe('AuditLogsPage', () => {
  const mockAuditLogs: AuditLog[] = [
    {
      id: '1',
      user_id: 'user-1',
      action: 'create',
      entity_type: 'user',
      entity_id: '123',
      changes: { name: 'Test User' },
      created_at: '2024-01-01T12:00:00Z',
    },
    {
      id: '2',
      user_id: 'user-2',
      action: 'update',
      entity_type: 'role',
      entity_id: '456',
      changes: { permissions: ['read', 'write'] },
      created_at: '2024-01-02T12:00:00Z',
    },
  ];

  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAuditLogsQuery).mockReturnValue({
      data: { data: mockAuditLogs, count: mockAuditLogs.length },
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it('should render page for authorized user (Super Admin)', () => {
    render(<AuditLogsPage />, { wrapper: TestWrapper });

    // Verify page title
    expect(screen.getByText('Registros de Auditoría')).toBeInTheDocument();

    // Verify table data
    expect(screen.getByText('user-1')).toBeInTheDocument();
    expect(screen.getByText('user-2')).toBeInTheDocument();
    expect(screen.getByText('create')).toBeInTheDocument();
    expect(screen.getByText('update')).toBeInTheDocument();

    // Verify useHasRole was called with correct role
    expect(useHasRole).toHaveBeenCalledWith('Super Admin');

    // Verify no redirection
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should redirect unauthorized user', async () => {
    // Mock useHasRole to return false
    vi.mocked(useHasRole).mockReturnValueOnce(false);

    render(<AuditLogsPage />, { wrapper: TestWrapper });

    // Verify useHasRole was called
    expect(useHasRole).toHaveBeenCalledWith('Super Admin');

    // Verify redirection
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    // Verify page content is not rendered
    expect(screen.queryByText('Registros de Auditoría')).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    vi.mocked(useAuditLogsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<AuditLogsPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show error state', () => {
    const errorMessage = 'Failed to fetch audit logs';
    vi.mocked(useAuditLogsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
    });

    render(<AuditLogsPage />, { wrapper: TestWrapper });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should show empty state', () => {
    vi.mocked(useAuditLogsQuery).mockReturnValue({
      data: { data: [], count: 0 },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<AuditLogsPage />, { wrapper: TestWrapper });

    expect(screen.getByText('No hay registros de auditoría disponibles.')).toBeInTheDocument();
  });

  it('should handle pagination', async () => {
    const mockQuery = vi.fn();
    vi.mocked(useAuditLogsQuery).mockImplementation(mockQuery);

    render(<AuditLogsPage />, { wrapper: TestWrapper });

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
    vi.mocked(useAuditLogsQuery).mockImplementation(mockQuery);

    render(<AuditLogsPage />, { wrapper: TestWrapper });

    // Click sortable header
    const dateHeader = screen.getByText('Fecha/Hora');
    await userEvent.click(dateHeader);

    // Verify query was called with updated sort parameters
    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      sortBy: 'created_at',
      sortDirection: 'asc',
    }));
  });

  it('should handle filtering', async () => {
    const mockQuery = vi.fn();
    vi.mocked(useAuditLogsQuery).mockImplementation(mockQuery);

    render(<AuditLogsPage />, { wrapper: TestWrapper });

    // Type in filter input
    const filterInput = screen.getByPlaceholderText(/buscar/i);
    await userEvent.type(filterInput, 'test');

    // Verify query was called with updated filter
    expect(mockQuery).toHaveBeenCalledWith(expect.objectContaining({
      filters: expect.objectContaining({
        search: 'test',
      }),
    }));
  });

  it('should format audit log data correctly', () => {
    render(<AuditLogsPage />, { wrapper: TestWrapper });

    // Verify date formatting
    expect(screen.getByText(/01\/01\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/02\/01\/2024/)).toBeInTheDocument();

    // Verify action chips
    expect(screen.getByText('create')).toHaveClass('MuiChip-colorSuccess');
    expect(screen.getByText('update')).toHaveClass('MuiChip-colorInfo');

    // Verify entity type chips
    expect(screen.getByText('user')).toHaveClass('MuiChip-outlined');
    expect(screen.getByText('role')).toHaveClass('MuiChip-outlined');

    // Verify changes formatting
    expect(screen.getByText(/"name": "Test User"/)).toBeInTheDocument();
    expect(screen.getByText(/"permissions": \["read", "write"\]/)).toBeInTheDocument();
  });
}); 