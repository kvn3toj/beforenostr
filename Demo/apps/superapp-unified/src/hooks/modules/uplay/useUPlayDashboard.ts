import { useState, useCallback, useMemo, useTransition } from 'react';
import { useQuery } from '@tanstack/react-query';
import { videosAPI } from '../../../lib/api-service';
import { useUPlayStore } from '../../../stores/uplayStore';

// Note: This should be defined in a shared types file, e.g., 'src/types/uplay.ts'
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  rewards: {
    meritos: number;
    ondas: number;
  };
  isCompleted: boolean;
  progress: number;
  questionsCount?: number;
}

// Adapter function can be moved to a more appropriate location (e.g., api-service or a dedicated utils file)
const adaptBackendVideoToVideoItem = (backendVideo: any): VideoItem => {
  const questionsCount = backendVideo.questions?.length || 0;
  const durationMinutes = Math.ceil((backendVideo.duration || 0) / 60);
  const meritosBase = 20 + (questionsCount * 5) + Math.min(durationMinutes * 2, 50);
  const ondasBase = 10 + (questionsCount * 3) + Math.min(durationMinutes * 1, 30);

  let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  if (questionsCount >= 5 || durationMinutes > 30) difficulty = 'medium';
  if (questionsCount >= 10 || durationMinutes > 60) difficulty = 'hard';

  return {
    id: backendVideo.id?.toString() || 'unknown',
    title: backendVideo.title || 'Video sin título',
    description: backendVideo.description || 'Sin descripción disponible',
    thumbnail: backendVideo.externalId
      ? `https://img.youtube.com/vi/${backendVideo.externalId}/maxresdefault.jpg`
      : '🎬',
    duration: backendVideo.duration || 0,
    difficulty,
    category: backendVideo.categories?.[0] || 'General',
    rewards: { meritos: meritosBase, ondas: ondasBase },
    isCompleted: false, // This should come from user progress data
    progress: 0, // This should come from user progress data
    questionsCount,
  };
};

export const useUPlayDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isPlayerVisible, setPlayerVisible] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isTransitioning, startTransition] = useTransition();

  const { data: rawVideos, isLoading: areVideosLoading, error: videosError } = useQuery({
    queryKey: ['uplay-videos'],
    queryFn: () => videosAPI.getVideos(),
    select: useCallback((data: any) => {
      return (data?.videos || []).map(adaptBackendVideoToVideoItem);
    }, []),
  });

  const videos = useMemo(() => rawVideos || [], [rawVideos]);

  const categories = useMemo(() => {
    const categoryMap = new Map<string, VideoItem[]>();
    videos.forEach((video: VideoItem) => {
      if (!categoryMap.has(video.category)) {
        categoryMap.set(video.category, []);
      }
      categoryMap.get(video.category)!.push(video);
    });
    return Array.from(categoryMap.entries()).map(([name, items]) => ({
      id: name,
      name,
      videos: items,
    }));
  }, [videos]);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    startTransition(() => {
      setActiveTab(newValue);
    });
  }, []);

  const handlePlayVideo = useCallback((videoId: string) => {
    setSelectedVideoId(videoId);
    setPlayerVisible(true);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setPlayerVisible(false);
    setSelectedVideoId(null);
  }, []);

  const toggleDrawer = useCallback((open: boolean) => () => {
    setDrawerOpen(open);
  }, []);

  return {
    state: {
      activeTab,
      selectedVideoId,
      isPlayerVisible,
      isDrawerOpen,
      isTransitioning,
      areVideosLoading,
      videosError,
      videos,
      categories,
    },
    handlers: {
      handleTabChange,
      handlePlayVideo,
      handleClosePlayer,
      toggleDrawer,
    },
  };
};
