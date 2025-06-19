import { apiService } from './api.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const ADMIN_CONFIG_ENDPOINT = `${API_BASE_URL}/admin/config`;

export interface AppConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  isSensitive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConfigDto {
  key: string;
  value: any;
  description?: string;
  isSensitive?: boolean;
}

export interface UpdateConfigDto {
  key?: string;
  value?: any;
  description?: string;
  isSensitive?: boolean;
}

export interface FetchConfigsParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: {
    key?: string;
    isSensitive?: boolean;
  };
}

// Configuración - CRUD operations
export const fetchConfigs = async (params: FetchConfigsParams = {}): Promise<AppConfig[]> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params.pageSize !== undefined) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params.sortBy) {
      searchParams.append('sortBy', params.sortBy);
      searchParams.append('sortDirection', params.sortDirection || 'asc');
    }
    if (params.filters?.key) {
      searchParams.append('key', params.filters.key);
    }
    if (params.filters?.isSensitive !== undefined) {
      searchParams.append('isSensitive', params.filters.isSensitive.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/admin/config?${queryString}` : '/admin/config';
    
    return await apiService.get(endpoint);
  } catch (error) {
    console.warn('[Config] Backend no disponible para obtener configuraciones');
    throw error;
  }
};

export const fetchConfigById = async (id: string): Promise<AppConfig> => {
  try {
    return await apiService.get(`/admin/config/${id}`);
  } catch (error) {
    console.warn(`[Config] Backend no disponible para obtener configuración ${id}`);
    throw error;
  }
};

export const fetchConfigByKey = async (key: string): Promise<AppConfig> => {
  try {
    return await apiService.get(`/admin/config/key/${key}`);
  } catch (error) {
    console.warn(`[Config] Backend no disponible para obtener configuración con clave ${key}`);
    throw error;
  }
};

export const createConfig = async (configData: CreateConfigDto): Promise<AppConfig> => {
  try {
    return await apiService.post('/admin/config', configData);
  } catch (error) {
    console.warn('[Config] Backend no disponible para crear configuración');
    throw error;
  }
};

export const updateConfig = async (id: string, configData: UpdateConfigDto): Promise<AppConfig> => {
  try {
    return await apiService.put(`/admin/config/${id}`, configData);
  } catch (error) {
    console.warn(`[Config] Backend no disponible para actualizar configuración ${id}`);
    throw error;
  }
};

export const deleteConfig = async (id: string): Promise<AppConfig> => {
  try {
    return await apiService.delete(`/admin/config/${id}`);
  } catch (error) {
    console.warn(`[Config] Backend no disponible para eliminar configuración ${id}`);
    throw error;
  }
}; 