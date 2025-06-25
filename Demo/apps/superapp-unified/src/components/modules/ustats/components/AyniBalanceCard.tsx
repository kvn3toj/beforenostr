import React from 'react';
import { Box, Typography, Paper, LinearProgress, useTheme } from '@mui/material';
import { AccountBalance } from '@mui/icons-material';

interface AyniBalanceCardProps {
  balance: number;
}

const AyniBalanceCard: React.FC<AyniBalanceCardProps> = ({ balance }) => {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: '16px',
        background: '#f8fafc',
        borderColor: '#e2e8f0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AccountBalance sx={{ color: 'text.secondary', mr: 1 }} />
        <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Balance Ayni
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
        {balance}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={balance}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e2e8f0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'text.primary',
          },
        }}
      />
    </Paper>
  );
};

export default AyniBalanceCard;
