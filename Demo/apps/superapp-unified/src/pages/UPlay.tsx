import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Button,
  useMediaQuery,
  Badge,
  useTheme,
  Icon,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
  PlayArrow,
  Dashboard,
  VideoLibrary,
  EmojiEvents,
  Groups,
  TrendingUp,
  Diamond,
  Bolt,
  Star,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import UPlayEnhancedDashboard from '../components/modules/uplay/UPlayEnhancedDashboard';
import UPlayAdvancedVideoPlayer from '../components/modules/uplay/UPlayAdvancedVideoPlayer';
import UPlayInteractiveLibrary from '../components/modules/uplay/UPlayInteractiveLibrary';
import UPlayAchievementSystem from '../components/modules/uplay/UPlayAchievementSystem';
import UPlayStudyRooms from '../components/modules/uplay/UPlayStudyRooms';

// Contexts & Hooks
import { useAuth } from '../contexts/AuthContext';
import { useDynamicTheme } from '../context/DynamicThemeContext';

interface HeaderStatProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

// Header Stats Component
const HeaderStat: React.FC<HeaderStatProps> = ({ icon, value, label }) => (
  <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.1 }}>
    <Icon component={icon} sx={{ fontSize: 32, color: 'var(--uplay-blue-300)' }} />
    <div>
      <Typography className="text-xl font-bold text-white">{value}</Typography>
      <Typography className="text-sm text-gray-400">{label}</Typography>
    </div>
  </motion.div>
);

// Main UPlay Header
const UPlayHeader = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return (
    <div className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--uplay-blue-900)] to-[var(--uplay-blue-950)] border border-[var(--uplay-blue-800)] shadow-2xl shadow-black/30">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute inset-0 bg-spotlight-gradient-2 animate-pulse-slow" />
      <div className="relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography
            variant={isMobile ? "h3" : "h2"}
            component="h1"
            className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400"
          >
            Universo ÜPlay
          </Typography>
          <Typography className="max-w-2xl mx-auto mt-2 text-lg text-gray-300">
            Tu centro de mando para el aprendizaje gamificado. Sumérgete en el conocimiento, completa desafíos y cosecha recompensas.
          </Typography>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeaderStat icon={Diamond} value="340" label="Mëritos" />
          <HeaderStat icon={Bolt} value="125" label="Öndas" />
          <HeaderStat icon={Star} value="12" label="Logros" />
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            className="!mt-8 !rounded-full !px-8 !py-3 !font-bold !text-white !bg-gradient-to-r !from-[var(--uplay-blue-500)] !to-[var(--uplay-blue-600)] hover:!shadow-lg hover:!shadow-[var(--uplay-blue-500)]/40 transition-shadow"
          >
            Continuar Aventura
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

const tabs = [
  { label: 'Dashboard', icon: <Dashboard />, component: <UPlayEnhancedDashboard /> },
  { label: 'Videoteca', icon: <VideoLibrary />, component: <UPlayInteractiveLibrary />, notifications: 5 },
  { label: 'Logros', icon: <EmojiEvents />, component: <UPlayAchievementSystem /> },
  { label: 'Salas de Estudio', icon: <Groups />, component: <UPlayStudyRooms /> },
];

const UPlay: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container maxWidth="xl" className="py-4 md:py-8">
      <div
        className="grid gap-8"
        style={{
          gridTemplateAreas: `
            'header'
            'tabs'
            'content'
          `,
          gridTemplateRows: 'auto auto 1fr',
        }}
      >
        <Box sx={{ gridArea: 'header' }}>
          <UPlayHeader />
        </Box>

        {/* Professional Tabs Navigation */}
        <Box sx={{ gridArea: 'tabs', display: 'flex', justifyContent: 'center' }}>
          <div className="relative flex p-1 space-x-1 rounded-full bg-[var(--uplay-blue-950)] border border-[var(--uplay-blue-800)]">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(index)}
                className={`${activeTab === index ? '' : 'hover:text-white/60'} relative rounded-full px-4 py-2 text-sm font-medium text-white transition focus-visible:outline-2`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {activeTab === index && (
                  <motion.span
                    layoutId="uplay_tab_bubble"
                    className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--uplay-blue-600)] to-[var(--uplay-blue-500)]"
                    style={{ borderRadius: 9999 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-20 flex items-center space-x-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.notifications && (
                    <Badge badgeContent={tab.notifications} color="error" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </Box>

        <Box sx={{ gridArea: 'content' }} className="uplay-card bg-[var(--uplay-blue-950)]/50 border border-[var(--uplay-blue-800)] rounded-3xl p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {tabs[activeTab].component}
            </motion.div>
          </AnimatePresence>
        </Box>
      </div>
    </Container>
  );
};

export default UPlay;
