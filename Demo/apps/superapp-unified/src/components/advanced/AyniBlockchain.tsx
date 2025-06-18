import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
  alpha,
  useTheme,
  Fade,
  CircularProgress,
  LinearProgress,
  Avatar,
  Tooltip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  CurrencyBitcoin,
  TrendingUp,
  SwapHoriz,
  Security,
  Verified,
  Timeline,
  AccountBalance,
  EmojiEvents,
  Star,
  Send,
  CallReceived,
  Group,
  Public,
  Insights,
  AutoAwesome,
  Diamond,
  Psychology,
} from '@mui/icons-material';

import { COSMIC_ELEMENTS, CosmicElement } from '../ui/CosmicThemeSwitcher';
import { useAyniIntelligence } from '../../hooks/useAyniIntelligence';

// Tipos para Blockchain Ayni
interface AyniToken {
  id: string;
  symbol: 'AYNI' | 'LUKAS' | 'ONDAS' | 'MERITOS';
  name: string;
  description: string;
  element: CosmicElement;
  totalSupply: number;
  circulatingSupply: number;
  currentPrice: number; // en términos de energía cósmica
  priceChange24h: number;
  marketCap: number;
  utility: string[];
  mintingRules: string[];
}

interface AyniTransaction {
  id: string;
  type: 'give' | 'receive' | 'exchange' | 'mint' | 'burn' | 'stake';
  fromAddress: string;
  toAddress: string;
  tokenSymbol: string;
  amount: number;
  purpose: string;
  elementCategory: CosmicElement;
  ayniScore: number; // -100 a 100
  bienComunImpact: number; // 0-100
  timestamp: Date;
  blockHeight: number;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed: number;
  validator: string;
}

interface AyniWallet {
  address: string;
  balances: Record<string, number>;
  ayniRating: number; // -1000 a 1000
  totalGiven: number;
  totalReceived: number;
  reciprocityRatio: number;
  stakingRewards: number;
  validatorStatus: 'none' | 'candidate' | 'active' | 'elder';
  cosmicSignature: string;
}

interface BlockchainMetrics {
  totalTransactions: number;
  totalAddresses: number;
  ayniCirculation: number;
  networkHealth: number;
  decentralizationIndex: number;
  carbonNegative: boolean;
  quantumResistance: number;
  consciousnessLevel: number;
}

interface SmartContract {
  id: string;
  name: string;
  purpose: string;
  element: CosmicElement;
  codeHash: string;
  deployedAt: Date;
  bienComunAlignment: number;
  executionCount: number;
  gasEfficiency: number;
}

interface AyniBlockchainProps {
  userId: string;
  walletAddress?: string;
  onTransactionSubmit?: (transaction: Partial<AyniTransaction>) => void;
}

