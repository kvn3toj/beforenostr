import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { Language } from '@mui/icons-material';

interface CommunityActivityCardProps {
  onlineMembers: number;
  todayInteractions: number;
}

const CommunityActivityCard: React.FC<CommunityActivityCardProps> = ({
  onlineMembers,
  todayInteractions,
}) => {
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
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Language sx={{ color: 'text.secondary', mr: 1 }} />
        <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Actividad Comunitaria
        </Typography>
      </Box>
      <Grid container sx={{ flexGrow: 1, alignItems: 'center' }}>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {onlineMembers}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Miembros en línea
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {todayInteractions}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Interacciones hoy
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CommunityActivityCard;
