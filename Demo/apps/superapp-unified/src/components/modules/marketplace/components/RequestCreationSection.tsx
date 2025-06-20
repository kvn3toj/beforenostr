import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface RequestCreationSectionProps {
  onCreateRequest: () => void;
}

export const RequestCreationSection: React.FC<RequestCreationSectionProps> = ({
  onCreateRequest,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '23px',
      }}
    >
      {/* Question Text */}
      <Typography
        sx={{
          color: '#222222',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: 1.67,
          letterSpacing: '0.25px',
          alignSelf: 'center',
          marginBottom: '15px',
          fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
        }}
      >
        ¿No encuentras lo que quieres?
      </Typography>

      {/* Create Request Button */}
      <Button
        onClick={onCreateRequest}
        sx={{
          borderRadius: '83px',
          backgroundColor: '#740056',
          color: '#FFFFFF',
          fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'center',
          letterSpacing: '0.08px',
          lineHeight: 1.18,
          minHeight: '33px',
          width: '140px',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '8px',
          paddingBottom: '8px',
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#5A0042',
            transform: 'scale(1.02)',
            boxShadow: '0 4px 12px rgba(116, 0, 86, 0.3)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        Crear solicitud
      </Button>
    </Box>
  );
};
