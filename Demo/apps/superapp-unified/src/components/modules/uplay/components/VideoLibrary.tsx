import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  Paper,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Comment as CommentIcon,
  PlaylistAdd as PlaylistAddIcon,
  Bolt as BoltIcon,
  Diamond as DiamondIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

interface RealVideoData {
  id: number;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  url: string;
  platform: string;
  externalId: string;
  categories: string;
  tags: string;
  questions: any[];
  playlist: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
}

interface VideoLibraryProps {
  videos: RealVideoData[];
  currentVideo?: RealVideoData | null;
  onVideoSelect: (video: RealVideoData) => void;
  isLoading?: boolean;
}

interface FilterState {
  searchTerm: string;
  category: string;
  platform: string;
  difficulty: string;
  duration: string;
  hasQuestions: boolean;
  sortBy: 'title' | 'duration' | 'questions' | 'recent';
  sortOrder: 'asc' | 'desc';
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({
  videos,
  currentVideo,
  onVideoSelect,
  isLoading = false,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: '',
    platform: '',
    difficulty: '',
    duration: '',
    hasQuestions: false,
    sortBy: 'title',
    sortOrder: 'asc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  // Extract unique categories and platforms
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    videos.forEach((video) => {
      if (video.categories) {
        try {
          const cats = JSON.parse(video.categories);
          cats.forEach((cat: string) => categorySet.add(cat));
        } catch (e) {
          // Handle parsing errors
        }
      }
    });
    return Array.from(categorySet);
  }, [videos]);

  const platforms = useMemo(() => {
    const platformSet = new Set<string>();
    videos.forEach((video) => {
      if (video.platform) {
        platformSet.add(video.platform);
      }
    });
    return Array.from(platformSet);
  }, [videos]);

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let filtered = videos.filter((video) => {
      // Search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (
          !video.title.toLowerCase().includes(searchLower) &&
          !video.description.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Category filter
      if (filters.category) {
        try {
          const categories = JSON.parse(video.categories || '[]');
          if (!categories.includes(filters.category)) {
            return false;
          }
        } catch (e) {
          return false;
        }
      }

      // Platform filter
      if (filters.platform && video.platform !== filters.platform) {
        return false;
      }

      // Duration filter
      if (filters.duration) {
        const duration = video.duration || 0;
        switch (filters.duration) {
          case 'short':
            if (duration > 300) return false; // > 5 min
            break;
          case 'medium':
            if (duration <= 300 || duration > 1200) return false; // 5-20 min
            break;
          case 'long':
            if (duration <= 1200) return false; // > 20 min
            break;
        }
      }

      // Questions filter
      if (filters.hasQuestions && video.questions.length === 0) {
        return false;
      }

      return true;
    });

