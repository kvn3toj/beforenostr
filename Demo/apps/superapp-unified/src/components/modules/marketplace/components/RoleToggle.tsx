import React from 'react';
import { Box, Button } from '@mui/material';

interface RoleToggleProps {
  selectedRole: 'consumer' | 'provider';
  onRoleChange: (role: 'consumer' | 'provider') => void;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  return (
    <Box
      sx={{
        borderRadius: '42px',
        backgroundColor: '#ECEFF3',
        alignSelf: 'center',
        display: 'flex',
        marginTop: '12px',
        width: '237px',
        maxWidth: '100%',
        paddingLeft: '5px',
        paddingRight: '16px',
        paddingTop: '6px',
        paddingBottom: '6px',
        alignItems: 'stretch',
        gap: '2px',
        fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        letterSpacing: '0.08px',
        lineHeight: 1.18,
      }}
    >
      {/* Consumidor Button */}
      <Box
        sx={{
          borderRadius: '83px',
          backgroundColor:
            selectedRole === 'consumer' ? '#740056' : 'transparent',
          alignSelf: 'start',
          display: 'flex',
          minHeight: '33px',
          flexDirection: 'column',
          overflow: 'hidden',
          alignItems: 'stretch',
          color: selectedRole === 'consumer' ? '#FFF' : '#740056',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor:
              selectedRole === 'consumer' ? '#5a0042' : 'rgba(116, 0, 86, 0.1)',
          },
        }}
        onClick={() => onRoleChange('consumer')}
      >
        <Box
          sx={{
            color: selectedRole === 'consumer' ? '#FFF' : '#740056',
            alignSelf: 'stretch',
            display: 'flex',
            width: '100%',
            paddingLeft: '20px',
            paddingRight: '20px',
            paddingTop: '8px',
            paddingBottom: '8px',
            alignItems: 'center',
            gap: '7px',
            justifyContent: 'center',
            flex: 1,
            height: '100%',
          }}
        >
          Consumidor
        </Box>
      </Box>

      {/* Proveedor Button */}
      <Box
        sx={{
          borderRadius: '83px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          alignItems: 'stretch',
          color: selectedRole === 'provider' ? '#FFF' : '#740056',
          backgroundColor:
            selectedRole === 'provider' ? '#740056' : 'transparent',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor:
              selectedRole === 'provider' ? '#5a0042' : 'rgba(116, 0, 86, 0.1)',
          },
        }}
        onClick={() => onRoleChange('provider')}
      >
        <Box
          sx={{
            alignSelf: 'stretch',
            display: 'flex',
            width: '100%',
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '8px',
            paddingBottom: '8px',
            alignItems: 'center',
            gap: '7px',
            justifyContent: 'center',
          }}
        >
          Proveedor
        </Box>
      </Box>
    </Box>
  );
};
