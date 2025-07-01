import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Button,
  IconButton,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Collapse,
  Alert,
  Pagination,
  Tooltip,
  Badge,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Send,
  Download,
  SwapHoriz,
  CheckCircle,
  Error,
  Warning,
  Pending,
  Search,
  FilterList,
  ExpandMore,
  ExpandLess,
  AttachMoney,
  Euro,
  Star,
  Lightbulb,
  Nature,
  Groups,
  Receipt,
  Share,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';

// 🎯 Tipos para transacciones CoomÜnity
interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'exchange' | 'reward' | 'reciprocidad';
  amount: number;
  currency: 'COP' | 'UC' | 'MERITOS' | 'ONDAS';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  from?: string;
  to?: string;
  reciprocidadScore?: number;
  bienComunContribution?: boolean;
  category?: string;
  metadata?: {
    exchangeRate?: number;
    originalAmount?: number;
    originalCurrency?: string;
    fees?: number;
  };
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
  onExportHistory?: () => void;
}

// 🎨 Configuración de tipos de transacción con terminología CoomÜnity
const TRANSACTION_TYPES = {
  income: {
    icon: <TrendingUp />,
    color: 'success',
    label: 'Ingreso',
    description: 'Dinero recibido',
  },
  expense: {
    icon: <TrendingDown />,
    color: 'error',
    label: 'Gasto',
    description: 'Dinero enviado',
  },
  transfer: {
    icon: <Send />,
    color: 'primary',
    label: 'Transferencia',
    description: 'Envío entre usuarios',
  },
  exchange: {
    icon: <SwapHoriz />,
    color: 'warning',
    label: 'Intercambio',
    description: 'Conversión de monedas',
  },
  reward: {
    icon: <Star />,
    color: 'secondary',
    label: 'Recompensa',
    description: 'Mëritos por contribución',
  },
  reciprocidad: {
    icon: <Nature />,
    color: 'info',
    label: 'Reciprocidad',
    description: 'Intercambio equilibrado',
  },
} as const;

const STATUS_CONFIG = {
  completed: { icon: <CheckCircle />, color: 'success', label: 'Completada' },
  pending: { icon: <Pending />, color: 'warning', label: 'Pendiente' },
  failed: { icon: <Error />, color: 'error', label: 'Fallida' },
  processing: { icon: <Warning />, color: 'info', label: 'Procesando' },
} as const;

// 💰 Formatear monedas con terminología CoomÜnity
const formatCurrency = (amount: number, currency: string) => {
  switch (currency) {
    case 'UC':
      return `${amount} ÜCoins`;
    case 'MERITOS':
      return `${amount} Mëritos`;
    case 'ONDAS':
      return `${amount} Öndas`;
    case 'COP':
    default:
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(amount);
  }
};

// 📅 Formatear fechas en español
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return 'Hoy';
  if (isThisWeek(date)) return format(date, 'EEEE', { locale: es });
  if (isThisMonth(date)) return format(date, 'd MMM', { locale: es });
  return format(date, 'd MMM yyyy', { locale: es });
};

