import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  Collapse,
  LinearProgress,
  Divider,
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  Architecture as ArchitectureIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

import { GuardianCard } from './GuardianCard';
import { GuardianActivityTimeline } from './GuardianActivityTimeline';
import { GuardianHealthIndicator } from './GuardianHealthIndicator';
import {
  useCosmicWebSocket,
  useCosmicEvent,
  useCosmicConnectionState,
} from '../providers/CosmicWebSocketProvider';
import { useCosmicBrainData } from '../hooks/useCosmicBrainData';
import type {
  GuardianStatus,
  GuardianType,
  GuardianActivity,
  SystemHealthMetrics,
  GuardianMetrics,
} from '../types';

// Guardian type configurations
const GUARDIAN_CONFIGS = {
  architecture: {
    name: 'Architecture Guardian',
    icon: ArchitectureIcon,
    color: '#2196F3',
    description: 'Monitors structural patterns and design consistency',
  },
  ux: {
    name: 'UX Guardian',
    icon: VisibilityIcon,
    color: '#4CAF50',
    description: 'Ensures accessibility and user experience standards',
  },
  performance: {
    name: 'Performance Guardian',
    icon: SpeedIcon,
    color: '#FF9800',
    description: 'Tracks performance metrics and optimization opportunities',
  },
  philosophy: {
    name: 'Philosophy Guardian',
    icon: PsychologyIcon,
    color: '#9C27B0',
    description: 'Monitors alignment with CoomÜnity principles',
  },
  security: {
    name: 'Security Guardian',
    icon: SecurityIcon,
    color: '#F44336',
    description: 'Ensures security standards and vulnerability prevention',
  },
} as const;

interface GuardianStatusMonitorProps {
  refreshInterval?: number;
  showTimeline?: boolean;
  compactMode?: boolean;
}

export const GuardianStatusMonitor: React.FC<GuardianStatusMonitorProps> = ({
  refreshInterval = 30000,
  showTimeline = true,
  compactMode = false,
}) => {
  // State management
  const [selectedGuardian, setSelectedGuardian] = useState<
    GuardianType | 'all'
  >('all');
  const [statusFilter, setStatusFilter] = useState<GuardianStatus | 'all'>(
    'all'
  );
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [timelineExpanded, setTimelineExpanded] = useState(false);

  // WebSocket integration
  const { sendMessage } = useCosmicWebSocket();
  const { isConnected, connectionQuality } = useCosmicConnectionState();

  // Listen for guardian events
  useCosmicEvent('guardian_status_changed', (data) => {
    console.log('Guardian status changed:', data);
  });

  useCosmicEvent('guardian_analysis_complete', (data) => {
    console.log('Guardian analysis complete:', data);
  });

  // Data fetching
  const {
    data: cosmicData,
    isLoading,
    error,
    refetch,
  } = useCosmicBrainData({
    refreshInterval: autoRefresh ? refreshInterval : undefined,
    includeGuardianDetails: true,
  });

  // Computed values
  const guardians = useMemo(() => {
    if (!cosmicData?.guardians) return [];

    return Object.entries(cosmicData.guardians).map(([type, data]) => ({
      type: type as GuardianType,
      ...data,
      config: GUARDIAN_CONFIGS[type as keyof typeof GUARDIAN_CONFIGS],
    }));
  }, [cosmicData]);

  const filteredGuardians = useMemo(() => {
    return guardians.filter((guardian) => {
      const typeMatch =
        selectedGuardian === 'all' || guardian.type === selectedGuardian;
      const statusMatch =
        statusFilter === 'all' || guardian.status === statusFilter;
      return typeMatch && statusMatch;
    });
  }, [guardians, selectedGuardian, statusFilter]);

  const systemHealth = useMemo(() => {
    if (!cosmicData?.systemHealth) return null;
    return cosmicData.systemHealth;
  }, [cosmicData]);

  const recentActivity = useMemo(() => {
    if (!cosmicData?.recentActivity) return [];
    return cosmicData.recentActivity.slice(0, 20); // Last 20 activities
  }, [cosmicData]);

  // Event handlers
  const handleRefresh = () => {
    refetch();
    sendMessage('request_guardian_status', { timestamp: Date.now() });
  };

  const handleGuardianAction = (guardianType: GuardianType, action: string) => {
    sendMessage('guardian_action', {
      guardianType,
      action,
      timestamp: Date.now(),
    });
  };

  const getSystemHealthColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  const getStatusChipColor = (status: GuardianStatus) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'idle':
        return 'default';
      case 'analyzing':
        return 'primary';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Loading Guardian Status...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading guardian status: {error.message}
        <Button onClick={handleRefresh} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: compactMode ? 2 : 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant={compactMode ? 'h6' : 'h5'} gutterBottom>
            Guardian Status Monitor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time monitoring of AI Cosmic Brain guardians
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip
            title={`Connection: ${isConnected ? 'Connected' : 'Disconnected'}`}
          >
            <Chip
              size="small"
              label={isConnected ? 'Live' : 'Offline'}
              color={isConnected ? 'success' : 'error'}
              variant="outlined"
            />
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* System Health Overview */}
      {systemHealth && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">System Health</Typography>
              <Chip
                label={`${systemHealth.overallScore}%`}
                sx={{
                  backgroundColor: getSystemHealthColor(
                    systemHealth.overallScore
                  ),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>

            <GuardianHealthIndicator
              systemHealth={systemHealth}
              compact={compactMode}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters and Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Guardian Type</InputLabel>
              <Select
                value={selectedGuardian}
                onChange={(e) =>
                  setSelectedGuardian(e.target.value as GuardianType | 'all')
                }
                label="Guardian Type"
              >
                <MenuItem value="all">All Guardians</MenuItem>
                {Object.entries(GUARDIAN_CONFIGS).map(([type, config]) => (
                  <MenuItem key={type} value={type}>
                    {config.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as GuardianStatus | 'all')
                }
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="idle">Idle</MenuItem>
                <MenuItem value="analyzing">Analyzing</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  size="small"
                />
              }
              label="Auto Refresh"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={showDetails}
                  onChange={(e) => setShowDetails(e.target.checked)}
                  size="small"
                />
              }
              label="Show Details"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Guardian Cards Grid */}
      <Grid container spacing={compactMode ? 2 : 3}>
        {filteredGuardians.map((guardian) => (
          <Grid
            key={guardian.type}
            size={{ xs: 12, md: compactMode ? 6 : 4, lg: compactMode ? 4 : 3 }}
          >
            <GuardianCard
              guardian={guardian}
              onAction={(action) => handleGuardianAction(guardian.type, action)}
              showDetails={showDetails}
              compact={compactMode}
            />
          </Grid>
        ))}
      </Grid>

      {filteredGuardians.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No guardians found matching the current filters.
        </Alert>
      )}

      {/* Activity Timeline */}
      {showTimeline && recentActivity.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Recent Activity</Typography>
              <IconButton
                onClick={() => setTimelineExpanded(!timelineExpanded)}
                size="small"
              >
                {timelineExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={timelineExpanded}>
              <GuardianActivityTimeline
                activities={recentActivity}
                guardianConfigs={GUARDIAN_CONFIGS}
                compact={compactMode}
              />
            </Collapse>
          </CardContent>
        </Card>
      )}

      {/* Connection Quality Indicator */}
      {isConnected && connectionQuality && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Connection Quality: {connectionQuality.label} • Latency:{' '}
            {connectionQuality.latency}ms • Last Update:{' '}
            {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
