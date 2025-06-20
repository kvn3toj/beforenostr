import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Grid,
  Stack,
  LinearProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  AccountBalance as WalletIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as TransferIcon,
  AttachMoney as MoneyIcon,
  EmojiEvents as RewardIcon,
  ShoppingCart as PurchaseIcon,
  EmojiEvents,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'MERIT' | 'TRANSFER' | 'PURCHASE' | 'REWARD' | 'REFUND' | 'PENALTY'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  description: string
  meritSlug?: string
  sourceWalletId?: string
  destinationWalletId?: string
  relatedEntityType?: string
  relatedEntityId?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string
    email: string
  }
  sourceWallet?: {
    id: string
    meritSlug: string
    balance: number
  }
  destinationWallet?: {
    id: string
    meritSlug: string
    balance: number
  }
}

interface TransactionStats {
  totalTransactions: number
  totalAmount: number
  completedTransactions: number
  pendingTransactions: number
  failedTransactions: number
  averageAmount: number
  transactionsByType: Record<string, number>
  transactionsByStatus: Record<string, number>
}

// Mock API functions
const fetchTransactions = async (): Promise<Transaction[]> => {
  return [
    {
      id: '1',
      userId: '1',
      amount: 50,
      type: 'REWARD',
      status: 'COMPLETED',
      description: 'Recompensa por completar desafío "Ayni Explorer"',
      meritSlug: 'AYNI_POINTS',
      relatedEntityType: 'Challenge',
      relatedEntityId: 'challenge_1',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      user: {
        id: '1',
        username: 'jugador1',
        email: 'jugador1@coomunity.com'
      },
      destinationWallet: {
        id: 'wallet_1',
        meritSlug: 'AYNI_POINTS',
        balance: 150
      }
    },
    {
      id: '2',
      userId: '2',
      amount: 25,
      type: 'PURCHASE',
      status: 'COMPLETED',
      description: 'Compra: Experiencia de Meditación y Reconexión',
      meritSlug: 'LUKAS',
      relatedEntityType: 'MarketplaceItem',
      relatedEntityId: 'item_3',
      createdAt: '2024-01-14T15:45:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      user: {
        id: '2',
        username: 'meditador_activo',
        email: 'meditador@coomunity.com'
      },
      sourceWallet: {
        id: 'wallet_2',
        meritSlug: 'LUKAS',
        balance: 75
      }
    },
    {
      id: '3',
      userId: '1',
      amount: 100,
      type: 'MERIT',
      status: 'COMPLETED',
      description: 'Méritos por contribuir al Bien Común - Proyecto Huerto Comunitario',
      meritSlug: 'MERITOS',
      relatedEntityType: 'CommunityProject',
      relatedEntityId: 'project_1',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      user: {
        id: '1',
        username: 'jugador1',
        email: 'jugador1@coomunity.com'
      },
      destinationWallet: {
        id: 'wallet_3',
        meritSlug: 'MERITOS',
        balance: 350
      }
    },
    {
      id: '4',
      userId: '3',
      amount: 15,
      type: 'TRANSFER',
      status: 'PENDING',
      description: 'Transferencia de Lükas para intercambio de habilidades',
      meritSlug: 'LUKAS',
      sourceWalletId: 'wallet_4',
      destinationWalletId: 'wallet_5',
      createdAt: '2024-01-12T16:20:00Z',
      updatedAt: '2024-01-12T16:20:00Z',
      user: {
        id: '3',
        username: 'intercambio_pro',
        email: 'intercambio@coomunity.com'
      },
      sourceWallet: {
        id: 'wallet_4',
        meritSlug: 'LUKAS',
        balance: 85
      },
      destinationWallet: {
        id: 'wallet_5',
        meritSlug: 'LUKAS',
        balance: 120
      }
    }
  ]
}

const fetchTransactionStats = async (): Promise<TransactionStats> => {
  return {
    totalTransactions: 156,
    totalAmount: 2450,
    completedTransactions: 142,
    pendingTransactions: 8,
    failedTransactions: 6,
    averageAmount: 15.7,
    transactionsByType: {
      MERIT: 45,
      REWARD: 38,
      PURCHASE: 32,
      TRANSFER: 28,
      REFUND: 8,
      PENALTY: 5
    },
    transactionsByStatus: {
      COMPLETED: 142,
      PENDING: 8,
      FAILED: 6,
      CANCELLED: 0
    }
  }
}

const createTransaction = async (transactionData: Partial<Transaction>): Promise<Transaction> => {
  console.log('Creating transaction:', transactionData)
  return { ...transactionData, id: Date.now().toString() } as Transaction
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
)

