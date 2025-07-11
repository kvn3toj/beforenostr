/**
 * 🎮 Template Marketplace Manager - CoomÜnity Cosmic Brain
 * 
 * 🎯 INTENT: Crear marketplace de templates que transforma sharing vs hoarding
 * 🌟 VALUES: Reciprocidad, Bien Común, Neguentropía, Cooperar > Competir
 * ⚡ CONSTRAINTS: React 18+, MUI v7, TypeScript, integración con Challenge Builder
 * 
 * Marketplace de templates gamificados con filosofía colaborativa
 * Fomenta el intercambio de conocimiento y la co-creación comunitaria
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
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  Avatar,
  Rating,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Extension as TemplateIcon,
  Analytics as AnalyticsIcon,
  Palette as PaletteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  MonetizationOn as UnitsIcon,
  Share as ShareIcon,
  Fork as ForkIcon,
  Favorite as FavoriteIcon,
  Group as CollabIcon,
  School as LearnIcon,
  Public as CommunityIcon,
  Eco as WellnessIcon,
  Brush as CreativityIcon,
  Download as DownloadIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// Types
import {
  ChallengeTemplate,
  TemplateCategory,
  TemplateCreator,
  TemplateSearchFilters,
  PhilosophyAlignment,
  TEMPLATE_CATEGORIES,
} from '../../types/template-marketplace.types';

// Template Marketplace Types (imported from types file)

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`marketplace-tabpanel-${index}`}
      aria-labelledby={`marketplace-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TemplateMarketplaceManager: React.FC = () => {
  // State
  const [templates, setTemplates] = useState<ChallengeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ChallengeTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState<TemplateSearchFilters>({
    sortBy: 'collaborative',
    sortOrder: 'desc'
  });

  // Dialog states
  const [isModerationDialogOpen, setIsModerationDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');

  // Mock data para desarrollo - Challenge Templates
  const mockTemplates: ChallengeTemplate[] = [
    {
      id: 'template-1',
      title: 'Círculo de Ayni - Reciprocidad Comunitaria',
      description: 'Template colaborativo que fomenta intercambios de valor mutuo en comunidades',
      longDescription: 'Desafío basado en la filosofía andina del Ayni, diseñado para crear círculos de reciprocidad donde cada participante da y recibe de manera equilibrada.',
      challengeFlow: {
        id: 'flow-1',
        name: 'Ayni Circle Flow',
        description: 'Flujo de reciprocidad comunitaria',
        startElementId: 'start-1',
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
        id: 'creator-1',
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
        views: 847,
        downloads: 156,
        uses: 89,
        favorites: 234,
        remixes: 12,
        shares: 67,
        rating: 4.8,
        reviewCount: 43,
        completionRate: 87,
        teamUsage: 67,
        groupCollaborations: 34,
        knowledgeTransfer: 78
      },
      community: {
        comments: [],
        reviews: [],
        contributors: [],
        sharingScore: 92,
        collaborationIndex: 88,
        reciprocityRating: 95,
        helpfulnessVotes: 189,
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
        reciprocityBenefit: 5,
        communityBonus: 15,
        sharingIncentive: 10
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      lastUsedAt: '2024-01-25T09:15:00Z',
      status: 'featured',
      philosophyAlignment: {
        reciprocidad: 98,
        bienComun: 92,
        negentropia: 85,
        cooperacion: 94,
        metanoia: 78,
        overallAlignment: 89,
        positiveImpacts: [
          'Fomenta intercambios equilibrados',
          'Fortalece lazos comunitarios',
          'Reduce desigualdades'
        ],
        areasForImprovement: [
          'Podría incluir más elementos de transformación personal'
        ],
        philosophicalNotes: 'Excelente aplicación del concepto andino de Ayni en contexto gamificado'
      }
    },
    {
      id: 'template-2', 
      title: 'Aprendizaje Colaborativo - Minga Digital',
      description: 'Template educativo que convierte el aprendizaje individual en experiencia comunitaria',
      longDescription: 'Inspirado en la tradición andina de la Minga, este template transforma cursos y programas educativos en experiencias colaborativas donde el aprendizaje individual contribuye al conocimiento colectivo.',
      challengeFlow: {
        id: 'flow-2',
        name: 'Minga Learning Flow',
        description: 'Flujo de aprendizaje colaborativo',
        startElementId: 'start-2',
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
        id: 'creator-2',
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
        views: 623,
        downloads: 234,
        uses: 167,
        favorites: 189,
        remixes: 19,
        shares: 45,
        rating: 4.6,
        reviewCount: 67,
        completionRate: 92,
        teamUsage: 89,
        groupCollaborations: 56,
        knowledgeTransfer: 94
      },
      community: {
        comments: [],
        reviews: [],
        contributors: [],
        sharingScore: 86,
        collaborationIndex: 91,
        reciprocityRating: 88,
        helpfulnessVotes: 234,
        reportCount: 0,
        moderationFlags: []
      },
      version: '1.5.2',
      remixChain: [],
      pricing: {
        isFree: true,
        revenueSharing: {
          creator: 70,
          community: 20,
          platform: 10
        },
        reciprocityBenefit: 8,
        communityBonus: 12,
        sharingIncentive: 7
      },
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      lastUsedAt: '2024-01-24T14:22:00Z',
      status: 'published',
      philosophyAlignment: {
        reciprocidad: 85,
        bienComun: 96,
        negentropia: 89,
        cooperacion: 92,
        metanoia: 84,
        overallAlignment: 89,
        positiveImpacts: [
          'Democratiza el acceso al conocimiento',
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
    loadTemplates();
  }, []);

  // Handlers
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 800));
      setTemplates(mockTemplates);
    } catch (err) {
      setError('Error cargando templates del marketplace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerationAction = async (templateId: string, action: 'approve' | 'reject', notes?: string) => {
    setIsLoading(true);
    try {
      // TODO: Llamada real al backend
      setTemplates(prev => prev.map(template => 
        template.id === templateId 
          ? { 
              ...template, 
              status: action === 'approve' ? 'published' : 'archived', 
              moderationNotes: notes 
            }
          : template
      ));
      setIsModerationDialogOpen(false);
      setSelectedTemplate(null);
      setModerationNotes('');
    } catch (err) {
      setError(`Error ${action === 'approve' ? 'aprobando' : 'rechazando'} el template`);
    } finally {
      setIsLoading(false);
    }
  };

  const openModerationDialog = (template: ChallengeTemplate, action: 'approve' | 'reject') => {
    setSelectedTemplate(template);
    setModerationAction(action);
    setModerationNotes(template.moderationNotes || '');
    setIsModerationDialogOpen(true);
  };

  const openPreviewDialog = (template: ChallengeTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleTemplateAction = async (templateId: string, action: 'use' | 'favorite' | 'share' | 'remix') => {
    // TODO: Implementar acciones de template
    console.log(`Action ${action} on template ${templateId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'published': return 'success';
      case 'featured': return 'primary';
      case 'archived': return 'error';
      case 'reported': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'published': return 'Publicado';
      case 'featured': return 'Destacado';
      case 'archived': return 'Archivado';
      case 'reported': return 'Reportado';
      default: return status;
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'collaborative': return <CollabIcon />;
      case 'educational': return <LearnIcon />;
      case 'community': return <CommunityIcon />;
      case 'wellness': return <WellnessIcon />;
      case 'creativity': return <CreativityIcon />;
      default: return <TemplateIcon />;
    }
  };

  const getPhilosophyColor = (score: number) => {
    if (score >= 90) return '#4CAF50'; // Verde - Excelente alineación
    if (score >= 75) return '#FF9800'; // Naranja - Buena alineación
    if (score >= 60) return '#FFC107'; // Amarillo - Alineación moderada
    return '#f44336'; // Rojo - Baja alineación
  };

  const filteredTemplates = filters.pricing 
    ? templates.filter(template => {
        if (filters.pricing === 'free') return template.pricing.isFree;
        if (filters.pricing === 'premium') return !template.pricing.isFree;
        return true;
      })
    : templates;

  const draftCount = templates.filter(template => template.status === 'draft').length;
  const featuredCount = templates.filter(template => template.status === 'featured').length;
  const collaborativeCount = templates.filter(template => 
    template.philosophyAlignment.cooperacion >= 80
  ).length;

  // Render
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TemplateIcon fontSize="large" color="primary" />
            Template Marketplace
            {featuredCount > 0 && (
              <Badge badgeContent={featuredCount} color="primary" sx={{ ml: 1 }}>
                <StarIcon color="primary" />
              </Badge>
            )}
            {collaborativeCount > 0 && (
              <Badge badgeContent={collaborativeCount} color="success" sx={{ ml: 1 }}>
                <CollabIcon color="success" />
              </Badge>
            )}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            🌟 Marketplace colaborativo que fomenta sharing vs hoarding • Valores CoomÜnity
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Chip 
              size="small" 
              icon={<ShareIcon />} 
              label={`${templates.filter(t => t.isPublic).length} Públicos`} 
              color="success" 
              variant="outlined"
            />
            <Chip 
              size="small" 
              icon={<CollabIcon />} 
              label={`${collaborativeCount} Colaborativos`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              size="small" 
              icon={<UnitsIcon />} 
              label={`${templates.filter(t => t.pricing.isFree).length} Gratuitos`} 
              color="info" 
              variant="outlined"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            size="small"
          >
            Importar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Crear Template
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Templates
                {draftCount > 0 && <Badge badgeContent={draftCount} color="info" />}
              </Box>
            } 
            icon={<PaletteIcon />} 
          />
          <Tab 
            label="Filosofía & Métricas" 
            icon={<AnalyticsIcon />} 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Comunidad
                {collaborativeCount > 0 && <Badge badgeContent={collaborativeCount} color="success" />}
              </Box>
            }
            icon={<CollabIcon />} 
          />
        </Tabs>
      </Box>

      {/* Templates Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Filter Controls */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Precio</InputLabel>
            <Select
              value={filters.pricing || 'all'}
              label="Precio"
              onChange={(e) => setFilters(prev => ({ ...prev, pricing: e.target.value === 'all' ? undefined : e.target.value as any }))}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="free">🎁 Gratuitos</MenuItem>
              <MenuItem value="premium">💎 Premium</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={filters.sortBy || 'collaborative'}
              label="Ordenar por"
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            >
              <MenuItem value="collaborative">🤝 Colaboración</MenuItem>
              <MenuItem value="reciprocity">🔄 Reciprocidad</MenuItem>
              <MenuItem value="rating">⭐ Rating</MenuItem>
              <MenuItem value="recent">🕒 Recientes</MenuItem>
              <MenuItem value="popular">🔥 Populares</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            📚 {filteredTemplates.length} templates • 🌟 {featuredCount} destacados • 🤝 {collaborativeCount} colaborativos
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: template.status === 'featured' ? '2px solid' : '1px solid',
                    borderColor: template.status === 'featured' ? 'primary.main' : 'divider',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  {/* Template Preview Image */}
                  <Box sx={{ position: 'relative', height: 200, bgcolor: 'grey.100' }}>
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1
                      }}
                    >
                      {getCategoryIcon(template.category.id)}
                    </Box>
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1
                      }}
                    >
                      <Chip 
                        size="small" 
                        label={getStatusText(template.status)} 
                        color={getStatusColor(template.status) as any}
                      />
                    </Box>
                    <Box 
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        borderRadius: 1,
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <StarIcon sx={{ fontSize: 16, color: 'gold' }} />
                      <Typography variant="caption" sx={{ color: 'white' }}>
                        {template.analytics.rating.toFixed(1)}
                      </Typography>
                    </Box>
                    {/* Preview Placeholder */}
                    <Box 
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${template.category.color}20 0%, ${template.category.color}40 100%)`,
                        cursor: 'pointer'
                      }}
                      onClick={() => openPreviewDialog(template)}
                    >
                      <TemplateIcon sx={{ fontSize: 48, color: template.category.color, opacity: 0.7 }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Title */}
                    <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 600 }}>
                      {template.title}
                    </Typography>
                    
                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
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
                            Mëritos: {template.creator.reputation}
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            • Contribución: {template.creator.contributionScore}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Philosophy Alignment */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" fontWeight="medium">
                          Alineación Filosofía CoomÜnity
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
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          size="small" 
                          label={`🔄 ${template.philosophyAlignment.reciprocidad}%`}
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip 
                          size="small" 
                          label={`🤝 ${template.philosophyAlignment.cooperacion}%`}
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip 
                          size="small" 
                          label={`🌍 ${template.philosophyAlignment.bienComun}%`}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Box>

                    {/* Pricing & Type */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {template.pricing.isFree ? (
                        <Chip 
                          size="small" 
                          label="🎁 Gratuito" 
                          color="success"
                          variant="outlined"
                        />
                      ) : (
                        <Chip 
                          size="small" 
                          label={`${template.pricing.price} Ünits`} 
                          icon={<UnitsIcon />}
                          color="primary"
                        />
                      )}
                      <Chip 
                        size="small" 
                        label={template.category.name} 
                        sx={{ backgroundColor: `${template.category.color}20`, color: template.category.color }}
                      />
                      <Chip 
                        size="small" 
                        label={template.difficulty} 
                        variant="outlined"
                      />
                    </Box>

                    {/* Analytics */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                        👁️ {template.analytics.views} vistas • ❤️ {template.analytics.favorites} favoritos • 🔄 {template.analytics.remixes} remixes
                      </Typography>
                      <Typography variant="caption" display="block">
                        🤝 {template.analytics.teamUsage} usos en equipo • 📈 {template.analytics.completionRate}% completado
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Rating 
                          value={template.analytics.rating} 
                          readOnly 
                          size="small" 
                          precision={0.1}
                        />
                        <Typography variant="caption" color="text.secondary">
                          ({template.analytics.reviewCount} reviews)
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Vista previa">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => openPreviewDialog(template)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Compartir (VALUES: Sharing)">
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleTemplateAction(template.id, 'share')}
                        >
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remix/Fork (VALUES: Colaboración)">
                        <IconButton 
                          size="small" 
                          color="info"
                          onClick={() => handleTemplateAction(template.id, 'remix')}
                        >
                          <ForkIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Favorito">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleTemplateAction(template.id, 'favorite')}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {template.status === 'draft' && (
                        <>
                          <Tooltip title="Publicar">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => openModerationDialog(template, 'approve')}
                            >
                              <ApproveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Archivar">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => openModerationDialog(template, 'reject')}
                            >
                              <RejectIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Filosofía & Métricas Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          🌟 Filosofía CoomÜnity & Métricas de Impacto
        </Typography>
        
        {/* Philosophy Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" sx={{ color: '#4CAF50', mb: 1 }}>92%</Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>🔄 Reciprocidad</Typography>
              <Typography variant="body2" color="text.secondary">
                Promedio de templates que fomentan intercambio mutuo
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" sx={{ color: '#2196F3', mb: 1 }}>94%</Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>🌍 Bien Común</Typography>
              <Typography variant="body2" color="text.secondary">
                Templates que priorizan beneficio comunitario
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" sx={{ color: '#FF9800', mb: 1 }}>87%</Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>🌀 Neguentropía</Typography>
              <Typography variant="body2" color="text.secondary">
                Templates que crean orden y reducen caos
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" sx={{ color: '#4CAF50', mb: 1 }}>93%</Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>🤝 Cooperación</Typography>
              <Typography variant="body2" color="text.secondary">
                Templates que fomentan colaboración vs competencia
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3" sx={{ color: '#9C27B0', mb: 1 }}>81%</Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>🧿 Metanöia</Typography>
              <Typography variant="body2" color="text.secondary">
                Templates que promueven transformación de conciencia
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Sharing vs Hoarding Metrics */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🎁 Métricas: Sharing vs Hoarding
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">{templates.filter(t => t.isPublic).length}</Typography>
                  <Typography variant="body2">Templates Públicos</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {((templates.filter(t => t.isPublic).length / templates.length) * 100).toFixed(1)}% del total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {templates.reduce((sum, t) => sum + t.analytics.remixes, 0)}
                  </Typography>
                  <Typography variant="body2">Total Remixes</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Promedio {(templates.reduce((sum, t) => sum + t.analytics.remixes, 0) / templates.length).toFixed(1)} por template
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {templates.reduce((sum, t) => sum + t.analytics.shares, 0)}
                  </Typography>
                  <Typography variant="body2">Compartidos</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Índice de sharing comunitario
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {(templates.reduce((sum, t) => sum + t.community.reciprocityRating, 0) / templates.length).toFixed(0)}%
                  </Typography>
                  <Typography variant="body2">Reciprocidad</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rating promedio de reciprocidad
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Community Impact Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  📈 Impacto Comunitario
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Uso en Equipos</Typography>
                  <Typography variant="h4">
                    {templates.reduce((sum, t) => sum + t.analytics.teamUsage, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Colaboraciones Grupales</Typography>
                  <Typography variant="h4">
                    {templates.reduce((sum, t) => sum + t.analytics.groupCollaborations, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Transferencia de Conocimiento</Typography>
                  <Typography variant="h4">
                    {(templates.reduce((sum, t) => sum + t.analytics.knowledgeTransfer, 0) / templates.length).toFixed(0)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  💎 Economía Ünits
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Templates Gratuitos</Typography>
                  <Typography variant="h4">{templates.filter(t => t.pricing.isFree).length}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Beneficio Reciprocidad Total</Typography>
                  <Typography variant="h4">
                    {templates.reduce((sum, t) => sum + t.pricing.reciprocityBenefit, 0)} Ünits
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Bonus Comunitario</Typography>
                  <Typography variant="h4">
                    {templates.reduce((sum, t) => sum + t.pricing.communityBonus, 0)} Ünits
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⭐ Calidad & Rating
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Rating Promedio</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4">
                      {(templates.reduce((sum, t) => sum + t.analytics.rating, 0) / templates.length).toFixed(1)}
                    </Typography>
                    <Rating 
                      value={templates.reduce((sum, t) => sum + t.analytics.rating, 0) / templates.length} 
                      readOnly 
                      size="small"
                    />
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total Reviews</Typography>
                  <Typography variant="h4">
                    {templates.reduce((sum, t) => sum + t.analytics.reviewCount, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Tasa Completado</Typography>
                  <Typography variant="h4">
                    {(templates.reduce((sum, t) => sum + t.analytics.completionRate, 0) / templates.length).toFixed(0)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Comunidad Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          🤝 Comunidad & Colaboración
        </Typography>
        
        {/* Featured Community Templates */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            🌟 Templates Destacados por la Comunidad
          </Typography>
          <Grid container spacing={2}>
            {templates
              .filter(t => t.status === 'featured' || t.community.collaborationIndex >= 85)
              .slice(0, 3)
              .map((template) => (
                <Grid item xs={12} md={4} key={template.id}>
                  <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getCategoryIcon(template.category.id)}
                      <Typography variant="subtitle1" fontWeight="medium">
                        {template.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {template.description.substring(0, 80)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        size="small" 
                        label={`🤝 ${template.community.collaborationIndex}%`}
                        color="primary"
                      />
                      <Chip 
                        size="small" 
                        label={`🔄 ${template.community.reciprocityRating}%`}
                        color="success"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={template.creator.avatar} sx={{ width: 24, height: 24 }} />
                        <Typography variant="caption">
                          {template.creator.name}
                        </Typography>
                      </Box>
                      <Button size="small" variant="outlined">
                        Ver
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            }
          </Grid>
        </Box>

        {/* Community Management Table */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Gestión de Templates Comunitarios
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Template</TableCell>
                  <TableCell>Creador</TableCell>
                  <TableCell>Colaboración</TableCell>
                  <TableCell>Reciprocidad</TableCell>
                  <TableCell>Sharing Score</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: `${template.category.color}20`,
                            borderRadius: 1
                          }}
                        >
                          {getCategoryIcon(template.category.id)}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2">{template.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {template.category.name} • {template.difficulty}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={template.creator.avatar} sx={{ width: 24, height: 24 }} />
                        <Box>
                          <Typography variant="body2">{template.creator.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Mëritos: {template.creator.reputation}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={template.community.collaborationIndex} 
                          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption">
                          {template.community.collaborationIndex}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={template.community.reciprocityRating} 
                          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                          color="success"
                        />
                        <Typography variant="caption">
                          {template.community.reciprocityRating}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={template.community.sharingScore}
                        color={template.community.sharingScore >= 90 ? 'success' : 
                               template.community.sharingScore >= 75 ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={getStatusText(template.status)} 
                        color={getStatusColor(template.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Destacar en comunidad">
                          <IconButton 
                            size="small" 
                            color="primary"
                            disabled={template.status === 'featured'}
                          >
                            <StarIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Promover sharing">
                          <IconButton 
                            size="small" 
                            color="success"
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        {template.status === 'draft' && (
                          <>
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => openModerationDialog(template, 'approve')}
                            >
                              <ThumbUpIcon />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => openModerationDialog(template, 'reject')}
                            >
                              <ThumbDownIcon />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </TabPanel>

      {/* Template Preview Dialog */}
      <Dialog 
        open={isPreviewDialogOpen} 
        onClose={() => setIsPreviewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TemplateIcon color="primary" />
          Vista Previa del Template
          {selectedTemplate?.status === 'featured' && (
            <Chip size="small" label="Destacado" color="primary" icon={<StarIcon />} />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              {/* Template Header */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedTemplate.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedTemplate.longDescription || selectedTemplate.description}
                </Typography>
                
                {/* Creator & Category Info */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={selectedTemplate.creator.avatar} sx={{ width: 48, height: 48 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {selectedTemplate.creator.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mëritos: {selectedTemplate.creator.reputation} • Contribución: {selectedTemplate.creator.contributionScore}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          {selectedTemplate.creator.specialties.map((specialty, index) => (
                            <Chip key={index} size="small" label={specialty} variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Información del Template</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          size="small" 
                          label={selectedTemplate.category.name}
                          sx={{ backgroundColor: `${selectedTemplate.category.color}20`, color: selectedTemplate.category.color }}
                        />
                        <Chip size="small" label={selectedTemplate.difficulty} />
                        <Chip size="small" label={selectedTemplate.estimatedDuration} />
                        {selectedTemplate.pricing.isFree ? (
                          <Chip size="small" label="Gratuito" color="success" />
                        ) : (
                          <Chip size="small" label={`${selectedTemplate.pricing.price} Ünits`} color="primary" />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Philosophy Alignment */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    🌟 Alineación Filosofía CoomÜnity
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2.4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: getPhilosophyColor(selectedTemplate.philosophyAlignment.reciprocidad) }}>
                          {selectedTemplate.philosophyAlignment.reciprocidad}%
                        </Typography>
                        <Typography variant="caption">🔄 Reciprocidad</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2.4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: getPhilosophyColor(selectedTemplate.philosophyAlignment.bienComun) }}>
                          {selectedTemplate.philosophyAlignment.bienComun}%
                        </Typography>
                        <Typography variant="caption">🌍 Bien Común</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2.4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: getPhilosophyColor(selectedTemplate.philosophyAlignment.negentropia) }}>
                          {selectedTemplate.philosophyAlignment.negentropia}%
                        </Typography>
                        <Typography variant="caption">🌀 Neguentropía</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2.4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: getPhilosophyColor(selectedTemplate.philosophyAlignment.cooperacion) }}>
                          {selectedTemplate.philosophyAlignment.cooperacion}%
                        </Typography>
                        <Typography variant="caption">🤝 Cooperación</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={2.4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: getPhilosophyColor(selectedTemplate.philosophyAlignment.metanoia) }}>
                          {selectedTemplate.philosophyAlignment.metanoia}%
                        </Typography>
                        <Typography variant="caption">🧿 Metanöia</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Impactos Positivos:</strong> {selectedTemplate.philosophyAlignment.positiveImpacts.join(', ')}
                  </Typography>
                  {selectedTemplate.philosophyAlignment.areasForImprovement.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Áreas de Mejora:</strong> {selectedTemplate.philosophyAlignment.areasForImprovement.join(', ')}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Community & Analytics */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>📈 Analytics</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Vistas</Typography>
                          <Typography variant="h6">{selectedTemplate.analytics.views.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Usos</Typography>
                          <Typography variant="h6">{selectedTemplate.analytics.uses.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Remixes</Typography>
                          <Typography variant="h6">{selectedTemplate.analytics.remixes}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Rating</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">{selectedTemplate.analytics.rating.toFixed(1)}</Typography>
                            <Rating value={selectedTemplate.analytics.rating} readOnly size="small" />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>🤝 Comunidad</Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Sharing Score</Typography>
                          <Typography variant="h6">{selectedTemplate.community.sharingScore}%</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Colaboración</Typography>
                          <Typography variant="h6">{selectedTemplate.community.collaborationIndex}%</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Reciprocidad</Typography>
                          <Typography variant="h6">{selectedTemplate.community.reciprocityRating}%</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Uso en Equipos</Typography>
                          <Typography variant="h6">{selectedTemplate.analytics.teamUsage}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPreviewDialogOpen(false)}>
            Cerrar
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
          >
            Editar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            color="primary"
          >
            Usar Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Moderation Dialog */}
      <Dialog 
        open={isModerationDialogOpen} 
        onClose={() => setIsModerationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {moderationAction === 'approve' ? 'Publicar Template' : 'Archivar Template'}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedTemplate.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedTemplate.description}
              </Typography>
              
              {/* Philosophy Alignment Summary */}
              <Card sx={{ mb: 2, p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Alineación Filosofía CoomÜnity: {selectedTemplate.philosophyAlignment.overallAlignment}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={selectedTemplate.philosophyAlignment.overallAlignment} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Card>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label={moderationAction === 'approve' ? 'Comentarios de publicación (opcional)' : 'Razón del archivo'}
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder={moderationAction === 'approve' 
                  ? 'Ej: Excelente alineación con valores CoomÜnity, promover en comunidad' 
                  : 'Ej: Requiere mejor alineación con principios colaborativos'
                }
                sx={{ mt: 2 }}
                required={moderationAction === 'reject'}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModerationDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={() => selectedTemplate && handleModerationAction(selectedTemplate.id, moderationAction!, moderationNotes)}
            variant="contained"
            color={moderationAction === 'approve' ? 'success' : 'error'}
            startIcon={moderationAction === 'approve' ? <ApproveIcon /> : <RejectIcon />}
          >
            {moderationAction === 'approve' ? 'Publicar' : 'Archivar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplateMarketplaceManager; 