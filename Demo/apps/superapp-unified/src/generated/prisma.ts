// Tipos básicos de Prisma para el frontend
export interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  difficulty?: string;
  tags?: string[];
  videoTimestamp?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subtitle {
  id: string;
  videoId: string;
  language: string;
  content: string;
  format: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  duration?: number;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export interface Mundo {
  id: string;
  title: string;
  description?: string;
  content?: any;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
} 