import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-i18next globally for all tests
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      // Basic translations for common keys
      const translations: { [key: string]: string } = {
        // Role validation messages
        'role_name_min_length': 'El nombre debe tener al menos 3 caracteres',
        'role_name_max_length': 'El nombre no puede tener más de 50 caracteres',
        'role_name_format': 'El nombre solo puede contener letras, números, espacios, guiones y guiones bajos',
        
        // User validation messages
        'email_invalid': 'Email inválido',
        'password_min_length': 'La contraseña debe tener al menos 6 caracteres',
        'role_required': 'El rol es requerido',
        
        // Toast messages
        'toast_role_created_success': 'Rol creado exitosamente',
        'toast_error_creating_role': `Error al crear el rol: ${options?.message || ''}`,
        'toast_role_updated_success': 'Rol actualizado exitosamente',
        'toast_error_updating_role': `Error al actualizar el rol: ${options?.message || ''}`,
        'toast_role_deleted_success': 'Rol eliminado exitosamente',
        'toast_error_deleting_role': `Error al eliminar el rol: ${options?.message || ''}`,
        
        'toast_user_created_success': 'Usuario creado exitosamente',
        'toast_error_creating_user': `Error al crear usuario: ${options?.message || ''}`,
        'toast_user_updated_success': 'Usuario actualizado exitosamente',
        'toast_error_updating_user': `Error al actualizar usuario: ${options?.message || ''}`,
        'toast_user_deleted_success': 'Usuario eliminado exitosamente',
        'toast_error_deleting_user': `Error al eliminar usuario: ${options?.message || ''}`,
        
        'toast_mundo_created_success': 'Mundo creado exitosamente',
        'toast_error_creating_mundo': `Error al crear el mundo: ${options?.message || ''}`,
        'toast_mundo_updated_success': 'Mundo actualizado exitosamente',
        'toast_error_updating_mundo': `Error al actualizar el mundo: ${options?.message || ''}`,
        'toast_mundo_deleted_success': 'Mundo eliminado exitosamente',
        'toast_error_deleting_mundo': `Error al eliminar el mundo: ${options?.message || ''}`,
        
        'toast_playlist_created_success': 'Playlist creada exitosamente',
        'toast_error_creating_playlist': `Error al crear la playlist: ${options?.message || ''}`,
        'toast_playlist_updated_success': 'Playlist actualizada exitosamente',
        'toast_error_updating_playlist': `Error al actualizar la playlist: ${options?.message || ''}`,
        'toast_playlist_deleted_success': 'Playlist eliminada exitosamente',
        'toast_error_deleting_playlist': `Error al eliminar la playlist: ${options?.message || ''}`,
        
        // Generic messages
        'error_generic': 'Error desconocido',
        'error_user_not_authenticated': 'Usuario no autenticado',
        'toast_error_prefix': `¡Error!: ${options?.message || ''}`,
      };
      
      return translations[key] || key;
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onDkdkdkd: null,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock process.cwd to avoid EMFILE errors in jsdom environment
vi.spyOn(process, 'cwd').mockReturnValue('/'); 