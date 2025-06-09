import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Slider,
  Dialog,
  DialogContent,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  SkipNext as SkipNextIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as ExitFullscreenIcon,
} from '@mui/icons-material';

// Types for the interactive video player
interface QuestionOverlay {
  id: number;
  timestamp: number;
  endTimestamp: number;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options: {
    id: string;
    text: string;
    label: string; // A, B, C, D
  }[];
}

interface VideoPlayerMetrics {
  merits: number; // Mëritos
  ondas: number; // Öndas (vibrational energy)
  level: number;
  experience: number;
}

interface InteractiveVideoPlayerOverlayProps {
  videoUrl: string;
  questions?: QuestionOverlay[];
  onQuestionAnswer?: (questionId: number, answerId: string) => void;
  onVideoComplete?: () => void;
  onMetricsUpdate?: (metrics: VideoPlayerMetrics) => void;
  isLandscape?: boolean;
  autoplay?: boolean;
}

// Mock data for demonstration
const mockQuestions: QuestionOverlay[] = [
  {
    id: 1,
    timestamp: 15, // Show at 15 seconds
    endTimestamp: 45, // Hide after 45 seconds if not answered
    type: 'multiple-choice',
    question:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry?',
    options: [
      {
        id: 'option_a',
        label: 'A',
        text: 'It is a long established fact that a reader will be distracted',
      },
      {
        id: 'option_b',
        label: 'B',
        text: 'It is a long established fact that a reader',
      },
    ],
  },
];

const mockMetrics: VideoPlayerMetrics = {
  merits: 6,
  ondas: 12,
  level: 3,
  experience: 450,
};

const InteractiveVideoPlayerOverlay: React.FC<
  InteractiveVideoPlayerOverlayProps
