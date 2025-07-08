import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Button,
  Box,
  LinearProgress,
  Tooltip,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/material/icons';

import type { GuardianType, GuardianStatus, GuardianMetrics } from '../types';

interface GuardianData {
  type: GuardianType;
  status: GuardianStatus;
  metrics: GuardianMetrics;
  lastAnalysis: Date;
  nextScheduled?: Date;
  issues: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
  }>;
  recommendations: Array<{
    id: string;
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
  }>;
  config: {
    name: string;
    icon: React.ComponentType;
    color: string;
    description: string;
  };
}

interface GuardianCardProps {
  guardian: GuardianData;
  onAction: (action: string) => void;
  showDetails?: boolean;
  compact?: boolean;
}

export const GuardianCard: React.FC<GuardianCardProps> = ({
  guardian,
  onAction,
  showDetails = true,
  compact = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const {
    type,
    status,
    metrics,
    lastAnalysis,
    nextScheduled,
    issues,
    recommendations,
    config,
  } = guardian;
  const IconComponent = config.icon;

  const getStatusColor = (status: GuardianStatus) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'idle':
        return '#9E9E9E';
      case 'analyzing':
        return '#2196F3';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: GuardianStatus) => {
    switch (status) {
      case 'active':
        return <CheckIcon sx={{ color: '#4CAF50' }} />;
      case 'idle':
        return <ScheduleIcon sx={{ color: '#9E9E9E' }} />;
      case 'analyzing':
        return <AnalyticsIcon sx={{ color: '#2196F3' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#FF9800' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: '#F44336' }} />;
      default:
        return <ScheduleIcon sx={{ color: '#9E9E9E' }} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'high':
        return '#FF5722';
      case 'critical':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'high':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const criticalIssues = issues.filter(
    (issue) => issue.severity === 'critical'
  ).length;
  const highPriorityRecommendations = recommendations.filter(
    (rec) => rec.priority === 'high'
  ).length;

  return (
    <Card
      sx={{
        height: compact ? 'auto' : '100%',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      {/* Status indicator stripe */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: getStatusColor(status),
          borderRadius: '4px 4px 0 0',
        }}
      />

      <CardContent sx={{ pb: compact ? 1 : 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge
            badgeContent={criticalIssues > 0 ? criticalIssues : null}
            color="error"
            sx={{ mr: 2 }}
          >
            <Avatar
              sx={{
                backgroundColor: config.color,
                width: compact ? 32 : 40,
                height: compact ? 32 : 40,
              }}
            >
              <IconComponent sx={{ fontSize: compact ? 16 : 20 }} />
            </Avatar>
          </Badge>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant={compact ? 'body1' : 'h6'}
              noWrap
              sx={{ fontWeight: 600 }}
            >
              {config.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon(status)}
              <Chip
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(status),
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Metrics Overview */}
        {metrics && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Health Score
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {metrics.healthScore}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={metrics.healthScore}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor:
                    metrics.healthScore >= 80
                      ? '#4CAF50'
                      : metrics.healthScore >= 60
                        ? '#FF9800'
                        : '#F44336',
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        {/* Key Metrics */}
        {!compact && metrics && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              mb: 2,
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: 1,
                backgroundColor: '#f8f9fa',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" color="primary">
                {metrics.analysisCount || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Analyses
              </Typography>
            </Box>
            <Box
              sx={{
                textAlign: 'center',
                p: 1,
                backgroundColor: '#f8f9fa',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" color="secondary">
                {metrics.issuesFound || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Issues
              </Typography>
            </Box>
          </Box>
        )}

        {/* Timestamps */}
        <Box sx={{ mb: showDetails ? 2 : 0 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Last Analysis: {formatTimestamp(lastAnalysis)}
          </Typography>
          {nextScheduled && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Next Scheduled: {formatTimestamp(nextScheduled)}
            </Typography>
          )}
        </Box>

        {/* Issues and Recommendations Summary */}
        {showDetails && (issues.length > 0 || recommendations.length > 0) && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {issues.length > 0 && (
              <Chip
                label={`${issues.length} Issues`}
                size="small"
                color={criticalIssues > 0 ? 'error' : 'warning'}
                variant="outlined"
              />
            )}
            {recommendations.length > 0 && (
              <Chip
                label={`${recommendations.length} Recommendations`}
                size="small"
                color={highPriorityRecommendations > 0 ? 'primary' : 'default'}
                variant="outlined"
              />
            )}
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={status === 'active' ? 'Pause' : 'Start'}>
            <IconButton
              size="small"
              onClick={() => onAction(status === 'active' ? 'pause' : 'start')}
              color="primary"
            >
              {status === 'active' ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh Analysis">
            <IconButton
              size="small"
              onClick={() => onAction('refresh')}
              color="secondary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton size="small" onClick={() => onAction('settings')}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {showDetails && (issues.length > 0 || recommendations.length > 0) && (
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </CardActions>

      {/* Expanded Details */}
      {showDetails && (
        <Collapse in={expanded}>
          <Divider />
          <CardContent sx={{ pt: 2 }}>
            {/* Issues */}
            {issues.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Issues ({issues.length})
                </Typography>
                <List dense>
                  {issues.slice(0, 3).map((issue) => (
                    <ListItem key={issue.id} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getSeverityColor(issue.severity),
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={issue.message}
                        secondary={formatTimestamp(issue.timestamp)}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                  {issues.length > 3 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={`... and ${issues.length - 3} more issues`}
                        primaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary',
                          fontStyle: 'italic',
                        }}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Recommendations ({recommendations.length})
                </Typography>
                <List dense>
                  {recommendations.slice(0, 2).map((rec) => (
                    <ListItem key={rec.id} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getPriorityColor(rec.priority),
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={rec.title}
                        secondary={rec.description}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  ))}
                  {recommendations.length > 2 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={`... and ${recommendations.length - 2} more recommendations`}
                        primaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary',
                          fontStyle: 'italic',
                        }}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
};
