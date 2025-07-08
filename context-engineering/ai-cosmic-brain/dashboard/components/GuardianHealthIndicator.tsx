import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import type { SystemHealthMetrics } from '../types';

interface GuardianHealthIndicatorProps {
  systemHealth: SystemHealthMetrics;
  compact?: boolean;
  showTrends?: boolean;
}

export const GuardianHealthIndicator: React.FC<
  GuardianHealthIndicatorProps
> = ({ systemHealth, compact = false, showTrends = true }) => {
  const getHealthColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#8BC34A';
    if (score >= 70) return '#FFC107';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Critical';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckIcon sx={{ color: getHealthColor(score) }} />;
    if (score >= 60)
      return <WarningIcon sx={{ color: getHealthColor(score) }} />;
    return <ErrorIcon sx={{ color: getHealthColor(score) }} />;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUpIcon sx={{ color: '#4CAF50' }} />;
    if (trend < -5) return <TrendingDownIcon sx={{ color: '#F44336' }} />;
    return <TrendingFlatIcon sx={{ color: '#9E9E9E' }} />;
  };

  const formatPercentage = (value: number) => `${Math.round(value)}%`;

  // Mock guardian health data (in real implementation, this would come from systemHealth)
  const guardianHealthData = [
    {
      type: 'architecture',
      name: 'Architecture',
      score: systemHealth.overallScore * 0.95,
      trend: 2.3,
      issues: 2,
      lastCheck: '5m ago',
    },
    {
      type: 'ux',
      name: 'UX',
      score: systemHealth.overallScore * 0.88,
      trend: -1.2,
      issues: 1,
      lastCheck: '3m ago',
    },
    {
      type: 'performance',
      name: 'Performance',
      score: systemHealth.overallScore * 1.02,
      trend: 5.7,
      issues: 0,
      lastCheck: '2m ago',
    },
    {
      type: 'philosophy',
      name: 'Philosophy',
      score: systemHealth.overallScore * 0.92,
      trend: 1.8,
      issues: 0,
      lastCheck: '1m ago',
    },
    {
      type: 'security',
      name: 'Security',
      score: systemHealth.overallScore * 0.98,
      trend: 0.5,
      issues: 1,
      lastCheck: '4m ago',
    },
  ];

  return (
    <Box>
      {/* Overall System Health */}
      <Box sx={{ mb: compact ? 2 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={systemHealth.overallScore}
              size={compact ? 60 : 80}
              thickness={4}
              sx={{
                color: getHealthColor(systemHealth.overallScore),
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant={compact ? 'body2' : 'h6'}
                component="div"
                color="text.secondary"
                fontWeight="bold"
              >
                {formatPercentage(systemHealth.overallScore)}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant={compact ? 'body1' : 'h6'} fontWeight="medium">
              System Health: {getHealthLabel(systemHealth.overallScore)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated:{' '}
              {systemHealth.lastEvolution
                ? new Date(systemHealth.lastEvolution).toLocaleTimeString()
                : 'Never'}
            </Typography>
            {showTrends && (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}
              >
                {getTrendIcon(2.1)}
                <Typography variant="caption" color="text.secondary">
                  +2.1% from last hour
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Key Metrics */}
        {!compact && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" color="primary">
                  {systemHealth.guardiansActive || 5}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Active Guardians
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" color="warning.main">
                  {systemHealth.criticalIssues +
                    (systemHealth.totalRecommendations || 0)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Issues
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" color="info.main">
                  {systemHealth.totalRecommendations || 147}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Recommendations
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="h6" color="success.main">
                  {formatPercentage(systemHealth.uptime || 99.8)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Uptime
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Individual Guardian Health */}
      <Box>
        <Typography variant={compact ? 'body1' : 'h6'} gutterBottom>
          Guardian Health Status
        </Typography>

        <Grid container spacing={compact ? 1 : 2}>
          {guardianHealthData.map((guardian) => (
            <Grid key={guardian.type} size={{ xs: 12, md: compact ? 6 : 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: 2,
                  },
                }}
              >
                <CardContent sx={{ p: compact ? 1.5 : 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {getHealthIcon(guardian.score)}
                    <Typography variant="body2" fontWeight="medium" noWrap>
                      {guardian.name}
                    </Typography>
                    {showTrends && (
                      <Tooltip
                        title={`Trend: ${guardian.trend > 0 ? '+' : ''}${guardian.trend}%`}
                      >
                        <Box sx={{ ml: 'auto' }}>
                          {getTrendIcon(guardian.trend)}
                        </Box>
                      </Tooltip>
                    )}
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Health Score
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {formatPercentage(guardian.score)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(guardian.score, 100)}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getHealthColor(guardian.score),
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {guardian.lastCheck}
                    </Typography>
                    {guardian.issues > 0 && (
                      <Chip
                        label={`${guardian.issues} issue${guardian.issues > 1 ? 's' : ''}`}
                        size="small"
                        color={guardian.issues > 2 ? 'error' : 'warning'}
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* System-wide Alerts */}
      {systemHealth.criticalIssues > 0 && (
        <Box sx={{ mt: compact ? 2 : 3 }}>
          <Typography variant={compact ? 'body1' : 'h6'} gutterBottom>
            Critical Issues ({systemHealth.criticalIssues})
          </Typography>
          <Card sx={{ mb: 1, borderLeft: '4px solid #F44336' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorIcon sx={{ color: '#F44336', fontSize: 16 }} />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {systemHealth.criticalIssues} critical issue
                  {systemHealth.criticalIssues > 1 ? 's' : ''} detected across
                  guardians
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Now
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};
