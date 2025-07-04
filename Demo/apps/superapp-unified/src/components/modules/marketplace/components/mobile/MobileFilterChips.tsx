import React from 'react';
import { Stack, Chip } from '@mui/material';
import { AutoAwesome, Store, FlashOn, VerifiedUser } from '@mui/icons-material';

// Definimos los filtros disponibles
const filterOptions = [
  { label: 'Sostenible', icon: <AutoAwesome fontSize="small" />, value: 'sustainable' },
  { label: 'Colaborativo', icon: <Store fontSize="small" />, value: 'collaborative' },
  { label: 'Urgente', icon: <FlashOn fontSize="small" />, value: 'urgent' },
  { label: 'Premium', icon: <VerifiedUser fontSize="small" />, value: 'premium' },
];

interface MobileFilterChipsProps {
  // Por ahora, no necesita props, pero está listo para ser dinámico
}

export const MobileFilterChips: React.FC<MobileFilterChipsProps> = (props) => {
  // La lógica para manejar la selección se añadirá después
  const handleClick = (filterValue: string) => {
    console.log(`Filtro seleccionado: ${filterValue}`);
    // Aquí iría la lógica para actualizar el estado de los filtros en el componente padre
  };

  return (
    <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1, px: 2 }}>
      {filterOptions.map((filter) => (
        <Chip
          key={filter.value}
          label={filter.label}
          icon={filter.icon}
          variant="outlined"
          onClick={() => handleClick(filter.value)}
        />
      ))}
    </Stack>
  );
};
