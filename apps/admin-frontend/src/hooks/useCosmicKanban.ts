import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  cosmicKanbanService,
  CosmicTask,
  CreateCosmicTaskDto,
  UpdateCosmicTaskDto,
  CosmicTaskFilter,
  CosmicKanbanStats
} from '../services/cosmic-kanban.service';

// =====================================================
// QUERY KEYS
// =====================================================

const COSMIC_KANBAN_KEYS = {
  all: ['cosmic-kanban'] as const,
  tasks: () => [...COSMIC_KANBAN_KEYS.all, 'tasks'] as const,
  tasksWithFilter: (filters?: CosmicTaskFilter) => [...COSMIC_KANBAN_KEYS.tasks(), filters] as const,
  task: (id: string) => [...COSMIC_KANBAN_KEYS.all, 'task', id] as const,
  stats: () => [...COSMIC_KANBAN_KEYS.all, 'stats'] as const,
};

// =====================================================
// HOOKS
// =====================================================

/**
 * 🌌 Hook para obtener todas las tareas cósmicas
 */
export const useCosmicTasks = (filters?: CosmicTaskFilter) => {
  return useQuery({
    queryKey: COSMIC_KANBAN_KEYS.tasksWithFilter(filters),
    queryFn: () => cosmicKanbanService.getAllTasks(filters),
    staleTime: 30000, // Cache por 30 segundos
    refetchOnWindowFocus: false,
  });
};

/**
 * 🌟 Hook para obtener una tarea específica
 */
export const useCosmicTask = (id: string) => {
  return useQuery({
    queryKey: COSMIC_KANBAN_KEYS.task(id),
    queryFn: () => cosmicKanbanService.getTaskById(id),
    enabled: !!id,
    staleTime: 60000, // Cache por 1 minuto
  });
};

/**
 * 📊 Hook para obtener estadísticas del kanban
 */
export const useCosmicKanbanStats = () => {
  return useQuery({
    queryKey: COSMIC_KANBAN_KEYS.stats(),
    queryFn: () => cosmicKanbanService.getStats(),
    staleTime: 60000, // Cache por 1 minuto
    refetchOnWindowFocus: false,
  });
};

/**
 * ✨ Hook para crear nueva tarea cósmica
 */
export const useCreateCosmicTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskDto: CreateCosmicTaskDto) => cosmicKanbanService.createTask(taskDto),
    onSuccess: (newTask) => {
      // Invalidar todas las queries relacionadas con tareas
      queryClient.invalidateQueries({ queryKey: COSMIC_KANBAN_KEYS.tasks() });
      queryClient.invalidateQueries({ queryKey: COSMIC_KANBAN_KEYS.stats() });

      toast.success('🌟 Tarea cósmica creada exitosamente', {
        description: `"${newTask.title}" ha sido manifestada en el Portal Kanban Cósmico`
      });
    },
    onError: (error: any) => {
      toast.error('❌ Error al crear tarea cósmica', {
        description: error?.message || 'No se pudo manifestar la tarea en el cosmos'
      });
    },
  });
};

/**
 * 🔄 Hook para actualizar tarea existente
 */
export const useUpdateCosmicTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateDto }: { id: string; updateDto: UpdateCosmicTaskDto }) =>
      cosmicKanbanService.updateTask(id, updateDto),
    onSuccess: (updatedTask) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ queryKey: COSMIC_KANBAN_KEYS.tasks() });
      queryClient.invalidateQueries({ queryKey: COSMIC_KANBAN_KEYS.task(updatedTask.id) });
      queryClient.invalidateQueries({ queryKey: COSMIC_KANBAN_KEYS.stats() });

      toast.success('✨ Tarea cósmica actualizada', {
        description: `"${updatedTask.title}" ha sido transformada exitosamente`
      });
    },
    onError: (error: any) => {
      toast.error('❌ Error al actualizar tarea', {
        description: error?.message || 'No se pudo aplicar la transmutación cósmica'
      });
    },
  });
};

/**
 * 🗑️ Hook para eliminar tarea cósmica
 */
export const useDeleteCosmicTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cosmicKanbanService.deleteTask(id),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ queryKey: COSMIC_KANBAN_KEYS.tasks() });
      queryClient.invalidateQueries({ queryKey: COSMIC_KANBAN_KEYS.stats() });

      toast.success('🔥 Tarea cósmica eliminada', {
        description: 'La tarea ha sido transmutada de vuelta al cosmos'
      });
    },
    onError: (error: any) => {
      toast.error('❌ Error al eliminar tarea', {
        description: error?.message || 'No se pudo realizar la transmutación cósmica'
      });
    },
  });
};

/**
 * 🌌 Hook compuesto que proporciona todas las funcionalidades del cosmic kanban
 */
export const useCosmicKanban = (filters?: CosmicTaskFilter) => {
  const tasksQuery = useCosmicTasks(filters);
  const statsQuery = useCosmicKanbanStats();
  const createMutation = useCreateCosmicTask();
  const updateMutation = useUpdateCosmicTask();
  const deleteMutation = useDeleteCosmicTask();

  return {
    // Data
    tasks: tasksQuery.data || [],
    stats: statsQuery.data,

    // Loading states
    isLoadingTasks: tasksQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Error states
    tasksError: tasksQuery.error,
    statsError: statsQuery.error,

    // Actions
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,

    // Utilities
    refetchTasks: tasksQuery.refetch,
    refetchStats: statsQuery.refetch,

    // Combined loading state
    isLoading: tasksQuery.isLoading || statsQuery.isLoading,

    // Combined error state
    hasError: !!tasksQuery.error || !!statsQuery.error,
  };
};
