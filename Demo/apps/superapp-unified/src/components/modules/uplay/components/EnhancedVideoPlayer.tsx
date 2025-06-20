import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Chip,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Card,
  CardContent,
  Avatar,
  Badge,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Settings,
  Quiz,
  Star,
  EmojiEvents,
  Timer,
  CheckCircle,
  RadioButtonUnchecked,
  Lightbulb,
  TrendingUp,
  Psychology,
} from '@mui/icons-material';
import { cn, animations, gradients, focus } from '../../../../utils/styles';
import { Card as CoomunityCard, Button as CoomunityButton } from '../../../ui';

// 🎯 Types
interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number; // in seconds
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: {
    id: string;
    name: string;
    avatar: string;
    specialties: string[];
    meritos: number;
  };
  gamification: {
    totalMeritos: number; // Mëritos available for completion
    ondasReward: number; // Öndas (vibrational energy) reward
    checkpoints: VideoCheckpoint[];
    questions: InteractiveQuestion[];
    achievements: Achievement[];
  };
  metadata: {
    views: number;
    completionRate: number;
    averageRating: number;
    tags: string[];
    isPopular: boolean;
    isBienComun: boolean;
  };
}

interface VideoCheckpoint {
  id: string;
  timestamp: number; // in seconds
  title: string;
  description: string;
  type: 'knowledge' | 'reflection' | 'practice' | 'quiz';
  meritosReward: number;
  isCompleted: boolean;
}

interface InteractiveQuestion {
  id: string;
  timestamp: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  meritosReward: number;
  ondasReward: number;
  isAnswered: boolean;
  userAnswer?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  meritosReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

interface EnhancedVideoPlayerProps {
  videoData: VideoData;
  onProgress?: (progress: number) => void;
  onComplete?: (videoId: string, stats: CompletionStats) => void;
  onMeritosEarned?: (amount: number, reason: string) => void;
  onOndasEarned?: (amount: number, reason: string) => void;
  className?: string;
}

interface CompletionStats {
  watchTime: number;
  completionPercentage: number;
  questionsAnswered: number;
  questionsCorrect: number;
  checkpointsReached: number;
  totalMeritosEarned: number;
  totalOndasEarned: number;
}

// 🎨 Animation Variants
const playerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  }
};

const controlsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    }
  }
};

const questionVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 50 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -50,
    transition: {
      duration: 0.2,
    }
  }
};

const meritosCounterVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    }
  },
  pulse: {
    scale: [1, 1.3, 1],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    }
  }
};

