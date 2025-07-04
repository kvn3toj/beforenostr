import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface ActivityData {
  time: string;
  searches: number;
  conversions: number;
  users: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <Box sx={{ height: '100%', overflowY: 'auto', px: 1 }}>
      {data.map((dataPoint, index) => (
        <motion.div
          key={dataPoint.time}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Box mb={3}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
              {dataPoint.time}
            </Typography>

            <Box mb={1.5}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  Búsquedas
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {dataPoint.searches}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((dataPoint.searches / 150) * 100, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#6366f1',
                  },
                }}
              />
            </Box>

            <Box mb={1.5}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  Conversiones
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {dataPoint.conversions}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((dataPoint.conversions / 20) * 100, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                   backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#818cf8',
                  },
                }}
              />
            </Box>

            <Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  Usuarios Activos
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {dataPoint.users}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min((dataPoint.users / 300) * 100, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                   backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#a78bfa',
                  },
                }}
              />
            </Box>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default ActivityChart;
