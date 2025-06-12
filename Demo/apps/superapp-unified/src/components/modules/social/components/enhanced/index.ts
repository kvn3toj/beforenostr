// 🌐 Componentes mejorados del módulo Social con filosofía CoomÜnity
// Exportaciones centralizadas para una mejor organización y mantenimiento

export { SocialWelcomeHeader } from './SocialWelcomeHeader';
export { AyniSocialMetrics } from './AyniSocialMetrics';
export { CommunityFeed } from './CommunityFeed';
export { ConnectionsManager } from './ConnectionsManager';
export { SocialChatArea } from './SocialChatArea';
export { CollaborationHub } from './CollaborationHub';

// 🆕 Nuevos componentes para Grupos CoomÜnity con métricas Ayni
export { GroupsAyniMetrics } from './GroupsAyniMetrics';
export { GroupsCollaborationTools } from './GroupsCollaborationTools';

// Tipos compartidos entre componentes sociales
export interface SocialComponentProps {
  isLoading?: boolean;
  isConnected?: boolean;
  userLevel?: string;
  ayniBalance?: number;
}

export interface AyniConnection {
  id: string;
  name: string;
  avatar: string;
  type: 'mentor' | 'colaborador' | 'par' | 'aprendiz';
  ayniBalance: number;
  lastInteraction: string;
  mutualConnections: number;
  skills: string[];
  isOnline: boolean;
  trust: number; // 0-1
  collaborations: number;
}

export interface SocialPost {
  id: string;
  type: 'ayni' | 'sabiduria' | 'colaboracion' | 'celebracion';
  author: {
    name: string;
    avatar: string;
    level: string;
    badges: string[];
  };
  content: string;
  timestamp: string;
  meritos: number;
  interactions: {
    likes: number;
    ayniOffers: number;
    collaborations: number;
    shares: number;
  };
  tags: string[];
  bienComun?: boolean;
  attachments?: {
    type: 'image' | 'video' | 'document' | 'link';
    url: string;
    title?: string;
  }[];
}

export interface SocialMessage {
  id: string;
  type: 'text' | 'ayni_proposal' | 'celebration' | 'system';
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  ayniValue?: number;
  isRead: boolean;
  metadata?: {
    proposalType?: string;
    celebrationType?: string;
    systemAction?: string;
  };
}

export interface CollaborationCircle {
  id: string;
  name: string;
  category:
    | 'sostenibilidad'
    | 'educacion'
    | 'tecnologia'
    | 'salud'
    | 'negocios'
    | 'artes';
  description: string;
  members: number;
  maxMembers: number;
  icon: string;
  color: string;
  stats: {
    ayniExchanges: number;
    trustLevel: number; // 0-1
    growthRate: number; // Percentage
    activeProjects: number;
  };
  recentActivity: {
    type:
      | 'member_joined'
      | 'project_completed'
      | 'ayni_exchange'
      | 'milestone_reached';
    description: string;
    timestamp: string;
  }[];
  requirements?: {
    minimumLevel?: string;
    skillsRequired?: string[];
    inviteOnly?: boolean;
  };
  isJoined: boolean;
  canJoin: boolean;
}

export interface SocialMetrics {
  ayniBalance: number;
  socialLevel: string;
  elements: {
    comunicacion: number; // 0-1
    empatia: number; // 0-1
    confianza: number; // 0-1
    inspiracion: number; // 0-1
  };
  communityStatus: {
    activeMembers: number;
    onlineNow: number;
    todayExchanges: number;
    weeklyGrowth: number;
  };
  notifications: {
    category: 'connections' | 'messages' | 'collaborations' | 'achievements';
    count: number;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface AyniSuggestion {
  id: string;
  type: 'give' | 'receive' | 'collaborate';
  title: string;
  description: string;
  ayniValue: number;
  difficulty: 'facil' | 'intermedio' | 'avanzado';
  timeEstimate: string;
  category: string;
  matchScore: number; // 0-1 based on user skills/interests
}
