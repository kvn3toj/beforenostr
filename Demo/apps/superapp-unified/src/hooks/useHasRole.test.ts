import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useHasRole } from './useHasRole';
import { useAuth } from './useAuth';

// Mock useAuth hook
vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useHasRole', () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useHasRole('admin'));
    expect(result.current).toBe(false);
  });

  it('returns false when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    });

    const { result } = renderHook(() => useHasRole('admin'));
    expect(result.current).toBe(false);
  });

  it('returns false when user has no role', () => {
    mockUseAuth.mockReturnValue({
      user: { role: null },
      isLoading: false,
    });

    const { result } = renderHook(() => useHasRole('admin'));
    expect(result.current).toBe(false);
  });

  it('returns true when user has the required role', () => {
    mockUseAuth.mockReturnValue({
      user: { role: { name: 'admin' } },
      isLoading: false,
    });

    const { result } = renderHook(() => useHasRole('admin'));
    expect(result.current).toBe(true);
  });

  it('returns false when user has a different role', () => {
    mockUseAuth.mockReturnValue({
      user: { role: { name: 'user' } },
      isLoading: false,
    });

    const { result } = renderHook(() => useHasRole('admin'));
    expect(result.current).toBe(false);
  });
}); 