    // Sort videos
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'duration':
          comparison = (a.duration || 0) - (b.duration || 0);
          break;
        case 'questions':
          comparison = a.questions.length - b.questions.length;
          break;
        case 'recent':
          // For demo purposes, use video ID as a proxy for recency
          comparison = b.id - a.id;
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [videos, filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      platform: '',
      difficulty: '',
      duration: '',
      hasQuestions: false,
      sortBy: 'title',
      sortOrder: 'asc',
    });
  };

  const getDurationText = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyFromQuestions = (questionCount: number) => {
    if (questionCount === 0) return { label: 'Básico', color: '#10b981' };
    if (questionCount <= 3) return { label: 'Intermedio', color: '#f59e0b' };
    if (questionCount <= 6) return { label: 'Avanzado', color: '#ef4444' };
    return { label: 'Experto', color: '#8b5cf6' };
  };

  const calculatePotentialRewards = (video: RealVideoData) => {
    const baseMerits = 15;
    const questionBonus = video.questions.length * 5;
    const durationBonus = Math.floor((video.duration || 0) / 300) * 2; // 2 per 5 min
    return {
      merits: baseMerits + questionBonus + durationBonus,
      ondas: video.questions.length * 3,
    };
  };

  const EnhancedVideoCard = ({ video }: { video: RealVideoData }) => {
    const categories = video.categories ? JSON.parse(video.categories) : [];
    const tags = video.tags ? JSON.parse(video.tags) : [];
    const difficulty = getDifficultyFromQuestions(video.questions.length);
    const rewards = calculatePotentialRewards(video);
    const isCurrentVideo = currentVideo?.id === video.id;

    return (
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 3,
          overflow: 'hidden',
          border: isCurrentVideo ? '2px solid #6366f1' : '1px solid #e2e8f0',
          background: isCurrentVideo
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
            : 'white',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
            border: '2px solid #6366f1',
          },
        }}
        onClick={() => onVideoSelect(video)}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Video Thumbnail/Avatar */}
            <Grid size={{ xs: 12, sm: 2 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 80, sm: 64 },
                    height: { xs: 80, sm: 64 },
                    background: isCurrentVideo
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                  }}
                >
                  🎬
                </Avatar>
                {video.questions.length > 0 && (
                  <Badge
                    badgeContent={video.questions.length}
                    color="warning"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      },
                    }}
                  />
                )}
              </Box>
            </Grid>

            {/* Video Information */}
            <Grid size={{ xs: 12, sm: 7 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: isCurrentVideo ? '#6366f1' : '#1e293b',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {video.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {video.description}
              </Typography>

              {/* Tags and Categories */}
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ gap: 0.5, mb: 2 }}
              >
                <Chip
                  label={video.platform}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={difficulty.label}
                  size="small"
                  sx={{
                    bgcolor: `${difficulty.color}20`,
                    color: difficulty.color,
                    border: `1px solid ${difficulty.color}40`,
                    fontWeight: 600,
                  }}
                />
                {categories.slice(0, 2).map((cat: string, index: number) => (
                  <Chip
                    key={index}
                    label={cat}
                    size="small"
                    variant="outlined"
                    sx={{ maxWidth: 120 }}
                  />
                ))}
              </Stack>

              {/* Playlist Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 20, height: 20, fontSize: '0.7rem' }}>
                  {video.playlist.name.charAt(0)}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: '#64748b' }}
                >
                  {video.playlist.name}
                </Typography>
              </Box>
            </Grid>

            {/* Metrics and Actions */}
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                {/* Duration and Questions */}
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  {getDurationText(video.duration || 0)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 2 }}
                >
                  {video.questions.length > 0
                    ? `${video.questions.length} preguntas`
                    : 'Sin preguntas'}
                </Typography>

                {/* Potential Rewards */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    icon={<DiamondIcon />}
                    label={`+${rewards.merits} Mëritos`}
                    size="small"
                    sx={{
                      bgcolor: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#f59e0b' },
                    }}
                  />
                  <Chip
                    icon={<BoltIcon />}
                    label={`+${rewards.ondas} Öndas`}
                    size="small"
                    sx={{
                      bgcolor: '#dcfce7',
                      color: '#166534',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#10b981' },
                    }}
                  />
                </Stack>

                {/* Action Buttons */}
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                >
                  <Tooltip title="Guardar en favoritos">
                    <IconButton size="small" sx={{ color: '#64748b' }}>
                      <BookmarkIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Agregar a playlist">
                    <IconButton size="small" sx={{ color: '#64748b' }}>
                      <PlaylistAddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Compartir">
                    <IconButton size="small" sx={{ color: '#64748b' }}>
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Buscar videos por título o descripción..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Filter Controls */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <Button
              startIcon={<FilterIcon />}
              endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowFilters(!showFilters)}
              variant="outlined"
              size="small"
            >
              Filtros
            </Button>

            <Button
              startIcon={<SortIcon />}
              onClick={(e) => setSortAnchorEl(e.currentTarget)}
              variant="outlined"
              size="small"
            >
              Ordenar: {filters.sortBy}
            </Button>

            {(filters.category ||
              filters.platform ||
              filters.duration ||
              filters.hasQuestions) && (
              <Button onClick={clearFilters} size="small" color="error">
                Limpiar filtros
              </Button>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 'auto' }}
            >
              {filteredVideos.length} de {videos.length} videos
            </Typography>
          </Stack>

          {/* Advanced Filters */}
          <Collapse in={showFilters}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange('category', e.target.value)
                    }
                    label="Categoría"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Plataforma</InputLabel>
                  <Select
                    value={filters.platform}
                    onChange={(e) =>
                      handleFilterChange('platform', e.target.value)
                    }
                    label="Plataforma"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {platforms.map((platform) => (
                      <MenuItem key={platform} value={platform}>
                        {platform}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Duración</InputLabel>
                  <Select
                    value={filters.duration}
                    onChange={(e) =>
                      handleFilterChange('duration', e.target.value)
                    }
                    label="Duración"
                  >
                    <MenuItem value="">Cualquiera</MenuItem>
                    <MenuItem value="short">Corto (&lt; 5 min)</MenuItem>
                    <MenuItem value="medium">Medio (5-20 min)</MenuItem>
                    <MenuItem value="long">Largo (&gt; 20 min)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.hasQuestions}
                      onChange={(e) =>
                        handleFilterChange('hasQuestions', e.target.checked)
                      }
                    />
                  }
                  label="Solo con preguntas"
                />
              </Grid>
            </Grid>
          </Collapse>
        </Stack>
      </Paper>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
      >
        {[
          { value: 'title', label: 'Título' },
          { value: 'duration', label: 'Duración' },
          { value: 'questions', label: 'Cantidad de preguntas' },
          { value: 'recent', label: 'Más recientes' },
        ].map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              handleFilterChange('sortBy', option.value as any);
              setSortAnchorEl(null);
            }}
            selected={filters.sortBy === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Videos List */}
      <Box>
        {isLoading ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 4 }}
          >
            Cargando videos...
          </Typography>
        ) : filteredVideos.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No se encontraron videos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </Paper>
        ) : (
          filteredVideos.map((video) => (
            <EnhancedVideoCard key={video.id} video={video} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default VideoLibrary;
