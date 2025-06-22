/**
 * 🟡 Catálogo de Datos Mock
 *
 * Proporciona datos falsos para simular respuestas de la API cuando
 * VITE_ENABLE_MOCK_AUTH está activado. Esto permite el desarrollo y las pruebas
 * del frontend sin necesidad de un backend en funcionamiento.
 */
import { type User } from '../services/auth.service';

// 👤 Usuario Mock
const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'mock.user@coomunity.com',
  name: 'Mock Player',
  avatarUrl: 'https://i.pravatar.cc/150?u=mock-user',
  roles: ['user'],
  permissions: ['content:read'],
};

// 🔑 Token Mock
const MOCK_TOKEN = 'mock-jwt-token-string-for-testing-purposes';

// 📚 Catálogo de respuestas mock por endpoint
const mockResponses: Record<string, (method: string) => any> = {
  '/auth/login': (method) => {
    if (method === 'POST') {
      return {
        user: MOCK_USER,
        access_token: MOCK_TOKEN,
      };
    }
    return { error: 'Method not mocked' };
  },
  '/auth/me': (method) => {
    if (method === 'GET') {
      return MOCK_USER;
    }
    return { error: 'Method not mocked' };
  },
  '/auth/logout': (method) => {
    if (method === 'POST') {
      return { message: 'Logout successful' };
    }
    return { error: 'Method not mocked' };
  },
  '/users/profile': (method) => {
    if (method === 'GET') {
      return MOCK_USER;
    }
    return { error: 'Method not mocked' };
  },
  // Mock para la lista de videos de UPlay
  '/videos': (method) => {
    if (method === 'GET') {
      return [
        {
          id: 'video-1',
          title: 'Introducción al Ayni y la Reciprocidad',
          description: 'Descubre los principios de la economía sagrada.',
          thumbnailUrl: 'https://picsum.photos/seed/ayni/400/225',
          duration: 360,
          tags: ['ayni', 'filosofía', 'economía'],
        },
        {
          id: 'video-2',
          title: 'El Bien Común como Norte',
          description: 'Cómo nuestras acciones construyen una mejor comunidad.',
          thumbnailUrl: 'https://picsum.photos/seed/biencomun/400/225',
          duration: 480,
          tags: ['bien común', 'comunidad', 'cooperación'],
        },
        {
          id: 'video-3',
          title: 'Generando Öndas Positivas',
          description: 'El impacto de la energía positiva en nuestro entorno.',
          thumbnailUrl: 'https://picsum.photos/seed/ondas/400/225',
          duration: 240,
          tags: ['ondas', 'energía', 'bienestar'],
        },
      ];
    }
    return { error: 'Method not mocked' };
  },
  // Añade más endpoints aquí a medida que se necesiten
  // Ejemplo:
  // '/videos/playlist': (method) => { ... }
};

/**
 * Devuelve datos mock para un endpoint y método dados.
 * @param endpoint - El endpoint de la API (ej. '/auth/login')
 * @param method - El método HTTP (ej. 'GET', 'POST')
 * @returns Los datos mock correspondientes o una respuesta de error por defecto.
 */
export const getMockData = (endpoint: string, method: string): any => {
  const handler = mockResponses[endpoint];
  if (handler) {
    return handler(method);
  }

  // Respuesta por defecto para endpoints no definidos
  console.warn(`🟡 [MOCK] No mock data found for ${method} ${endpoint}. Returning default success response.`);
  return {
    success: true,
    message: `Mocked response for ${method} ${endpoint}`,
    data: {},
  };
};