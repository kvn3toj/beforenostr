import React from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import UPlayMain from '../components/modules/uplay/UPlayMain';

/**
 * UPlay Page Component
 * 
 * Página principal del módulo ÜPlay que proporciona:
 * - Experiencia unificada que combina lo mejor de todos los modos
 * - Lista de videos disponibles con navegación directa
 * - Sistema integrado de gamificación y recompensas
 * - Preguntas interactivas y métricas de progreso
 * 
 * Filosofía CoomÜnity:
 * - Ayni: Ofrece aprendizaje equilibrado y reciprocidad
 * - Bien Común: Facilita el acceso al conocimiento para todos
 * - Öndas: Genera energía positiva a través del aprendizaje interactivo
 * - Mëritos: Reconoce las contribuciones al crecimiento colectivo
 */
const UPlay: React.FC = () => {
  const location = useLocation();
  
  // Determinar si venimos de una experiencia específica
  const fromSpecificMode = location.state?.from;
  
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Principal */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #FF5722 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          🎬 ÜPlay - GPL Gamified Play List
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Plataforma Unificada de Aprendizaje Interactivo y Gamificado
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
          Experimenta el aprendizaje a través de videos interactivos que combinan 
          gamificación avanzada, preguntas dinámicas y los principios de <strong>Ayni</strong> (reciprocidad) 
          y <strong>Bien Común</strong> de CoomÜnity. Cada video es una oportunidad de crecer y contribuir.
        </Typography>
      </Box>

      {/* Mensaje de bienvenida si viene de modo específico */}
      {fromSpecificMode && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          onClose={() => window.history.replaceState({}, '', location.pathname)}
        >
          Has regresado desde <strong>{fromSpecificMode}</strong>. 
          Ahora todas las experiencias están unificadas en una sola plataforma mejorada.
        </Alert>
      )}

      {/* Características Destacadas */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          ✨ Experiencia Unificada
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              🎮 Gamificación Completa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Mëritos, Öndas y progreso
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
              ❓ Preguntas Interactivas
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Aprendizaje activo y dinámico
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
              📱 Diseño Adaptativo
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Optimizado para todos los dispositivos
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
              🌟 Filosofía Ayni
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Reciprocidad y Bien Común
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Lista Principal de Videos */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          📚 Videos Disponibles
        </Typography>
        <UPlayMain />
      </Box>

      {/* Información Filosófica */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          🌱 Filosofía del Aprendizaje CoomÜnity
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          En ÜPlay, cada video es más que contenido educativo: es una oportunidad de practicar el <strong>Ayni</strong> 
          (reciprocidad equilibrada) a través del aprendizaje activo. Al responder preguntas y ganar <strong>Mëritos</strong>, 
          contribuyes al <strong>Bien Común</strong> de la comunidad mientras generas <strong>Öndas</strong> de energía positiva.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cada interacción fortalece el ecosistema colaborativo de CoomÜnity, donde el crecimiento individual 
          impulsa el bienestar colectivo. ¡Aprende, crece y transforma junto a nuestra comunidad!
        </Typography>
      </Box>
    </Container>
  );
}; 

export default UPlay; 