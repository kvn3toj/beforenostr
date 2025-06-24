import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Diamond,
  Bolt,
  LocalFireDepartment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';

// Type definitions for new components
interface SparklineProps {
  data: number[];
  color: string;
}

interface ProfessionalMetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  sparklineData: number[];
  color: string;
}

interface UPlayProgressPanelProps {
  weeklyData: { day: string; value: number; isToday?: boolean }[];
  weeklyProgress: number;
  weeklyGoal: number;
}

// Simple sparkline component for metric cards
const Sparkline: React.FC<SparklineProps> = ({ data, color }) => (
  <svg width="100" height="30" viewBox="0 0 100 30" style={{ position: 'absolute', bottom: '10px', right: '10px', opacity: 0.3 }}>
    <path
      d={`M0,${30 - data[0]} L20,${30 - data[1]} L40,${30 - data[2]} L60,${30 - data[3]} L80,${30 - data[4]} L100,${30 - data[5]}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

// Advanced, professionally styled metric card
const ProfessionalMetricCard: React.FC<ProfessionalMetricCardProps> = ({ icon, title, value, change, sparklineData, color }) => (
  <motion.div
    className="group relative w-full h-full p-6 rounded-2xl overflow-hidden bg-[var(--uplay-blue-900)] border border-[var(--uplay-blue-800)] transition-all duration-300 hover:bg-[var(--uplay-blue-800)] hover:shadow-2xl hover:shadow-[var(--uplay-blue-700)]/20"
    whileHover={{ y: -5 }}
  >
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg bg-[var(--uplay-blue-800)]`}>
          {icon}
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'text-green-300 bg-green-900/50' : 'text-red-300 bg-red-900/50'}`}>
          {change}
        </div>
      </div>
      <div className="my-4">
        <Typography variant="h4" className="font-bold text-white">{value}</Typography>
        <Typography variant="body2" className="text-[var(--uplay-blue-200)]">{title}</Typography>
      </div>
      <div className="flex-grow" />
      <Sparkline data={sparklineData} color={color} />
    </div>
    {/* Background decorative elements */}
    <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-spotlight-gradient animate-spin-slow group-hover:animate-spin-fast" />
  </motion.div>
);

// Advanced, professionally styled progress panel
const UPlayProgressPanel: React.FC<UPlayProgressPanelProps> = ({ weeklyData, weeklyProgress, weeklyGoal }) => {
  const circularProgressValue = (weeklyProgress / weeklyGoal) * 100;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[var(--uplay-blue-950)] border border-[var(--uplay-blue-800)] p-6">
      <div className="absolute inset-0 bg-cinematic-dots opacity-[0.03]" />
      <div className="absolute inset-0 bg-spotlight-gradient-2 animate-pulse-slow" />
      <div className="relative z-10">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} className="flex flex-col items-center justify-center text-center">
            <Box sx={{ position: 'relative', width: 140, height: 140, mb: 2 }}>
              <motion.svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="70" cy="70" r="65" fill="none" stroke="var(--uplay-blue-800)" strokeWidth="10" />
                <motion.circle
                  cx="70"
                  cy="70"
                  r="65"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="408.4" // 2 * PI * 65
                  strokeDashoffset={408.4 - (408.4 * circularProgressValue) / 100}
                  initial={{ strokeDashoffset: 408.4 }}
                  animate={{ strokeDashoffset: 408.4 - (408.4 * circularProgressValue) / 100 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--uplay-blue-300)" />
                    <stop offset="100%" stopColor="var(--uplay-blue-500)" />
                  </linearGradient>
                </defs>
              </motion.svg>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" className="font-bold text-white">{`${Math.round(circularProgressValue)}%`}</Typography>
                <Typography variant="caption" className="text-[var(--uplay-blue-300)]">Semana</Typography>
              </Box>
            </Box>
            <Typography variant="h6" className="font-bold text-white">Racha de la Semana</Typography>
            <Typography variant="body2" className="text-[var(--uplay-blue-300)]">{`${weeklyProgress} de ${weeklyGoal} videos`}</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" className="font-bold text-white mb-4">Progreso Diario</Typography>
            <div className="flex justify-between items-end h-40">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center w-1/7">
                  <motion.div
                    className="w-4 rounded-t-full bg-gradient-to-t from-[var(--uplay-blue-700)] to-[var(--uplay-blue-500)]"
                    style={{
                      boxShadow: day.isToday ? '0 0 15px var(--uplay-blue-400)' : 'none',
                      border: day.isToday ? '2px solid var(--uplay-blue-400)' : 'none',
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${day.value}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                  <Typography variant="caption" className={`mt-2 font-bold ${day.isToday ? 'text-white' : 'text-[var(--uplay-blue-400)]'}`}>{day.day}</Typography>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

// Main dashboard component, fully refactored
const UPlayEnhancedDashboard: React.FC = () => {
  const { user } = useAuth(); // Example of context usage

  // Mock data state for demonstration
  const [metrics] = useState({
    totalMeritos: { value: 340, change: "+30", sparkline: [20, 22, 25, 28, 31, 34] }, // Sparkline data is % of max
    totalOndas: { value: 125, change: "-5", sparkline: [25, 24, 23, 23.5, 23, 22.5] },
    currentStreak: { value: 7, change: "+1", sparkline: [2, 3, 4, 5, 6, 7] },
    weeklyGoal: 5,
    weeklyProgress: 3,
    weeklyData: [
      { day: 'L', value: 80 },
      { day: 'M', value: 60 },
      { day: 'X', value: 90 },
      { day: 'J', value: 75, isToday: true },
      { day: 'V', value: 45 },
      { day: 'S', value: 30 },
      { day: 'D', value: 10 },
    ],
  });

  const metricCards = [
    { title: 'Mëritos Totales', value: metrics.totalMeritos.value.toString(), change: metrics.totalMeritos.change, icon: <Diamond sx={{ color: 'var(--uplay-blue-300)' }} />, sparklineData: metrics.totalMeritos.sparkline, color: '#facc15' },
    { title: 'Öndas Acumuladas', value: metrics.totalOndas.value.toString(), change: metrics.totalOndas.change, icon: <Bolt sx={{ color: 'var(--uplay-blue-300)' }} />, sparklineData: metrics.totalOndas.sparkline, color: '#67e8f9' },
    { title: 'Racha de Días', value: metrics.currentStreak.value.toString(), change: metrics.currentStreak.change, icon: <LocalFireDepartment sx={{ color: 'var(--uplay-blue-300)' }} />, sparklineData: metrics.currentStreak.sparkline, color: '#f97316' },
  ];

  return (
    <div data-testid="uplay-dashboard" className="p-4 space-y-8">
      <Grid container spacing={3}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ProfessionalMetricCard {...card} />
          </Grid>
        ))}
      </Grid>

      <UPlayProgressPanel
        weeklyData={metrics.weeklyData}
        weeklyProgress={metrics.weeklyProgress}
        weeklyGoal={metrics.weeklyGoal}
      />
    </div>
  );
};

export default UPlayEnhancedDashboard;
