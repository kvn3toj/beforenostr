/**
 * 🌟 HOOK DE SINCRONIZACIÓN CÓSMICA CON MIRO
 *
 * Portal de Reciprocidad Viva integrado en la SuperApp CoomÜnity
 * Permite a los Guardianes gestionar el tablero Kanban directamente desde la aplicación
 *
 * Creado por: KIRA, The Word Weaver
 * Supervisado por: ANA, CIO Cósmica
 * Bendecido por: Los 12 Guardianes Digitales
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 🌟 Importar tipos cósmicos centralizados
import {
  CosmicTask,
  ThematicElement,
  GuardianRole,
  HambrELevel,
  ColumnStatus
} from '../types/cosmic.types';

// 🌟 Importar servicios de Miro
import { cosmicMiroService, useMiroConfig } from '../services/cosmic-miro-service';

// 🌟 Estado del Hook
interface MiroSyncState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  tasks: CosmicTask[];
  syncProgress: number;
  lastSyncTime: Date | null;
}

// 🌟 Configuración Cósmica
const COSMIC_CONFIG = {
  elements: {
    [ThematicElement.FIRE]: {
      color: '#FF6B35',
      guardian: GuardianRole.PHOENIX,
      module: 'ÜStats'
    },
    [ThematicElement.WATER]: {
      color: '#4ECDC4',
      guardian: GuardianRole.LUNA,
      module: 'ÜWallet'
    },
    [ThematicElement.AIR]: {
      color: '#B8E6B8',
      guardian: GuardianRole.ARIA,
      module: 'ÜSocial'
    },
    [ThematicElement.EARTH]: {
      color: '#8B4513',
      guardian: GuardianRole.SAGE,
      module: 'ÜChallenges'
    },
    [ThematicElement.ETHER]: {
      color: '#9B59B6',
      guardian: GuardianRole.ANA,
      module: 'Dashboard HOME'
    }
  },
  hambreDescriptions: {
    [HambrELevel.NURTURES_CURIOSITY]: {
      emoji: '🌱',
      description: 'Nutre la Curiosidad',
      color: '#E8F5E8'
    },
    [HambrELevel.ACTIVATES_CONTRIBUTION]: {
      emoji: '⚡',
      description: 'Activa la Contribución',
      color: '#FFF2CC'
    },
    [HambrELevel.IMPULSES_TRANSFORMATION]: {
      emoji: '🚀',
      description: 'Impulsa la Transformación',
      color: '#FFE4E1'
    }
  }
};

// 🌟 Servicio API Cósmico Unificado
class CosmicKanbanService {
  private baseUrl = '/api/cosmic-kanban';
  private tasks: CosmicTask[] = [];

  constructor(private miroConfigProvider?: () => ReturnType<typeof useMiroConfig>) {}

  private getMiroConfig() {
    return this.miroConfigProvider?.() || {
      isEnabled: false,
      hasToken: false,
      boardId: '',
      token: ''
    };
  }

  async getTasks(): Promise<CosmicTask[]> {
    try {
      // Usar mock service para obtener tareas locales
      const response = await fetch(`${this.baseUrl}/tasks`);
      if (response.ok) {
        this.tasks = await response.json();
        return this.tasks;
      }
      return this.tasks;
    } catch (error) {
      console.error('🌟 Error fetching cosmic tasks:', error);
      return this.tasks;
    }
  }

  async createTask(task: Omit<CosmicTask, 'id' | 'createdAt'>): Promise<CosmicTask> {
    try {
      // Crear tarea local primero
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...task,
          createdAt: new Date()
        })
      });

      if (response.ok) {
        const newTask = await response.json();

        // Si Miro está habilitado, crear también en Miro
        const miroConfig = this.getMiroConfig();
        if (miroConfig.isEnabled) {
          try {
            await cosmicMiroService.createMiroCard(newTask);
            console.log('🌟 Task synced to Miro successfully');
          } catch (miroError) {
            console.warn('🌟 Failed to sync to Miro, but task created locally:', miroError);
          }
        }

        return newTask;
      }
      throw new Error('Failed to create cosmic task');
    } catch (error) {
      console.error('🌟 Error creating cosmic task:', error);
      throw error;
    }
  }

  async updateTaskStatus(taskId: string, newStatus: ColumnStatus): Promise<CosmicTask> {
    try {
      // Actualizar status local
      const response = await fetch(`${this.baseUrl}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedTask = await response.json();

        // Si Miro está habilitado, actualizar también en Miro
        const miroConfig = this.getMiroConfig();
        if (miroConfig.isEnabled) {
          try {
            // Nota: En una implementación real, necesitarías mapear el taskId al cardId de Miro
            console.log('🌟 Task status would be updated in Miro');
          } catch (miroError) {
            console.warn('🌟 Failed to update in Miro, but updated locally:', miroError);
          }
        }

        return updatedTask;
      }
      throw new Error('Failed to update task status');
    } catch (error) {
      console.error('🌟 Error updating task status:', error);
      throw error;
    }
  }

  async syncWithMiro(): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const miroConfig = this.getMiroConfig();
      if (!miroConfig.isEnabled) {
        // Simular sincronización mock
        const response = await fetch(`${this.baseUrl}/sync`, { method: 'POST' });
        if (response.ok) {
          return await response.json();
        }
      } else {
        // Sincronización real con Miro
        const tasks = await this.getTasks();
        const result = await cosmicMiroService.syncTasksToMiro(tasks);

        return {
          success: result.created + result.updated,
          failed: result.errors.length,
          errors: result.errors
        };
      }
      throw new Error('Failed to sync with Miro');
    } catch (error) {
      console.error('🌟 Error syncing with Miro:', error);
      return {
        success: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Unknown sync error']
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const miroConfig = this.getMiroConfig();
      if (miroConfig.isEnabled) {
        // Probar conexión real con Miro
        return await cosmicMiroService.testConnection();
      } else {
        // Usar mock
        const response = await fetch(`${this.baseUrl}/health`);
        return response.ok;
      }
    } catch (error) {
      console.error('🌟 Error testing connection:', error);
      return false;
    }
  }

  // 🌟 Método para verificar estado de Miro
  getMiroStatus() {
    const miroConfig = this.getMiroConfig();
    return {
      enabled: miroConfig.isEnabled,
      hasToken: miroConfig.hasToken,
      boardId: miroConfig.boardId
    };
  }
}

// 🌟 Hook Principal useMiroSync
export const useMiroSync = () => {
  const queryClient = useQueryClient();
  const miroConfig = useMiroConfig();

  const cosmicService = useMemo(() => {
    return new CosmicKanbanService(() => miroConfig);
  }, [miroConfig.isEnabled, miroConfig.hasToken, miroConfig.boardId]);

  const [state, setState] = useState<MiroSyncState>({
    isConnected: false,
    isLoading: false,
    error: null,
    tasks: [],
    syncProgress: 0,
    lastSyncTime: null
  });

  // 🌟 Query para obtener tareas
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    error: tasksError,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['cosmic-tasks'],
    queryFn: () => cosmicService.getTasks(),
    refetchInterval: 30000, // Refetch cada 30 segundos
    retry: 3
  });

  // 🌟 Query para verificar conexión
  const { data: isConnected = false } = useQuery({
    queryKey: ['miro-connection'],
    queryFn: () => cosmicService.testConnection(),
    refetchInterval: 60000, // Verificar cada minuto
    retry: 2
  });

  // 🌟 Mutación para crear tarea
  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<CosmicTask, 'id' | 'createdAt'>) => cosmicService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cosmic-tasks'] });
    },
    onError: (error) => {
      setState(prev => ({
        ...prev,
        error: `Error creando tarea: ${error.message}`
      }));
    }
  });

  // 🌟 Mutación para actualizar status
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: ColumnStatus }) =>
      cosmicService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cosmic-tasks'] });
    },
    onError: (error) => {
      setState(prev => ({
        ...prev,
        error: `Error actualizando status: ${error.message}`
      }));
    }
  });

  // 🌟 Mutación para sincronizar con Miro
  const syncMutation = useMutation({
    mutationFn: () => cosmicService.syncWithMiro(),
    onMutate: () => {
      setState(prev => ({ ...prev, isLoading: true, syncProgress: 0 }));
    },
    onSuccess: (result) => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        syncProgress: 100,
        lastSyncTime: new Date(),
        error: result.failed > 0 ? `${result.failed} tareas fallaron` : null
      }));
      queryClient.invalidateQueries({ queryKey: ['cosmic-tasks'] });
    },
    onError: (error) => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        syncProgress: 0,
        error: `Error sincronizando: ${error.message}`
      }));
    }
  });

  // 🌟 Actualizar estado general
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isConnected
    }));
  }, [isConnected]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      tasks
    }));
  }, [tasks]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      isLoading: isLoadingTasks || syncMutation.isPending
    }));
  }, [isLoadingTasks, syncMutation.isPending]);

  useEffect(() => {
    if (tasksError?.message && tasksError.message !== state.error) {
      setState(prev => ({
        ...prev,
        error: tasksError.message
      }));
    }
  }, [tasksError?.message, state.error]);

  // 🌟 Funciones públicas del hook
  const createCosmicTask = useCallback(
    (task: Omit<CosmicTask, 'id' | 'createdAt'>) => {
      return createTaskMutation.mutateAsync(task);
    },
    [createTaskMutation]
  );

  const moveTask = useCallback(
    (taskId: string, newStatus: ColumnStatus) => {
      return updateStatusMutation.mutateAsync({ taskId, status: newStatus });
    },
    [updateStatusMutation]
  );

  const syncWithMiro = useCallback(() => {
    return syncMutation.mutateAsync();
  }, [syncMutation]);

  const refreshTasks = useCallback(() => {
    return refetchTasks();
  }, [refetchTasks]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 🌟 Funciones utilitarias
  const getTasksByElement = useCallback(
    (element: ThematicElement) => {
      return tasks.filter(task => task.element === element);
    },
    [tasks]
  );

  const getTasksByGuardian = useCallback(
    (guardian: GuardianRole) => {
      return tasks.filter(task => task.guardian === guardian);
    },
    [tasks]
  );

  const getTasksByStatus = useCallback(
    (status: ColumnStatus) => {
      return tasks.filter(task => task.status === status);
    },
    [tasks]
  );

  const getElementConfig = useCallback(
    (element: ThematicElement) => {
      return COSMIC_CONFIG.elements[element];
    },
    []
  );

  const getHambrEConfig = useCallback(
    (level: HambrELevel) => {
      return COSMIC_CONFIG.hambreDescriptions[level];
    },
    []
  );

  // 🌟 Métricas cósmicas
  const metrics = useCallback(() => {
    const totalTasks = tasks.length;
    const completedTasks = getTasksByStatus(ColumnStatus.MANIFESTED).length;
    const inProgressTasks = getTasksByStatus(ColumnStatus.ALCHEMICAL).length;
    const inReviewTasks = getTasksByStatus(ColumnStatus.QUALITY).length;
    const backlogTasks = getTasksByStatus(ColumnStatus.BACKLOG).length;

    const elementDistribution = Object.values(ThematicElement).map(element => ({
      element,
      count: getTasksByElement(element).length,
      percentage: totalTasks > 0 ? (getTasksByElement(element).length / totalTasks) * 100 : 0
    }));

    const guardianLoad = Object.values(GuardianRole).map(guardian => ({
      guardian,
      activeTasks: getTasksByGuardian(guardian).filter(t =>
        t.status !== ColumnStatus.MANIFESTED
      ).length,
      completedTasks: getTasksByGuardian(guardian).filter(t =>
        t.status === ColumnStatus.MANIFESTED
      ).length
    }));

    const hambrEDistribution = [1, 2, 3].map(level => ({
      level: level as HambrELevel,
      count: tasks.filter(t => t.hambreLevel === level).length,
      percentage: totalTasks > 0 ? (tasks.filter(t => t.hambreLevel === level).length / totalTasks) * 100 : 0
    }));

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      inReviewTasks,
      backlogTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      elementDistribution,
      guardianLoad,
      hambrEDistribution
    };
  }, [tasks, getTasksByStatus, getTasksByElement, getTasksByGuardian]);

  return {
    // 🌟 Estado
    ...state,
    config: COSMIC_CONFIG,
    metrics: metrics(),
    miroStatus: cosmicService.getMiroStatus(),

    // 🌟 Acciones
    createCosmicTask,
    moveTask,
    syncWithMiro,
    refreshTasks,
    clearError,

    // 🌟 Consultas
    getTasksByElement,
    getTasksByGuardian,
    getTasksByStatus,
    getElementConfig,
    getHambrEConfig,

    // 🌟 Estados de loading
    isCreating: createTaskMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isSyncing: syncMutation.isPending
  };
};

// 🌟 Re-exportaciones para compatibilidad hacia atrás
export type {
  CosmicTask
} from '../types/cosmic.types';

export {
  ThematicElement,
  GuardianRole,
  HambrELevel,
  ColumnStatus
} from '../types/cosmic.types';
