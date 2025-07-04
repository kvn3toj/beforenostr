// Advanced Video Player - UPlay Module
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  LinearProgress,
  Fade,
  Badge,
  Snackbar
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Settings,
  Speed,
  Subtitles,
  Replay10,
  Forward10,
  PictureInPicture,
  Download,
  Share,
  Bookmark,
  Quiz,
  Timer,
  Star,
  TrendingUp,
  EmojiEvents,
  Celebration
} from '@mui/icons-material';
import {
  VideoItem,
  InteractiveQuestion,
  VideoPlayerState,
  VideoQuality,
  QuestionType,
  VideoRewards
} from '../../../../types/uplay';
import { uplayService } from '../../../../services/uplay/uplayService';

interface AdvancedVideoPlayerProps {
  video: VideoItem;
  onVideoEnd?: () => void;
  onQuestionAnswer?: (questionId: string, correct: boolean, points: number) => void;
  onProgress?: (currentTime: number, duration: number) => void;
  className?: string;
}

interface QuestionSession {
  question: InteractiveQuestion;
  startTime: number;
  userAnswers: string[];
  timeSpent: number;
  correct?: boolean;
  points?: number;
}

export const AdvancedVideoPlayer: React.FC<AdvancedVideoPlayerProps> = ({
  video,
  onVideoEnd,
  onQuestionAnswer,
  onProgress,
  className
}) => {
  // Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    quality: { height: 720, width: 1280, bitrate: 2500, label: 'HD' },
    isFullscreen: false,
    isMuted: false,
    showControls: true,
    subtitlesEnabled: false,
    buffered: [],
    seeking: false
  });

  // UI State
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);
  const [speedMenuAnchor, setSpeedMenuAnchor] = useState<null | HTMLElement>(null);
  const [qualityMenuAnchor, setQualityMenuAnchor] = useState<null | HTMLElement>(null);

  // Questions State
  const [currentQuestion, setCurrentQuestion] = useState<InteractiveQuestion | null>(null);
  const [questionSession, setQuestionSession] = useState<QuestionSession | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState<Set<string>>(new Set());
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [questionTimer, setQuestionTimer] = useState<number>(0);
  const [showQuestionResult, setShowQuestionResult] = useState(false);
  const [questionResult, setQuestionResult] = useState<{ correct: boolean; points: number; explanation: string } | null>(null);

  // Gamification State
  const [sessionStats, setSessionStats] = useState({
    totalPoints: 0,
    questionsCorrect: 0,
    questionsTotal: 0,
    currentStreak: 0,
    watchTime: 0
  });
  const [rewardNotification, setRewardNotification] = useState<{ show: boolean; reward: VideoRewards | null }>({
    show: false,
    reward: null
  });

  // Control Visibility
  const [controlsVisible, setControlsVisible] = useState(true);
  const [mouseInactive, setMouseInactive] = useState(false);
  const hideControlsTimeout = useRef<NodeJS.Timeout>();

  // Available qualities and speeds
  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const availableQualities: VideoQuality[] = [
    { height: 360, width: 640, bitrate: 800, label: 'SD' },
    { height: 480, width: 854, bitrate: 1200, label: 'HD' },
    { height: 720, width: 1280, bitrate: 2500, label: 'HD+' },
    { height: 1080, width: 1920, bitrate: 4000, label: 'FHD' }
  ];

  // ================================
  // VIDEO CONTROL FUNCTIONS
  // ================================

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (playerState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [playerState.isPlaying]);

  const seek = useCallback((time: number) => {
    if (!videoRef.current) return;
    
    setPlayerState(prev => ({ ...prev, seeking: true }));
    videoRef.current.currentTime = time;
    
    // Check for questions at new time
    checkForQuestions(time);
    
    setTimeout(() => {
      setPlayerState(prev => ({ ...prev, seeking: false }));
    }, 100);
  }, []);

  const changeVolume = useCallback((volume: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.volume = volume;
    setPlayerState(prev => ({ 
      ...prev, 
      volume, 
      isMuted: volume === 0 
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    if (playerState.isMuted) {
      videoRef.current.volume = playerState.volume > 0 ? playerState.volume : 0.5;
      setPlayerState(prev => ({ ...prev, isMuted: false }));
    } else {
      videoRef.current.volume = 0;
      setPlayerState(prev => ({ ...prev, isMuted: true }));
    }
  }, [playerState.isMuted, playerState.volume]);

  const changePlaybackRate = useCallback((rate: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.playbackRate = rate;
    setPlayerState(prev => ({ ...prev, playbackRate: rate }));
    setSpeedMenuAnchor(null);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!playerState.isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [playerState.isFullscreen]);

  const skipTime = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(playerState.duration, playerState.currentTime + seconds));
    seek(newTime);
  }, [playerState.currentTime, playerState.duration, seek]);

  // ================================
  // QUESTION SYSTEM
  // ================================

  const checkForQuestions = useCallback((currentTime: number) => {
    if (!video.questions || questionsAnswered.has(currentQuestion?.id || '')) return;

    const activeQuestion = video.questions.find(q => 
      Math.abs(q.timestamp - currentTime) < 1 && 
      !questionsAnswered.has(q.id)
    );

    if (activeQuestion && !showQuestion) {
      setCurrentQuestion(activeQuestion);
      setShowQuestion(true);
      setQuestionTimer(activeQuestion.timeLimit || 30);
      setUserAnswers([]);
      setQuestionSession({
        question: activeQuestion,
        startTime: Date.now(),
        userAnswers: [],
        timeSpent: 0
      });

      // Pause video for question
      if (videoRef.current && playerState.isPlaying) {
        videoRef.current.pause();
      }

      // Track question appearance
      uplayService.trackUserAction('question_appeared', {
        videoId: video.id,
        questionId: activeQuestion.id,
        timestamp: currentTime
      });
    }
  }, [video.questions, currentQuestion, showQuestion, questionsAnswered, playerState.isPlaying]);

  const submitAnswer = useCallback(async () => {
    if (!currentQuestion || !questionSession) return;

    const timeSpent = (Date.now() - questionSession.startTime) / 1000;
    
    try {
      const response = await uplayService.submitQuestionAnswer(
        currentQuestion.id,
        userAnswers,
        timeSpent
      );

      if (response.success) {
        const { correct, points, explanation } = response.data;
        
        setQuestionResult({ correct, points, explanation });
        setShowQuestionResult(true);
        setQuestionsAnswered(prev => new Set([...prev, currentQuestion.id]));
        
        // Update session stats
        setSessionStats(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + points,
          questionsCorrect: prev.questionsCorrect + (correct ? 1 : 0),
          questionsTotal: prev.questionsTotal + 1,
          currentStreak: correct ? prev.currentStreak + 1 : 0
        }));

        // Show celebration for correct answers
        if (correct && points > 0) {
          setRewardNotification({
            show: true,
            reward: {
              meritos: points,
              ondas: correct ? 10 : 0,
              cristales: 0,
              experiencePoints: points * 2,
              badges: []
            }
          });
        }

        // Call parent callback
        onQuestionAnswer?.(currentQuestion.id, correct, points);

        // Resume video after showing result
        setTimeout(() => {
          setShowQuestion(false);
          setShowQuestionResult(false);
          setCurrentQuestion(null);
          setQuestionSession(null);
          
          if (videoRef.current) {
            videoRef.current.play();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  }, [currentQuestion, questionSession, userAnswers, onQuestionAnswer]);

  const handleAnswerSelect = useCallback((answerId: string, questionType: QuestionType) => {
    if (questionType === QuestionType.MULTIPLE_CHOICE) {
      setUserAnswers([answerId]);
    } else if (questionType === QuestionType.TRUE_FALSE) {
      setUserAnswers([answerId]);
    } else {
      // For multiple selection questions
      setUserAnswers(prev => 
        prev.includes(answerId) 
          ? prev.filter(id => id !== answerId)
          : [...prev, answerId]
      );
    }
  }, []);

  // ================================
  // EVENT HANDLERS
  // ================================

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setPlayerState(prev => ({ ...prev, duration: video.duration }));
    };

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      setPlayerState(prev => ({ ...prev, currentTime }));
      
      // Check for questions
      checkForQuestions(currentTime);
      
      // Update session watch time
      setSessionStats(prev => ({ ...prev, watchTime: currentTime }));
      
      // Call progress callback
      onProgress?.(currentTime, video.duration);
      
      // Track progress periodically
      if (Math.floor(currentTime) % 10 === 0) {
        uplayService.trackVideoProgress(
          video.id,
          currentTime,
          video.duration,
          false
        );
      }
    };

    const handlePlay = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      
      // Track completion
      uplayService.trackVideoProgress(
        video.id,
        video.duration,
        video.duration,
        true
      );
      
      onVideoEnd?.();
    };

    const handleVolumeChange = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        volume: video.volume,
        isMuted: video.muted 
      }));
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [checkForQuestions, onProgress, onVideoEnd]);

  // Question timer effect
  useEffect(() => {
    if (showQuestion && questionTimer > 0) {
      const timer = setTimeout(() => {
        setQuestionTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showQuestion && questionTimer === 0) {
      // Auto-submit when time runs out
      submitAnswer();
    }
  }, [showQuestion, questionTimer, submitAnswer]);

  // Controls visibility effect
  useEffect(() => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }

    if (playerState.isPlaying && !showQuestion) {
      hideControlsTimeout.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    } else {
      setControlsVisible(true);
    }

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [playerState.isPlaying, showQuestion, mouseInactive]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setPlayerState(prev => ({ 
        ...prev, 
        isFullscreen: !!document.fullscreenElement 
      }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionMarkers = () => {
    if (!video.questions) return [];
    return video.questions.map(q => (q.timestamp / playerState.duration) * 100);
  };

  // ================================
  // RENDER
  // ================================

  return (
    <Box 
      ref={containerRef}
      className={className}
      sx={{ 
        position: 'relative',
        backgroundColor: '#000',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          '& .video-controls': {
            opacity: 1
          }
        }
      }}
      onMouseMove={() => {
        setControlsVisible(true);
        setMouseInactive(false);
      }}
      onMouseLeave={() => setMouseInactive(true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
        onClick={togglePlayPause}
      />

      {/* Question Markers on Timeline */}
      {getQuestionMarkers().map((position, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            bottom: 60,
            left: `${position}%`,
            width: 4,
            height: 20,
            backgroundColor: '#ff6b35',
            borderRadius: 1,
            zIndex: 10,
            '&::before': {
              content: '"?"',
              position: 'absolute',
              top: -25,
              left: -8,
              width: 20,
              height: 20,
              backgroundColor: '#ff6b35',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white'
            }
          }}
        />
      ))}

      {/* Video Controls */}
      <Fade in={controlsVisible || !playerState.isPlaying}>
        <Box
          className="video-controls"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: 2,
            zIndex: 20
          }}
        >
          {/* Progress Bar */}
          <Box sx={{ mb: 1 }}>
            <Slider
              value={playerState.currentTime}
              max={playerState.duration}
              onChange={(_, value) => seek(value as number)}
              sx={{
                color: '#ff6b35',
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(255, 107, 53, 0.16)'
                  }
                },
                '& .MuiSlider-track': {
                  height: 4
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '0.875rem' }}>
              <span>{formatTime(playerState.currentTime)}</span>
              <span>{formatTime(playerState.duration)}</span>
            </Box>
          </Box>

          {/* Control Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => skipTime(-10)} sx={{ color: 'white' }}>
                <Replay10 />
              </IconButton>
              
              <IconButton onClick={togglePlayPause} sx={{ color: 'white' }}>
                {playerState.isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              
              <IconButton onClick={() => skipTime(10)} sx={{ color: 'white' }}>
                <Forward10 />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                  {playerState.isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <Slider
                  value={playerState.isMuted ? 0 : playerState.volume}
                  max={1}
                  step={0.1}
                  onChange={(_, value) => changeVolume(value as number)}
                  sx={{ 
                    width: 100, 
                    ml: 1,
                    color: 'white'
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Session Stats */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
                <Chip
                  icon={<Star />}
                  label={`${sessionStats.totalPoints} pts`}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,107,53,0.2)', color: 'white' }}
                />
                <Chip
                  icon={<Quiz />}
                  label={`${sessionStats.questionsCorrect}/${sessionStats.questionsTotal}`}
                  size="small"
                  sx={{ backgroundColor: 'rgba(76,175,80,0.2)', color: 'white' }}
                />
                {sessionStats.currentStreak > 0 && (
                  <Chip
                    icon={<TrendingUp />}
                    label={`${sessionStats.currentStreak}x`}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255,193,7,0.2)', color: 'white' }}
                  />
                )}
              </Box>

              {/* Speed Control */}
              <Button
                onClick={(e) => setSpeedMenuAnchor(e.currentTarget)}
                sx={{ color: 'white', minWidth: 'auto' }}
              >
                {playerState.playbackRate}x
              </Button>

              {/* Settings */}
              <IconButton 
                onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}
                sx={{ color: 'white' }}
              >
                <Settings />
              </IconButton>

              {/* Fullscreen */}
              <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                {playerState.isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Question Dialog */}
      <Dialog
        open={showQuestion}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }
        }}
      >
        {currentQuestion && (
          <>
            <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{currentQuestion.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {currentQuestion.points} puntos • Dificultad: {currentQuestion.difficulty}
                </Typography>
              </Box>
              <Chip
                icon={<Timer />}
                label={`${questionTimer}s`}
                color={questionTimer <= 10 ? 'error' : 'default'}
                sx={{ fontWeight: 'bold' }}
              />
            </DialogTitle>

            <DialogContent sx={{ color: 'white' }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {currentQuestion.content}
              </Typography>

              {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
                <FormControl component="fieldset">
                  <RadioGroup
                    value={userAnswers[0] || ''}
                    onChange={(e) => handleAnswerSelect(e.target.value, currentQuestion.type)}
                  >
                    {currentQuestion.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio sx={{ color: 'white' }} />}
                        label={option.text}
                        sx={{ color: 'white', mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {currentQuestion.type === QuestionType.TRUE_FALSE && (
                <FormControl component="fieldset">
                  <RadioGroup
                    value={userAnswers[0] || ''}
                    onChange={(e) => handleAnswerSelect(e.target.value, currentQuestion.type)}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio sx={{ color: 'white' }} />}
                      label="Verdadero"
                      sx={{ color: 'white', mb: 1 }}
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio sx={{ color: 'white' }} />}
                      label="Falso"
                      sx={{ color: 'white' }}
                    />
                  </RadioGroup>
                </FormControl>
              )}

              {/* Timer Progress */}
              <LinearProgress
                variant="determinate"
                value={((currentQuestion.timeLimit || 30) - questionTimer) / (currentQuestion.timeLimit || 30) * 100}
                sx={{
                  mt: 3,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: questionTimer <= 10 ? '#f44336' : '#4caf50'
                  }
                }}
              />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={submitAnswer}
                disabled={userAnswers.length === 0}
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#ff6b35',
                  '&:hover': { backgroundColor: '#e55a2e' },
                  borderRadius: 2,
                  px: 4
                }}
              >
                Responder
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Question Result Dialog */}
      <Dialog open={showQuestionResult} maxWidth="sm" fullWidth>
        {questionResult && (
          <DialogContent sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ mb: 3 }}>
              {questionResult.correct ? (
                <Celebration sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
              ) : (
                <Box sx={{ fontSize: 64, mb: 2 }}>❌</Box>
              )}
            </Box>
            
            <Typography variant="h5" sx={{ mb: 2, color: questionResult.correct ? '#4caf50' : '#f44336' }}>
              {questionResult.correct ? '¡Correcto!' : 'Incorrecto'}
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 2 }}>
              +{questionResult.points} puntos
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {questionResult.explanation}
            </Typography>
          </DialogContent>
        )}
      </Dialog>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsMenuAnchor}
        open={Boolean(settingsMenuAnchor)}
        onClose={() => setSettingsMenuAnchor(null)}
      >
        <MenuItem onClick={(e) => setQualityMenuAnchor(e.currentTarget)}>
          <Settings sx={{ mr: 1 }} />
          Calidad
        </MenuItem>
        <MenuItem onClick={() => setPlayerState(prev => ({ ...prev, subtitlesEnabled: !prev.subtitlesEnabled }))}>
          <Subtitles sx={{ mr: 1 }} />
          Subtítulos
        </MenuItem>
        <MenuItem>
          <PictureInPicture sx={{ mr: 1 }} />
          Picture in Picture
        </MenuItem>
        <MenuItem>
          <Download sx={{ mr: 1 }} />
          Descargar
        </MenuItem>
      </Menu>

      {/* Speed Menu */}
      <Menu
        anchorEl={speedMenuAnchor}
        open={Boolean(speedMenuAnchor)}
        onClose={() => setSpeedMenuAnchor(null)}
      >
        {playbackSpeeds.map((speed) => (
          <MenuItem
            key={speed}
            onClick={() => changePlaybackRate(speed)}
            selected={playerState.playbackRate === speed}
          >
            {speed}x
          </MenuItem>
        ))}
      </Menu>

      {/* Quality Menu */}
      <Menu
        anchorEl={qualityMenuAnchor}
        open={Boolean(qualityMenuAnchor)}
        onClose={() => setQualityMenuAnchor(null)}
      >
        {availableQualities.map((quality) => (
          <MenuItem
            key={quality.label}
            onClick={() => {
              setPlayerState(prev => ({ ...prev, quality }));
              setQualityMenuAnchor(null);
            }}
            selected={playerState.quality.label === quality.label}
          >
            {quality.label} ({quality.height}p)
          </MenuItem>
        ))}
      </Menu>

      {/* Reward Notification */}
      <Snackbar
        open={rewardNotification.show}
        autoHideDuration={4000}
        onClose={() => setRewardNotification({ show: false, reward: null })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{
            backgroundColor: '#4caf50',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEvents />
            <Typography>
              ¡+{rewardNotification.reward?.meritos} Méritos ganados!
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};