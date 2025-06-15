import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Box,
  useTheme,
} from '@mui/material';
import { PlayArrow, BarChart, Groups, ShoppingCart, SwapHoriz } from '@mui/icons-material';

const MOBILE_NAV_ITEMS = [
  {
    label: 'ÜPlay',
    value: '/uplay',
    icon: <PlayArrow />,
  },
  {
    label: 'LETS',
    value: '/lets',
    icon: <SwapHoriz />,
  },
  {
    label: 'ÜStats',
    value: '/stats',
    icon: <BarChart />,
  },
  {
    label: 'ÜSocial',
    value: '/social',
    icon: <Groups />,
  },
  {
    label: 'ÜMarket',
    value: '/marketplace',
    icon: <ShoppingCart />,
    highlight: true, // Para resaltar ÜMarket como en el wireframe
  },
];

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const getCurrentValue = () => {
    const currentPath = location.pathname;
    const matchedItem = MOBILE_NAV_ITEMS.find((item) =>
      item.value === '/'
        ? currentPath === '/'
        : currentPath.startsWith(item.value)
    );
    return matchedItem?.value || '/';
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Paper
      component="nav"
      role="navigation"
      aria-label="Navegación móvil principal"
      className="mobile-nav responsive-element mobile-only"
      data-responsive="mobile-only"
      data-breakpoint="md-down"
      data-contextual="mobile-navigation"
      data-context-type="bottom-navigation"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' }, // Only on mobile
        backgroundColor: '#FFFFFF', // Fondo blanco como en el wireframe
      }}
      elevation={3}
    >
      <MuiBottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        className="bottom-navigation-container contextual-navigation"
        data-contextual="navigation-container"
        data-context-type="mobile-nav-tabs"
        sx={{
          height: 70,
          backgroundColor: '#FFFFFF',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '12px 0px 16px 0px',
            color: '#49454F',
            '&.Mui-selected': {
              color: '#1D1B20',
              fontWeight: 600,
            },
            '&.highlight-action': {
              '& .MuiBottomNavigationAction-iconWrapper': {
                backgroundColor: '#E91E63',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              '& .MuiSvgIcon-root': {
                color: '#FFFFFF',
                fontSize: '24px',
              },
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '16px',
            letterSpacing: '0.5px',
          },
        }}
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const isSelected = getCurrentValue() === item.value;
          const isHighlight = item.highlight && isSelected;

          const IconComponent = () => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: isHighlight ? 56 : 32,
                height: isHighlight ? 56 : 32,
                borderRadius: isHighlight ? '50%' : isSelected ? '16px' : 0,
                backgroundColor: isHighlight
                  ? '#E91E63'
                  : isSelected
                    ? '#E8DEF8'
                    : 'transparent',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <Box
                sx={{
                  color: isHighlight ? '#FFFFFF' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </Box>
              {item.badge && (
                <Badge
                  badgeContent={item.badge}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    '& .MuiBadge-badge': {
                      backgroundColor: '#B3261E',
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: 500,
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '100px',
                    },
                  }}
                />
              )}
            </Box>
          );

          return (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={<IconComponent />}
              aria-label={`Navegar a ${item.label}`}
              title={`Ir a ${item.label}`}
              className={`bottom-nav-action contextual-control nav-item-interactive nav-active-indicator ${
                isSelected ? 'active' : ''
              } ${isHighlight ? 'highlight-action' : ''}`}
              data-contextual="navigation-action"
              data-context-type="nav-tab"
              data-nav-target={item.value}
            />
          );
        })}
      </MuiBottomNavigation>
    </Paper>
  );
};
