/**
 * 🌌 CosmicBrainDashboard Component - Enhanced Version
 * 
 * Dashboard principal del AI Cosmic Brain para el Gamifier Admin.
 * Versión mejorada con componentes avanzados y visualizaciones en tiempo real.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Dashboard centralizado para el equipo
 * - Ayni: Balance entre información y acción
 * - Neguentropía: Organización clara y estructurada
 * - Metanöia: Evolución continua del sistema
 */

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Alert, 
  Skeleton,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  useTheme,
  alpha,
  Stack,
  Fade
} from '@mui/material';
import { 
  Refresh, 
  TrendingUp, 
  Warning, 
  CheckCircle,
  Psychology,
  Groups,
  Assignment,
  AutoAwesome,
  Speed,
  Insights,
  Timeline,
  Notifications
} from '@mui/icons-material';

// Import enhanced components
import GuardianStatusCardEnhanced from '../../components/cosmic-brain/GuardianStatusCardEnhanced';
import RealTimeMetricsVisualizerEnhanced from '../../components/cosmic-brain/RealTimeMetricsVisualizerEnhanced';

// ============================================================================
// 🎯 Types & Interfaces
// ============================================================================

interface GuardianData {
  type: 'ARIA' | 'COSMOS' | 'EUNOIA' | 'KIRA' | 'PYTHIA' | 'THEIA';
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical' | 'offline';
  lastAnalysis: Date | null;
  criticalIssues: number;
  isActive: boolean;
  metrics?: {
    uptime: number;
    responseTime: number;
    accuracy: number;
    efficiency: number;
    philosophyAlignment: number;
    lastEvolution: Date | null;
  };
}

interface SystemMetrics {
  overallHealth: number;
  activeGuardians: number;
  totalGuardians: number;
  criticalIssues: number;
  evolutionProgress: number;
  lastEvolution: Date | null;
  uptime: number;
  philosophyAlignment: number;
}

// ============================================================================
// 🎨 Mock Data (temporal hasta integración con backend)
// ============================================================================

