// @ts-nocheck
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
  title?: string;
  size?: number;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f97316', '#ef4444'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'white', p: 1, border: '1px solid #e2e8f0', borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="body2">{`${payload[0].name} : ${payload[0].value}`}</Typography>
      </Box>
    );
  }
  return null;
};

const PieChart: React.FC<PieChartProps> = ({ data, title, size = 200 }) => {
  const theme = useTheme();

  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Box>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={3}>
        <Box sx={{ position: 'relative', width: size, height: size }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={size / 2}
                innerRadius={size / 3.5}
                fill="#8884d8"
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total</Typography>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
              {totalValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Box flex={1}>
          {data.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" mb={1.5}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: COLORS[index % COLORS.length],
                  mr: 1.5,
                }}
              />
              <Box flex={1}>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {entry.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {((entry.value / totalValue) * 100).toFixed(0)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PieChart;
