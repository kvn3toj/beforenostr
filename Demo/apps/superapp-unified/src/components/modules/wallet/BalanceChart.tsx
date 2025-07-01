"use client";

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from 'recharts';
import { Paper, Typography, useTheme, Box } from '@mui/material';
import { formatPrice } from '../../../utils/numberUtils';

// Mock data for the chart. In a real app, this would come from an API.
const data = [
  { name: 'Hace 30d', balance: 500000 },
  { name: 'Hace 21d', balance: 525000 },
  { name: 'Hace 14d', balance: 480000 },
  { name: 'Hace 7d', balance: 510000 },
  { name: 'Hoy', balance: 550000 },
];

const BalanceChart: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        mt: 4,
        borderRadius: 4,
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Tendencia del Balance
      </Typography>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="name"
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickFormatter={(value) =>
                `$${(Number(value) / 1000).toLocaleString()}k`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                borderRadius: '8px',
              }}
              formatter={(value) => [formatPrice(Number(value), 'COP'), 'Balance']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={theme.palette.primary.main}
              fillOpacity={1}
              fill="url(#colorBalance)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default BalanceChart;
