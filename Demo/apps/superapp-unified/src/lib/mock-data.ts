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
  // Mock para la lista de videos de UPlay (endpoint correcto: /video-items)
  '/video-items': (method) => {
    if (method === 'GET') {
      return [
        {
          id: 1,
          title: 'Introducción al Ayni y la Reciprocidad',
          description: 'Descubre los principios de la economía sagrada y cómo aplicar el Ayni en tu vida diaria.',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnailUrl: 'https://picsum.photos/seed/ayni/400/225',
          duration: 360,
          categories: '["filosofía", "ayni"]',
          tags: '["ayni", "filosofía", "economía"]',
          questions: [
            {
              id: 1,
              timestamp: 120,
              text: '¿Qué significa Ayni?',
              answerOptions: [
                { id: 1, text: 'Reciprocidad', isCorrect: true },
                { id: 2, text: 'Intercambio', isCorrect: false },
                { id: 3, text: 'Dinero', isCorrect: false },
              ],
            },
          ],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          isActive: true,
          platform: 'youtube',
        },
        {
          id: 2,
          title: 'El Bien Común como Norte',
          description: 'Cómo nuestras acciones individuales construyen una mejor comunidad para todos.',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnailUrl: 'https://picsum.photos/seed/biencomun/400/225',
          duration: 480,
          categories: '["comunidad", "bienestar"]',
          tags: '["bien común", "comunidad", "cooperación"]',
          questions: [
            {
              id: 2,
              timestamp: 240,
              text: '¿Cuál es el principio del Bien Común?',
              answerOptions: [
                { id: 3, text: 'Beneficio individual', isCorrect: false },
                { id: 4, text: 'Beneficio colectivo', isCorrect: true },
                { id: 5, text: 'Competencia', isCorrect: false },
              ],
            },
          ],
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          isActive: true,
          platform: 'youtube',
        },
        {
          id: 3,
          title: 'Generando Öndas Positivas',
          description: 'El impacto de la energía positiva en nuestro entorno y cómo cultivarla.',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnailUrl: 'https://picsum.photos/seed/ondas/400/225',
          duration: 240,
          categories: '["energía", "bienestar"]',
          tags: '["ondas", "energía", "bienestar"]',
          questions: [
            {
              id: 3,
              timestamp: 180,
              text: '¿Qué son las Öndas en CoomÜnity?',
              answerOptions: [
                { id: 6, text: 'Unidades de energía positiva', isCorrect: true },
                { id: 7, text: 'Puntos de experiencia', isCorrect: false },
                { id: 8, text: 'Dinero virtual', isCorrect: false },
              ],
            },
          ],
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-03T00:00:00Z',
          isActive: true,
          platform: 'youtube',
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
  // Remove query parameters for matching
  const cleanEndpoint = endpoint.split('?')[0];

  // Try exact match first
  let handler = mockResponses[endpoint];
  if (!handler) {
    // Try without query parameters
    handler = mockResponses[cleanEndpoint];
  }

  if (handler) {
    console.log(`🟡 [MOCK] Found handler for ${cleanEndpoint}, returning mock data`);
    return handler(method);
  }

  // Respuesta por defecto para endpoints no definidos
  console.warn(`🟡 [MOCK] No mock data found for ${method} ${endpoint} (cleaned: ${cleanEndpoint}). Returning default success response.`);
  return {
    success: true,
    message: `Mocked response for ${method} ${endpoint}`,
    data: {},
  };
};
