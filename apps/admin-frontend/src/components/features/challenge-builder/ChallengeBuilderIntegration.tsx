/**
 * 🌉 Challenge Builder Integration - Puente con Experience Console
 *
 * Componente que integra el Constructor Visual de Desafíos con el
 * Experience Console existente, manteniendo consistencia UX y arquitectural
 *
 * SINERGIA ARIA + ATLAS + COSMOS:
 * - ARIA: Interface visual perfectamente integrada
 * - ATLAS: Persistencia backend compatible con sistema existente  
 * - COSMOS: Coordinación fluida entre componentes
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
  Chip,
  Alert,
  Card,
  CardContent,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Extension as ExtensionIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  AutoAwesome as MagicIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { ChallengeBuilder } from './ChallengeBuilder';
import { ChallengeBuilderProvider, useChallengeBuilder, useValidation } from './ChallengeBuilderProvider';
import { ChallengeFlow } from '../../../types/challenge-builder.types';

// Props para la integración
interface ChallengeBuilderIntegrationProps {
  /** Callback cuando se crea/edita un desafío */
  onChallengeCreated?: (challenge: ChallengeFlow) => void;
  /** Callback cuando se guarda un desafío */
  onChallengeSaved?: (challenge: ChallengeFlow) => void;
  /** Desafío inicial para editar */
  initialChallenge?: ChallengeFlow;
  /** Modo de integración con Experience Console */
  mode?: 'embedded' | 'modal' | 'fullscreen';
  /** Etapa específica del customer journey */
  targetStage?: 'buyer' | 'seeker' | 'solver' | 'promoter';
}

