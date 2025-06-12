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
  const max = maxValue || Math.max(...data.map((d) => d.value));

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
              {Math.round((max / 4) * i)}
            </text>
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barWidth = (330 / data.length) * 0.8;
            const barHeight = (item.value / max) * 200;
            const x =
              50 + index * (330 / data.length) + (330 / data.length) * 0.1;
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
                    y: y,
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
