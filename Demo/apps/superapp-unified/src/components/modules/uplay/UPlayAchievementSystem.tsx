import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  School,
  Group,
  LocalFireDepartment,
  VideoLibrary,
  WorkspacePremium,
  MilitaryTech,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../common/NotificationSystem';

// Type definition for Achievements
interface Achievement {
  id: string;
  title: string;
  category: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  progress: number;
  total: number;
  reward: string;
  isNew?: boolean;
}

// Rarity styles mapping
const rarityStyles = {
  common: {
    bg: 'from-gray-800 to-gray-900',
    border: 'border-gray-600',
    shadow: 'hover:shadow-gray-500/20',
    glow: 'group-hover:from-gray-500/50',
    badge: 'bg-gray-500 text-white',
    icon: <WorkspacePremium />,
  },
  rare: {
    bg: 'from-blue-900 to-indigo-950',
    border: 'border-blue-700',
    shadow: 'hover:shadow-blue-500/30',
    glow: 'group-hover:from-blue-500/50',
    badge: 'bg-blue-500 text-white',
    icon: <MilitaryTech />,
  },
  epic: {
    bg: 'from-purple-900 to-violet-950',
    border: 'border-purple-700',
    shadow: 'hover:shadow-purple-500/40',
    glow: 'group-hover:from-purple-400/60',
    badge: 'bg-purple-600 text-white',
    icon: <EmojiEvents />,
  },
  legendary: {
    bg: 'from-amber-900 to-orange-950',
    border: 'border-amber-600',
    shadow: 'hover:shadow-amber-500/50',
    glow: 'group-hover:from-amber-400/70',
    badge: 'bg-amber-500 text-white',
    icon: <Star />,
  },
  mythic: {
    bg: 'from-pink-950 to-rose-950',
    border: 'border-rose-600',
    shadow: 'hover:shadow-rose-400/60',
    glow: 'group-hover:from-rose-400/80',
    badge: 'bg-rose-500 text-white animate-pulse',
    icon: <LocalFireDepartment />,
  },
};

const CinematicAchievementCard: React.FC<Achievement> = ({ title, category, rarity, progress, total, reward, isNew }) => {
  const styles = rarityStyles[rarity];
  const isUnlocked = progress >= total;

  return (
    <motion.div
      className={`group relative p-5 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${styles.border} ${styles.shadow} ${isUnlocked ? `bg-gradient-to-br ${styles.bg}` : 'bg-gray-900'}`}
      whileHover={{ y: -8, scale: 1.03 }}
      layout
    >
      {/* Glow effect */}
      <div className={`absolute -inset-px rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${styles.glow} to-transparent`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <Typography variant="h6" className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{title}</Typography>
            <div className="flex flex-wrap gap-1 mt-1">
              {category.map(cat => (
                <Chip key={cat} label={cat} size="small" className="text-xs !bg-white/10 !text-gray-300" />
              ))}
            </div>
          </div>
          <div className={`text-4xl ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
            {styles.icon}
          </div>
        </div>

        <div className="flex-grow my-4">
          <Typography variant="body2" className="text-gray-400">Recompensa: <span className="font-bold text-gray-300">{reward}</span></Typography>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/30 rounded-full h-2.5">
          <motion.div
            className={`h-2.5 rounded-full ${isUnlocked ? styles.badge : 'bg-gray-600'}`}
            initial={{ width: 0 }}
            animate={{ width: `${(progress / total) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <Typography variant="caption" className="text-gray-500">{isUnlocked ? 'Completado' : 'Progreso'}</Typography>
          <Typography variant="caption" className="font-bold text-gray-400">{progress}/{total}</Typography>
        </div>
      </div>

      {isUnlocked && (
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${styles.badge} opacity-50`}
              style={{
                width: Math.random() * 3,
                height: Math.random() * 3,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const UPlayAchievementSystem: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { showAchievement } = useNotifications();

  const allAchievements: Achievement[] = [
    { id: '1', title: 'Primeros Pasos Cósmicos', category: ['Onboarding'], rarity: 'common', progress: 5, total: 5, reward: '+10 Mëritos', isNew: true },
    { id: '2', title: 'Maratón de Sabiduría', category: ['Learning', 'Streak'], rarity: 'rare', progress: 7, total: 10, reward: '+50 Mëritos' },
    { id: '3', title: 'Conector Social', category: ['Social'], rarity: 'rare', progress: 25, total: 50, reward: '+30 Öndas' },
    { id: '4', title: 'Maestro del Debate', category: ['Social', 'Mastery'], rarity: 'epic', progress: 8, total: 10, reward: '+100 Mëritos', isNew: true },
    { id: '5', title: 'Racha de Fuego', category: ['Streak'], rarity: 'epic', progress: 30, total: 30, reward: 'Título: "El Incansable"' },
    { id: '6', title: 'Arquitecto del Conocimiento', category: ['Mastery', 'Learning'], rarity: 'legendary', progress: 15, total: 50, reward: '+500 Mëritos' },
    { id: '7', title: 'Explorador Mítico', category: ['Special', 'Learning'], rarity: 'mythic', progress: 1, total: 1, reward: 'Acceso a Zona Secreta', isNew: true },
    { id: '8', title: 'Coleccionista de Joyas', category: ['Mastery'], rarity: 'legendary', progress: 95, total: 100, reward: '+1000 Mëritos' },
  ];

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

  return (
    <Box sx={{ p: isMobile ? 2 : 4, color: 'white' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" className="font-bold text-center">Últimos Logros</Typography>
        <Typography className="text-center text-gray-400 mb-4">¡Tus hazañas más recientes!</Typography>
        <div className="flex overflow-x-auto space-x-4 p-4 -m-4">
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
