// @ts-nocheck
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

const data = [
  { name: 'Lun', meritos: 20 },
  { name: 'Mar', meritos: 35 },
  { name: 'Mié', meritos: 30 },
  { name: 'Jue', meritos: 50 },
  { name: 'Vie', meritos: 45 },
  { name: 'Sáb', meritos: 60 },
  { name: 'Dom', meritos: 75 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ padding: '8px 12px', borderRadius: '8px', background: '#1e293b' }}>
        <Typography sx={{ color: '#f8fafc', fontSize: 12 }}>{`${label}`}</Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: 12 }}>
          {`Mëritos: `}
          <span style={{ color: '#c084fc', fontWeight: 'bold' }}>{payload[0].value}</span>
        </Typography>
      </Paper>
    );
  }
  return null;
};

const MinimalistActivityChart = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: '16px',
        background: '#ffffff',
        borderColor: '#e2e8f0',
        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.03)',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Actividad Semanal
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Evolución de Mëritos obtenidos en los últimos 7 días.
        </Typography>
      </Box>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(238, 242, 255, 0.5)' }} />
            <Line
              type="monotone"
              dataKey="meritos"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#6366f1' }}
              activeDot={{ r: 8, stroke: '#eef2ff', strokeWidth: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MinimalistActivityChart;
