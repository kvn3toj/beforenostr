import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  Collapse,
  IconButton,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  ExpandMore,
  ExpandLess,
  AutoAwesome,
  PlayArrow,
  LocalMall,
  Groups,
  Psychology,
  TrendingUp,
  Close,
  Lightbulb,
  Celebration,
  School
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  ondas: number;
  meritos?: number;
  completed: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: React.ReactNode;
  category: 'learning' | 'community' | 'commerce' | 'growth';
}

interface OnboardingChecklistProps {
  isVisible: boolean;
  onClose: () => void;
  userStage: 'BUYER' | 'SEEKER' | 'SOLVER' | 'PROMOTER';
  completedItems?: string[];
  onItemComplete: (itemId: string, rewards: { ondas: number; meritos?: number }) => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  isVisible,
  onClose,
  userStage,
  completedItems = [],
  onItemComplete
}) => {
  const theme = useTheme();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [totalOndas, setTotalOndas] = useState(0);
  const [totalMeritos, setTotalMeritos] = useState(0);

  // Generate checklist items based on user stage
  useEffect(() => {
    const stageItems = getChecklistForStage(userStage);
    const updatedItems = stageItems.map(item => ({
      ...item,
      completed: completedItems.includes(item.id)
    }));
    setItems(updatedItems);

    // Calculate potential rewards
    const ondas = updatedItems.reduce((sum, item) => sum + (item.completed ? 0 : item.ondas), 0);
    const meritos = updatedItems.reduce((sum, item) => sum + (item.completed ? 0 : (item.meritos || 0)), 0);

    setTotalOndas(ondas);
    setTotalMeritos(meritos);
  }, [userStage, completedItems]);

  const handleItemToggle = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.completed) return;

    // Execute action if available
    if (item.action) {
      item.action.onClick();
    }

    // Mark as completed
    setItems(prev =>
      prev.map(i =>
        i.id === itemId ? { ...i, completed: true } : i
      )
    );

    // Award rewards
    onItemComplete(itemId, {
      ondas: item.ondas,
      meritos: item.meritos
    });
  };

  const handleCategoryToggle = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const categories = [
    { id: 'learning', title: 'Aprendizaje', icon: <Psychology />, color: '#4CAF50' },
    { id: 'community', title: 'Comunidad', icon: <Groups />, color: '#2196F3' },
    { id: 'commerce', title: 'Comercio', icon: <LocalMall />, color: '#FF9800' },
    { id: 'growth', title: 'Crecimiento', icon: <TrendingUp />, color: '#9C27B0' }
  ];

  const getItemsByCategory = (category: string) =>
    items.filter(item => item.category === category);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          width: 380,
          maxHeight: 'calc(100vh - 48px)',
          zIndex: 1300
        }}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: theme.shadows[16],
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="600">
                  Tu Lista de Progreso
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {userStage} Stage
                </Typography>
              </Box>

              <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {completedCount} de {totalCount} completadas
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {Math.round(completionPercentage)}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha('#fff', 0.3),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#fff',
                    borderRadius: 4
                  }
                }}
              />
            </Box>

            {/* Rewards Summary */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {totalOndas > 0 && (
                <Chip
                  icon={<AutoAwesome />}
                  label={`${totalOndas} Öndas`}
                  size="small"
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              )}
              {totalMeritos > 0 && (
                <Chip
                  icon={<Celebration />}
                  label={`${totalMeritos} Mëritos`}
                  size="small"
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Content */}
          <CardContent sx={{ flex: 1, overflow: 'auto', p: 0 }}>
            {categories.map((category) => {
              const categoryItems = getItemsByCategory(category.id);
              if (categoryItems.length === 0) return null;

              const categoryCompleted = categoryItems.filter(item => item.completed).length;
              const isExpanded = expandedCategory === category.id;

              return (
                <Box key={category.id}>
                  {/* Category Header */}
                  <ListItemButton
                    onClick={() => handleCategoryToggle(category.id)}
                    sx={{
                      py: 2,
                      px: 3,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      background: alpha(category.color, 0.05)
                    }}
                  >
                    <ListItemIcon sx={{ color: category.color }}>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={category.title}
                      secondary={`${categoryCompleted}/${categoryItems.length} completadas`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round((categoryCompleted / categoryItems.length) * 100)}%
                      </Typography>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  </ListItemButton>

                  {/* Category Items */}
                  <Collapse in={isExpanded}>
                    <List sx={{ py: 0 }}>
                      {categoryItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ListItem
                            sx={{
                              px: 3,
                              py: 2,
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                              bgcolor: item.completed ? alpha(theme.palette.success.main, 0.05) : 'transparent'
                            }}
                          >
                            <ListItemIcon>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Checkbox
                                  checked={item.completed}
                                  onChange={() => handleItemToggle(item.id)}
                                  icon={<RadioButtonUnchecked />}
                                  checkedIcon={<CheckCircle />}
                                  sx={{
                                    color: item.completed ? 'success.main' : 'text.secondary',
                                    '&.Mui-checked': {
                                      color: 'success.main'
                                    }
                                  }}
                                />
                              </motion.div>
                            </ListItemIcon>

                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight="600"
                                    sx={{
                                      textDecoration: item.completed ? 'line-through' : 'none',
                                      color: item.completed ? 'text.secondary' : 'text.primary'
                                    }}
                                  >
                                    {item.title}
                                  </Typography>

                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Box
                                      sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        px: 1,
                                        py: 0.25,
                                        height: 20,
                                        fontSize: '0.75rem',
                                        color: item.completed ? 'text.disabled' : 'primary.main',
                                        bgcolor: item.completed ? 'grey.100' : alpha(theme.palette.primary.main, 0.1),
                                        borderRadius: 1,
                                        gap: 0.5
                                      }}
                                    >
                                      <AutoAwesome sx={{ fontSize: 12 }} />
                                      +{item.ondas}
                                    </Box>
                                    {item.meritos && (
                                      <Box
                                        sx={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          px: 1,
                                          py: 0.25,
                                          height: 20,
                                          fontSize: '0.75rem',
                                          color: item.completed ? 'text.disabled' : 'secondary.main',
                                          bgcolor: item.completed ? 'grey.100' : alpha(theme.palette.secondary.main, 0.1),
                                          borderRadius: 1,
                                          gap: 0.5
                                        }}
                                      >
                                        <Celebration sx={{ fontSize: 12 }} />
                                        +{item.meritos}
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  color={item.completed ? 'text.disabled' : 'text.secondary'}
                                >
                                  {item.description}
                                </Typography>
                              }
                            />

                            {item.action && !item.completed && (
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleItemToggle(item.id);
                                  }}
                                  startIcon={<PlayArrow />}
                                  sx={{
                                    minWidth: 'auto',
                                    px: 1,
                                    borderColor: category.color,
                                    color: category.color,
                                    '&:hover': {
                                      borderColor: category.color,
                                      bgcolor: alpha(category.color, 0.1)
                                    }
                                  }}
                                >
                                  {item.action.label}
                                </Button>
                              </motion.div>
                            )}
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              );
            })}

            {/* Completion Celebration */}
            {completionPercentage === 100 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
              >
                <Box
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    color: 'white',
                    m: 2,
                    borderRadius: 2
                  }}
                >
                  <Celebration sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    ¡Felicitaciones!
                  </Typography>
                  <Typography variant="body2">
                    Has completado todas las tareas de tu stage actual.
                    ¡Es momento de avanzar al siguiente nivel!
                  </Typography>
                </Box>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

