import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  Chip,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  AutoMode,
  Palette,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { cn, animations } from '../../utils/styles';
import { useTheme } from '../../contexts/ThemeContext';

// 🎨 Animation Variants
const toggleVariants = {
  light: {
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    }
  },
  dark: {
    rotate: 180,
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    }
  }
};

const iconVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    rotate: -180
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    rotate: 180,
    transition: {
      duration: 0.2,
    }
  }
};

const backgroundVariants = {
  light: {
    backgroundColor: '#fef3c7',
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    }
  },
  dark: {
    backgroundColor: '#312e81',
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    }
  }
};

// 🌟 Theme Toggle Component (Simple)
export const ThemeToggle: React.FC = () => {
  const { mode, isDark, toggleTheme } = useTheme();

  return (
    <Tooltip
      title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      placement="bottom"
    >
      <motion.div
        variants={toggleVariants}
        animate={isDark ? 'dark' : 'light'}
      >
        <IconButton
          onClick={toggleTheme}
          className={cn(
            'relative overflow-hidden',
            'hover:bg-coomunity-50 dark:hover:bg-coomunity-900',
            'transition-colors duration-200',
            animations.hoverScale
          )}
          size="medium"
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="dark"
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <DarkMode className="text-coomunity-600" />
              </motion.div>
            ) : (
              <motion.div
                key="light"
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <LightMode className="text-warning-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </IconButton>
      </motion.div>
    </Tooltip>
  );
};

// 🌟 Enhanced Theme Control Panel
export const ThemeControlPanel: React.FC = () => {
  const { mode, isDark, toggleTheme, setThemeMode } = useTheme();

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Claro',
      icon: <LightMode />,
      description: 'Tema claro para uso diurno',
      color: 'warning',
    },
    {
      value: 'dark' as const,
      label: 'Oscuro',
      icon: <DarkMode />,
      description: 'Tema oscuro para uso nocturno',
      color: 'primary',
    },
    {
      value: 'auto' as const,
      label: 'Automático',
      icon: <AutoMode />,
      description: 'Sigue la preferencia del sistema',
      color: 'info',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        className={cn(
          'p-6 rounded-xl',
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'shadow-lg'
        )}
      >
        {/* Header */}
        <Box className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Palette className="text-coomunity-500" />
          </motion.div>

          <Box>
            <Typography variant="h6" className="font-semibold">
              Configuración de Tema
            </Typography>
            <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
              Personaliza la apariencia de CoomÜnity
            </Typography>
          </Box>
        </Box>

        {/* Quick Toggle */}
        <Box className="mb-6">
          <FormControlLabel
            control={
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                color="primary"
                size="medium"
              />
            }
            label={
              <Box className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="dark-icon"
                      variants={iconVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Brightness4 className="w-5 h-5 text-coomunity-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="light-icon"
                      variants={iconVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Brightness7 className="w-5 h-5 text-warning-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Typography variant="body2">
                  Modo {isDark ? 'Oscuro' : 'Claro'}
                </Typography>
              </Box>
            }
            className="m-0"
          />
        </Box>

        {/* Theme Options */}
        <Box className="space-y-3">
          <Typography variant="subtitle2" className="font-medium mb-3">
            Opciones de Tema
          </Typography>

          {themeOptions.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Paper
                className={cn(
                  'p-4 cursor-pointer transition-all duration-200',
                  'border-2',
                  mode === option.value
                    ? 'border-coomunity-500 bg-coomunity-50 dark:bg-coomunity-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-coomunity-300',
                  'hover:shadow-md'
                )}
                onClick={() => setThemeMode(option.value)}
              >
                <Box className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      scale: mode === option.value ? 1.1 : 1,
                      color: mode === option.value ? '#7c3aed' : undefined,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {option.icon}
                  </motion.div>

                  <Box className="flex-1">
                    <Box className="flex items-center gap-2 mb-1">
                      <Typography variant="subtitle2" className="font-medium">
                        {option.label}
                      </Typography>

                      {mode === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <Chip
                            label="Activo"
                            size="small"
                            color="primary"
                            className="h-5"
                          />
                        </motion.div>
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {option.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* Theme Preview */}
        <Box className="mt-6">
          <Typography variant="subtitle2" className="font-medium mb-3">
            Vista Previa
          </Typography>

          <motion.div
            variants={backgroundVariants}
            animate={isDark ? 'dark' : 'light'}
            className="rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <Box className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{
                  backgroundColor: isDark ? '#7c3aed' : '#f59e0b',
                }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
              >
                <Typography variant="body2" className="text-white font-bold">
                  C
                </Typography>
              </motion.div>

              <Box>
                <Typography
                  variant="subtitle2"
                  className={cn(
                    'font-semibold',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}
                >
                  CoomÜnity SuperApp
                </Typography>
                <Typography
                  variant="caption"
                  className={cn(
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  )}
                >
                  Economía Colaborativa • Reciprocidad • Bien Común
                </Typography>
              </Box>
            </Box>

            <Box className="flex gap-2">
              <Chip
                label="Mëritos"
                size="small"
                className={cn(
                  isDark
                    ? 'bg-warning-900 text-warning-100'
                    : 'bg-warning-100 text-warning-800'
                )}
              />
              <Chip
                label="Öndas"
                size="small"
                className={cn(
                  isDark
                    ? 'bg-info-900 text-info-100'
                    : 'bg-info-100 text-info-800'
                )}
              />
              <Chip
                label="Reciprocidad"
                size="small"
                className={cn(
                  isDark
                    ? 'bg-success-900 text-success-100'
                    : 'bg-success-100 text-success-800'
                )}
              />
            </Box>
          </motion.div>
        </Box>

        {/* Footer */}
        <Box className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Typography
            variant="caption"
            className="text-gray-500 dark:text-gray-400 text-center block"
          >
            Los cambios se aplican inmediatamente y se guardan automáticamente
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ThemeToggle;
