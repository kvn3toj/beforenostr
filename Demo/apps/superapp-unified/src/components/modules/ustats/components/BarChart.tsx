import React from 'react';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface BarData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  title: string;
  height?: number;
  maxValue?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  maxValue,
}) => {
  const theme = useTheme();
  
  // 🔥 PREVENIR ERROR NaN - Validar datos antes de procesar
  const validData = data?.filter(d => d && typeof d.value === 'number' && !isNaN(d.value)) || [];
  const max = maxValue || (validData.length > 0 ? Math.max(...validData.map((d) => d.value)) : 1);
  
  // 🔥 VALIDACIÓN ADICIONAL - Asegurar que max no sea 0 o NaN
  const safeMax = max > 0 && !isNaN(max) ? max : 1;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {title}
      </Typography>

      <Box sx={{ height, position: 'relative', mt: 2 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="50"
              y1={50 + i * 50}
              x2="380"
              y2={50 + i * 50}
              stroke={alpha(theme.palette.grey[400], 0.3)}
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x="40"
              y={255 - i * 50}
              fontSize="12"
              fill={theme.palette.text.secondary}
              textAnchor="end"
              alignmentBaseline="middle"
            >
              {Math.round((safeMax / 4) * i)}
            </text>
          ))}

          {/* Bars */}
          {validData.map((item, index) => {
            const barWidth = validData.length > 0 ? (330 / validData.length) * 0.8 : 0;
            const barHeight = (item.value / safeMax) * 200;
            const x = validData.length > 0 ?
              50 + index * (330 / validData.length) + (330 / validData.length) * 0.1 : 50;
            const y = 250 - barHeight;

            return (
              <g key={item.name}>
                <motion.rect
                  x={x}
                  y={250}
                  width={barWidth}
                  height={0}
                  fill={item.color || theme.palette.primary.main}
                  rx="4"
                  animate={{
                    height: barHeight,
                    y,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'easeOut',
                  }}
                />

                {/* Value labels */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  fontSize="11"
                  fill={theme.palette.text.primary}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {item.value}
                </text>

                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={270}
                  fontSize="11"
                  fill={theme.palette.text.secondary}
                  textAnchor="middle"
                  transform={`rotate(-15, ${x + barWidth / 2}, 270)`}
                >
                  {item.name}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
    </Paper>
  );
};

export default BarChart;
