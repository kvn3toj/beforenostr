import React from 'react';
import { motion } from 'framer-motion';
import { EmojiEvents } from '@mui/icons-material';

interface Achievement {
  title: string;
  reward: string;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => (
  <motion.div
    initial={{ scale: 0, rotate: -10, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
    exit={{ scale: 0, rotate: 10, opacity: 0 }}
    onClick={onClose}
    className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-2xl max-w-sm cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
        <EmojiEvents sx={{ fontSize: 32, color: 'white' }} />
      </div>
      <div>
        <h3 className="font-bold text-lg">¡Logro Desbloqueado!</h3>
        <p className="text-white/90">{achievement.title}</p>
        <p className="text-sm text-white/80">+{achievement.reward}</p>
      </div>
    </div>

    {/* Confetti particles */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -100, opacity: 0 }}
          transition={{ duration: 2, delay: i * 0.1 }}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  </motion.div>
);

export default AchievementNotification;
