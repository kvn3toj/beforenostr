/**
 * Interfaz para metadatos avanzados de video (Fase 4.2)
 */
export interface VideoMetadata {
  // Metadatos básicos
  title?: string;
  description?: string;
  duration?: number;
  
  // Metadatos avanzados
  thumbnailUrl?: string;
  language?: string;
  tags?: string[];
  categories?: string[];
  quality?: VideoQuality;
  
  // Información de la plataforma
  platform: string;
  externalId?: string;
  url?: string;
}

/**
 * Interfaz para información de calidad de video
 */
export interface VideoQuality {
  resolution?: string;        // ej. '1080p', '720p', '4K'
  aspectRatio?: string;       // ej. '16:9', '4:3'
  bitrate?: number;          // en kbps
  codec?: string;            // ej. 'h264', 'vp9'
  fps?: number;              // frames per second
  definition?: string;       // 'hd', 'sd', 'hq'
}

/**
 * Interfaz para metadatos específicos de YouTube
 */
export interface YouTubeMetadata extends VideoMetadata {
  channelId?: string;
  channelTitle?: string;
  publishedAt?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  defaultLanguage?: string;
  defaultAudioLanguage?: string;
}

/**
 * Interfaz para metadatos específicos de Vimeo
 */
export interface VimeoMetadata extends VideoMetadata {
  userId?: number;
  userName?: string;
  userUrl?: string;
  uploadDate?: string;
  stats?: {
    plays?: number;
    likes?: number;
    comments?: number;
  };
}

/**
 * Interfaz para metadatos de videos locales/subidos
 */
export interface LocalVideoMetadata extends VideoMetadata {
  fileSize?: number;         // en bytes
  fileName?: string;
  mimeType?: string;
  uploadedAt?: string;
  checksum?: string;
} 