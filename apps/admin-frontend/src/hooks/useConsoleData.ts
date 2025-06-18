/**
 * 🎮 Console Data Hooks - React Query Integration
 * 
 * Hooks personalizados para gestionar datos de la Consola con React Query
 * Incluye cache, error handling, loading states y refetch automático
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  consoleApiService,
  DashboardMetrics,
  ConsoleOverview,
  ConsoleNotification,
  Stage,
  StageAnalytics,
  Contest,
  ContestAnalytics,
  LeaderboardEntry,
  TrustVotingSystem,
  TrustVotingAnalytics,
  GPLContent,
  GPLContentAnalytics,
  OctalysisConfig,
  OctalysisAnalytics,
  OctalysisElement
} from '../services/console-api.service';

// Query Keys para React Query
export const CONSOLE_QUERY_KEYS = {
  analytics: ['console', 'analytics'],
  overview: ['console', 'overview'],
  notifications: ['console', 'notifications'],
  stages: ['console', 'stages'],
  stage: (id: string) => ['console', 'stages', id],
  stageAnalytics: (id: string) => ['console', 'stages', id, 'analytics'],
  contests: ['console', 'contests'],
  contest: (id: string) => ['console', 'contests', id],
  contestLeaderboard: (id: string) => ['console', 'contests', id, 'leaderboard'],
  contestAnalytics: (id: string) => ['console', 'contests', id, 'analytics'],
  trustVoting: ['console', 'trust-voting'],
  trustVotingAnalytics: ['console', 'trust-voting', 'analytics'],
  gplContent: ['console', 'gpl-content'],
  gplContentItem: (id: string) => ['console', 'gpl-content', id],
  gplContentAnalytics: (id: string) => ['console', 'gpl-content', id, 'analytics'],
  octalysis: ['console', 'octalysis'],
  octalysisAnalytics: ['console', 'octalysis', 'analytics'],
} as const;

// Console Analytics & Overview Hooks
export const useConsoleAnalytics = (refetchInterval?: number) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.analytics,
    queryFn: () => consoleApiService.getConsoleAnalytics(),
    refetchInterval: refetchInterval || 30000, // 30 seconds default
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useConsoleOverview = (refetchInterval?: number) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.overview,
    queryFn: () => consoleApiService.getConsoleOverview(),
    refetchInterval: refetchInterval || 60000, // 1 minute default
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useConsoleNotifications = (refetchInterval?: number) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.notifications,
    queryFn: () => consoleApiService.getConsoleNotifications(),
    refetchInterval: refetchInterval || 15000, // 15 seconds default
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Stages Management Hooks
export const useStages = () => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.stages,
    queryFn: () => consoleApiService.getAllStages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStage = (stageId: string, enabled = true) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.stage(stageId),
    queryFn: () => consoleApiService.getStageById(stageId),
    enabled: enabled && !!stageId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStageAnalytics = (stageId: string, enabled = true) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.stageAnalytics(stageId),
    queryFn: () => consoleApiService.getStageAnalytics(stageId),
    enabled: enabled && !!stageId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ stageId, data }: { stageId: string; data: Partial<Stage> }) =>
      consoleApiService.updateStage(stageId, data),
    onSuccess: (updatedStage) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.stages });
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.stage(updatedStage.id) });
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.analytics });
    },
  });
};

// Contests Management Hooks
export const useContests = () => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.contests,
    queryFn: () => consoleApiService.getAllContests(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useContest = (contestId: string, enabled = true) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.contest(contestId),
    queryFn: () => consoleApiService.getContestById(contestId),
    enabled: enabled && !!contestId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useContestLeaderboard = (contestId: string, enabled = true, refetchInterval?: number) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.contestLeaderboard(contestId),
    queryFn: () => consoleApiService.getContestLeaderboard(contestId),
    enabled: enabled && !!contestId,
    refetchInterval: refetchInterval || 60000, // 1 minute for leaderboards
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useContestAnalytics = (contestId: string, enabled = true) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.contestAnalytics(contestId),
    queryFn: () => consoleApiService.getContestAnalytics(contestId),
    enabled: enabled && !!contestId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateContest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Contest>) => consoleApiService.createContest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.contests });
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.overview });
    },
  });
};

export const useUpdateContest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contestId, data }: { contestId: string; data: Partial<Contest> }) =>
      consoleApiService.updateContest(contestId, data),
    onSuccess: (updatedContest) => {
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.contests });
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.contest(updatedContest.id) });
    },
  });
};

// Trust Voting System Hooks
export const useTrustVotingSystem = () => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.trustVoting,
    queryFn: () => consoleApiService.getTrustVotingSystem(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTrustVotingAnalytics = (refetchInterval?: number) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.trustVotingAnalytics,
    queryFn: () => consoleApiService.getTrustVotingAnalytics(),
    refetchInterval: refetchInterval || 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateTrustVotingSystem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<TrustVotingSystem>) =>
      consoleApiService.updateTrustVotingSystem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.trustVoting });
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.analytics });
    },
  });
};

// GPL Content Management Hooks
export const useGPLContent = () => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.gplContent,
    queryFn: () => consoleApiService.getAllGPLContent(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGPLContentItem = (contentId: string, enabled = true) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.gplContentItem(contentId),
    queryFn: () => consoleApiService.getGPLContentById(contentId),
    enabled: enabled && !!contentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGPLContentAnalytics = (contentId: string, enabled = true) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.gplContentAnalytics(contentId),
    queryFn: () => consoleApiService.getGPLContentAnalytics(contentId),
    enabled: enabled && !!contentId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateGPLContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contentId, data }: { contentId: string; data: Partial<GPLContent> }) =>
      consoleApiService.updateGPLContent(contentId, data),
    onSuccess: (updatedContent) => {
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.gplContent });
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.gplContentItem(updatedContent.id) });
    },
  });
};

// Octalysis Framework Hooks
export const useOctalysisConfig = () => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.octalysis,
    queryFn: () => consoleApiService.getOctalysisConfig(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOctalysisAnalytics = (refetchInterval?: number) => {
  return useQuery({
    queryKey: CONSOLE_QUERY_KEYS.octalysisAnalytics,
    queryFn: () => consoleApiService.getOctalysisAnalytics(),
    refetchInterval: refetchInterval || 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateOctalysisElement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ elementId, element }: { elementId: string; element: Partial<OctalysisElement> }) =>
      consoleApiService.updateOctalysisElement(elementId, element),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.octalysis });
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.octalysisAnalytics });
    },
  });
};

// Combined Dashboard Hook
export const useDashboardData = (enableRealTime = true) => {
  const refetchInterval = enableRealTime ? 30000 : false; // 30 seconds if real-time enabled
  
  const analytics = useConsoleAnalytics(refetchInterval);
  const overview = useConsoleOverview(refetchInterval);
  const notifications = useConsoleNotifications(refetchInterval);
  const stages = useStages();
  const contests = useContests();
  const octalysisAnalytics = useOctalysisAnalytics(refetchInterval);
  
  return {
    analytics,
    overview,
    notifications,
    stages,
    contests,
    octalysisAnalytics,
    isLoading: analytics.isLoading || overview.isLoading || stages.isLoading,
    isError: analytics.isError || overview.isError || stages.isError,
    refetchAll: () => {
      analytics.refetch();
      overview.refetch();
      notifications.refetch();
      stages.refetch();
      contests.refetch();
      octalysisAnalytics.refetch();
    }
  };
};

// Error Recovery Hook
export const useConsoleErrorRecovery = () => {
  const queryClient = useQueryClient();
  
  const retryFailedQueries = () => {
    queryClient.invalidateQueries({ 
      predicate: (query) => query.state.status === 'error' 
    });
  };
  
  const clearAllCache = () => {
    queryClient.clear();
  };
  
  return {
    retryFailedQueries,
    clearAllCache
  };
};