// 🌟 Enhanced Video Player Component
export const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  videoData,
  onProgress,
  onComplete,
  onMeritosEarned,
  onOndasEarned,
  className,
}) => {
  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Gamification State
  const [currentQuestion, setCurrentQuestion] = useState<InteractiveQuestion | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<string>>(new Set());
  const [earnedMeritos, setEarnedMeritos] = useState(0);
  const [earnedOndas, setEarnedOndas] = useState(0);
  const [showMeritosAnimation, setShowMeritosAnimation] = useState(false);
  const [showOndasAnimation, setShowOndasAnimation] = useState(false);

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Motion Values for smooth animations
  const progressMotionValue = useMotionValue(0);
  const progressWidth = useTransform(progressMotionValue, [0, 1], ['0%', '100%']);

  // 🎮 Video Control Functions
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const progress = current / duration;
      
      setCurrentTime(current);
      progressMotionValue.set(progress);
      onProgress?.(progress);

      // Check for interactive questions
      const pendingQuestion = videoData.gamification.questions.find(
        q => !q.isAnswered && Math.abs(q.timestamp - current) < 0.5
      );

      if (pendingQuestion && !showQuestion) {
        setCurrentQuestion(pendingQuestion);
        setShowQuestion(true);
        videoRef.current.pause();
        setIsPlaying(false);
      }

      // Check for checkpoints
      videoData.gamification.checkpoints.forEach(checkpoint => {
        if (!completedCheckpoints.has(checkpoint.id) && current >= checkpoint.timestamp) {
          setCompletedCheckpoints(prev => new Set([...prev, checkpoint.id]));
          handleMeritosEarned(checkpoint.meritosReward, `Checkpoint: ${checkpoint.title}`);
        }
      });
    }
  }, [videoData, showQuestion, completedCheckpoints, onProgress, progressMotionValue]);

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
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // 🎯 Gamification Functions
  const handleMeritosEarned = useCallback((amount: number, reason: string) => {
    setEarnedMeritos(prev => prev + amount);
    setShowMeritosAnimation(true);
    onMeritosEarned?.(amount, reason);
    setTimeout(() => setShowMeritosAnimation(false), 2000);
  }, [onMeritosEarned]);

  const handleOndasEarned = useCallback((amount: number, reason: string) => {
    setEarnedOndas(prev => prev + amount);
    setShowOndasAnimation(true);
    onOndasEarned?.(amount, reason);
    setTimeout(() => setShowOndasAnimation(false), 2000);
  }, [onOndasEarned]);

  const handleQuestionAnswer = useCallback((questionId: string, answerIndex: number) => {
    const question = videoData.gamification.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = answerIndex === question.correctAnswer;
    
    // Update question state
    question.isAnswered = true;
    question.userAnswer = answerIndex;

    if (isCorrect) {
      handleMeritosEarned(question.meritosReward, `Pregunta correcta: ${question.question}`);
      handleOndasEarned(question.ondasReward, `Respuesta correcta`);
    }

    // Hide question and resume video
    setTimeout(() => {
      setShowQuestion(false);
      setCurrentQuestion(null);
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 2000);
  }, [videoData, handleMeritosEarned, handleOndasEarned]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate completion stats
  const getCompletionStats = (): CompletionStats => {
    const questionsAnswered = videoData.gamification.questions.filter(q => q.isAnswered).length;
    const questionsCorrect = videoData.gamification.questions.filter(
      q => q.isAnswered && q.userAnswer === q.correctAnswer
    ).length;

    return {
      watchTime: currentTime,
      completionPercentage: (currentTime / videoData.duration) * 100,
      questionsAnswered,
      questionsCorrect,
      checkpointsReached: completedCheckpoints.size,
      totalMeritosEarned: earnedMeritos,
      totalOndasEarned: earnedOndas,
    };
  };

  // Effects
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', () => {
        setIsPlaying(false);
        onComplete?.(videoData.id, getCompletionStats());
      });

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [handleTimeUpdate, videoData.id, onComplete]);

  return (
    <motion.div
      variants={playerVariants}
      initial="hidden"
      animate="visible"
      className={cn('relative w-full max-w-4xl mx-auto', className)}
    >
      <CoomunityCard
        variant="elevated"
        padding="none"
        className="overflow-hidden"
      >
        {/* Video Container */}
        <Box className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            src={videoData.url}
            poster={videoData.thumbnail}
            className="w-full h-full object-cover"
            onClick={togglePlay}
          />

          {/* Video Overlay Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                variants={controlsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
              >
                {/* Top Bar - Video Info */}
                <Box className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <Box className="flex-1">
                    <Typography
                      variant="h6"
                      className="text-white font-semibold mb-1"
                    >
                      {videoData.title}
                    </Typography>
                    <Box className="flex items-center gap-2">
                      <Chip
                        label={videoData.category}
                        size="small"
                        className="bg-white/20 text-white backdrop-blur-sm"
                      />
                      <Chip
                        label={videoData.difficulty}
                        size="small"
                        color={
                          videoData.difficulty === 'beginner' ? 'success' :
                          videoData.difficulty === 'intermediate' ? 'warning' : 'error'
                        }
                        className="backdrop-blur-sm"
                      />
                    </Box>
                  </Box>

                  {/* Gamification Stats */}
                  <Box className="flex items-center gap-2">
                    <motion.div
                      variants={meritosCounterVariants}
                      animate={showMeritosAnimation ? 'pulse' : 'visible'}
                    >
                      <Chip
                        icon={<Star className="text-gold-600" />}
                        label={`${earnedMeritos} Mëritos`}
                        className="bg-gold-100 text-gold-800 backdrop-blur-sm"
                      />
                    </motion.div>
                    
                    <motion.div
                      variants={meritosCounterVariants}
                      animate={showOndasAnimation ? 'pulse' : 'visible'}
                    >
                      <Chip
                        icon={<TrendingUp className="text-coomunity-600" />}
                        label={`${earnedOndas} Öndas`}
                        className="bg-coomunity-100 text-coomunity-800 backdrop-blur-sm"
                      />
                    </motion.div>
                  </Box>
                </Box>

                {/* Center Play Button */}
                {!isPlaying && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <IconButton
                      onClick={togglePlay}
                      className={cn(
                        'bg-white/20 backdrop-blur-sm',
                        'hover:bg-white/30 hover:scale-110',
                        'transition-all duration-200',
                        focus.visible
                      )}
                      size="large"
                    >
                      <PlayArrow className="text-white text-6xl" />
                    </IconButton>
                  </motion.div>
                )}

                {/* Bottom Controls */}
                <Box className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Progress Bar */}
                  <Box className="mb-3">
                    <motion.div
                      className="h-1 bg-white/30 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-coomunity-500 rounded-full"
                        style={{ width: progressWidth }}
                      />
                    </motion.div>
                    
                    {/* Checkpoint Markers */}
                    {videoData.gamification.checkpoints.map((checkpoint) => (
                      <Tooltip
                        key={checkpoint.id}
                        title={checkpoint.title}
                        placement="top"
                      >
                        <Box
                          className={cn(
                            'absolute w-3 h-3 rounded-full -mt-1 cursor-pointer',
                            'transform -translate-x-1/2',
                            completedCheckpoints.has(checkpoint.id)
                              ? 'bg-success-500'
                              : 'bg-white/60'
                          )}
                          style={{
                            left: `${(checkpoint.timestamp / videoData.duration) * 100}%`
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>

                  {/* Control Buttons */}
                  <Box className="flex items-center justify-between">
                    <Box className="flex items-center gap-2">
                      <IconButton
                        onClick={togglePlay}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause /> : <PlayArrow />}
                      </IconButton>

                      <Box className="flex items-center gap-2">
                        <IconButton
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? <VolumeOff /> : <VolumeUp />}
                        </IconButton>
                        <Slider
                          value={isMuted ? 0 : volume}
                          onChange={(_, value) => handleVolumeChange(value as number)}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-20"
                          sx={{
                            color: 'white',
                            '& .MuiSlider-thumb': {
                              backgroundColor: 'white',
                            },
                          }}
                        />
                      </Box>

                      <Typography variant="caption" className="text-white ml-4">
                        {formatTime(currentTime)} / {formatTime(videoData.duration)}
                      </Typography>
                    </Box>

                    <Box className="flex items-center gap-2">
                      <IconButton
                        onClick={() => setShowAchievements(true)}
                        className="text-white hover:bg-white/20"
                      >
                        <EmojiEvents />
                      </IconButton>
                      
                      <IconButton
                        onClick={() => setShowSettings(true)}
                        className="text-white hover:bg-white/20"
                      >
                        <Settings />
                      </IconButton>

                      <IconButton
                        onClick={toggleFullscreen}
                        className="text-white hover:bg-white/20"
                      >
                        {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Question Overlay */}
          <AnimatePresence>
            {showQuestion && currentQuestion && (
              <motion.div
                variants={questionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              >
                <CoomunityCard
                  variant="elevated"
                  padding="lg"
                  className="max-w-md mx-4"
                >
                  <Box className="text-center mb-4">
                    <Quiz className="text-coomunity-500 text-4xl mb-2" />
                    <Typography variant="h6" className="font-semibold">
                      Pregunta Interactiva
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      +{currentQuestion.meritosReward} Mëritos • +{currentQuestion.ondasReward} Öndas
                    </Typography>
                  </Box>

                  <Typography variant="body1" className="mb-4 font-medium">
                    {currentQuestion.question}
                  </Typography>

                  <Box className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <CoomunityButton
                        key={index}
                        variant="outline"
                        onClick={() => handleQuestionAnswer(currentQuestion.id, index)}
                        className="w-full justify-start text-left"
                      >
                        <Box className="flex items-center gap-2">
                          <RadioButtonUnchecked className="w-4 h-4" />
                          {option}
                        </Box>
                      </CoomunityButton>
                    ))}
                  </Box>

                  <Box className="mt-4 p-3 bg-info-50 rounded-lg">
                    <Box className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-info-600 mt-0.5" />
                      <Typography variant="caption" className="text-info-700">
                        Tómate tu tiempo para reflexionar. Esta pregunta te ayudará a consolidar el aprendizaje.
                      </Typography>
                    </Box>
                  </Box>
                </CoomunityCard>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Video Information Panel */}
        <Box className="p-6">
          <Box className="flex items-start gap-4">
            <Avatar
              src={videoData.instructor.avatar}
              alt={videoData.instructor.name}
              className="w-12 h-12"
            />
            
            <Box className="flex-1">
              <Typography variant="h6" className="font-semibold mb-1">
                {videoData.instructor.name}
              </Typography>
              
              <Box className="flex flex-wrap gap-1 mb-2">
                {videoData.instructor.specialties.map((specialty) => (
                  <Chip
                    key={specialty}
                    label={specialty}
                    size="small"
                    variant="outlined"
                    className="text-xs"
                  />
                ))}
              </Box>

              <Typography variant="body2" className="text-gray-600 mb-3">
                {videoData.description}
              </Typography>

              {/* Progress Indicators */}
              <Box className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Box className="text-center">
                  <Typography variant="h6" className="font-bold text-coomunity-600">
                    {Math.round((currentTime / videoData.duration) * 100)}%
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Progreso
                  </Typography>
                </Box>
                
                <Box className="text-center">
                  <Typography variant="h6" className="font-bold text-success-600">
                    {completedCheckpoints.size}/{videoData.gamification.checkpoints.length}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Checkpoints
                  </Typography>
                </Box>
                
                <Box className="text-center">
                  <Typography variant="h6" className="font-bold text-gold-600">
                    {earnedMeritos}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Mëritos
                  </Typography>
                </Box>
                
                <Box className="text-center">
                  <Typography variant="h6" className="font-bold text-coomunity-600">
                    {earnedOndas}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    Öndas
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CoomunityCard>

      {/* Achievements Dialog */}
      <Dialog
        open={showAchievements}
        onClose={() => setShowAchievements(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex items-center gap-2">
            <EmojiEvents className="text-gold-500" />
            Logros Desbloqueados
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-3">
            {videoData.gamification.achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={cn(
                  'border-2',
                  achievement.isUnlocked
                    ? 'border-gold-200 bg-gold-50'
                    : 'border-gray-200 bg-gray-50'
                )}
              >
                <CardContent className="p-4">
                  <Box className="flex items-center gap-3">
                    <Box
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center',
                        achievement.isUnlocked
                          ? 'bg-gold-500 text-white'
                          : 'bg-gray-300 text-gray-500'
                      )}
                    >
                      <Typography variant="h6">
                        {achievement.icon}
                      </Typography>
                    </Box>
                    
                    <Box className="flex-1">
                      <Typography
                        variant="subtitle1"
                        className={cn(
                          'font-semibold',
                          achievement.isUnlocked ? 'text-gold-800' : 'text-gray-600'
                        )}
                      >
                        {achievement.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={cn(
                          achievement.isUnlocked ? 'text-gold-700' : 'text-gray-500'
                        )}
                      >
                        {achievement.description}
                      </Typography>
                      <Typography variant="caption" className="text-gold-600">
                        +{achievement.meritosReward} Mëritos
                      </Typography>
                    </Box>

                    {achievement.isUnlocked && (
                      <CheckCircle className="text-success-500" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EnhancedVideoPlayer; 