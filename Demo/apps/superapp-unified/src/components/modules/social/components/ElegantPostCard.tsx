import React from 'react';
import { Box, Typography, Avatar, IconButton, Paper, Chip } from '@mui/material';
import { MoreHoriz, FavoriteBorder, ChatBubbleOutline, Share } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    merit: string;
  };
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
}

interface ElegantPostCardProps {
  post: Post;
}

const ElegantPostCard: React.FC<ElegantPostCardProps> = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: '16px',
          background: '#ffffff',
          borderColor: '#e2e8f0',
          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.03)',
          transition: 'box-shadow 0.3s, border-color 0.3s',
          '&:hover': {
            boxShadow: '0 10px 20px 0 rgba(0,0,0,0.05)',
            borderColor: '#cbd5e1',
          },
        }}
      >
        {/* Card Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={post.author.avatar} sx={{ width: 48, height: 48, mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{post.author.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {post.timestamp}
              </Typography>
              <Chip label={post.author.merit} size="small" variant="outlined" sx={{ borderColor: '#818cf8', color: '#6366f1' }} />
            </Box>
          </Box>
          <IconButton>
            <MoreHoriz sx={{ color: '#94a3b8' }} />
          </IconButton>
        </Box>

        {/* Card Content */}
        <Typography sx={{ color: '#334155', mb: 3, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>

        {/* Card Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderTop: '1px solid #f1f5f9', pt: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b', '&:hover': { color: '#ef4444' } }}>
            <IconButton color="inherit">
              <FavoriteBorder />
            </IconButton>
            <Typography variant="body2">{post.likes}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b', '&:hover': { color: '#3b82f6' } }}>
            <IconButton color="inherit">
              <ChatBubbleOutline />
            </IconButton>
            <Typography variant="body2">{post.comments}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b', '&:hover': { color: '#10b981' } }}>
            <IconButton color="inherit">
              <Share />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ElegantPostCard;
