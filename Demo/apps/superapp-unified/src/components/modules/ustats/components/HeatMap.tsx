import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';

interface HeatMapData {
  day: string;
  hour: number;
  value: number;
}

interface HeatMapProps {
  data: HeatMapData[];
  title: string;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, title }) => {
  const theme = useTheme();
  const [hoveredCell, setHoveredCell] = useState<HeatMapData | null>(null);

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // 🔥 PREVENIR ERROR NaN - Validar datos antes de procesar
  const validData = data?.filter(d => d && typeof d.value === 'number' && !isNaN(d.value)) || [];
  const maxValue = validData.length > 0 ? Math.max(...validData.map((d) => d.value)) : 100;
  const minValue = validData.length > 0 ? Math.min(...validData.map((d) => d.value)) : 0;
  
  // 🔥 VALIDACIÓN ADICIONAL - Asegurar valores válidos
  const safeMaxValue = maxValue > 0 && !isNaN(maxValue) ? maxValue : 100;
  const safeMinValue = minValue >= 0 && !isNaN(minValue) ? minValue : 0;

  const getIntensity = (value: number) => {
    if (safeMaxValue === safeMinValue) return 0.5;
    const intensity = (value - safeMinValue) / (safeMaxValue - safeMinValue);
    return isNaN(intensity) ? 0.5 : Math.max(0, Math.min(1, intensity));
  };

  const getColor = (intensity: number) => {
    const baseColor = theme.palette.primary.main;
    return alpha(baseColor, 0.1 + intensity * 0.8);
  };

  const getCellData = (day: string, hour: number) => {
    const found = validData.find((d) => d.day === day && d.hour === hour);
    return found || {
      day,
      hour,
      value: 0,
    };
  };

  const cellSize = 25;
  const margin = { top: 50, right: 40, bottom: 40, left: 80 };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {title}
      </Typography>

      <Box sx={{ overflowX: 'auto', mt: 2 }}>
        <svg
          width={margin.left + margin.right + hours.length * cellSize}
          height={margin.top + margin.bottom + days.length * cellSize}
        >
          {/* Hour labels */}
          {hours.map((hour) => (
            <text
              key={hour}
              x={margin.left + hour * cellSize + cellSize / 2}
              y={margin.top - 10}
              fontSize="11"
              fill={theme.palette.text.secondary}
              textAnchor="middle"
            >
              {hour}h
            </text>
          ))}

          {/* Day labels */}
          {days.map((day, dayIndex) => (
            <text
              key={day}
              x={margin.left - 10}
              y={margin.top + dayIndex * cellSize + cellSize / 2}
              fontSize="12"
              fill={theme.palette.text.secondary}
              textAnchor="end"
              alignmentBaseline="middle"
            >
              {day}
            </text>
          ))}

          {/* Heat map cells */}
          {days.map((day, dayIndex) =>
            hours.map((hour) => {
              const cellData = getCellData(day, hour);
              const intensity = getIntensity(cellData.value);
              const color = getColor(intensity);

              return (
                <motion.rect
                  key={`${day}-${hour}`}
                  x={margin.left + hour * cellSize}
                  y={margin.top + dayIndex * cellSize}
                  width={cellSize - 1}
                  height={cellSize - 1}
                  fill={color}
                  stroke={theme.palette.background.paper}
                  strokeWidth="1"
                  rx="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredCell(cellData)}
                  onMouseLeave={() => setHoveredCell(null)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: (dayIndex * hours.length + hour) * 0.005,
                  }}
                  whileHover={{ scale: 1.1 }}
                />
              );
            })
          )}

          {/* Tooltip */}
          {hoveredCell && (
            <g>
              <rect
                x={margin.left + hoveredCell.hour * cellSize + cellSize + 5}
                y={margin.top + days.indexOf(hoveredCell.day) * cellSize - 10}
                width="120"
                height="40"
                fill={theme.palette.background.paper}
                stroke={theme.palette.divider}
                strokeWidth="1"
                rx="4"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              />
              <text
                x={margin.left + hoveredCell.hour * cellSize + cellSize + 15}
                y={margin.top + days.indexOf(hoveredCell.day) * cellSize + 5}
                fontSize="11"
                fill={theme.palette.text.primary}
                fontWeight="600"
              >
                {hoveredCell.day} {hoveredCell.hour}:00
              </text>
              <text
                x={margin.left + hoveredCell.hour * cellSize + cellSize + 15}
                y={margin.top + days.indexOf(hoveredCell.day) * cellSize + 20}
                fontSize="10"
                fill={theme.palette.text.secondary}
              >
                Actividad: {hoveredCell.value}
              </text>
            </g>
          )}
        </svg>
      </Box>

      {/* Legend */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={2}
        gap={1}
      >
        <Typography variant="caption" color="text.secondary">
          Menos
        </Typography>
        {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
          <Box
            key={intensity}
            width={16}
            height={16}
            bgcolor={getColor(intensity)}
            borderRadius={1}
            border={`1px solid ${theme.palette.divider}`}
          />
        ))}
        <Typography variant="caption" color="text.secondary">
          Más
        </Typography>
      </Box>
    </Paper>
  );
};

export default HeatMap;
