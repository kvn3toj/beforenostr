import React, { useState, useEffect, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DiamondIcon from '@mui/icons-material/Diamond';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface WalletOverviewRevolutionaryProps {
  onAddFunds?: () => void;
  onSend?: () => void;
  onExchange?: () => void;
  onViewTransactions?: () => void;
}

// 💰 Datos simulados de la cartera
const mockWalletData = {
  totalBalance: 2847.5,
  currencies: [
    {
      name: 'Öndas',
      symbol: 'ÖND',
      balance: 1250.0,
      change: 12.5,
      trend: 'up',
      color: '#00BCD4',
      icon: WaterDropIcon,
      element: 'water',
    },
    {
      name: 'Mëritos',
      symbol: 'MËR',
      balance: 890.25,
      change: 8.3,
      trend: 'up',
      color: '#66BB6A',
      icon: TerrainIcon,
      element: 'earth',
    },
    {
      name: 'Bien Común',
      symbol: 'BCM',
      balance: 567.25,
      change: -2.1,
      trend: 'down',
      color: '#E91E63',
      icon: LocalFireDepartmentIcon,
      element: 'fire',
    },
    {
      name: 'Poder Elemental',
      symbol: 'PWR',
      balance: 140.0,
      change: 15.7,
      trend: 'up',
      color: '#9C27B0',
      icon: DiamondIcon,
      element: 'power',
    },
  ],
  recentActivity: {
    transactions: 12,
    lastTransaction: '2 horas',
    weeklyGrowth: 8.4,
  },
};

const WalletOverviewRevolutionary: React.FC<
  WalletOverviewRevolutionaryProps
> = ({ onAddFunds, onSend, onExchange, onViewTransactions }) => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [hoveredCurrency, setHoveredCurrency] = useState<string | null>(null);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; color: string }>
  >([]);

  // 🎨 Gradiente principal de la cartera
  const walletGradient = useMemo(
    () =>
      'conic-gradient(from 0deg, #00BCD4, #66BB6A, #E91E63, #9C27B0, #00BCD4)',
    []
  );

  // ✨ Generar partículas de monedas
  useEffect(() => {
    const generateParticles = () => {
      const colors = ['#00BCD4', '#66BB6A', '#E91E63', '#9C27B0'];
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: `wallet-particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalBalance = mockWalletData.totalBalance;

  return (
    <Box
      className="revolutionary-card"
      sx={{
        position: 'relative',
        background: 'var(--revolutionary-glass-medium)',
        backdropFilter: 'var(--revolutionary-blur-medium)',
        border: '2px solid var(--revolutionary-glass-strong)',
        borderRadius: 'var(--revolutionary-radius-xl)',
        padding: { xs: 2, sm: 3 },
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.2), 0 0 40px rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      {/* ✨ Partículas de Monedas */}
      <Box className="revolutionary-particles">
        {particles.map((particle) => (
          <Box
            key={particle.id}
            sx={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: particle.color,
              boxShadow: `0 0 12px ${particle.color}`,
              animation: 'revolutionary-sparkle 3s ease-in-out infinite',
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </Box>

      {/* 🎨 Borde Gradiente Superior */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: walletGradient,
          opacity: 0.8,
        }}
      />

      {/* 📱 Header de la Cartera */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: walletGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'revolutionary-rotate-continuous 15s linear infinite',
              boxShadow: '0 8px 32px rgba(0, 188, 212, 0.3)',
            }}
          >
            <AccountBalanceWalletIcon
              sx={{ color: 'white', fontSize: '1.8rem' }}
            />
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
              }}
            >
              Mi Cartera Ayni
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.9rem',
              }}
            >
              Balance Multielemental
            </Typography>
          </Box>
        </Box>

        {/* 👁️ Toggle Visibilidad */}
        <Tooltip title={balanceVisible ? 'Ocultar balance' : 'Mostrar balance'}>
          <IconButton
            onClick={() => setBalanceVisible(!balanceVisible)}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
            }}
          >
            {balanceVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* 💰 Balance Total */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 3,
          p: 2,
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--revolutionary-radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            mb: 1,
          }}
        >
          Balance Total Equivalente
        </Typography>

        <Typography
          variant="h3"
          className="revolutionary-text-gradient"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem' },
            fontWeight: 700,
            background: walletGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          {balanceVisible ? `$${totalBalance.toLocaleString()}` : '••••••'}
        </Typography>

        <Chip
          icon={<TrendingUpIcon />}
          label={`+${mockWalletData.recentActivity.weeklyGrowth}% esta semana`}
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
            color: 'white',
            fontWeight: 600,
            '& .MuiChip-icon': { color: 'white' },
          }}
        />

        {/* ✨ Efecto Shimmer */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            animation: 'revolutionary-shimmer 3s ease-in-out infinite',
          }}
        />
      </Box>

      {/* 💎 Monedas Elementales */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.5,
          mb: 3,
        }}
      >
        {mockWalletData.currencies.map((currency) => {
          const IconComponent = currency.icon;
          const isHovered = hoveredCurrency === currency.symbol;

          return (
            <Box
              key={currency.symbol}
              className="revolutionary-metric-card"
              onMouseEnter={() => setHoveredCurrency(currency.symbol)}
              onMouseLeave={() => setHoveredCurrency(null)}
              sx={{
                padding: 1.5,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                background: isHovered
                  ? `linear-gradient(135deg, ${currency.color}20, rgba(255, 255, 255, 0.1))`
                  : 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${currency.color}, ${currency.color}CC)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  boxShadow: `0 4px 16px ${currency.color}40`,
                }}
              >
                <IconComponent sx={{ color: 'white', fontSize: '1.2rem' }} />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.75rem',
                  mb: 0.5,
                }}
              >
                {currency.symbol}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {balanceVisible ? currency.balance.toLocaleString() : '•••'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                {currency.trend === 'up' ? (
                  <TrendingUpIcon
                    sx={{ color: '#4CAF50', fontSize: '0.8rem' }}
                  />
                ) : (
                  <TrendingDownIcon
                    sx={{ color: '#F44336', fontSize: '0.8rem' }}
                  />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: currency.trend === 'up' ? '#4CAF50' : '#F44336',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  {Math.abs(currency.change)}%
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ background: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

      {/* 🎯 Acciones Rápidas */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
        }}
      >
        <Button
          onClick={onAddFunds}
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
            color: 'white',
            borderRadius: 'var(--revolutionary-radius-md)',
            textTransform: 'none',
            fontSize: '0.8rem',
            padding: '8px 12px',
            boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #66BB6A, #81C784)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)',
            },
          }}
        >
          Agregar
        </Button>

        <Button
          onClick={onSend}
          startIcon={<SendIcon />}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #2196F3, #42A5F5)',
            color: 'white',
            borderRadius: 'var(--revolutionary-radius-md)',
            textTransform: 'none',
            fontSize: '0.8rem',
            padding: '8px 12px',
            boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #42A5F5, #64B5F6)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
            },
          }}
        >
          Enviar
        </Button>

        <Button
          onClick={onExchange}
          startIcon={<SwapHorizIcon />}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #FF9800, #FFB74D)',
            color: 'white',
            borderRadius: 'var(--revolutionary-radius-md)',
            textTransform: 'none',
            fontSize: '0.8rem',
            padding: '8px 12px',
            boxShadow: '0 4px 16px rgba(255, 152, 0, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #FFB74D, #FFCC02)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(255, 152, 0, 0.4)',
            },
          }}
        >
          Cambiar
        </Button>
      </Box>

      {/* 📊 Actividad Reciente */}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--revolutionary-radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            mb: 1,
            textAlign: 'center',
          }}
        >
          🎯 {mockWalletData.recentActivity.transactions} transacciones •
          Última: {mockWalletData.recentActivity.lastTransaction}
        </Typography>

        <Button
          onClick={onViewTransactions}
          variant="text"
          size="small"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.75rem',
            textTransform: 'none',
            width: '100%',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Ver todas las transacciones →
        </Button>
      </Box>

      {/* 🌟 Efecto de Resplandor Rotatorio */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120%',
          height: '120%',
          background: walletGradient,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'revolutionary-rotate-continuous 25s linear infinite',
          opacity: 0.1,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default WalletOverviewRevolutionary;
