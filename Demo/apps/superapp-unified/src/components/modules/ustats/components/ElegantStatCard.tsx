import React from 'react';
import { Box, Typography, Paper, IconButton, Rating } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';

interface ElegantStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  rating?: number;
  bgColor?: string;
  iconColor?: string;
}

const ElegantStatCard: React.FC<ElegantStatCardProps> = ({ title, value, subtitle, icon, rating, bgColor = '#f8fafc', iconColor = 'action' }) => {
  const clonedIcon = React.cloneElement(icon as React.ReactElement, { color: iconColor });

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: '16px',
        background: bgColor,
        borderColor: '#e2e8f0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'box-shadow 0.3s, border-color 0.3s',
        '&:hover': {
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
          borderColor: '#cbd5e1',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {clonedIcon}
        <Typography sx={{ ml: 1, fontWeight: 600, color: 'text.secondary' }}>{title}</Typography>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', my: 0.5 }}>
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}

      {rating && (
        <Rating name="read-only" value={rating} readOnly precision={0.5} sx={{ mt: 1 }} />
      )}
    </Paper>
  );
};

export default ElegantStatCard;
