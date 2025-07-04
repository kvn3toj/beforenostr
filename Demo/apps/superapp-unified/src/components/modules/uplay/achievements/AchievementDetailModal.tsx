import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { EmojiEvents, Star, School, Group, LocalFireDepartment, VideoLibrary } from '@mui/icons-material';

interface Achievement {
  id: string;
  title: string;
  icon: string;
  category: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  progress: number;
  total: number;
  reward: string;
  isNew?: boolean;
}

interface AchievementDetailModalProps {
  open: boolean;
  onClose: () => void;
  achievement: Achievement | null;
}

const rarityLabels: Record<string, string> = {
  common: 'Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
  mythic: 'Mítico',
};

const rarityGradients: Record<string, string> = {
  common: 'linear-gradient(90deg, #a1a1aa 0%, #d1d5db 100%)',
  rare: 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)',
  epic: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
  legendary: 'linear-gradient(90deg, #bfae60 0%, #e5e4e2 100%)',
  mythic: 'linear-gradient(90deg, #6366f1 0%, #e0e7ff 100%)',
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Learning': return <School fontSize="small" />;
    case 'Social': return <Group fontSize="small" />;
    case 'Streak': return <LocalFireDepartment fontSize="small" />;
    case 'Mastery': return <EmojiEvents fontSize="small" />;
    case 'Special': return <Star fontSize="small" />;
    default: return <VideoLibrary fontSize="small" />;
  }
};

const AchievementDetailModal: React.FC<AchievementDetailModalProps> = ({ open, onClose, achievement }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  if (!achievement) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 6,
          background: 'linear-gradient(120deg, rgba(36,41,70,0.98) 0%, rgba(108,92,231,0.98) 60%, rgba(160,174,192,0.98) 100%)',
          boxShadow: '0 8px 32px 0 rgba(99,102,241,0.22)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          color: '#fff',
          overflow: 'hidden',
        },
      }}
      aria-labelledby="achievement-detail-title"
    >
      <DialogTitle id="achievement-detail-title" sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        fontWeight: 700,
        fontSize: isMobile ? 22 : 26,
        background: rarityGradients[achievement.rarity],
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textFillColor: 'transparent',
        mb: 0,
      }}>
        <img
          src={achievement.icon}
          alt={achievement.title}
          width={isMobile ? 36 : 48}
          height={isMobile ? 36 : 48}
          style={{ borderRadius: 12, marginRight: 8, background: '#232946' }}
        />
        {achievement.title}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        {/* Rareza y categorías */}
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <Chip
            label={rarityLabels[achievement.rarity]}
            sx={{
              background: rarityGradients[achievement.rarity],
              color: '#232946',
              fontWeight: 700,
              fontSize: 15,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
            }}
          />
          {achievement.category.map((cat) => (
            <Chip
              key={cat}
              icon={getCategoryIcon(cat)}
              label={cat}
              sx={{
                background: 'rgba(36,41,70,0.7)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                boxShadow: '0 1px 4px 0 rgba(99,102,241,0.08)',
              }}
            />
          ))}
        </Box>
        {/* Progreso */}
        <Box mb={2}>
          <Typography fontWeight={600} fontSize={15} mb={0.5} color="#bdbdbd">
            Progreso
          </Typography>
          <Box sx={{ width: '100%', background: '#232946', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${(achievement.progress / achievement.total) * 100}%`,
                height: 12,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #2563eb, #6c5ce7)',
                position: 'relative',
                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" mt={0.5}>
            <Typography fontSize={14} color="#fff">{achievement.progress}/{achievement.total}</Typography>
            <Typography fontSize={14} color="#a5b4fc" fontWeight={700}>{achievement.reward}</Typography>
          </Box>
        </Box>
        {/* Descripción (mock) */}
        <Typography fontSize={15} color="#e0e7ff" mb={2}>
          "Este logro representa un hito importante en tu viaje. Sigue explorando, aprendiendo y contribuyendo al Bien Común para desbloquear nuevas recompensas cósmicas."
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{
          background: 'linear-gradient(90deg, #6366f1 0%, #2563eb 100%)',
          color: '#fff',
          fontWeight: 700,
          borderRadius: 3,
          px: 3,
          py: 1.2,
          boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
          '&:hover': {
            background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
          },
        }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AchievementDetailModal;
