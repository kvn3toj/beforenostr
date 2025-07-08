import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Avatar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  InputAdornment,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import type { GuardianType } from '../types';

// Define GuardianActivity type locally since it's not exported
interface GuardianActivity {
  id: string;
  guardianType: GuardianType;
  type: string;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface GuardianActivityTimelineProps {
  activities: GuardianActivity[];
  guardianConfigs: Record<
    string,
    {
      name: string;
      icon: React.ComponentType;
      color: string;
      description: string;
    }
  >;
  compact?: boolean;
  maxItems?: number;
}

export const GuardianActivityTimeline: React.FC<
  GuardianActivityTimelineProps
> = ({ activities, guardianConfigs, compact = false, maxItems = 20 }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGuardian, setFilterGuardian] = useState<GuardianType | 'all'>(
    'all'
  );
  const [filterType, setFilterType] = useState<string>('all');

  const activityTypes = useMemo(() => {
    const types = new Set(activities.map((activity) => activity.type));
    return Array.from(types);
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities
      .filter((activity) => {
        const matchesSearch =
          searchTerm === '' ||
          activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.guardianType
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesGuardian =
          filterGuardian === 'all' || activity.guardianType === filterGuardian;
        const matchesType =
          filterType === 'all' || activity.type === filterType;

        return matchesSearch && matchesGuardian && matchesType;
      })
      .slice(0, maxItems);
  }, [activities, searchTerm, filterGuardian, filterType, maxItems]);

  const toggleExpanded = (activityId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedItems(newExpanded);
  };

  const getActivityIcon = (type: string, severity?: string) => {
    switch (type) {
      case 'analysis_started':
        return <StartIcon sx={{ color: '#2196F3' }} />;
      case 'analysis_completed':
        return <CheckIcon sx={{ color: '#4CAF50' }} />;
      case 'analysis_paused':
        return <PauseIcon sx={{ color: '#FF9800' }} />;
      case 'issue_found':
        return severity === 'critical' ? (
          <ErrorIcon sx={{ color: '#F44336' }} />
        ) : (
          <WarningIcon sx={{ color: '#FF9800' }} />
        );
      case 'recommendation_generated':
        return <InfoIcon sx={{ color: '#2196F3' }} />;
      case 'configuration_changed':
        return <SettingsIcon sx={{ color: '#9C27B0' }} />;
      case 'status_changed':
        return <RefreshIcon sx={{ color: '#607D8B' }} />;
      default:
        return <InfoIcon sx={{ color: '#9E9E9E' }} />;
    }
  };

  const getActivityColor = (type: string, severity?: string) => {
    switch (type) {
      case 'analysis_completed':
        return '#4CAF50';
      case 'issue_found':
        return severity === 'critical' ? '#F44336' : '#FF9800';
      case 'analysis_started':
      case 'recommendation_generated':
        return '#2196F3';
      case 'analysis_paused':
        return '#FF9800';
      case 'configuration_changed':
        return '#9C27B0';
      default:
        return '#9E9E9E';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTypeLabel = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (filteredActivities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No activities found matching the current filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Filters */}
      {!compact && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Guardian</InputLabel>
            <Select
              value={filterGuardian}
              onChange={(e) =>
                setFilterGuardian(e.target.value as GuardianType | 'all')
              }
              label="Guardian"
            >
              <MenuItem value="all">All Guardians</MenuItem>
              {Object.entries(guardianConfigs).map(([type, config]) => (
                <MenuItem key={type} value={type}>
                  {config.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Activity Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              {activityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {getTypeLabel(type)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Timeline */}
      <Timeline position="right">
        {filteredActivities.map((activity, index) => {
          const isExpanded = expandedItems.has(activity.id);
          const guardianConfig = guardianConfigs[activity.guardianType];
          const GuardianIcon = guardianConfig?.icon;

          return (
            <TimelineItem key={activity.id}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    backgroundColor: getActivityColor(
                      activity.type,
                      activity.metadata?.severity
                    ),
                    border: 'none',
                    p: 1,
                  }}
                >
                  {getActivityIcon(activity.type, activity.metadata?.severity)}
                </TimelineDot>
                {index < filteredActivities.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <Card
                  sx={{
                    mb: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent sx={{ pb: compact ? 1 : 2 }}>
                    {/* Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flex: 1,
                        }}
                      >
                        {GuardianIcon && (
                          <Avatar
                            sx={{
                              backgroundColor: guardianConfig.color,
                              width: 24,
                              height: 24,
                              '& svg': {
                                fontSize: 14,
                              },
                            }}
                          >
                            <GuardianIcon />
                          </Avatar>
                        )}

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            noWrap
                          >
                            {guardianConfig?.name || activity.guardianType}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(activity.timestamp)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Chip
                          label={getTypeLabel(activity.type)}
                          size="small"
                          sx={{
                            backgroundColor: getActivityColor(
                              activity.type,
                              activity.metadata?.severity
                            ),
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />

                        {activity.metadata &&
                          Object.keys(activity.metadata).length > 0 && (
                            <Tooltip
                              title={isExpanded ? 'Show less' : 'Show more'}
                            >
                              <IconButton
                                size="small"
                                onClick={() => toggleExpanded(activity.id)}
                              >
                                {isExpanded ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                      </Box>
                    </Box>

                    {/* Message */}
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {activity.message}
                    </Typography>

                    {/* Metadata */}
                    {activity.metadata && (
                      <Collapse in={isExpanded}>
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            gutterBottom
                          >
                            Details:
                          </Typography>

                          {Object.entries(activity.metadata).map(
                            ([key, value]) => (
                              <Box
                                key={key}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                                </Typography>
                                <Typography variant="caption">
                                  {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
                      </Collapse>
                    )}
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>

      {/* Show more indicator */}
      {activities.length > maxItems && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Showing {filteredActivities.length} of {activities.length}{' '}
            activities
          </Typography>
        </Box>
      )}
    </Box>
  );
};
