import { apiService } from './api.service';

// =====================================================
// TIPOS COSMIC KANBAN
// =====================================================

export enum ThematicElement {
  FUEGO = 'Fuego',
  AGUA = 'Agua',
  AIRE = 'Aire',
  TIERRA = 'Tierra',
  ETER = 'Éter'
}

export enum GuardianRole {
  ANA = 'ANA',
  LUNA = 'LUNA',
  ARIA = 'ARIA',
  NIRA = 'NIRA',
  MIRA = 'MIRA',
  ZENO = 'ZENO',
  KIRA = 'KIRA',
  SAGE = 'SAGE',
  IRA = 'IRA',
  COSMOS = 'COSMOS',
  PHOENIX = 'PHOENIX',
  ATLAS = 'ATLAS'
}

export enum HambrELevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

export enum ColumnStatus {
  BACKLOG = 'Backlog Cósmico',
  ALCHEMY = 'En Proceso de Alquimia',
  QUALITY = 'Control de Calidad Consciencia',
  MANIFESTADO = 'Manifestado en la Realidad'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum PhilosophicalKpi {
  VIC = 'VIC',
  IER = 'IER',
  NEG = 'NEG',
  REC = 'REC',
  COO = 'COO'
}

export interface CosmicTask {
  id: string;
  title: string;
  description: string;
  element: ThematicElement;
  guardian: GuardianRole;
  hambreLevel: HambrELevel;
  priority: TaskPriority;
  phase: number;
  estimatedHours: number;
  philosophicalKpi: PhilosophicalKpi;
  tags: string[];
  status: ColumnStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCosmicTaskDto {
  title: string;
  description: string;
  element: ThematicElement;
  guardian: GuardianRole;
  hambreLevel: HambrELevel;
  priority: TaskPriority;
  phase: number;
  estimatedHours: number;
  philosophicalKpi: PhilosophicalKpi;
  tags: string[];
  status: ColumnStatus;
}

export interface UpdateCosmicTaskDto extends Partial<CreateCosmicTaskDto> {}

export interface CosmicTaskFilter {
  guardian?: GuardianRole;
  element?: ThematicElement;
  status?: ColumnStatus;
  phase?: number;
}

export interface CosmicKanbanStats {
  total: number;
  byGuardian: Record<string, number>;
  byElement: Record<string, number>;
  byStatus: Record<string, number>;
  averageHours: number;
  mostActiveGuardian: string;
  dominantElement: string;
}

// =====================================================
// SERVICIOS API
// =====================================================

const COSMIC_KANBAN_ENDPOINT = '/cosmic-kanban';

export const cosmicKanbanService = {
  // Obtener todas las tareas con filtros opcionales
  async getAllTasks(filters?: CosmicTaskFilter): Promise<CosmicTask[]> {
    const params = new URLSearchParams();
    if (filters?.guardian) params.append('guardian', filters.guardian);
    if (filters?.element) params.append('element', filters.element);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.phase) params.append('phase', filters.phase.toString());

    const queryString = params.toString();
    const url = queryString ? `${COSMIC_KANBAN_ENDPOINT}/tasks?${queryString}` : `${COSMIC_KANBAN_ENDPOINT}/tasks`;

    return await apiService.get(url);
  },

  // Obtener tarea por ID
  async getTaskById(id: string): Promise<CosmicTask> {
    return await apiService.get(`${COSMIC_KANBAN_ENDPOINT}/tasks/${id}`);
  },

  // Crear nueva tarea
  async createTask(taskDto: CreateCosmicTaskDto): Promise<CosmicTask> {
    return await apiService.post(`${COSMIC_KANBAN_ENDPOINT}/tasks`, taskDto);
  },

  // Actualizar tarea existente
  async updateTask(id: string, updateDto: UpdateCosmicTaskDto): Promise<CosmicTask> {
    return await apiService.put(`${COSMIC_KANBAN_ENDPOINT}/tasks/${id}`, updateDto);
  },

  // Eliminar tarea
  async deleteTask(id: string): Promise<void> {
    return await apiService.delete(`${COSMIC_KANBAN_ENDPOINT}/tasks/${id}`);
  },

  // Obtener estadísticas del kanban
  async getStats(): Promise<CosmicKanbanStats> {
    return await apiService.get(`${COSMIC_KANBAN_ENDPOINT}/stats`);
  }
};
