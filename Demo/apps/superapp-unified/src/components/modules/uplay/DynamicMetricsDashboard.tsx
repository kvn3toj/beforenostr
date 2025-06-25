import React from 'react';
import { Box, Typography } from '@mui/material';
import { EmojiEvents, Bolt, Star, Psychology, LocalFireDepartment, Speed } from '@mui/icons-material';

const metricCards = [
  {
    key: 'meritos',
    title: 'Mëritos',
    value: 340, // Reemplaza con tu dato real o props
    icon: EmojiEvents,
    description: 'Puntos por contribuciones al Bien Común',
  },
  {
    key: 'ondas',
    title: 'Öndas',
    value: 125,
    icon: Bolt,
    description: 'Energía vibracional positiva',
  },
  {
    key: 'nivel',
    title: 'Nivel',
    value: 1,
    icon: Star,
    description: 'Progresión en conocimiento',
  },
  {
    key: 'precision',
    title: 'Precisión',
    value: '87%',
    icon: Psychology,
    description: 'Exactitud en respuestas',
  },
  {
    key: 'racha',
    title: 'Racha',
    value: 5,
    icon: LocalFireDepartment,
    description: 'Días consecutivos de aprendizaje',
  },
  {
    key: 'efficiency',
    title: 'Eficiencia',
    value: 4,
    icon: Speed,
    description: 'Índice de eficiencia de aprendizaje',
  },
];

const DynamicMetricsDashboard = () => (
  <Box
    sx={{
      p: 1,
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px 0 rgba(0,0,0,0.03)',
    }}
  >
    {metricCards.map((card, index) => (
      <Box
        key={card.key}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          transition: 'background-color 0.2s',
          borderBottom: index === metricCards.length - 1 ? 'none' : '1px solid #f1f5f9',
          '&:hover': {
            backgroundColor: '#f8fafc',
            borderRadius: index === 0 ? '12px 12px 0 0' : '0',
            borderBottomLeftRadius: index === metricCards.length - 1 ? '12px' : '0',
            borderBottomRightRadius: index === metricCards.length - 1 ? '12px' : '0',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 2, color: '#64748b' }}>
          <card.icon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="body1" color="#334155" fontWeight={500}>
              {card.title}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" color="#0f172a" fontWeight={600}>
            {card.value}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
);

export default DynamicMetricsDashboard;



