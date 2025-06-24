import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  School,
  Group,
  LocalFireDepartment,
  VideoLibrary,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../common/NotificationSystem';
import CinematicAchievementCard from './achievements/CinematicAchievementCard';
import AchievementNotification from './notifications/AchievementNotification';

// Type definition for Achievements
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

const UPlayAchievementSystem: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [notifiedAchievement, setNotifiedAchievement] = useState<Achievement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    // Persistencia opcional con localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('uplay_achievement_sound');
      return stored === null ? true : stored === 'true';
    }
    return true;
  });

  // Mock Data
  const allAchievements: Achievement[] = [
    { id: '1', title: 'Primeros Pasos Cósmicos', icon: 'https://placehold.co/64x64/7e22ce/ffffff?text=PPC', category: ['Onboarding'], rarity: 'common', progress: 5, total: 5, reward: '+10 Mëritos', isNew: true },
    { id: '2', title: 'Maratón de Sabiduría', icon: 'https://placehold.co/64x64/166534/ffffff?text=MS', category: ['Learning', 'Streak'], rarity: 'rare', progress: 7, total: 10, reward: '+50 Mëritos' },
    { id: '3', title: 'Conector Social', icon: 'https://placehold.co/64x64/1d4ed8/ffffff?text=CS', category: ['Social'], rarity: 'rare', progress: 25, total: 50, reward: '+30 Öndas' },
    { id: '4', title: 'Maestro del Debate', icon: 'https://placehold.co/64x64/be123c/ffffff?text=MD', category: ['Social', 'Mastery'], rarity: 'epic', progress: 8, total: 10, reward: '+100 Mëritos', isNew: true },
    { id: '5', title: 'Racha de Fuego', icon: 'https://placehold.co/64x64/ea580c/ffffff?text=RF', category: ['Streak'], rarity: 'epic', progress: 30, total: 30, reward: 'Título: "El Incansable"' },
    { id: '6', title: 'Arquitecto del Conocimiento', icon: 'https://placehold.co/64x64/fbbf24/000000?text=AC', category: ['Mastery', 'Learning'], rarity: 'legendary', progress: 15, total: 50, reward: '+500 Mëritos' },
    { id: '7', title: 'Explorador Mítico', icon: 'https://placehold.co/64x64/f43f5e/ffffff?text=EM', category: ['Special', 'Learning'], rarity: 'mythic', progress: 1, total: 1, reward: 'Acceso a Zona Secreta', isNew: true },
    { id: '8', title: 'Coleccionista de Joyas', icon: 'https://placehold.co/64x64/facc15/000000?text=CJ', category: ['Mastery'], rarity: 'legendary', progress: 95, total: 100, reward: '+1000 Mëritos' },
  ];

  const handleTestNotification = () => {
    const testAchievement = allAchievements.find(a => a.id === '4');
    if (testAchievement) {
      setNotifiedAchievement(testAchievement);
    }
  };

  const categories = ['all', 'Onboarding', 'Learning', 'Social', 'Streak', 'Mastery', 'Special'];

  const recentAchievements = allAchievements.filter(a => a.isNew);
  const galleryAchievements = allAchievements
    .filter(a => !a.isNew)
    .filter(a => categoryFilter === 'all' || a.category.includes(categoryFilter));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Learning': return <School />;
      case 'Social': return <Group />;
      case 'Streak': return <LocalFireDepartment />;
      case 'Mastery': return <EmojiEvents />;
      case 'Special': return <Star />;
      default: return <VideoLibrary />;
    }
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      localStorage.setItem('uplay_achievement_sound', String(!prev));
      return !prev;
    });
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4, color: 'white', position: 'relative' }}>
      {/* Control de sonido en la esquina superior derecha */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <Button
          onClick={toggleSound}
          variant="outlined"
          size="small"
          sx={{ minWidth: 0, p: 1, borderRadius: '50%', background: 'rgba(0,0,0,0.3)' }}
          aria-label={soundEnabled ? 'Desactivar sonido de celebración' : 'Activar sonido de celebración'}
        >
          {soundEnabled ? <VolumeUp /> : <VolumeOff />}
        </Button>
      </Box>
      <AnimatePresence>
        {notifiedAchievement && (
          <AchievementNotification
            achievement={notifiedAchievement}
            onClose={() => setNotifiedAchievement(null)}
            soundEnabled={soundEnabled}
          />
        )}
      </AnimatePresence>

      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" className="font-bold">Últimos Logros</Typography>
        <Typography className="text-gray-400 mb-4">¡Tus hazañas más recientes!</Typography>

        <Button variant="contained" onClick={handleTestNotification} sx={{ mb: 2 }}>
          Test Notificación de Logro
        </Button>

        <div className="flex overflow-x-auto space-x-4 p-4 -m-4 justify-center">
          {recentAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className="min-w-[300px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CinematicAchievementCard {...achievement} />
            </motion.div>
          ))}
        </div>
      </Box>

      <Box>
        <Typography variant="h4" className="font-bold text-center mt-8">Galería Principal</Typography>
        <Typography className="text-center text-gray-400 mb-4">Explora todos los desafíos.</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 4 }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              icon={cat !== 'all' ? getCategoryIcon(cat) : undefined}
              label={cat === 'all' ? 'Todos' : cat}
              clickable
              onClick={() => setCategoryFilter(cat)}
              sx={{
                background: categoryFilter === cat ? 'var(--uplay-blue-600, #2563eb)' : 'rgba(255, 255, 255, 0.1)',
                color: categoryFilter === cat ? '#fff' : 'var(--secondary-text, #ccc)',
                transition: 'all 0.3s',
                '&:hover': {
                  background: categoryFilter === cat ? 'var(--uplay-blue-500, #3b82f6)' : 'rgba(255, 255, 255, 0.2)',
                },
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />
          ))}
        </Box>

        <Grid container spacing={3}>
          <AnimatePresence>
            {galleryAchievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <CinematicAchievementCard {...achievement} />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Box>
    </Box>
  );
};

export default UPlayAchievementSystem;