// 🎨 Componente para item de transacción individual
const TransactionItem: React.FC<{
  transaction: Transaction;
  onClick?: () => void;
}> = ({ transaction, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = TRANSACTION_TYPES[transaction.type];
  const statusConfig = STATUS_CONFIG[transaction.status];

  const isPositive = ['income', 'reward', 'reciprocidad'].includes(transaction.type);
  const displayAmount = Math.abs(transaction.amount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          mb: 1,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          '&:hover': onClick
            ? {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              }
            : {},
          border: 1,
          borderColor: 'divider',
        }}
        onClick={onClick}
      >
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* 🎯 Avatar con icono de tipo */}
            <Avatar
              sx={{
                bgcolor: `${typeConfig.color}.main`,
                width: 48,
                height: 48,
              }}
            >
              {typeConfig.icon}
            </Avatar>

            {/* 📝 Información principal */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 0.5,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {transaction.description}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={isPositive ? 'success.main' : 'error.main'}
                  sx={{ ml: 1 }}
                >
                  {isPositive ? '+' : '-'}
                  {formatCurrency(displayAmount, transaction.currency)}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={typeConfig.label}
                  size="small"
                  color={typeConfig.color as any}
                  variant="outlined"
                />
                <Chip
                  icon={statusConfig.icon}
                  label={statusConfig.label}
                  size="small"
                  color={statusConfig.color as any}
                  variant="filled"
                  sx={{ fontSize: '0.7rem' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(transaction.date)}
                </Typography>
                {transaction.bienComunContribution && (
                  <Tooltip title="Contribución al Bien Común">
                    <Chip
                      label="🌟 Bien Común"
                      size="small"
                      sx={{
                        bgcolor: 'success.50',
                        color: 'success.main',
                        fontSize: '0.7rem',
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>

              {/* 👥 Información de participantes */}
              {(transaction.from || transaction.to) && (
                <Box sx={{ mt: 1 }}>
                  {transaction.from && (
                    <Typography variant="caption" color="text.secondary">
                      De: {transaction.from}
                    </Typography>
                  )}
                  {transaction.to && (
                    <Typography variant="caption" color="text.secondary">
                      Para: {transaction.to}
                    </Typography>
                  )}
                </Box>
              )}

              {/* 🌟 Métricas Reciprocidad */}
              {transaction.reciprocidadScore && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={<Nature />}
                    label={`Reciprocidad Score: ${transaction.reciprocidadScore}/10`}
                    size="small"
                    sx={{
                      bgcolor: 'info.50',
                      color: 'info.main',
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* 🔽 Botón para expandir detalles */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          {/* 📋 Detalles expandidos */}
          <Collapse in={expanded}>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ID de Transacción
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {transaction.id}
                </Typography>
              </Box>

              {transaction.metadata && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Detalles Adicionales
                  </Typography>
                  {transaction.metadata.exchangeRate && (
                    <Typography variant="body2">
                      Tasa de cambio: {transaction.metadata.exchangeRate}
                    </Typography>
                  )}
                  {transaction.metadata.fees && (
                    <Typography variant="body2">
                      Comisión:{' '}
                      {formatCurrency(transaction.metadata.fees, 'COP')}
                    </Typography>
                  )}
                </Box>
              )}

              <Stack direction="row" spacing={1}>
                <Button size="small" startIcon={<Receipt />}>
                  Ver Recibo
                </Button>
                <Button size="small" startIcon={<Share />}>
                  Compartir
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// 🔍 Componente para filtros y búsqueda
const TransactionFilters: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedCurrency,
  onCurrencyChange,
}) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
        Filtros de Búsqueda
      </Typography>

      <Stack spacing={2}>
        {/* 🔍 Búsqueda por texto */}
        <TextField
          placeholder="Buscar por descripción, destinatario..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          fullWidth
        />

        {/* 🏷️ Filtros por categoría */}
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={selectedType}
              label="Tipo"
              onChange={(e) => onTypeChange(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(TRANSACTION_TYPES).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  {config.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedStatus}
              label="Estado"
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <MenuItem key={key} value={key}>
                  {config.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Moneda</InputLabel>
            <Select
              value={selectedCurrency}
              label="Moneda"
              onChange={(e) => onCurrencyChange(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="COP">🇨🇴 Pesos</MenuItem>
              <MenuItem value="UC">🪙 ÜCoins</MenuItem>
              <MenuItem value="MERITOS">⭐ Mëritos</MenuItem>
              <MenuItem value="ONDAS">🌊 Öndas</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

// 📊 Componente para estadísticas rápidas
const TransactionStats: React.FC<{
  transactions: Transaction[];
}> = ({ transactions }) => {
  const stats = useMemo(() => {
    const income = transactions
      .filter(
        (t) => ['income', 'reward'].includes(t.type) && t.status === 'completed'
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(
        (t) =>
          ['expense', 'transfer'].includes(t.type) && t.status === 'completed'
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const reciprocidadTransactions = transactions.filter(
      (t) => t.type === 'reciprocidad'
    ).length;
    const bienComunContributions = transactions.filter(
      (t) => t.bienComunContribution
    ).length;

    return { income, expenses, reciprocidadTransactions, bienComunContributions };
  }, [transactions]);

  return (
    <Card
      sx={{
        mb: 3,
        bgcolor: 'primary.50',
        border: 1,
        borderColor: 'primary.200',
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          color="primary.main"
        >
          📊 Resumen del Período
        </Typography>
        <Stack direction="row" spacing={3} flexWrap="wrap">
          <Box>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {formatCurrency(stats.income, 'COP')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ingresos
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="error.main">
              {formatCurrency(stats.expenses, 'COP')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Gastos
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="info.main">
              {stats.reciprocidadTransactions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Intercambios Reciprocidad
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="warning.main">
              {stats.bienComunContributions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Bien Común
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// 🎨 Componente principal TransactionHistory
export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions = [],
  isLoading = false,
  onTransactionClick,
  onExportHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔍 Filtrar transacciones
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.to?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !selectedType || transaction.type === selectedType;
      const matchesStatus =
        !selectedStatus || transaction.status === selectedStatus;
      const matchesCurrency =
        !selectedCurrency || transaction.currency === selectedCurrency;

      return matchesSearch && matchesType && matchesStatus && matchesCurrency;
    });
  }, [
    transactions,
    searchTerm,
    selectedType,
    selectedStatus,
    selectedCurrency,
  ]);

  // 📄 Paginación
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <Box>
      {/* 📊 Estadísticas generales */}
      <TransactionStats transactions={transactions} />

      {/* 🔍 Filtros de búsqueda */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
      />

      {/* 📋 Header de la lista */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Historial de Transacciones ({filteredTransactions.length})
        </Typography>
        {onExportHistory && (
          <Button
            startIcon={<Download />}
            onClick={onExportHistory}
            variant="outlined"
            size="small"
          >
            Exportar
          </Button>
        )}
      </Box>

      {/* 📝 Lista de transacciones */}
      {isLoading ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Cargando transacciones...</Typography>
          </CardContent>
        </Card>
      ) : filteredTransactions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No se encontraron transacciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {transactions.length === 0
                ? 'Aún no tienes transacciones registradas'
                : 'Intenta ajustar los filtros de búsqueda'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <AnimatePresence>
            {paginatedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onClick={
                  onTransactionClick
                    ? () => onTransactionClick(transaction)
                    : undefined
                }
              />
            ))}
          </AnimatePresence>

          {/* 📄 Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
