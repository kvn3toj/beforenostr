import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Avatar,
  Paper,
  useTheme,
  alpha,
  Skeleton,
  Stack,
  PaletteColor,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Send,
  SwapHoriz,
  Star,
  Nature,
  CheckCircle,
  Schedule,
  Error,
  SyncAlt,
  Public,
  Receipt,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Transaction } from '../../../types/wallet';
import { formatPrice } from '../../../utils/numberUtils';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

type PaletteColorKey = 'success' | 'error' | 'primary' | 'warning' | 'secondary' | 'info' | 'default';

const TRANSACTION_VISUALS: Record<Transaction['type'] | 'default', { icon: React.ReactElement; color: PaletteColorKey }> = {
  income: { icon: <TrendingUp />, color: 'success' },
  expense: { icon: <TrendingDown />, color: 'error' },
  transfer: { icon: <Send />, color: 'primary' },
  exchange: { icon: <SwapHoriz />, color: 'warning' },
  reward: { icon: <Star />, color: 'secondary' },
  reciprocidad: { icon: <Nature />, color: 'info' },
  default: { icon: <Public />, color: 'default' },
};

const STATUS_VISUALS: Record<Transaction['status'], { icon: React.ReactElement; color: PaletteColorKey; label: string }> = {
  completed: { icon: <CheckCircle />, color: 'success' as const, label: 'Completada' },
  pending: { icon: <Schedule />, color: 'warning' as const, label: 'Pendiente' },
  failed: { icon: <Error />, color: 'error' as const, label: 'Fallida' },
  processing: { icon: <SyncAlt />, color: 'info' as const, label: 'Procesando' },
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const theme = useTheme();
  const visuals = TRANSACTION_VISUALS[transaction.type] || TRANSACTION_VISUALS.default;
  const status = STATUS_VISUALS[transaction.status];
  const isPositive = ['income', 'reward', 'reciprocidad'].includes(transaction.type);

  const colorKey = visuals.color;
  const avatarColor = colorKey === 'default' ? theme.palette.grey[500] : (theme.palette[colorKey] as PaletteColor).main;
  const avatarBgColor = colorKey === 'default' ? theme.palette.grey[100] : alpha((theme.palette[colorKey] as PaletteColor).main, 0.1);

  return (
    <ListItem
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        my: 1,
        py: 2,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        borderRadius: 3,
        '&:hover': {
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
        },
      }}
      secondaryAction={
        <Stack alignItems="flex-end">
          <Typography variant="h6" fontWeight="bold" color={isPositive ? 'success.main' : 'text.primary'}>
            {isPositive ? '+' : '-'}
            {formatPrice(Math.abs(transaction.amount), transaction.currency)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(transaction.date), 'd MMM, yyyy - p', { locale: es })}
          </Typography>
        </Stack>
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: avatarBgColor, color: avatarColor }}>
          {visuals.icon}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle1" fontWeight="bold">
            {transaction.description}
          </Typography>
        }
        secondary={
          <Chip
            icon={status.icon}
            label={status.label}
            color={status.color}
            size="small"
            variant="outlined"
          />
        }
      />
    </ListItem>
  );
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions = [],
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <Paper
      id="transaction-history"
      sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, background: 'transparent', boxShadow: 'none' }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Historial de Transacciones
      </Typography>
      {isLoading ? (
        <Stack spacing={2}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={70} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      ) : transactions.length === 0 ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            py: 8,
            textAlign: 'center',
            color: 'text.secondary',
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 2,
            mt: 2,
          }}
        >
          <Receipt sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" fontWeight="medium">
            No hay transacciones todavía
          </Typography>
          <Typography variant="body2">
            Cuando realices tu primera transacción, aparecerá aquí.
          </Typography>
        </Stack>
      ) : (
        <List disablePadding>
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </List>
      )}
    </Paper>
  );
};

export default TransactionHistory;
