import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api-service';

// 🤝 TIPOS PARA SOCIAL
export interface Publication {
  id: string;
  userId: string;
  content: string;
  type: 'text' | 'video' | 'image' | 'link';
  metadata?: Record<string, any>;
  visibility: 'public' | 'friends' | 'private';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  likes?: Like[];
  comments?: Comment[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: string;
  userId: string;
  publicationId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  replies?: Comment[];
  likes?: Like[];
  _count?: {
    likes: number;
    replies: number;
  };
}

export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'publication' | 'comment';
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreatePublicationData {
  content: string;
  type: 'text' | 'video' | 'image' | 'link';
  metadata?: Record<string, any>;
  visibility?: 'public' | 'friends' | 'private';
}

export interface CreateCommentData {
  publicationId: string;
  content: string;
  parentId?: string;
}

export interface SocialStats {
  totalPublications: number;
  totalComments: number;
  totalLikes: number;
  myPublications: number;
  myComments: number;
  myLikes: number;
  engagementRate: number;
  topPublications: Array<{
    id: string;
    content: string;
    likes: number;
    comments: number;
    createdAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'publication' | 'comment' | 'like';
    description: string;
    timestamp: string;
    user?: {
      id: string;
      name: string;
    };
  }>;
}

// 🔧 SERVICIOS API
const socialAPI = {
  // PUBLICACIONES
  getPublications: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    visibility?: string;
    userId?: string;
  }): Promise<{ publications: Publication[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.visibility) queryParams.append('visibility', params.visibility);
    if (params?.userId) queryParams.append('userId', params.userId);

    const response = await apiService.get(`/social/publications?${queryParams}`);
    return response as { publications: Publication[]; total: number };
  },

  getPublication: async (publicationId: string): Promise<Publication> => {
    const response = await apiService.get(`/social/publications/${publicationId}`);
    return response as Publication;
  },

  createPublication: async (data: CreatePublicationData): Promise<Publication> => {
    const response = await apiService.post('/social/publications', data);
    return response as Publication;
  },

  updatePublication: async (publicationId: string, data: Partial<CreatePublicationData>): Promise<Publication> => {
    const response = await apiService.put(`/social/publications/${publicationId}`, data);
    return response as Publication;
  },

  deletePublication: async (publicationId: string): Promise<{ message: string }> => {
    const response = await apiService.delete(`/social/publications/${publicationId}`);
    return response as { message: string };
  },

  // COMENTARIOS
  getComments: async (publicationId: string): Promise<Comment[]> => {
    const response = await apiService.get(`/social/publications/${publicationId}/comments`);
    return response as Comment[];
  },

  createComment: async (data: CreateCommentData): Promise<Comment> => {
    const response = await apiService.post('/social/comments', data);
    return response as Comment;
  },

  updateComment: async (commentId: string, content: string): Promise<Comment> => {
    const response = await apiService.put(`/social/comments/${commentId}`, { content });
    return response as Comment;
  },

  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    const response = await apiService.delete(`/social/comments/${commentId}`);
    return response as { message: string };
  },

  // LIKES
  getLikes: async (targetId: string, targetType: 'publication' | 'comment'): Promise<Like[]> => {
    const response = await apiService.get(`/social/likes/${targetType}/${targetId}`);
    return response as Like[];
  },

  toggleLike: async (targetId: string, targetType: 'publication' | 'comment'): Promise<Like | { message: string }> => {
    const response = await apiService.post('/social/likes', { targetId, targetType });
    return response as Like | { message: string };
  },

  // ESTADÍSTICAS Y ACTIVIDAD
  getSocialStats: async (): Promise<SocialStats> => {
    const response = await apiService.get('/social/stats');
    return response as SocialStats;
  },

  getFeed: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{ publications: Publication[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);

    const response = await apiService.get(`/social/feed?${queryParams}`);
    return response as { publications: Publication[]; total: number };
  },

  // Obtener mis publicaciones
  getMyPublications: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{ publications: Publication[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);

    const response = await apiService.get(`/social/my-publications?${queryParams}`);
    return response as { publications: Publication[]; total: number };
  },
};

