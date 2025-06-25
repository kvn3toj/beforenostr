import React from 'react';
import { motion } from 'framer-motion';
import { Chip } from '@mui/material';
import { useBreakpoint } from '../../../../hooks/ui/useBreakpoint';
import { useAdvancedHover } from '../../../../hooks/ui/useAdvancedHover';

// Helper function to get style based on category
const getCategoryColor = (category: string) => {
  const styles: { [key: string]: string } = {
    "Web Development": "bg-blue-100 text-blue-800",
    "Data Science": "bg-violet-100 text-violet-800",
    "UX/UI Design": "bg-indigo-100 text-indigo-800",
    "Marketing": "bg-gray-100 text-gray-800",
  };
  return styles[category] || "bg-slate-100 text-slate-800";
};

interface PremiumStudyRoomCardProps {
  title: string;
  author: string;
  participants: number;
  maxParticipants: number;
  category: string;
  imageUrl: string; // Nueva prop para la imagen de fondo
  isLive?: boolean;
}

const PremiumStudyRoomCard: React.FC<PremiumStudyRoomCardProps> = ({
  title,
  author,
  participants,
  maxParticipants,
  category,
  imageUrl,
  isLive = false,
}) => {
  const breakpoint = useBreakpoint();
  const { hoverState, handleMouseEnter, handleMouseLeave, handleMouseMove } = useAdvancedHover();

  const isMobile = breakpoint === 'xs';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative overflow-hidden bg-gradient-to-br from-[#232946] via-[#6c5ce7] to-[#a0aec0] backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#232946]/70 to-transparent" />

      {/* Interactive glow effect */}
      {hoverState.isHovered && !isMobile && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${hoverState.mousePosition.x}px ${hoverState.mousePosition.y}px, rgba(147, 197, 253, 0.4), transparent 200px)`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Live indicator with pulse */}
        {isLive && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-blue-400 rounded-full shadow-blue-400/40"
            />
            <span className="text-xs font-semibold text-blue-400 bg-blue-50 px-2 py-1 rounded-full shadow-blue-400/20">
              EN VIVO
            </span>
          </div>
        )}

        {/* Author avatar with online status */}
        <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col items-start' : ''}`}>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {author.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div className={isMobile ? 'mt-2' : ''}>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">por {author}</p>
          </div>
        </div>

        {/* Participants with avatars */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(Math.min(participants, isMobile ? 2 : 4))].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
                >
                  {/* Using a generic icon or number if no avatars */}
                  {i + 1}
                </div>
              ))}
              {participants > (isMobile ? 2 : 4) && (
                <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                  +{participants - (isMobile ? 2 : 4)}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {participants}/{maxParticipants}
            </span>
          </div>

          {/* Category badge */}
          <Chip label={category} size="small" className={getCategoryColor(category)} />

        </div>

        <div className="relative z-10 mt-auto">
          {/* Join button with dynamic state */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              participants >= maxParticipants
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-violet-700 hover:from-blue-700 hover:to-violet-800 text-white shadow-lg hover:shadow-violet-500/25"
            }`}
            disabled={participants >= maxParticipants}
          >
            {participants >= maxParticipants ? "Sala Llena" : "Unirse a Sala"}
          </motion.button>
        </div>

      </div>
      {/* Floating particles for active rooms */}
      {isLive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute w-2 h-2 bg-blue-400 rounded-full blur-sm shadow-blue-400/30"
              style={{
                left: `${20 + i * 30}%`,
                bottom: "20%",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PremiumStudyRoomCard;
