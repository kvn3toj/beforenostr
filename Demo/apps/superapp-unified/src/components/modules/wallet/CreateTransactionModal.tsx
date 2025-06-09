import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  Send,
  AccountBalanceWallet,
  Euro,
  AttachMoney,
  Person,
  Description,
  Close,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddTransaction } from '../../../hooks/useRealBackendData';
import { useAuth } from '../../../contexts/AuthContext';
import { TransactionNotification } from './TransactionNotification';

// 🎯 Schema de validación para transacciones
const transactionSchema = z.object({
  toUserId: z.string().min(1, 'Destinatario es requerido'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  currency: z.enum(['COP', 'UC'], {
    errorMap: () => ({ message: 'Selecciona una moneda válida' })
  }),
  description: z.string().min(1, 'Descripción es requerida').max(200, 'Descripción muy larga'),
  type: z.enum(['transfer', 'payment', 'reward'], {
    errorMap: () => ({ message: 'Selecciona un tipo válido' })
  }),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface CreateTransactionModalProps {
  open: boolean;
  onClose: () => void;
  walletBalance?: {
    balance: number;
    ucoins: number;
  };
}

// 🧑‍🤝‍🧑 Usuarios simulados para autocompletado (en producción vendrían del backend)
const mockUsers = [
  { id: 'user-1', name: 'María González', email: 'maria@coomunity.com' },
  { id: 'user-2', name: 'Carlos López', email: 'carlos@coomunity.com' },
  { id: 'user-3', name: 'Ana Rodríguez', email: 'ana@coomunity.com' },
  { id: 'user-4', name: 'Luis Martínez', email: 'luis@coomunity.com' },
  { id: 'user-5', name: 'Sofia Castro', email: 'sofia@coomunity.com' },
];

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  open,
  onClose,
  walletBalance = { balance: 0, ucoins: 0 }
}) => {
  const { user } = useAuth();
  const addTransactionMutation = useAddTransaction();
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    transaction?: any;
    message?: string;
  }>({
    open: false,
    type: 'success',
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      toUserId: '',
      amount: 0,
      currency: 'COP',
      description: '',
      type: 'transfer',
    },
  });

  const watchedCurrency = watch('currency');
  const watchedAmount = watch('amount');

  // 💰 Calcular balance disponible según la moneda seleccionada
  const getAvailableBalance = () => {
    return watchedCurrency === 'UC' ? walletBalance.ucoins : walletBalance.balance;
  };

  // 🎨 Obtener configuración visual por tipo de transacción
  const getTransactionTypeConfig = (type: string) => {
    switch (type) {
      case 'transfer':
        return { icon: <Send />, color: 'primary', label: 'Transferencia' };
      case 'payment':
        return { icon: <AttachMoney />, color: 'success', label: 'Pago' };
      case 'reward':
        return { icon: <Euro />, color: 'warning', label: 'Recompensa' };
      default:
        return { icon: <Send />, color: 'primary', label: 'Transferencia' };
    }
  };

  // 📤 Manejar envío de transacción
  const onSubmit = async (data: TransactionFormData) => {
    if (!user?.id) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      // Mostrar notificación de procesamiento
      setNotification({
        open: true,
        type: 'info',
        transaction: {
          amount: data.amount,
          currency: data.currency,
          recipientName: selectedUser?.name,
          transactionType: data.type,
        },
      });

      await addTransactionMutation.mutateAsync({
        userId: user.id,
        transaction: {
          ...data,
          toUserId: selectedUser?.id || data.toUserId,
        },
      });

      // ✅ Éxito: mostrar notificación, cerrar modal y resetear formulario
      setNotification({
        open: true,
        type: 'success',
        transaction: {
          amount: data.amount,
          currency: data.currency,
          recipientName: selectedUser?.name,
          transactionType: data.type,
        },
      });

      reset();
      setSelectedUser(null);
      onClose();
    } catch (error) {
      console.error('❌ Error creando transacción:', error);
      
      // ❌ Error: mostrar notificación de error
      setNotification({
        open: true,
        type: 'error',
        transaction: {
          amount: data.amount,
          currency: data.currency,
          recipientName: selectedUser?.name,
          transactionType: data.type,
        },
      });
    }
  };

  // 🚫 Manejar cierre del modal
  const handleClose = () => {
    reset();
    setSelectedUser(null);
    onClose();
  };

  // 🎯 Verificar si hay balance suficiente
  const hasInsufficientBalance = watchedAmount > getAvailableBalance();

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: '600px',
          },
        }}
      >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceWallet sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Nueva Transacción
            </Typography>
          </Box>
          <Button onClick={handleClose} sx={{ minWidth: 'auto', p: 1 }}>
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            {/* 🎯 Información de balance actual */}
            <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Balance Disponible
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    ${walletBalance.balance.toLocaleString('es-CO')} COP
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {walletBalance.ucoins} ÜCoins
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* 👤 Selección de destinatario */}
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Destinatario
              </Typography>
              <Autocomplete
                options={mockUsers}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                value={selectedUser}
                onChange={(_, newValue) => setSelectedUser(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar usuario..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography variant="body1" fontWeight="medium">
                      {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                )}
              />
              {!selectedUser && (
                <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                  Selecciona un destinatario válido
                </Typography>
              )}
            </Box>

            <Divider />

            {/* 💰 Monto y moneda */}
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Monto
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      placeholder="0.00"
                      error={!!errors.amount || hasInsufficientBalance}
                      helperText={
                        errors.amount?.message || 
                        (hasInsufficientBalance ? 'Balance insuficiente' : '')
                      }
                      sx={{ flex: 2 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {watchedCurrency === 'UC' ? '🪙' : '$'}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>Moneda</InputLabel>
                      <Select {...field} label="Moneda">
                        <MenuItem value="COP">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            💰 COP
                          </Box>
                        </MenuItem>
                        <MenuItem value="UC">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            🪙 ÜCoins
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              {/* 📊 Información de balance para moneda seleccionada */}
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Disponible: {watchedCurrency === 'UC' ? 
                    `${walletBalance.ucoins} ÜCoins` : 
                    `$${walletBalance.balance.toLocaleString('es-CO')} COP`
                  }
                </Typography>
              </Box>
            </Box>

            {/* 🎯 Tipo de transacción */}
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Tipo de Transacción
              </Typography>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['transfer', 'payment', 'reward'].map((type) => {
                      const config = getTransactionTypeConfig(type);
                      return (
                        <Chip
                          key={type}
                          icon={config.icon}
                          label={config.label}
                          onClick={() => field.onChange(type)}
                          color={field.value === type ? (config.color as any) : 'default'}
                          variant={field.value === type ? 'filled' : 'outlined'}
                          sx={{ cursor: 'pointer' }}
                        />
                      );
                    })}
                  </Box>
                )}
              />
            </Box>

            {/* 📝 Descripción */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  placeholder="Describe el motivo de la transacción..."
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* ⚠️ Advertencias y validaciones */}
            {hasInsufficientBalance && (
              <Alert severity="error">
                <Typography variant="body2">
                  <strong>Balance insuficiente.</strong> Tu balance actual es de{' '}
                  {watchedCurrency === 'UC' ? 
                    `${walletBalance.ucoins} ÜCoins` : 
                    `$${walletBalance.balance.toLocaleString('es-CO')} COP`
                  }.
                </Typography>
              </Alert>
            )}

            {watchedCurrency === 'UC' && (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>ÜCoins:</strong> Esta transacción utilizará la moneda interna de CoomÜnity.
                  Los ÜCoins están diseñados para fomentar la reciprocidad (Ayni) en nuestra comunidad.
                </Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined" size="large">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isValid || !selectedUser || hasInsufficientBalance || addTransactionMutation.isPending}
            startIcon={addTransactionMutation.isPending ? <CircularProgress size={20} /> : <Send />}
            sx={{ minWidth: 140 }}
          >
            {addTransactionMutation.isPending ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>

    {/* 🔔 Sistema de notificaciones */}
    <TransactionNotification
      open={notification.open}
      onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      type={notification.type}
      transaction={notification.transaction}
      message={notification.message}
    />
  </>
);
}; 