// 🪝 HOOK PRINCIPAL: useSocial
export const useSocial = () => {
  const queryClient = useQueryClient();

  // Query para feed principal
  const {
    data: feedData,
    isLoading: isLoadingFeed,
    error: feedError,
    refetch: refetchFeed
  } = useQuery({
    queryKey: ['social', 'feed'],
    queryFn: () => socialAPI.getFeed({ limit: 20 }),
    staleTime: 300000, // 5 minutos
  });

  // Query para mis publicaciones
  const {
    data: myPublicationsData,
    isLoading: isLoadingMyPublications,
    error: myPublicationsError,
    refetch: refetchMyPublications
  } = useQuery({
    queryKey: ['social', 'my-publications'],
    queryFn: () => socialAPI.getMyPublications({ limit: 20 }),
    staleTime: 300000, // 5 minutos
  });

  // Query para estadísticas sociales
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['social', 'stats'],
    queryFn: socialAPI.getSocialStats,
    staleTime: 600000, // 10 minutos
  });

  // Mutación para crear publicación
  const createPublicationMutation = useMutation({
    mutationFn: socialAPI.createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'my-publications'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'stats'] });
    },
  });

  // Mutación para toggle like
  const toggleLikeMutation = useMutation({
    mutationFn: ({ targetId, targetType }: { targetId: string; targetType: 'publication' | 'comment' }) =>
      socialAPI.toggleLike(targetId, targetType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'publications'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'comments'] });
    },
  });

  return {
    // Datos
    feed: feedData?.publications || [],
    totalFeedItems: feedData?.total || 0,
    myPublications: myPublicationsData?.publications || [],
    totalMyPublications: myPublicationsData?.total || 0,
    stats,

    // Estados de carga
    isLoadingFeed,
    isLoadingMyPublications,
    isLoadingStats,
    isLoading: isLoadingFeed || isLoadingMyPublications || isLoadingStats,

    // Errores
    feedError,
    myPublicationsError,
    statsError,

    // Acciones
    createPublication: createPublicationMutation.mutate,
    toggleLike: ({ targetId, targetType }: { targetId: string; targetType: 'publication' | 'comment' }) =>
      toggleLikeMutation.mutate({ targetId, targetType }),
    refetchFeed,
    refetchMyPublications,
    refetchStats,

    // Estados de mutaciones
    isCreatingPublication: createPublicationMutation.isPending,
    isTogglingLike: toggleLikeMutation.isPending,

    // Errores de mutaciones
    createPublicationError: createPublicationMutation.error,
    toggleLikeError: toggleLikeMutation.error,
  };
};

// 🪝 HOOK ESPECÍFICO: usePublication (para una publicación específica)
export const usePublication = (publicationId: string | null) => {
  const {
    data: publication,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['social', 'publications', publicationId],
    queryFn: () => socialAPI.getPublication(publicationId!),
    enabled: !!publicationId,
    staleTime: 300000, // 5 minutos
  });

  return {
    publication,
    isLoading,
    error,
    refetch,
  };
};

// 🪝 HOOK ESPECÍFICO: useComments (para comentarios de una publicación)
export const useComments = (publicationId: string | null) => {
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['social', 'comments', publicationId],
    queryFn: () => socialAPI.getComments(publicationId!),
    enabled: !!publicationId,
    staleTime: 300000, // 5 minutos
  });

  // Mutación para crear comentario
  const createCommentMutation = useMutation({
    mutationFn: socialAPI.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'comments', publicationId] });
      queryClient.invalidateQueries({ queryKey: ['social', 'publications', publicationId] });
      queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
    },
  });

  // Mutación para eliminar comentario
  const deleteCommentMutation = useMutation({
    mutationFn: socialAPI.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'comments', publicationId] });
      queryClient.invalidateQueries({ queryKey: ['social', 'publications', publicationId] });
      queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
    },
  });

  return {
    comments: comments || [],
    isLoading,
    error,
    createComment: createCommentMutation.mutate,
    deleteComment: deleteCommentMutation.mutate,
    refetch,

    isCreatingComment: createCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    createCommentError: createCommentMutation.error,
    deleteCommentError: deleteCommentMutation.error,
  };
};

// 🪝 HOOK ESPECÍFICO: useSocialActions
export const useSocialActions = () => {
  const queryClient = useQueryClient();

  const createPublication = useMutation({
    mutationFn: socialAPI.createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'my-publications'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'stats'] });
    },
  });

  const deletePublication = useMutation({
    mutationFn: socialAPI.deletePublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'my-publications'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'stats'] });
    },
  });

  const createComment = useMutation({
    mutationFn: socialAPI.createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['social', 'comments', data.publicationId] });
      queryClient.invalidateQueries({ queryKey: ['social', 'publications', data.publicationId] });
      queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
    },
  });

  const toggleLike = useMutation({
    mutationFn: ({ targetId, targetType }: { targetId: string; targetType: 'publication' | 'comment' }) =>
      socialAPI.toggleLike(targetId, targetType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'publications'] });
      queryClient.invalidateQueries({ queryKey: ['social', 'comments'] });
    },
  });

  return {
    createPublication: createPublication.mutate,
    deletePublication: deletePublication.mutate,
    createComment: createComment.mutate,
    toggleLike: ({ targetId, targetType }: { targetId: string; targetType: 'publication' | 'comment' }) =>
      toggleLike.mutate({ targetId, targetType }),

    isCreatingPublication: createPublication.isPending,
    isDeletingPublication: deletePublication.isPending,
    isCreatingComment: createComment.isPending,
    isTogglingLike: toggleLike.isPending,

    createPublicationError: createPublication.error,
    deletePublicationError: deletePublication.error,
    createCommentError: createComment.error,
    toggleLikeError: toggleLike.error,
  };
};

// 🪝 HOOK DE UTILIDAD: useSocialFeed
export const useSocialFeed = (filters?: {
  type?: string;
  limit?: number;
}) => {
  const {
    data: feedData,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['social', 'feed', filters],
    queryFn: ({ pageParam = 1 }) => socialAPI.getFeed({ 
      page: pageParam as number, 
      limit: filters?.limit || 10,
      type: filters?.type 
    }),
    staleTime: 300000, // 5 minutos
    getNextPageParam: (lastPage: { publications: Publication[]; total: number }, allPages: any[]) => {
      const totalPages = Math.ceil(lastPage.total / (filters?.limit || 10));
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return {
    feed: feedData?.pages.flatMap((page: { publications: Publication[]; total: number }) => page.publications) || [],
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};