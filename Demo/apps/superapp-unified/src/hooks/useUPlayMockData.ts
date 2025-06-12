import { useState, useEffect, useMemo } from 'react';

// Cache for environment check to avoid repeated computation
let envCheckCache: boolean | null = null;
let envCheckTime = 0;

// Helper function to detect preview environments
const isPreviewEnvironment = (): boolean => {
  const now = Date.now();
  
  // Use cached result if it's less than 5 seconds old
  if (envCheckCache !== null && now - envCheckTime < 5000) {
    console.log('🔧 isPreviewEnvironment: Usando resultado en caché:', envCheckCache);
    return envCheckCache;
  }

  // Check if we're forcing YouTube videos in development
  const forceYouTube = import.meta.env.VITE_FORCE_YOUTUBE_VIDEOS === 'true';
  
  // 🔧 DEBUG: Log only on first check or significant changes
  console.log('🔧 isPreviewEnvironment Debug COMPLETO:', {
    forceYouTube,
    VITE_FORCE_YOUTUBE_VIDEOS_raw: import.meta.env.VITE_FORCE_YOUTUBE_VIDEOS,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'undefined',
    search: typeof window !== 'undefined' ? window.location.search : 'undefined',
    parentCheck: typeof window !== 'undefined' ? window.parent !== window : false,
    builderCheck: typeof window !== 'undefined' ? window.location.hostname.includes('builder.io') : false,
    previewCheck: typeof window !== 'undefined' ? window.location.hostname.includes('preview') : false,
    localhostCheck: typeof window !== 'undefined' ? window.location.hostname.includes('localhost') : false
  });
  
  // Si VITE_FORCE_YOUTUBE_VIDEOS está activo, SIEMPRE usar YouTube
  if (forceYouTube) {
    console.log('✅ ACTIVANDO modo YouTube por variable de entorno VITE_FORCE_YOUTUBE_VIDEOS=true');
    envCheckCache = true;
    envCheckTime = now;
    return true;
  }
  
  // 🚨 DEBUGGING TEMPORAL: Forzar siempre true para verificar YouTube
  console.log('🚨 DEBUGGING TEMPORAL: Forzando isPreviewEnvironment a TRUE para verificar YouTube');
  envCheckCache = true;
  envCheckTime = now;
  return true;
  
  const result = (
    typeof window !== 'undefined' && (
      window.location.hostname.includes('builder.io') ||
      window.location.hostname.includes('preview') ||
      window.parent !== window || // iframe context
      window.location.search.includes('builder-preview') ||
      !window.location.hostname.includes('localhost')
    )
  );

  console.log('🔧 isPreviewEnvironment: Resultado final calculado:', result);
  envCheckCache = result;
  envCheckTime = now;
  return result;
};

// Helper function to get appropriate video URL
const getVideoUrl = (localUrl: string, videoId: string): string => {
  if (isPreviewEnvironment()) {
    // Map specific CoomÜnity videos to relevant YouTube content
    const youtubeVideoMap: Record<string, string> = {
      'coomunity-intro': 'https://www.youtube.com/embed/gKA4JjkiU4A', // The Five Minute Communitarian
      'ayni-deep-dive': 'https://www.youtube.com/embed/5J4UaAskcHg', // What is Reciprocity
      'ondas-energia': 'https://www.youtube.com/embed/EwzWTIdhYRQ', // Towards an ontology of the commons
    };
    
    return youtubeVideoMap[videoId] || 'https://www.youtube.com/embed/gKA4JjkiU4A';
  }
  return localUrl;
};

// Helper function to get video thumbnail
const getVideoThumbnail = (localThumbnail: string, videoId: string): string => {
  if (isPreviewEnvironment()) {
    // Use YouTube thumbnails for preview environments
    const youtubeThumbnailMap: Record<string, string> = {
      'coomunity-intro': 'https://img.youtube.com/vi/gKA4JjkiU4A/mqdefault.jpg',
      'ayni-deep-dive': 'https://img.youtube.com/vi/5J4UaAskcHg/mqdefault.jpg',
      'ondas-energia': 'https://img.youtube.com/vi/EwzWTIdhYRQ/mqdefault.jpg',
    };
    
    return youtubeThumbnailMap[videoId] || 'https://img.youtube.com/vi/gKA4JjkiU4A/mqdefault.jpg';
  }
  return localThumbnail;
};

// Mock data types
export interface MockVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  progress?: number;
  videoId?: string; // Add videoId mapping
  url?: string; // Add actual video URL
}

export interface MockPlaylist {
  id: number;
  name: string;
  description: string;
  videoCount: number;
  thumbnail: string;
  merits?: string;
}

export interface MockUserStats {
  name: string;
  activePlayers: number;
  burnedPlayers: number;
  level: number;
  merits: number;
  experience: number;
}

