/**
 * 🚨 REGISTRO CENTRALIZADO DE ICONOS - SOLUCIÓN ANTI-EMFILE
 * =========================================================
 * Este archivo centraliza TODOS los iconos de Material UI para evitar que Vite
 * procese miles de iconos individualmente y cause errores EMFILE.
 *
 * IMPORTANTE: SOLO importar aquí los iconos que realmente se usan en la aplicación
 */

import React from 'react';

// 🎯 IMPORTACIONES CONTROLADAS - SOLO LOS ICONOS NECESARIOS
import {
  // Navigation & Actions
  Menu,
  Close,
  ArrowBack,
  ArrowForward,
  ExpandMore,
  ExpandLess,

  // Status & Feedback
  CheckCircle,
  Error,
  Warning,
  Info,
  ErrorOutline,

  // UI Elements
  Visibility,
  VisibilityOff,
  Search,
  FilterList,
  Sort,
  Refresh,
  Home,

  // Media & Content
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,

  // Development & Testing
  BugReport,
  Analytics,
  Speed,
  Code,

  // Social & Communication
  Share,
  Favorite,
  FavoriteBorder,
  Comment,
  ThumbUp,

  // System & Settings
  Settings,
  DarkMode,
  LightMode,
  Brightness4,
  Brightness7,

  // Content Creation
  Edit,
  Add,
  Remove,
  Save,
  Cancel,

  // Charts & Data
  BarChart,
  PieChart,
  TrendingUp,
  TrendingDown,

  // User & Profile
  Person,
  PersonAdd,
  Group,
  AccountCircle,

  // File & Document
  Upload,
  Download,
  AttachFile,
  Description,

  // Communication
  Email,
  Phone,
  Chat,
  Notifications,

  // Location & Time
  LocationOn,
  AccessTime,
  Schedule,

  // Shopping & Commerce
  ShoppingCart,
  Payment,
  LocalOffer,
} from '@mui/icons-material';

// 🎯 REGISTRO DE ICONOS DISPONIBLES
export const IconRegistry = {
  // Navigation & Actions
  Menu,
  Close,
  ArrowBack,
  ArrowForward,
  ExpandMore,
  ExpandLess,

  // Status & Feedback
  CheckCircle,
  Error,
  Warning,
  Info,
  ErrorOutline,

  // UI Elements
  Visibility,
  VisibilityOff,
  Search,
  FilterList,
  Sort,
  Refresh,
  Home,

  // Media & Content
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,

  // Development & Testing
  BugReport,
  Analytics,
  Speed,
  Code,

  // Social & Communication
  Share,
  Favorite,
  FavoriteBorder,
  Comment,
  ThumbUp,

  // System & Settings
  Settings,
  DarkMode,
  LightMode,
  Brightness4,
  Brightness7,

  // Content Creation
  Edit,
  Add,
  Remove,
  Save,
  Cancel,

  // Charts & Data
  BarChart,
  PieChart,
  TrendingUp,
  TrendingDown,

  // User & Profile
  Person,
  PersonAdd,
  Group,
  AccountCircle,

  // File & Document
  Upload,
  Download,
  AttachFile,
  Description,

  // Communication
  Email,
  Phone,
  Chat,
  Notifications,

  // Location & Time
  LocationOn,
  AccessTime,
  Schedule,

  // Shopping & Commerce
  ShoppingCart,
  Payment,
  LocalOffer,
} as const;

// 🎯 TIPO PARA ICONOS DISPONIBLES
export type AvailableIcon = keyof typeof IconRegistry;

// 🎯 HOOK PARA USAR ICONOS DE FORMA SEGURA
export const useIcon = (iconName: AvailableIcon) => {
  const IconComponent = IconRegistry[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in registry. Add it to iconRegistry.ts`);
    return IconRegistry.Error; // Fallback icon
  }

  return IconComponent;
};

// 🎯 COMPONENTE DE ICONO CENTRALIZADO
export interface IconProps {
  name: AvailableIcon;
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'error' | 'disabled';
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  color = 'inherit',
  className,
  onClick
}) => {
  const IconComponent = useIcon(name);

  return React.createElement(IconComponent, {
    fontSize: size,
    color: color,
    className: className,
    onClick: onClick,
    style: { cursor: onClick ? 'pointer' : 'default' }
  });
};

export default IconRegistry;
