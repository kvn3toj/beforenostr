import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useSystemSettingsQuery } from './useSystemSettingsQuery';
import { fetchSystemSettings } from '../../services/system.service';
import type { SystemSettings } from '../../types/system.types';

// Mock the system service
vi.mock('../../services/system.service', () => ({
  fetchSystemSettings: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('useSystemSettingsQuery', () => {
  const mockSettings: SystemSettings = {
    id: '1',
    app_name: 'Test App',
    default_role_id: 'role-1',
    maintenance_mode: false,
    max_upload_size_mb: 10,
    allowed_file_types: ['jpg', 'png', 'pdf'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockError = new Error('Failed to fetch system settings');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    // Mock useQuery to return initial loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useSystemSettingsQuery());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful settings fetch', async () => {
    // Mock fetchSystemSettings to return success
    vi.mocked(fetchSystemSettings).mockResolvedValue(mockSettings);

    // Mock useQuery to return success state
    vi.mocked(useQuery).mockReturnValue({
      data: mockSettings,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useSystemSettingsQuery());

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockSettings);
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    // Verify that fetchSystemSettings was called
    expect(fetchSystemSettings).toHaveBeenCalled();
  });

  it('should handle error during settings fetch', async () => {
    // Mock fetchSystemSettings to throw error
    vi.mocked(fetchSystemSettings).mockRejectedValue(mockError);

    // Mock useQuery to return error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any);

    const { result } = renderHook(() => useSystemSettingsQuery());

    // Wait for the error state
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
    });

    // Verify that fetchSystemSettings was called
    expect(fetchSystemSettings).toHaveBeenCalled();
  });

  it('should use correct query key', () => {
    // Mock useQuery to capture the options passed to it
    const mockUseQuery = vi.fn();
    vi.mocked(useQuery).mockImplementation(mockUseQuery);

    renderHook(() => useSystemSettingsQuery());

    // Verify that useQuery was called with the correct query key
    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['system', 'settings'],
      })
    );
  });

  it('should handle empty settings', async () => {
    // Mock fetchSystemSettings to return null
    vi.mocked(fetchSystemSettings).mockResolvedValue(null as any);

    // Mock useQuery to return success state with null data
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useSystemSettingsQuery());

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeNull();
    });

    // Verify that fetchSystemSettings was called
    expect(fetchSystemSettings).toHaveBeenCalled();
  });
}); 