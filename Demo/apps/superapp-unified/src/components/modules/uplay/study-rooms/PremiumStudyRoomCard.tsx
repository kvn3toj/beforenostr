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
      whileHover={{ y: -4, scale: 1.03, boxShadow: '0 20px 40px 0 rgba(99,102,241,0.18)' }}
      className="group relative overflow-hidden h-full flex flex-col"
      style={{
        background: 'linear-gradient(135deg, rgba(35,41,70,0.92) 0%, rgba(108,92,231,0.92) 60%, rgba(160,174,192,0.92) 100%)',
        border: '1.5px solid rgba(160,174,192,0.18)',
        boxShadow: '0 8px 32px 0 rgba(99,102,241,0.14)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderRadius: 32,
        padding: 32,
        minHeight: 260,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Overlay de imagen de la sala como fondo sutil */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `url(${imageUrl}) center/cover no-repeat`,
          opacity: 0.10,
          filter: 'blur(2.5px)',
          zIndex: 0,
        }}
      />

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
            <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 18 }}>{title}</h3>
            <p style={{ fontSize: 14, color: '#a0aec0', margin: 0 }}>por {author}</p>
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
          <Chip
            label={category}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              color: '#fff',
              fontWeight: 600,
              minHeight: 32,
              minWidth: 44,
              px: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px 0 rgba(99,102,241,0.12)'
            }}
          />

        </div>

        <div className="relative z-10 mt-auto">
          {/* Join button with dynamic state */}
          <motion.button
            whileHover={{ scale: participants >= maxParticipants ? 1 : 1.05 }}
            whileTap={{ scale: participants >= maxParticipants ? 1 : 0.95 }}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 16,
              fontWeight: 700,
              fontSize: 16,
              background: participants >= maxParticipants
                ? 'linear-gradient(135deg, #64748b 0%, #a0aec0 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #6c5ce7 100%)',
              color: '#fff',
              opacity: participants >= maxParticipants ? 0.6 : 1,
              cursor: participants >= maxParticipants ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px 0 rgba(99,102,241,0.12)',
              transition: 'all 0.3s',
              marginTop: 8
            }}
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
