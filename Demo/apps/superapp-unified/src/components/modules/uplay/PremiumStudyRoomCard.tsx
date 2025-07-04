import React from 'react';
import { motion } from 'framer-motion';

// Placeholder for icons. You can replace this with your actual icon library e.g. from 'lucide-react'
const UserIcon = () => <span></span>;

interface PremiumStudyRoomCardProps {
  title: string;
  author: string;
  participants: number;
  maxParticipants: number;
  status: string; // e.g. 'Waiting', 'In Progress'
  category: string;
  isLive?: boolean;
}

// Category styling function - similar to achievements
const getCategoryColor = (category: string) => {
  const styles: { [key: string]: string } = {
    'React': "bg-blue-100 text-blue-800 border border-blue-200",
    'TypeScript': "bg-sky-100 text-sky-800 border border-sky-200",
    'NestJS': "bg-red-100 text-red-800 border border-red-200",
    'General': "bg-green-100 text-green-800 border border-green-200",
    'Project': "bg-purple-100 text-purple-800 border border-purple-200",
  };
  return styles[category] || "bg-gray-100 text-gray-800 border border-gray-200";
};

// ✅ Cards de salas con estados en tiempo real
export const PremiumStudyRoomCard: React.FC<PremiumStudyRoomCardProps> = ({
  title,
  author,
  participants,
  maxParticipants,
  status,
  category,
  isLive = false,
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    className="group relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    {/* Live indicator with pulse */}
    {isLive && (
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-3 h-3 bg-red-500 rounded-full"
        />
        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
          EN VIVO
        </span>
      </div>
    )}

    {/* Author avatar with online status */}
    <div className="flex items-center gap-3 mb-4">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          {author.charAt(0)}
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">por {author}</p>
      </div>
    </div>

    {/* Participants with avatars */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[...Array(Math.min(participants, 4))].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
            >
             <UserIcon />
            </div>
          ))}
          {participants > 4 && (
            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
              +{participants - 4}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {participants}/{maxParticipants}
        </span>
      </div>

      {/* Category badge */}
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(category)}`}
      >
        {category}
      </span>
    </div>

    {/* Join button with dynamic state */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
        participants >= maxParticipants
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25"
      }`}
      disabled={participants >= maxParticipants}
    >
      {participants >= maxParticipants ? "Sala Llena" : "Unirse a Sala"}
    </motion.button>

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
            className="absolute w-2 h-2 bg-blue-400 rounded-full blur-sm"
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
