import React from 'react';
import { Box, Typography, Paper, LinearProgress, Grid } from '@mui/material';
import { Spa } from '@mui/icons-material';

interface GrowthElement {
  name: string;
  value: number;
  color: 'warning' | 'success' | 'info' | 'primary';
}

const elements: GrowthElement[] = [
  { name: 'Comunicación', value: 80, color: 'warning' },
  { name: 'Empatía', value: 90, color: 'success' },
  { name: 'Confianza', value: 70, color: 'warning' },
  { name: 'Inspiración', value: 85, color: 'success' },
];

const GrowthElementsCard: React.FC = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: '16px',
        background: '#f8fafc',
        borderColor: '#e2e8f0',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Spa sx={{ color: 'text.secondary', mr: 1 }} />
        <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Elementos de Crecimiento
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {elements.map((element) => (
          <Grid item xs={6} key={element.name}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{element.name}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: `${element.color}.main` }}>{element.value}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={element.value}
                color={element.color}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  [`& .MuiLinearProgress-bar`]: {
                    backgroundColor: `${element.color}.main`,
                  },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default GrowthElementsCard;
