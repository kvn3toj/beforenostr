import React from 'react';
import { motion } from 'framer-motion';

// Placeholder for icon, replace with your library e.g. from 'lucide-react'
const Trophy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);


interface Achievement {
    title: string;
    reward: string;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

// ✅ Sistema de notificaciones de logros
export const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose }) => (
  <motion.div
    initial={{ scale: 0, rotate: -10, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
    exit={{ scale: 0, rotate: 10, opacity: 0 }}
    className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-2xl max-w-sm"
    onClick={onClose}
    style={{ cursor: 'pointer' }}
  >
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
        <Trophy className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-bold text-lg">¡Logro Desbloqueado!</h3>
        <p className="text-white/90">{achievement.title}</p>
        <p className="text-sm text-white/80">{achievement.reward}</p>
      </div>
    </div>

    {/* Confetti particles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, x: 0, opacity: 1 }}
          animate={{
            y: (Math.random() - 0.5) * 300,
            x: (Math.random() - 0.5) * 300,
            opacity: 0
          }}
          transition={{ duration: 2, delay: i * 0.05, ease: "easeOut" }}
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
