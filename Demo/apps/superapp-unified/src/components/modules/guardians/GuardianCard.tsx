import React from 'react';
import { Card, CardContent, Typography, Chip, Button, Box } from '@mui/material';

export interface Guardian {
  id: string;
  name: string;
  specialization: string;
  mission: string;
  icon?: React.ReactNode;
}

interface GuardianCardProps {
  guardian: Guardian;
  onLabClick?: (id: string) => void;
}

const GuardianCard: React.FC<GuardianCardProps> = ({ guardian, onLabClick }) => {
  return (
    <Card className={`guardian-card guardian-element-${guardian.specialization.toLowerCase()}`} sx={{ minHeight: 220 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {guardian.icon && <Box mr={1}>{guardian.icon}</Box>}
          <Typography variant="h5" fontWeight={700}>{guardian.name}</Typography>
        </Box>
        <Chip label={guardian.specialization} color="primary" size="small" sx={{ mb: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {guardian.mission}
        </Typography>
        <Button variant="outlined" size="small" onClick={() => onLabClick?.(guardian.id)}>
          Ver laboratorio
        </Button>
      </CardContent>
    </Card>
  );
};

export default GuardianCard;