> = ({
  videoUrl,
  questions = mockQuestions,
  onQuestionAnswer,
  onVideoComplete,
  onMetricsUpdate,
  isLandscape = true,
  autoplay = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Video state
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Question overlay state
  const [activeQuestion, setActiveQuestion] = useState<QuestionOverlay | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [questionOpacity, setQuestionOpacity] = useState(1);
  const [showHoverHint, setShowHoverHint] = useState(false);
  const [videoContinuedWithoutAnswer, setVideoContinuedWithoutAnswer] =
    useState(false);

  // Player metrics state
  const [metrics, setMetrics] = useState<VideoPlayerMetrics>(mockMetrics);
  // Format time display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Video event handlers
  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;

    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Check for questions that should be shown
    const currentQuestion = questions.find(
      (q) =>
        time >= q.timestamp &&
        time <= q.endTimestamp &&
        !answeredQuestions.has(q.id)
    );

    if (currentQuestion && !activeQuestion) {
      setActiveQuestion(currentQuestion);
      // Pause video when question appears
      videoRef.current.pause();
      setIsPlaying(false);
    } else if (!currentQuestion && activeQuestion) {
      setActiveQuestion(null);
      setSelectedAnswer(null);
    }
  }, [questions, answeredQuestions, activeQuestion]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handleSeek = useCallback((newTime: number) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullscreen]);

  // Question interaction handlers
  const handleAnswerSelect = useCallback((answerId: string) => {
    setSelectedAnswer(answerId);
  }, []);

  const handleAnswerSubmit = useCallback(() => {
    if (!activeQuestion || !selectedAnswer) return;

    // Mark question as answered
    setAnsweredQuestions((prev) => new Set([...prev, activeQuestion.id]));

    // Update metrics
    setMetrics((prev) => ({
      ...prev,
      merits: prev.merits + 2,
      experience: prev.experience + 25,
    }));

    // Call callback
    onQuestionAnswer?.(activeQuestion.id, selectedAnswer);
    onMetricsUpdate?.(metrics);

    // Clear active question and resume video
    setActiveQuestion(null);
    setSelectedAnswer(null);

    // Resume video playback
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [
    activeQuestion,
    selectedAnswer,
    metrics,
    onQuestionAnswer,
    onMetricsUpdate,
  ]);

  const handleSkipQuestion = useCallback(() => {
    if (!activeQuestion) return;

    // Mark as skipped
    setAnsweredQuestions((prev) => new Set([...prev, activeQuestion.id]));
    setActiveQuestion(null);
    setSelectedAnswer(null);

    // Resume video
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [activeQuestion]);

  // Progress calculation
  const progressPercentage = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };

    const handleMouseMove = () => resetTimer();

    if (isPlaying && !activeQuestion) {
      containerRef.current?.addEventListener('mousemove', handleMouseMove);
      resetTimer();
    } else {
      setShowControls(true);
    }

    return () => {
      clearTimeout(timer);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying, activeQuestion]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: isLandscape
          ? isFullscreen
            ? '100vh'
            : { xs: '100vw', md: '500px' }
          : '400px',
        backgroundColor: '#656565',
        borderRadius: isFullscreen ? 0 : 2,
        overflow: 'hidden',
        transform: isLandscape && !isFullscreen ? 'rotate(-90deg)' : 'none',
        transformOrigin: 'center',
        ...(isLandscape &&
          !isFullscreen && {
            width: { xs: '100vh', md: '700px' },
            height: { xs: '100vw', md: '400px' },
            margin: 'auto',
          }),
      }}
    >
      {/* Background Geometric Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: activeQuestion ? 0.3 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        {/* Triangle */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '100px solid transparent',
            borderRight: '100px solid transparent',
            borderBottom: '120px solid rgba(180, 180, 180, 0.4)',
          }}
        />
        {/* Rectangle */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '30%',
            left: '25%',
            width: '80px',
            height: '120px',
            backgroundColor: 'rgba(140, 140, 140, 0.3)',
            borderRadius: '8px',
          }}
        />
        {/* Circle */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'rgba(120, 120, 120, 0.3)',
          }}
        />
      </Box>

      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onVideoComplete?.();
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          backgroundColor: '#000',
        }}
        autoPlay={autoplay}
        playsInline
      />

      {/* Status Bar - Top overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '12px 16px',
          color: 'white',
          zIndex: 10,
        }}
      >
        {/* Back button */}
        <IconButton
          size="small"
          sx={{ color: 'white', p: 0.5 }}
          onClick={() => window.history.back()}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        {/* Timer */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Roboto',
            fontWeight: 400,
            fontSize: '18px',
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {formatTime(currentTime)}
        </Typography>

        {/* Metrics display */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 500,
                fontSize: '20px',
                color: 'white',
              }}
            >
              {metrics.merits}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 400,
                fontSize: '20px',
                color: 'white',
              }}
            >
              ∞
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 500,
                fontSize: '20px',
                color: 'white',
              }}
            >
              {metrics.ondas}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2 }}>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                }}
              />
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Question Overlay */}
      <Fade in={!!activeQuestion} timeout={500}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            zIndex: 20,
            display: activeQuestion ? 'block' : 'none',
          }}
        >
          {activeQuestion && (
            <Box>
              {/* Question text */}
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  mb: 4,
                  fontFamily: 'Roboto',
                  fontSize: '18px',
                  fontWeight: 400,
                  lineHeight: 1.4,
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  px: 3,
                  maxWidth: '80%',
                  margin: '0 auto 32px auto',
                }}
              >
                {activeQuestion.question}
              </Typography>

              {/* Answer options */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  px: 2,
                }}
              >
                {activeQuestion.options.map((option) => (
                  <Card
                    key={option.id}
                    sx={{
                      minWidth: 240,
                      maxWidth: 300,
                      cursor: 'pointer',
                      borderRadius: '20px',
                      backgroundColor:
                        selectedAnswer === option.id
                          ? 'rgba(103, 80, 164, 0.95)'
                          : 'rgba(255, 255, 255, 0.92)',
                      color:
                        selectedAnswer === option.id
                          ? 'white'
                          : 'rgba(66, 65, 65, 0.87)',
                      transform:
                        selectedAnswer === option.id
                          ? 'scale(1.03)'
                          : 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow:
                        selectedAnswer === option.id
                          ? '0px 8px 24px rgba(103, 80, 164, 0.4), 0px 4px 12px rgba(0, 0, 0, 0.15)'
                          : '0px 4px 12px rgba(0, 0, 0, 0.15), 0px 2px 6px rgba(0, 0, 0, 0.1)',
                      border:
                        selectedAnswer === option.id
                          ? '2px solid rgba(103, 80, 164, 0.8)'
                          : '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(8px)',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        backgroundColor:
                          selectedAnswer === option.id
                            ? 'rgba(103, 80, 164, 1)'
                            : 'rgba(255, 255, 255, 0.98)',
                        boxShadow:
                          selectedAnswer === option.id
                            ? '0px 12px 32px rgba(103, 80, 164, 0.5), 0px 6px 16px rgba(0, 0, 0, 0.2)'
                            : '0px 6px 16px rgba(0, 0, 0, 0.2), 0px 3px 8px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                    onClick={() => handleAnswerSelect(option.id)}
                  >
                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: 'Roboto',
                          fontSize: '20px',
                          fontWeight: 500,
                          textAlign: 'center',
                          mb: 2,
                          letterSpacing: '0.5px',
                        }}
                      >
                        {option.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: 'Roboto',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: 1.5,
                          textAlign: 'center',
                        }}
                      >
                        {option.text}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Action buttons - Hidden in this design, auto-submit on selection */}
              {selectedAnswer && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleAnswerSubmit}
                    sx={{
                      backgroundColor: '#6750A4',
                      color: 'white',
                      borderRadius: '24px',
                      px: 4,
                      py: 1.5,
                      fontFamily: 'Roboto',
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(103, 80, 164, 0.4)',
                      '&:hover': {
                        backgroundColor: '#5A47A0',
                        boxShadow: '0 6px 16px rgba(103, 80, 164, 0.5)',
                      },
                    }}
                  >
                    Continuar
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Fade>

      {/* Video Controls - Bottom overlay */}
      <Fade in={showControls || !isPlaying} timeout={300}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(84, 83, 83, 0.9))',
            padding: '15px 28px',
            zIndex: 10,
          }}
        >
          {/* Progress bar */}
          <Box sx={{ mb: 2 }}>
            <Slider
              value={currentTime}
              max={duration}
              onChange={(_, value) => handleSeek(value as number)}
              sx={{
                color: '#6750A4',
                height: 6,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  backgroundColor: '#6750A4',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(103, 80, 164, 0.4)',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 4px 12px rgba(103, 80, 164, 0.6)',
                  },
                },
                '& .MuiSlider-track': {
                  height: 6,
                  borderRadius: '3px',
                  background:
                    'linear-gradient(90deg, #6750A4 0%, #8B5CF6 50%, #A855F7 100%)',
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  height: 6,
                  borderRadius: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Control buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Left controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handlePlayPause}
                sx={{ color: 'white', p: 0 }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>

              <IconButton sx={{ color: 'white', p: 0 }}>
                <SkipNextIcon />
              </IconButton>

              <IconButton onClick={toggleMute} sx={{ color: 'white', p: 0 }}>
                <VolumeIcon />
              </IconButton>

              {/* Volume slider */}
              <Slider
                value={isMuted ? 0 : volume}
                max={1}
                step={0.1}
                onChange={(_, value) => handleVolumeChange(value as number)}
                sx={{
                  width: 100,
                  color: 'white',
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                  },
                }}
              />

              {/* Duration display */}
              <Typography
                variant="body2"
                sx={{ color: 'white', minWidth: 60, textAlign: 'center' }}
              >
                {formatTime(duration)}
              </Typography>
            </Box>

            {/* Right controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ color: 'white', p: 0 }}>
                <AddIcon />
              </IconButton>

              <IconButton sx={{ color: 'white', p: 0 }}>
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Fullscreen toggle (hidden in the wireframe but useful) */}
      <IconButton
        onClick={toggleFullscreen}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.7)',
          },
          zIndex: 10,
          display: showControls ? 'flex' : 'none',
        }}
      >
        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
      </IconButton>
    </Box>
  );
};

export default InteractiveVideoPlayerOverlay;
