import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  Share,
  MoreVert,
  Verified,
  Nature,
  Star,
  TrendingUp,
  GroupWork,
  Handshake,
  Psychology,
} from '@mui/icons-material';
import { cn, animations, gradients, focus } from '../../../../utils/styles';
import { Card as CoomunityCard, Button as CoomunityButton } from '../../../ui';

// 🎯 Types
interface SocialPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isEmprendedorConfiable: boolean;
    reciprocidadScore: number;
    meritos: number;
    specialties: string[];
  };
  content: {
    text: string;
    images?: string[];
    video?: string;
    type: 'knowledge' | 'collaboration' | 'achievement' | 'question' | 'offer';
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    reciprocidadPoints: number;
  };
  metadata: {
    createdAt: string;
    location?: string;
    tags: string[];
    isPromoted: boolean;
    isBienComun: boolean;
    collaborationLevel: 'individual' | 'group' | 'community';
  };
  interactions: {
    isLiked: boolean;
    hasCommented: boolean;
    hasShared: boolean;
    reciprocidadGiven: number;
  };
}

interface EnhancedSocialFeedProps {
  posts: SocialPost[];
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onGiveReciprocidad?: (postId: string, points: number) => void;
  onCollaborate?: (postId: string) => void;
  className?: string;
}

// 🎨 Animation Variants
const feedVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const postVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  }
};

