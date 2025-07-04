/**
 * 🔍 COMPONENTE DE VERIFICACIÓN DEL SISTEMA DE COLORES
 * ===============================================================================
 * Este componente permite verificar en tiempo real que el sistema centralizado
 * de colores está funcionando correctamente
 * ===============================================================================
 */

import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { 
  COLOR_PALETTES, 
  ACTIVE_PALETTE, 
  activePalette,
  getPrimaryColor,
  getSemanticColor,
  debugColorSystem
} from '../../design-system/color-system';

export const ColorSystemVerification: React.FC = () => {
  React.useEffect(() => {
    // Debug automático al cargar el componente
    debugColorSystem();
  }, []);

  const currentPrimaryColor = getPrimaryColor('500');
  const currentPaletteName = activePalette.name;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h3" gutterBottom>
        🔍 Verificación del Sistema de Colores
      </Typography>
      
      {/* Estado actual */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom>
          Estado Actual del Sistema
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Paleta Activa:</strong> {ACTIVE_PALETTE}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Nombre de la Paleta:</strong> {currentPaletteName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Color Primario Principal:</strong> {currentPrimaryColor}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Descripción:</strong> {activePalette.description}
        </Typography>
      </Paper>

      {/* Prueba visual de colores */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Prueba Visual - Color Primario
        </Typography>
        <Box
          sx={{
            width: 200,
            height: 100,
            backgroundColor: currentPrimaryColor,
            borderRadius: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: 2,
          }}
        >
          {currentPrimaryColor}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Este cuadro debe mostrar el color primario de la paleta activa
        </Typography>
      </Paper>

      {/* Botones de Material UI para verificar integración */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Componentes Material UI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button variant="contained" color="primary">
            Botón Primario
          </Button>
          <Button variant="outlined" color="primary">
            Botón Outlined
          </Button>
          <Button variant="contained" color="success">
            Botón Success
          </Button>
          <Button variant="contained" color="error">
            Botón Error
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Estos botones deben reflejar los colores de la paleta {ACTIVE_PALETTE}
        </Typography>
      </Paper>

      {/* Test de colores específicos */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Colores Específicos por Paleta
        </Typography>
        
        {/* Mostrar qué deberíamos ver según la paleta activa */}
        {ACTIVE_PALETTE === 'autumn' && (
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'warning.main', borderRadius: 1, backgroundColor: 'warning.light' }}>
            <Typography variant="body1" color="warning.dark">
              <strong>AUTUMN ACTIVA:</strong> Deberías ver naranja otoñal (#f97316) como color primario
            </Typography>
          </Box>
        )}

        {ACTIVE_PALETTE === 'cosmic' && (
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'info.main', borderRadius: 1, backgroundColor: 'info.light' }}>
            <Typography variant="body1" color="info.dark">
              <strong>COSMIC ACTIVA:</strong> Deberías ver azul cósmico (#0ea5e9) como color primario
            </Typography>
          </Box>
        )}

        {ACTIVE_PALETTE === 'gamifier' && (
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'warning.main', borderRadius: 1, backgroundColor: 'warning.light' }}>
            <Typography variant="body1" color="warning.dark">
              <strong>GAMIFIER ACTIVA:</strong> Deberías ver dorado (#CDAB5A) como color primario
            </Typography>
          </Box>
        )}

        {ACTIVE_PALETTE === 'friendly' && (
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'primary.main', borderRadius: 1, backgroundColor: 'primary.light' }}>
            <Typography variant="body1" color="primary.dark">
              <strong>FRIENDLY ACTIVA:</strong> Deberías ver azul amigable (#6366f1) como color primario
            </Typography>
          </Box>
        )}

        {ACTIVE_PALETTE === 'minimalist' && (
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'text.secondary', borderRadius: 1, backgroundColor: 'grey.100' }}>
            <Typography variant="body1" color="text.primary">
              <strong>MINIMALIST ACTIVA:</strong> Deberías ver gris azulado (#64748b) como color primario
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Instrucciones para verificar */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
        <Typography variant="body2" color="success.dark">
          <strong>Para verificar que funciona:</strong><br />
          1. Observa el color del botón "Botón Primario" arriba<br />
          2. Mira la caja de color primario<br />
          3. Cambia ACTIVE_PALETTE en src/design-system/color-system.ts<br />
          4. Recarga esta página y verifica que todo cambie automáticamente
        </Typography>
      </Box>
    </Box>
  );
};