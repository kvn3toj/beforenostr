import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const GuardianStatusMonitor: React.FC = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold">
        Estado de Guardianes
      </Typography>
      <Typography variant="body2" color="text.secondary">
        (Aquí se mostrarán los guardianes activos, su salud y sincronización con el backend)
      </Typography>
    </CardContent>
  </Card>
);

export default GuardianStatusMonitor;