export const AyniBlockchain: React.FC<AyniBlockchainProps> = ({
  userId,
  walletAddress = '0xAyni' + userId.slice(-6),
  onTransactionSubmit
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>('AYNI');
  const [transactionAmount, setTransactionAmount] = useState<number>(0);

  // Hook de inteligencia Ayni
  const { data: ayniData, recordAction } = useAyniIntelligence(userId);

  // Definición de tokens Ayni
  const ayniTokens = useMemo((): AyniToken[] => [
    {
      id: 'ayni',
      symbol: 'AYNI',
      name: 'Ayni Token',
      description: 'Token fundamental de reciprocidad que representa el equilibrio perfecto entre dar y recibir',
      element: 'ether',
      totalSupply: 21000000, // Número sagrado
      circulatingSupply: 8888888,
      currentPrice: 1.0, // Base de referencia
      priceChange24h: +3.33,
      marketCap: 8888888,
      utility: [
        'Medio de intercambio en la economía sagrada',
        'Staking para gobernanza descentralizada',
        'Pagos de gas en la red Ayni',
        'Rewards por mantener balance de reciprocidad'
      ],
      mintingRules: [
        'Se minta automáticamente al dar sin esperar recibir',
        'Se quema al recibir sin dar equivalente',
        'Algoritmo cuántico de balance energético',
        'Validación por consenso de sabiduría colectiva'
      ]
    },
    {
      id: 'lukas',
      symbol: 'LUKAS',
      name: 'Lükas Coin',
      description: 'Moneda de intercambio local para economías de transición y LETS comunitarios',
      element: 'tierra',
      totalSupply: 144000000, // 12^3 * 1000
      circulatingSupply: 33333333,
      currentPrice: 0.75,
      priceChange24h: +5.55,
      marketCap: 25000000,
      utility: [
        'Intercambios en redes LETS locales',
        'Pagos por servicios comunitarios',
        'Financiamiento de proyectos regenerativos',
        'Recompensas por agricultura consciente'
      ],
      mintingRules: [
        'Respaldado por recursos locales reales',
        'Emitido por cooperativas validadas',
        'Degradación automática para evitar acumulación',
        'Convertible a recursos tangibles'
      ]
    },
    {
      id: 'ondas',
      symbol: 'ONDAS',
      name: 'Öndas Energy',
      description: 'Unidades de energía vibracional que capturan y cuantifican la frecuencia de consciencia',
      element: 'aire',
      totalSupply: 999999999, // Casi infinito
      circulatingSupply: 108000000, // 108 mantras x 1M
      currentPrice: 0.11,
      priceChange24h: +11.11,
      marketCap: 11880000,
      utility: [
        'Medición de frecuencia de consciencia',
        'Acceso a experiencias de alta vibración',
        'Amplificación de intenciones colectivas',
        'Sincronización con ritmos cósmicos'
      ],
      mintingRules: [
        'Generación automática por meditación',
        'Multiplicación por sincronías detectadas',
        'Resonancia con frecuencias Solfeggio',
        'Validación por biometría de coherencia cardíaca'
      ]
    },
    {
      id: 'meritos',
      symbol: 'MERITOS',
      name: 'Mëritos Points',
      description: 'Puntos de mérito que reconocen contribuciones al Bien Común y evolución colectiva',
      element: 'fuego',
      totalSupply: 1000000000, // 1 billón
      circulatingSupply: 77777777,
      currentPrice: 2.22,
      priceChange24h: +7.77,
      marketCap: 172666666,
      utility: [
        'Reconocimiento de contribuciones al Bien Común',
        'Acceso a programas de liderazgo',
        'Gobernanza de proyectos comunitarios',
        'Certificación de competencias conscientes'
      ],
      mintingRules: [
        'Otorgados por impacto verificado',
        'Evaluación por pares en la comunidad',
        'Algoritmo de detección de Bien Común',
        'No transferibles (soul-bound tokens)'
      ]
    }
  ], []);

  // Wallet simulada del usuario
  const userWallet = useMemo((): AyniWallet => ({
    address: walletAddress,
    balances: {
      'AYNI': ayniData?.ayniBalance?.overall ? ayniData.ayniBalance.overall * 100 : 8500,
      'LUKAS': 1250,
      'ONDAS': 33333,
      'MERITOS': 777
    },
    ayniRating: ayniData?.ayniBalance?.overall ? (ayniData.ayniBalance.overall - 50) * 10 : 350,
    totalGiven: 25680,
    totalReceived: 22340,
    reciprocityRatio: 1.15, // Ligeramente más dado que recibido
    stakingRewards: 125.5,
    validatorStatus: 'candidate',
    cosmicSignature: `${ayniData?.smartInsights?.dominantElement || 'aire'}_${Date.now().toString().slice(-6)}`
  }), [walletAddress, ayniData]);

  // Métricas de la blockchain
  const blockchainMetrics = useMemo((): BlockchainMetrics => ({
    totalTransactions: 2888888,
    totalAddresses: 144000,
    ayniCirculation: 8888888,
    networkHealth: 98.7,
    decentralizationIndex: 94.4,
    carbonNegative: true,
    quantumResistance: 87.5,
    consciousnessLevel: 432 // Hz
  }), []);

  // Transacciones recientes simuladas
  const recentTransactions = useMemo((): AyniTransaction[] => [
    {
      id: 'tx_001',
      type: 'give',
      fromAddress: walletAddress,
      toAddress: '0xHealer888',
      tokenSymbol: 'AYNI',
      amount: 108,
      purpose: 'Sanación energética para la comunidad',
      elementCategory: 'agua',
      ayniScore: 15,
      bienComunImpact: 88,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      blockHeight: 888888,
      transactionHash: '0xA1B2C3...cosmic_love',
      status: 'confirmed',
      gasUsed: 0.001,
      validator: '0xWisdomKeeper'
    },
    {
      id: 'tx_002',
      type: 'receive',
      fromAddress: '0xMentor777',
      toAddress: walletAddress,
      tokenSymbol: 'ONDAS',
      amount: 432,
      purpose: 'Reconocimiento por facilitación grupal',
      elementCategory: 'aire',
      ayniScore: 8,
      bienComunImpact: 75,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      blockHeight: 888887,
      transactionHash: '0xD4E5F6...gratitude_flow',
      status: 'confirmed',
      gasUsed: 0.0008,
      validator: '0xEldersCouncil'
    },
    {
      id: 'tx_003',
      type: 'mint',
      fromAddress: '0x0000000000000000',
      toAddress: walletAddress,
      tokenSymbol: 'MERITOS',
      amount: 21,
      purpose: 'Proyecto de reforestación completado',
      elementCategory: 'tierra',
      ayniScore: 25,
      bienComunImpact: 96,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      blockHeight: 888850,
      transactionHash: '0xG7H8I9...earth_healing',
      status: 'confirmed',
      gasUsed: 0,
      validator: '0xGaiaProtocol'
    }
  ], [walletAddress]);

  // Contratos inteligentes activos
  const smartContracts = useMemo((): SmartContract[] => [
    {
      id: 'sc_001',
      name: 'ReciprocityOracle',
      purpose: 'Mide y valida el equilibrio de dar/recibir en tiempo real',
      element: 'ether',
      codeHash: '0xQuantumBalance432Hz',
      deployedAt: new Date('2024-01-01'),
      bienComunAlignment: 100,
      executionCount: 2888888,
      gasEfficiency: 99.7
    },
    {
      id: 'sc_002',
      name: 'ConsciousnessDAO',
      purpose: 'Gobernanza descentralizada basada en sabiduría colectiva',
      element: 'aire',
      codeHash: '0xWisdomCouncil528Hz',
      deployedAt: new Date('2024-02-14'),
      bienComunAlignment: 98,
      executionCount: 777777,
      gasEfficiency: 96.3
    },
    {
      id: 'sc_003',
      name: 'BienComunValidator',
      purpose: 'Evalúa automáticamente el impacto de Bien Común',
      element: 'fuego',
      codeHash: '0xGoodImpact741Hz',
      deployedAt: new Date('2024-03-21'),
      bienComunAlignment: 95,
      executionCount: 1234567,
      gasEfficiency: 94.8
    }
  ], []);

  // Manejar transacción
  const handleTransaction = (type: 'give' | 'receive' | 'exchange') => {
    setLoading(true);

    const newTransaction: Partial<AyniTransaction> = {
      type,
      fromAddress: type === 'receive' ? '0xCosmic888' : walletAddress,
      toAddress: type === 'receive' ? walletAddress : '0xCosmic888',
      tokenSymbol: selectedToken,
      amount: transactionAmount,
      purpose: `${type === 'give' ? 'Contribución' : 'Reconocimiento'} en la red Ayni`,
      elementCategory: (ayniData?.smartInsights?.dominantElement || 'aire') as CosmicElement,
      bienComunImpact: Math.floor(Math.random() * 40) + 60,
      timestamp: new Date()
    };

    recordAction({
      type: type === 'give' ? 'giving' : 'receiving',
      module: 'marketplace',
      value: transactionAmount / 10,
      metadata: {
        resourceType: 'ayni_blockchain_transaction',
        skillCategory: selectedToken.toLowerCase()
      }
    });

    onTransactionSubmit?.(newTransaction);

    setTimeout(() => {
      setLoading(false);
      setTransactionAmount(0);
    }, 3000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🔗 Blockchain Ayni
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Red descentralizada de reciprocidad cuántica y economía sagrada
        </Typography>

        {/* Métricas de red */}
        <Card sx={{ p: 2, mt: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {blockchainMetrics.totalTransactions.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                Transacciones Totales
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {blockchainMetrics.networkHealth}%
              </Typography>
              <Typography variant="caption">
                Salud de Red
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {blockchainMetrics.consciousnessLevel} Hz
              </Typography>
              <Typography variant="caption">
                Frecuencia de Consciencia
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                Carbono Negativo
              </Typography>
              <Typography variant="caption">
                Impacto Ambiental
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {blockchainMetrics.quantumResistance}%
              </Typography>
              <Typography variant="caption">
                Resistencia Cuántica
              </Typography>
            </Box>
          </Stack>
        </Card>
      </Box>

      {/* Wallet del Usuario */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          <AccountBalance sx={{ color: '#FFD700' }} />
          Tu Wallet Cósmica
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA726 100%)',
              fontSize: '1.5rem'
            }}
          >
            🏛️
          </Avatar>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Dirección: {userWallet.address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating Ayni: <strong style={{ color: userWallet.ayniRating > 0 ? '#4CAF50' : '#FF9800' }}>
                {userWallet.ayniRating > 0 ? '+' : ''}{userWallet.ayniRating}
              </strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: <Chip label={userWallet.validatorStatus} size="small" sx={{ ml: 0.5 }} />
            </Typography>
          </Box>

          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
              {userWallet.reciprocityRatio.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ratio Reciprocidad
            </Typography>
          </Box>
        </Stack>

        {/* Balances de tokens */}
        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            💰 Balances de Tokens:
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {ayniTokens.map((token) => {
              const balance = userWallet.balances[token.symbol] || 0;
              return (
                <Card
                  key={token.symbol}
                  sx={{
                    p: 2,
                    minWidth: 150,
                    background: alpha(COSMIC_ELEMENTS[token.element].color, 0.05),
                    border: selectedToken === token.symbol ? `2px solid ${COSMIC_ELEMENTS[token.element].color}` : '1px solid transparent',
                    cursor: 'pointer',
                    '&:hover': {
                      background: alpha(COSMIC_ELEMENTS[token.element].color, 0.1)
                    }
                  }}
                  onClick={() => setSelectedToken(token.symbol)}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: COSMIC_ELEMENTS[token.element].gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem'
                      }}
                    >
                      {token.symbol[0]}
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {token.symbol}
                    </Typography>
                  </Stack>
                  
                  <Typography variant="h6" fontWeight="bold" sx={{ color: COSMIC_ELEMENTS[token.element].color }}>
                    {balance.toLocaleString()}
                  </Typography>
                  
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                    <TrendingUp sx={{ fontSize: 14, color: token.priceChange24h > 0 ? '#4CAF50' : '#F44336' }} />
                    <Typography variant="caption" sx={{ color: token.priceChange24h > 0 ? '#4CAF50' : '#F44336' }}>
                      {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
                    </Typography>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        </Box>

        {/* Panel de transacciones rápidas */}
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            ⚡ Transacción Rápida:
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={() => handleTransaction('give')}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                  color: 'white'
                }}
              >
                Dar
              </Button>
              <Button
                variant="contained"
                startIcon={<CallReceived />}
                onClick={() => handleTransaction('receive')}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #03DAC6 100%)',
                  color: 'white'
                }}
              >
                Recibir
              </Button>
              <Button
                variant="contained"
                startIcon={<SwapHoriz />}
                onClick={() => handleTransaction('exchange')}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
                  color: 'white'
                }}
              >
                Intercambiar
              </Button>
            </Stack>
            
            {loading && <CircularProgress size={24} />}
          </Stack>
        </Box>
      </Card>

      {/* Tokens Ayni */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          <CurrencyBitcoin sx={{ color: '#FFD700' }} />
          Ecosistema de Tokens Ayni
        </Typography>

        <Stack spacing={3}>
          {ayniTokens.map((token) => (
            <Card
              key={token.id}
              sx={{
                p: 3,
                background: alpha(COSMIC_ELEMENTS[token.element].color, 0.05),
                border: `1px solid ${alpha(COSMIC_ELEMENTS[token.element].color, 0.2)}`
              }}
            >
              <Stack direction="row" spacing={3} alignItems="flex-start">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: COSMIC_ELEMENTS[token.element].gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {token.symbol[0]}
                </Box>

                <Box flex={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {token.name} ({token.symbol})
                      </Typography>
                      <Chip
                        label={COSMIC_ELEMENTS[token.element].name}
                        size="small"
                        sx={{
                          background: alpha(COSMIC_ELEMENTS[token.element].color, 0.2),
                          color: COSMIC_ELEMENTS[token.element].color
                        }}
                      />
                    </Box>
                    
                    <Box textAlign="right">
                      <Typography variant="h6" fontWeight="bold" sx={{ color: COSMIC_ELEMENTS[token.element].color }}>
                        ⚡ {token.currentPrice}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <TrendingUp sx={{ fontSize: 16, color: '#4CAF50' }} />
                        <Typography variant="caption" sx={{ color: '#4CAF50' }}>
                          +{token.priceChange24h}%
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {token.description}
                  </Typography>

                  <Stack direction="row" spacing={3} mt={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Suministro Circulante
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {token.circulatingSupply.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Market Cap
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ⚡ {token.marketCap.toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Card>

      {/* Transacciones Recientes */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center" gap={1}>
          <Timeline sx={{ color: '#2196F3' }} />
          Transacciones Recientes
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Propósito</TableCell>
                <TableCell>Ayni Score</TableCell>
                <TableCell>Bien Común</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Chip
                      label={tx.type}
                      size="small"
                      sx={{
                        background: tx.type === 'give' ? alpha('#4CAF50', 0.2) :
                                   tx.type === 'receive' ? alpha('#2196F3', 0.2) :
                                   alpha('#9C27B0', 0.2),
                        color: tx.type === 'give' ? '#4CAF50' :
                               tx.type === 'receive' ? '#2196F3' : '#9C27B0'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <strong>{tx.tokenSymbol}</strong>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {tx.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {tx.purpose}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontWeight="bold"
                      sx={{ color: tx.ayniScore > 0 ? '#4CAF50' : '#FF9800' }}
                    >
                      {tx.ayniScore > 0 ? '+' : ''}{tx.ayniScore}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <LinearProgress
                      variant="determinate"
                      value={tx.bienComunImpact}
                      sx={{
                        width: 60,
                        height: 6,
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {tx.bienComunImpact}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.status}
                      size="small"
                      sx={{
                        background: tx.status === 'confirmed' ? alpha('#4CAF50', 0.2) : alpha('#FF9800', 0.2),
                        color: tx.status === 'confirmed' ? '#4CAF50' : '#FF9800'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AyniBlockchain;