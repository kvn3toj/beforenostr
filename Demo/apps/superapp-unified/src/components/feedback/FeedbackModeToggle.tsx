import React, { useState } from 'react';
import {
  Box,
  Switch,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Fade,
  styled
} from '@mui/material';
import {
  BugReport as BugIcon,
  Analytics as AnalyticsIcon,
  Science as TestIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface FeedbackModeToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const StyledToggleContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 80,
  right: 20,
  zIndex: 1300,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: theme.spacing(1.5),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  minWidth: 200,
}));

const PulsingIndicator = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${theme.palette.success.main}40`,
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 10px ${theme.palette.success.main}00`,
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${theme.palette.success.main}00`,
    },
  },
}));

export const FeedbackModeToggle: React.FC<FeedbackModeToggleProps> = ({
  isActive,
  onToggle
}) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Solo mostrar para administradores
  if (!user || !user.roles?.includes('admin')) {
    return null;
  }

  return (
    <Fade in={true}>
      <StyledToggleContainer
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <TestIcon fontSize="small" color="primary" />
          <Typography variant="caption" fontWeight={600}>
            Modo Agente
          </Typography>
          {isActive && <PulsingIndicator />}
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Switch
              checked={isActive}
              onChange={(e) => onToggle(e.target.checked)}
              size="small"
              color="primary"
            />
            <Typography variant="caption" color="text.secondary">
              {isActive ? 'Activo' : 'Inactivo'}
            </Typography>
          </Box>

          <Tooltip title="Prelanzamiento - Recopilar Feedback">
            <Chip
              size="small"
              label="BETA"
              color="warning"
              variant="outlined"
              sx={{ fontSize: '0.65rem', height: 20 }}
            />
          </Tooltip>
        </Box>

        {/* Información expandida al hacer hover */}
        <Fade in={isHovered && isActive}>
          <Box mt={1} pt={1} borderTop="1px solid rgba(0,0,0,0.1)">
            <Typography variant="caption" color="text.secondary" display="block">
              🔍 Análisis automático de código
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              🤖 Integración con LLM
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              📊 Métricas en tiempo real
            </Typography>
          </Box>
        </Fade>
      </StyledToggleContainer>
    </Fade>
  );
};

export default FeedbackModeToggle;
