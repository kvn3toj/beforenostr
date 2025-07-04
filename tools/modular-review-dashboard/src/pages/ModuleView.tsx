import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Alert,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Lightbulb as SuggestionIcon,
  Code as CodeIcon,
  Timeline as TrendIcon,
} from '@mui/icons-material';
import { useModuleDetail } from '../hooks/useReportData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`module-tabpanel-${index}`}
      aria-labelledby={`module-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ModuleView: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  const {
    data: moduleData,
    isLoading,
    error,
  } = useModuleDetail(moduleId?.toUpperCase() || '');

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
          Cargando datos del módulo...
        </Typography>
      </Box>
    );
  }

  if (error || !moduleData) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Volver al Dashboard
        </Button>
        <Alert severity="error">
          {error?.message || `Módulo ${moduleId} no encontrado`}
        </Alert>
      </Box>
    );
  }

  // Use real module data from the hook, with fallback for development
  const currentModuleData = moduleData || {
    module: moduleId?.toUpperCase() || 'HOME',
    moduleName: 'Home Dashboard',
    description: 'Página principal y dashboard del usuario',
    priority: 'high' as const,
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: 8,
      totalIssues: 15,
      filesWithIssues: 5,
      severityBreakdown: {
        Error: 3,
        Warning: 6,
        Suggestion: 4,
        Info: 2,
      },
      categoryBreakdown: {
        Performance: 4,
        Security: 2,
        Accessibility: 3,
        'Code Quality': 3,
        Architecture: 2,
        Philosophy: 1,
        'Best Practices': 2,
      },
    },
    results: [
      {
        file: 'Demo/apps/superapp-unified/src/pages/Home.tsx',
        language: 'typescript',
        issues: [
          {
            line_number: 45,
            severity: 'Error',
            message: 'Missing error boundary wrapper',
            recommendation: 'Agregar <ErrorBoundary> como componente padre',
            category: 'Security',
          },
          {
            line_number: 67,
            severity: 'Warning',
            message: 'Large bundle size detected in this component',
            recommendation: 'Implementar lazy loading para componentes pesados',
            category: 'Performance',
          },
        ],
      },
      {
        file: 'Demo/apps/superapp-unified/src/components/modules/home/HomeStats.tsx',
        language: 'typescript',
        issues: [
          {
            line_number: 23,
            severity: 'Suggestion',
            message: 'Función puede ser simplificada usando destructuring',
            recommendation:
              'Refactorizar usando const { prop1, prop2 } = props',
            category: 'Code Quality',
          },
        ],
      },
    ],
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Error':
        return <ErrorIcon color="error" />;
      case 'Warning':
        return <WarningIcon color="warning" />;
      case 'Info':
        return <InfoIcon color="info" />;
      case 'Suggestion':
        return <SuggestionIcon color="success" />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverityColor = (
    severity: string
  ): 'error' | 'warning' | 'info' | 'success' => {
    switch (severity) {
      case 'Error':
        return 'error';
      case 'Warning':
        return 'warning';
      case 'Info':
        return 'info';
      case 'Suggestion':
        return 'success';
      default:
        return 'info';
    }
  };

  const getPriorityColor = (
    priority: string
  ): 'error' | 'warning' | 'success' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          variant="outlined"
        >
          Volver al Dashboard
        </Button>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" fontWeight={600}>
            {currentModuleData.moduleName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentModuleData.description}
          </Typography>
        </Box>
        <Chip
          label={`Prioridad: ${currentModuleData.priority}`}
          color={getPriorityColor(currentModuleData.priority)}
          variant="outlined"
        />
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {currentModuleData.summary.totalIssues}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Issues
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {currentModuleData.summary.totalFiles}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Archivos Analizados
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" component="div" color="error.main">
              {currentModuleData.summary.severityBreakdown.Error}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Errores Críticos
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {currentModuleData.summary.filesWithIssues}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Archivos con Issues
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Issues por Archivo" icon={<CodeIcon />} />
          <Tab label="Resumen por Categoría" icon={<TrendIcon />} />
          <Tab label="Distribución de Severidad" icon={<InfoIcon />} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={currentTab} index={0}>
        <Typography variant="h6" gutterBottom>
          Issues Detallados por Archivo
        </Typography>

        {(Array.isArray(currentModuleData.results)
          ? currentModuleData.results
          : []
        ).map((file, index) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%',
                }}
              >
                <CodeIcon color="primary" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {file.file.split('/').pop()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {file.file}
                  </Typography>
                </Box>
                <Chip
                  label={`${file.issues.length} issues`}
                  size="small"
                  color={
                    file.issues.length > 3
                      ? 'error'
                      : file.issues.length > 1
                        ? 'warning'
                        : 'success'
                  }
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {file.issues.map((issue, issueIndex) => (
                  <ListItem key={issueIndex} divider>
                    <ListItemIcon>
                      {getSeverityIcon(issue.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">
                            Línea {issue.line_number}
                          </Typography>
                          <Chip
                            label={issue.severity}
                            size="small"
                            color={getSeverityColor(issue.severity)}
                          />
                          <Chip
                            label={issue.category}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Problema:</strong> {issue.message}
                          </Typography>
                          <Alert severity="info" sx={{ mt: 1 }}>
                            <strong>Recomendación:</strong>{' '}
                            {issue.recommendation}
                          </Alert>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Typography variant="h6" gutterBottom>
          Distribución por Categorías
        </Typography>

        <Stack spacing={2}>
          {Object.entries(currentModuleData.summary.categoryBreakdown).map(
            ([category, count]) => (
              <Card key={category}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle1">{category}</Typography>
                    <Chip
                      label={count}
                      color={
                        count > 3 ? 'error' : count > 1 ? 'warning' : 'success'
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            )
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Typography variant="h6" gutterBottom>
          Distribución por Severidad
        </Typography>

        <Stack spacing={2}>
          {Object.entries(currentModuleData.summary.severityBreakdown).map(
            ([severity, count]) => (
              <Card key={severity}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSeverityIcon(severity)}
                      <Typography variant="subtitle1">{severity}</Typography>
                    </Box>
                    <Chip label={count} color={getSeverityColor(severity)} />
                  </Box>
                </CardContent>
              </Card>
            )
          )}
        </Stack>
      </TabPanel>
    </Box>
  );
};

export default ModuleView;
