import { apiService } from './api.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';
const ADMIN_AUDIT_LOGS_ENDPOINT = `${API_BASE_URL}/admin/audit-logs`;

export interface AuditLog {
  id: string;
  userId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface FetchAuditLogsParams {
  userId?: string;
  actionType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: {
    userId?: string;
    actionType?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
  };
}

// Audit Logs - Consulta de logs de auditoría
export const fetchAuditLogs = async (params: FetchAuditLogsParams = {}): Promise<{ data: AuditLog[]; count: number }> => {
  try {
    const searchParams = new URLSearchParams();
    
    // Parámetros de paginación
    if (params.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params.pageSize !== undefined) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params.limit !== undefined) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params.offset !== undefined) {
      searchParams.append('offset', params.offset.toString());
    }
    
    // Parámetros de ordenamiento
    if (params.sortBy) {
      searchParams.append('sortBy', params.sortBy);
      searchParams.append('sortDirection', params.sortDirection || 'desc');
    }
    
    // Filtros directos
    if (params.userId) {
      searchParams.append('userId', params.userId);
    }
    if (params.actionType) {
      searchParams.append('actionType', params.actionType);
    }
    if (params.startDate) {
      searchParams.append('startDate', params.startDate);
    }
    if (params.endDate) {
      searchParams.append('endDate', params.endDate);
    }
    
    // Filtros anidados
    if (params.filters?.userId) {
      searchParams.append('userId', params.filters.userId);
    }
    if (params.filters?.actionType) {
      searchParams.append('actionType', params.filters.actionType);
    }
    if (params.filters?.entityType) {
      searchParams.append('entityType', params.filters.entityType);
    }
    if (params.filters?.startDate) {
      searchParams.append('startDate', params.filters.startDate);
    }
    if (params.filters?.endDate) {
      searchParams.append('endDate', params.filters.endDate);
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/admin/audit-logs?${queryString}` : '/admin/audit-logs';
    
    const data = await apiService.get<AuditLog[]>(endpoint);
    
    // El backend devuelve directamente el array, pero mantenemos compatibilidad con la interfaz existente
    return {
      data: Array.isArray(data) ? data : [],
      count: Array.isArray(data) ? data.length : 0
    };
  } catch (error) {
    console.warn('[AuditLog] Backend no disponible para logs de auditoría');
    return { data: [], count: 0 };
  }
};

export const fetchAuditLogById = async (id: string): Promise<AuditLog> => {
  try {
    return await apiService.get(`/admin/audit-logs/${id}`);
  } catch (error) {
    console.warn(`[AuditLog] Backend no disponible para obtener audit log ${id}`);
    throw error;
  }
};

// Alias para compatibilidad con el sistema existente
export const fetchAuditLogsApi = fetchAuditLogs; 