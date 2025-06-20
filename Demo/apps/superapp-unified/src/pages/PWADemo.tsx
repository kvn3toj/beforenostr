/**
 * 📱 PWA Demo Page
 * 
 * Página de demostración de las capacidades PWA avanzadas de CoomÜnity SuperApp
 */

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  PhoneAndroid as PWAIcon,
  Rocket as RocketIcon,
  Star as StarIcon,
} from '@mui/icons-material';

import PWAFeatures from '../components/common/PWAFeatures';

const PWADemo: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Header */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)',
        color: 'white'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PWAIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                PWA Demo
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Funcionalidades Nativas Avanzadas
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip 
              icon={<RocketIcon />}
              label="Progressive Web App"
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip 
              icon={<StarIcon />}
              label="Experiencia Nativa"
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Información sobre PWA */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>¿Qué es una PWA?</strong> Las Progressive Web Apps combinan lo mejor de las aplicaciones web y móviles, 
          ofreciendo funcionalidades nativas como notificaciones push, acceso offline, instalación en el dispositivo y más.
        </Typography>
      </Alert>

      {/* Componente de funcionalidades PWA */}
      <PWAFeatures />

      {/* Información adicional */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🌟 Beneficios de CoomÜnity como PWA
          </Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#E91E63' }}>
                📱 Experiencia Nativa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Funciona como una app nativa con acceso a hardware del dispositivo
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#E91E63' }}>
                🔄 Funciona Offline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Acceso a contenido y funcionalidades básicas sin conexión a internet
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#E91E63' }}>
                🔔 Notificaciones Push
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recibe actualizaciones importantes directamente en tu dispositivo
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#E91E63' }}>
                💾 Instalación Fácil
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Instala la app directamente desde el navegador sin tiendas de aplicaciones
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PWADemo; 