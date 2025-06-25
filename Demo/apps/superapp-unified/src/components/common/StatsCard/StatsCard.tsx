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
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(6px)',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        p: 3,
        boxShadow: 'none',
        transition: 'box-shadow 0.2s, border 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.06)',
          border: '1px solid #cbd5e1',
          transform: 'translateY(-2px) scale(1.01)',
        },
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="h6" sx={{ color: '#334155', fontWeight: 500 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ color: '#0f172a', fontWeight: 600 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
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
              sx={{ fontWeight: 500, fontSize: 12, borderRadius: 1 }}
            />
          </Box>
        )}
        {/* Progress Bar */}
        {progress && (
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Progreso
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {progress.value}{progress.max ? `/${progress.max}` : '%'}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress.max ? (progress.value / progress.max) * 100 : progress.value}
              color={progress.color || 'primary'}
              sx={{ height: 6, borderRadius: 3, background: '#e0e7ff' }}
            />
          </Box>
        )}
        {/* Trend */}
        {trend && (
          <Box display="flex" alignItems="center" gap={1}>
            {trend.isPositive ? (
              <TrendingUp sx={{ color: '#10b981' }} fontSize="small" />
            ) : (
              <TrendingDown sx={{ color: '#f59e0b' }} fontSize="small" />
            )}
            <Typography
              variant="body2"
              sx={{ color: trend.isPositive ? '#10b981' : '#f59e0b', fontWeight: 500 }}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Typography>
            {trend.label && (
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {trend.label}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
