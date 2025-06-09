import { useState, useEffect } from 'react';

// Mock data types
export interface MockVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  progress?: number;
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
  title: 'Introducción a CoomÜnity',
  description: 'Aprende los conceptos básicos de nuestra plataforma...',
  thumbnail: '/api/placeholder/360/202',
  duration: 1200, // 20 minutes
  progress: 35, // 35% progress
};

const mockStaffPlaylists: MockVideo[] = [
  {
    id: 2,
    title: 'Fundamentos de Ayni',
    description: 'Reciprocidad y balance en CoomÜnity...',
    thumbnail: '/api/placeholder/118/66',
    duration: 900,
  },
  {
    id: 3,
    title: 'Ganando Mëritos',
    description: 'Cómo contribuir al Bien Común...',
    thumbnail: '/api/placeholder/118/66',
    duration: 1080,
  },
  {
    id: 4,
    title: 'Öndas y Energía',
    description: 'Vibraciones positivas en la comunidad...',
    thumbnail: '/api/placeholder/118/66',
    duration: 720,
  },
];

const mockMyPlaylists: MockVideo[] = [
  {
    id: 5,
    title: 'Mi Progreso Personal',
    description: 'Videos marcados para revisar...',
    thumbnail: '/api/placeholder/118/66',
    duration: 1500,
  },
  {
    id: 6,
    title: 'Emprendimiento Confiable',
    description: 'Construyendo credibilidad...',
    thumbnail: '/api/placeholder/118/66',
    duration: 980,
  },
  {
    id: 7,
    title: 'Lükas y Transacciones',
    description: 'Manejo de la moneda interna...',
    thumbnail: '/api/placeholder/118/66',
    duration: 1200,
  },
];

const mockCreatedPlaylist: MockPlaylist = {
  id: 1,
  name: 'Mis Videos Favoritos',
  description: 'Una colección personal de contenido inspirador',
  videoCount: 34,
  thumbnail: '/api/placeholder/50/56',
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
  };
};
