import React from 'react';
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
  Grid,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Psychology,
  Favorite,
  TrendingUp,
  Refresh,
  Settings,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material';

interface GuardianMetrics {
  health: number;
  efficiency: number;
  harmony: number;
  lastUpdate: string;
  tasksCompleted: number;
  activeConnections: number;
}

interface GuardianStatusCardProps {
  guardianId: string;
  name: string;
  type: 'Frontend Artist' | 'Harmonic Design' | 'Integration' | 'Narrative' | 'Analytics';
  status: 'active' | 'idle' | 'error' | 'maintenance';
  metrics: GuardianMetrics;
  avatar?: string;
  onRefresh?: () => void;
  onConfigure?: () => void;
  realTimeUpdates?: boolean;
}

const GuardianStatusCard: React.FC<GuardianStatusCardProps> = ({
  guardianId,
  name,
  type,
  status,
  metrics,
  avatar,
  onRefresh,
  onConfigure,
  realTimeUpdates = true
}) => {
  const theme = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'idle':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'maintenance':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle />;
      case 'idle':
        return <Warning />;
      case 'error':
        return <Error />;
      case 'maintenance':
        return <Settings />;
      default:
        return <Psychology />;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return theme.palette.success.main;
    if (health >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const formatLastUpdate = (lastUpdate: string) => {
    const now = new Date();
    const updateTime = new Date(lastUpdate);
    const diffMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Ahora';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    return `${Math.floor(diffMinutes / 60)}h`;
  };

  return (
    <Card
      sx={{
        position: 'relative',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(getStatusColor(status), 0.3)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
          border: `1px solid ${alpha(getStatusColor(status), 0.6)}`,
        },
        minHeight: 280,
      }}
    >
      {/* Status Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${getStatusColor(status)} 0%, ${alpha(getStatusColor(status), 0.6)} 100%)`,
          borderRadius: '8px 8px 0 0',
        }}
      />

      {/* Real-time Pulse Effect */}
      {realTimeUpdates && status === 'active' && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.palette.success.main,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(1.2)',
                opacity: 0.7,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        />
      )}

      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={avatar}
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <Psychology />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {type}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Actualizar métricas">
              <IconButton size="small" onClick={onRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Configurar guardian">
              <IconButton size="small" onClick={onConfigure}>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Status Chip */}
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={getStatusIcon(status)}
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            size="small"
            sx={{
              backgroundColor: alpha(getStatusColor(status), 0.1),
              color: getStatusColor(status),
              border: `1px solid ${alpha(getStatusColor(status), 0.3)}`,
              '& .MuiChip-icon': {
                color: getStatusColor(status),
              },
            }}
          />
        </Box>

        {/* Metrics */}
        <Grid container spacing={2}>
          {/* Health Metric */}
          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Salud del Sistema
                </Typography>
                <Typography variant="body2" fontWeight={600} color={getHealthColor(metrics.health)}>
                  {metrics.health}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metrics.health}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(getHealthColor(metrics.health), 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getHealthColor(metrics.health),
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Efficiency Metric */}
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Eficiencia
              </Typography>
              <Typography variant="h6" fontWeight={600} color="primary">
                {metrics.efficiency}%
              </Typography>
            </Box>
          </Grid>

          {/* Harmony Metric */}
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Armonía
              </Typography>
              <Typography variant="h6" fontWeight={600} color="secondary">
                {metrics.harmony}%
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Activity Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp fontSize="small" color="success" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tareas
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {metrics.tasksCompleted}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Favorite fontSize="small" color="error" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Conexiones
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {metrics.activeConnections}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Last Update */}
        <Box sx={{ mt: 2, pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="caption" color="text.secondary">
            Última actualización: {formatLastUpdate(metrics.lastUpdate)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GuardianStatusCard;