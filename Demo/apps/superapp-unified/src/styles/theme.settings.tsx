import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Contrast as ContrastIcon,
  Animation as AnimationIcon,
  TextFields as FontSizeIcon,
  Margin as SpacingIcon,
  RoundedCorner as BorderRadiusIcon,
  Opacity as IntensityIcon,
  LocalFire as FireIcon,
  Waves as WaterIcon,
  Terrain as EarthIcon,
  Air as AirIcon,
} from '@mui/icons-material';
import { useThemeContext } from './theme.context';
import { ElementalButton } from './theme.components';

// Componente para el selector de modo oscuro/claro
export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useThemeContext();

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          icon={<LightModeIcon />}
          checkedIcon={<DarkModeIcon />}
        />
      }
      label={isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
    />
  );
};

// Componente para el selector de elemento
export const ElementSelector = () => {
  const { element, changeElement } = useThemeContext();

  return (
    <ToggleButtonGroup
      value={element}
      exclusive
      onChange={(_, newElement) => newElement && changeElement(newElement)}
      aria-label="elemento"
    >
      <ToggleButton value="fuego" aria-label="fuego">
        <Tooltip title="Fuego">
          <FireIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="agua" aria-label="agua">
        <Tooltip title="Agua">
          <WaterIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="tierra" aria-label="tierra">
        <Tooltip title="Tierra">
          <EarthIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="aire" aria-label="aire">
        <Tooltip title="Aire">
          <AirIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

// Componente para el control de contraste
export const ContrastToggle = () => {
  const { isHighContrast, toggleContrastMode } = useThemeContext();

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isHighContrast}
          onChange={toggleContrastMode}
          icon={<ContrastIcon />}
        />
      }
      label="Alto Contraste"
    />
  );
};

// Componente para el control de movimiento reducido
export const ReducedMotionToggle = () => {
  const { reducedMotion, toggleReducedMotion } = useThemeContext();

  return (
    <FormControlLabel
      control={
        <Switch
          checked={reducedMotion}
          onChange={toggleReducedMotion}
          icon={<AnimationIcon />}
        />
      }
      label="Movimiento Reducido"
    />
  );
};

// Componente para el control de tamaño de fuente
export const FontSizeControl = () => {
  const { fontSize, changeFontSize } = useThemeContext();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Tamaño de Fuente
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <FontSizeIcon />
        <Slider
          value={fontSize}
          onChange={(_, value) => changeFontSize(value as number)}
          min={0.8}
          max={1.5}
          step={0.1}
          aria-label="tamaño de fuente"
        />
      </Stack>
    </Box>
  );
};

// Componente para el control de espaciado
export const SpacingControl = () => {
  const { spacing, changeSpacing } = useThemeContext();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Espaciado
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <SpacingIcon />
        <Slider
          value={spacing}
          onChange={(_, value) => changeSpacing(value as number)}
          min={0.8}
          max={1.5}
          step={0.1}
          aria-label="espaciado"
        />
      </Stack>
    </Box>
  );
};

// Componente para el control de radio de borde
export const BorderRadiusControl = () => {
  const { borderRadius, changeBorderRadius } = useThemeContext();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Radio de Borde
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <BorderRadiusIcon />
        <Slider
          value={borderRadius}
          onChange={(_, value) => changeBorderRadius(value as number)}
          min={0}
          max={2}
          step={0.1}
          aria-label="radio de borde"
        />
      </Stack>
    </Box>
  );
};

// Componente para el control de intensidad de efectos
export const IntensityControl = () => {
  const { intensity, changeIntensity } = useThemeContext();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Intensidad de Efectos
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <IntensityIcon />
        <Slider
          value={intensity}
          onChange={(_, value) => changeIntensity(value as number)}
          min={0}
          max={1}
          step={0.1}
          aria-label="intensidad de efectos"
        />
      </Stack>
    </Box>
  );
};

// Componente para restablecer los valores por defecto
export const ResetThemeButton = () => {
  const {
    changeElement,
    toggleDarkMode,
    toggleContrastMode,
    changeFontSize,
    changeSpacing,
    changeBorderRadius,
    changeIntensity,
    toggleReducedMotion,
  } = useThemeContext();

  const handleReset = () => {
    changeElement('tierra');
    toggleDarkMode();
    toggleContrastMode();
    changeFontSize(1);
    changeSpacing(1);
    changeBorderRadius(1);
    changeIntensity(1);
    toggleReducedMotion();
  };

  return (
    <ElementalButton
      onClick={handleReset}
      element="tierra"
      variant="contained"
      fullWidth
    >
      Restablecer Valores por Defecto
    </ElementalButton>
  );
};

// Componente principal de configuración del tema
export const ThemeSettings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Configuración del Tema
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Modo
            </Typography>
            <DarkModeToggle />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Elemento
            </Typography>
            <ElementSelector />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Accesibilidad
            </Typography>
            <Stack>
              <ContrastToggle />
              <ReducedMotionToggle />
            </Stack>
          </Box>
          <FontSizeControl />
          <SpacingControl />
          <BorderRadiusControl />
          <IntensityControl />
          <ResetThemeButton />
        </Stack>
      </CardContent>
    </Card>
  );
};

// Componente para la barra de herramientas rápida del tema
export const ThemeToolbar = () => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Modo Oscuro/Claro">
        <IconButton onClick={() => useThemeContext().toggleDarkMode()}>
          {useThemeContext().isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
      <ElementSelector />
      <Tooltip title="Alto Contraste">
        <IconButton onClick={() => useThemeContext().toggleContrastMode()}>
          <ContrastIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Movimiento Reducido">
        <IconButton onClick={() => useThemeContext().toggleReducedMotion()}>
          <AnimationIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};