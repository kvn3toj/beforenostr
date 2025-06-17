import React from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// 🚀 REUTILIZAR LOS COMPONENTES REVOLUCIONARIOS EXISTENTES
import AyniMetricsCardRevolutionary from '../AyniMetricsCardRevolutionary';
import WalletOverviewRevolutionary from '../WalletOverviewRevolutionary';

interface AyniWalletWidgetProps {
  onAddFunds?: () => void;
  onSend?: () => void;
  onExchange?: () => void;
  onViewTransactions?: () => void;
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

export const AyniWalletWidget: React.FC<AyniWalletWidgetProps> = ({
  onAddFunds,
  onSend,
  onExchange,
  onViewTransactions,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        zIndex: 2,
        background:
          'radial-gradient(circle at center, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.98) 100%)',
        borderRadius: '32px',
        padding: { xs: 3, sm: 4, md: 5 },
        border: '2px solid rgba(255, 107, 53, 0.3)',
        boxShadow:
          '0 25px 80px rgba(0, 0, 0, 0.4), inset 0 0 60px rgba(255, 107, 53, 0.05)',
        minHeight: { xs: '400px', sm: '500px', md: '600px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        // Efectos de partículas cósmicas
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 107, 53, 0.4), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(0, 188, 212, 0.3), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(102, 187, 106, 0.3), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255, 213, 79, 0.3), transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px',
          animation: 'cosmic-drift 20s linear infinite',
          opacity: 0.6,
          zIndex: 0,
        },
        // Añadir keyframes para el drift cósmico
        '@keyframes cosmic-drift': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-100px)' },
        },
      }}
    >
      {/* 🌌 Título Cósmico */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
            fontWeight: 800,
            background:
              'linear-gradient(135deg, #FFD700, #FF6B35, #E91E63, #9C27B0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 107, 53, 0.5)',
            mb: 1,
          }}
        >
          🌍 Tu Balance Ayni
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            fontWeight: 500,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)',
          }}
        >
          El Universo de Tu Prosperidad Elemental
        </Typography>
      </Box>

      {/* 🌍 Balance Ayni Cósmico - El Mundo Principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 100,
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '24px',
          padding: { xs: 3, sm: 4, md: 5 },
          border: '2px solid rgba(255, 107, 53, 0.4)',
          backdropFilter: 'blur(20px)',
          minHeight: { xs: '300px', sm: '400px', md: '500px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'visible',
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

      {/* 💰 Cartera Overview Mejorada */}
      <Box
        sx={{
          mt: 4,
          position: 'relative',
          zIndex: 2,
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '20px',
          padding: { xs: 2, sm: 3 },
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(15px)',
        }}
      >
        <WalletOverviewRevolutionary
          onAddFunds={onAddFunds}
          onSend={onSend}
          onExchange={onExchange}
          onViewTransactions={onViewTransactions}
        />
      </Box>

      {/* 🌟 Efecto de Resplandor Orbital */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%',
          height: '150%',
          background:
            'conic-gradient(from 0deg, rgba(255, 107, 53, 0.1), transparent, rgba(0, 188, 212, 0.08), transparent, rgba(102, 187, 106, 0.06), transparent)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 40s linear infinite',
          opacity: 0.7,
          zIndex: 0,
        }}
      />
    </Box>
  );
};
