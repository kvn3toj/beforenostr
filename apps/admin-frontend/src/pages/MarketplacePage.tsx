import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
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
  Rating,
  Stack,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Store as StoreIcon,
  ShoppingCart as ProductIcon,
  Work as ServiceIcon,
  LocalOffer as OfferIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
interface MarketplaceItem {
  id: string
  title: string
  description: string
  type: 'PRODUCT' | 'SERVICE' | 'EXPERIENCE' | 'SKILL_EXCHANGE' | 'DIGITAL_CONTENT'
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'EXPIRED' | 'SUSPENDED'
  price: number
  currency: 'LUKAS' | 'USD' | 'EUR' | 'BTC' | 'ETH'
  condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR'
  category?: string
  tags: string[]
  images: string[]
  location?: string
  isShippingAvailable: boolean
  createdAt: string
  updatedAt: string
  seller: {
    id: string
    username: string
    email: string
    rating: number
    trustLevel: 'EMPRENDEDOR_CONFIABLE' | 'VERIFIED' | 'NEW' | 'SUSPENDED'
  }
  views: number
  favorites: number
  transactions: number
}

// Mock API functions
const fetchMarketplaceItems = async (): Promise<MarketplaceItem[]> => {
  return [
    {
      id: '1',
      title: 'Intercambio de Conocimiento: Programación Web',
      description: 'Ofrezco 10 horas de mentoría en desarrollo web usando React y TypeScript a cambio de clases de diseño gráfico',
      type: 'SKILL_EXCHANGE',
      status: 'ACTIVE',
      price: 0,
      currency: 'LUKAS',
      category: 'Educación',
      tags: ['programación', 'web', 'react', 'typescript', 'reciprocidad'],
      images: [],
      isShippingAvailable: false,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      seller: {
        id: '1',
        username: 'desarrollo_web_pro',
        email: 'dev@coomunity.com',
        rating: 4.8,
        trustLevel: 'EMPRENDEDOR_CONFIABLE'
      },
      views: 156,
      favorites: 23,
      transactions: 5
    },
    {
      id: '2',
      title: 'Huerto Orgánico Comunitario - Verduras Frescas',
      description: 'Verduras orgánicas cultivadas en nuestro huerto comunitario siguiendo principios de permacultura y Bien Común',
      type: 'PRODUCT',
      status: 'ACTIVE',
      price: 50,
      currency: 'LUKAS',
      condition: 'NEW',
      category: 'Alimentación',
      tags: ['orgánico', 'verduras', 'comunidad', 'sustentable', 'bien-común'],
      images: [],
      location: 'Huerto Central CoomÜnity',
      isShippingAvailable: true,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-14',
      seller: {
        id: '2',
        username: 'huerto_comunitario',
        email: 'huerto@coomunity.com',
        rating: 4.9,
        trustLevel: 'EMPRENDEDOR_CONFIABLE'
      },
      views: 89,
      favorites: 15,
      transactions: 12
    },
    {
      id: '3',
      title: 'Experiencia de Meditación y Reconexión',
      description: 'Sesión grupal de meditación y prácticas de reconexión con la naturaleza basadas en sabiduría ancestral',
      type: 'EXPERIENCE',
      status: 'ACTIVE',
      price: 25,
      currency: 'LUKAS',
      category: 'Bienestar',
      tags: ['meditación', 'naturaleza', 'ancestral', 'reconexión', 'bienestar'],
      images: [],
      location: 'Espacio Natural CoomÜnity',
      isShippingAvailable: false,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-13',
      seller: {
        id: '3',
        username: 'guia_espiritual',
        email: 'meditacion@coomunity.com',
        rating: 5.0,
        trustLevel: 'EMPRENDEDOR_CONFIABLE'
      },
      views: 234,
      favorites: 45,
      transactions: 8
    }
  ]
}

const createMarketplaceItem = async (itemData: Partial<MarketplaceItem>): Promise<MarketplaceItem> => {
  console.log('Creating marketplace item:', itemData)
  return { ...itemData, id: Date.now().toString() } as MarketplaceItem
}

const updateMarketplaceItem = async (id: string, itemData: Partial<MarketplaceItem>): Promise<MarketplaceItem> => {
  console.log('Updating marketplace item:', id, itemData)
  return { ...itemData, id } as MarketplaceItem
}

