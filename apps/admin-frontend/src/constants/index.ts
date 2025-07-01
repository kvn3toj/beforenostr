// Constants for the admin frontend application

// Default mundo ID for testing and development
export const currentMundoId = 'default-mundo-id';

// API endpoints and configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// Application configuration
export const APP_NAME = 'CoomÜnity Gamifier Admin';
export const APP_VERSION = '1.0.0';

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Form validation constants
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_EMAIL_LENGTH = 255;

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Refresh intervals (in milliseconds)
export const DEFAULT_REFRESH_INTERVAL = 30000; // 30 seconds
export const SLOW_REFRESH_INTERVAL = 60000; // 1 minute