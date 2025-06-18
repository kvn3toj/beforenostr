import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Divider,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as PerformanceIcon,
  Storage as DatabaseIcon,
  Cloud as ServerIcon,
  Security as SecurityIcon,
  People as UsersIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'

// Types
interface SystemMetrics {
  serverHealth: {
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL'
    uptime: number
    cpu: number
    memory: number
    disk: number
    network: number
  }
  databaseHealth: {
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL'
    connections: number
    maxConnections: number
    queryTime: number
    cacheHitRate: number
  }
  applicationMetrics: {
    activeUsers: number
    requestsPerMinute: number
    errorRate: number
    responseTime: number
    sessionsActive: number
  }
  gameMetrics: {
    challengesCompleted: number
    meritsAwarded: number
    marketplaceTransactions: number
    studyRoomsActive: number
    notificationsSent: number
  }
  security: {
    status: 'SECURE' | 'VULNERABLE' | 'CRITICAL'
    lastSecurityScan: string
    threatLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    activeThreats: number
    failedLoginAttempts: number
  }
}

interface SystemAlert {
  id: string
  type: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  title: string
  message: string
  timestamp: string
  component: string
  resolved: boolean
}

// Mock API functions
const fetchSystemMetrics = async (): Promise<SystemMetrics> => {
  return {
    serverHealth: {
    status: 'HEALTHY',
      uptime: 2592000, // 30 days in seconds
      cpu: 35.2,
      memory: 67.8,
      disk: 23.4,
      network: 12.7
    },
    databaseHealth: {
      status: 'HEALTHY',
      connections: 45,
      maxConnections: 100,
      queryTime: 23.5,
      cacheHitRate: 94.2
    },
    applicationMetrics: {
      activeUsers: 234,
      requestsPerMinute: 1567,
      errorRate: 0.8,
      responseTime: 145,
      sessionsActive: 89
    },
    gameMetrics: {
      challengesCompleted: 156,
      meritsAwarded: 2340,
      marketplaceTransactions: 89,
      studyRoomsActive: 12,
      notificationsSent: 567
    },
    security: {
      status: 'SECURE',
      lastSecurityScan: '2024-01-15T02:00:00Z',
      threatLevel: 'LOW',
      activeThreats: 0,
      failedLoginAttempts: 3
    }
  }
}

const fetchSystemAlerts = async (): Promise<SystemAlert[]> => {
  return [
      {
        id: '1',
        type: 'WARNING',
      title: 'Alto uso de memoria en servidor principal',
      message: 'El uso de memoria ha superado el 65% durante los últimos 15 minutos',
      timestamp: '2024-01-15T14:30:00Z',
      component: 'SERVER',
        resolved: false
      },
      {
        id: '2',
        type: 'INFO',
      title: 'Actualización de seguridad completada',
      message: 'Se han aplicado exitosamente las últimas actualizaciones de seguridad del sistema',
      timestamp: '2024-01-15T02:15:00Z',
      component: 'SECURITY',
        resolved: true
      },
      {
        id: '3',
      type: 'ERROR',
      title: 'Fallo temporal en servicio de notificaciones',
      message: 'El servicio de notificaciones experimentó una interrupción de 2 minutos',
      timestamp: '2024-01-14T18:45:00Z',
      component: 'NOTIFICATIONS',
      resolved: true
    }
  ]
}

