/**
 * =============================================================================
 * COMPONENTE: HambreSlider - GAMIFIER ADMIN
 * =============================================================================
 * Visualización interactiva de la métrica "HambrE" (impulso evolutivo).
 * Implementa el Design System Cósmico con colores temáticos y accesibilidad.
 *
 * Guardianes responsables:
 * - ARIA (La Artista del Frontend): Diseño visual y accesibilidad
 * - ZENO (El Arquitecto de Experiencias): Flujos de interacción
 * - PHOENIX (El Agente Transformador): Optimización y limpieza del código
 * =============================================================================
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Slider,
  Typography,
  Card,
  CardContent,
  Chip,
  Tooltip,
  IconButton,
  TextField,
  Button,
  Alert
} from '@mui/material';
import {
  LocalFireDepartment as FireIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { HambreMetric, HambreLevel } from '@coomunity/shared-types';

interface HambreSliderProps {
  /** Métrica actual de HambrE */
  metric: HambreMetric;

  /** Callback para actualizar el valor */
  onChange: (value: number) => void;

  /** Callback para guardar cambios */
  onSave?: (value: number, notes?: string) => Promise<void>;

  /** Estado de carga durante guardado */
  isLoading?: boolean;

  /** Modo de solo lectura */
  readOnly?: boolean;

  /** Mostrar historial */
  showHistory?: boolean;
}

/**
 * Determinar color según nivel de HambrE
 * Colores basados en la filosofía CoomÜnity: fuego, energía, evolución
 */
const getHambreColors = (level: HambreLevel) => {
  switch (level) {
    case 'bajo':
      return {
        primary: '#FFB74D',    // naranja claro - latente
        secondary: '#FFF3E0',  // fondo suave
        text: '#E65100'        // texto naranja oscuro
      };
    case 'medio':
      return {
        primary: '#FF7043',    // naranja intenso - activo
        secondary: '#FBE9E7',  // fondo cálido
        text: '#D84315'        // texto rojo-naranja
      };
    case 'alto':
      return {
        primary: '#D32F2F',    // rojo intenso - ardiente
        secondary: '#FFEBEE',  // fondo rosado
        text: '#B71C1C'        // texto rojo oscuro
      };
    default:
      return {
        primary: '#BDBDBD',
        secondary: '#F5F5F5',
        text: '#616161'
      };
  }
};

/**
 * Obtener descripción filosófica del nivel
 */
const getHambreDescription = (level: HambreLevel): string => {
  switch (level) {
    case 'bajo':
      return 'Energía latente - La comunidad está en contemplación, preparándose para el próximo salto evolutivo.';
    case 'medio':
      return 'Impulso activo - La comunidad está en movimiento, buscando nuevas oportunidades de crecimiento.';
    case 'alto':
      return 'Fuego transformador - La comunidad arde con pasión evolutiva, lista para grandes transformaciones.';
    default:
      return 'Estado indeterminado';
  }
};

export const HambreSlider: React.FC<HambreSliderProps> = ({
  metric,
  onChange,
  onSave,
  isLoading = false,
  readOnly = false,
  showHistory = false
}) => {
  const [localValue, setLocalValue] = useState(metric.value);
  const [notes, setNotes] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const colors = getHambreColors(metric.level);
  const description = getHambreDescription(metric.level);

  // Manejar cambios del slider
  const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setLocalValue(value);
    setHasChanges(value !== metric.value);
    onChange(value);
  }, [metric.value, onChange]);

  // Manejar guardado
  const handleSave = useCallback(async () => {
    if (onSave) {
      await onSave(localValue, notes);
      setHasChanges(false);
      setNotes('');
    }
  }, [onSave, localValue, notes]);

  // Obtener nivel basado en valor
  const getCurrentLevel = (value: number): HambreLevel => {
    if (value <= 33) return 'bajo';
    if (value >= 67) return 'alto';
    return 'medio';
  };

  const currentLevel = getCurrentLevel(localValue);
  const currentColors = getHambreColors(currentLevel);

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${currentColors.secondary} 0%, ${currentColors.primary}15 100%)`,
        border: `2px solid ${currentColors.primary}30`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${currentColors.primary}25`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header con ícono y título */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FireIcon
            sx={{
              color: currentColors.primary,
              fontSize: 32,
              mr: 2,
              animation: currentLevel === 'alto' ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' }
              }
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ color: currentColors.text, fontWeight: 'bold' }}>
              HambrE Evolutiva
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                label={currentLevel.toUpperCase()}
                sx={{
                  backgroundColor: currentColors.primary,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              />
              <Tooltip title={description} arrow>
                <IconButton size="small">
                  <InfoIcon sx={{ color: currentColors.text }} />
                </IconButton>
              </Tooltip>
              {showHistory && (
                <Tooltip title="Ver historial" arrow>
                  <IconButton size="small">
                    <HistoryIcon sx={{ color: currentColors.text }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>

        {/* Descripción filosófica */}
        <Alert
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: `${currentColors.primary}10`,
            border: `1px solid ${currentColors.primary}30`,
            '& .MuiAlert-icon': {
              color: currentColors.primary
            }
          }}
        >
          {description}
        </Alert>

        {/* Slider principal */}
        <Box sx={{ px: 2, mb: 3 }}>
          <Typography variant="body2" sx={{ color: currentColors.text, mb: 2 }}>
            Nivel actual: <strong>{localValue}</strong> / 100
          </Typography>

          <Slider
            value={localValue}
            min={0}
            max={100}
            step={1}
            onChange={handleSliderChange}
            disabled={readOnly || isLoading}
            sx={{
              color: currentColors.primary,
              height: 8,
              '& .MuiSlider-track': {
                background: `linear-gradient(90deg, ${getHambreColors('bajo').primary} 0%, ${getHambreColors('medio').primary} 50%, ${getHambreColors('alto').primary} 100%)`,
                border: 'none'
              },
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                backgroundColor: currentColors.primary,
                border: '3px solid white',
                boxShadow: `0 0 0 8px ${currentColors.primary}20`,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0 0 0 12px ${currentColors.primary}30`
                }
              },
              '& .MuiSlider-rail': {
                backgroundColor: '#E0E0E0',
                opacity: 1
              }
            }}
            marks={[
              { value: 0, label: '0' },
              { value: 33, label: 'Bajo' },
              { value: 66, label: 'Alto' },
              { value: 100, label: '100' }
            ]}
            aria-label="Nivel de HambrE evolutiva"
            aria-describedby="hambre-description"
          />
        </Box>

        {/* Metadatos y controles */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Información de última actualización */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Última actualización: {new Date(metric.updatedAt).toLocaleString('es-ES')}
            {metric.metadata?.updatedBy && ` por ${metric.metadata.updatedBy}`}
          </Typography>

          {/* Campo de notas (solo si no es readOnly) */}
          {!readOnly && (
            <TextField
              label="Notas del ajuste (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={2}
              variant="outlined"
              size="small"
              disabled={isLoading}
              placeholder="Describe el motivo del ajuste..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: currentColors.primary
                  }
                }
              }}
            />
          )}

          {/* Botón de guardar */}
          {!readOnly && onSave && hasChanges && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isLoading}
              sx={{
                backgroundColor: currentColors.primary,
                '&:hover': {
                  backgroundColor: currentColors.text
                }
              }}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
