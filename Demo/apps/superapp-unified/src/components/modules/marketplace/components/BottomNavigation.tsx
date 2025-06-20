import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  PlayArrow,
  Assessment,
  Groups,
  ShoppingCart,
} from '@mui/icons-material';

interface BottomNavigationProps {
  activeTab: 'uplay' | 'ustats' | 'usocial' | 'umarket';
  onTabChange: (tab: 'uplay' | 'ustats' | 'usocial' | 'umarket') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'uplay' as const,
      label: 'ÜPlay',
      icon: <PlayArrow sx={{ width: '24px', height: '24px' }} />,
    },
    {
      id: 'ustats' as const,
      label: 'ÜStats',
      icon: <Assessment sx={{ width: '24px', height: '24px' }} />,
    },
    {
      id: 'usocial' as const,
      label: 'ÜSocial',
      icon: <Groups sx={{ width: '24px', height: '24px' }} />,
    },
    {
      id: 'umarket' as const,
      label: 'ÜMarket',
      icon: <ShoppingCart sx={{ width: '24px', height: '24px' }} />,
    },
  ];

  return (
    <Box
      sx={{
        alignItems: 'start',
        zIndex: 10,
        display: 'flex',
        height: '70px',
        paddingLeft: '8px',
        paddingRight: '8px',
        gap: '8px',
        justifyContent: 'start',
        background: '#FEE8F1',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '360px',
        margin: '0 auto',
      }}
    >
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          sx={{
            display: 'flex',
            paddingTop: '12px',
            paddingBottom: '16px',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'center',
            flex: 1,
            flexShrink: 1,
            flexBasis: '0%',
            cursor: 'pointer',
          }}
          onClick={() => onTabChange(tab.id)}
        >
          {/* Icon Container */}
          <Box
            sx={{
              borderRadius: '16px',
              alignSelf: 'center',
              display: 'flex',
              width: activeTab === tab.id ? '64px' : '32px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: activeTab === tab.id ? '#FFB1DB' : 'transparent',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
          >
            <Box
              sx={{
                alignSelf: 'stretch',
                display: 'flex',
                marginTop: 'auto',
                marginBottom: 'auto',
                minHeight: '32px',
                width: activeTab === tab.id ? '64px' : '64px',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '4px',
                paddingBottom: '4px',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(tab.icon, {
                sx: {
                  alignSelf: 'stretch',
                  position: 'relative',
                  display: 'flex',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  width: '24px',
                  color: activeTab === tab.id ? '#24181E' : '#49454F',
                },
              })}
            </Box>
          </Box>

          {/* Label */}
          <Typography
            sx={{
              color: activeTab === tab.id ? '#24181E' : '#49454F',
              textAlign: 'center',
              fontFamily: 'Rubik, -apple-system, Roboto, Helvetica, sans-serif',
              fontSize: '12px',
              fontWeight: activeTab === tab.id ? 600 : 500,
              lineHeight: 1.33,
              letterSpacing: '0.5px',
              marginTop: '4px',
            }}
          >
            {tab.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
