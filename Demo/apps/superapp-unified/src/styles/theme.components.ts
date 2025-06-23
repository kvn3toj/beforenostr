import { styled } from '@mui/material/styles';
import { Card, Box, Button, IconButton, Paper } from '@mui/material';
import { getGlassmorphismStyles, getElevationStyles, getTransitionStyles, getHoverStyles, getActiveStyles, getFocusStyles } from './theme.utils';
import { getElementGradient, getElementShadowColor } from './theme.variants';

// Componente base para widgets revolucionarios
export const RevolutionaryWidget = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'element' && prop !== 'intensity' && prop !== 'glow',
})<{
  element?: 'fuego' | 'agua' | 'tierra' | 'aire';
  intensity?: number;
  glow?: boolean;
}>(({ theme, element, intensity = 0.1, glow = false }) => ({
  ...getGlassmorphismStyles(theme, intensity),
  ...getTransitionStyles(['transform', 'box-shadow']),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: element ? getElementGradient(element) : theme.palette.primary.main,
    opacity: 0.8,
  },
  ...(glow && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '200%',
      height: '200%',
      transform: 'translate(-50%, -50%)',
      background: element
        ? getElementGradient(element)
        : `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
      opacity: 0.1,
      pointerEvents: 'none',
    },
  }),
  ...getHoverStyles(theme),
  ...getActiveStyles(),
  ...getFocusStyles(theme),
}));

// Componente para tarjetas cósmicas
export const CosmicCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'element' && prop !== 'variant' && prop !== 'glow',
})<{
  element?: 'fuego' | 'agua' | 'tierra' | 'aire';
  variant?: 'elevated' | 'glass' | 'outlined';
  glow?: boolean;
}>(({ theme, element, variant = 'elevated', glow = false }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  ...(variant === 'elevated' && {
    ...getElevationStyles(theme),
  }),
  ...(variant === 'glass' && {
    ...getGlassmorphismStyles(theme),
  }),
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'transparent',
  }),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: element ? getElementGradient(element) : theme.palette.primary.main,
    opacity: 0.8,
  },
  ...(glow && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '200%',
      height: '200%',
      transform: 'translate(-50%, -50%)',
      background: element
        ? getElementGradient(element)
        : `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
      opacity: 0.1,
      pointerEvents: 'none',
    },
  }),
  ...getTransitionStyles(['transform', 'box-shadow']),
  ...getHoverStyles(theme),
  ...getActiveStyles(),
  ...getFocusStyles(theme),
}));

// Componente para botones elementales
export const ElementalButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'element' && prop !== 'glow',
})<{
  element?: 'fuego' | 'agua' | 'tierra' | 'aire';
  glow?: boolean;
}>(({ theme, element, glow = false }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 600,
  background: element ? getElementGradient(element) : theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: `0 4px 8px ${getElementShadowColor(element || 'tierra')}`,
  ...getTransitionStyles(['transform', 'box-shadow', 'filter']),
  ...(glow && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '150%',
      height: '150%',
      transform: 'translate(-50%, -50%)',
      background: element
        ? getElementGradient(element)
        : `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
      opacity: 0.2,
      pointerEvents: 'none',
    },
  }),
  '&:hover': {
    background: element ? getElementGradient(element) : theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 16px ${getElementShadowColor(element || 'tierra')}`,
    filter: 'brightness(1.1)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  ...getFocusStyles(theme),
}));

// Componente para botones de icono elementales
export const ElementalIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'element' && prop !== 'glow',
})<{
  element?: 'fuego' | 'agua' | 'tierra' | 'aire';
  glow?: boolean;
}>(({ theme, element, glow = false }) => ({
  borderRadius: '50%',
  background: element ? getElementGradient(element) : theme.palette.primary.main,
  color: theme.palette.common.white,
  ...getTransitionStyles(['transform', 'box-shadow', 'filter']),
  ...(glow && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '150%',
      height: '150%',
      transform: 'translate(-50%, -50%)',
      background: element
        ? getElementGradient(element)
        : `radial-gradient(circle, ${theme.palette.primary.main} 0%, transparent 70%)`,
      opacity: 0.2,
      pointerEvents: 'none',
    },
  }),
  '&:hover': {
    background: element ? getElementGradient(element) : theme.palette.primary.dark,
    transform: 'scale(1.1)',
    filter: 'brightness(1.1)',
  },
  '&:active': {
    transform: 'scale(1)',
  },
  ...getFocusStyles(theme),
}));

// Componente para contenedores de vidrio
export const GlassContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'intensity',
})<{
  intensity?: number;
}>(({ theme, intensity = 0.1 }) => ({
  ...getGlassmorphismStyles(theme, intensity),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));

// Componente para tarjetas de papel elevadas
export const ElevatedPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'elevation',
})<{
  elevation?: number;
}>(({ theme, elevation = 1 }) => ({
  ...getElevationStyles(theme, elevation),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  ...getTransitionStyles(['transform', 'box-shadow']),
  ...getHoverStyles(theme),
}));

// Componente para contenedores de gradiente
export const GradientContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'element' && prop !== 'intensity',
})<{
  element?: 'fuego' | 'agua' | 'tierra' | 'aire';
  intensity?: number;
}>(({ theme, element, intensity = 0.1 }) => ({
  position: 'relative',
  background: element ? getElementGradient(element) : theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  color: theme.palette.common.white,
  opacity: intensity,
}));