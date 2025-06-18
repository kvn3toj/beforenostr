import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
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
  Grid,
  Stack,
  LinearProgress,
  Switch,
  FormControlLabel,
  Badge,
  IconButton,
  Divider,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  MonitorHeart as MonitorIcon,
  Speed as PerformanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Computer as CPUIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'

// Types
interface SystemHealth {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL'
  uptime: number
  lastCheck: string
  services: ServiceStatus[]
  metrics: SystemMetrics
  alerts: SystemAlert[]
}

interface ServiceStatus {
  name: string
  status: 'UP' | 'DOWN' | 'DEGRADED'
  responseTime: number
  lastCheck: string
  url?: string
  version?: string
  dependencies?: string[]
}

interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    loadAverage: number[]
  }
  memory: {
    used: number
    total: number
    available: number
    percentage: number
  }
  storage: {
    used: number
    total: number
    percentage: number
  }
  network: {
    inbound: number
    outbound: number
    activeConnections: number
  }
  database: {
    connections: number
    maxConnections: number
    queryTime: number
    slowQueries: number
  }
}

interface SystemAlert {
  id: string
  type: 'ERROR' | 'WARNING' | 'INFO'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  message: string
  service?: string
  timestamp: string
  resolved: boolean
}

// Mock API functions
const fetchSystemHealth = async (): Promise<SystemHealth> => {
  return {
    status: 'HEALTHY',
    uptime: 2847392, // seconds
    lastCheck: new Date().toISOString(),
    services: [
      {
        name: 'Backend NestJS',
        status: 'UP',
        responseTime: 45,
        lastCheck: new Date().toISOString(),
        url: 'http://localhost:3002',
        version: '1.0.0',
        dependencies: ['PostgreSQL', 'Redis', 'Prisma']
      },
      {
        name: 'PostgreSQL Database',
        status: 'UP',
        responseTime: 12,
        lastCheck: new Date().toISOString(),
        version: '15.0',
        dependencies: []
      },
      {
        name: 'Redis Cache',
        status: 'UP',
        responseTime: 8,
        lastCheck: new Date().toISOString(),
        version: '7.2',
        dependencies: []
      },
      {
        name: 'Admin Frontend',
        status: 'UP',
        responseTime: 123,
        lastCheck: new Date().toISOString(),
        url: 'http://localhost:3000',
        version: '1.0.0',
        dependencies: ['Backend NestJS']
      },
      {
        name: 'SuperApp Frontend',
        status: 'UP',
        responseTime: 98,
        lastCheck: new Date().toISOString(),
        url: 'http://localhost:3001',
        version: '1.0.0',
        dependencies: ['Backend NestJS']
      },
      {
        name: 'File Storage',
        status: 'DEGRADED',
        responseTime: 1250,
        lastCheck: new Date().toISOString(),
        dependencies: []
      }
    ],
    metrics: {
      cpu: {
        usage: 34.5,
        cores: 8,
        loadAverage: [1.2, 1.5, 1.8]
      },
      memory: {
        used: 6442450944, // bytes
        total: 17179869184,
        available: 10737418240,
        percentage: 37.5
      },
      storage: {
        used: 85899345920,
        total: 214748364800,
        percentage: 40.0
      },
      network: {
        inbound: 1048576, // bytes/sec
        outbound: 524288,
        activeConnections: 156
      },
      database: {
        connections: 23,
        maxConnections: 100,
        queryTime: 45.2,
        slowQueries: 3
      }
    },
    alerts: [
      {
        id: '1',
        type: 'WARNING',
        severity: 'MEDIUM',
        message: 'File Storage response time is above normal threshold (1.25s)',
        service: 'File Storage',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        resolved: false
      },
      {
        id: '2',
        type: 'INFO',
        severity: 'LOW',
        message: 'System backup completed successfully',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolved: true
      },
      {
        id: '3',
        type: 'WARNING',
        severity: 'MEDIUM',
        message: 'Database has 3 slow queries detected in the last hour',
        service: 'PostgreSQL Database',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        resolved: false
      }
    ]
  }
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

export const MonitoringPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const { data: systemHealth, isLoading, error, refetch } = useQuery({
    queryKey: ['system-health'],
    queryFn: fetchSystemHealth,
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds if auto-refresh is enabled
  })

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UP':
      case 'HEALTHY': return 'success'
      case 'DEGRADED':
      case 'WARNING': return 'warning'
      case 'DOWN':
      case 'CRITICAL': return 'error'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UP':
      case 'HEALTHY': return <CheckIcon color="success" />
      case 'DEGRADED':
      case 'WARNING': return <WarningIcon color="warning" />
      case 'DOWN':
      case 'CRITICAL': return <ErrorIcon color="error" />
      default: return <InfoIcon />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'ERROR': return <ErrorIcon color="error" />
      case 'WARNING': return <WarningIcon color="warning" />
      case 'INFO': return <InfoIcon color="info" />
      default: return <InfoIcon />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'error'
      case 'HIGH': return 'error'
      case 'MEDIUM': return 'warning'
      case 'LOW': return 'info'
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
        Error al cargar el estado del sistema. Por favor, intenta nuevamente.
      </Alert>
    )
  }

  if (!systemHealth) return null

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          <MonitorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Monitoreo del Sistema CoomÜnity
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            }
            label="Auto-actualización"
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            sx={{ borderRadius: 2 }}
          >
            Actualizar
          </Button>
        </Stack>
      </Box>

      {/* System Status Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          {getStatusIcon(systemHealth.status)}
          <Typography variant="h5" fontWeight="bold" sx={{ ml: 1 }}>
            Estado del Sistema: {systemHealth.status}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {formatUptime(systemHealth.uptime)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tiempo Activo
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {systemHealth.services.filter(s => s.status === 'UP').length}/{systemHealth.services.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Servicios Activos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {systemHealth.alerts.filter(a => !a.resolved).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Alertas Activas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold">
                {new Date(systemHealth.lastCheck).toLocaleTimeString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Última Verificación
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Servicios" />
          <Tab label="Métricas del Sistema" />
          <Tab label="Alertas" />
          <Tab label="Performance" />
        </Tabs>

        {/* Tab 1: Services */}
        <TabPanel value={currentTab} index={0}>
          <Grid container spacing={3}>
            {systemHealth.services.map((service, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getStatusIcon(service.status)}
                      <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
                        {service.name}
                      </Typography>
                      <Chip
                        label={service.status}
                        size="small"
                        color={getStatusColor(service.status) as any}
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Stack spacing={1}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Tiempo de Respuesta:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {service.responseTime}ms
                        </Typography>
                      </Box>
                      
                      {service.version && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Versión:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {service.version}
                          </Typography>
                        </Box>
                      )}
                      
                      {service.url && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            URL:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem' }}>
                            {service.url}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Última Verificación:
                        </Typography>
                        <Typography variant="caption">
                          {new Date(service.lastCheck).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      {service.dependencies && service.dependencies.length > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Dependencias:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {service.dependencies.map((dep, idx) => (
                              <Chip key={idx} label={dep} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 2: System Metrics */}
        <TabPanel value={currentTab} index={1}>
          <Grid container spacing={3}>
            {/* CPU Metrics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CPUIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      CPU
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Uso de CPU</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {systemHealth.metrics.cpu.usage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={systemHealth.metrics.cpu.usage}
                      color={systemHealth.metrics.cpu.usage > 80 ? 'error' : systemHealth.metrics.cpu.usage > 60 ? 'warning' : 'success'}
                    />
                  </Box>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Núcleos:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {systemHealth.metrics.cpu.cores}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Carga Promedio:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {systemHealth.metrics.cpu.loadAverage.join(', ')}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Memory Metrics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <MemoryIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Memoria
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Uso de Memoria</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {systemHealth.metrics.memory.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={systemHealth.metrics.memory.percentage}
                      color={systemHealth.metrics.memory.percentage > 85 ? 'error' : systemHealth.metrics.memory.percentage > 70 ? 'warning' : 'success'}
                    />
                  </Box>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Usada:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatBytes(systemHealth.metrics.memory.used)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Total:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatBytes(systemHealth.metrics.memory.total)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Disponible:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatBytes(systemHealth.metrics.memory.available)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Storage Metrics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <StorageIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Almacenamiento
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Uso de Disco</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {systemHealth.metrics.storage.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={systemHealth.metrics.storage.percentage}
                      color={systemHealth.metrics.storage.percentage > 90 ? 'error' : systemHealth.metrics.storage.percentage > 75 ? 'warning' : 'success'}
                    />
                  </Box>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Usado:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatBytes(systemHealth.metrics.storage.used)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Total:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatBytes(systemHealth.metrics.storage.total)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Network & Database Metrics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <NetworkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Red y Base de Datos
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tráfico de Red
                      </Typography>
                      <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Entrada:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {formatBytes(systemHealth.metrics.network.inbound)}/s
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Salida:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {formatBytes(systemHealth.metrics.network.outbound)}/s
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Conexiones Activas:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {systemHealth.metrics.network.activeConnections}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Base de Datos
                      </Typography>
                      <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Conexiones:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {systemHealth.metrics.database.connections}/{systemHealth.metrics.database.maxConnections}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Tiempo de Query:</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {systemHealth.metrics.database.queryTime}ms
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Queries Lentas:</Typography>
                          <Typography variant="body2" fontWeight="bold" color={systemHealth.metrics.database.slowQueries > 5 ? 'error' : 'inherit'}>
                            {systemHealth.metrics.database.slowQueries}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Alerts */}
        <TabPanel value={currentTab} index={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Severidad</TableCell>
                  <TableCell>Mensaje</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {systemHealth.alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getAlertIcon(alert.type)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {alert.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.severity}
                        size="small"
                        color={getSeverityColor(alert.severity) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {alert.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {alert.service && (
                        <Chip label={alert.service} size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(alert.timestamp).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.resolved ? 'Resuelto' : 'Activo'}
                        size="small"
                        color={alert.resolved ? 'success' : 'error'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab 4: Performance */}
        <TabPanel value={currentTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PerformanceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Resumen de Performance
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold" color="success.main">
                          {systemHealth.services.filter(s => s.status === 'UP').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Servicios Activos
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold">
                          {Math.round(systemHealth.services.reduce((acc, s) => acc + s.responseTime, 0) / systemHealth.services.length)}ms
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tiempo Resp. Promedio
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold" color={systemHealth.metrics.cpu.usage > 80 ? 'error.main' : 'success.main'}>
                          {systemHealth.metrics.cpu.usage}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Uso de CPU
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box textAlign="center">
                        <Typography variant="h5" fontWeight="bold" color={systemHealth.metrics.memory.percentage > 85 ? 'error.main' : 'success.main'}>
                          {systemHealth.metrics.memory.percentage}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Uso de Memoria
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  )
}

export default MonitoringPage 