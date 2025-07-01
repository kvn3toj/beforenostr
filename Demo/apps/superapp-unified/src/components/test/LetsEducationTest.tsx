import React from 'react';
import { Box, Typography, Button, Chip, Paper, Grid } from '@mui/material';
import { useLetsEducation } from '../../contexts/LetsEducationContext';

/**
 * Componente de prueba para verificar el funcionamiento del LetsEducationContext
 * Este componente se puede usar temporalmente para validar la implementación
 */
export const LetsEducationTest: React.FC = () => {
  const {
    state,
    updateUserLevel,
    completeOnboarding,
    addAchievement,
    markConceptAsUnderstood,
    setPreferredStyle,
    toggleSimplifiedUI,
    setCurrentStep,
    recordInteraction,
    getRecommendedNextStep,
    shouldShowTooltip,
    getUIComplexityLevel,
    resetProgress
  } = useLetsEducation();

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        🧪 LETS Education Context Test
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Este componente verifica que el contexto de educación LETS funciona correctamente.
      </Typography>

      <Grid container spacing={3}>
        {/* Estado Actual */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            📊 Estado Actual
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Nivel de Usuario:</strong> 
              <Chip 
                label={state.userLevel} 
                color="primary" 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Onboarding Completado:</strong> 
              <Chip 
                label={state.hasCompletedOnboarding ? 'Sí' : 'No'} 
                color={state.hasCompletedOnboarding ? 'success' : 'warning'}
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Estilo Preferido:</strong> 
              <Chip 
                label={state.preferredExplanationStyle} 
                color="secondary" 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>UI Simplificada:</strong> 
              <Chip 
                label={state.showSimplifiedUI ? 'Activada' : 'Desactivada'} 
                color={state.showSimplifiedUI ? 'info' : 'default'}
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Paso Actual:</strong> 
              <Chip 
                label={state.currentStep || 'No definido'} 
                color="default" 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Logros:</strong> {state.completedAchievements.length}
            </Typography>
            {state.completedAchievements.map((achievement, index) => (
              <Chip 
                key={index}
                label={achievement} 
                color="success" 
                size="small" 
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Conceptos Entendidos:</strong> {state.understoodConcepts.length}
            </Typography>
            {state.understoodConcepts.map((concept, index) => (
              <Chip 
                key={index}
                label={concept} 
                color="info" 
                size="small" 
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        </Grid>

        {/* Funciones Computadas */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            🧮 Funciones Computadas
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Siguiente Paso Recomendado:</strong> 
              <Chip 
                label={getRecommendedNextStep() || 'Ninguno'} 
                color="primary" 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Nivel de Complejidad UI:</strong> 
              <Chip 
                label={getUIComplexityLevel()} 
                color="secondary" 
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>¿Mostrar tooltip para "reciprocidad"?:</strong> 
              <Chip 
                label={shouldShowTooltip('reciprocidad') ? 'Sí' : 'No'} 
                color={shouldShowTooltip('reciprocidad') ? 'warning' : 'success'}
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>
        </Grid>

        {/* Controles de Prueba */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            🎮 Controles de Prueba
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => updateUserLevel('beginner')}
            >
              Nivel: Principiante
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => updateUserLevel('intermediate')}
            >
              Nivel: Intermedio
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => updateUserLevel('advanced')}
            >
              Nivel: Avanzado
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => completeOnboarding()}
            >
              Completar Onboarding
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => addAchievement('first_transaction')}
            >
              Agregar Logro: Primera Transacción
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => markConceptAsUnderstood('reciprocidad')}
            >
              Entender: Reciprocidad
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => markConceptAsUnderstood('meritos')}
            >
              Entender: Méritos
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => toggleSimplifiedUI()}
            >
              Toggle UI Simplificada
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => setPreferredStyle('visual')}
            >
              Estilo: Visual
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => setPreferredStyle('textual')}
            >
              Estilo: Textual
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => setPreferredStyle('interactive')}
            >
              Estilo: Interactivo
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => recordInteraction('concept', 'lukas')}
            >
              Ver Concepto: Lükas
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => recordInteraction('tutorial', 'wallet_basics')}
            >
              Completar Tutorial: Wallet
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => setCurrentStep('marketplace')}
            >
              Ir a: Marketplace
            </Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="error"
              size="small"
              onClick={() => resetProgress()}
            >
              🔄 Resetear Todo el Progreso
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💾 <strong>Persistencia:</strong> Todos los cambios se guardan automáticamente en localStorage.
          Recarga la página para verificar que el estado persiste.
        </Typography>
      </Box>
    </Paper>
  );
}; 