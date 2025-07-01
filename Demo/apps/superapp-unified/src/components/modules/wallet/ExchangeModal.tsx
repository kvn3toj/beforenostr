import React, { useState, useMemo } from 'react';
import {
  TextField,
  Button,
  Box,
  Stack,
  Typography,
  IconButton,
  MenuItem,
} from '@mui/material';
import { SwapVert } from '@mui/icons-material';
import BaseModal from '../../common/BaseModal';

// In a real app, this would come from an API
const MOCK_EXCHANGE_RATE = 4000; // 1 USD = 4000 COP (example)

interface ExchangeModalProps {
  open: boolean;
  onClose: () => void;
  onExchange: (from: string, to: string, amount: number) => void;
  currencies: string[];
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  open,
  onClose,
  onExchange,
  currencies,
}) => {
  const [fromCurrency, setFromCurrency] = useState(currencies[0] || '');
  const [toCurrency, setToCurrency] = useState(currencies[1] || '');
  const [amount, setAmount] = useState(0);

  const estimatedResult = useMemo(() => {
    if (!amount || fromCurrency === toCurrency) return 0;
    // This is a simplified logic. A real app would have a matrix of rates.
    return fromCurrency === 'USD'
      ? amount * MOCK_EXCHANGE_RATE
      : amount / MOCK_EXCHANGE_RATE;
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (amount > 0) {
      onExchange(fromCurrency, toCurrency, amount);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Intercambiar Monedas">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} alignItems="center">
          <TextField
            select
            fullWidth
            label="Desde"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <IconButton onClick={handleSwapCurrencies}>
            <SwapVert />
          </IconButton>

          <TextField
            select
            fullWidth
            label="Hacia"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            fullWidth
            label="Monto a intercambiar"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            InputProps={{ inputProps: { min: 0.01, step: 'any' } }}
          />

          <Typography variant="body1" color="text.secondary">
            Recibirás aproximadamente: {estimatedResult.toFixed(2)} {toCurrency}
          </Typography>

          <Box sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} color="secondary" sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={amount <= 0}>
              Intercambiar
            </Button>
          </Box>
        </Stack>
      </form>
    </BaseModal>
  );
};

export default ExchangeModal;
