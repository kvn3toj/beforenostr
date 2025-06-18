import React, { useState } from 'react';
import { Box, Button, Container, Typography, Card, CardContent, Stack } from '@mui/material';
import { PlayArrow, AutoAwesome, CheckCircle } from '@mui/icons-material';
import { OnboardingFlow } from './OnboardingFlow';
import { OnboardingChecklist } from './OnboardingChecklist';
import { ProgressiveTooltips, getStageTooltips } from './ProgressiveTooltips';

export const OnboardingDemo: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showTooltips, setShowTooltips] = useState(false);
  const [userStage, setUserStage] = useState<'BUYER' | 'SEEKER' | 'SOLVER' | 'PROMOTER'>('BUYER');
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    console.log('✅ Onboarding completed successfully!');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    console.log('⏭️ Onboarding skipped');
  };

  const handleChecklistItemComplete = (itemId: string, rewards: any) => {
    setCompletedItems(prev => [...prev, itemId]);
    console.log(`✅ Completed: ${itemId}`, rewards);
  };

  const handleTooltipsComplete = () => {
    setShowTooltips(false);
    console.log('✅ Tooltips completed');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold">
        🎮 CoomÜnity Onboarding System
      </Typography>
      
      <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        Demo completo del sistema de discovery y onboarding implementado
      </Typography>

      {/* Demo Controls */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🚀 Controles de Demo
          </Typography>
          
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
            <Button
              variant="contained"
              startIcon={<AutoAwesome />}
              onClick={() => setShowOnboarding(true)}
              sx={{ 
                background: 'linear-gradient(135deg, #4CAF50, #2196F3)',
                '&:hover': { background: 'linear-gradient(135deg, #45a049, #1976d2)' }
              }}
            >
              Iniciar Onboarding
            </Button>

            <Button
              variant="outlined"
              startIcon={<CheckCircle />}
              onClick={() => setShowChecklist(true)}
              color="secondary"
            >
              Mostrar Checklist
            </Button>

            <Button
              variant="outlined"
              startIcon={<PlayArrow />}
              onClick={() => setShowTooltips(true)}
              color="info"
            >
              Activar Tooltips
            </Button>
          </Stack>

          {/* Stage Selector */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Customer Journey Stage:
            </Typography>
            <Stack direction="row" spacing={1}>
              {(['BUYER', 'SEEKER', 'SOLVER', 'PROMOTER'] as const).map((stage) => (
                <Button
                  key={stage}
                  variant={userStage === stage ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setUserStage(stage)}
                >
                  {stage}
                </Button>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            ✨ Características Implementadas
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle color="success" />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Progressive Onboarding (5 Etapas)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Flujo completo: Welcome → Philosophy → Personalization → Community → First Value
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle color="success" />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Sistema de Gamificación
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Öndas y Mëritos como recompensas inmediatas por completar acciones
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle color="success" />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Tooltips Progresivos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guías contextuales específicas por Customer Journey Stage
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle color="success" />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Checklist Interactivo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lista de tareas categorizada con sistema de recompensas visible
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle color="success" />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  Framer Motion Animations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Transiciones suaves y micro-interacciones premium
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🛠️ Implementación Técnica
          </Typography>
          
          <Typography variant="body1" paragraph>
            El sistema está basado en las mejores prácticas de onboarding investigadas de Userpilot,
            con patrones exitosos de LinkedIn, SoundCloud y Wise adaptados a la filosofía CoomÜnity.
          </Typography>

          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
            Tecnologías utilizadas:
          </Typography>
          
          <ul>
            <li><strong>React + TypeScript:</strong> Base sólida con tipado estricto</li>
            <li><strong>Material-UI:</strong> Componentes consistentes con el design system</li>
            <li><strong>Framer Motion:</strong> Animaciones fluidas y professional</li>
            <li><strong>LocalStorage:</strong> Persistencia de progreso del usuario</li>
            <li><strong>Progressive Disclosure:</strong> Información revelada gradualmente</li>
            <li><strong>User Segmentation:</strong> Experiencia personalizada por respuestas</li>
          </ul>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            Ready para integración con backend rewards system y analytics tracking.
          </Typography>
        </CardContent>
      </Card>

      {/* Onboarding Components */}
      <OnboardingFlow
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      <OnboardingChecklist
        isVisible={showChecklist}
        onClose={() => setShowChecklist(false)}
        userStage={userStage}
        completedItems={completedItems}
        onItemComplete={handleChecklistItemComplete}
      />

      <ProgressiveTooltips
        isActive={showTooltips}
        steps={getStageTooltips(userStage)}
        onComplete={handleTooltipsComplete}
        onSkip={() => setShowTooltips(false)}
        userStage={userStage}
      />

      {/* Add test targets for tooltips */}
      <Box sx={{ display: 'none' }}>
        <div data-testid="dashboard-header">Dashboard Header</div>
        <div data-testid="uplay-nav-link">ÜPlay Link</div>
        <div data-testid="marketplace-nav-link">Marketplace Link</div>
        <div data-testid="social-nav-link">Social Link</div>
        <div data-testid="create-listing-button">Create Listing</div>
      </Box>
    </Container>
  );
};

export default OnboardingDemo;