import { apiService } from './api.service';
import { Mundo, CreateMundoData, UpdateMundoData, MundoVersion } from '../types/mundo.types';

// Configuración de endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const MUNDOS_ENDPOINT = '/mundos'; // Usar el endpoint /mundos que está funcionando

export interface FetchMundosParams {
  page?: number;
  pageSize?: number;
  sortBy?: string | null;
  sortDirection?: 'asc' | 'desc' | null;
  filters?: {
    name?: string;
    is_active?: boolean;
  };
}

export interface MundosResponse {
  data: Mundo[];
  count: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Obtiene la lista de mundos desde el backend
 */
export const fetchMundos = async (params: FetchMundosParams = {}): Promise<MundosResponse> => {
  console.log('[Mundos] fetchMundos llamado con params:', params);
  
  try {
    // Construir query parameters si se proporcionan
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params.pageSize !== undefined) {
      searchParams.append('limit', params.pageSize.toString());
    }
    if (params.sortBy) {
      searchParams.append('sortBy', params.sortBy);
    }
    if (params.sortDirection) {
      searchParams.append('sortDirection', params.sortDirection);
    }
    if (params.filters?.name) {
      searchParams.append('name', params.filters.name);
    }
    if (params.filters?.is_active !== undefined) {
      searchParams.append('isActive', params.filters.is_active.toString());
    }
    
    const queryString = searchParams.toString();
    const url = queryString ? `${MUNDOS_ENDPOINT}?${queryString}` : MUNDOS_ENDPOINT;
    
    console.log('[Mundos] Haciendo petición a:', url);
    
    const response = await apiService.get<Mundo[]>(url);
    console.log('[Mundos] Respuesta recibida:', response);
    
    // El backend devuelve un array directo de Mundos
    // Necesitamos convertirlo al formato esperado por el frontend
    if (Array.isArray(response)) {
      console.log('[Mundos] Respuesta es array, convirtiendo formato. Items:', response.length);
      return {
        data: response,
        count: response.length,
        pagination: {
          page: params.page || 1,
          limit: params.pageSize || 10,
          totalPages: Math.ceil(response.length / (params.pageSize || 10)),
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }
    
    // Si ya viene en el formato correcto, devolverlo tal como está
    console.log('[Mundos] Respuesta ya en formato correcto');
    return response as MundosResponse;
    
  } catch (error) {
    console.error('[Mundos] Error al obtener mundos:', error);
    console.error('[Mundos] Error message:', error?.message);
    console.error('[Mundos] Error stack:', error?.stack);
    
    // En caso de error, devolver estructura vacía
    throw new Error(`Error al obtener mundos: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Obtiene un mundo específico por ID
 */
export const fetchMundoById = async (id: string): Promise<Mundo> => {
  console.log('[Mundos] fetchMundoById llamado con id:', id);
  
  try {
    // Usar el endpoint específico /mundos/id/:id para evitar conflictos con rutas
    const response = await apiService.get<Mundo>(`${MUNDOS_ENDPOINT}/id/${id}`);
    console.log('[Mundos] Mundo obtenido:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al obtener mundo por ID:', error);
    throw new Error(`Error al obtener mundo: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Crea un nuevo mundo
 */
export const createMundo = async (mundoData: CreateMundoData): Promise<Mundo> => {
  console.log('[Mundos] createMundo llamado con data:', mundoData);
  
  try {
    const response = await apiService.post<Mundo>(MUNDOS_ENDPOINT, mundoData);
    console.log('[Mundos] Mundo creado:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al crear mundo:', error);
    throw new Error(`Error al crear mundo: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Actualiza un mundo existente
 */
export const updateMundo = async (id: string, mundoData: UpdateMundoData): Promise<Mundo> => {
  console.log('[Mundos] updateMundo llamado con id:', id, 'data:', mundoData);
  
  try {
    const response = await apiService.put<Mundo>(`${MUNDOS_ENDPOINT}/${id}`, mundoData);
    console.log('[Mundos] Mundo actualizado:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al actualizar mundo:', error);
    throw new Error(`Error al actualizar mundo: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Elimina un mundo (soft delete)
 */
export const deleteMundo = async (id: string): Promise<Mundo> => {
  console.log('[Mundos] deleteMundo llamado con id:', id);
  
  try {
    const response = await apiService.delete<Mundo>(`${MUNDOS_ENDPOINT}/${id}`);
    console.log('[Mundos] Mundo eliminado:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al eliminar mundo:', error);
    throw new Error(`Error al eliminar mundo: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Publica un mundo
 */
export const publishMundo = async (id: string): Promise<Mundo> => {
  console.log('[Mundos] publishMundo llamado con id:', id);
  
  try {
    const response = await apiService.post<Mundo>(`${MUNDOS_ENDPOINT}/${id}/publish`);
    console.log('[Mundos] Mundo publicado:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al publicar mundo:', error);
    throw new Error(`Error al publicar mundo: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Despublica un mundo
 */
export const unpublishMundo = async (id: string): Promise<Mundo> => {
  console.log('[Mundos] unpublishMundo llamado con id:', id);
  
  try {
    const response = await apiService.post<Mundo>(`${MUNDOS_ENDPOINT}/${id}/unpublish`);
    console.log('[Mundos] Mundo despublicado:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al despublicar mundo:', error);
    throw new Error(`Error al despublicar mundo: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Obtiene las versiones de un mundo
 */
export const fetchMundoVersions = async (mundoId: string): Promise<MundoVersion[]> => {
  console.log('[Mundos] fetchMundoVersions llamado con mundoId:', mundoId);
  
  try {
    const response = await apiService.get<MundoVersion[]>(`${MUNDOS_ENDPOINT}/${mundoId}/versions`);
    console.log('[Mundos] Versiones obtenidas:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al obtener versiones:', error);
    // En caso de error, devolver array vacío para no romper la UI
    console.warn('[Mundos] Devolviendo array vacío de versiones');
    return [];
  }
};

/**
 * Crea una nueva versión de un mundo
 */
export const createMundoVersion = async (
  mundoId: string,
  mundoData: Mundo,
  userId: string
): Promise<MundoVersion> => {
  console.log('[Mundos] createMundoVersion llamado con mundoId:', mundoId, 'userId:', userId);
  
  try {
    // Obtener la versión actual
    const currentMundo = await fetchMundoById(mundoId);
    const newVersion = (currentMundo?.version || 0) + 1;

    // Crear el registro de versión
    const versionData = {
      version: newVersion,
      changed_by_user_id: userId,
      name: mundoData.name,
      description: mundoData.description,
      thumbnail_url: mundoData.thumbnail_url,
      is_active: mundoData.is_active,
      published_at: mundoData.published_at,
      unpublished_at: mundoData.unpublished_at,
    };

    const response = await apiService.post<MundoVersion>(`${MUNDOS_ENDPOINT}/${mundoId}/versions`, versionData);

    // Actualizar el número de versión en el mundo principal
    await updateMundo(mundoId, { version: newVersion });

    console.log('[Mundos] Versión creada:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al crear versión:', error);
    throw new Error(`Error al crear versión: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Restaura una versión específica de un mundo
 */
export const restoreMundoVersion = async (
  mundoId: string,
  versionId: string
): Promise<Mundo> => {
  console.log('[Mundos] restoreMundoVersion llamado con mundoId:', mundoId, 'versionId:', versionId);
  
  try {
    const response = await apiService.post<Mundo>(`${MUNDOS_ENDPOINT}/${mundoId}/versions/${versionId}/restore`);
    console.log('[Mundos] Versión restaurada:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al restaurar versión:', error);
    throw new Error(`Error al restaurar versión: ${error?.message || 'Error desconocido'}`);
  }
};

/**
 * Obtiene las playlists de un mundo específico
 */
export const fetchMundoPlaylists = async (mundoId: string): Promise<any[]> => {
  console.log('[Mundos] fetchMundoPlaylists llamado con mundoId:', mundoId);
  
  try {
    const response = await apiService.get<any[]>(`${MUNDOS_ENDPOINT}/${mundoId}/playlists`);
    console.log('[Mundos] Playlists obtenidas:', response);
    return response;
  } catch (error) {
    console.error('[Mundos] Error al obtener playlists del mundo:', error);
    // En caso de error, devolver array vacío para no romper la UI
    console.warn('[Mundos] Devolviendo array vacío de playlists');
    return [];
  }
}; 