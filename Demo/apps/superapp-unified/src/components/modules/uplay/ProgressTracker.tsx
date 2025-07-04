import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as ProgressIcon,
  CheckCircle,
  Diamond,
  Bolt,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Types for the tracker of progress
interface ProgressData {
  currentTime: number;
  duration: number;
  questionsAnswered: number;
  totalQuestions: number;
  correctAnswers: number;
  meritosEarned: number;
  ondasEarned: number;
}

interface ProgressTrackerProps {
  progress: ProgressData;
  visible?: boolean;
}

const progressVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
};

const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

interface CircularProgressProps {
  value: number;
  label: string;
  color: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value, label, color }) => (
  <Box sx={{ position: 'relative', width: 70, height: 70 }}>
    <motion.svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="35" cy="35" r="32" fill="none" stroke="var(--uplay-blue-900)" strokeWidth="6" />
      <motion.circle
        cx="35"
        cy="35"
        r="32"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="201" // 2 * PI * 32
        strokeDashoffset={201 - (201 * value) / 100}
        initial={{ strokeDashoffset: 201 }}
        animate={{ strokeDashoffset: 201 - (201 * value) / 100 }}
        transition={{ duration: 1 }}
      />
    </motion.svg>
    <Box
      sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h6" className="font-bold text-white">{`${Math.round(value)}%`}</Typography>
      <Typography variant="caption" className="text-gray-400 -mt-1">{label}</Typography>
    </Box>
  </Box>
);

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  visible = true,
}) => {
  if (!visible) return null;

  const videoProgress = progress.duration > 0 ? (progress.currentTime / progress.duration) * 100 : 0;
  const questionsProgress = progress.totalQuestions > 0 ? (progress.questionsAnswered / progress.totalQuestions) * 100 : 0;
  const accuracy = progress.questionsAnswered > 0 ? (progress.correctAnswers / progress.questionsAnswered) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="absolute top-4 right-4 z-50 w-80"
      variants={progressVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="relative w-full rounded-2xl overflow-hidden bg-[var(--uplay-blue-950)] border border-[var(--uplay-blue-800)] p-4 shadow-2xl shadow-black/30">
        <div className="absolute inset-0 bg-cinematic-dots opacity-[0.03]" />

        <motion.div variants={itemVariant} className="flex items-center mb-4">
          <ProgressIcon className="mr-2 text-[var(--uplay-blue-300)]" />
          <Typography variant="h6" className="font-bold text-white">Progreso en Vivo</Typography>
        </motion.div>

        <Stack spacing={3}>
          {/* Progress Bars */}
          <motion.div variants={itemVariant}>
            <div className="flex justify-between mb-1">
              <Typography variant="caption" className="text-gray-400">Video</Typography>
              <Typography variant="caption" className="text-gray-400">{formatTime(progress.currentTime)} / {formatTime(progress.duration)}</Typography>
            </div>
            <LinearProgress
              variant="determinate"
              value={videoProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'var(--uplay-blue-900)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, var(--uplay-blue-500), var(--uplay-blue-300))',
                }
              }}
            />
          </motion.div>
          {progress.totalQuestions > 0 && (
            <motion.div variants={itemVariant}>
              <div className="flex justify-between mb-1">
                <Typography variant="caption" className="text-gray-400">Preguntas</Typography>
                <Typography variant="caption" className="text-gray-400">{progress.questionsAnswered} / {progress.totalQuestions}</Typography>
              </div>
              <LinearProgress
                variant="determinate"
                value={questionsProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'var(--uplay-blue-900)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                  }
                }}
              />
            </motion.div>
          )}

          {/* Stats and Rewards */}
          <motion.div variants={itemVariant} className="flex justify-around items-center pt-2">
            {progress.questionsAnswered > 0 && (
               <CircularProgress value={accuracy} label="Precisión" color="var(--uplay-green-500)" />
            )}

            <Stack spacing={1} className="text-center">
              <Typography variant="caption" className="text-gray-400">Recompensas</Typography>
              {progress.meritosEarned > 0 && (
                <Chip
                  icon={<Diamond className="!text-sm !text-amber-300" />}
                  label={`${progress.meritosEarned}`}
                  size="small"
                  className="!bg-amber-500/20 !text-amber-300 !font-bold"
                />
              )}
              {progress.ondasEarned > 0 && (
                <Chip
                  icon={<Bolt className="!text-sm !text-cyan-300" />}
                  label={`${progress.ondasEarned}`}
                  size="small"
                  className="!bg-cyan-500/20 !text-cyan-300 !font-bold"
                />
              )}
            </Stack>
          </motion.div>
        </Stack>
      </div>
    </motion.div>
  );
};

export default ProgressTracker;
