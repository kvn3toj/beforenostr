import React, { useState } from 'react';
import { Box, Container, Tabs, Tab, useTheme, Fade } from '@mui/material';
import {
  Dashboard,
  VideoLibrary,
  EmojiEvents,
  Groups,
} from '@mui/icons-material';

// ✅ UPlay Core Components (solo los esenciales)
import UPlayEnhancedDashboard from '../components/modules/uplay/UPlayGamifiedDashboard';
import UPlayInteractiveLibrary from '../components/modules/uplay/UPlayInteractiveLibrary';
import UPlayAchievementSystem from '../components/modules/uplay/UPlayAchievementSystem';
import UPlayStudyRooms from '../components/modules/uplay/UPlayStudyRooms';

// Styles
import '../styles/uplay-advanced.css';

// ✅ Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`uplay-tabpanel-${index}`}
      aria-labelledby={`uplay-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

// ✅ Simple Header Component
const UPlayHeader = () => {
  return (
    <Fade in={true} timeout={1000}>
      <div className="cosmic-header">
        <Container maxWidth="xl" className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black mb-2 text-gradient-cosmic">
                ÜPlay
              </h1>
              <p className="text-lg md:text-xl font-medium text-medium-contrast">
                Gamified Play List - Experiencia de Aprendizaje Interactiva
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass-card px-4 py-2">
                <div className="text-sm text-medium-contrast">Estado</div>
                <div className="font-bold text-gradient-blue">En Línea</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Fade>
  );
};

// ✅ Tab Configuration
const tabs = [
  {
    label: 'Dashboard',
    icon: Dashboard,
    component: <UPlayEnhancedDashboard />,
    id: 'dashboard'
  },
  {
    label: 'Videoteca',
    icon: VideoLibrary,
    component: <UPlayInteractiveLibrary />,
    notifications: 5,
    id: 'library'
  },
  {
    label: 'Logros',
    icon: EmojiEvents,
    component: <UPlayAchievementSystem />,
    id: 'achievements'
  },
  {
    label: 'Salas de Estudio',
    icon: Groups,
    component: <UPlayStudyRooms />,
    id: 'studyrooms'
  },
];

// ✅ Main UPlay Component
const UPlay: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div data-testid="uplay-page" className="min-h-screen">
      {/* ✅ Header Section */}
      <UPlayHeader />

      <Container maxWidth="xl" className="py-4 md:py-8">
        {/* ✅ Tabs Navigation */}
        <Fade in={true} timeout={1200}>
          <div className="tab-container-advanced">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`${
                  activeTab === index ? 'tab-active' : 'tab-inactive'
                } flex items-center relative`}
                aria-label={`Navegación a ${tab.label}`}
              >
                <tab.icon sx={{ fontSize: 20 }} />
                {tab.label}
                {tab.notifications && (
                  <span className="tab-badge">
                    {tab.notifications}
                  </span>
                )}
              </button>
            ))}
          </div>
        </Fade>

        {/* ✅ Tab Content */}
        <Box sx={{ mt: 3 }}>
          {tabs.map((tab, index) => (
            <TabPanel key={tab.id} value={activeTab} index={index}>
              <div className="section-background-blue animate-fade-in">
                {tab.component}
              </div>
            </TabPanel>
          ))}
        </Box>
      </Container>
    </div>
  );
};

export default UPlay;
