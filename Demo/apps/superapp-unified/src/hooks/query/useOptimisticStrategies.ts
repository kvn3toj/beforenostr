import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// ⚡ ESTRATEGIAS DE OPTIMISTIC UPDATES
// Hooks especializados para updates optimistas sin dependencias circulares

/**
 * Hook para optimistic updates de interacciones sociales
 */
export const useSocialOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const optimisticLike = useCallback(async (
    postId: string, 
    userId: string, 
    isLiked: boolean
  ) => {
    const queryKey = ['posts', postId, 'likes'];
    
    // Cancelar queries en progreso
    await queryClient.cancelQueries({ queryKey });
    
    // Snapshot del estado anterior
    const previousLikes = queryClient.getQueryData(queryKey);
    
    // Optimistic update
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return { likes: isLiked ? 1 : 0, userLiked: isLiked };
      
      return {
        ...old,
        likes: isLiked ? old.likes + 1 : Math.max(0, old.likes - 1),
        userLiked: isLiked,
      };
    });
    
    // También actualizar el post en la lista
    queryClient.setQueryData(['posts', 'list'], (old: any) => {
      if (!old?.data) return old;
      
      return {
        ...old,
        data: old.data.map((post: any) => 
          post.id === postId 
            ? { 
                ...post, 
                likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
                userLiked: isLiked 
              }
            : post
        ),
      };
    });
    
    return { previousLikes };
  }, [queryClient]);

  const optimisticComment = useCallback(async (
    postId: string,
    comment: { content: string; userId: string; userName: string }
  ) => {
    const queryKey = ['posts', postId, 'comments'];
    
    await queryClient.cancelQueries({ queryKey });
    const previousComments = queryClient.getQueryData(queryKey);
    
    // Crear comentario temporal
    const tempComment = {
      id: `temp-${Date.now()}`,
      ...comment,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old?.data) return { data: [tempComment] };
      
      return {
        ...old,
        data: [tempComment, ...old.data],
      };
    });
    
    return { previousComments, tempComment };
  }, [queryClient]);

  return {
    optimisticLike,
    optimisticComment,
  };
};

/**
 * Hook para optimistic updates de gamificación
 */
export const useGameOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const optimisticGameProgress = useCallback(async (
    userId: string,
    progressUpdate: { xp?: number; level?: number; achievements?: string[] }
  ) => {
    const queryKey = ['game', 'data', userId];
    
    await queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData(queryKey);
    
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return progressUpdate;
      
      return {
        ...old,
        xp: progressUpdate.xp ? old.xp + progressUpdate.xp : old.xp,
        level: progressUpdate.level || old.level,
        achievements: progressUpdate.achievements 
          ? [...(old.achievements || []), ...progressUpdate.achievements]
          : old.achievements,
        lastUpdated: Date.now(),
      };
    });
    
    return { previousData };
  }, [queryClient]);

  const optimisticAchievement = useCallback(async (
    userId: string,
    achievement: { id: string; name: string; description: string; points: number }
  ) => {
    const queryKey = ['user', userId, 'achievements'];
    
    await queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData(queryKey);
    
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old?.data) return { data: [achievement] };
      
      return {
        ...old,
        data: [achievement, ...old.data],
      };
    });
    
    return { previousData };
  }, [queryClient]);

  return {
    optimisticGameProgress,
    optimisticAchievement,
  };
};

/**
 * Hook para optimistic updates de wallet
 */
export const useWalletOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const optimisticWalletTransaction = useCallback(async (
    userId: string,
    transaction: { amount: number; type: 'income' | 'expense'; description: string }
  ) => {
    const queryKey = ['wallet', 'data', userId];
    
    await queryClient.cancelQueries({ queryKey });
    const previousData = queryClient.getQueryData(queryKey);
    
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return { balance: transaction.amount, transactions: [transaction] };
      
      const newBalance = transaction.type === 'income' 
        ? old.balance + transaction.amount
        : old.balance - transaction.amount;
      
      const tempTransaction = {
        id: `temp-${Date.now()}`,
        ...transaction,
        timestamp: Date.now(),
        isOptimistic: true,
      };
      
      return {
        ...old,
        balance: newBalance,
        transactions: [tempTransaction, ...(old.transactions || [])],
      };
    });
    
    return { previousData };
  }, [queryClient]);

  return {
    optimisticWalletTransaction,
  };
};

/**
 * Hook para rollback de optimistic updates
 */
export const useOptimisticRollback = () => {
  const queryClient = useQueryClient();

  const rollbackOptimisticUpdate = useCallback((
    queryKey: string[],
    previousData: any
  ) => {
    queryClient.setQueryData(queryKey, previousData);
  }, [queryClient]);

  const rollbackMultipleUpdates = useCallback((
    updates: Array<{ queryKey: string[]; previousData: any }>
  ) => {
    updates.forEach(({ queryKey, previousData }) => {
      queryClient.setQueryData(queryKey, previousData);
    });
  }, [queryClient]);

  return {
    rollbackOptimisticUpdate,
    rollbackMultipleUpdates,
  };
}; 