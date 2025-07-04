import React from 'react';
import { motion } from 'framer-motion';

type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

interface CinematicAchievementCardProps {
  title: string;
  category: string[];
  progress: number;
  total: number;
  reward: string;
  rarity?: Rarity;
  isNew?: boolean;
}

const getCategoryStyle = (category: string) => {
  const styles: { [key: string]: string } = {
    Learning: "bg-blue-100 text-blue-800 border border-blue-200",
    Social: "bg-green-100 text-green-800 border border-green-200",
    Streak: "bg-orange-100 text-orange-800 border border-orange-200",
    Mastery: "bg-purple-100 text-purple-800 border border-purple-200",
    Special: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  };
  return styles[category] || "bg-gray-100 text-gray-800 border border-gray-200";
};

// ✅ Logros con animaciones cinematográficas
export const CinematicAchievementCard: React.FC<CinematicAchievementCardProps> = ({
  title,
  category,
  progress,
  total,
  reward,
  rarity = "common",
  isNew = false,
}) => {
  const rarityStyles: { [key in Rarity]: string } = {
    common: "from-gray-400 to-gray-600",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-500",
    mythic: "from-pink-400 to-red-500 shadow-red-500/20",
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        rotateY: 5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 p-6"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Rarity glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${rarityStyles[rarity]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* New achievement shine effect */}
      {isNew && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent"
        />
      )}

      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>

      {/* Category badges with better styling */}
      <div className="flex flex-wrap gap-2 mb-4">
        {category.map((cat) => (
          <span
            key={cat}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryStyle(cat)}`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Enhanced progress with particle effects */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(progress / total) * 100}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className={`h-3 rounded-full bg-gradient-to-r ${rarityStyles[rarity]} relative`}
          >
            {/* Flowing particles in progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </motion.div>
        </div>

        {/* Progress text with better typography */}
        <div className="flex justify-between mt-2 text-sm">
          <span className="font-medium text-gray-700">
            {progress}/{total}
          </span>
          <span className="font-bold text-blue-600">{reward}</span>
        </div>
      </div>
    </motion.div>
  );
};
