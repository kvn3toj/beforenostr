export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: Record<string, any> | null;
  created_at: string;
}

// Tipos de acciones posibles en el sistema
export type AuditAction = 
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'status_change';

// Tipos de entidades que pueden ser auditadas
export type AuditEntityType = 
  | 'user'
  | 'mundo'
  | 'playlist'
  | 'content'
  | 'role'
  | 'permission';

// Configuración del sistema
export interface SystemSettings {
  id: string;
  app_name: string;
  default_role_id: string;
  maintenance_mode: boolean;
  max_upload_size_mb: number;
  allowed_file_types: string[];
  created_at: string;
  updated_at: string;
}

export type UpdateSystemSettingsData = Partial<Omit<SystemSettings, 'id' | 'created_at' | 'updated_at'>>;

export interface BackupStatus {
  id: string; // ID del backup
  timestamp: string; // Fecha y hora del backup
  status: 'success' | 'failed' | 'in_progress'; // Estado del backup
  file_size: number | null; // Tamaño del archivo de backup en bytes
  type: 'manual' | 'automatic'; // Tipo de backup
}

export type RecentBackupsMetric = BackupStatus[];

export interface ServiceStatus {
  name: string; // Nombre del servicio (ej. 'Database', 'API', 'External Service X')
  status: 'ok' | 'warning' | 'critical' | 'unknown'; // Estado del servicio
  last_checked: string; // Fecha y hora de la última verificación
  message: string | null; // Mensaje adicional (ej. descripción del error)
}

export type SystemHealthMetric = ServiceStatus[]; 