import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { 
  AccountBalanceWallet, 
  TrendingUp, 
  History, 
  Add, 
  Remove,
  SwapHoriz 
} from '@mui/icons-material';
import { apiService } from '../services/api.service';

interface Wallet {
  id: string;
  userId: string;
  blockchainAddress?: string;
  balanceUnits: number;
  balanceToins: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
    username: string;
  };
}

interface Transaction {
  id: string;
  fromUserId?: string | null;
  toUserId?: string | null;
  amount: number;
  tokenType: string;
  type: string;
  status: string;
  description?: string | null;
  createdAt: string;
  fromUser?: {
    email: string;
    name: string;
  };
  toUser?: {
    email: string;
    name: string;
  };
}

const fetchWallets = async (): Promise<Wallet[]> => {
  return apiService.get<Wallet[]>('/wallets/admin/all');
};

const fetchTransactions = async (): Promise<Transaction[]> => {
  return apiService.get<Transaction[]>('/transactions/admin/all');
};

const getTransactionIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pay':
    case 'payment':
      return <SwapHoriz sx={{ fontSize: 20, color: 'info.main' }} />;
    case 'recharge':
    case 'deposit':
      return <Add sx={{ fontSize: 20, color: 'success.main' }} />;
    case 'withdraw':
    case 'withdrawal':
      return <Remove sx={{ fontSize: 20, color: 'error.main' }} />;
    case 'convert':
      return <SwapHoriz sx={{ fontSize: 20, color: 'warning.main' }} />;
    case 'exchange':
      return <SwapHoriz sx={{ fontSize: 20, color: 'primary.main' }} />;
    default:
      return <History sx={{ fontSize: 20 }} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'FAILED':
      return 'error';
    default:
      return 'default';
  }
};

export const WalletPage: React.FC = () => {
  const {
    data: wallets,
    isLoading: isLoadingWallets,
    error: walletsError,
  } = useQuery({
    queryKey: ['wallets-admin'],
    queryFn: fetchWallets,
  });

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ['transactions-admin'],
    queryFn: fetchTransactions,
    retry: false,
  });

  if (isLoadingWallets) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (walletsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading wallet data: {walletsError instanceof Error ? 
            walletsError.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  // Calcular totales basados en los balances de wallets
  const totalUnits = wallets?.reduce((sum, wallet) => sum + wallet.balanceUnits, 0) || 0;
  const totalToins = wallets?.reduce((sum, wallet) => sum + wallet.balanceToins, 0) || 0;
  const activeWallets = wallets?.filter(wallet => wallet.status === 'ACTIVE').length || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Wallets del Sistema
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestión de billeteras y transacciones del sistema
      </Typography>

      {/* Balance Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Units
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalUnits.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Unidades circulantes
                  </Typography>
                </Box>
                <AccountBalanceWallet sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total TOINs
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalToins.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Tokens de intercambio
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Wallets Activos
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {activeWallets}
                  </Typography>
                  <Typography variant="body2" color="info.main">
                    De {wallets?.length || 0} totales
                  </Typography>
                </Box>
                <History sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Wallets */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Wallets
          </Typography>
          
          {wallets && wallets.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Dirección Blockchain</TableCell>
                    <TableCell align="right">Balance Units</TableCell>
                    <TableCell align="right">Balance TOINs</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha de Creación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        {wallet.user ? (
                          <Box>
                            <Typography variant="body2">{wallet.user.name || wallet.user.username}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {wallet.user.email}
                            </Typography>
                          </Box>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {wallet.blockchainAddress ? 
                            `${wallet.blockchainAddress.substring(0, 6)}...${wallet.blockchainAddress.substring(wallet.blockchainAddress.length - 4)}` 
                            : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {wallet.balanceUnits.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          {wallet.balanceToins.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={wallet.status} 
                          size="small" 
                          color={wallet.status === 'ACTIVE' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(wallet.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay wallets disponibles en el sistema.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Historial de Transacciones */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historial de Transacciones
          </Typography>
          
          {isLoadingTransactions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Cargando transacciones...
              </Typography>
            </Box>
          ) : transactionsError ? (
            <Alert severity="warning" sx={{ mt: 2 }}>
              No se pudieron cargar las transacciones. Mostrando solo datos de wallets.
            </Alert>
          ) : transactions && transactions.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>De</TableCell>
                    <TableCell>Para</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell>Token</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTransactionIcon(transaction.type)}
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {transaction.type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {transaction.fromUser ? (
                          <Typography variant="body2">
                            {transaction.fromUser.name || transaction.fromUser.email}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sistema
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.toUser ? (
                          <Typography variant="body2">
                            {transaction.toUser.name || transaction.toUser.email}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sistema
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {transaction.amount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {transaction.tokenType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.status} 
                          size="small" 
                          color={getStatusColor(transaction.status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay transacciones disponibles en el sistema.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 