const deleteMarketplaceItem = async (id: string): Promise<void> => {
  console.log('Deleting marketplace item:', id)
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

export const MarketplacePage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [filterType, setFilterType] = useState<string>('ALL')

  const queryClient = useQueryClient()

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: fetchMarketplaceItems,
  })

  const createMutation = useMutation({
    mutationFn: createMarketplaceItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-items'] })
      setIsDialogOpen(false)
      toast.success('Item del marketplace creado exitosamente')
    },
    onError: () => {
      toast.error('Error al crear el item del marketplace')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MarketplaceItem> }) =>
      updateMarketplaceItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-items'] })
      setIsDialogOpen(false)
      toast.success('Item del marketplace actualizado exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar el item del marketplace')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMarketplaceItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-items'] })
      setIsDeleteDialogOpen(false)
      toast.success('Item del marketplace eliminado exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar el item del marketplace')
    },
  })

  // Filter items based on selected filters
  const filteredItems = items.filter(item => {
    const statusMatch = filterStatus === 'ALL' || item.status === filterStatus
    const typeMatch = filterType === 'ALL' || item.type === filterType
    return statusMatch && typeMatch
  })

  const handleCreateItem = () => {
    setSelectedItem(null)
    setIsDialogOpen(true)
  }

  const handleEditItem = (item: MarketplaceItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDeleteItem = (item: MarketplaceItem) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = (formData: Partial<MarketplaceItem>) => {
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT': return <ProductIcon />
      case 'SERVICE': return <ServiceIcon />
      case 'EXPERIENCE': return <OfferIcon />
      case 'SKILL_EXCHANGE': return <TrendingIcon />
      case 'DIGITAL_CONTENT': return <StoreIcon />
      default: return <StoreIcon />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success'
      case 'DRAFT': return 'warning'
      case 'SOLD': return 'primary'
      case 'EXPIRED': return 'error'
      case 'SUSPENDED': return 'error'
      case 'INACTIVE': return 'default'
      default: return 'default'
    }
  }

  const getTrustLevelColor = (trustLevel: string) => {
    switch (trustLevel) {
      case 'EMPRENDEDOR_CONFIABLE': return 'success'
      case 'VERIFIED': return 'primary'
      case 'NEW': return 'warning'
      case 'SUSPENDED': return 'error'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Error al cargar el marketplace. Por favor, intenta nuevamente.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          <StoreIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          GMP - Gamified Match Place
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateItem}
          sx={{ borderRadius: 2 }}
        >
          Crear Item
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StoreIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {items.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {items.filter(item => item.status === 'ACTIVE').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {items.reduce((acc, item) => acc + item.transactions, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Transacciones
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <OfferIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {items.filter(item => item.seller.trustLevel === 'EMPRENDEDOR_CONFIABLE').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Emprendedores Confiables
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Estado"
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="ACTIVE">Activo</MenuItem>
                <MenuItem value="DRAFT">Borrador</MenuItem>
                <MenuItem value="SOLD">Vendido</MenuItem>
                <MenuItem value="EXPIRED">Expirado</MenuItem>
                <MenuItem value="SUSPENDED">Suspendido</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Tipo"
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="PRODUCT">Producto</MenuItem>
                <MenuItem value="SERVICE">Servicio</MenuItem>
                <MenuItem value="EXPERIENCE">Experiencia</MenuItem>
                <MenuItem value="SKILL_EXCHANGE">Intercambio de Habilidades</MenuItem>
                <MenuItem value="DIGITAL_CONTENT">Contenido Digital</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Vista de Cards" />
          <Tab label="Vista de Tabla" />
          <Tab label="Estadísticas Detalladas" />
        </Tabs>

        {/* Tab 1: Card View */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {filteredItems.map((item) => (
              <Grid xs={12} md={6} lg={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {item.title}
                      </Typography>
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status) as any}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {item.description.length > 100
                        ? `${item.description.substring(0, 100)}...`
                        : item.description
                      }
                    </Typography>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        icon={getTypeIcon(item.type)}
                        label={item.type.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={item.seller.trustLevel}
                        size="small"
                        color={getTrustLevelColor(item.seller.trustLevel) as any}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {item.price > 0 ? `${item.price} ${item.currency}` : 'Intercambio'}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Rating value={item.seller.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          ({item.seller.rating})
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        <strong>Vendedor:</strong> {item.seller.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.views} vistas
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} mt={2}>
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                      {item.tags.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{item.tags.length - 3} más
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>

                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => handleEditItem(item)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteItem(item)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                    >
                      <ViewIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 2: Table View */}
        <TabPanel value={currentTab} index={1}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Vendedor</TableCell>
                  <TableCell>Confiabilidad</TableCell>
                  <TableCell>Vistas</TableCell>
                  <TableCell>Transacciones</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {item.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getTypeIcon(item.type)}
                        label={item.type.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        color={getStatusColor(item.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {item.price > 0 ? `${item.price} ${item.currency}` : 'Intercambio'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 1, width: 24, height: 24 }}>
                          {item.seller.username[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {item.seller.username}
                          </Typography>
                          <Rating value={item.seller.rating} precision={0.1} size="small" readOnly />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.seller.trustLevel}
                        size="small"
                        color={getTrustLevelColor(item.seller.trustLevel) as any}
                      />
                    </TableCell>
                    <TableCell>{item.views}</TableCell>
                    <TableCell>{item.transactions}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditItem(item)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(item)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 3: Detailed Statistics */}
        <TabPanel value={currentTab} index={2}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribución por Tipo
                  </Typography>
                  {['PRODUCT', 'SERVICE', 'EXPERIENCE', 'SKILL_EXCHANGE', 'DIGITAL_CONTENT'].map(type => {
                    const count = items.filter(item => item.type === type).length
                    const percentage = items.length > 0 ? (count / items.length * 100).toFixed(1) : 0
                    return (
                      <Box key={type} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{type.replace('_', ' ')}</Typography>
                        <Typography variant="body2">{count} ({percentage}%)</Typography>
                      </Box>
                    )
                  })}
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Nivel de Confianza
                  </Typography>
                  {['EMPRENDEDOR_CONFIABLE', 'VERIFIED', 'NEW', 'SUSPENDED'].map(level => {
                    const count = items.filter(item => item.seller.trustLevel === level).length
                    const percentage = items.length > 0 ? (count / items.length * 100).toFixed(1) : 0
                    return (
                      <Box key={level} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{level.replace('_', ' ')}</Typography>
                        <Typography variant="body2">{count} ({percentage}%)</Typography>
                      </Box>
                    )
                  })}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Create/Edit Dialog */}
      <MarketplaceItemDialog
        open={isDialogOpen}
        item={selectedItem}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el item "{selectedItem?.title}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => selectedItem && deleteMutation.mutate(selectedItem.id)}
            color="error"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={20} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Marketplace Item Dialog Component
interface MarketplaceItemDialogProps {
  open: boolean
  item: MarketplaceItem | null
  onClose: () => void
  onSubmit: (data: Partial<MarketplaceItem>) => void
  isLoading: boolean
}

const MarketplaceItemDialog: React.FC<MarketplaceItemDialogProps> = ({
  open,
  item,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Partial<MarketplaceItem>>({
    title: '',
    description: '',
    type: 'PRODUCT',
    status: 'DRAFT',
    price: 0,
    currency: 'LUKAS',
    category: '',
    tags: [],
    isShippingAvailable: false,
  })

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        type: item.type,
        status: item.status,
        price: item.price,
        currency: item.currency,
        category: item.category,
        tags: item.tags,
        isShippingAvailable: item.isShippingAvailable,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'PRODUCT',
        status: 'DRAFT',
        price: 0,
        currency: 'LUKAS',
        category: '',
        tags: [],
        isShippingAvailable: false,
      })
    }
  }, [item, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {item ? 'Editar Item del Marketplace' : 'Crear Nuevo Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  label="Tipo"
                >
                  <MenuItem value="PRODUCT">Producto</MenuItem>
                  <MenuItem value="SERVICE">Servicio</MenuItem>
                  <MenuItem value="EXPERIENCE">Experiencia</MenuItem>
                  <MenuItem value="SKILL_EXCHANGE">Intercambio de Habilidades</MenuItem>
                  <MenuItem value="DIGITAL_CONTENT">Contenido Digital</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  label="Estado"
                >
                  <MenuItem value="DRAFT">Borrador</MenuItem>
                  <MenuItem value="ACTIVE">Activo</MenuItem>
                  <MenuItem value="INACTIVE">Inactivo</MenuItem>
                  <MenuItem value="SUSPENDED">Suspendido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0
                })}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                  label="Moneda"
                >
                  <MenuItem value="LUKAS">Lükas</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="BTC">BTC</MenuItem>
                  <MenuItem value="ETH">ETH</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Categoría"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : (item ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default MarketplacePage
