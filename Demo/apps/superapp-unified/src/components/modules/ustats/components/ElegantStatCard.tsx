import React from 'react';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';

interface ElegantStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

const ElegantStatCard: React.FC<ElegantStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bgColor,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        backgroundColor: bgColor || theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      {/* Icon */}
      {icon && (
        <Box sx={{ mb: 2, color: theme.palette.primary.main }}>
          {icon}
        </Box>
      )}

      {/* Title */}
      <Typography
        variant="subtitle2"
        sx={{
          color: theme.palette.text.secondary,
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </Typography>

      {/* Value */}
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 800,
          mb: subtitle ? 0.5 : 0,
        }}
      >
        {value}
      </Typography>

      {/* Subtitle */}
      {subtitle && (
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default ElegantStatCard;
