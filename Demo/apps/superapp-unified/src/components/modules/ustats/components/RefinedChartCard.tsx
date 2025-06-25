import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';

interface RefinedChartCardProps {
  title: string;
  children: React.ReactNode;
}

const RefinedChartCard: React.FC<RefinedChartCardProps> = ({ title, children }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: '16px',
        background: '#ffffff',
        borderColor: '#e2e8f0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s, border-color 0.3s',
        '&:hover': {
          boxShadow: '0 10px 20px 0 rgba(0,0,0,0.05)',
          borderColor: '#cbd5e1',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
          {title}
        </Typography>
        <IconButton size="small">
          <MoreHoriz sx={{ color: '#94a3b8' }} />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, mt: 2 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default RefinedChartCard;
