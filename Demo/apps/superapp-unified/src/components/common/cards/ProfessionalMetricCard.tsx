import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Box, Typography, Icon } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ArrowUpward } from '@mui/icons-material';

interface ProfessionalMetricCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  sparklineData?: number[];
  index?: number;
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      duration: 0.6,
    },
  },
};

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
    const max = Math.max(...data);
    return (
      <Box sx={{ height: '32px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
        {data.map((height, i) => (
          <motion.div
            key={i}
            style={{
              flex: 1,
              background: 'linear-gradient(to top, var(--uplay-blue-200), var(--uplay-blue-300))',
              borderRadius: '2px 2px 0 0',
              opacity: 0.6,
            }}
            custom={height / max}
            initial={{ height: '0%' }}
            whileInView={{ height: `${(height / max) * 100}%`, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.8 }}
          />
        ))}
      </Box>
    );
};

export const ProfessionalMetricCard: React.FC<ProfessionalMetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  sparklineData = [60, 70, 65, 80, 75, 90, 100],
  index = 0,
}) => {
    const theme = useTheme();

  return (
    <motion.div
        variants={cardVariants}
    >
      <Box
        className="group"
        sx={{
            position: 'relative',
            overflow: 'hidden',
            p: { xs: 2, md: 3 },
            cursor: 'pointer',
            height: '100%',
            borderRadius: '24px',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: 'var(--shadow-card-hover)',
                '.shine-effect': {
                    transform: 'translateX(100%)',
                },
                '.pulse-ring': {
                    transform: 'scale(1.25)',
                    opacity: 1,
                },
                 '.icon-container': {
                    transform: 'scale(1.1)',
                    boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                 }
            },
        }}
      >
        <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
            opacity: 0,
            transition: 'opacity 0.5s ease-in-out',
            '.group:hover &': {
                opacity: 1,
            }
        }} />

        <Box
          className="shine-effect"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent)',
            transform: 'translateX(-100%)',
            transition: 'transform 1s ease-in-out',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ position: 'relative' }}>
                    <Box
                        className="icon-container"
                        sx={{
                            width: {xs: 48, md: 56},
                            height: {xs: 48, md: 56},
                            background: 'var(--gradient-icon)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                            transition: 'all 0.3s ease-in-out',
                        }}
                    >
                        <Icon sx={{ width: {xs: 24, md: 28}, height: {xs: 24, md: 28}, color: 'white' }}>{icon}</Icon>
                    </Box>
                    <Box className="pulse-ring" sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '16px',
                        background: 'var(--uplay-blue-500)',
                        opacity: 0,
                        transition: 'all 0.5s ease-in-out',
                        zIndex: -1,
                    }} />
                </Box>
                {trend && (
                     <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        background: trend.direction === 'up' ? 'rgba(56, 189, 107, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: trend.direction === 'up' ? '#16a34a' : '#ef4444',
                        px: '12px',
                        py: '6px',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        border: '1px solid',
                        borderColor: trend.direction === 'up' ? 'rgba(56, 189, 107, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}>
                        <ArrowUpward sx={{ width: 14, height: 14, transform: trend.direction === 'down' ? 'rotate(180deg)' : 'none' }} />
                        <span>{trend.value}</span>
                    </Box>
                )}
            </Box>

            <Box sx={{ my: 2 }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'bold',
                        background: 'var(--gradient-text)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {value}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>{title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>vs mes anterior</Typography>
            </Box>

            {sparklineData && (
                <Box sx={{ mt: 'auto' }}>
                    <Sparkline data={sparklineData} />
                </Box>
            )}
        </Box>
      </Box>
    </motion.div>
  );
};
