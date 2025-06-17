import React from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// 🚀 REUTILIZAR EL COMPONENTE REVOLUCIONARIO EXISTENTE
import AyniMetricsCardRevolutionary from '../AyniMetricsCardRevolutionary';

interface AyniBalanceFullWidgetProps {
  className?: string;
}

// 📊 Mock data completo para el widget
const mockAyniData = {
  ondas: 1250,
  meritos: 485,
  ayniLevel: 'Colaborador Equilibrado',
  nextLevel: 'Guardián del Bien Común',
  ayniProgress: 78,
  bienComunContributions: 23,
  balanceAyni: 0.85,
  elementos: {
    fuego: 85, // Pasión y acción
    agua: 92, // Fluir y adaptabilidad
    tierra: 78, // Estabilidad y confianza
    aire: 88, // Comunicación e ideas
  },
};

export const AyniBalanceFullWidget: React.FC<AyniBalanceFullWidgetProps> = ({
  className = '',
}) => {
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
          🌍 Tu Balance Ayni
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
          El Universo de Tu Prosperidad Elemental
        </Typography>
      </Box>

      {/* 🌍 Sistema Planetario Balance Ayni */}
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
          ondas={mockAyniData.ondas}
          meritos={mockAyniData.meritos}
          ayniLevel={mockAyniData.ayniLevel}
          nextLevel={mockAyniData.nextLevel}
          ayniProgress={mockAyniData.ayniProgress}
          bienComunContributions={mockAyniData.bienComunContributions}
          balanceAyni={mockAyniData.balanceAyni}
          elementos={mockAyniData.elementos}
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
