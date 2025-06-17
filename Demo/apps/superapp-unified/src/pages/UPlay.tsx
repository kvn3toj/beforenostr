import React from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import UPlayMain from '../components/modules/uplay/UPlayMain';

// 🌌 IMPORT DEL NUEVO DESIGN SYSTEM CÓSMICO
import { RevolutionaryWidget } from '../design-system/templates/RevolutionaryWidget';

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
 * 
 * 🎬 TRANSFORMADO CON DESIGN SYSTEM CÓSMICO (Fase 2, Semana 3)
 * Ahora utiliza el RevolutionaryWidget para unificar el estilo visual
 * con el Dashboard HOME y el resto de la SuperApp.
 * 
 * ✨ ACTIVACIÓN DE ESTILOS AVANZADOS (PROMPT #073)
 * Configuración "elevated" para glassmorphism, gradientes y auras cósmicas
 */
const UPlay: React.FC = () => {
  const location = useLocation();
  
  // Determinar si venimos de una experiencia específica
  const fromSpecificMode = location.state?.from;
  
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* 🌌 HEADER PRINCIPAL CON ESTILOS AVANZADOS ACTIVADOS */}
      <RevolutionaryWidget
        title="🎬 ÜPlay - GPL Gamified Play List"
        subtitle="Plataforma Unificada de Aprendizaje Interactivo y Gamificado"
        variant="elevated" // ✨ CAMBIO CLAVE: De "primary" a "elevated"
        element="agua" // El azul/cian se asocia bien con el video y la fluidez
        cosmicEffects={{ 
          enableParticles: true,
          enableGlow: true,
          enableAnimations: true,
          enableOrbitalEffects: true, // ✨ NUEVO: Efectos orbitales activados
          particleConfig: {
            count: 8, // ✨ INCREMENTADO: Más partículas para efecto dramático
            size: 6, // ✨ INCREMENTADO: Partículas más grandes
            color: '#00BCD4', // Cian para el elemento agua
            speed: 1.5, // ✨ INCREMENTADO: Movimiento más dinámico
            opacity: 0.8 // ✨ INCREMENTADO: Mayor visibilidad
          }
        }}
        cosmicIntensity="intense" // ✨ CAMBIO CLAVE: De "medium" a "intense"
        style={{ marginBottom: '2rem' }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto', mb: 3 }}>
            Experimenta el aprendizaje a través de videos interactivos que combinan 
            gamificación avanzada, preguntas dinámicas y los principios de <strong>Ayni</strong> (reciprocidad) 
            y <strong>Bien Común</strong> de CoomÜnity. Cada video es una oportunidad de crecer y contribuir.
          </Typography>

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
          <Box sx={{ mb: 4 }}>
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
        </Box>
      </RevolutionaryWidget>

      {/* 🎬 CONTENIDO PRINCIPAL CON ESTILOS AVANZADOS ACTIVADOS */}
      <RevolutionaryWidget
        title="📚 Videos Disponibles"
        variant="elevated" // ✨ CAMBIO CLAVE: De "secondary" a "elevated"
        element="agua"
        cosmicEffects={{ 
          enableGlow: true,
          enableAnimations: true,
          enableParticles: true, // ✨ NUEVO: Partículas activadas
          glowIntensity: 1.0, // ✨ NUEVO: Intensidad de brillo máximo
          particleConfig: {
            count: 6,
            size: 5,
            color: '#03A9F4',
            speed: 1.2,
            opacity: 0.7
          }
        }}
        cosmicIntensity="intense" // ✨ CAMBIO CLAVE: De "subtle" a "intense"
        style={{ marginBottom: '3rem' }}
      >
        <UPlayMain />
      </RevolutionaryWidget>

      {/* 🌱 SECCIÓN FILOSÓFICA CON MÁXIMO IMPACTO VISUAL */}
      <RevolutionaryWidget
        title="🌱 Filosofía del Aprendizaje CoomÜnity"
        variant="elevated" // ✨ CAMBIO CLAVE: De "accent" a "elevated"
        element="espiritu" // Elemento espíritu para la filosofía
        cosmicEffects={{ 
          enableParticles: true,
          enableOrbitalEffects: true,
          enableGlow: true, // ✨ NUEVO: Brillo activado
          enableAnimations: true,
          particleConfig: {
            count: 10, // ✨ INCREMENTADO: Más partículas espirituales
            size: 8, // ✨ INCREMENTADO: Partículas más prominentes
            color: '#9C27B0', // Púrpura para elemento espíritu
            speed: 0.8,
            opacity: 0.8 // ✨ INCREMENTADO: Mayor visibilidad
          },
          glowIntensity: 1.2 // ✨ NUEVO: Brillo intenso para sección filosófica
        }}
        cosmicIntensity="intense" // ✨ CAMBIO CLAVE: De "medium" a "intense"
      >
        <Box sx={{ textAlign: 'center' }}>
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
      </RevolutionaryWidget>
    </Container>
  );
}; 

export default UPlay; 