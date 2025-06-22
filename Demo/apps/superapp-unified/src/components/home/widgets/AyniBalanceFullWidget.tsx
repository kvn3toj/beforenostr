import React from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// 🚀 REUTILIZAR EL COMPONENTE REVOLUCIONARIO EXISTENTE
import AyniMetricsCardRevolutionary from '../AyniMetricsCardRevolutionary';

// 🌟 IMPORTAR HOOKS DINÁMICOS
import { useAyniMetrics } from '../../../hooks/home/useAyniMetrics';
import { useElementalConfig } from '../../../hooks/home/useElementalConfig';

interface AyniBalanceFullWidgetProps {
  className?: string;
}

export const AyniBalanceFullWidget: React.FC<AyniBalanceFullWidgetProps> = ({
  className = '',
}) => {
  // 🌟 USAR HOOKS DINÁMICOS EN LUGAR DE DATOS HARDCODEADOS
  const {
    data: ayniMetrics,
    isLoading: ayniLoading,
    error: ayniError
  } = useAyniMetrics();

  const {
    data: elementalConfig,
    isLoading: configLoading,
    error: configError
  } = useElementalConfig();

  // 🔄 Estados de carga
  const isLoading = ayniLoading || configLoading;
  const hasError = ayniError || configError;

  // 🚨 Manejo de errores
  if (hasError) {
    return (
      <Box
        className={`ayni-balance-full-widget ${className}`}
        sx={{
          width: '100%',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Alert
          severity="warning"
          sx={{
            maxWidth: '500px',
            background: 'rgba(255, 193, 7, 0.1)',
            color: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
          }}
        >
          <Typography variant="h6" gutterBottom>
            🌟 Conectando con el Cosmos...
          </Typography>
          <Typography variant="body2">
            Estamos sincronizando tus métricas Ayni con el universo.
            Los datos se cargarán automáticamente.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // 🔄 Estado de carga cósmico
  if (isLoading || !ayniMetrics) {
    return (
      <Box
        className={`ayni-balance-full-widget ${className}`}
        sx={{
          width: '100%',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 188, 212, 0.06) 0%, transparent 50%),
            linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))
          `,
          borderRadius: '32px',
          p: 4,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #FF6B35, #00BCD4, #66BB6A, #FFD54F, #FF6B35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'revolutionary-rotate-continuous 2s linear infinite',
          }}
        >
          <CircularProgress
            size={80}
            thickness={2}
            sx={{ color: 'white' }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{
            background: 'linear-gradient(135deg, #E91E63, #9C27B0, #3F51B5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          🌌 Sincronizando Balance Ayni
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          "Conectando con las energías elementales del universo..."
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className={`ayni-balance-full-widget ${className}`}
      sx={{
        width: '100%',
        position: 'relative',
        zIndex: 1000, // 🌍 Z-INDEX ALTO PARA SER PROTAGONISTA
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 188, 212, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 90%, rgba(102, 187, 106, 0.04) 0%, transparent 50%),
          linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))
        `,
        borderRadius: {
          xs: '24px',
          sm: '32px',
          md: '40px',
        },
        padding: {
          xs: '24px',
          sm: '32px',
          md: '48px',
          lg: '64px',
        },
        border: '3px solid transparent',
        backgroundClip: 'padding-box',
        boxShadow: `
          0 25px 80px rgba(0, 0, 0, 0.3),
          0 0 60px rgba(255, 107, 53, 0.15),
          inset 0 0 60px rgba(255, 107, 53, 0.02)
        `,
        minHeight: {
          xs: '500px',
          sm: '600px',
          md: '700px',
          lg: '800px',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'visible',
        // Efectos de partículas cósmicas
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.4), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 107, 53, 0.3), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(0, 188, 212, 0.2), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(102, 187, 106, 0.2), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255, 213, 79, 0.2), transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px',
          animation: 'cosmic-drift 25s linear infinite',
          opacity: 0.6,
          zIndex: 0,
          borderRadius: 'inherit',
        },
        // Añadir keyframes para el drift cósmico
        '@keyframes cosmic-drift': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-100px)' },
        },
      }}
    >
      {/* 🌌 Título Cósmico Principal */}
      <Box
        sx={{
          textAlign: 'center',
          mb: {
            xs: 4,
            sm: 5,
            md: 6,
          },
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: '2.5rem',
              sm: '3.5rem',
              md: '4.5rem',
              lg: '5.5rem',
            },
            fontWeight: 900,
            background:
              'linear-gradient(135deg, #FFD700, #FF6B35, #E91E63, #9C27B0, #00BCD4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(255, 107, 53, 0.5)',
            mb: 2,
            lineHeight: 1.1,
          }}
        >
          🌍 Tu Balance CoomÜnity
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: {
              xs: '1.2rem',
              sm: '1.5rem',
              md: '1.8rem',
              lg: '2rem',
            },
            fontWeight: 600,
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          🌟 {ayniMetrics.ayniLevel} - Universo de Prosperidad Elemental
        </Typography>

        {/* 📊 Indicador de datos en tiempo real */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            mt: 1,
            fontSize: '0.875rem',
            fontStyle: 'italic',
          }}
        >
          ✨ Datos actualizados: {new Date(ayniMetrics.lastUpdated).toLocaleTimeString()}
        </Typography>
      </Box>

      {/* 🌍 Sistema Planetario Balance Ayni - AHORA CON DATOS DINÁMICOS */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1200,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: {
            xs: '300px',
            sm: '400px',
            md: '500px',
          },
        }}
      >
        <AyniMetricsCardRevolutionary
          ondas={ayniMetrics.ondas}
          meritos={ayniMetrics.meritos}
          ayniLevel={ayniMetrics.ayniLevel}
          nextLevel={ayniMetrics.nextLevel}
          ayniProgress={ayniMetrics.ayniProgress}
          bienComunContributions={ayniMetrics.bienComunContributions}
          balanceAyni={ayniMetrics.balanceAyni}
          elementos={ayniMetrics.elementos}
          isLoading={false}
          isConnected={true}
        />
      </Box>

      {/* 🌟 Efecto de Resplandor Universal */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120%',
          height: '120%',
          background:
            'conic-gradient(from 0deg, rgba(255, 107, 53, 0.08), transparent, rgba(0, 188, 212, 0.06), transparent, rgba(102, 187, 106, 0.05), transparent)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 60s linear infinite',
          opacity: 0.5,
          zIndex: 0,
        }}
      />
    </Box>
  );
};
