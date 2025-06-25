import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
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
import AchievementBar from '../ustats/components/AchievementBar';
import AchievementDetailModal from './achievements/AchievementDetailModal';

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
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

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

  // --- NUEVAS MÉTRICAS GLOBALES ---
  const totalAchievements = allAchievements.length;
  const completedAchievements = allAchievements.filter(a => a.progress >= a.total).length;
  const percentCompleted = Math.round((completedAchievements / totalAchievements) * 100);
  const rarities = ['common', 'rare', 'epic', 'legendary', 'mythic'];
  const highestRarity = rarities.reverse().find(r => allAchievements.some(a => a.rarity === r && a.progress >= a.total)) || 'common';

  const rarityColors: Record<string, string> = {
    common: 'linear-gradient(90deg, #a1a1aa 0%, #d1d5db 100%)',
    rare: 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)',
    epic: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
    legendary: 'linear-gradient(90deg, #bfae60 0%, #e5e4e2 100%)',
    mythic: 'linear-gradient(90deg, #6366f1 0%, #e0e7ff 100%)',
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 4, color: 'white', position: 'relative' }}>
      {/* --- HEADER MOTIVACIONAL Y MÉTRICAS --- */}
      <Box
        sx={{
          mb: 6,
          borderRadius: 6,
          px: isMobile ? 2 : 6,
          py: isMobile ? 3 : 5,
          background: 'linear-gradient(120deg, rgba(36,41,70,0.92) 0%, rgba(108,92,231,0.92) 60%, rgba(160,174,192,0.92) 100%)',
          boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Overlay cósmico */}
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.18) 0%, transparent 70%)',
          zIndex: 1,
        }} />
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} justifyContent="space-between" gap={4}>
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" sx={{ mb: 1, letterSpacing: 1 }}>
                🌌 Tus Logros Cósmicos
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? 15 : 18, mb: 2 }}>
                ¡Celebra tu viaje! Cada logro es un paso hacia el Bien Común y tu propia maestría.
              </Typography>
              {/* Barra de progreso global */}
              <AchievementBar
                title="Progreso Total"
                description="Logros completados en tu viaje cósmico."
                current={completedAchievements}
                target={totalAchievements}
                color="#6c5ce7"
              />
            </Box>
            {/* Métricas rápidas */}
            <Box display="flex" flexDirection={isMobile ? 'row' : 'column'} gap={isMobile ? 2 : 3} alignItems={isMobile ? 'center' : 'flex-end'} justifyContent="center">
              <Box sx={{
                minWidth: 90,
                minHeight: 70,
                px: 2,
                py: 1.5,
                borderRadius: 4,
                background: 'rgba(36,41,70,0.7)',
                boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
                textAlign: 'center',
              }}>
                <Typography variant="h5" fontWeight="bold" color="#fff">{completedAchievements}</Typography>
                <Typography fontSize={13} color="#bdbdbd">Completados</Typography>
              </Box>
              <Box sx={{
                minWidth: 90,
                minHeight: 70,
                px: 2,
                py: 1.5,
                borderRadius: 4,
                background: 'rgba(36,41,70,0.7)',
                boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
                textAlign: 'center',
              }}>
                <Typography variant="h5" fontWeight="bold" color="#fff">{percentCompleted}%</Typography>
                <Typography fontSize={13} color="#bdbdbd">Completado</Typography>
              </Box>
              <Box sx={{
                minWidth: 90,
                minHeight: 70,
                px: 2,
                py: 1.5,
                borderRadius: 4,
                background: 'rgba(36,41,70,0.7)',
                boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
                textAlign: 'center',
              }}>
                <Typography variant="h5" fontWeight="bold" color="#fff" sx={{ textTransform: 'capitalize' }}>{highestRarity}</Typography>
                <Typography fontSize={13} color="#bdbdbd">R. Máxima</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
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

        {/* --- CHIPS DE FILTRO CÓSMICOS --- */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: isMobile ? 1.5 : 2.5, mb: 4 }}>
          {categories.map((cat) => {
            const isActive = categoryFilter === cat;
            const isRarity = ['common','rare','epic','legendary','mythic'].includes(cat.toLowerCase());
            const gradient = isRarity ? rarityColors[cat.toLowerCase()] : 'linear-gradient(90deg, #232946 0%, #6366f1 100%)';
            return (
              <Tooltip key={cat} title={cat === 'all' ? 'Todos los logros' : `Filtrar por ${cat}`} arrow>
                <Chip
                  icon={cat !== 'all' ? getCategoryIcon(cat) : undefined}
                  label={<span style={{ fontWeight: 600, fontSize: isMobile ? 15 : 17 }}>{cat === 'all' ? 'Todos' : cat}</span>}
                  clickable
                  onClick={() => setCategoryFilter(cat)}
                  sx={{
                    minHeight: isMobile ? 44 : 52,
                    minWidth: isMobile ? 100 : 140,
                    px: isMobile ? 2 : 3,
                    py: isMobile ? 1 : 1.5,
                    fontSize: isMobile ? 15 : 17,
                    fontWeight: 600,
                    borderRadius: 999,
                    background: isActive ? 'linear-gradient(90deg, #6366f1 0%, #2563eb 100%)' : gradient,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
                    border: isActive ? '2.5px solid #e5e4e2' : '1.5px solid rgba(160,174,192,0.18)',
                    boxShadow: isActive ? '0 4px 16px 0 rgba(99,102,241,0.18)' : '0 2px 8px 0 rgba(99,102,241,0.10)',
                    transition: 'all 0.25s',
                    cursor: 'pointer',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #6366f1 0%, #a78bfa 100%)',
                      color: '#fff',
                      boxShadow: '0 6px 24px 0 rgba(99,102,241,0.22)',
                    },
                    '& .MuiChip-icon': {
                      color: isActive ? '#fff' : '#bdbdbd',
                      fontSize: isMobile ? 20 : 24,
                    },
                  }}
                  aria-label={cat === 'all' ? 'Mostrar todos los logros' : `Filtrar por ${cat}`}
                />
              </Tooltip>
            );
          })}
        </Box>

        {/* --- GALERÍA DE LOGROS CÓSMICA --- */}
        <Grid container spacing={isMobile ? 2 : 4} sx={{ mt: 1, mb: 2 }} justifyContent="center">
          <AnimatePresence>
            {galleryAchievements.map((achievement, idx) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 80 }}
                  whileHover={{ scale: 1.025, boxShadow: '0 8px 32px 0 rgba(99,102,241,0.22)' }}
                  style={{ borderRadius: 36, cursor: 'pointer' }}
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  {/* Overlay cósmico sutil */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    borderRadius: 36,
                    background: 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.10) 0%, transparent 70%)',
                    zIndex: 1,
                  }} />
                  {/* Badge de rareza */}
                  <div style={{
                    position: 'absolute',
                    top: 18,
                    right: 18,
                    zIndex: 2,
                    padding: '6px 18px',
                    borderRadius: 18,
                    fontWeight: 700,
                    fontSize: 14,
                    background: achievement.rarity === 'legendary' ? 'linear-gradient(90deg, #bfae60 0%, #e5e4e2 100%)' :
                                achievement.rarity === 'mythic' ? 'linear-gradient(90deg, #6366f1 0%, #e0e7ff 100%)' :
                                achievement.rarity === 'epic' ? 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)' :
                                achievement.rarity === 'rare' ? 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)' :
                                'linear-gradient(90deg, #a1a1aa 0%, #d1d5db 100%)',
                    color: '#232946',
                    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
                    border: '1.5px solid #e5e4e2',
                  }}>
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </div>
                  <CinematicAchievementCard {...achievement} />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
        {/* MODAL DE DETALLE DE LOGRO */}
        <AchievementDetailModal
          open={!!selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          achievement={selectedAchievement}
        />
      </Box>
    </Box>
  );
};

export default UPlayAchievementSystem;
