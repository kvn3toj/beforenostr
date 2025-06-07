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

interface VideoContent {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  interactions: {
    timestamp: number;
    type: 'quiz' | 'reflection' | 'poll' | 'insight' | 'checkpoint';
    data: any;
  }[];
  gamification: {
    xpReward: number;
    achievements: string[];
    challenges: string[];
  };
  stats: {
    views: number;
    likes: number;
    completionRate: number;
    averageRating: number;
  };
}

interface UserProgress {
  videoId: string;
  currentTime: number;
  completed: boolean;
  completedInteractions: string[];
  xpEarned: number;
  achievements: string[];
  rating?: number;
  notes: string;
  bookmarked: boolean;
  liked: boolean;
}

interface InteractiveVideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  onComplete?: () => void;
}

const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  videoId,
  autoplay = false,
  onComplete
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
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

  // Fetch video content
  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => apiService.get(`/videos/${videoId}`),
    enabled: !!videoId,
  });

  // Fetch user progress
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['video-progress', videoId, user?.id],
    queryFn: () => apiService.get(`/videos/${videoId}/progress`),
    enabled: !!videoId && !!user,
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: Partial<UserProgress>) => {
      return apiService.put(`/videos/${videoId}/progress`, progressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-progress', videoId] });
    },
  });

  // Complete interaction mutation
  const completeInteractionMutation = useMutation({
    mutationFn: async (interactionData: {
      interactionId: string;
      response: any;
      timestamp: number;
    }) => {
      return apiService.post(`/videos/${videoId}/interactions`, interactionData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['video-progress', videoId] });
      
      // Show achievement if earned
      if (data.achievementEarned) {
        setShowAchievement(data.achievementEarned);
      }
    },
  });

  // Rate video mutation
  const rateVideoMutation = useMutation({
    mutationFn: async (rating: number) => {
      return apiService.post(`/videos/${videoId}/rating`, { rating });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
    },
  });

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      return apiService.post(`/videos/${videoId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', videoId] });
      queryClient.invalidateQueries({ queryKey: ['video-progress', videoId] });
    },
  });

  // Video event handlers
  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

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
      
      // Check for interactions
      if (video?.interactions) {
        const interaction = video.interactions.find(
          (int: any) => Math.abs(int.timestamp - time) < 1 && 
          !progress?.completedInteractions.includes(int.id)
        );
        
        if (interaction && !activeInteraction) {
          setActiveInteraction(interaction);
          handlePause();
          
          switch (interaction.type) {
            case 'quiz':
              setShowQuiz(true);
              break;
            case 'reflection':
              setShowReflection(true);
              break;
            case 'poll':
              // Handle poll
              break;
            case 'insight':
              setShowInsights(true);
              break;
          }
        }
      }
    }
  }, [video, progress, activeInteraction, duration, updateProgressMutation, handlePause]);

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

  // Interaction handlers
  const handleQuizSubmit = useCallback(() => {
    if (activeInteraction) {
      completeInteractionMutation.mutate({
        interactionId: activeInteraction.id,
        response: quizAnswers,
        timestamp: currentTime,
      });
      
      setShowQuiz(false);
      setActiveInteraction(null);
      setQuizAnswers({});
      handlePlay();
    }
  }, [activeInteraction, quizAnswers, currentTime, completeInteractionMutation, handlePlay]);

  const handleReflectionSubmit = useCallback(() => {
    if (activeInteraction) {
      completeInteractionMutation.mutate({
        interactionId: activeInteraction.id,
        response: { reflection: reflectionText },
        timestamp: currentTime,
      });
      
      setShowReflection(false);
      setActiveInteraction(null);
      setReflectionText('');
      handlePlay();
    }
  }, [activeInteraction, reflectionText, currentTime, completeInteractionMutation, handlePlay]);

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

  // Get interaction markers
  const interactionMarkers = useMemo(() => {
    if (!video?.interactions || duration === 0) return [];
    
    return video.interactions.map((interaction: any) => ({
      ...interaction,
      position: (interaction.timestamp / duration) * 100,
      completed: progress?.completedInteractions.includes(interaction.id),
    }));
  }, [video?.interactions, duration, progress?.completedInteractions]);

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };
    
    const handleMouseMove = () => resetTimer();
    
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

  if (videoLoading || progressLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Cargando video...
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
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{
          width: '100%',
          height: isFullscreen ? '100vh' : '400px',
          objectFit: 'contain',
        }}
      />

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
            
            {/* Interaction Markers */}
            {interactionMarkers.map((marker, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  left: `${marker.position}%`,
                  top: -8,
                  transform: 'translateX(-50%)',
                }}
              >
                <Tooltip title={`${marker.type} - ${formatTime(marker.timestamp)}`}>
                  <IconButton
                    size="small"
                    sx={{
                      color: marker.completed ? 'success.main' : 'warning.main',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                    onClick={() => handleSeek(marker.timestamp)}
                  >
                    {marker.type === 'quiz' && <QuizIcon fontSize="small" />}
                    {marker.type === 'reflection' && <ReflectionIcon fontSize="small" />}
                    {marker.type === 'insight' && <InsightIcon fontSize="small" />}
                    {marker.type === 'checkpoint' && (
                      marker.completed ? <CompletedIcon fontSize="small" /> : <IncompleteIcon fontSize="small" />
                    )}
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
        <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16 }}>
          <Card sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}>
            <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {video.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar src={video.creator.avatar} sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2">{video.creator.name}</Typography>
                    {video.creator.verified && <StarIcon fontSize="small" color="primary" />}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={video.category} size="small" color="primary" />
                    <Chip label={video.difficulty} size="small" variant="outlined" />
                    {video.tags.slice(0, 3).map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
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
          {activeInteraction?.data && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {activeInteraction.data.question}
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={quizAnswers[activeInteraction.id] || ''}
                  onChange={(e) => setQuizAnswers(prev => ({
                    ...prev,
                    [activeInteraction.id]: e.target.value
                  }))}
                >
                  {activeInteraction.data.options.map((option: string, index: number) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
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