/**
 * 📄 Content Item Types - Tipos para elementos de contenido
 */

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'article' | 'playlist' | 'mundo';
  url?: string;
  thumbnail?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  category?: string;
  viewCount: number;
  likeCount: number;
}

export interface ContentItemCreateData {
  title: string;
  description?: string;
  type: 'video' | 'article' | 'playlist' | 'mundo';
  url?: string;
  thumbnail?: string;
  tags?: string[];
  category?: string;
}

export interface ContentItemUpdateData {
  title?: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  tags?: string[];
  category?: string;
} 