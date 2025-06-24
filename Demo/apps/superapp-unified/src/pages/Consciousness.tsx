import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material';
import { Home, AutoAwesome } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import ConsciousMetricsDashboard from '../components/dashboard/ConsciousMetricsDashboard';

/**
 * Consciousness Page
 *
 * Esta página implementa los principios del Archivo Cósmico CoomÜnity
 * en forma de métricas y dashboard interactivo.
 *
 * 🌌 FILOSOFÍA APLICADA:
 * - Ayni: Balance de reciprocidad visible
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
