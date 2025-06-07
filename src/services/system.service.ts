import type { AuditLog, SystemSettings, UpdateSystemSettingsData, BackupStatus, RecentBackupsMetric, ServiceStatus, SystemHealthMetric } from '../types/system.types';
import { apiService } from './api.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const ADMIN_SYSTEM_ENDPOINT = `${API_BASE_URL}/admin/system`;

export interface FetchAuditLogsParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: {
    userId?: string;
    actionType?: string;
    startDate?: string;
    endDate?: string;
  };
}

// Sistema - Estado del sistema
export const fetchSystemStatus = async (): Promise<any> => {
  try {
    return await apiService.get('/admin/system/status');
  } catch (error) {
    console.warn('[System] Backend no disponible para estado del sistema');
    throw error;
  }
};

export const initiateBackup = async (): Promise<{ status: string; userId: string }> => {
  try {
    return await apiService.post('/admin/system/backup/initiate');
  } catch (error) {
    console.warn('[System] Backend no disponible para backup');
    throw error;
  }
};

// Funciones legacy mantenidas para compatibilidad con hooks existentes
export const fetchSystemSettings = async (): Promise<SystemSettings> => {
  try {
    // Nota: Este endpoint no existe en el backend actual, mantenido para compatibilidad
    return await apiService.get('/system/settings');
  } catch (error) {
    console.warn('[System] Backend no disponible para configuraciones');
    throw error;
  }
};

export const updateSystemSettings = async (
  id: string,
  data: UpdateSystemSettingsData
): Promise<SystemSettings> => {
  try {
    // Nota: Este endpoint no existe en el backend actual, mantenido para compatibilidad
    return await apiService.put(`/system/settings/${id}`, data);
  } catch (error) {
    console.warn('[System] Backend no disponible para actualizar configuraciones');
    throw error;
  }
};

export const fetchRecentBackups = async (): Promise<RecentBackupsMetric> => {
  try {
    // Nota: Este endpoint no existe en el backend actual, mantenido para compatibilidad
    return await apiService.get('/system/backups/recent');
  } catch (error) {
    console.warn('[System] Backend no disponible para backups recientes');
    return [];
  }
};

export const fetchServiceStatuses = async (): Promise<SystemHealthMetric> => {
  try {
    // Nota: Este endpoint no existe en el backend actual, mantenido para compatibilidad
    return await apiService.get('/system/health');
  } catch (error) {
    console.warn('[System] Backend no disponible para estado de servicios');
    return [];
  }
};

export const initiateManualBackup = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    await initiateBackup();
    return {
      success: true,
      message: 'Backup manual iniciado con éxito'
    };
  } catch (error) {
    console.warn('[System] Backend no disponible para backup manual');
    throw error;
  }
};

// Mock temporal hasta implementar backend completo
export const fetchSystemConfigs = async (params: any = {}) => {
  try {
    // 🚀 MIGRADO: Priorizar Backend NestJS real en puerto 3002 - Fase 2.4
    console.info('[System] Conectando al backend NestJS para configuraciones del sistema...');
    
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        searchParams.append(key, params[key].toString());
      }
    });
    
    const response = await apiService.get(`/system/configs?${searchParams.toString()}`);
    console.info('[System] ✅ Configuraciones del sistema obtenidas del backend real');
    
    return response;
    
  } catch (error: any) {
    console.warn('[System] ⚠️ Backend no disponible para configuraciones, usando fallback a datos mock:', error);
    
    // 🔄 Fallback mejorado con datos mock más completos
    const mockConfigs = {
      data: [
        {
          id: 'app_title',
          key: 'app_title',
          value: 'CoomÜnity SuperApp',
          category: 'general',
          created_at: new Date().toISOString()
        },
        {
          id: 'api_version',
          key: 'api_version', 
          value: '2.4',
          category: 'technical',
          created_at: new Date().toISOString()
        },
        {
          id: 'enable_real_backend',
          key: 'enable_real_backend',
          value: 'true',
          category: 'features',
          created_at: new Date().toISOString()
        }
      ], 
      count: 3,
      success: true,
      message: 'Mock system configurations - Backend migrated to NestJS'
    };
    
    return mockConfigs;
  }
};

export const createSystemConfig = async (configData: any) => {
  try {
    return await apiService.post('/system/configs', configData);
  } catch (error) {
    console.warn('[System] Backend no disponible para crear configuración');
    throw error;
  }
};

export const updateSystemConfig = async (id: string, configData: any) => {
  try {
    return await apiService.put(`/system/configs/${id}`, configData);
  } catch (error) {
    console.warn('[System] Backend no disponible para actualizar configuración');
    throw error;
  }
};

export const deleteSystemConfig = async (id: string) => {
  try {
    return await apiService.delete(`/system/configs/${id}`);
  } catch (error) {
    console.warn('[System] Backend no disponible para eliminar configuración');
    throw error;
  }
};

export const fetchAuditLogsApi = async (params: any = {}) => {
  try {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        searchParams.append(key, params[key].toString());
      }
    });
    return await apiService.get(`/system/audit-logs?${searchParams.toString()}`);
  } catch (error) {
    console.warn('[System] Backend no disponible para logs de auditoría');
    return { data: [], count: 0 };
  }
}; 