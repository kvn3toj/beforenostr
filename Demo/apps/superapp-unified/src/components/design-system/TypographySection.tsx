/**
 * 📝 TypographySection - Sección de tipografía del design system
 */

import React from 'react';
import { Box, Typography, Grid, Paper, Divider } from '@mui/material';

interface TypographyItemProps {
  variant: any;
  name: string;
  text: string;
}

const TypographyItem: React.FC<TypographyItemProps> = ({ variant, name, text }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
      {name}
    </Typography>
    <Typography variant={variant} component="div">
      {text}
    </Typography>
  </Box>
);

export const TypographySection: React.FC = () => {
  const typographyItems = [
    {
      variant: 'h1',
      name: 'H1 - Título Principal',
      text: 'CoomÜnity - Bien Común sobre bien particular',
    },
    {
      variant: 'h2',
      name: 'H2 - Título Secundario',
      text: 'El poder de la reciprocidad y el Ayni',
    },
    {
      variant: 'h3',
      name: 'H3 - Título de Sección',
      text: 'Construyendo juntos un futuro sostenible',
    },
    {
      variant: 'h4',
      name: 'H4 - Subtítulo',
      text: 'Mëritos, Öndas y la economía sagrada',
    },
    {
      variant: 'h5',
      name: 'H5 - Subtítulo Menor',
      text: 'Colaboración por encima de competencia',
    },
    {
      variant: 'h6',
      name: 'H6 - Subtítulo Pequeño',
      text: 'Transformación desde el ser',
    },
    {
      variant: 'body1',
      name: 'Body 1 - Texto Principal',
      text: 'En CoomÜnity creemos que el verdadero cambio comienza desde adentro. Cada acción, cada decisión, cada intercambio está guiado por principios ancestrales de reciprocidad y bien común.',
    },
    {
      variant: 'body2',
      name: 'Body 2 - Texto Secundario',
      text: 'Los Mëritos reconocen tus contribuciones al Bien Común, mientras que las Öndas representan la energía vibracional positiva que generas en la comunidad.',
    },
    {
      variant: 'caption',
      name: 'Caption - Texto Pequeño',
      text: 'Sistema de diseño basado en principios de sostenibilidad y armonía',
    },
    {
      variant: 'overline',
      name: 'Overline - Texto Superior',
      text: 'COOMUNITY DESIGN SYSTEM',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        📝 Sistema Tipográfico
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Jerarquía tipográfica clara y legible que refleja los valores de CoomÜnity
      </Typography>

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Títulos y Encabezados
            </Typography>
            {typographyItems.slice(0, 6).map((item, index) => (
              <TypographyItem key={index} {...item} />
            ))}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Textos de Contenido
            </Typography>
            {typographyItems.slice(6).map((item, index) => (
              <TypographyItem key={index} {...item} />
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Características del Sistema
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Escalado modular y responsivo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Optimizado para legibilidad
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Soporte para múltiples idiomas
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                • Accesibilidad WCAG 2.1 AA
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Consistencia cross-platform
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Filosofía CoomÜnity integrada
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default TypographySection; 