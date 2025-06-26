import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
} from '@mui/material';
import { PlayArrow, Diamond, Bolt } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { VideoItem } from '../../../../hooks/modules/uplay/useUPlayDashboard';

// Helper to validate the video item structure
const isValidVideoItem = (video: any): video is VideoItem => {
  return (
    video &&
    typeof video.id !== 'undefined' &&
    typeof video.title === 'string' &&
    typeof video.rewards === 'object' &&
    typeof video.rewards.meritos === 'number' &&
    typeof video.rewards.ondas === 'number'
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '#4caf50';
    case 'medium': return '#ff9800';
    case 'hard': return '#f44336';
    default: return '#757575';
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'Fácil';
    case 'medium': return 'Medio';
    case 'hard': return 'Difícil';
    default: return difficulty;
  }
};

export const VideoCard: React.FC<{ video: VideoItem; onPlay: (videoId: string) => void }> = ({
  video,
  onPlay
}) => {
  if (!isValidVideoItem(video)) {
    console.error('❌ VideoCard recibió un video con estructura inválida:', video);
    return (
      <Card sx={{ height: '100%', opacity: 0.5 }}>
        <CardContent>
          <Typography variant="h6" color="error">Video no disponible</Typography>
          <Typography variant="body2" color="text.secondary">Error en la estructura de datos</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(40,40,80,0.85)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(99,102,241,0.18)',
        borderRadius: 3,
        boxShadow: '0 4px 24px 0 rgba(99,102,241,0.10)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.04)',
          boxShadow: `0 12px 32px rgba(99,102,241,0.18), 0 0 24px ${getDifficultyColor(video.difficulty)}70`,
          '& .play-overlay': { opacity: 1, transform: 'scale(1)' },
        },
      }}
      onClick={() => onPlay(video.id)}
      aria-label={`Ver video: ${video.title}`}
    >
      <Box sx={{ height: 180, background: `linear-gradient(135deg, ${getDifficultyColor(video.difficulty)}30, ${getDifficultyColor(video.difficulty)}20)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>{video.thumbnail}</Typography>
        <Box className="play-overlay" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transform: 'scale(1.2)', transition: 'all 0.3s ease-in-out' }}>
          <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.1, boxShadow: '0 0 20px #ff6b6b' }} style={{ border: 'none', background: 'linear-gradient(45deg, #ff6b6b, #feca57)', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', outline: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }} aria-label="Reproducir video" onClick={(e) => { e.stopPropagation(); onPlay(video.id); }}>
            <PlayArrow style={{ fontSize: '2.5rem' }} />
          </motion.button>
        </Box>
        {video.isCompleted && <Chip label="✓ Completado" sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb 0%, #6c5ce7 100%)', color: '#fff', px: 2, py: 1, borderRadius: 2, fontSize: '0.9rem', boxShadow: '0 2px 8px 0 rgba(108,92,231,0.12)' }} />}
        <Chip label={getDifficultyLabel(video.difficulty)} size="small" sx={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(90deg, #7e22ce 0%, #2563eb 100%)', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', px: 2, py: 1, borderRadius: 2, fontSize: '0.9rem', boxShadow: '0 2px 8px 0 rgba(108,92,231,0.12)' }} />
      </Box>
      <CardContent sx={{ pb: 1, p: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap sx={{ fontWeight: 600, color: 'white' }}>{video.title}</Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2, minHeight: 40 }}>{video.description}</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="caption" color="rgba(255,255,255,0.5)">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            {video.questionsCount && ` • ${video.questionsCount} preguntas`}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" gap={1}>
            <Chip icon={<Diamond sx={{ fontSize: '16px !important', color: '#a78bfa !important' }} />} label={`${video.rewards?.meritos || 0} Mëritos`} size="small" variant="outlined" sx={{ color: '#a78bfa', borderColor: '#a78bfa', fontWeight: 600, px: 2, py: 1, minHeight: 36, borderRadius: 2 }} />
            <Chip icon={<Bolt sx={{ fontSize: '16px !important', color: '#60a5fa !important' }} />} label={`${video.rewards?.ondas || 0} Öndas`} size="small" variant="outlined" sx={{ color: '#60a5fa', borderColor: '#60a5fa', fontWeight: 600, px: 2, py: 1, minHeight: 36, borderRadius: 2 }} />
          </Box>
        </Box>
        {video.progress > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="caption" color="rgba(255,255,255,0.5)">Progreso</Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">{Math.round(video.progress)}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={video.progress} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(36,50,80,0.18)', '& .MuiLinearProgress-bar': { borderRadius: 3, background: video.isCompleted ? 'linear-gradient(90deg, #bfae60 0%, #e5e4e2 100%)' : 'linear-gradient(90deg, #2563eb 0%, #6c5ce7 100%)' } }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
