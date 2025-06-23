import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Icon, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface ProfessionalAchievementCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  date: string;
  color?: string;
  tags?: string[];
}

export const ProfessionalAchievementCard: React.FC<ProfessionalAchievementCardProps> = ({
  title,
  description,
  icon,
  date,
  color = '#5B21B6',
  tags = [],
}) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ y: -5 }}>
      <Box
        sx={{
          p: 2.5,
          background: `linear-gradient(145deg, ${alpha(color, 0.05)}, ${alpha(color, 0.1)})`,
          backdropFilter: 'blur(12px)',
          borderRadius: 4,
          border: `1px solid ${alpha(color, 0.2)}`,
          color: 'var(--primary-text)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color, mr: 2, fontSize: '2rem' }}>{icon}</Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--secondary-text)' }}>
              {date}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'var(--secondary-text)', flexGrow: 1, mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                backgroundColor: alpha(color, 0.2),
                color,
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};
