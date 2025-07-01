import React from 'react';
import { Typography, Box, Chip, Paper } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';

interface GamingStatsCardProps {
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  color: string;
}

const GamingStatsCard: React.FC<GamingStatsCardProps> = ({
  title,
  value,
  unit,
  trend,
  change,
}) => {
  const theme = useTheme();

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon />;
      case 'down':
        return <TrendingDownIcon />;
      default:
        return <TrendingFlatIcon />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 3,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: theme.palette.text.secondary,
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={2}
      >
        <Typography
          variant="h6"
          component="h3"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          {title}
        </Typography>

        <Chip
          icon={getTrendIcon()}
          label={`${change > 0 ? '+' : ''}${change}%`}
          size="small"
          variant="outlined"
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: getTrendColor(),
            fontWeight: 600,
            borderColor: alpha(getTrendColor(), 0.3),
            '& .MuiChip-icon': {
              color: getTrendColor(),
            },
          }}
        />
      </Box>

      <Typography
        variant="h3"
        component="div"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
          mb: 1,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          lineHeight: 1.2,
        }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
        <Typography
          component="span"
          variant="h5"
          sx={{
            color: theme.palette.text.secondary,
            ml: 0.5,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          {unit}
        </Typography>
      </Typography>

      {/* Progress indicator */}
      <Box position="relative" mt={2}>
        <Box
          sx={{
            height: 4,
            backgroundColor: alpha(theme.palette.divider, 0.3),
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              backgroundColor: theme.palette.text.secondary,
              borderRadius: 2,
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default GamingStatsCard;