const reciprocidadFlowVariants = {
  initial: { scale: 1, opacity: 0.7 },
  animate: { 
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

// 🌟 Enhanced Social Feed Component
export const EnhancedSocialFeed: React.FC<EnhancedSocialFeedProps> = ({
  posts,
  onLike,
  onComment,
  onShare,
  onGiveReciprocidad,
  onCollaborate,
  className,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  // 🎨 Helper Functions
  const getPostTypeIcon = (type: SocialPost['content']['type']) => {
    switch (type) {
      case 'knowledge': return <Psychology className="w-5 h-5 text-coomunity-500" />;
      case 'collaboration': return <GroupWork className="w-5 h-5 text-success-500" />;
      case 'achievement': return <Star className="w-5 h-5 text-gold-500" />;
      case 'question': return <ChatBubbleOutline className="w-5 h-5 text-info-500" />;
      case 'offer': return <Handshake className="w-5 h-5 text-warning-500" />;
      default: return null;
    }
  };

  const getPostTypeColor = (type: SocialPost['content']['type']) => {
    switch (type) {
      case 'knowledge': return 'primary';
      case 'collaboration': return 'success';
      case 'achievement': return 'warning';
      case 'question': return 'info';
      case 'offer': return 'secondary';
      default: return 'default';
    }
  };

  const getReciprocidadColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getCollaborationBadge = (level: SocialPost['metadata']['collaborationLevel']) => {
    switch (level) {
      case 'community': return { label: 'Comunidad', color: 'primary' };
      case 'group': return { label: 'Grupo', color: 'success' };
      case 'individual': return { label: 'Individual', color: 'info' };
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  return (
    <motion.div
      variants={feedVariants}
      initial="hidden"
      animate="visible"
      className={cn('space-y-6', className)}
    >
      <AnimatePresence>
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onGiveReciprocidad={onGiveReciprocidad}
            onCollaborate={onCollaborate}
            onMenuClick={handleMenuClick}
            getPostTypeIcon={getPostTypeIcon}
            getPostTypeColor={getPostTypeColor}
            getReciprocidadColor={getReciprocidadColor}
            getCollaborationBadge={getCollaborationBadge}
          />
        ))}
      </AnimatePresence>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Share className="w-4 h-4 mr-2" />
          Compartir
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Star className="w-4 h-4 mr-2" />
          Guardar
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          Reportar contenido
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

// 📝 Individual Post Card Component
interface PostCardProps {
  post: SocialPost;
  index: number;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onGiveReciprocidad?: (postId: string, points: number) => void;
  onCollaborate?: (postId: string) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, postId: string) => void;
  getPostTypeIcon: (type: SocialPost['content']['type']) => React.ReactNode;
  getPostTypeColor: (type: SocialPost['content']['type']) => string;
  getReciprocidadColor: (score: number) => string;
  getCollaborationBadge: (level: SocialPost['metadata']['collaborationLevel']) => { label: string; color: string };
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  index,
  onLike,
  onComment,
  onShare,
  onGiveReciprocidad,
  onCollaborate,
  onMenuClick,
  getPostTypeIcon,
  getPostTypeColor,
  getReciprocidadColor,
  getCollaborationBadge,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showReciprocidadFlow, setShowReciprocidadFlow] = useState(false);

  const collaborationBadge = getCollaborationBadge(post.metadata.collaborationLevel);

  const handleReciprocidadGive = () => {
    setShowReciprocidadFlow(true);
    onGiveReciprocidad?.(post.id, 1);
    setTimeout(() => setShowReciprocidadFlow(false), 2000);
  };

  return (
    <motion.div
      variants={postVariants}
      custom={index}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <CoomunityCard
        variant={post.metadata.isBienComun ? 'coomunity' : 'elevated'}
        padding="none"
        interactive
        className={cn(
          'relative overflow-hidden',
          'border-2 border-transparent',
          'hover:border-coomunity-200',
          'transition-all duration-300',
          post.metadata.isPromoted && 'ring-2 ring-gold-200',
          focus.visible
        )}
      >
        {/* 🏷️ Status Badges */}
        <Box className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          <AnimatePresence>
            {post.metadata.isPromoted && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Chip
                  icon={<TrendingUp className="text-white" />}
                  label="Destacado"
                  size="small"
                  className={cn(
                    'bg-gold-500 text-white shadow-lg',
                    animations.pulse
                  )}
                />
              </motion.div>
            )}
            
            {post.metadata.isBienComun && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Chip
                                      icon={<Nature className="text-white" />}
                  label="Bien Común"
                  size="small"
                  className="bg-success-500 text-white shadow-lg"
                />
              </motion.div>
            )}

            <Chip
              icon={getPostTypeIcon(post.content.type)}
              label={post.content.type.charAt(0).toUpperCase() + post.content.type.slice(1)}
              size="small"
              color={getPostTypeColor(post.content.type) as any}
              variant="outlined"
              className="bg-white/90 backdrop-blur-sm"
            />
          </AnimatePresence>
        </Box>

        {/* ⚙️ Actions Menu */}
        <Box className="absolute top-4 right-4 z-10">
          <IconButton
            onClick={(e) => onMenuClick(e, post.id)}
            className={cn(
              'bg-white/90 backdrop-blur-sm shadow-lg',
              'hover:bg-white hover:scale-110',
              'transition-all duration-200',
              focus.visible
            )}
            size="small"
          >
            <MoreVert className="text-gray-600" />
          </IconButton>
        </Box>

        {/* 👤 Author Section */}
        <Box className="p-6 pb-4">
          <Box className="flex items-start gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  post.author.isEmprendedorConfiable ? (
                    <Verified className="w-4 h-4 text-gold-500" />
                  ) : null
                }
              >
                <Avatar
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12"
                />
              </Badge>
            </motion.div>

            <Box className="flex-1 min-w-0">
              <Box className="flex items-center gap-2 flex-wrap">
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-gray-900"
                >
                  {post.author.name}
                </Typography>
                
                {/* Reciprocidad Score */}
                <Chip
                  label={`Reciprocidad: ${post.author.reciprocidadScore}%`}
                  size="small"
                  color={getReciprocidadColor(post.author.reciprocidadScore) as any}
                  className="h-6"
                />

                {/* Collaboration Level */}
                <Chip
                  label={collaborationBadge.label}
                  size="small"
                  color={collaborationBadge.color as any}
                  variant="outlined"
                  className="h-6"
                />
              </Box>

              {/* Author Specialties */}
              <Box className="flex flex-wrap gap-1 mt-1">
                {post.author.specialties.slice(0, 3).map((specialty) => (
                  <Chip
                    key={specialty}
                    label={specialty}
                    size="small"
                    variant="outlined"
                    className="h-5 text-xs"
                  />
                ))}
              </Box>

              {/* Post Metadata */}
              <Typography variant="caption" className="text-gray-500 mt-1 block">
                {new Date(post.metadata.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {post.metadata.location && ` • ${post.metadata.location}`}
              </Typography>
            </Box>

            {/* Mëritos Badge */}
            <Tooltip title={`${post.author.meritos} Mëritos ganados`}>
              <Chip
                icon={<Star className="text-gold-600" />}
                label={post.author.meritos}
                size="small"
                className="bg-gold-50 text-gold-700 border-gold-200"
              />
            </Tooltip>
          </Box>
        </Box>

        {/* 📝 Content Section */}
        <Box className="px-6 pb-4">
          <Typography
            variant="body1"
            className="text-gray-800 leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {post.content.text}
          </Typography>

          {/* Tags */}
          {post.metadata.tags.length > 0 && (
            <Box className="flex flex-wrap gap-1 mt-3">
              {post.metadata.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  className="text-coomunity-600 border-coomunity-200 hover:bg-coomunity-50 cursor-pointer"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* 🖼️ Media Section */}
        {post.content.images && post.content.images.length > 0 && (
          <Box className="px-6 pb-4">
            <Box className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
              {post.content.images.slice(0, 4).map((image, idx) => (
                <motion.img
                  key={idx}
                  src={image}
                  alt={`Post image ${idx + 1}`}
                  className="w-full h-32 object-cover cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 📊 Engagement Stats */}
        <Box className="px-6 py-3 border-t border-gray-100">
          <Box className="flex items-center justify-between text-sm text-gray-500">
            <Box className="flex items-center gap-4">
              <span>{post.engagement.likes} me gusta</span>
              <span>{post.engagement.comments} comentarios</span>
              <span>{post.engagement.shares} compartidos</span>
            </Box>
            
            {/* Reciprocidad Points Earned */}
            <Box className="flex items-center gap-1">
              <motion.div
                variants={reciprocidadFlowVariants}
                initial="initial"
                animate={showReciprocidadFlow ? "animate" : "initial"}
              >
                <Handshake className="w-4 h-4 text-coomunity-500" />
              </motion.div>
              <span className="text-coomunity-600 font-medium">
                +{post.engagement.reciprocidadPoints} Reciprocidad
              </span>
            </Box>
          </Box>
        </Box>

        {/* 🎬 Action Buttons */}
        <Box className="px-6 py-4 border-t border-gray-100">
          <Box className="flex items-center justify-between gap-2">
            <Box className="flex items-center gap-2">
              {/* Like Button */}
              <CoomunityButton
                variant={post.interactions.isLiked ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onLike?.(post.id)}
                className={cn(
                  'gap-2',
                  post.interactions.isLiked && 'text-error-500',
                  animations.hoverScale
                )}
              >
                <motion.div
                  animate={post.interactions.isLiked ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {post.interactions.isLiked ? (
                    <Favorite className="w-4 h-4" />
                  ) : (
                    <FavoriteBorder className="w-4 h-4" />
                  )}
                </motion.div>
                Me gusta
              </CoomunityButton>

              {/* Comment Button */}
              <CoomunityButton
                variant="ghost"
                size="sm"
                onClick={() => onComment?.(post.id)}
                className="gap-2"
              >
                <ChatBubbleOutline className="w-4 h-4" />
                Comentar
              </CoomunityButton>

              {/* Share Button */}
              <CoomunityButton
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(post.id)}
                className="gap-2"
              >
                <Share className="w-4 h-4" />
                Compartir
              </CoomunityButton>
            </Box>

            <Box className="flex items-center gap-2">
              {/* Give Reciprocidad Button */}
              <Tooltip title="Dar Reciprocidad (Reciprocidad)">
                <CoomunityButton
                  variant="outline"
                  size="sm"
                  onClick={handleReciprocidadGive}
                  className={cn(
                    'gap-2 border-coomunity-300',
                    showReciprocidadFlow && 'bg-coomunity-50',
                    animations.hoverScale
                  )}
                >
                  <motion.div
                    animate={showReciprocidadFlow ? { rotate: 360 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Handshake className="w-4 h-4" />
                  </motion.div>
                  Reciprocidad
                </CoomunityButton>
              </Tooltip>

              {/* Collaborate Button */}
              {post.content.type === 'collaboration' && (
                <CoomunityButton
                  variant="primary"
                  size="sm"
                  onClick={() => onCollaborate?.(post.id)}
                  className="gap-2"
                >
                  <GroupWork className="w-4 h-4" />
                  Colaborar
                </CoomunityButton>
              )}
            </Box>
          </Box>
        </Box>

        {/* ✨ Hover Glow Effect */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-lg',
            'bg-gradient-to-r from-coomunity-500/5 to-success-500/5',
            'opacity-0 pointer-events-none',
            'transition-opacity duration-300'
          )}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      </CoomunityCard>
    </motion.div>
  );
};

export default EnhancedSocialFeed; 