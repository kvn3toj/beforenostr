import React, { useState } from 'react';
import { Box, Typography, Paper, useTheme, Stack } from '@mui/material';
import { motion } from 'framer-motion';

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  title: string;
  size?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, title, size = 200 }) => {
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const center = size / 2;

  let currentAngle = 0;

  const createArc = (
    startAngle: number,
    endAngle: number,
    innerRadius: number = 0,
    outerRadius: number = radius
  ) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = center + outerRadius * Math.cos(startAngleRad);
    const y1 = center + outerRadius * Math.sin(startAngleRad);
    const x2 = center + outerRadius * Math.cos(endAngleRad);
    const y2 = center + outerRadius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    if (innerRadius === 0) {
      return `M ${center} ${center} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    } else {
      const x3 = center + innerRadius * Math.cos(endAngleRad);
      const y3 = center + innerRadius * Math.sin(endAngleRad);
      const x4 = center + innerRadius * Math.cos(startAngleRad);
      const y4 = center + innerRadius * Math.sin(startAngleRad);

      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {title}
      </Typography>

      <Box display="flex" alignItems="center" gap={3}>
        <Box position="relative">
          <svg width={size} height={size}>
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={theme.palette.grey[100]}
              strokeWidth="2"
            />

            {/* Pie slices */}
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (item.value / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              const isHovered = hoveredIndex === index;
              const adjustedRadius = isHovered ? radius + 5 : radius;

              const path = createArc(
                startAngle,
                endAngle,
                radius * 0.4,
                adjustedRadius
              );

              // Calculate label position
              const labelAngle = startAngle + angle / 2;
              const labelRadius = radius * 0.7;
              const labelX =
                center + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
              const labelY =
                center + labelRadius * Math.sin((labelAngle * Math.PI) / 180);

              currentAngle = endAngle;

              return (
                <g key={item.name}>
                  <motion.path
                    d={path}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  />

                  {/* Percentage labels */}
                  {percentage > 5 && (
                    <text
                      x={labelX}
                      y={labelY}
                      fontSize="12"
                      fill="white"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontWeight="600"
                      style={{ pointerEvents: 'none' }}
                    >
                      {percentage.toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Center hole */}
            <circle
              cx={center}
              cy={center}
              r={radius * 0.4}
              fill={theme.palette.background.paper}
            />

            {/* Center text */}
            <text
              x={center}
              y={center - 5}
              fontSize="16"
              fill={theme.palette.text.primary}
              textAnchor="middle"
              fontWeight="600"
            >
              Total
            </text>
            <text
              x={center}
              y={center + 12}
              fontSize="14"
              fill={theme.palette.text.secondary}
              textAnchor="middle"
            >
              {total.toLocaleString()}
            </text>
          </svg>
        </Box>

        {/* Legend */}
        <Stack spacing={2}>
          {data.map((item, index) => (
            <Box
              key={item.name}
              display="flex"
              alignItems="center"
              sx={{
                cursor: 'pointer',
                opacity:
                  hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Box
                width={16}
                height={16}
                bgcolor={item.color}
                borderRadius={1}
                mr={1.5}
              />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default PieChart;
