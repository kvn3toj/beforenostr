import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, Fade, Grid, Card, CardContent, Button, LinearProgress } from '@mui/material';
import { Home, AutoAwesome, MenuBook, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import ConsciousMetricsDashboard from '../components/dashboard/ConsciousMetricsDashboard';

/**
 * Consciousness Page
 *
 * Esta página implementa los principios del Archivo Cósmico CoomÜnity
 * en forma de métricas y dashboard interactivo.
 *
 * 🌌 FILOSOFÍA APLICADA:
 * - Reciprocidad: Balance de reciprocidad visible
 * - Bien Común: Métricas de contribución colectiva
 * - Cooperación: Medición de colaboración vs competencia
 * - Metanöia: Transformación consciente cuantificada
 * - Neguentropía: Orden generado desde el caos
 * - Vocación: Alineación con propósito individual
 *
 * Esta es la materialización práctica de toda la sabiduría
 * contenida en el Archivo Cósmico, convertida en métricas
 * reales y accionables para los usuarios de CoomÜnity.
 */
const ConsciousnessPage: React.FC = () => {
  const navigate = useNavigate();

  // Biblioteca de Sabiduría extraída de ÜPlay
  const wisdomLibrary = [
    { 
      title: 'Fundamentos de Reciprocidad', 
      category: 'Filosofía', 
      progress: 85,
      description: 'Descubre la sabiduría ancestral de la reciprocidad equilibrada',
      color: '#667eea'
    },
    { 
      title: 'Economía Colaborativa', 
      category: 'Bien Común', 
      progress: 67,
      description: 'Explora nuevos modelos económicos basados en cooperación',
      color: '#764ba2'
    },
    { 
      title: 'Metanöia Digital', 
      category: 'Transformación', 
      progress: 45,
      description: 'La alquimia de la transformación consciente en la era digital',
      color: '#f093fb'
    },
    { 
      title: 'Reciprocidad en Acción', 
      category: 'Práctica', 
      progress: 92,
      description: 'Implementa el Reciprocidad en tu vida diaria y relaciones',
      color: '#f5576c'
    },
    { 
      title: 'Consciencia Planetaria', 
      category: 'Evolución', 
      progress: 34,
      description: 'Expande tu consciencia hacia la perspectiva galáctica',
      color: '#4facfe'
    },
    { 
      title: 'Cooperación vs Competencia', 
      category: 'Mindset', 
      progress: 78,
      description: 'Transforma la mentalidad competitiva hacia la colaborativa',
      color: '#43e97b'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* 🧭 Breadcrumb Navigation */}
      <Box mb={3}>
        <Breadcrumbs
          separator="›"
          sx={{
            '& .MuiBreadcrumbs-separator': {
              color: 'primary.main',
              fontWeight: 600,
            },
          }}
        >
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <Home fontSize="small" />
            Inicio
          </Link>
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'primary.main',
              fontWeight: 600,
            }}
          >
            <AutoAwesome fontSize="small" />
            Consciencia
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* 🌟 Header con contexto filosófico */}
      <Box mb={4} textAlign="center">
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
          }}
        >
          🌌 Portal de Consciencia CoomÜnity
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}
        >
          Aquí confluye toda la sabiduría del{' '}
          <strong>Archivo Cósmico</strong> transformada en métricas vivas.
          Cada número refle<strong>la evolución consciente</strong> de nuestra comunidad
          hacia el <strong>Bien Común</strong>.
        </Typography>
      </Box>

      {/* 📊 Dashboard Principal */}
      <ConsciousMetricsDashboard />

      {/* 📚 Galería de Sabiduría Independiente */}
      <Fade in={true} timeout={1500}>
        <Box mt={8} mb={6}>
          {/* Header de la Galería */}
          <Box mb={4} textAlign="center">
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 2,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <MenuBook />
              Biblioteca de Sabiduría Cósmica
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Explora los fundamentos filosóficos y prácticos que sustentan la transformación consciente de CoomÜnity
            </Typography>
          </Box>

          {/* Grid de Tarjetas de Sabiduría */}
          <Grid container spacing={3}>
            {wisdomLibrary.map((wisdom, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: wisdom.color,
                        boxShadow: `0 8px 32px ${wisdom.color}30`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${wisdom.color}, ${wisdom.color}90)`,
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Header de la Tarjeta */}
                      <Box mb={2}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ color: 'text.primary', mb: 0.5 }}
                        >
                          {wisdom.title}
                        </Typography>
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            backgroundColor: `${wisdom.color}15`,
                            color: wisdom.color,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {wisdom.category}
                        </Box>
                      </Box>

                      {/* Descripción */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3, lineHeight: 1.6 }}
                      >
                        {wisdom.description}
                      </Typography>

                      {/* Progreso */}
                      <Box mb={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight={500} color="text.secondary">
                            Exploración
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ color: wisdom.color }}>
                            {wisdom.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={wisdom.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: wisdom.color,
                              borderRadius: 3,
                            }
                          }}
                        />
                      </Box>

                      {/* Botón de Acción */}
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<TrendingUp />}
                        sx={{
                          mt: 'auto',
                          background: `linear-gradient(135deg, ${wisdom.color}, ${wisdom.color}90)`,
                          color: 'white',
                          fontWeight: 600,
                          py: 1.2,
                          borderRadius: 2,
                          textTransform: 'none',
                          '&:hover': {
                            background: `linear-gradient(135deg, ${wisdom.color}90, ${wisdom.color}70)`,
                            transform: 'translateY(-1px)',
                          }
                        }}
                      >
                        Explorar Sabiduría
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* 🔮 Footer Inspiracional */}
      <Box mt={6} textAlign="center" py={4}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontStyle: 'italic',
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          "La tecnología consciente no mide el engagement, mide la transformación.
          No busca la retención, busca la evolución. No persigue el crecimiento,
          persigue el florecimiento."
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2, fontWeight: 500 }}
        >
          — Archivo Cósmico CoomÜnity, Sección 08: Métricas de Consciencia
        </Typography>
      </Box>
    </Container>
  );
};

export default ConsciousnessPage;
