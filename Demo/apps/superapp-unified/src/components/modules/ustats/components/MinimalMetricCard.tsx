import React from 'react';
import { Typography, Box, Chip, Paper } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

interface MinimalMetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
}

const MinimalMetricCard: React.FC<MinimalMetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  change,
  description,
}) => {
  const theme = useTheme();

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        cursor: 'default',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 3,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
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
          variant="subtitle1"
          component="h3"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          {title}
        </Typography>
        <Chip
          size="small"
          variant="outlined"
          label={`${change > 0 ? '+' : ''}${change}%`}
          sx={{
            backgroundColor: alpha(getTrendColor(), 0.05),
            color: getTrendColor(),
            fontWeight: 600,
            fontSize: '0.75rem',
            borderColor: alpha(getTrendColor(), 0.3),
          }}
        />
      </Box>

      <Typography
        variant="h3"
        component="div"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
          lineHeight: 1.2,
        }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
        <Typography
          component="span"
          variant="h5"
          sx={{
            color: 'text.secondary',
            ml: 0.5,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          {unit}
        </Typography>
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: '0.75rem',
          lineHeight: 1.4,
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

export default MinimalMetricCard;
