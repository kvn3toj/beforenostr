import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EmojiEvents } from '@mui/icons-material';

interface Achievement {
  title: string;
  reward: string;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  soundEnabled?: boolean;
}

// Colores corporativos para confetti
const CONFETTI_COLORS = [
  '#005CA9', // Blue
  '#5C2483', // Purple
  '#FBBF24', // Gold
  '#EA580C', // Orange
  '#1D4ED8', // Indigo
  '#F43F5E', // Pink
  '#FFFFFF', // White
];

// Número de partículas de confetti
const CONFETTI_COUNT = 24;

const CELEBRATION_SOUND = '/assets/sounds/celebration.mp3'; // Ruta sugerida, debe existir el archivo

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose, soundEnabled = true }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reproducir sonido de celebración si está habilitado
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 10, opacity: 0 }}
      onClick={onClose}
      className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-2xl max-w-sm cursor-pointer"
      aria-live="polite"
      role="status"
    >
      <audio ref={audioRef} src={CELEBRATION_SOUND} preload="auto" style={{ display: 'none' }} />
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

      {/* Confetti particles mejorados */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(CONFETTI_COUNT)].map((_, i) => {
          const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
          const left = Math.random() * 100;
          const top = Math.random() * 40 + 20; // más centrado verticalmente
          const rotate = Math.random() * 360;
          const size = Math.random() * 8 + 6;
          const duration = 1.5 + Math.random();
          const delay = i * 0.04;
          return (
            <motion.div
              key={i}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{ y: -120 - Math.random() * 60, opacity: 0, rotate }}
              transition={{ duration, delay }}
              className="absolute rounded-full shadow-lg"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                background: color,
                zIndex: 1,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default AchievementNotification;
