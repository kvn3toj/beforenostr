import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Send,
  Favorite,
  Psychology,
  Groups,
  Store,
  VideoLibrary,
  Timeline,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/styles';

interface AyniAction {
  icon: React.ReactElement;
  label: string;
  path: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  description: string;
  category: 'ayni' | 'modules' | 'create';
}

interface QuickActionsGridProps {
  onActionClick?: (path: string, action: AyniAction) => void;
}

const ayniActions: AyniAction[] = [
  {
    icon: <Send />,
    label: 'Dar Ayuda',
    path: '/social/offer-help',
    color: 'success',
    description: 'Ofrece tu conocimiento o servicio',
    category: 'ayni',
  },
  {
    icon: <Favorite />,
    label: 'Pedir Ayuda',
    path: '/social/request-help',
    color: 'error',
    description: 'Solicita apoyo de la comunidad',
    category: 'ayni',
  },
  {
    icon: <Psychology />,
    label: 'Compartir Sabiduría',
    path: '/uplay/create',
    color: 'secondary',
    description: 'Crea contenido educativo',
    category: 'create',
  },
  {
    icon: <Groups />,
    label: 'Formar Círculo',
    path: '/social/create-group',
    color: 'primary',
    description: 'Inicia un grupo de colaboración',
    category: 'create',
  },
];

const moduleActions: AyniAction[] = [
  {
    icon: <VideoLibrary />,
    label: 'ÜPlay',
    path: '/uplay',
    color: 'secondary',
    description: 'Videos interactivos gamificados',
    category: 'modules',
  },
  {
    icon: <Store />,
    label: 'Marketplace',
    path: '/marketplace',
    color: 'primary',
    description: 'Intercambio de productos y servicios',
    category: 'modules',
  },
  {
    icon: <Groups />,
    label: 'Social',
    path: '/social',
    color: 'success',
    description: 'Red de colaboración',
    category: 'modules',
  },
  {
    icon: <Timeline />,
    label: 'ÜStats',
    path: '/ustats',
    color: 'warning',
    description: 'Métricas y analytics',
    category: 'modules',
  },
];

const ActionButton: React.FC<{
  action: AyniAction;
  onClick: (path: string, action: AyniAction) => void;
  index: number;
}> = ({ action, onClick, index }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.4,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        fullWidth
        variant="outlined"
        color={action.color}
        onClick={() => onClick(action.path, action)}
        startIcon={action.icon}
        className={cn(
          "flex-col py-4 px-3 min-h-[90px] gap-2",
          "border-2 rounded-lg",
          "transition-all duration-300 ease-out",
          "hover:shadow-coomunity-medium hover:-translate-y-1",
          "relative overflow-hidden group"
        )}
        sx={{
          flexDirection: 'column',
          py: 2,
          px: 1.5,
          minHeight: 90,
          gap: 1,
          border: `2px solid ${alpha(theme.palette[action.color].main, 0.2)}`,
          bgcolor: alpha(theme.palette[action.color].main, 0.02),
          '&:hover': {
            bgcolor: alpha(theme.palette[action.color].main, 0.08),
            transform: 'translateY(-3px)',
            boxShadow: `0 8px 25px ${alpha(theme.palette[action.color].main, 0.3)}`,
            border: `2px solid ${alpha(theme.palette[action.color].main, 0.4)}`,
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${alpha(
              theme.palette[action.color].main,
              0.1
            )}, transparent)`,
            transition: 'left 0.5s ease-in-out',
          },
          '&:hover::before': {
            left: '100%',
          },
        }}
      >
        <Typography
          variant="body2"
          className="coomunity-label font-semibold text-center leading-tight"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {action.label}
        </Typography>
        <Typography
          variant="caption"
          className="coomunity-caption text-center opacity-80 leading-tight text-xs"
          sx={{
            textAlign: 'center',
            opacity: 0.8,
            lineHeight: 1.1,
            fontSize: '0.7rem',
          }}
        >
          {action.description}
        </Typography>
      </Button>
    </motion.div>
  );
};

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onActionClick,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleActionClick = (path: string, action: AyniAction) => {
    if (onActionClick) {
      onActionClick(path, action);
    } else {
      navigate(path);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "relative overflow-hidden",
          "bg-gradient-to-br from-coomunity-primary-50 via-white to-coomunity-secondary-50",
          "border border-coomunity-primary-100",
          "shadow-coomunity-soft hover:shadow-coomunity-medium",
          "transition-all duration-300"
        )}
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.secondary.main,
            0.05
          )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
        }}
      >
        <CardContent>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Typography 
              variant="h6" 
              className="coomunity-h3 text-coomunity-primary-700 mb-1"
              fontWeight="bold" 
              gutterBottom
            >
              Acciones Ayni
            </Typography>
            <Typography 
              variant="body2" 
              className="coomunity-body text-gray-600 mb-4"
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              Equilibra tu dar y recibir en la comunidad
            </Typography>
          </motion.div>

          {/* Acciones principales de Ayni */}
          <Box sx={{ mb: 3 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Typography
                variant="subtitle2"
                className="coomunity-label text-gray-700 font-semibold mb-2"
                fontWeight="bold"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                🤝 PRINCIPIO AYNI
              </Typography>
            </motion.div>
            <Grid container spacing={1}>
              {ayniActions.map((action, index) => (
                <Grid size={{xs:6}} key={index}>
                  <ActionButton 
                    action={action} 
                    onClick={handleActionClick} 
                    index={index}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Acceso rápido a módulos */}
          <Box>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Typography
                variant="subtitle2"
                className="coomunity-label text-gray-700 font-semibold mb-2"
                fontWeight="bold"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                🚀 ACCESO RÁPIDO
              </Typography>
            </motion.div>
            <Grid container spacing={1}>
              {moduleActions.map((action, index) => (
                <Grid size={{xs:6}} key={index}>
                  <ActionButton 
                    action={action} 
                    onClick={handleActionClick} 
                    index={index + ayniActions.length}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Mensaje motivacional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Box
              className={cn(
                "mt-4 p-3 rounded-lg",
                "bg-coomunity-primary-50 border border-dashed border-coomunity-primary-200",
                "hover:bg-coomunity-primary-100 transition-colors duration-200"
              )}
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Typography
                variant="caption"
                className="coomunity-caption text-gray-600 italic text-center block"
                color="text.secondary"
                sx={{ fontStyle: 'italic', textAlign: 'center', display: 'block' }}
              >
                💫 "En el Ayni perfecto, dar y recibir son la misma acción"
              </Typography>
            </Box>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
