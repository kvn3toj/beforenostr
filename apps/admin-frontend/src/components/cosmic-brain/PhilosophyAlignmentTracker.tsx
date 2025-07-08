import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const PhilosophyAlignmentTracker: React.FC = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        Tracker de Alineación Filosófica
      </Typography>
      <Typography variant="body2" color="text.secondary">
        (Aquí se visualizarán las métricas de alineación filosófica y neguentropía)
      </Typography>
    </CardContent>
  </Card>
);

export default PhilosophyAlignmentTracker;