const mockGuardians: GuardianData[] = [
  {
    type: 'ARIA',
    name: 'ARIA',
    score: 92,
    status: 'excellent',
    lastAnalysis: new Date(Date.now() - 15 * 60 * 1000),
    criticalIssues: 0,
    isActive: true,
    metrics: {
      uptime: 99.8,
      responseTime: 145,
      accuracy: 94,
      efficiency: 89,
      philosophyAlignment: 96,
      lastEvolution: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  },
  {
    type: 'COSMOS',
    name: 'COSMOS',
    score: 88,
    status: 'good',
    lastAnalysis: new Date(Date.now() - 8 * 60 * 1000),
    criticalIssues: 1,
    isActive: true,
    metrics: {
      uptime: 98.5,
      responseTime: 203,
      accuracy: 91,
      efficiency: 85,
      philosophyAlignment: 93,
      lastEvolution: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  },
  {
    type: 'EUNOIA',
    name: 'EUNOIA',
    score: 95,
    status: 'excellent',
    lastAnalysis: new Date(Date.now() - 5 * 60 * 1000),
    criticalIssues: 0,
    isActive: true,
    metrics: {
      uptime: 99.9,
      responseTime: 128,
      accuracy: 97,
      efficiency: 92,
      philosophyAlignment: 98,
      lastEvolution: new Date(Date.now() - 1 * 60 * 60 * 1000)
    }
  },
  {
    type: 'KIRA',
    name: 'KIRA',
    score: 87,
    status: 'good',
    lastAnalysis: new Date(Date.now() - 12 * 60 * 1000),
    criticalIssues: 0,
    isActive: true,
    metrics: {
      uptime: 98.2,
      responseTime: 167,
      accuracy: 89,
      efficiency: 88,
      philosophyAlignment: 94,
      lastEvolution: new Date(Date.now() - 3 * 60 * 60 * 1000)
    }
  },
  {
    type: 'PYTHIA',
    name: 'PYTHIA',
    score: 84,
    status: 'warning',
    lastAnalysis: new Date(Date.now() - 20 * 60 * 1000),
    criticalIssues: 2,
    isActive: true,
    metrics: {
      uptime: 96.8,
      responseTime: 234,
      accuracy: 86,
      efficiency: 82,
      philosophyAlignment: 91,
      lastEvolution: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  },
  {
    type: 'THEIA',
    name: 'THEIA',
    score: 91,
    status: 'excellent',
    lastAnalysis: new Date(Date.now() - 7 * 60 * 1000),
    criticalIssues: 0,
    isActive: true,
    metrics: {
      uptime: 99.5,
      responseTime: 152,
      accuracy: 93,
      efficiency: 90,
      philosophyAlignment: 95,
      lastEvolution: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
    }
  }
];

// ============================================================================
// 🎯 Main Component
// ============================================================================

const CosmicBrainDashboardEnhanced: React.FC = () => {
  const theme = useTheme();
  const [guardians, setGuardians] = useState<GuardianData[]>(mockGuardians);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // ============================================================================
  // 🔄 Data Management
  // ============================================================================

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update guardians with slight variations
      const updatedGuardians = mockGuardians.map(guardian => ({
        ...guardian,
        score: Math.max(0, Math.min(100, guardian.score + (Math.random() - 0.5) * 5)),
        lastAnalysis: new Date()
      }));
      
      setGuardians(updatedGuardians);
      
      // Calculate system metrics
      const activeGuardians = updatedGuardians.filter(g => g.isActive).length;
      const totalCriticalIssues = updatedGuardians.reduce((sum, g) => sum + g.criticalIssues, 0);
      const averageScore = updatedGuardians.reduce((sum, g) => sum + g.score, 0) / updatedGuardians.length;
      const averagePhilosophy = updatedGuardians.reduce((sum, g) => sum + (g.metrics?.philosophyAlignment || 0), 0) / updatedGuardians.length;
      
      setSystemMetrics({
        overallHealth: averageScore,
        activeGuardians,
        totalGuardians: updatedGuardians.length,
        criticalIssues: totalCriticalIssues,
        evolutionProgress: 76 + Math.random() * 10,
        lastEvolution: new Date(Date.now() - 2 * 60 * 60 * 1000),
        uptime: 168 + Math.random() * 24,
        philosophyAlignment: averagePhilosophy
      });
      
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to refresh data');
      console.error('Refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 🎭 Effects
  // ============================================================================

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ============================================================================
  // 🎨 Render Methods
  // ============================================================================

  const renderSystemOverview = () => {
    if (!systemMetrics) return null;
    
    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AutoAwesome sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  System Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={refreshData}
                  disabled={isLoading}
                  sx={{
                    animation: isLoading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {systemMetrics.overallHealth.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System Health
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                  <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                  <Typography variant="caption" color="success.main">
                    +2.3% from last hour
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {systemMetrics.activeGuardians}/{systemMetrics.totalGuardians}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Guardians
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                  <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                  <Typography variant="caption" color="success.main">
                    All systems operational
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="warning.main">
                  {systemMetrics.criticalIssues}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Critical Issues
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                  <Warning sx={{ color: theme.palette.warning.main, fontSize: 16 }} />
                  <Typography variant="caption" color="warning.main">
                    {systemMetrics.criticalIssues > 0 ? 'Requires attention' : 'No issues'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="info.main">
                  {systemMetrics.philosophyAlignment.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Philosophy Alignment
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                  <Psychology sx={{ color: theme.palette.info.main, fontSize: 16 }} />
                  <Typography variant="caption" color="info.main">
                    CoomÜnity aligned
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderGuardianGrid = () => (
    <Grid container spacing={3}>
      {guardians.map((guardian) => (
        <Grid item xs={12} md={6} lg={4} key={guardian.type}>
          <Fade in={true} timeout={500}>
            <Box>
              <GuardianStatusCardEnhanced
                type={guardian.type}
                name={guardian.name}
                score={guardian.score}
                status={guardian.status}
                lastAnalysis={guardian.lastAnalysis}
                criticalIssues={guardian.criticalIssues}
                isActive={guardian.isActive}
                metrics={guardian.metrics}
              />
            </Box>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );

  const renderQuickActions = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<AutoAwesome />}
            onClick={() => console.log('Trigger evolution')}
            sx={{ textTransform: 'none' }}
          >
            Trigger Evolution
          </Button>
          <Button
            variant="outlined"
            startIcon={<Psychology />}
            onClick={() => console.log('Analyze philosophy')}
            sx={{ textTransform: 'none' }}
          >
            Analyze Philosophy
          </Button>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            onClick={() => console.log('View missions')}
            sx={{ textTransform: 'none' }}
          >
            View Missions
          </Button>
          <Button
            variant="outlined"
            startIcon={<Insights />}
            onClick={() => console.log('Generate report')}
            sx={{ textTransform: 'none' }}
          >
            Generate Report
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // 🎯 Main Render
  // ============================================================================

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
        <Button onClick={refreshData} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      {/* System Overview */}
      <Box sx={{ mb: 4 }}>
        {systemMetrics ? renderSystemOverview() : (
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        )}
      </Box>

      {/* Real-time Metrics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Real-time Metrics
        </Typography>
        <RealTimeMetricsVisualizerEnhanced
          onRefresh={refreshData}
          autoRefresh={true}
          refreshInterval={30000}
        />
      </Box>

      {/* Guardian Status Grid */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Guardian Status
        </Typography>
        {guardians.length > 0 ? renderGuardianGrid() : (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        {renderQuickActions()}
      </Box>
    </Box>
  );
};

export default CosmicBrainDashboardEnhanced;
