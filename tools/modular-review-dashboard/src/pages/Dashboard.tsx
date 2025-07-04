import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useLatestReport, useAlerts } from '../hooks/useReportData';

type ModuleStatus = 'healthy' | 'warning' | 'critical';

interface ModuleData {
  id: string;
  name: string;
  issues: number;
  criticalIssues: number;
  status: ModuleStatus;
}

const Dashboard: React.FC = () => {
  const { data: report, isLoading, error } = useLatestReport();
  const { alerts } = useAlerts();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando datos del dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error cargando datos: {error.message}
      </Alert>
    );
  }

  if (!report) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        No hay datos de reportes disponibles
      </Alert>
    );
  }

  // Transform report data to ModuleData format
  const modules: ModuleData[] = report.results.map((module) => {
    const criticalIssues = module.summary.severityBreakdown.Error || 0;
    const warningIssues = module.summary.severityBreakdown.Warning || 0;
    const totalIssues = module.summary.totalIssues;

    let status: ModuleStatus = 'healthy';
    if (criticalIssues > 0) {
      status = 'critical';
    } else if (warningIssues > 3 || totalIssues > 10) {
      status = 'warning';
    }

    return {
      id: module.module,
      name: module.moduleName,
      issues: totalIssues,
      criticalIssues,
      status,
    };
  });

  const getStatusColor = (status: ModuleStatus): string => {
    switch (status) {
      case 'healthy':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'critical':
        return 'error.main';
    }
  };

  const getProgressValue = (issues: number, max: number = 20): number => {
    return Math.min((issues / max) * 100, 100);
  };

  const getProgressColor = (
    status: ModuleStatus
  ): 'error' | 'warning' | 'primary' => {
    if (status === 'critical') return 'error';
    if (status === 'warning') return 'warning';
    return 'primary';
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Dashboard Principal
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Resumen general del estado de todos los módulos analizados por Gemini AI
      </Typography>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {alerts.slice(0, 3).map((alert) => (
            <Alert
              key={alert.id}
              severity={alert.type}
              sx={{ mb: 1 }}
              onClose={() => {}}
            >
              <Typography variant="body2">
                <strong>{alert.module ? `[${alert.module}] ` : ''}</strong>
                {alert.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </Typography>
            </Alert>
          ))}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Total Issues
              </Typography>
              <Typography variant="h3" component="div" color="primary.main">
                {report.summary.totalIssues}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En {report.results.length} módulos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Issues Críticos
              </Typography>
              <Typography variant="h3" component="div" color="error.main">
                {report.summary.severityBreakdown.Error || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requieren atención inmediata
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Módulos Saludables
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                {modules.filter((m) => m.status === 'healthy').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                De {report.results.length} módulos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Última Revisión
              </Typography>
              <Typography variant="h5" component="div">
                {new Date(report.timestamp).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(report.timestamp).toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Module Status Cards */}
        {modules.map((module) => (
          <Grid item xs={12} md={6} lg={4} key={module.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" component="div">
                    {module.name}
                  </Typography>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(module.status),
                    }}
                  />
                </Box>

                <Typography variant="h4" component="div" gutterBottom>
                  {module.issues}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Issues encontrados
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={getProgressValue(module.issues)}
                  sx={{ mb: 1 }}
                  color={getProgressColor(module.status)}
                />

                {module.criticalIssues > 0 && (
                  <Typography variant="body2" color="error.main">
                    {module.criticalIssues} críticos
                  </Typography>
                )}

                {module.criticalIssues === 0 && (
                  <Typography variant="body2" color="success.main">
                    Sin issues críticos
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
