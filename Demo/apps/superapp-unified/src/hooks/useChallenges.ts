import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api-service';

// 🎯 TIPOS PARA CHALLENGES
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  merits: number;
  requirements: Record<string, any>;
  metadata?: Record<string, any>;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  completedAt?: string;
  createdAt: string;
  challenge?: Challenge;
  progressData?: Record<string, any>;
}

export interface CreateChallengeData {
  title: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  merits: number;
  requirements: Record<string, any>;
  metadata?: Record<string, any>;
  startDate?: string;
  endDate?: string;
}

export interface ChallengeProgress {
  challengeId: string;
  progress: number;
  metadata?: Record<string, any>;
}

export interface ChallengeStats {
  totalChallenges: number;
  completedChallenges: number;
  inProgressChallenges: number;
  totalMeritsEarned: number;
  averageCompletion: number;
  categoriesProgress: Array<{
    category: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
  recentCompletions: Array<{
    id: string;
    title: string;
    completedAt: string;
    merits: number;
  }>;
}

// 🔧 SERVICIOS API
const challengesAPI = {
  // Obtener todos los challenges disponibles
  getChallenges: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    isActive?: boolean;
  }): Promise<{ challenges: Challenge[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const response = await apiService.get(`/challenges?${queryParams}`);
    return response as { challenges: Challenge[]; total: number };
  },

  // Obtener mis challenges
  getMyChallenges: async (): Promise<UserChallenge[]> => {
    const response = await apiService.get('/challenges/me');
    return response as UserChallenge[];
  },

  // Obtener challenge específico
  getChallenge: async (challengeId: string): Promise<Challenge> => {
    const response = await apiService.get(`/challenges/${challengeId}`);
    return response as Challenge;
  },

  // Obtener mi progreso en un challenge específico
  getMyChallengeProgress: async (challengeId: string): Promise<UserChallenge> => {
    const response = await apiService.get(`/challenges/${challengeId}/my-progress`);
    return response as UserChallenge;
  },

  // Crear nuevo challenge (admin)
  createChallenge: async (data: CreateChallengeData): Promise<Challenge> => {
    const response = await apiService.post('/challenges', data);
    return response as Challenge;
  },

  // Unirse a un challenge
  joinChallenge: async (challengeId: string): Promise<UserChallenge> => {
    const response = await apiService.post(`/challenges/${challengeId}/join`);
    return response as UserChallenge;
  },

  // Actualizar progreso en challenge
  updateProgress: async (challengeId: string, progressData: ChallengeProgress): Promise<UserChallenge> => {
    const response = await apiService.put(`/challenges/${challengeId}/progress`, progressData);
    return response as UserChallenge;
  },

  // Completar challenge
  completeChallenge: async (challengeId: string): Promise<UserChallenge> => {
    const response = await apiService.post(`/challenges/${challengeId}/complete`);
    return response as UserChallenge;
  },

  // Obtener estadísticas de challenges
  getChallengeStats: async (): Promise<ChallengeStats> => {
    const response = await apiService.get('/challenges/stats');
    return response as ChallengeStats;
  },

  // Obtener leaderboard de challenges
  getLeaderboard: async (challengeId?: string): Promise<Array<{
    userId: string;
    userName: string;
    challengesCompleted: number;
    totalMerits: number;
    rank: number;
  }>> => {
    const url = challengeId ? `/challenges/${challengeId}/leaderboard` : '/challenges/leaderboard';
    const response = await apiService.get(url);
    return response as Array<{
      userId: string;
      userName: string;
      challengesCompleted: number;
      totalMerits: number;
      rank: number;
    }>;
  },

  // Abandonar challenge
  leaveChallenge: async (challengeId: string): Promise<{ message: string }> => {
    const response = await apiService.delete(`/challenges/${challengeId}/leave`);
    return response as { message: string };
  },
};

