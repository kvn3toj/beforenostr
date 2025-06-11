import React from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import { Search, Mic, ArrowBack } from '@mui/icons-material';

interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = '¿Qué quieres encontrar?',
}) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mb: 2,
        px: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(29, 27, 32, 0.08)',
          borderRadius: '24.466px',
          minWidth: '315px',
          maxWidth: '315px',
          width: '100%',
          minHeight: '34px',
          padding: '3px',
        }}
      >
        {/* Leading Icon */}
        <IconButton
          sx={{
            width: '42px',
            height: '42px',
            padding: '7px',
            borderRadius: '87px',
          }}
        >
          <Search
            sx={{
              width: '21px',
              height: '21px',
              color: '#55414B',
            }}
          />
        </IconButton>

        {/* Search Input */}
        <InputBase
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          sx={{
            flex: 1,
            color: '#55414B',
            fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            letterSpacing: '0.44px',
            lineHeight: '21px',
            '& .MuiInputBase-input': {
              padding: 0,
              '&::placeholder': {
                color: '#55414B',
                opacity: 1,
              },
            },
          }}
        />

        {/* Trailing Icon */}
        <IconButton
          sx={{
            width: '42px',
            height: '42px',
            padding: '7px',
            borderRadius: '87px',
          }}
        >
          <Mic
            sx={{
              width: '21px',
              height: '21px',
              color: '#55414B',
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};