// Componente interno que usa el context
const ChallengeBuilderContent: React.FC<{
  onClose?: () => void;
  onSave?: (challenge: ChallengeFlow) => void;
  mode: 'embedded' | 'modal' | 'fullscreen';
}> = ({ onClose, onSave, mode }) => {
  const { state, actions, computed } = useChallengeBuilder();
  const { summary } = useValidation();

  const handleSave = useCallback(async () => {
    if (!state.currentFlow || !computed.canPublish) return;

    try {
      await actions.saveFlow();
      onSave?.(state.currentFlow);
      if (mode === 'modal') {
        onClose?.();
      }
    } catch (error) {
      console.error('Error saving challenge:', error);
    }
  }, [state.currentFlow, computed.canPublish, actions, onSave, onClose, mode]);

  const getValidationSeverityColor = () => {
    if (summary.errors.length > 0) return 'error';
    if (summary.warnings.length > 0) return 'warning';
    return 'success';
  };

  const getValidationIcon = () => {
    if (summary.errors.length > 0) return <WarningIcon />;
    if (summary.warnings.length > 0) return <InfoIcon />;
    return <CheckIcon />;
  };

  return (
    <Box sx={{ 
      height: mode === 'fullscreen' ? '100vh' : mode === 'modal' ? '80vh' : '600px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header integrado */}
      {mode !== 'fullscreen' && (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            borderRadius: 1,
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MagicIcon />
              <Typography variant="h6" fontWeight="bold">
                Constructor Visual de Desafíos
              </Typography>
              {state.currentFlow && (
                <Chip 
                  label={state.currentFlow.metadata.stage.toUpperCase()} 
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Indicador de validación */}
              <Tooltip title={`${summary.errors.length} errores, ${summary.warnings.length} advertencias`}>
                <Chip
                  icon={getValidationIcon()}
                  label={`${summary.totalIssues} issues`}
                  size="small"
                  color={getValidationSeverityColor()}
                  variant="outlined"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                />
              </Tooltip>

              {/* Puntuación Bien Común */}
              <Tooltip title="Puntuación de Bien Común">
                <Chip
                  label={`BC: ${computed.bienComunScore.toFixed(1)}`}
                  size="small"
                  sx={{ 
                    bgcolor: computed.bienComunScore >= 7 ? 'success.main' : 
                             computed.bienComunScore >= 4 ? 'warning.main' : 'error.main',
                    color: 'white'
                  }}
                />
              </Tooltip>

              <Button
                variant="outlined"
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={!computed.canPublish}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)', 
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Guardar
              </Button>

              {mode === 'modal' && (
                <IconButton 
                  onClick={onClose} 
                  size="small" 
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Alertas de validación críticas */}
      {summary.hasBlockingIssues && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>{summary.errors.length} errores críticos</strong> impiden publicar este desafío.
            Revisa las validaciones para continuar.
          </Typography>
        </Alert>
      )}

      {/* Constructor principal */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <ChallengeBuilder />
      </Box>
    </Box>
  );
};

// Componente principal de integración
export const ChallengeBuilderIntegration: React.FC<ChallengeBuilderIntegrationProps> = ({
  onChallengeCreated,
  onChallengeSaved,
  initialChallenge,
  mode = 'modal',
  targetStage = 'seeker',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Crear desafío inicial basado en la etapa
  const createInitialChallenge = useCallback((): ChallengeFlow => {
    const now = new Date().toISOString();
    
    return {
      id: `challenge_${Date.now()}`,
      name: `Nuevo Desafío ${targetStage.charAt(0).toUpperCase() + targetStage.slice(1)}`,
      description: `Desafío para la etapa ${targetStage} del customer journey`,
      elements: [],
      connections: [],
      metadata: {
        stage: targetStage,
        difficulty: 'beginner',
        category: ['general'],
        estimatedTime: 1800, // 30 minutos
        language: 'es',
        version: '1.0.0',
        status: 'draft',
        createdAt: now,
        modifiedAt: now,
        author: 'current-user', // Se obtendría del contexto de auth
        collaborators: [],
        tags: [],
      },
      metrics: {
        octalysisProfile: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
        difficultyScore: 1,
        engagementScore: 5,
        bienComunScore: 5,
        reciprocidadIndex: 5,
        metanoiaFactor: 5,
        estimatedCompletionTime: 30,
        dropOffRisk: 0.3,
      },
      settings: {
        accessibility: {
          highContrast: false,
          reducedMotion: false,
          screenReader: true,
          multiLanguage: ['es'],
        },
        privacy: {
          dataCollection: 'minimal',
          analytics: true,
          personalization: false,
          sharing: 'community',
        },
        philosophical: {
          emphasizeBienComun: true,
          fosterReciprocity: true,
          encourageMetanoia: true,
          preventManipulation: true,
        },
      },
    };
  }, [targetStage]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSave = useCallback((challenge: ChallengeFlow) => {
    onChallengeSaved?.(challenge);
    onChallengeCreated?.(challenge);
  }, [onChallengeSaved, onChallengeCreated]);

  // Renderizado según el modo
  if (mode === 'embedded') {
    return (
      <ChallengeBuilderProvider initialFlow={initialChallenge || createInitialChallenge()}>
        <ChallengeBuilderContent 
          mode="embedded" 
          onSave={handleSave}
        />
      </ChallengeBuilderProvider>
    );
  }

  if (mode === 'fullscreen') {
    return (
      <ChallengeBuilderProvider initialFlow={initialChallenge || createInitialChallenge()}>
        <ChallengeBuilderContent 
          mode="fullscreen" 
          onSave={handleSave}
        />
      </ChallengeBuilderProvider>
    );
  }

  // Modo modal (por defecto)
  return (
    <>
      {/* Trigger button */}
      <Tooltip title="Crear Desafío Visual">
        <Fab
          color="primary"
          onClick={handleOpen}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
          }}
        >
          <Badge badgeContent="NEW" color="warning" variant="dot">
            <ExtensionIcon />
          </Badge>
        </Fab>
      </Tooltip>

      {/* Modal Dialog */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '90vh',
            maxHeight: '90vh',
          },
        }}
      >
        <ChallengeBuilderProvider initialFlow={initialChallenge || createInitialChallenge()}>
          <ChallengeBuilderContent 
            mode="modal" 
            onClose={handleClose} 
            onSave={handleSave}
          />
        </ChallengeBuilderProvider>
      </Dialog>
    </>
  );
};

// Componente de integración simple para botones de acción rápida
export const QuickChallengeBuilder: React.FC<{
  stage: 'buyer' | 'seeker' | 'solver' | 'promoter';
  onChallengeCreated: (challenge: ChallengeFlow) => void;
}> = ({ stage, onChallengeCreated }) => {
  return (
    <ChallengeBuilderIntegration
      mode="modal"
      targetStage={stage}
      onChallengeCreated={onChallengeCreated}
    />
  );
};

// Hook para usar desde Experience Console
export const useExperienceConsoleIntegration = () => {
  const [activeChallenge, setActiveChallenge] = useState<ChallengeFlow | null>(null);

  const createChallengeForStage = useCallback((stage: 'buyer' | 'seeker' | 'solver' | 'promoter') => {
    // Esta función se llamaría desde el Experience Console
    // para crear un desafío específico para una etapa
    console.log(`Creating challenge for stage: ${stage}`);
  }, []);

  const editChallenge = useCallback((challengeId: string) => {
    // Cargar y editar un desafío existente
    console.log(`Editing challenge: ${challengeId}`);
  }, []);

  const duplicateChallenge = useCallback((challengeId: string) => {
    // Duplicar un desafío existente
    console.log(`Duplicating challenge: ${challengeId}`);
  }, []);

  return {
    activeChallenge,
    setActiveChallenge,
    createChallengeForStage,
    editChallenge,
    duplicateChallenge,
  };
};

export default ChallengeBuilderIntegration;