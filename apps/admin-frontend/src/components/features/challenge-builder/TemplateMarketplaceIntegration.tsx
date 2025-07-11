/**
 * 🎮 Template Marketplace Integration - Challenge Builder Bridge
 * 
 * 🎯 INTENT: Conectar Template Marketplace con Challenge Builder usando patrones NEWVISUAL
 * 🌟 VALUES: Reciprocidad (templates compartidos), Bien Común (facilitar creación)
 * ⚡ CONSTRAINTS: Patrones NEWVISUAL, Material UI, drag-and-drop seamless
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Rating,
  LinearProgress,
  Divider,
  Paper,
  Badge,
} from '@mui/material';
import {
  Extension as TemplateIcon,
  Add as AddIcon,
  GetApp as UseTemplateIcon,
  Visibility as PreviewIcon,
  Share as ShareIcon,
  ForkRight as RemixIcon,
  Favorite as FavoriteIcon,
  Group as CollabIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Types
import {
  ChallengeTemplate,
  TemplateSearchFilters,
  TEMPLATE_CATEGORIES,
} from '../../../types/template-marketplace.types';

interface TemplateMarketplaceIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ChallengeTemplate) => void;
  onTemplateUse: (template: ChallengeTemplate) => void;
  currentChallengeContext?: string;
}

const TemplateMarketplaceIntegration: React.FC<TemplateMarketplaceIntegrationProps> = ({
  isOpen,
  onClose,
  onTemplateSelect,
  onTemplateUse,
  currentChallengeContext
}) => {
  // State
  const [templates, setTemplates] = useState<ChallengeTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ChallengeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ChallengeTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TemplateSearchFilters>({
    sortBy: 'collaborative',
    sortOrder: 'desc'
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Mock templates with NEWVISUAL styling patterns
  const mockTemplates: ChallengeTemplate[] = [
    {
      id: 'template-ayni-circle',
      title: 'Círculo de Ayni - Reciprocidad Comunitaria',
      description: 'Template colaborativo inspirado en filosofía andina para crear intercambios equilibrados',
      longDescription: 'Basado en el concepto andino del Ayni, este template crea un sistema de reciprocidad donde cada participante da y recibe de manera equilibrada, fortaleciendo los lazos comunitarios.',
      challengeFlow: {
        id: 'flow-ayni',
        name: 'Ayni Circle Flow',
        description: 'Flujo de reciprocidad comunitaria',
        startElementId: 'start-ayni',
        elements: [],
        connections: [],
        settings: {
          allowParallelPaths: true,
          requireCompletion: false,
          timeLimit: undefined
        }
      },
      elements: [],
      octalysisProfile: [],
      category: TEMPLATE_CATEGORIES[0], // Colaborativo
      tags: ['reciprocidad', 'ayni', 'comunidad', 'colaboración'],
      difficulty: 'intermediate',
      estimatedDuration: '2-4 semanas',
      targetAudience: ['Comunidades', 'Equipos', 'Organizaciones'],
      creator: {
        id: 'creator-amaru',
        name: 'Amaru Condori',
        avatar: 'https://i.pravatar.cc/150?img=1',
        reputation: 94,
        trustLevel: 98,
        contributionScore: 85,
        specialties: ['Filosofía Andina', 'Gamificación Colaborativa'],
        socialProof: {
          templatesShared: 12,
          templatesRemixed: 8,
          communityHelp: 156,
          collaborations: 23
        }
      },
      collaborators: [],
      isPublic: true,
      analytics: {
        views: 1847,
        downloads: 456,
        uses: 189,
        favorites: 334,
        remixes: 23,
        shares: 167,
        rating: 4.9,
        reviewCount: 78,
        completionRate: 92,
        teamUsage: 156,
        groupCollaborations: 89,
        knowledgeTransfer: 94
      },
      community: {
        comments: [],
        reviews: [],
        contributors: [],
        sharingScore: 96,
        collaborationIndex: 94,
        reciprocityRating: 98,
        helpfulnessVotes: 267,
        reportCount: 0,
        moderationFlags: []
      },
      version: '2.1.0',
      remixChain: [],
      pricing: {
        isFree: true,
        revenueSharing: {
          creator: 70,
          community: 20,
          platform: 10
        },
        reciprocityBenefit: 8,
        communityBonus: 15,
        sharingIncentive: 12
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      lastUsedAt: '2024-01-25T09:15:00Z',
      status: 'featured',
      philosophyAlignment: {
        reciprocidad: 98,
        bienComun: 94,
        negentropia: 87,
        cooperacion: 96,
        metanoia: 82,
        overallAlignment: 91,
        positiveImpacts: [
          'Fomenta intercambios equilibrados',
          'Fortalece lazos comunitarios',
          'Promueve confianza mutua'
        ],
        areasForImprovement: [
          'Podría incluir más elementos de transformación personal'
        ],
        philosophicalNotes: 'Excelente aplicación del concepto andino de Ayni en contexto gamificado'
      }
    },
    {
      id: 'template-minga-learning',
      title: 'Minga Digital - Aprendizaje Colaborativo',
      description: 'Template educativo que convierte el aprendizaje individual en experiencia comunitaria',
      longDescription: 'Inspirado en la tradición andina de la Minga, transforma cursos individuales en experiencias donde el aprendizaje personal contribuye al conocimiento colectivo.',
      challengeFlow: {
        id: 'flow-minga',
        name: 'Minga Learning Flow',
        description: 'Flujo de aprendizaje colaborativo',
        startElementId: 'start-minga',
        elements: [],
        connections: [],
        settings: {
          allowParallelPaths: true,
          requireCompletion: true,
          timeLimit: undefined
        }
      },
      elements: [],
      octalysisProfile: [],
      category: TEMPLATE_CATEGORIES[1], // Educativo
      tags: ['educación', 'minga', 'aprendizaje', 'colaborativo'],
      difficulty: 'beginner',
      estimatedDuration: '1-3 semanas',
      targetAudience: ['Estudiantes', 'Educadores', 'Equipos de aprendizaje'],
      creator: {
        id: 'creator-inti',
        name: 'Inti Raymi',
        avatar: 'https://i.pravatar.cc/150?img=2',
        reputation: 87,
        trustLevel: 93,
        contributionScore: 76,
        specialties: ['Pedagogía Colaborativa', 'Gamificación Educativa'],
        socialProof: {
          templatesShared: 8,
          templatesRemixed: 15,
          communityHelp: 98,
          collaborations: 31
        }
      },
      collaborators: [],
      isPublic: true,
      analytics: {
        views: 1234,
        downloads: 298,
        uses: 245,
        favorites: 189,
        remixes: 19,
        shares: 78,
        rating: 4.7,
        reviewCount: 56,
        completionRate: 88,
        teamUsage: 167,
        groupCollaborations: 89,
        knowledgeTransfer: 91
      },
      community: {
        comments: [],
        reviews: [],
        contributors: [],
        sharingScore: 89,
        collaborationIndex: 93,
        reciprocityRating: 86,
        helpfulnessVotes: 198,
        reportCount: 0,
        moderationFlags: []
      },
      version: '1.8.3',
      remixChain: [],
      pricing: {
        isFree: true,
        revenueSharing: {
          creator: 70,
          community: 20,
          platform: 10
        },
        reciprocityBenefit: 6,
        communityBonus: 12,
        sharingIncentive: 9
      },
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      lastUsedAt: '2024-01-24T14:22:00Z',
      status: 'published',
      philosophyAlignment: {
        reciprocidad: 86,
        bienComun: 95,
        negentropia: 91,
        cooperacion: 94,
        metanoia: 78,
        overallAlignment: 89,
        positiveImpacts: [
          'Democratiza acceso al conocimiento',
          'Fortalece aprendizaje colaborativo',
          'Reduce brecha educativa'
        ],
        areasForImprovement: [
          'Podría incluir más elementos de reciprocidad directa'
        ],
        philosophicalNotes: 'Excelente adaptación del concepto de Minga al aprendizaje digital'
      }
    }
  ];

  // Effects
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFilters();
  }, [templates, searchQuery, filters]);

  // Handlers
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...templates];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filters.categories?.length) {
      filtered = filtered.filter(template =>
        filters.categories!.includes(template.category.id)
      );
    }

    // Pricing filter
    if (filters.pricing) {
      if (filters.pricing === 'free') {
        filtered = filtered.filter(template => template.pricing.isFree);
      } else if (filters.pricing === 'premium') {
        filtered = filtered.filter(template => !template.pricing.isFree);
      }
    }

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: number, bValue: number;
        
        switch (filters.sortBy) {
          case 'collaborative':
            aValue = a.community.collaborationIndex;
            bValue = b.community.collaborationIndex;
            break;
          case 'reciprocity':
            aValue = a.community.reciprocityRating;
            bValue = b.community.reciprocityRating;
            break;
          case 'rating':
            aValue = a.analytics.rating;
            bValue = b.analytics.rating;
            break;
          case 'popular':
            aValue = a.analytics.uses;
            bValue = b.analytics.uses;
            break;
          default:
            aValue = new Date(a.updatedAt).getTime();
            bValue = new Date(b.updatedAt).getTime();
        }

        return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      });
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplatePreview = (template: ChallengeTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleTemplateUse = (template: ChallengeTemplate) => {
    onTemplateUse(template);
    onClose();
  };

  const getPhilosophyColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 75) return '#FF9800';
    if (score >= 60) return '#FFC107';
    return '#f44336';
  };

  return (
    <>
      {/* Main Integration Dialog */}
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '80vh',
            borderRadius: 2,
            fontFamily: 'Inter, sans-serif'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600
          }}
        >
          <TemplateIcon color="primary" fontSize="large" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h2" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Template Marketplace
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Kollektif, sans-serif' }}>
              🌟 Sharing vs Hoarding • Valores CoomÜnity
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Search and Filters */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar templates por nombre, descripción o tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={filters.categories?.[0] || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      categories: e.target.value ? [e.target.value as string] : undefined
                    }))}
                    label="Categoría"
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {TEMPLATE_CATEGORIES.map(cat => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Precio</InputLabel>
                  <Select
                    value={filters.pricing || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      pricing: e.target.value as any
                    }))}
                    label="Precio"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="free">🎁 Gratuitos</MenuItem>
                    <MenuItem value="premium">💎 Premium</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Ordenar</InputLabel>
                  <Select
                    value={filters.sortBy || 'collaborative'}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      sortBy: e.target.value as any
                    }))}
                    label="Ordenar"
                  >
                    <MenuItem value="collaborative">🤝 Colaboración</MenuItem>
                    <MenuItem value="reciprocity">🔄 Reciprocidad</MenuItem>
                    <MenuItem value="rating">⭐ Rating</MenuItem>
                    <MenuItem value="popular">🔥 Populares</MenuItem>
                    <MenuItem value="recent">🕒 Recientes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Templates Grid */}
          <Grid container spacing={3}>
            {isLoading ? (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <Typography>Cargando templates...</Typography>
                </Box>
              </Grid>
            ) : (
              filteredTemplates.map((template) => (
                <Grid item xs={12} md={6} lg={4} key={template.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      border: template.status === 'featured' ? '2px solid' : '1px solid',
                      borderColor: template.status === 'featured' ? 'primary.main' : 'divider',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    {/* Template Header */}
                    <Box sx={{ p: 2, pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 600,
                            flexGrow: 1,
                            mr: 1
                          }}
                        >
                          {template.title}
                        </Typography>
                        {template.status === 'featured' && (
                          <Chip 
                            size="small" 
                            label="Destacado" 
                            color="primary" 
                            icon={<StarIcon />}
                          />
                        )}
                      </Box>

                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2, 
                          height: '40px', 
                          overflow: 'hidden',
                          fontFamily: 'Kollektif, sans-serif'
                        }}
                      >
                        {template.description}
                      </Typography>

                      {/* Creator Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={template.creator.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {template.creator.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Méritos: {template.creator.reputation}
                            </Typography>
                            <Typography variant="caption" color="success.main">
                              • Contrib: {template.creator.contributionScore}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Philosophy Alignment Bar */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" fontWeight="medium">
                            Filosofía CoomÜnity
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: getPhilosophyColor(template.philosophyAlignment.overallAlignment),
                              fontWeight: 'bold'
                            }}
                          >
                            {template.philosophyAlignment.overallAlignment}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={template.philosophyAlignment.overallAlignment} 
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getPhilosophyColor(template.philosophyAlignment.overallAlignment)
                            }
                          }}
                        />
                      </Box>

                      {/* Tags and Metrics */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          size="small" 
                          label={template.pricing.isFree ? '🎁 Gratuito' : `${template.pricing.price} Ünits`}
                          color={template.pricing.isFree ? 'success' : 'primary'}
                          variant="outlined"
                        />
                        <Chip 
                          size="small" 
                          label={template.difficulty} 
                          variant="outlined"
                        />
                      </Box>

                      {/* Analytics */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                          👁️ {template.analytics.views} • ❤️ {template.analytics.favorites} • 🔄 {template.analytics.remixes}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating 
                            value={template.analytics.rating} 
                            readOnly 
                            size="small" 
                            precision={0.1}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({template.analytics.reviewCount})
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0, mt: 'auto' }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Vista previa">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleTemplatePreview(template)}
                          >
                            <PreviewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Compartir">
                          <IconButton size="small" color="success">
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remix">
                          <IconButton size="small" color="info">
                            <RemixIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<UseTemplateIcon />}
                        onClick={() => handleTemplateUse(template)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #5C2483 30%, #3E8638 90%)'
                        }}
                      >
                        Usar Template
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              📚 {filteredTemplates.length} templates • 🤝 {filteredTemplates.filter(t => t.community.collaborationIndex >= 80).length} colaborativos
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={onClose}>
                Cerrar
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => {
                  // TODO: Open template creation flow
                  console.log('Create new template');
                }}
              >
                Crear Template
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TemplateIcon color="primary" />
          Vista Previa del Template
          <Box sx={{ ml: 'auto' }}>
            <IconButton onClick={() => setIsPreviewOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {selectedTemplate.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {selectedTemplate.longDescription}
              </Typography>

              {/* Creator & Philosophy */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>👤 Creador</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={selectedTemplate.creator.avatar} sx={{ width: 48, height: 48 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {selectedTemplate.creator.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Méritos: {selectedTemplate.creator.reputation} • Contribución: {selectedTemplate.creator.contributionScore}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>🌟 Filosofía CoomÜnity</Typography>
                    <Typography variant="h4" sx={{ color: getPhilosophyColor(selectedTemplate.philosophyAlignment.overallAlignment) }}>
                      {selectedTemplate.philosophyAlignment.overallAlignment}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Alineación con valores fundamentales
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPreviewOpen(false)}>
            Cerrar
          </Button>
          {selectedTemplate && (
            <Button 
              variant="contained" 
              startIcon={<UseTemplateIcon />}
              onClick={() => {
                handleTemplateUse(selectedTemplate);
                setIsPreviewOpen(false);
              }}
            >
              Usar Template
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TemplateMarketplaceIntegration;