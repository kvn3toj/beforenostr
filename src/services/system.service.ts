import { supabase } from './supabaseClient';
import type { AuditLog, SystemSettings, UpdateSystemSettingsData, BackupStatus, RecentBackupsMetric, ServiceStatus, SystemHealthMetric } from '../types/system.types';

export interface FetchAuditLogsParams {
  page: number; // 0-indexed
  pageSize: number;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    action?: string;
    entity_type?: string;
    user_id?: string;
  };
}

export const fetchAuditLogs = async (params: FetchAuditLogsParams): Promise<{ data: AuditLog[]; count: number }> => {
  let query = supabase
    .from('audit_logs')
    .select('*, user:user_id(email)', { count: 'exact' });

  // Aplicar filtrado
  if (params.filters.action) {
    query = query.ilike('action', `%${params.filters.action}%`);
  }
  if (params.filters.entity_type) {
    query = query.ilike('entity_type', `%${params.filters.entity_type}%`);
  }
  if (params.filters.user_id) {
    query = query.eq('user_id', params.filters.user_id);
  }

  // Aplicar ordenamiento
  if (params.sortBy) {
    query = query.order(params.sortBy, { ascending: params.sortDirection === 'asc' });
  } else {
    // Ordenamiento por defecto si no se especifica sortBy
    query = query.order('created_at', { ascending: false });
  }

  // Aplicar paginación (range es inclusivo en ambos extremos)
  const start = params.page * params.pageSize;
  const end = start + params.pageSize - 1;
  query = query.range(start, end);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }

  return { data: data as AuditLog[], count: count ?? 0 };
};

export const fetchSystemSettings = async (): Promise<SystemSettings> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data as SystemSettings;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

export const updateSystemSettings = async (
  id: string,
  data: UpdateSystemSettingsData
): Promise<SystemSettings> => {
  try {
    const { data: updatedData, error } = await supabase
      .from('settings')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return updatedData as SystemSettings;
  } catch (error) {
    console.error('Error updating system settings:', error);
    throw error;
  }
};

export const fetchRecentBackups = async (): Promise<RecentBackupsMetric> => {
  try {
    const { data, error } = await supabase
      .from('backup_status_view')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return data as RecentBackupsMetric;
  } catch (error) {
    console.error('Error fetching recent backups:', error);
    throw error;
  }
};

export const fetchServiceStatuses = async (): Promise<SystemHealthMetric> => {
  try {
    const { data, error } = await supabase
      .from('service_health')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data as SystemHealthMetric;
  } catch (error) {
    console.error('Error fetching service statuses:', error);
    throw error;
  }
};

export const initiateManualBackup = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const { data, error } = await supabase.rpc('initiate_manual_backup');

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Backup manual iniciado con éxito'
    };
  } catch (error) {
    console.error('Error initiating manual backup:', error);
    throw error;
  }
}; 