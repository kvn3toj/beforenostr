import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVideoPlayerProps {
  videoData: {
    id: string;
    title: string;
    url: string;
    duration: number;
  };
  onTimeUpdate?: (time: number) => void;
  onVideoEnd?: () => void;
  onError?: (error: string) => void;
}

interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  showControls: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useVideoPlayer = ({
  videoData,
  onTimeUpdate,
  onVideoEnd,
  onError,
}: UseVideoPlayerProps) => {
  // Video state
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    volume: 0.8,
    isMuted: false,
    isFullscreen: false,
    showControls: true,
    isLoading: false,
    error: null,
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time utility
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Basic video controls
  const play = useCallback(async () => {
    if (videoRef.current) {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await videoRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al reproducir video';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        onError?.(errorMessage);
      }
    }
  }, [onError]);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    if (videoRef.current) {
      videoRef.current.volume = clampedVolume;
      setState(prev => ({ 
        ...prev, 
        volume: clampedVolume, 
        isMuted: clampedVolume === 0 
      }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !state.isMuted;
      videoRef.current.muted = newMuted;
      setState(prev => ({ ...prev, isMuted: newMuted }));
    }
  }, [state.isMuted]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      const clampedTime = Math.max(0, Math.min(videoData.duration, time));
      videoRef.current.currentTime = clampedTime;
      setState(prev => ({ ...prev, currentTime: clampedTime }));
    }
  }, [videoData.duration]);

  const seekRelative = useCallback((seconds: number) => {
    seek(state.currentTime + seconds);
  }, [state.currentTime, seek]);

  // Controls visibility management
  const showControlsTemporarily = useCallback(() => {
    setState(prev => ({ ...prev, showControls: true }));
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, showControls: false }));
    }, 3000);
  }, []);

  const hideControls = useCallback(() => {
    setState(prev => ({ ...prev, showControls: false }));
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, []);

  // Time tracking effect
  useEffect(() => {
    if (state.isPlaying) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newTime = prev.currentTime + 1;
          const clampedTime = Math.min(newTime, videoData.duration);
          
          // Notify parent component of time update
          onTimeUpdate?.(clampedTime);
          
          // Check if video ended
          if (clampedTime >= videoData.duration) {
            onVideoEnd?.();
            return { ...prev, currentTime: clampedTime, isPlaying: false };
          }
          
          return { ...prev, currentTime: clampedTime };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isPlaying, videoData.duration, onTimeUpdate, onVideoEnd]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Video element event handlers
  const handleVideoLoadStart = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
  }, []);

  const handleVideoCanPlay = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const handleVideoError = useCallback(() => {
    const errorMessage = 'Error al cargar el video';
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    onError?.(errorMessage);
  }, [onError]);

  return {
    // State
    ...state,
    progress: (state.currentTime / videoData.duration) * 100,
    
    // Refs
    videoRef,
    
    // Actions
    play,
    pause,
    togglePlayPause,
    setVolume,
    toggleMute,
    seek,
    seekRelative,
    showControlsTemporarily,
    hideControls,
    
    // Utilities
    formatTime,
    
    // Event handlers for video element
    handleVideoLoadStart,
    handleVideoCanPlay,
    handleVideoError,
  };
}; 