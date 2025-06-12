// 🤝 Tipos para el módulo Social/Chat
export interface SocialMatch {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  userId: string;
  matchedAt: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'emoji' | 'audio';
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
}

export interface SocialNotification {
  id: string;
  type: 'new_match' | 'new_message' | 'status_update' | 'post_like' | 'post_comment';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  matchId?: string;
  postId?: string;
  senderId?: string;
}

export interface UserStatus {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
}

export interface ChatMetadata {
  matchId: string;
  totalMessages: number;
  unreadCount: number;
  lastActivity: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  }[];
}

// 📝 Tipos para Feed Social - ACTUALIZADO para coincidir con Backend NestJS
export interface SocialPost {
  id: string;
  userId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    email: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
  comments: PostComment[];
  
  // Propiedades derivadas/calculadas en el frontend
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  timestamp?: string;
  likesCount?: number;
  commentsCount?: number;
  isLikedByCurrentUser?: boolean;
  media?: string | null;
}

// 🔧 Funciones de utilidad para mapear datos del backend a formato UI

// Helper para mapear comentarios individuales
const mapBackendCommentToUIComment = (backendComment: any): PostComment => {
  return {
    id: backendComment.id,
    postId: backendComment.publicationId,
    authorId: backendComment.userId || backendComment.user?.id,
    authorName: backendComment.user?.name || 'Usuario',
    authorAvatar: backendComment.user?.avatarUrl || '/assets/images/avatars/default.jpg',
    content: backendComment.text || backendComment.content,
    timestamp: backendComment.createdAt,
    likes: [], // TODO: Implementar cuando el backend incluya los likes
    likesCount: backendComment._count?.likes || 0,
    isLikedByCurrentUser: false, // TODO: Calcular basado en datos del usuario actual
  };
};

export const mapBackendPostToUIPost = (backendPost: any): SocialPost => {
  return {
    ...backendPost,
    authorId: backendPost.user.id,
    authorName: backendPost.user.name,
    authorAvatar: backendPost.user.avatarUrl,
    timestamp: backendPost.createdAt,
    likesCount: backendPost._count.likes,
    commentsCount: backendPost._count.comments,
    isLikedByCurrentUser: false, // TODO: Calcular basado en datos del usuario actual
    media: null, // TODO: Implementar cuando el backend soporte media
    // Mapear comentarios anidados correctamente y filtrar valores null
    comments: Array.isArray(backendPost.comments) 
      ? backendPost.comments
          .map(mapBackendCommentToUIComment)
          .filter((comment: PostComment | null): comment is PostComment => comment !== null)
      : []
  };
};

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: string[]; // Array de user IDs que dieron like al comentario
  likesCount: number;
  isLikedByCurrentUser: boolean;
} 