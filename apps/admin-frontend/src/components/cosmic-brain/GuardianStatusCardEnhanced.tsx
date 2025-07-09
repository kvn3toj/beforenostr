/**
 * 🌟 GuardianStatusCard Component - Enhanced Version
 * 
 * Tarjeta de estado avanzada para cada Guardian del AI Cosmic Brain.
 * Incluye métricas detalladas, visualizaciones en tiempo real y 
 * integración filosófica CoomÜnity.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Información clara para el equipo
 * - Ayni: Balance entre detalle y simplicidad
 * - Neguentropía: Organización visual armónica
 * - Metanöia: Evolución visual del estado
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Collapse,
  Grid,
  Divider,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import {
  ExpandMore,
  TrendingUp,
  TrendingDown,
  Remove,
  Psychology,
  Accessibility,
  Architecture,
  Palette,
  Code,
  Timeline,
  CheckCircle,
  Warning,
  Error,
  Offline
} from '@mui/icons-material';

// ============================================================================
// 🎯 Types & Interfaces
// ============================================================================

interface GuardianMetrics {
  uptime: number;
  responseTime: number;
  accuracy: number;
  efficiency: number;
  philosophyAlignment: number;
  lastEvolution: Date | null;
  trends?: {
    uptime: 'up' | 'down' | 'stable';
    responseTime: 'up' | 'down' | 'stable';
    accuracy: 'up' | 'down' | 'stable';
    efficiency: 'up' | 'down' | 'stable';
  };
}

interface GuardianStatusCardProps {
  type: 'ARIA' | 'COSMOS' | 'EUNOIA' | 'KIRA' | 'PYTHIA' | 'THEIA';
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical' | 'offline';
  lastAnalysis: Date | null;
  criticalIssues: number;
  isActive: boolean;
  metrics?: GuardianMetrics;
  onRefresh?: () => void;
  onViewDetails?: () => void;
}

// ============================================================================
// 🎨 Guardian Configuration
// ============================================================================

const GUARDIAN_CONFIG = {
  ARIA: {
    color: '#e91e63',
    icon: Palette,
    description: 'Frontend Artist',
    specialties: ['UI/UX', 'Responsive Design', 'Accessibility']
  },
  COSMOS: {
    color: '#9c27b0',
    icon: Architecture,
    description: 'Integration Guardian',
    specialties: ['System Integration', 'API Design', 'Data Flow']
  },
  EUNOIA: {
    color: '#3f51b5',
    icon: Psychology,
    description: 'Harmonic Design Guardian',
    specialties: ['Design Philosophy', 'User Psychology', 'Harmony']
  },
  KIRA: {
    color: '#009688',
    icon: Timeline,
    description: 'Narrative Guardian',
    specialties: ['Content Strategy', 'Storytelling', 'Communication']
  },
  PYTHIA: {
    color: '#ff9800',
    icon: Code,
    description: 'Code Quality Guardian',
    specialties: ['Code Quality', 'Performance', 'Best Practices']
  },
  THEIA: {
    color: '#4caf50',
    icon: Accessibility,
    description: 'Accessibility Guardian',
    specialties: ['Accessibility', 'Inclusive Design', 'Standards']
  }
};

const GuardianStatusCardEnhanced: React.FC<GuardianStatusCardProps> = ({
  type,
  name,
  score,
  status,
  lastAnalysis,
  criticalIssues,
  isActive,
  metrics
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const config = GUARDIAN_CONFIG[type];
  const GuardianIcon = config.icon;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return theme.palette.success.main;
      case 'good': return theme.palette.info.main;
      case 'warning': return theme.palette.warning.main;
      case 'critical': return theme.palette.error.main;
      case 'offline': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle sx={{ color: theme.palette.success.main }} />;
      case 'good': return <CheckCircle sx={{ color: theme.palette.info.main }} />;
      case 'warning': return <Warning sx={{ color: theme.palette.warning.main }} />;
      case 'critical': return <Error sx={{ color: theme.palette.error.main }} />;
      case 'offline': return <Offline sx={{ color: theme.palette.grey[500] }} />;
      default: return <Remove sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  const formatLastAnalysis = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8]
        },
        borderLeft: `4px solid ${config.color}`,
        background: `linear-gradient(135deg, ${alpha(config.color, 0.02)} 0%, ${alpha(config.color, 0.08)} 100%)`
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              backgroundColor: alpha(config.color, 0.1),
              color: config.color,
              mr: 2
            }}
          >
            <GuardianIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {config.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon(status)}
            <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <ExpandMore />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Overall Score
            </Typography>
            <Typography variant="h6" fontWeight="bold" color={getStatusColor(status)}>
              {score}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={score}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(config.color, 0.1),
              '& .MuiLinearProgress-bar': {
                backgroundColor: config.color,
                borderRadius: 4
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Last Analysis
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {formatLastAnalysis(lastAnalysis)}
          </Typography>
        </Box>

        {criticalIssues > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Critical Issues
            </Typography>
            <Chip
              label={criticalIssues}
              size="small"
              color="error"
              sx={{ minWidth: 24, height: 20 }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <Chip
            label={status.toUpperCase()}
            size="small"
            sx={{
              backgroundColor: alpha(getStatusColor(status), 0.1),
              color: getStatusColor(status),
              fontWeight: 'bold'
            }}
          />
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Specialties
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {config.specialties.map((specialty) => (
                  <Chip
                    key={specialty}
                    label={specialty}
                    size="small"
                    sx={{
                      backgroundColor: alpha(config.color, 0.1),
                      color: config.color,
                      fontSize: '0.75rem'
                    }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default GuardianStatusCardEnhanced;
