/**
 * 🎨 COLOR SYSTEM DEMONSTRATION COMPONENT
 * ===============================================================================
 * This component demonstrates the centralized color system in action
 * and allows testing different palettes to verify the integration
 * ===============================================================================
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Grid,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Fab,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Palette,
  Star,
  Favorite,
  Settings,
  PlayArrow,
  Home,
  ShoppingCart,
  People,
  Analytics,
} from '@mui/icons-material';
import {
  getPrimaryColor,
  getSemanticColor,
  getPrimaryGradient,
  getSemanticGradient,
  COOMUNITY_ELEMENTS,
  COOMUNITY_METRICS,
  COLOR_PALETTES,
  ACTIVE_PALETTE,
  debugColorSystem,
} from '../../design-system/color-system';

export const ColorSystemDemo: React.FC = () => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Debug info
  const debugInfo = debugColorSystem();

  const handleToggleDebug = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Palette sx={{ fontSize: 40, color: getPrimaryColor('500') }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              🎨 Sistema Centralizado de Colores
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Paleta actual: <strong>{COLOR_PALETTES[ACTIVE_PALETTE].name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {COLOR_PALETTES[ACTIVE_PALETTE].description}
            </Typography>
          </Box>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={showDebugInfo}
              onChange={handleToggleDebug}
              color="primary"
            />
          }
          label="Mostrar información de debug"
        />
      </Card>

      {/* Debug Info */}
      {showDebugInfo && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Debug Info:</Typography>
          <Typography variant="body2">
            <strong>Paleta activa:</strong> {debugInfo.activePalette}<br />
            <strong>Paletas disponibles:</strong> {debugInfo.availablePalettes.join(', ')}<br />
            <strong>Color primario:</strong> {getPrimaryColor('500')}<br />
            <strong>Para cambiar paleta:</strong> Edita ACTIVE_PALETTE en src/design-system/color-system.ts
          </Typography>
        </Alert>
      )}

      {/* Primary Colors Scale */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Escala de Colores Primarios
          </Typography>
          <Grid container spacing={1}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <Grid item key={shade}>
                <Paper
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: getPrimaryColor(shade.toString() as any),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: shade > 500 ? '#fff' : '#000',
                    fontWeight: 'bold',
                    border: shade === 500 ? '3px solid #000' : 'none',
                  }}
                >
                  {shade}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Semantic Colors */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Colores Semánticos
          </Typography>
          <Grid container spacing={2}>
            {(['success', 'error', 'warning', 'info'] as const).map((type) => (
              <Grid item xs={6} md={3} key={type}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: getSemanticColor(type, 'light'),
                    border: `2px solid ${getSemanticColor(type, 'main')}`,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: getSemanticColor(type, 'dark'), mb: 1 }}
                  >
                    {type.toUpperCase()}
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 40,
                      background: getSemanticGradient(type),
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: getSemanticColor(type, 'dark') }}>
                    {getSemanticColor(type, 'main')}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* CoomÜnity Elements */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Elementos CoomÜnity
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(COOMUNITY_ELEMENTS).map(([element, config]) => (
              <Grid item xs={6} md={3} key={element}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: config.gradient,
                    color: '#fff',
                    textAlign: 'center',
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {element.toUpperCase()}
                  </Typography>
                  <Typography variant="body2">
                    {config.color}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Material UI Components Demo */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Componentes Material UI
          </Typography>
          <Grid container spacing={2}>
            {/* Buttons */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Botones</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Button variant="contained" startIcon={<PlayArrow />}>
                  Contained
                </Button>
                <Button variant="outlined" startIcon={<Star />}>
                  Outlined
                </Button>
                <Button variant="text" startIcon={<Favorite />}>
                  Text
                </Button>
              </Box>
            </Grid>

            {/* Chips */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Chips</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label="Primary" color="primary" />
                <Chip label="Success" color="success" />
                <Chip label="Error" color="error" />
                <Chip label="Warning" color="warning" />
              </Box>
            </Grid>

            {/* Progress */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Progress Bars</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Primary</Typography>
                <LinearProgress value={75} variant="determinate" sx={{ mb: 1 }} />
                <Typography variant="body2" gutterBottom>Success</Typography>
                <LinearProgress value={60} variant="determinate" color="success" sx={{ mb: 1 }} />
                <Typography variant="body2" gutterBottom>Warning</Typography>
                <LinearProgress value={45} variant="determinate" color="warning" />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Module Colors Preview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Vista Previa de Módulos
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: 'Home/Dashboard', icon: Home, element: 'fuego' },
              { name: 'Marketplace', icon: ShoppingCart, element: 'tierra' },
              { name: 'ÜPlay', icon: PlayArrow, element: 'fuego' },
              { name: 'Social', icon: People, element: 'agua' },
              { name: 'UStats', icon: Analytics, element: 'aire' },
            ].map((module) => (
              <Grid item xs={6} md={2.4} key={module.name}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: COOMUNITY_ELEMENTS[module.element as keyof typeof COOMUNITY_ELEMENTS].gradient,
                    color: '#fff',
                    minHeight: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <module.icon />
                  <Typography variant="body2" fontWeight="bold">
                    {module.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert severity="success">
        <Typography variant="h6" gutterBottom>
          🎯 Cómo cambiar la paleta completa:
        </Typography>
        <Typography variant="body2">
          1. Abrir <code>src/design-system/color-system.ts</code><br />
          2. Cambiar <code>ACTIVE_PALETTE: PaletteType = '{ACTIVE_PALETTE}'</code><br />
          3. Opciones disponibles: {Object.keys(COLOR_PALETTES).map(p => `'${p}'`).join(', ')}<br />
          4. ¡Toda la aplicación se actualiza automáticamente!
        </Typography>
      </Alert>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Settings />
      </Fab>
    </Box>
  );
};