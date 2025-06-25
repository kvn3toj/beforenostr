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
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      className={`group relative overflow-hidden rounded-2xl p-6 ${isNew ? 'floating-element' : ''}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        background: 'linear-gradient(135deg, #232946 0%, #6c5ce7 60%, #a0aec0 100%)',
        color: '#fff',
        border: '1.5px solid #c0c0c0',
        boxShadow: '0 4px 24px 0 rgba(160,174,192,0.18), 0 1.5px 0 0 #c0c0c0',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
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
            className={`px-3 py-1 rounded-full text-xs font-semibold border border-blue-300 bg-blue-900/60 text-white`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Enhanced progress with particle effects */}
      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(progress / total) * 100}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className={`h-3 rounded-full bg-gradient-to-r ${rarityStyles[rarity]} relative`}
          >
            {/* Flowing particles in progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>
        </div>

        {/* Progress text with better typography */}
        <div className={`flex justify-between mt-2 text-sm ${isMobile ? 'flex-col items-start gap-1' : ''}`}>
          <span className="font-medium text-white/90">
            {progress}/{total}
          </span>
          <span className="font-bold text-blue-200">{reward}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CinematicAchievementCard;
