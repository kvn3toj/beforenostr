import React from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Chip,
  AlertTitle,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  Send,
  AttachMoney,
  Euro,
} from '@mui/icons-material';

// 🎯 Tipos de notificación de transacción
type TransactionNotificationType = 'success' | 'error' | 'info' | 'warning';

interface TransactionNotificationProps {
  open: boolean;
  onClose: () => void;
  type: TransactionNotificationType;
  transaction?: {
    amount: number;
    currency: 'COP' | 'UC';
    recipientName?: string;
    transactionType: 'transfer' | 'payment' | 'reward';
  };
  message?: string;
  autoHideDuration?: number;
}

export const TransactionNotification: React.FC<TransactionNotificationProps> = ({
  open,
  onClose,
  type,
  transaction,
  message,
  autoHideDuration = 6000,
}) => {
  // 🎨 Configuración visual por tipo de transacción
  const getTransactionConfig = (transactionType: string) => {
    switch (transactionType) {
      case 'transfer':
        return { icon: <Send fontSize="small" />, label: 'Transferencia', color: 'primary' };
      case 'payment':
        return { icon: <AttachMoney fontSize="small" />, label: 'Pago', color: 'success' };
      case 'reward':
        return { icon: <Euro fontSize="small" />, label: 'Recompensa', color: 'warning' };
      default:
        return { icon: <Send fontSize="small" />, label: 'Transacción', color: 'primary' };
    }
  };

  // 💰 Formatear moneda
  const formatCurrency = (amount: number, currency: 'COP' | 'UC') => {
    if (currency === 'UC') {
      return `${amount} ÜCoins`;
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // 📝 Generar mensaje automático basado en la transacción
  const getAutoMessage = () => {
    if (!transaction) return message || 'Operación completada';

    const config = getTransactionConfig(transaction.transactionType);
    const amount = formatCurrency(transaction.amount, transaction.currency);
    
    switch (type) {
      case 'success':
        return transaction.recipientName
          ? `${config.label} exitosa de ${amount} a ${transaction.recipientName}`
          : `${config.label} de ${amount} procesada exitosamente`;
      
      case 'error':
        return `Error al procesar ${config.label.toLowerCase()} de ${amount}`;
      
      case 'info':
        return `${config.label} de ${amount} está siendo procesada`;
      
      case 'warning':
        return `Verifica los datos de la ${config.label.toLowerCase()} de ${amount}`;
      
      default:
        return message || 'Operación en proceso';
    }
  };

  // 🎯 Obtener icono principal por tipo de notificación
  const getMainIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'info':
        return <Info />;
      case 'warning':
        return <Error />;
      default:
        return <Info />;
    }
  };

  // 🌈 Obtener configuración de severidad para MUI Alert
  const getSeverity = (): 'success' | 'error' | 'info' | 'warning' => {
    return type;
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }} // Margen superior para evitar superposición con header
    >
      <Alert
        onClose={onClose}
        severity={getSeverity()}
        icon={getMainIcon()}
        sx={{
          width: '100%',
          maxWidth: 400,
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
        variant="filled"
      >
        <AlertTitle sx={{ mb: 1 }}>
          {type === 'success' && '✅ Transacción Exitosa'}
          {type === 'error' && '❌ Error en Transacción'}
          {type === 'info' && 'ℹ️ Procesando Transacción'}
          {type === 'warning' && '⚠️ Verificar Transacción'}
        </AlertTitle>

        <Typography variant="body2" gutterBottom>
          {getAutoMessage()}
        </Typography>

        {/* 📊 Detalles adicionales de la transacción */}
        {transaction && (
          <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={getTransactionConfig(transaction.transactionType).icon}
              label={getTransactionConfig(transaction.transactionType).label}
              size="small"
              color={getTransactionConfig(transaction.transactionType).color as any}
              variant="outlined"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'inherit',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            />
            
            <Chip
              label={transaction.currency === 'UC' ? '🪙 ÜCoins' : '💰 COP'}
              size="small"
              variant="outlined"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'inherit',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            />
          </Box>
        )}

        {/* 🎯 Mensaje adicional para ÜCoins (filosofía Reciprocidad) */}
        {transaction?.currency === 'UC' && type === 'success' && (
          <Typography variant="caption" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
            🌟 Esta transacción en ÜCoins fortalece el ecosistema de reciprocidad (Reciprocidad) de CoomÜnity
          </Typography>
        )}
      </Alert>
    </Snackbar>
  );
}; 