import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { TrendingUp, TrendingDown, MoreVert } from '@mui/icons-material';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  progress?: {
    value: number;
    max?: number;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
  status?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
  actions?: React.ReactNode;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  status,
  actions,
  onClick,
  sx,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        } : {},
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {icon && (
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </Box>
            )}
            <Typography variant="h6" component="h3" color="text.secondary">
              {title}
            </Typography>
          </Box>
          
          {actions && (
            <Box onClick={(e) => e.stopPropagation()}>
              {actions}
            </Box>
          )}
        </Box>

        {/* Main Value */}
        <Typography
          variant="h3"
          component="div"
          fontWeight="bold"
          color="text.primary"
          mb={1}
        >
          {value}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {subtitle}
          </Typography>
        )}

        {/* Status Chip */}
        {status && (
          <Box mb={2}>
            <Chip
              label={status.label}
              color={status.color}
              size="small"
              variant="outlined"
            />
          </Box>
        )}

        {/* Progress Bar */}
        {progress && (
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Progreso
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.value}{progress.max ? `/${progress.max}` : '%'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress.max ? (progress.value / progress.max) * 100 : progress.value}
              color={progress.color || 'primary'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {/* Trend */}
        {trend && (
          <Box display="flex" alignItems="center" gap={1}>
            {trend.isPositive ? (
              <TrendingUp color="success" fontSize="small" />
            ) : (
              <TrendingDown color="error" fontSize="small" />
            )}
            <Typography
              variant="body2"
              color={trend.isPositive ? 'success.main' : 'error.main'}
              fontWeight="medium"
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Typography>
            {trend.label && (
              <Typography variant="body2" color="text.secondary">
                {trend.label}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 