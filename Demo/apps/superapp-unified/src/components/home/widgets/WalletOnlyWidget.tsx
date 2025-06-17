import React from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// 🚀 REUTILIZAR EL COMPONENTE REVOLUCIONARIO EXISTENTE
import WalletOverviewRevolutionary from '../WalletOverviewRevolutionary';

interface WalletOnlyWidgetProps {
  onAddFunds?: () => void;
  onSend?: () => void;
  onExchange?: () => void;
  onViewTransactions?: () => void;
  className?: string;
}

export const WalletOnlyWidget: React.FC<WalletOnlyWidgetProps> = ({
  onAddFunds,
  onSend,
  onExchange,
  onViewTransactions,
  className = '',
}) => {
  return (
    <Box
      className={`wallet-only-widget ${className}`}
      sx={{
        width: '100%',
        position: 'relative',
        zIndex: 900,
        background: `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.9) 50%, 
            rgba(15, 23, 42, 0.95) 100%
          )
        `,
        borderRadius: {
          xs: '20px',
          sm: '24px',
          md: '28px',
        },
        padding: {
          xs: '20px',
          sm: '24px',
          md: '32px',
        },
        border: '2px solid rgba(255, 107, 53, 0.2)',
        boxShadow: `
          0 15px 40px rgba(0, 0, 0, 0.3),
          0 0 30px rgba(255, 107, 53, 0.1),
          inset 0 0 30px rgba(255, 107, 53, 0.02)
        `,
        minHeight: {
          xs: '280px',
          sm: '320px',
          md: '360px',
        },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `
            0 20px 50px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(255, 107, 53, 0.15),
            inset 0 0 40px rgba(255, 107, 53, 0.03)
          `,
        },
        // Efectos de partículas sutiles
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.2), transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(255, 107, 53, 0.15), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(0, 188, 212, 0.1), transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 80px',
          animation: 'wallet-drift 20s linear infinite',
          opacity: 0.4,
          zIndex: 0,
        },
        '@keyframes wallet-drift': {
          '0%': { transform: 'translateX(0px)' },
          '100%': { transform: 'translateX(-150px)' },
        },
      }}
    >
      {/* 💰 Título de la Wallet */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 3,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.8rem',
              md: '2.2rem',
            },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FFD700, #FF6B35, #00BCD4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255, 107, 53, 0.3)',
            mb: 1,
          }}
        >
          💰 Tu Cartera Digital
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: {
              xs: '0.9rem',
              sm: '1rem',
              md: '1.1rem',
            },
            fontWeight: 500,
          }}
        >
          Gestiona tus recursos y transacciones
        </Typography>
      </Box>

      {/* 💰 Cartera Overview */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
      >
        <WalletOverviewRevolutionary
          onAddFunds={onAddFunds}
          onSend={onSend}
          onExchange={onExchange}
          onViewTransactions={onViewTransactions}
        />
      </Box>

      {/* 🌟 Efecto de Resplandor Sutil */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle, rgba(255, 107, 53, 0.03) 0%, transparent 70%)',
          borderRadius: 'inherit',
          transform: 'translate(-50%, -50%)',
          animation: 'wallet-glow 8s ease-in-out infinite',
          zIndex: 0,
        }}
        data-testid="wallet-glow-effect"
      />

      <style>
        {`
          @keyframes wallet-glow {
            0%, 100% { 
              opacity: 0.3; 
              transform: translate(-50%, -50%) scale(1); 
            }
            50% { 
              opacity: 0.6; 
              transform: translate(-50%, -50%) scale(1.05); 
            }
          }
        `}
      </style>
    </Box>
  );
};