export const MonitoringPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: fetchSystemMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: alerts = [] } = useQuery({
    queryKey: ['system-alerts'],
    queryFn: fetchSystemAlerts,
    refetchInterval: 60000, // Refresh every minute
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
      case 'SECURE': return '#10B981'
      case 'WARNING': return '#F59E0B'
      case 'CRITICAL':
      case 'VULNERABLE': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'INFO': return <SuccessIcon sx={{ color: '#3B82F6' }} />
      case 'WARNING': return <WarningIcon sx={{ color: '#F59E0B' }} />
      case 'ERROR': return <ErrorIcon sx={{ color: '#EF4444' }} />
      case 'CRITICAL': return <ErrorIcon sx={{ color: '#DC2626' }} />
      default: return <SuccessIcon />
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  if (loadingMetrics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#CDAB5A' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
          <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#CDAB5A' }} />
          Dashboard de Monitoreo CoomÜnity
        </Typography>
        <Box textAlign="right">
          <Typography variant="h6" sx={{ color: '#CDAB5A', fontWeight: 'bold' }}>
            {currentTime.toLocaleTimeString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentTime.toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* System Status Overview */}
      {metrics && (
        <>
          <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(205, 171, 90, 0.15)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                        Servidor
              </Typography>
                      <Typography variant="body2" sx={{ color: getStatusColor(metrics.serverHealth.status) }}>
                        {metrics.serverHealth.status}
                      </Typography>
                    </Box>
                    <ServerIcon sx={{ color: getStatusColor(metrics.serverHealth.status), fontSize: 32 }} />
                      </Box>
                  <Typography variant="caption" color="text.secondary">
                    Uptime: {formatUptime(metrics.serverHealth.uptime)}
                          </Typography>
                  </CardContent>
                </Card>
              </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                        Base de Datos
                    </Typography>
                      <Typography variant="body2" sx={{ color: getStatusColor(metrics.databaseHealth.status) }}>
                        {metrics.databaseHealth.status}
                      </Typography>
                    </Box>
                    <DatabaseIcon sx={{ color: getStatusColor(metrics.databaseHealth.status), fontSize: 32 }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Conexiones: {metrics.databaseHealth.connections}/{metrics.databaseHealth.maxConnections}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                        Seguridad
                      </Typography>
                      <Typography variant="body2" sx={{ color: getStatusColor(metrics.security.status) }}>
                        {metrics.security.status}
                      </Typography>
                    </Box>
                    <SecurityIcon sx={{ color: getStatusColor(metrics.security.status), fontSize: 32 }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Amenazas: {metrics.security.activeThreats}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#2C2C2C' }}>
                        Usuarios Activos
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#CDAB5A' }}>
                        {metrics.applicationMetrics.activeUsers}
                      </Typography>
                    </Box>
                    <UsersIcon sx={{ color: '#CDAB5A', fontSize: 32 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            </Grid>

          {/* Resource Usage */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#CDAB5A', mb: 2 }}>
                    Uso de Recursos del Servidor
                    </Typography>
                  <Stack spacing={2}>
                    <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">CPU</Typography>
                        <Typography variant="body2" fontWeight="bold">{metrics.serverHealth.cpu}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                        value={metrics.serverHealth.cpu} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: metrics.serverHealth.cpu > 80 ? '#EF4444' : '#CDAB5A'
                          }
                        }} 
                      />
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Memoria</Typography>
                        <Typography variant="body2" fontWeight="bold">{metrics.serverHealth.memory}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={metrics.serverHealth.memory} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: metrics.serverHealth.memory > 80 ? '#EF4444' : '#10B981'
                          }
                        }} 
                      />
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Disco</Typography>
                        <Typography variant="body2" fontWeight="bold">{metrics.serverHealth.disk}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={metrics.serverHealth.disk} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#3B82F6'
                          }
                        }} 
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#CDAB5A', mb: 2 }}>
                    Métricas de la Aplicación
                    </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Requests/min:</Typography>
                      <Typography variant="body2" fontWeight="bold">{metrics.applicationMetrics.requestsPerMinute}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Tiempo de respuesta:</Typography>
                      <Typography variant="body2" fontWeight="bold">{metrics.applicationMetrics.responseTime}ms</Typography>
                  </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Tasa de error:</Typography>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: metrics.applicationMetrics.errorRate > 1 ? '#EF4444' : '#10B981' }}>
                        {metrics.applicationMetrics.errorRate}%
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Sesiones activas:</Typography>
                      <Typography variant="body2" fontWeight="bold">{metrics.applicationMetrics.sessionsActive}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            </Grid>

          {/* Gamification Metrics */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#CDAB5A', mb: 2 }}>
                    Métricas del Sistema de Gamificación CoomÜnity
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Box textAlign="center" sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#CDAB5A' }}>
                          {metrics.gameMetrics.challengesCompleted}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Desafíos Completados
                    </Typography>
                  </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Box textAlign="center" sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#10B981' }}>
                          {metrics.gameMetrics.meritsAwarded}
                      </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Méritos Otorgados
                          </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Box textAlign="center" sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#3B82F6' }}>
                          {metrics.gameMetrics.marketplaceTransactions}
                          </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Transacciones GMP
                          </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Box textAlign="center" sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#8B5CF6' }}>
                          {metrics.gameMetrics.studyRoomsActive}
                      </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Salas de Estudio
                          </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                      <Box textAlign="center" sx={{ p: 2, backgroundColor: '#F8F9FA', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#F59E0B' }}>
                          {metrics.gameMetrics.notificationsSent}
                          </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Notificaciones
                          </Typography>
                        </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* System Alerts */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#CDAB5A', mb: 2 }}>
            Alertas del Sistema
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Componente</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.slice(0, 5).map((alert) => (
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
                      <Typography variant="body2" fontWeight="bold">
                        {alert.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={alert.component} 
                        size="small" 
                        variant="outlined"
                        sx={{ borderRadius: 1.5 }}
                      />
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
                        color={alert.resolved ? 'success' : 'warning'}
                        sx={{ borderRadius: 1.5 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
                </CardContent>
              </Card>
    </Box>
  )
}

export default MonitoringPage 