// Generate checklist items based on user stage
const getChecklistForStage = (stage: string): ChecklistItem[] => {
  const baseItems: ChecklistItem[] = [
    // Learning items
    {
      id: 'complete_first_video',
      title: 'Completa tu primer video ÜPlay',
      description: 'Mira un video completo y responde las preguntas',
      ondas: 20,
      meritos: 5,
      completed: false,
      category: 'learning',
      icon: <PlayArrow />,
      action: {
        label: 'Ver',
        onClick: () => window.location.href = '/uplay'
      }
    },
    {
      id: 'philosophy_assessment',
      title: 'Completa el assessment de filosofía',
      description: 'Demuestra tu comprensión de los principios de Reciprocidad',
      ondas: 15,
      meritos: 10,
      completed: false,
      category: 'learning',
      icon: <Psychology />
    },

    // Community items
    {
      id: 'join_local_hub',
      title: 'Únete a tu hub local',
      description: 'Conecta con la comunidad de tu área geográfica',
      ondas: 25,
      meritos: 15,
      completed: false,
      category: 'community',
      icon: <Groups />,
      action: {
        label: 'Unirse',
        onClick: () => window.location.href = '/social'
      }
    },
    {
      id: 'first_social_interaction',
      title: 'Envía tu primer mensaje',
      description: 'Inicia una conversación con un miembro de la comunidad',
      ondas: 10,
      meritos: 5,
      completed: false,
      category: 'community',
      icon: <Groups />
    }
  ];

  const stageSpecificItems: Record<string, ChecklistItem[]> = {
    'BUYER': [
      {
        id: 'first_marketplace_browse',
        title: 'Explora el marketplace',
        description: 'Revisa productos y servicios disponibles en tu área',
        ondas: 10,
        completed: false,
        category: 'commerce',
        icon: <LocalMall />,
        action: {
          label: 'Explorar',
          onClick: () => window.location.href = '/marketplace'
        }
      },
      {
        id: 'first_purchase',
        title: 'Realiza tu primera compra',
        description: 'Completa una transacción usando Lükas',
        ondas: 30,
        meritos: 20,
        completed: false,
        category: 'commerce',
        icon: <LocalMall />
      },
      {
        id: 'rate_transaction',
        title: 'Califica tu experiencia',
        description: 'Deja una reseña constructiva después de tu compra',
        ondas: 15,
        meritos: 10,
        completed: false,
        category: 'growth',
        icon: <TrendingUp />
      }
    ],

    'SEEKER': [
      {
        id: 'attend_workshop',
        title: 'Asiste a un taller',
        description: 'Participa en una experiencia de aprendizaje grupal',
        ondas: 40,
        meritos: 25,
        completed: false,
        category: 'learning',
        icon: <School />
      },
      {
        id: 'multiple_purchases',
        title: 'Realiza 5 compras exitosas',
        description: 'Demuestra compromiso con el ecosistema local',
        ondas: 50,
        meritos: 30,
        completed: false,
        category: 'commerce',
        icon: <LocalMall />
      },
      {
        id: 'trust_voting_participation',
        title: 'Participa en trust voting',
        description: 'Ayuda a validar a otros miembros de la comunidad',
        ondas: 20,
        meritos: 15,
        completed: false,
        category: 'community',
        icon: <Groups />
      }
    ],

    'SOLVER': [
      {
        id: 'create_first_listing',
        title: 'Crea tu primera oferta',
        description: 'Publica un producto o servicio en el marketplace',
        ondas: 60,
        meritos: 40,
        completed: false,
        category: 'commerce',
        icon: <LocalMall />,
        action: {
          label: 'Crear',
          onClick: () => console.log('Navigate to create listing')
        }
      },
      {
        id: 'first_sale',
        title: 'Realiza tu primera venta',
        description: 'Completa una transacción como vendedor',
        ondas: 80,
        meritos: 50,
        completed: false,
        category: 'commerce',
        icon: <TrendingUp />
      },
      {
        id: 'mentor_seeker',
        title: 'Mentoreo a un Seeker',
        description: 'Guía a un miembro menos experimentado',
        ondas: 100,
        meritos: 75,
        completed: false,
        category: 'community',
        icon: <Groups />
      }
    ],

    'PROMOTER': [
      {
        id: 'organize_community_event',
        title: 'Organiza un evento comunitario',
        description: 'Lidera una iniciativa que beneficie al hub local',
        ondas: 200,
        meritos: 150,
        completed: false,
        category: 'community',
        icon: <Groups />
      },
      {
        id: 'invite_new_members',
        title: 'Invita 10 nuevos miembros',
        description: 'Expande el ecosistema local',
        ondas: 150,
        meritos: 100,
        completed: false,
        category: 'growth',
        icon: <TrendingUp />
      },
      {
        id: 'validate_entrepreneurs',
        title: 'Valida Emprendedores Confiables',
        description: 'Participa en el proceso de validación avanzada',
        ondas: 100,
        meritos: 75,
        completed: false,
        category: 'community',
        icon: <CheckCircle />
      }
    ]
  };

  return [...baseItems, ...(stageSpecificItems[stage] || [])];
};

export default OnboardingChecklist;
