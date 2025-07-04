import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Zoom,
  Typography,
  Tooltip,
  ClickAwayListener,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  styled
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  BugReport as BugIcon,
  Settings as SettingsIcon,
  Lightbulb as IdeaIcon,
  Speed as PerformanceIcon,
  Visibility as UXIcon,
  Code as CodeIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface FeedbackFloatingButtonProps {
  isVisible: boolean;
  onFeedbackStart: (type: FeedbackType, position: { x: number; y: number }) => void;
}

export type FeedbackType =
  | 'bug'
  | 'improvement'
  | 'missing-feature'
  | 'performance'
  | 'ux-issue'
  | 'code-analysis';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: 24,
  zIndex: 1400,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: 'white',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
  },
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40)`,
    borderRadius: '50%',
    zIndex: -1,
    animation: 'pulse 2s infinite',
  }
}));

const FeedbackMenu = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 160,
  right: 24,
  zIndex: 1350,
  minWidth: 280,
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
}));

const feedbackTypes = [
  {
    type: 'bug' as FeedbackType,
    label: 'Reportar Bug',
    description: 'Algo no funciona correctamente',
    icon: <BugIcon color="error" />,
    color: 'error.main'
  },
  {
    type: 'improvement' as FeedbackType,
    label: 'Mejora',
    description: 'Sugerir una mejora',
    icon: <IdeaIcon color="warning" />,
    color: 'warning.main'
  },
  {
    type: 'missing-feature' as FeedbackType,
    label: 'Función Faltante',
    description: 'Elemento sin implementar',
    icon: <SettingsIcon color="info" />,
    color: 'info.main'
  },
  {
    type: 'performance' as FeedbackType,
    label: 'Performance',
    description: 'Problema de rendimiento',
    icon: <PerformanceIcon color="secondary" />,
    color: 'secondary.main'
  },
  {
    type: 'ux-issue' as FeedbackType,
    label: 'Problema UX',
    description: 'Experiencia de usuario',
    icon: <UXIcon color="primary" />,
    color: 'primary.main'
  },
  {
    type: 'code-analysis' as FeedbackType,
    label: 'Análisis de Código',
    description: 'Ejecutar scripts automáticos',
    icon: <CodeIcon color="success" />,
    color: 'success.main'
  }
];

export const FeedbackFloatingButton: React.FC<FeedbackFloatingButtonProps> = ({
  isVisible,
  onFeedbackStart
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleFeedbackTypeSelect = (type: FeedbackType) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      onFeedbackStart(type, position);
    }
    setIsMenuOpen(false);
  };

  // Cerrar menú con tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMenuOpen]);

  if (!isVisible) return null;

  return (
    <>
      <Zoom in={isVisible}>
        <StyledFab
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú de feedback"
        >
          {isMenuOpen ? <CloseIcon /> : <FeedbackIcon />}
        </StyledFab>
      </Zoom>

      {isMenuOpen && (
        <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
          <Zoom in={isMenuOpen}>
            <FeedbackMenu elevation={0}>
              <Box p={2} pb={1}>
                <Typography variant="subtitle2" fontWeight={600} color="primary">
                  🤖 Agente de Feedback
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Selecciona el tipo de feedback
                </Typography>
              </Box>

              <List dense>
                {feedbackTypes.map((item, index) => (
                  <React.Fragment key={item.type}>
                    <ListItem
                      button
                      onClick={() => handleFeedbackTypeSelect(item.type)}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        '&:hover': {
                          background: `${item.color}10`
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.description}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 500
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary'
                        }}
                      />
                    </ListItem>
                    {index < feedbackTypes.length - 1 &&
                      <Divider variant="middle" sx={{ my: 0.5 }} />
                    }
                  </React.Fragment>
                ))}
              </List>

              <Box p={2} pt={1}>
                <Typography variant="caption" color="text.secondary" display="block">
                  💡 Tip: Selecciona un área específica después de elegir el tipo
                </Typography>
              </Box>
            </FeedbackMenu>
          </Zoom>
        </ClickAwayListener>
      )}
    </>
  );
};

export default FeedbackFloatingButton;
