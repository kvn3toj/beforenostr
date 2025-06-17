import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  alpha,
  Fade,
  Zoom,
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  EmojiEvents,
  Groups,
  AutoAwesome,
  Close,
  Lightbulb,
  Timeline,
} from '@mui/icons-material';

interface InsightData {
  id: string;
  type: 'ayni' | 'meritos' | 'social' | 'growth' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  icon: React.ReactElement;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  value?: string;
}

interface AdvancedInsightsPanelProps {
  gameData: any;
  walletData: any;
  isVisible: boolean;
  onClose: () => void;
}

export const AdvancedInsightsPanel: React.FC<AdvancedInsightsPanelProps> = ({
  gameData,
  walletData,
  isVisible,
  onClose,
}) => {
  const theme = useTheme();
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [animationDelay, setAnimationDelay] = useState(0);

  // 🧠 Generar insights inteligentes basados en los datos
  useEffect(() => {
    const generateInsights = (): InsightData[] => {
      const newInsights: InsightData[] = [];

      // Insight de balance Ayni
      if (gameData?.balanceAyni < 0.7) {
        newInsights.push({
          id: 'ayni-balance',
          type: 'ayni',
          title: 'Oportunidad de Equilibrio Ayni',
          description: 'Tu balance de dar/recibir está por debajo del ideal. Considera ofrecer más servicios a la comunidad.',
          impact: 'high',
          confidence: 85,
          actionable: true,
          icon: <AutoAwesome />,
          color: theme.palette.warning.main,
          trend: 'down',
          value: `${Math.round(gameData.balanceAyni * 100)}%`,
        });
      }

      // Insight de crecimiento de Mëritos
      if (gameData?.meritos > 400) {
        newInsights.push({
          id: 'meritos-growth',
          type: 'meritos',
          title: 'Excelente Progreso en Mëritos',
          description: 'Estás en el top 20% de contribuidores al Bien Común. ¡Sigue así!',
          impact: 'high',
          confidence: 92,
          actionable: false,
          icon: <EmojiEvents />,
          color: theme.palette.success.main,
          trend: 'up',
          value: `${gameData.meritos}`,
        });
      }

      // Insight de elementos
      const elementos = gameData?.elementos || {};
      const elementoMasBajo = Object.entries(elementos).reduce((min, [key, value]) => 
        (value as number) < (min.value as number) ? { key, value } : min
      , { key: 'fuego', value: 100 });

      if ((elementoMasBajo.value as number) < 80) {
        newInsights.push({
          id: 'elemento-balance',
          type: 'growth',
          title: `Fortalece tu ${elementoMasBajo.key}`,
          description: `Tu elemento ${elementoMasBajo.key} necesita atención. Participa en actividades relacionadas.`,
          impact: 'medium',
          confidence: 78,
          actionable: true,
          icon: <Psychology />,
          color: theme.palette.info.main,
          trend: 'down',
          value: `${elementoMasBajo.value}%`,
        });
      }

      // Insight de oportunidades sociales
      newInsights.push({
        id: 'social-opportunity',
        type: 'social',
        title: 'Nuevas Conexiones Disponibles',
        description: 'Hay 3 emprendedores confiables en tu área que comparten intereses similares.',
        impact: 'medium',
        confidence: 70,
        actionable: true,
        icon: <Groups />,
        color: theme.palette.primary.main,
        trend: 'up',
        value: '3 nuevas',
      });

      return newInsights;
    };

    if (isVisible) {
      setInsights(generateInsights());
      setAnimationDelay(0);
    }
  }, [gameData, walletData, isVisible, theme]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />;
      case 'down': return <Timeline sx={{ fontSize: 16, color: theme.palette.error.main, transform: 'rotate(180deg)' }} />;
      default: return null;
    }
  };

  if (!isVisible) return null;

  return (
    <Fade in={isVisible} timeout={600}>
      <Box
        className="insights-panel glassmorphism-card"
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: '80vw', md: '600px' },
          maxHeight: '80vh',
          overflowY: 'auto',
          zIndex: 1300,
          p: 0,
        }}
      >
        <Card
          sx={{
            background: 'transparent',
            boxShadow: 'none',
            border: 'none',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lightbulb sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                  Insights Inteligentes
                </Typography>
              </Box>
              <IconButton onClick={onClose} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Box>

            {/* Insights List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {insights.map((insight, index) => (
                <Zoom
                  key={insight.id}
                  in={true}
                  timeout={400}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card
                    className="recommendation-card interactive-card-advanced"
                    sx={{
                      background: alpha(insight.color, 0.1),
                      border: `1px solid ${alpha(insight.color, 0.3)}`,
                      borderRadius: 2,
                      overflow: 'visible',
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        {/* Icon */}
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: '50%',
                            background: alpha(insight.color, 0.2),
                            color: insight.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {insight.icon}
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
                              {insight.title}
                            </Typography>
                            {getTrendIcon(insight.trend)}
                            {insight.value && (
                              <Chip
                                label={insight.value}
                                size="small"
                                sx={{
                                  bgcolor: alpha(insight.color, 0.2),
                                  color: insight.color,
                                  fontSize: '0.7rem',
                                }}
                              />
                            )}
                          </Box>

                          <Typography variant="body2" sx={{ color: alpha('#fff', 0.8), mb: 2 }}>
                            {insight.description}
                          </Typography>

                          {/* Metadata */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip
                                label={`${insight.impact.toUpperCase()} IMPACT`}
                                size="small"
                                className={`recommendation-priority-${insight.impact}`}
                                sx={{ fontSize: '0.65rem' }}
                              />
                              {insight.actionable && (
                                <Chip
                                  label="ACTIONABLE"
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(theme.palette.success.main, 0.2),
                                    color: theme.palette.success.main,
                                    fontSize: '0.65rem',
                                  }}
                                />
                              )}
                            </Box>

                            {/* Confidence */}
                            <Tooltip title={`Confianza: ${insight.confidence}%`}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                                  {insight.confidence}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={insight.confidence}
                                  sx={{
                                    width: 40,
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: alpha('#fff', 0.1),
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: insight.color,
                                    },
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              ))}
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${alpha('#fff', 0.1)}` }}>
              <Typography variant="caption" sx={{ color: alpha('#fff', 0.6), fontStyle: 'italic' }}>
                💡 Los insights se actualizan automáticamente basándose en tu actividad y progreso en CoomÜnity
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default AdvancedInsightsPanel; 