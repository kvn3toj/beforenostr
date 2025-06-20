/**
 * 🎨 ColorsSection - Sección de colores del design system
 */

import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ColorCardProps {
  name: string;
  value: string;
  description?: string;
}

const ColorCard: React.FC<ColorCardProps> = ({ name, value, description }) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      borderRadius: 2,
      border: '1px solid rgba(0,0,0,0.1)',
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: 60,
        backgroundColor: value,
        borderRadius: 1,
        mb: 1,
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    />
    <Typography variant="subtitle2" fontWeight="600">
      {name}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
      {value}
    </Typography>
    {description && (
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    )}
  </Paper>
);

export const ColorsSection: React.FC = () => {
  const theme = useTheme();

  const colorPalette = [
    {
      name: 'Primary',
      value: theme.palette.primary.main,
      description: 'Color principal de la marca',
    },
    {
      name: 'Secondary',
      value: theme.palette.secondary.main,
      description: 'Color secundario',
    },
    {
      name: 'Error',
      value: theme.palette.error.main,
      description: 'Estados de error',
    },
    {
      name: 'Warning',
      value: theme.palette.warning.main,
      description: 'Advertencias',
    },
    {
      name: 'Info',
      value: theme.palette.info.main,
      description: 'Información',
    },
    {
      name: 'Success',
      value: theme.palette.success.main,
      description: 'Estados exitosos',
    },
    {
      name: 'Background',
      value: theme.palette.background.default,
      description: 'Fondo principal',
    },
    {
      name: 'Paper',
      value: theme.palette.background.paper,
      description: 'Fondo de elementos',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        🎨 Paleta de Colores
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Sistema de colores coherente basado en la filosofía CoomÜnity
      </Typography>
      
      <Grid container spacing={2}>
        {colorPalette.map((color) => (
          <Grid item xs={12} sm={6} md={3} key={color.name}>
            <ColorCard {...color} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ColorsSection; 