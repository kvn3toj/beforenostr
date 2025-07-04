import { useState, useCallback, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiService } from '../lib/api-service';
import { UserChallengeProgress, ChallengeTask } from '../types/challenges';

interface UseChallengeProgressProps {
  challengeId: string;
  userId: string;
  initialProgress?: UserChallengeProgress;
}

interface TaskProgress {
  taskId: string;
  completed: boolean;
  completedAt?: string;
  metadata?: Record<string, any>;
}

interface ProgressUpdate {
  progress: number;
  currentStep?: string;
  tasksCompleted: number;
  totalTasks: number;
  completedTasks: TaskProgress[];
  metadata?: Record<string, any>;
}

export const useChallengeProgress = ({
  challengeId,
  userId,
  initialProgress,
}: UseChallengeProgressProps) => {
  const queryClient = useQueryClient();

  // Estado local para el progreso
  const [localProgress, setLocalProgress] = useState<UserChallengeProgress>(
    initialProgress || {
      id: '',
      userId,
      challengeId,
      status: 'ACTIVE',
      progress: 0,
      startedAt: new Date().toISOString(),
      tasksCompleted: 0,
      totalTasks: 0,
      metadata: {},
    }
  );

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState<string>(
    initialProgress?.currentStep || ''
  );

  // Sincronizar con el progreso inicial cuando cambie
  useEffect(() => {
    if (initialProgress) {
      setLocalProgress(initialProgress);
      setCurrentStep(initialProgress.currentStep || '');

      // Extraer tareas completadas del metadata
      const completed = initialProgress.metadata?.completedTasks || [];
      setCompletedTasks(new Set(completed.map((task: any) => task.taskId)));
    }
  }, [initialProgress]);

  // Mutación para actualizar progreso en el backend
  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: Partial<UserChallengeProgress>) => {
      const response = await apiService.put(
        `/challenges/${challengeId}/progress`,
        progressData
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Actualizar cache de React Query
      queryClient.invalidateQueries({
        queryKey: ['user-challenges', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['challenge', challengeId],
      });

      console.log('✅ Progreso actualizado exitosamente:', data);
    },
    onError: (error) => {
      console.error('❌ Error actualizando progreso:', error);
      toast.error('Error al guardar el progreso');

      // Revertir cambios locales en caso de error
      if (initialProgress) {
        setLocalProgress(initialProgress);
        const completed = initialProgress.metadata?.completedTasks || [];
        setCompletedTasks(new Set(completed.map((task: any) => task.taskId)));
      }
    },
  });

  // ✅ FUNCIONES BÁSICAS SIN DEPENDENCIAS (PRIMER NIVEL)
  const getProgressStats = useCallback(() => {
    const isCompleted = localProgress.status === 'COMPLETED';
    const isActive = localProgress.status === 'ACTIVE';
    const progressPercentage = localProgress.progress || 0;
    const tasksRemaining =
      (localProgress.totalTasks || 0) - (localProgress.tasksCompleted || 0);

    return {
      isCompleted,
      isActive,
      progressPercentage,
      tasksCompleted: localProgress.tasksCompleted || 0,
      totalTasks: localProgress.totalTasks || 0,
      tasksRemaining,
      currentStep: localProgress.currentStep || 'Sin paso actual',
      startedAt: localProgress.startedAt,
      completedAt: localProgress.completedAt,
      timeSpent: localProgress.completedAt
        ? new Date(localProgress.completedAt).getTime() -
          new Date(localProgress.startedAt).getTime()
        : Date.now() - new Date(localProgress.startedAt).getTime(),
    };
  }, [localProgress]);

  // ✅ FUNCIONES QUE DEPENDEN DE updateProgressMutation (SEGUNDO NIVEL)
  const abandonChallenge = useCallback(() => {
    const abandonedProgress: UserChallengeProgress = {
      ...localProgress,
      status: 'ABANDONED',
      currentStep: 'Desafío abandonado',
      metadata: {
        ...localProgress.metadata,
        abandonedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    };

    setLocalProgress(abandonedProgress);
    updateProgressMutation.mutate(abandonedProgress);
    toast.info('Has abandonado el desafío');
  }, [localProgress, updateProgressMutation]);

  const resetProgress = useCallback(() => {
    const resetProgress: UserChallengeProgress = {
      ...localProgress,
      progress: 0,
      tasksCompleted: 0,
      currentStep: 'Desafío reiniciado',
      status: 'ACTIVE',
      completedAt: undefined,
      metadata: {
        completedTasks: [],
        lastUpdated: new Date().toISOString(),
        resetAt: new Date().toISOString(),
      },
    };

    setLocalProgress(resetProgress);
    setCompletedTasks(new Set());
    setCurrentStep('Desafío reiniciado');

    updateProgressMutation.mutate(resetProgress);
    toast.info('Progreso del desafío reiniciado');
  }, [localProgress, updateProgressMutation]);

  const updateCurrentStep = useCallback(
    (step: string) => {
      setCurrentStep(step);
      const updatedProgress = {
        ...localProgress,
        currentStep: step,
        metadata: {
          ...localProgress.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };
      setLocalProgress(updatedProgress);
      updateProgressMutation.mutate(updatedProgress);
    },
    [localProgress, updateProgressMutation]
  );

  // ✅ FUNCIONES QUE DEPENDEN DE updateProgressMutation (TERCER NIVEL)
  const updateProgress = useCallback(
    (progressData: Partial<ProgressUpdate>) => {
      const updatedProgress: UserChallengeProgress = {
        ...localProgress,
        progress: progressData.progress ?? localProgress.progress,
        currentStep: progressData.currentStep ?? localProgress.currentStep,
        tasksCompleted:
          progressData.tasksCompleted ?? localProgress.tasksCompleted,
        totalTasks: progressData.totalTasks ?? localProgress.totalTasks,
        metadata: {
          ...localProgress.metadata,
          ...progressData.metadata,
          lastUpdated: new Date().toISOString(),
        },
      };

      // Actualizar tareas completadas si se proporciona
      if (progressData.completedTasks) {
        const completedTaskIds = progressData.completedTasks
          .filter((task) => task.completed)
          .map((task) => task.taskId);
        setCompletedTasks(new Set(completedTaskIds));

        updatedProgress.metadata.completedTasks = progressData.completedTasks;
      }

      setLocalProgress(updatedProgress);
      if (progressData.currentStep) {
        setCurrentStep(progressData.currentStep);
      }

      // Sincronizar con el backend
      updateProgressMutation.mutate(updatedProgress);
    },
    [localProgress, updateProgressMutation]
  );

  // ✅ FUNCIÓN PRINCIPAL QUE DEPENDE DE updateProgressMutation (CUARTO NIVEL)
  const toggleTask = useCallback(
    (taskId: string, taskTitle?: string) => {
      const isCurrentlyCompleted = completedTasks.has(taskId);
      const newCompletedTasks = new Set(completedTasks);

      if (isCurrentlyCompleted) {
        newCompletedTasks.delete(taskId);
      } else {
        newCompletedTasks.add(taskId);
      }

      setCompletedTasks(newCompletedTasks);

      // Calcular nuevo progreso
      const tasksCompleted = newCompletedTasks.size;
      const progress = localProgress.totalTasks
        ? Math.round((tasksCompleted / localProgress.totalTasks) * 100)
        : 0;

      // Actualizar step actual si se completó una nueva tarea
      if (!isCurrentlyCompleted && taskTitle) {
        setCurrentStep(`Completada: ${taskTitle}`);
      }

      // Crear objeto de progreso actualizado
      const updatedProgress: UserChallengeProgress = {
        ...localProgress,
        progress,
        tasksCompleted,
        currentStep:
          !isCurrentlyCompleted && taskTitle
            ? `Completada: ${taskTitle}`
            : currentStep,
        metadata: {
          ...localProgress.metadata,
          completedTasks: Array.from(newCompletedTasks).map((id) => ({
            taskId: id,
            completed: true,
            completedAt: new Date().toISOString(),
          })),
          lastUpdated: new Date().toISOString(),
        },
      };

      // Verificar si el desafío se completó
      if (progress === 100 && localProgress.status !== 'COMPLETED') {
        updatedProgress.status = 'COMPLETED';
        updatedProgress.completedAt = new Date().toISOString();
        updatedProgress.currentStep = 'Desafío completado';

        toast.success('¡Felicitaciones!', {
          description: 'Has completado el desafío exitosamente.',
          duration: 5000,
        });
      }

      setLocalProgress(updatedProgress);

      // Sincronizar con el backend
      updateProgressMutation.mutate(updatedProgress);

      // Mostrar feedback inmediato
      if (!isCurrentlyCompleted) {
        toast.success(`Tarea completada: ${taskTitle || 'Sin título'}`);
      } else {
        toast.info(`Tarea desmarcada: ${taskTitle || 'Sin título'}`);
      }
    },
    [completedTasks, localProgress, currentStep, updateProgressMutation]
  );

  return {
    // Estado
    progress: localProgress,
    completedTasks,
    currentStep,
    isLoading: updateProgressMutation.isPending,

    // Acciones
    toggleTask,
    updateCurrentStep,
    updateProgress,
    resetProgress,
    abandonChallenge,

    // Utilidades
    getProgressStats,

    // Verificaciones
    isTaskCompleted: (taskId: string) => completedTasks.has(taskId),
    canComplete: localProgress.progress === 100,
  };
};
