import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import {
  PlayArrow,
  BarChart,
  Groups,
  ShoppingCart,
  SwapHoriz
} from '@mui/icons-material';

// 🌿 Definición de navegación consciente inspirada en los elementos
const CONSCIOUS_NAV_ITEMS = [
  {
    label: 'ÜPlay',
    value: '/uplay',
    icon: <PlayArrow />,
    element: 'Fuego', // Acción, energía, movimiento
    color: '#FF6B35',
    gradient: 'linear-gradient(135deg, #FF6B35, #FF8E53)',
    description: 'Aprendizaje gamificado',
    badge: undefined, // Se podrá añadir dinámicamente
  },
  {
    label: 'ÜStats',
    value: '/ustats',
    icon: <BarChart />,
    element: 'Aire', // Información, análisis, claridad
    color: '#A8E6CF',
    gradient: 'linear-gradient(135deg, #A8E6CF, #88D8A3)',
    description: 'Métricas conscientes',
    badge: undefined,
  },
  {
    label: 'ÜSocial',
    value: '/social',
    icon: <Groups />,
    element: 'Tierra', // Comunidad, conexión, estabilidad
    color: '#D2B48C',
    gradient: 'linear-gradient(135deg, #D2B48C, #CD853F)',
    description: 'Comunidad consciente',
    badge: undefined,
  },
  {
    label: 'ÜMarket',
    value: '/marketplace',
    icon: <ShoppingCart />,
    element: 'Éter', // Abundancia, transformación, servicio
    color: '#DDA0DD',
    gradient: 'linear-gradient(135deg, #DDA0DD, #BA55D3)',
    description: 'Mercado consciente',
    highlight: true, // Elemento destacado
    badge: undefined,
  },
];

// 🎭 Hook para simular badges conscientes (en el futuro vendrán del backend)
const useConsciousBadges = () => {
  // Esto eventualmente conectará con el backend para obtener:
  // - Métritos ganados recientes
  // - Notificaciones de Ayni
  // - Mensajes comunitarios
  // - Updates de ÜPlay
  // - Intercambios pendientes

  return {
    '/uplay': undefined, // Nuevos videos disponibles
    '/lets': undefined, // Intercambios pendientes
    '/ustats': undefined, // Nuevos métritos
    '/social': undefined, // Mensajes sin leer
    '/marketplace': undefined, // Nuevos productos/servicios
  };
};

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const badges = useConsciousBadges();

  const getCurrentValue = () => {
    const currentPath = location.pathname;
    const matchedItem = CONSCIOUS_NAV_ITEMS.find((item) =>
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
      aria-label="Navegación móvil principal CoomÜnity"
      className="conscious-nav responsive-element mobile-only"
      data-testid="conscious-bottom-navigation"
      data-responsive="mobile-only"
      data-breakpoint="md-down"
      data-contextual="conscious-navigation"
      data-context-type="conscious-bottom-navigation"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(168, 230, 207, 0.5) 20%, rgba(221, 160, 221, 0.5) 50%, rgba(78, 205, 196, 0.5) 80%, transparent 100%)',
        },
      }}
      elevation={0}
    >
      <MuiBottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        className="conscious-navigation-container"
        data-contextual="conscious-navigation-container"
        data-context-type="conscious-nav-tabs"
        sx={{
          height: 80, // Ligeramente más alto para mejor UX
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '10px 8px 14px 8px',
            color: 'rgba(73, 69, 79, 0.8)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& .MuiSvgIcon-root': {
              fontSize: 32, // Iconos más grandes
              transition: 'color 0.2s',
            },
            '&.Mui-selected': {
              color: theme => theme.palette.primary.main,
              fontWeight: 700,
              transform: 'translateY(-3px)',
              background: theme => theme.palette.action.selected,
              borderRadius: 2,
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
              '& .MuiSvgIcon-root': {
                color: theme => theme.palette.primary.main,
              },
            },
            '&:hover': {
              transform: 'translateY(-1px)',
              background: theme => theme.palette.action.hover,
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: 15,
            fontWeight: 600,
            lineHeight: '18px',
            letterSpacing: '0.3px',
            marginTop: '6px',
            transition: 'color 0.2s',
          },
        }}
      >
        {CONSCIOUS_NAV_ITEMS.map((item) => {
          const isSelected = getCurrentValue() === item.value;
          const isHighlight = item.highlight && isSelected;
          const itemBadge = badges[item.value as keyof typeof badges];

          const ConsciousIconComponent = () => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Conscious Icon Container */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isSelected ? (item.gradient || item.color) : 'transparent',
                  boxShadow: isSelected ? '0 2px 8px 0 rgba(0,0,0,0.08)' : 'none',
                  transition: 'background 0.2s',
                }}
              >
                {item.icon}
              </Box>

              {/* Badge consciente */}
              {itemBadge && (
                <Badge
                  badgeContent={itemBadge}
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    '& .MuiBadge-badge': {
                      backgroundColor: '#FF6B35',
                      background: 'linear-gradient(135deg, #FF6B35, #FF8E53)',
                      color: '#FFF',
                      fontSize: '10px',
                      fontWeight: 600,
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
                    },
                  }}
                />
              )}

              {/* Indicador de elemento consciente */}
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: item.gradient,
                    boxShadow: `0 0 8px ${item.color}80`,
                  }}
                />
              )}
            </Box>
          );

          return (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              icon={<ConsciousIconComponent />}
              value={item.value}
              aria-current={isSelected ? 'page' : undefined}
              sx={{
                mx: 0.5,
                '& .MuiBottomNavigationAction-label': {
                  color: isSelected ? 'primary.main' : 'text.secondary',
                },
              }}
            />
          );
        })}
      </MuiBottomNavigation>

      {/* Subtle conscious energy indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #FF6B35, #4ECDC4, #A8E6CF, #D2B48C, #DDA0DD)',
          opacity: 0.3,
        }}
      />
    </Paper>
  );
};
