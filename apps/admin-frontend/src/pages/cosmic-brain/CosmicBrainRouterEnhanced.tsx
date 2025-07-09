/**
 * 🌌 CosmicBrainRouter Component - Enhanced Version
 * 
 * Router especializado para el AI Cosmic Brain con lazy loading,
 * transiciones suaves y gestión de estado avanzada.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Navegación intuitiva para todo el equipo
 * - Ayni: Balance entre funcionalidad y simplicidad
 * - Neguentropía: Estructura clara de navegación
 * - Metanöia: Evolución continua de la experiencia
 */

import React, { Suspense, useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  alpha,
  Typography,
  Paper
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  Assignment,
  Psychology,
  AutoAwesome,
  Timeline
} from '@mui/icons-material';

// Lazy loaded components
const CosmicBrainDashboard = React.lazy(() => import('./CosmicBrainDashboard'));
const MetricsTab = React.lazy(() => import('./MetricsTab'));
const MissionsTab = React.lazy(() => import('./MissionsTab'));
const HarmonyTab = React.lazy(() => import('./HarmonyTab'));

// ============================================================================
// 🎯 Types & Interfaces
// ============================================================================

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType;
  component: React.ComponentType;
  path: string;
  description: string;
  color: string;
}

interface CosmicBrainRouterProps {
  initialTab?: string;
  onTabChange?: (tabId: string) => void;
}

// ============================================================================
// 🎨 Tab Configuration
// ============================================================================

const TAB_CONFIG: TabConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Dashboard,
    component: CosmicBrainDashboard,
    path: '/admin/cosmic-brain/dashboard',
    description: 'Overview of all guardians and system status',
    color: '#1976d2'
  },
  {
    id: 'metrics',
    label: 'Metrics',
    icon: Analytics,
    component: MetricsTab,
    path: '/admin/cosmic-brain/metrics',
    description: 'Detailed performance and philosophy metrics',
    color: '#9c27b0'
  },
  {
    id: 'missions',
    label: 'Missions',
    icon: Assignment,
    component: MissionsTab,
    path: '/admin/cosmic-brain/missions',
    description: 'Active missions and assignments',
    color: '#ff9800'
  },
  {
    id: 'harmony',
    label: 'Harmony',
    icon: Psychology,
    component: HarmonyTab,
    path: '/admin/cosmic-brain/harmony',
    description: 'Team harmony and philosophy alignment',
    color: '#4caf50'
  }
];

// ============================================================================
// 🎯 Main Component
// ============================================================================

const CosmicBrainRouterEnhanced: React.FC<CosmicBrainRouterProps> = ({
  initialTab = 'dashboard',
  onTabChange
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // 🔄 Tab Management
  // ============================================================================

  const handleTabChange = async (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === activeTab) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate component loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setActiveTab(newValue);
      
      if (onTabChange) {
        onTabChange(newValue);
      }
      
      // Update URL without page reload
      const tabConfig = TAB_CONFIG.find(tab => tab.id === newValue);
      if (tabConfig) {
        window.history.pushState({}, '', tabConfig.path);
      }
    } catch (err) {
      setError('Failed to load tab content');
      console.error('Tab change error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 🎭 Effects
  // ============================================================================

  useEffect(() => {
    // Preload critical components
    const preloadComponents = async () => {
      try {
        await Promise.all([
          import('./CosmicBrainDashboard'),
          import('./MetricsTab')
        ]);
      } catch (err) {
        console.warn('Failed to preload components:', err);
      }
    };
    
    preloadComponents();
  }, []);

  // ============================================================================
  // 🎨 Render Methods
  // ============================================================================

  const renderTabContent = () => {
    const activeTabConfig = TAB_CONFIG.find(tab => tab.id === activeTab);
    
    if (!activeTabConfig) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Tab configuration not found for: {activeTab}
        </Alert>
      );
    }

    const TabComponent = activeTabConfig.component;
    
    return (
      <Fade in={!isLoading} timeout={500}>
        <Box sx={{ mt: 3 }}>
          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                  gap: 2
                }}
              >
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary">
                  Loading {activeTabConfig.label}...
                </Typography>
              </Box>
            }
          >
            <TabComponent />
          </Suspense>
        </Box>
      </Fade>
    );
  };

  const renderLoadingOverlay = () => (
    <Fade in={isLoading}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          zIndex: 1000
        }}
      >
        <CircularProgress size={30} />
      </Box>
    </Fade>
  );

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, pb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AutoAwesome sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                AI Cosmic Brain
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Portal Visual del Sistema de Inteligencia Artificial
              </Typography>
            </Box>
          </Box>
          
          {/* Tab Description */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {TAB_CONFIG.find(tab => tab.id === activeTab)?.description}
            </Typography>
          </Box>
        </Box>

        {/* Enhanced Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
            },
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: 'translateY(-1px)'
              },
              '&.Mui-selected': {
                fontWeight: 'bold',
                color: theme.palette.primary.main
              }
            }
          }}
        >
          {TAB_CONFIG.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <Tab
                key={tab.id}
                value={tab.id}
                label={tab.label}
                icon={<TabIcon />}
                iconPosition="start"
                sx={{
                  color: activeTab === tab.id ? tab.color : 'text.secondary',
                  borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : 'none'
                }}
              />
            );
          })}
        </Tabs>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tab Content */}
      <Box sx={{ position: 'relative' }}>
        {renderTabContent()}
        {renderLoadingOverlay()}
      </Box>
    </Box>
  );
};

export default CosmicBrainRouterEnhanced;