export const TransactionsPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterUser, setFilterUser] = useState<string>('')

  const queryClient = useQueryClient()

  const { data: transactions = [], isLoading: loadingTransactions, error: transactionsError } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  })

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['transaction-stats'],
    queryFn: fetchTransactionStats,
  })

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] })
      setIsDialogOpen(false)
      toast.success('Transacción creada exitosamente')
    },
    onError: () => {
      toast.error('Error al crear la transacción')
    },
  })

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filterType === 'ALL' || transaction.type === filterType
    const statusMatch = filterStatus === 'ALL' || transaction.status === filterStatus
    const userMatch = !filterUser || 
      transaction.user.username.toLowerCase().includes(filterUser.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(filterUser.toLowerCase())
    
    return typeMatch && statusMatch && userMatch
  })

  const handleCreateTransaction = () => {
    setSelectedTransaction(null)
    setIsDialogOpen(true)
  }

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  const handleSubmit = (formData: Partial<Transaction>) => {
    createMutation.mutate(formData)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MERIT': return <RewardIcon color="success" />
      case 'REWARD': return <RewardIcon color="warning" />
      case 'PURCHASE': return <PurchaseIcon color="primary" />
      case 'TRANSFER': return <TransferIcon color="info" />
      case 'REFUND': return <TrendingUpIcon color="success" />
      case 'PENALTY': return <TrendingDownIcon color="error" />
      default: return <MoneyIcon />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success'
      case 'PENDING': return 'warning'
      case 'FAILED': return 'error'
      case 'CANCELLED': return 'default'
      default: return 'default'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MERIT': return 'success'
      case 'REWARD': return 'warning'
      case 'PURCHASE': return 'primary'
      case 'TRANSFER': return 'info'
      case 'REFUND': return 'success'
      case 'PENALTY': return 'error'
      default: return 'default'
    }
  }

  const formatAmount = (amount: number, type: string) => {
    const sign = ['PURCHASE', 'PENALTY', 'TRANSFER'].includes(type) ? '-' : '+'
    return `${sign}${amount}`
  }

  if (loadingTransactions || loadingStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (transactionsError) {
    return (
      <Alert severity="error">
        Error al cargar las transacciones. Por favor, intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          <WalletIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Gestión de Transacciones CoomÜnity
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTransaction}
          sx={{ borderRadius: 2 }}
        >
          Nueva Transacción
        </Button>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <WalletIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalTransactions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Transacciones
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <MoneyIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Volumen Total
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.completedTransactions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completadas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <TransferIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.pendingTransactions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pendientes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Tipo"
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="MERIT">Mérito</MenuItem>
                <MenuItem value="REWARD">Recompensa</MenuItem>
                <MenuItem value="PURCHASE">Compra</MenuItem>
                <MenuItem value="TRANSFER">Transferencia</MenuItem>
                <MenuItem value="REFUND">Reembolso</MenuItem>
                <MenuItem value="PENALTY">Penalización</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Estado"
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="COMPLETED">Completada</MenuItem>
                <MenuItem value="PENDING">Pendiente</MenuItem>
                <MenuItem value="FAILED">Fallida</MenuItem>
                <MenuItem value="CANCELLED">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Buscar Usuario"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              placeholder="Nombre o email"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Lista de Transacciones" />
          <Tab label="Estadísticas Detalladas" />
          <Tab label="Análisis por Tipo" />
        </Tabs>

        {/* Tab 1: Transactions List */}
        <TabPanel value={currentTab} index={0}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {transaction.user.username[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {transaction.user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transaction.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getTypeIcon(transaction.type)}
                        label={transaction.type}
                        size="small"
                        color={getTypeColor(transaction.type) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={['PURCHASE', 'PENALTY', 'TRANSFER'].includes(transaction.type) ? 'error' : 'success'}
                      >
                        {formatAmount(transaction.amount, transaction.type)} {transaction.meritSlug || 'Lükas'}
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
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {transaction.description.length > 50
                          ? `${transaction.description.substring(0, 50)}...`
                          : transaction.description
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(transaction.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewTransaction(transaction)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 2: Detailed Statistics */}
        <TabPanel value={currentTab} index={1}>
          {stats && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Distribución por Estado
                    </Typography>
                    {Object.entries(stats.transactionsByStatus).map(([status, count]) => {
                      const percentage = stats.totalTransactions > 0 ? (count / stats.totalTransactions * 100).toFixed(1) : 0
                      return (
                        <Box key={status} mb={2}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">{status}</Typography>
                            <Typography variant="body2">{count} ({percentage}%)</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Number(percentage)}
                            color={getStatusColor(status) as any}
                          />
                        </Box>
                      )
                    })}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Distribución por Tipo
                    </Typography>
                    {Object.entries(stats.transactionsByType).map(([type, count]) => {
                      const percentage = stats.totalTransactions > 0 ? (count / stats.totalTransactions * 100).toFixed(1) : 0
                      return (
                        <Box key={type} mb={2}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">{type}</Typography>
                            <Typography variant="body2">{count} ({percentage}%)</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Number(percentage)}
                            color={getTypeColor(type) as any}
                          />
                        </Box>
                      )
                    })}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Métricas Generales
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Monto Promedio
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {stats.averageAmount.toFixed(2)} Lükas
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Tasa de Éxito
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          {((stats.completedTransactions / stats.totalTransactions) * 100).toFixed(1)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Transacciones Fallidas
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="error.main">
                          {stats.failedTransactions}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Pendientes
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="warning.main">
                          {stats.pendingTransactions}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Tab 3: Analysis by Type */}
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            {['MERIT', 'REWARD', 'PURCHASE', 'TRANSFER', 'REFUND', 'PENALTY'].map(type => {
              const typeTransactions = transactions.filter(t => t.type === type)
              const typeAmount = typeTransactions.reduce((sum, t) => sum + t.amount, 0)
              const avgAmount = typeTransactions.length > 0 ? typeAmount / typeTransactions.length : 0
              
              return (
                <Grid item xs={12} sm={6} md={4} key={type}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        {getTypeIcon(type)}
                        <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
                          {type}
                        </Typography>
                      </Box>
                      <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Cantidad:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {typeTransactions.length}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Volumen Total:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {typeAmount.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Promedio:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {avgAmount.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Transaction Detail Dialog */}
      <TransactionDialog
        open={isDialogOpen}
        transaction={selectedTransaction}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </Box>
  )
}

// Transaction Dialog Component
interface TransactionDialogProps {
  open: boolean
  transaction: Transaction | null
  onClose: () => void
  onSubmit: (data: Partial<Transaction>) => void
  isLoading: boolean
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  transaction,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const isViewMode = !!transaction

  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: 0,
    type: 'MERIT',
    description: '',
    meritSlug: 'LUKAS',
  })

  React.useEffect(() => {
    if (transaction) {
      setFormData(transaction)
    } else {
      setFormData({
        amount: 0,
        type: 'MERIT',
        description: '',
        meritSlug: 'LUKAS',
      })
    }
  }, [transaction, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isViewMode) {
      onSubmit(formData)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isViewMode ? 'Detalle de Transacción' : 'Nueva Transacción'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {isViewMode && transaction && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Información de Usuario
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2 }}>
                      {transaction.user.username[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {transaction.user.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {transaction.user.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID Transacción
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {transaction.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado
                  </Typography>
                  <Chip
                    label={transaction.status}
                    color={getStatusColor(transaction.status) as any}
                    size="small"
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monto"
                type="number"
                value={formData.amount || 0}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  amount: parseFloat(e.target.value) || 0 
                })}
                disabled={isViewMode}
                required={!isViewMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isViewMode}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  label="Tipo"
                >
                  <MenuItem value="MERIT">Mérito</MenuItem>
                  <MenuItem value="REWARD">Recompensa</MenuItem>
                  <MenuItem value="PURCHASE">Compra</MenuItem>
                  <MenuItem value="TRANSFER">Transferencia</MenuItem>
                  <MenuItem value="REFUND">Reembolso</MenuItem>
                  <MenuItem value="PENALTY">Penalización</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                disabled={isViewMode}
                required={!isViewMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isViewMode}>
                <InputLabel>Tipo de Mérito</InputLabel>
                <Select
                  value={formData.meritSlug}
                  onChange={(e) => setFormData({ ...formData, meritSlug: e.target.value })}
                  label="Tipo de Mérito"
                >
                  <MenuItem value="LUKAS">Lükas</MenuItem>
                  <MenuItem value="MERITOS">Méritos</MenuItem>
                  <MenuItem value="AYNI_POINTS">Puntos Ayni</MenuItem>
                  <MenuItem value="ONDAS">Öndas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {isViewMode && transaction && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Fechas
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Creada
                  </Typography>
                  <Typography variant="body1">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Actualizada
                  </Typography>
                  <Typography variant="body1">
                    {new Date(transaction.updatedAt).toLocaleString()}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            {isViewMode ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!isViewMode && (
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Crear'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'COMPLETED': return 'success'
    case 'PENDING': return 'warning'
    case 'FAILED': return 'error'
    case 'CANCELLED': return 'default'
    default: return 'default'
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'MERIT': return 'success'
    case 'REWARD': return 'warning'
    case 'PURCHASE': return 'primary'
    case 'TRANSFER': return 'info'
    case 'REFUND': return 'success'
    case 'PENALTY': return 'error'
    default: return 'default'
  }
}

export default TransactionsPage