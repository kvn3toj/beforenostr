import React from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useBreakpoint } from '../../../../hooks/ui/useBreakpoint';
import { useAdvancedHover } from '../../../../hooks/ui/useAdvancedHover';

// Helper function to get style based on category
const getCategoryStyle = (category: string) => {
  const styles: { [key: string]: string } = {
    Learning: "bg-blue-100 text-blue-800 border border-blue-300",
    Social: "bg-violet-100 text-violet-800 border border-violet-300",
    Streak: "bg-indigo-100 text-indigo-800 border border-indigo-300",
    Mastery: "bg-gray-200 text-gray-800 border border-gray-400",
    Special: "bg-slate-100 text-slate-800 border border-slate-300",
  };
  return styles[category] || "bg-gray-100 text-gray-800 border border-gray-300";
};

interface CinematicAchievementCardProps {
  title: string;
  icon: string; // Nueva prop para el ícono/imagen
  category: string[];
  progress: number;
  total: number;
  reward: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  isNew?: boolean;
}

const CinematicAchievementCard: React.FC<CinematicAchievementCardProps> = ({
  title,
  icon,
  category,
  progress,
  total,
  reward,
  rarity = "common",
  isNew = false,
}) => {
  const breakpoint = useBreakpoint();
  const { hoverState, handleMouseEnter, handleMouseLeave, handleMouseMove } = useAdvancedHover();

  const isMobile = breakpoint === 'xs';

  const rarityStyles = {
    common: "from-gray-400 to-gray-600",
    rare: "from-blue-500 to-blue-800",
    epic: "from-violet-500 to-violet-800",
    legendary: "from-[#bfae60] to-[#e5e4e2]", // dorado pálido a plateado
    mythic: "from-indigo-400 to-violet-700 shadow-violet-500/20",
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0 20px 40px 0 rgba(99,102,241,0.18)",
      }}
      className="group relative overflow-hidden"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        background: 'linear-gradient(135deg, rgba(35,41,70,0.92) 0%, rgba(108,92,231,0.92) 60%, rgba(160,174,192,0.92) 100%)',
        color: '#fff',
        border: '1.5px solid rgba(160,174,192,0.18)',
        boxShadow: '0 8px 32px 0 rgba(99,102,241,0.14)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderRadius: 32,
        padding: 32,
        minHeight: 240,
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Overlay de icono como fondo sutil */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `url(${icon}) center/60% no-repeat`,
          opacity: 0.08,
          filter: 'blur(2px)',
          zIndex: 0,
        }}
      />

      {/* Rarity glow effect on hover */}
      {hoverState.isHovered && !isMobile && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${hoverState.mousePosition.x}px ${hoverState.mousePosition.y}px, rgba(255, 255, 255, 0.12), transparent 150px)`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* New achievement shine effect */}
      {isNew && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/40 to-transparent"
        />
      )}

      <div className={`flex ${isMobile ? 'flex-col items-start' : 'items-center'} gap-4`}>
        <img
          alt={`${title} icon`}
          src={icon}
          width={isMobile ? 32 : 40}
          height={isMobile ? 32 : 40}
          className="rounded-lg"
          style={{ objectFit: 'cover', background: '#232946' }}
        />
        <h3 className="font-bold text-lg text-white drop-shadow-md">{title}</h3>
      </div>

      {/* Category badges with better styling */}
      <div className="flex flex-wrap gap-2 mb-4 mt-2">
        {category.map((cat) => (
          <span
            key={cat}
            style={{
              padding: '8px 16px',
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              color: '#fff',
              border: '1.5px solid #a0aec0',
              minWidth: 48,
              minHeight: 36,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px 0 rgba(99,102,241,0.12)'
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Enhanced progress with particle effects */}
      <div style={{ width: '100%', background: '#232946', borderRadius: 8, height: 12, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(progress / total) * 100}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            height: 12,
            borderRadius: 8,
            background: 'linear-gradient(90deg, #2563eb, #6c5ce7)',
            position: 'relative'
          }}
        >
          {/* Flowing particles in progress bar */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            animation: 'pulse 2s infinite'
          }} />
        </motion.div>
      </div>

      {/* Progress text with better typography */}
      <div className={`flex justify-between mt-2 text-sm ${isMobile ? 'flex-col items-start gap-1' : ''}`}>
        <span className="font-medium text-white/90">
          {progress}/{total}
        </span>
        <span className="font-bold text-blue-200">{reward}</span>
      </div>
    </motion.div>
  );
};

export default CinematicAchievementCard;
