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

// 📝 Tipos para Feed Social
export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  type: 'text' | 'image' | 'video';
  timestamp: string;
  likes: string[]; // Array de user IDs que dieron like
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  media?: string | null; // URL del media si existe
}

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