// 🪝 HOOK PRINCIPAL: useChallenges
export const useChallenges = (params?: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  isActive?: boolean;
}) => {
  const queryClient = useQueryClient();

  // Query para obtener challenges disponibles
  const {
    data: challengesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['challenges', params],
    queryFn: () => challengesAPI.getChallenges(params),
    staleTime: 300000, // 5 minutos
  });

  // Query para obtener mis challenges
  const {
    data: myChallenges,
    isLoading: isLoadingMyChallenges,
    error: myChallengesError,
    refetch: refetchMyChallenges
  } = useQuery({
    queryKey: ['challenges', 'my-challenges'],
    queryFn: challengesAPI.getMyChallenges,
    staleTime: 300000, // 5 minutos
  });

  // Query para estadísticas
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['challenges', 'stats'],
    queryFn: challengesAPI.getChallengeStats,
    staleTime: 600000, // 10 minutos
  });

  // Mutación para unirse a challenge
  const joinChallengeMutation = useMutation({
    mutationFn: challengesAPI.joinChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'my-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'stats'] });
    },
  });

  // Mutación para actualizar progreso
  const updateProgressMutation = useMutation({
    mutationFn: ({ challengeId, progressData }: { challengeId: string; progressData: ChallengeProgress }) =>
      challengesAPI.updateProgress(challengeId, progressData),
    onSuccess: (data, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'my-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', challengeId, 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'stats'] });
    },
  });

  // Mutación para completar challenge
  const completeChallengeMutation = useMutation({
    mutationFn: challengesAPI.completeChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'my-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'stats'] });
    },
  });

  // Mutación para abandonar challenge
  const leaveChallengeMutation = useMutation({
    mutationFn: challengesAPI.leaveChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'my-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'stats'] });
    },
  });

  return {
    // Datos
    challenges: challengesData?.challenges || [],
    totalChallenges: challengesData?.total || 0,
    myChallenges: myChallenges || [],
    stats,

    // Estados de carga
    isLoading,
    isLoadingMyChallenges,
    isLoadingStats,

    // Errores
    error,
    myChallengesError,
    statsError,

    // Acciones
    joinChallenge: joinChallengeMutation.mutate,
    updateProgress: ({ challengeId, progressData }: { challengeId: string; progressData: ChallengeProgress }) =>
      updateProgressMutation.mutate({ challengeId, progressData }),
    completeChallenge: completeChallengeMutation.mutate,
    leaveChallenge: leaveChallengeMutation.mutate,
    refetch,
    refetchMyChallenges,
    refetchStats,

    // Estados de mutaciones
    isJoining: joinChallengeMutation.isPending,
    isUpdatingProgress: updateProgressMutation.isPending,
    isCompleting: completeChallengeMutation.isPending,
    isLeaving: leaveChallengeMutation.isPending,

    // Errores de mutaciones
    joinError: joinChallengeMutation.error,
    updateProgressError: updateProgressMutation.error,
    completeError: completeChallengeMutation.error,
    leaveError: leaveChallengeMutation.error,
  };
};

// 🪝 HOOK ESPECÍFICO: useChallenge (para un challenge específico)
export const useChallenge = (challengeId: string | null) => {
  const {
    data: challenge,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['challenges', challengeId],
    queryFn: () => challengesAPI.getChallenge(challengeId!),
    enabled: !!challengeId,
    staleTime: 300000, // 5 minutos
  });

  // Query para mi progreso en este challenge
  const {
    data: myProgress,
    isLoading: isLoadingProgress,
    error: progressError,
    refetch: refetchProgress
  } = useQuery({
    queryKey: ['challenges', challengeId, 'progress'],
    queryFn: () => challengesAPI.getMyChallengeProgress(challengeId!),
    enabled: !!challengeId,
    staleTime: 300000, // 5 minutos
  });

  return {
    challenge,
    myProgress,
    isLoading,
    isLoadingProgress,
    error,
    progressError,
    refetch,
    refetchProgress,
  };
};

// 🪝 HOOK ESPECÍFICO: useChallengeLeaderboard
export const useChallengeLeaderboard = (challengeId?: string) => {
  const {
    data: leaderboard,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['challenges', 'leaderboard', challengeId],
    queryFn: () => challengesAPI.getLeaderboard(challengeId),
    staleTime: 300000, // 5 minutos
  });

  return {
    leaderboard: leaderboard || [],
    isLoading,
    error,
    refetch,
  };
};

// 🪝 HOOK DE UTILIDAD: useChallengeActions
export const useChallengeActions = () => {
  const queryClient = useQueryClient();

  const joinChallenge = useMutation({
    mutationFn: challengesAPI.joinChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'my-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'stats'] });
    },
  });

  const updateProgress = useMutation({
    mutationFn: ({ challengeId, progressData }: { challengeId: string; progressData: ChallengeProgress }) =>
      challengesAPI.updateProgress(challengeId, progressData),
    onSuccess: (data, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'my-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', challengeId, 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'stats'] });
    },
  });

  const completeChallenge = useMutation({
    mutationFn: challengesAPI.completeChallenge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'my-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenges', 'stats'] });
    },
  });

  return {
    joinChallenge: joinChallenge.mutate,
    updateProgress: ({ challengeId, progressData }: { challengeId: string; progressData: ChallengeProgress }) =>
      updateProgress.mutate({ challengeId, progressData }),
    completeChallenge: completeChallenge.mutate,

    isJoining: joinChallenge.isPending,
    isUpdatingProgress: updateProgress.isPending,
    isCompleting: completeChallenge.isPending,

    joinError: joinChallenge.error,
    updateProgressError: updateProgress.error,
    completeError: completeChallenge.error,
  };
};