import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Slider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Badge,
  Tooltip,
  Fab,
  Zoom,
  Alert,
  Stack,
  Divider,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Collapse,
  Grid
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as ExitFullscreenIcon,
  Speed as SpeedIcon,
  Subtitles as SubtitlesIcon,
  Quiz as QuizIcon,
  EmojiEvents as AchievementIcon,
  Star as StarIcon,
  Favorite as LikeIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  School as LearnIcon,
  Timer as TimerIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Lightbulb as InsightIcon,
  Psychology as ReflectionIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../../lib/api-service';
import { useAuth } from '../../../../contexts/AuthContext';
import { formatDuration } from 'date-fns';

// 🎥 Video URL utilities
const getVideoType = (url: string): 'youtube' | 'direct' => {
  return url.includes('youtube.com') || url.includes('youtu.be') ? 'youtube' : 'direct';
};

const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&showinfo=0&controls=0&autoplay=1`;
  }
  return url;
};

// ✅ Adaptado para usar la estructura real del Backend NestJS
interface VideoContent {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
  platform: string;
  externalId: string;
  categories: string; // JSON string
  tags: string; // JSON string
  playlist: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  questions: {
    id: number;
    videoItemId: number;
    timestamp: number;
    endTimestamp?: number;
    type: 'multiple-choice' | 'true-false' | 'open-text';
    text: string;
    languageCode: string;
    isActive: boolean;
  }[];
}

// ✅ Adaptado para la estructura del Backend NestJS  
interface UserProgress {
  videoItemId: number;
  currentTime: number;
  completed: boolean;
  completedQuestions: number[]; // IDs de preguntas completadas
  xpEarned: number;
  achievements: string[];
  rating?: number;
  notes: string;
  bookmarked: boolean;
  liked: boolean;
}

interface InteractiveVideoPlayerProps {
  videoItemId: number; // ✅ Adaptado para usar ID numérico del Backend NestJS
  autoplay?: boolean;
  onComplete?: () => void;
}

const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  videoItemId,
  autoplay = false,
  onComplete
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  // 🎥 Video type detection
  const [videoType, setVideoType] = useState<'youtube' | 'direct'>('direct');
  const [embedUrl, setEmbedUrl] = useState<string>('');
  
  // Interaction state
  const [activeInteraction, setActiveInteraction] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: any }>({});
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  
  // UI state
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showStats, setShowStats] = useState(false);
  
  // 🎯 State for video info overlay visibility
  const [showVideoInfo, setShowVideoInfo] = useState(true);
  const videoInfoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Fetch video content from real Backend NestJS endpoint
  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ['video-item', videoItemId],
    queryFn: async () => {
      return await apiService.get(`/video-items/${videoItemId}`);
    },
    enabled: !!videoItemId,
  });

  // ✅ Fetch questions for the video from real Backend NestJS endpoint
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['video-questions', videoItemId],
    queryFn: async () => {
      return await apiService.get(`/questions/search?videoItemId=${videoItemId}`);
    },
    enabled: !!videoItemId,
  });

  // ✅ Fetch user progress (mock for now, to be implemented in backend)
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['video-progress', videoItemId, user?.id],
    queryFn: () => {
      // Mock progress data until backend implements this endpoint
      return Promise.resolve({
        videoItemId,
        currentTime: 0,
        completed: false,
        completedQuestions: [],
        xpEarned: 0,
        achievements: [],
        notes: '',
        bookmarked: false,
        liked: false,
      } as UserProgress);
    },
    enabled: !!videoItemId && !!user,
  });

  // ✅ Update progress mutation (mock for now, to be implemented in backend)
  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: Partial<UserProgress>) => {
      // Mock implementation until backend implements this endpoint
      console.log('🔄 [Mock] Updating progress:', progressData);
      return Promise.resolve(progressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-progress', videoItemId] });
    },
  });

  // ✅ Complete question interaction mutation (to be implemented in backend)
  const completeQuestionMutation = useMutation({
    mutationFn: async (questionData: {
      questionId: number;
      answer: any;
      timestamp: number;
      isCorrect?: boolean;
    }) => {
      // TODO: Implement real endpoint in backend
      // For now, we'll mock this and log the interaction
      console.log('🎯 [Mock] Question answered:', questionData);
      
      // Simulate successful response
      return Promise.resolve({
        success: true,
        xpEarned: 10,
        achievementEarned: null,
        questionData
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['video-progress', videoItemId] });
      
      // Show achievement if earned
      if (data.achievementEarned) {
        setShowAchievement(data.achievementEarned);
      }
      
      // Show feedback
      console.log('✅ Question submitted successfully:', data);
    },
  });

  // ✅ Rate video mutation (mock for now, to be implemented in backend)
  const rateVideoMutation = useMutation({
    mutationFn: async (rating: number) => {
      console.log('⭐ [Mock] Rating video:', rating);
      return Promise.resolve({ rating });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-item', videoItemId] });
    },
  });

  // ✅ Toggle like mutation (mock for now, to be implemented in backend)
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      console.log('❤️ [Mock] Toggling like for video');
      return Promise.resolve({ liked: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-item', videoItemId] });
      queryClient.invalidateQueries({ queryKey: ['video-progress', videoItemId] });
    },
  });

  // Video event handlers
  const handlePlay = useCallback(() => {
    if (videoType === 'youtube' && iframeRef.current) {
      // Para YouTube, enviamos comando de play via postMessage
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
    
    // 🎯 Hide video info overlay after 3 seconds when playing
    if (videoInfoTimerRef.current) {
      clearTimeout(videoInfoTimerRef.current);
    }
    videoInfoTimerRef.current = setTimeout(() => {
      setShowVideoInfo(false);
    }, 3000);
  }, [videoType]);

  const handlePause = useCallback(() => {
    if (videoType === 'youtube' && iframeRef.current) {
      // Para YouTube, enviamos comando de pause via postMessage
      iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setIsPlaying(false);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    
    // 🎯 Show video info overlay when paused
    if (videoInfoTimerRef.current) {
      clearTimeout(videoInfoTimerRef.current);
    }
    setShowVideoInfo(true);
  }, [videoType]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Update progress every 10 seconds
      if (Math.floor(time) % 10 === 0) {
        updateProgressMutation.mutate({
          currentTime: time,
          completed: time >= duration * 0.95, // 95% completion
        });
      }
      
      // ✅ Check for questions at current timestamp using questions with answerOptions
      // Priorizar questions del endpoint específico que incluye answerOptions
      const questionsToCheck = questions?.length > 0 ? questions : video?.questions || [];
      
      if (questionsToCheck.length > 0) {
        const currentQuestion = questionsToCheck.find(
          (question) => 
            time >= question.timestamp && 
            time <= (question.endTimestamp || question.timestamp + 15) && 
            question.isActive &&
            !progress?.completedQuestions.includes(question.id)
        );
        
        if (currentQuestion && !activeInteraction) {
          setActiveInteraction(currentQuestion);
          handlePause();
          
          // Always show quiz dialog for any question type
          setShowQuiz(true);
        }
      }
    }
  }, [questions, video?.questions, progress, activeInteraction, duration, updateProgressMutation, handlePause]);

  // 🎥 YouTube time simulation (since we can't get real-time from embedded player)
  useEffect(() => {
    if (videoType === 'youtube' && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          // Check for questions at current timestamp for YouTube
          const questionsToCheck = questions?.length > 0 ? questions : video?.questions || [];
          
          if (questionsToCheck.length > 0) {
            const currentQuestion = questionsToCheck.find(
              (question) => 
                newTime >= question.timestamp && 
                newTime <= (question.endTimestamp || question.timestamp + 15) && 
                question.isActive &&
                !progress?.completedQuestions.includes(question.id)
            );
            
            if (currentQuestion && !activeInteraction) {
              setActiveInteraction(currentQuestion);
              handlePause();
              setShowQuiz(true);
            }
          }
          
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [videoType, isPlaying, questions, video?.questions, progress, activeInteraction, handlePause]);

  const handleSeek = useCallback((newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullscreen]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  // ✅ Question interaction handlers
  const handleQuizSubmit = useCallback(() => {
    if (activeInteraction && quizAnswers[activeInteraction.id]) {
      completeQuestionMutation.mutate({
        questionId: activeInteraction.id,
        answer: quizAnswers[activeInteraction.id],
        timestamp: currentTime,
        isCorrect: undefined, // Backend will determine this
      });
      
      setShowQuiz(false);
      setActiveInteraction(null);
      setQuizAnswers({});
      handlePlay();
    }
  }, [activeInteraction, quizAnswers, currentTime, completeQuestionMutation, handlePlay]);

  const handleReflectionSubmit = useCallback(() => {
    if (activeInteraction && reflectionText.trim()) {
      completeQuestionMutation.mutate({
        questionId: activeInteraction.id,
        answer: reflectionText,
        timestamp: currentTime,
      });
      
      setShowReflection(false);
      setActiveInteraction(null);
      setReflectionText('');
      handlePlay();
    }
  }, [activeInteraction, reflectionText, currentTime, completeQuestionMutation, handlePlay]);

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  // ✅ Get question markers for timeline using questions with answerOptions
  const questionMarkers = useMemo(() => {
    const questionsToUse = questions?.length > 0 ? questions : video?.questions || [];
    if (!questionsToUse.length || duration === 0) return [];
    
    return questionsToUse.map((question) => ({
      ...question,
      position: (question.timestamp / duration) * 100,
      completed: progress?.completedQuestions.includes(question.id),
    }));
  }, [questions, video?.questions, duration, progress?.completedQuestions]);

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };
    
    const handleMouseMove = () => {
      resetTimer();
      // 🎯 Show video info overlay on mouse move during playback
      if (isPlaying) {
        setShowVideoInfo(true);
        if (videoInfoTimerRef.current) {
          clearTimeout(videoInfoTimerRef.current);
        }
        videoInfoTimerRef.current = setTimeout(() => {
          setShowVideoInfo(false);
        }, 4000); // Hide again after 4 seconds
      }
    };
    
    if (isPlaying) {
      containerRef.current?.addEventListener('mousemove', handleMouseMove);
      resetTimer();
    } else {
      setShowControls(true);
    }
    
    return () => {
      clearTimeout(timer);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Load progress on mount
  useEffect(() => {
    if (progress && videoRef.current) {
      videoRef.current.currentTime = progress.currentTime;
      setNotes(progress.notes || '');
    }
  }, [progress]);

  // 🎯 Cleanup video info timer on unmount
  useEffect(() => {
    return () => {
      if (videoInfoTimerRef.current) {
        clearTimeout(videoInfoTimerRef.current);
      }
    };
  }, []);

  // 🎯 Initialize video info overlay state based on playing status
  useEffect(() => {
    if (!isPlaying) {
      setShowVideoInfo(true);
      if (videoInfoTimerRef.current) {
        clearTimeout(videoInfoTimerRef.current);
      }
    }
  }, [isPlaying]);

  // 🎥 Video type detection and URL setup
  useEffect(() => {
    if (video?.url) {
      const type = getVideoType(video.url);
      setVideoType(type);
      
      if (type === 'youtube') {
        setEmbedUrl(getYouTubeEmbedUrl(video.url));
        // Para YouTube, simulamos duración desde metadata del backend
        setDuration(video.duration || 600); // Default 10 min si no hay duración
      } else {
        setEmbedUrl(video.url);
      }
    }
  }, [video?.url, video?.duration]);

  if (videoLoading || progressLoading || questionsLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {videoLoading ? 'Cargando video...' : 
           questionsLoading ? 'Cargando preguntas...' : 
           'Cargando progreso...'}
        </Typography>
      </Box>
    );
  }

  if (!video) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Video no encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box ref={containerRef} sx={{ position: 'relative', bgcolor: 'black', borderRadius: 2, overflow: 'hidden' }}>
      {/* ✅ Video Element with real URL from backend - Support for YouTube and direct videos */}
      {videoType === 'youtube' ? (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={video.title}
          style={{
            width: '100%',
            height: isFullscreen ? '100vh' : '400px',
            border: 'none',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          src={embedUrl}
          poster={video.thumbnailUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          autoPlay={autoplay}
          style={{
            width: '100%',
            height: isFullscreen ? '100vh' : '400px',
            objectFit: 'contain',
          }}
        />
      )}

      {/* Video Controls Overlay */}
      <Zoom in={showControls || !isPlaying}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: 2,
            color: 'white',
          }}
        >
          {/* Progress Bar with Interaction Markers */}
          <Box sx={{ mb: 2, position: 'relative' }}>
            <Slider
              value={currentTime}
              max={duration}
              onChange={(_, value) => handleSeek(value as number)}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                },
                '& .MuiSlider-track': {
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  opacity: 0.3,
                },
              }}
            />
            
            {/* ✅ Question Markers */}
            {questionMarkers.map((marker, index) => (
              <Box
                key={marker.id}
                data-testid="question-marker"
                sx={{
                  position: 'absolute',
                  left: `${marker.position}%`,
                  top: -8,
                  transform: 'translateX(-50%)',
                }}
              >
                <Tooltip title={`Pregunta ${marker.type} - ${formatTime(marker.timestamp)}`}>
                  <IconButton
                    size="small"
                    sx={{
                      color: marker.completed ? 'success.main' : 'warning.main',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                    onClick={() => handleSeek(marker.timestamp)}
                  >
                    <QuizIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>

          {/* Control Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={isPlaying ? handlePause : handlePlay}
                sx={{ color: 'white' }}
                aria-label={isPlaying ? 'pause' : 'play'}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
              
              <Typography variant="body2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                  {isMuted ? <MuteIcon /> : <VolumeIcon />}
                </IconButton>
                <Slider
                  value={isMuted ? 0 : volume}
                  max={1}
                  step={0.1}
                  onChange={(_, value) => handleVolumeChange(value as number)}
                  sx={{ width: 80, color: 'white' }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Velocidad de reproducción">
                <Button
                  size="small"
                  sx={{ color: 'white', minWidth: 'auto' }}
                  onClick={(e) => {
                    // Show speed menu
                  }}
                >
                  {playbackRate}x
                </Button>
              </Tooltip>
              
              <IconButton sx={{ color: 'white' }}>
                <SubtitlesIcon />
              </IconButton>
              
              <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Zoom>

      {/* Video Info Overlay */}
      {!isFullscreen && (
        <Zoom in={showVideoInfo}>
          <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16 }}>
            <Card sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}>
              <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {video.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {video.playlist.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{video.playlist.name}</Typography>
                    <StarIcon fontSize="small" color="primary" />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={video.platform} size="small" color="primary" />
                    <Chip label={`${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`} size="small" variant="outlined" />
                    {JSON.parse(video.categories || '[]').slice(0, 2).map((category: string) => (
                      <Chip key={category} label={category} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <IconButton
                    onClick={() => toggleLikeMutation.mutate()}
                    sx={{ color: progress?.liked ? 'error.main' : 'white' }}
                  >
                    <LikeIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'white' }}>
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setShowNotes(!showNotes)}
                    sx={{ color: 'white' }}
                  >
                    <CommentIcon />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Progress Indicator */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption">
                    Progreso del video
                  </Typography>
                  <Typography variant="caption">
                    {Math.round(progressPercentage)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        </Zoom>
      )}

      {/* Quiz Dialog */}
      <Dialog open={showQuiz} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuizIcon color="primary" />
            Quiz Interactivo
          </Box>
        </DialogTitle>
        <DialogContent>
          {activeInteraction && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {activeInteraction.text}
              </Typography>
              
              {/* ✅ Handle different question types with real backend data */}
              {activeInteraction.type === 'multiple-choice' && activeInteraction.answerOptions && (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={quizAnswers[activeInteraction.id] || ''}
                    onChange={(e) => setQuizAnswers(prev => ({
                      ...prev,
                      [activeInteraction.id]: e.target.value
                    }))}
                  >
                    {/* ✅ Use real answer options from backend */}
                    {activeInteraction.answerOptions
                      .sort((a, b) => a.order - b.order)
                      .map((option) => (
                        <FormControlLabel 
                          key={option.id}
                          value={option.id.toString()} 
                          control={<Radio />} 
                          label={option.text} 
                        />
                      ))}
                  </RadioGroup>
                </FormControl>
              )}
              
              {activeInteraction.type === 'true-false' && (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={quizAnswers[activeInteraction.id] || ''}
                    onChange={(e) => setQuizAnswers(prev => ({
                      ...prev,
                      [activeInteraction.id]: e.target.value
                    }))}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Verdadero" />
                    <FormControlLabel value="false" control={<Radio />} label="Falso" />
                  </RadioGroup>
                </FormControl>
              )}
              
              {activeInteraction.type === 'open-text' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Escribe tu respuesta aquí..."
                  value={quizAnswers[activeInteraction.id] || ''}
                  onChange={(e) => setQuizAnswers(prev => ({
                    ...prev,
                    [activeInteraction.id]: e.target.value
                  }))}
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuiz(false)}>
            Saltar
          </Button>
          <Button
            variant="contained"
            onClick={handleQuizSubmit}
            disabled={!quizAnswers[activeInteraction?.id]}
          >
            Responder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reflection Dialog */}
      <Dialog open={showReflection} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReflectionIcon color="primary" />
            Momento de Reflexión
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {activeInteraction?.data?.prompt}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Escribe tu reflexión aquí..."
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReflection(false)}>
            Saltar
          </Button>
          <Button
            variant="contained"
            onClick={handleReflectionSubmit}
            disabled={!reflectionText.trim()}
          >
            Guardar Reflexión
          </Button>
        </DialogActions>
      </Dialog>

      {/* Achievement Dialog */}
      <Dialog open={!!showAchievement} onClose={() => setShowAchievement(null)}>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <AchievementIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            ¡Logro Desbloqueado!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {showAchievement}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAchievement(null)} variant="contained" fullWidth>
            ¡Genial!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notes Panel */}
      <Collapse in={showNotes}>
        <Paper sx={{ position: 'absolute', top: 16, right: 16, width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Mis Notas
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Toma notas sobre este video..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => updateProgressMutation.mutate({ notes })}
          />
        </Paper>
      </Collapse>
    </Box>
  );
};

export default InteractiveVideoPlayer; 