import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Code as CodeIcon,
  GitHub as GitHubIcon,
  Chat as SlackIcon,
} from '@mui/icons-material';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SettingsView: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [settings, setSettings] = useState({
    notifications: {
      emailEnabled: true,
      slackEnabled: false,
      discordEnabled: false,
      criticalIssuesOnly: false,
      dailyReports: true,
    },
    thresholds: {
      criticalErrors: 5,
      warningErrors: 10,
      totalIssues: 50,
    },
    scanning: {
      autoScan: true,
      scanInterval: '24',
      includeTests: false,
      includeNodeModules: false,
    },
    integrations: {
      githubToken: '',
      slackWebhook: '',
      discordWebhook: '',
    },
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Aquí se guardarían las configuraciones en el backend
    console.log('Saving settings:', settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = (service: string) => {
    console.log(`Testing connection to ${service}...`);
    // Aquí se probaría la conexión
  };

  const excludedPaths = [
    'node_modules/**/*',
    'dist/**/*',
    '*.test.ts',
    '*.spec.ts',
    'coverage/**/*',
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Configuración del Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Personaliza las alertas, umbrales y integraciones del revisor de
          código
        </Typography>
      </Box>

      {/* Success Alert */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuración guardada exitosamente
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Notificaciones" icon={<NotificationsIcon />} />
          <Tab label="Umbrales" icon={<SecurityIcon />} />
          <Tab label="Escaneo" icon={<CodeIcon />} />
          <Tab label="Integraciones" icon={<GitHubIcon />} />
        </Tabs>
      </Box>

      {/* Notifications Settings */}
      <TabPanel value={currentTab} index={0}>
        <Card>
          <CardHeader
            title="Configuración de Notificaciones"
            subheader="Configura cómo y cuándo recibir alertas sobre issues"
          />
          <CardContent>
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.emailEnabled}
                    onChange={(e) =>
                      handleSettingChange(
                        'notifications',
                        'emailEnabled',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Notificaciones por Email"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.slackEnabled}
                    onChange={(e) =>
                      handleSettingChange(
                        'notifications',
                        'slackEnabled',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Notificaciones por Slack"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.discordEnabled}
                    onChange={(e) =>
                      handleSettingChange(
                        'notifications',
                        'discordEnabled',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Notificaciones por Discord"
              />

              <Divider />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.criticalIssuesOnly}
                    onChange={(e) =>
                      handleSettingChange(
                        'notifications',
                        'criticalIssuesOnly',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Solo errores críticos"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.dailyReports}
                    onChange={(e) =>
                      handleSettingChange(
                        'notifications',
                        'dailyReports',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Reportes diarios automáticos"
              />
            </Stack>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Thresholds Settings */}
      <TabPanel value={currentTab} index={1}>
        <Card>
          <CardHeader
            title="Umbrales de Alerta"
            subheader="Define los límites que activarán las alertas automáticas"
          />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="Errores críticos máximos"
                type="number"
                value={settings.thresholds.criticalErrors}
                onChange={(e) =>
                  handleSettingChange(
                    'thresholds',
                    'criticalErrors',
                    parseInt(e.target.value)
                  )
                }
                helperText="Alerta cuando se supere este número de errores críticos"
                InputProps={{
                  endAdornment: (
                    <Chip label="errors" size="small" color="error" />
                  ),
                }}
              />

              <TextField
                label="Advertencias máximas"
                type="number"
                value={settings.thresholds.warningErrors}
                onChange={(e) =>
                  handleSettingChange(
                    'thresholds',
                    'warningErrors',
                    parseInt(e.target.value)
                  )
                }
                helperText="Alerta cuando se supere este número de advertencias"
                InputProps={{
                  endAdornment: (
                    <Chip label="warnings" size="small" color="warning" />
                  ),
                }}
              />

              <TextField
                label="Issues totales máximos"
                type="number"
                value={settings.thresholds.totalIssues}
                onChange={(e) =>
                  handleSettingChange(
                    'thresholds',
                    'totalIssues',
                    parseInt(e.target.value)
                  )
                }
                helperText="Alerta cuando se supere este número total de issues"
                InputProps={{
                  endAdornment: (
                    <Chip label="issues" size="small" color="primary" />
                  ),
                }}
              />

              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Filosofía CoomÜnity:</strong> Los umbrales están
                  configurados para promover código de calidad que refleje
                  nuestros valores de excelencia y cuidado mutuo.
                </Typography>
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Scanning Settings */}
      <TabPanel value={currentTab} index={2}>
        <Stack spacing={3}>
          <Card>
            <CardHeader
              title="Configuración de Escaneo"
              subheader="Configura cómo y cuándo se ejecutan los análisis de código"
            />
            <CardContent>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.scanning.autoScan}
                      onChange={(e) =>
                        handleSettingChange(
                          'scanning',
                          'autoScan',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Escaneo automático"
                />

                <FormControl fullWidth>
                  <InputLabel>Intervalo de escaneo</InputLabel>
                  <Select
                    value={settings.scanning.scanInterval}
                    label="Intervalo de escaneo"
                    onChange={(e) =>
                      handleSettingChange(
                        'scanning',
                        'scanInterval',
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="6">Cada 6 horas</MenuItem>
                    <MenuItem value="12">Cada 12 horas</MenuItem>
                    <MenuItem value="24">Diario</MenuItem>
                    <MenuItem value="168">Semanal</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.scanning.includeTests}
                      onChange={(e) =>
                        handleSettingChange(
                          'scanning',
                          'includeTests',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Incluir archivos de test"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.scanning.includeNodeModules}
                      onChange={(e) =>
                        handleSettingChange(
                          'scanning',
                          'includeNodeModules',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Incluir node_modules (no recomendado)"
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Rutas Excluidas"
              subheader="Archivos y directorios que no se analizarán"
            />
            <CardContent>
              <List>
                {excludedPaths.map((path, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={path}
                      secondary="Excluido del análisis"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => setOpenDialog(true)}
              >
                Agregar ruta
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      {/* Integrations Settings */}
      <TabPanel value={currentTab} index={3}>
        <Stack spacing={3}>
          <Card>
            <CardHeader
              title="GitHub Integration"
              subheader="Conecta con GitHub para análisis automático de PRs"
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="GitHub Personal Access Token"
                  type="password"
                  value={settings.integrations.githubToken}
                  onChange={(e) =>
                    handleSettingChange(
                      'integrations',
                      'githubToken',
                      e.target.value
                    )
                  }
                  helperText="Token para acceder a la API de GitHub"
                />
                <Button
                  variant="outlined"
                  onClick={() => handleTestConnection('GitHub')}
                  disabled={!settings.integrations.githubToken}
                >
                  Probar Conexión
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Slack Integration"
              subheader="Recibe notificaciones en tu workspace de Slack"
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Slack Webhook URL"
                  value={settings.integrations.slackWebhook}
                  onChange={(e) =>
                    handleSettingChange(
                      'integrations',
                      'slackWebhook',
                      e.target.value
                    )
                  }
                  helperText="URL del webhook de Slack para notificaciones"
                />
                <Button
                  variant="outlined"
                  startIcon={<SlackIcon />}
                  onClick={() => handleTestConnection('Slack')}
                  disabled={!settings.integrations.slackWebhook}
                >
                  Probar Conexión
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Discord Integration"
              subheader="Recibe notificaciones en tu servidor de Discord"
            />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Discord Webhook URL"
                  value={settings.integrations.discordWebhook}
                  onChange={(e) =>
                    handleSettingChange(
                      'integrations',
                      'discordWebhook',
                      e.target.value
                    )
                  }
                  helperText="URL del webhook de Discord para notificaciones"
                />
                <Button
                  variant="outlined"
                  onClick={() => handleTestConnection('Discord')}
                  disabled={!settings.integrations.discordWebhook}
                >
                  Probar Conexión
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          size="large"
        >
          Guardar Configuración
        </Button>
      </Box>

      {/* Add Path Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Agregar Ruta Excluida</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ruta o patrón"
            fullWidth
            variant="outlined"
            placeholder="ej: *.test.ts o src/temp/**/*"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsView;
