import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EmojiEvents, Star, Diamond, WorkspacePremium } from '@mui/icons-material';

interface Achievement {
  title: string;
  reward: string;
  type?: 'bronze' | 'silver' | 'gold' | 'diamond';
  meritos?: number;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  soundEnabled?: boolean;
}

// Configuración de colores según tipo de mérito
const meritColors = {
  bronze: ['#CD7F32', '#B8860B', '#DAA520'],
  silver: ['#C0C0C0', '#E6E6FA', '#F5F5DC'],
  gold: ['#FFD700', '#FFA500', '#FF8C00'],
  diamond: ['#B9F2FF', '#87CEEB', '#00BFFF']
};

// Configuración de iconos según tipo
const meritIcons = {
  bronze: Star,
  silver: EmojiEvents,
  gold: WorkspacePremium,
  diamond: Diamond
};

const CELEBRATION_SOUND = '/assets/sounds/celebration.mp3'; // Ruta sugerida, debe existir el archivo

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onClose, soundEnabled = true }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const achievementType = achievement.type || 'gold';
  const colors = meritColors[achievementType];
  const IconComponent = meritIcons[achievementType];

  useEffect(() => {
    // Feedback háptico para mobile
    if ('vibrate' in navigator && window.innerWidth <= 768) {
      navigator.vibrate([100, 50, 100, 50, 200]); // Patrón de vibración celebratorio
    }

    // Trigger de sonido de celebración
    if (soundEnabled) {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.3;
          audioRef.current.play().catch(console.warn);
        }
      } catch (error) {
        console.warn('Error reproduciendo sonido de celebración:', error);
      }
    }

    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose, soundEnabled]);

  // Configuración de confetti mejorada (36 partículas)
  const confettiParticles = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
    initialX: Math.random() * 100,
    initialY: Math.random() * 50,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.8,
  }));

  return (
    <>
      {/* Audio element para sonido de celebración */}
      <audio ref={audioRef} preload="auto">
        <source src="/assets/sounds/celebration.mp3" type="audio/mpeg" />
        <source src="/assets/sounds/celebration.ogg" type="audio/ogg" />
      </audio>

      {/* Overlay con backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={onClose}
        role="dialog"
        aria-live="assertive"
        aria-label={`Logro desbloqueado: ${achievement.title}`}
      >
        {/* Confetti particles con animación mejorada */}
        {confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 0,
              scale: 0,
              x: `${particle.initialX}vw`,
              y: `${particle.initialY}vh`,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, particle.scale, particle.scale, 0],
              x: `${particle.initialX + (Math.random() - 0.5) * 200}vw`,
              y: `${particle.initialY + 100 + Math.random() * 50}vh`,
              rotate: particle.rotation,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: `linear-gradient(45deg, ${particle.color}, ${colors[(colors.indexOf(particle.color) + 1) % colors.length]})`,
              borderRadius: '50%',
              boxShadow: `0 0 6px ${particle.color}`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Notificación principal con efectos mejorados */}
        <motion.div
          initial={{ 
            scale: 0, 
            rotate: -10, 
            y: 50,
            opacity: 0 
          }}
          animate={{ 
            scale: [0, 1.1, 1], 
            rotate: [0, 5, 0], 
            y: 0,
            opacity: 1 
          }}
          exit={{ 
            scale: 0, 
            opacity: 0,
            y: -50 
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.6
          }}
          style={{
            background: `linear-gradient(135deg, 
              ${colors[0]}15, 
              ${colors[1]}25, 
              ${colors[2]}15
            )`,
            backdropFilter: 'blur(12px)',
            border: `2px solid ${colors[0]}`,
            borderRadius: '20px',
            padding: window.innerWidth <= 768 ? '20px' : '32px',
            maxWidth: window.innerWidth <= 768 ? '320px' : '480px',
            width: '90%',
            textAlign: 'center',
            boxShadow: `
              0 20px 40px rgba(0,0,0,0.3),
              0 0 0 1px ${colors[0]}40,
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow effect background */}
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              right: '-50%',
              bottom: '-50%',
              background: `radial-gradient(circle, ${colors[0]}20 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Icono principal con animación */}
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: 2,
              ease: "easeInOut"
            }}
            style={{
              fontSize: window.innerWidth <= 768 ? '48px' : '64px',
              marginBottom: '16px',
              filter: `drop-shadow(0 0 10px ${colors[0]})`
            }}
          >
            <IconComponent 
              sx={{ 
                fontSize: 'inherit',
                color: colors[0],
                filter: `drop-shadow(0 0 4px ${colors[1]})`
              }} 
            />
          </motion.div>

          {/* Título del logro */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: window.innerWidth <= 768 ? '18px' : '24px',
              fontWeight: 'bold',
              color: colors[0],
              marginBottom: '12px',
              textShadow: `0 0 8px ${colors[1]}`,
              lineHeight: 1.2
            }}
          >
            🎉 ¡Logro Desbloqueado!
          </motion.h2>

          {/* Descripción del logro */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: window.innerWidth <= 768 ? '14px' : '16px',
              color: '#E8E8E8',
              marginBottom: '16px',
              lineHeight: 1.4
            }}
          >
            <strong>{achievement.title}</strong>
            <br />
            {achievement.reward}
          </motion.p>

          {/* Información de méritos si está disponible */}
          {achievement.meritos && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: `linear-gradient(90deg, ${colors[0]}20, ${colors[1]}30)`,
                border: `1px solid ${colors[0]}`,
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                fontWeight: 'bold',
                color: colors[0],
                boxShadow: `0 0 8px ${colors[0]}40`
              }}
            >
              <Star sx={{ fontSize: '16px', marginRight: '4px' }} />
              +{achievement.meritos} Mëritos
            </motion.div>
          )}

          {/* Botón de cerrar discreto */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#E8E8E8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
            aria-label="Cerrar notificación"
          >
            ×
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AchievementNotification;