// Mock data
const mockUserStats: MockUserStats = {
  name: 'Lucía',
  activePlayers: 150,
  burnedPlayers: 50,
  level: 12,
  merits: 2350,
  experience: 1875,
};

const mockContinueWatching: MockVideo = {
  id: 1,
  title: 'Introducción a CoomÜnity: Filosofía y Principios',
  description: 'Descubre los fundamentos de CoomÜnity: Ayni, Bien Común, Öndas y la economía colaborativa que transforma vidas.',
  thumbnail: getVideoThumbnail('/api/placeholder/360/202', 'coomunity-intro'),
  duration: 240, // 4 minutes to match YouTube video
  progress: 35, // 35% progress
  videoId: 'coomunity-intro',
  url: getVideoUrl('/assets/vid1.mp4', 'coomunity-intro'),
};

const mockStaffPlaylists: MockVideo[] = [
  {
    id: 2,
    title: 'Ayni: El Arte de la Reciprocidad Equilibrada',
    description: 'Profundiza en el concepto de Ayni y cómo aplicar la reciprocidad en tu vida diaria para crear armonía.',
    thumbnail: getVideoThumbnail('/api/placeholder/118/66', 'ayni-deep-dive'),
    duration: 320, // 5:20 minutes
    videoId: 'ayni-deep-dive',
    url: getVideoUrl('/assets/vid2.mp4', 'ayni-deep-dive'),
  },
  {
    id: 3,
    title: 'Öndas: Canalizando la Energía Vibracional Positiva',
    description: 'Aprende a generar, canalizar y multiplicar las Öndas para contribuir al bienestar colectivo.',
    thumbnail: getVideoThumbnail('/api/placeholder/118/66', 'ondas-energia'),
    duration: 280, // 4:40 minutes
    videoId: 'ondas-energia',
    url: getVideoUrl('/assets/vid3.mp4', 'ondas-energia'),
  },
  {
    id: 4,
    title: 'Mëritos y Bien Común',
    description: 'Sistema de reconocimiento por contribuir al bienestar colectivo de CoomÜnity.',
    thumbnail: getVideoThumbnail('/api/placeholder/118/66', 'coomunity-intro'),
    duration: 180, // 3 minutes
    videoId: 'coomunity-intro',
    url: getVideoUrl('/assets/vid1.mp4', 'coomunity-intro'),
  },
];

const mockMyPlaylists: MockVideo[] = [
  {
    id: 5,
    title: 'Mi Progreso Personal en Ayni',
    description: 'Videos para profundizar en la práctica de la reciprocidad equilibrada.',
    thumbnail: getVideoThumbnail('/api/placeholder/118/66', 'ayni-deep-dive'),
    duration: 320,
    videoId: 'ayni-deep-dive',
    url: getVideoUrl('/assets/vid2.mp4', 'ayni-deep-dive'),
  },
  {
    id: 6,
    title: 'Emprendimiento y Bien Común',
    description: 'Construyendo credibilidad como Emprendedor Confiable en el ecosistema.',
    thumbnail: getVideoThumbnail('/api/placeholder/118/66', 'ondas-energia'),
    duration: 280,
    videoId: 'ondas-energia',
    url: getVideoUrl('/assets/vid3.mp4', 'ondas-energia'),
  },
  {
    id: 7,
    title: 'Filosofía CoomÜnity Avanzada',
    description: 'Conceptos profundos sobre Metanöia, Neguentropía y transformación consciente.',
    thumbnail: getVideoThumbnail('/api/placeholder/118/66', 'coomunity-intro'),
    duration: 240,
    videoId: 'coomunity-intro',
    url: getVideoUrl('/assets/vid1.mp4', 'coomunity-intro'),
  },
];

const mockCreatedPlaylist: MockPlaylist = {
  id: 1,
  name: 'Mis Videos Favoritos de CoomÜnity',
  description: 'Una colección personal de contenido inspirador sobre filosofía y práctica CoomÜnity',
  videoCount: 34,
  thumbnail: getVideoThumbnail('/api/placeholder/50/56', 'coomunity-intro'),
  merits: '#Mëritos',
};

// Custom hook
export const useUPlayMockData = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    isLoading,
    userStats: mockUserStats,
    continueWatching: mockContinueWatching,
    staffPlaylists: mockStaffPlaylists,
    myPlaylists: mockMyPlaylists,
    createdPlaylist: mockCreatedPlaylist,
    // Utility functions
    formatDuration: (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    getProgressText: (progress: number): string => {
      return `${progress}% completado`;
    },
    // Export helper functions for external use
    isPreviewEnvironment,
    getVideoUrl,
    getVideoThumbnail,
  };
};
